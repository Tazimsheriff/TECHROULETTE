#!/usr/bin/env python3
"""
FreshVault Twin - Wokwi ESP32 Serial & Network Gateway Bridge
============================================================
Connects the WOKWI virtual/physical ESP32 simulation running `sketch.ino`
to the FreshVault Twin digital twin backend.

Usage:
  1. Simulated Mode (no hardware/Wokwi CLI needed, replicates sketch.ino loop):
     python backend/wokwi_bridge.py --simulate

  2. Live Serial Mode (reads from physical USB or virtual COM port at 115200 baud):
     python backend/wokwi_bridge.py --port COM3 --baud 115200

  3. Pipe Mode (reads JSON from stdin / Wokwi CLI):
     wokwi-cli . | python backend/wokwi_bridge.py --stdin
"""

import sys
import time
import json
import random
import argparse
import urllib.request
import urllib.error
from datetime import datetime

DEFAULT_BACKEND_URL = "http://127.0.0.1:8000/api/wokwi/telemetry"

def post_telemetry(url: str, payload: dict) -> bool:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=2.0) as response:
            return response.status == 200
    except urllib.error.URLError as e:
        print(f"\033[91m[Bridge Error] Failed to reach backend at {url}: {e.reason}\033[0m")
        return False
    except Exception as e:
        print(f"\033[91m[Bridge Error] Unexpected error: {e}\033[0m")
        return False


def run_serial_mode(port: str, baud: int, backend_url: str):
    try:
        import serial
    except ImportError:
        print("\033[91mError: 'pyserial' package is required for direct serial connection.\033[0m")
        print("Install it via: pip install pyserial")
        sys.exit(1)

    print(f"\033[92m[FreshVault Wokwi Bridge] Connecting to {port} @ {baud} baud...\033[0m")
    try:
        ser = serial.Serial(port, baud, timeout=1.0)
    except Exception as e:
        print(f"\033[91mCould not open serial port {port}: {e}\033[0m")
        sys.exit(1)

    print(f"\033[96m[FreshVault Wokwi Bridge] Listening for JSON payloads from ESP32 -> {backend_url}\033[0m")
    while True:
        try:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            if not line:
                continue
            if line.startswith("{") and line.endswith("}"):
                try:
                    payload = json.loads(line)
                    success = post_telemetry(backend_url, payload)
                    status_icon = "✓" if success else "✗"
                    temp = payload.get("roomTemperatureEffective", "?")
                    risk = payload.get("risk", "SAFE")
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] {status_icon} Temp: {temp}°C | Risk: {risk} | Solar: {payload.get('solarWatts', '?')}W")
                except json.JSONDecodeError:
                    pass
        except KeyboardInterrupt:
            print("\n[Bridge] Stopping serial listener.")
            break
        except Exception as e:
            print(f"[Bridge Error] {e}")
            time.sleep(0.5)


def run_stdin_mode(backend_url: str):
    print(f"\033[92m[FreshVault Wokwi Bridge] Reading JSON lines from STDIN -> {backend_url}\033[0m")
    for line in sys.stdin:
        line = line.strip()
        if line.startswith("{") and line.endswith("}"):
            try:
                payload = json.loads(line)
                post_telemetry(backend_url, payload)
                temp = payload.get("roomTemperatureEffective", "?")
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Ingested from STDIN: Temp={temp}°C")
            except Exception as e:
                pass


def run_simulation_mode(backend_url: str):
    """
    Executes the exact state machine and sensory equations of WOKWI sketch.ino:
    - DHT22 (room temp/humidity)
    - DS18B20 (product pulp temp)
    - Solar PV generation & battery charge/discharge
    - Door open (+2.5°C thermal infiltration)
    - Refrigeration fault (+5.0°C and cooling disabled)
    - Kinetic freshness quality score decay
    """
    import threading

    state = {
        "roomTemperatureRaw": 6.0,
        "humidity": 85.0,
        "productTemperatureRaw": 6.1,
        "productTemperatureEffective": 6.1,
        "solarWatts": 320.0,
        "batteryPercent": 85.0,
        "solarDrop": False,
        "doorOpen": False,
        "refrigerationFault": False,
        "coolingOn": True,
        "qualityScore": 100.0,
        "shelfLifeDays": 100.0 / 15.0,
        "exposureMinutes": 0.0,
        "storageAgeHours": 6.0,
        "running": True
    }

    state["buzzerActive"] = False

    def print_menu():
        print("\n" + "=" * 64)
        print("  FRESHVAULT TWIN - WOKWI ESP32 SENSOR EMULATOR GATEWAY")
        print("=" * 64)
        print("  Controls:")
        print("    [d]     + Enter : Toggle Chamber Door (Open/Closed) -> Beeps while open")
        print("    [d+f]   + Enter : Door Open + Cooling Fault -> Continuous Alarm Beep")
        print("    [f]     + Enter : Toggle Compressor Refrigeration Fault")
        print("    [s]     + Enter : Toggle Solar Irradiance Drop (Cloud/Night)")
        print("    [stop]  + Enter : Stop / Mute active buzzer alarm")
        print("    [r]     + Enter : Reset all conditions to nominal (Stops alarm)")
        print("    [q]     + Enter : Quit simulation")
        print("=" * 64 + "\n")

    print_menu()

    # Dedicated continuous terminal audio buzzer thread (GPIO 18 Buzzer Emulation)
    def buzzer_thread():
        try:
            import winsound
            has_winsound = True
        except ImportError:
            has_winsound = False

        toggle_freq = False
        while state["running"]:
            # Beep continuously as long as door is open, refrigeration fault, or buzzerActive
            should_beep = state["doorOpen"] or state["buzzerActive"] or state["refrigerationFault"]
            if should_beep:
                freq = 880 if toggle_freq else 660
                toggle_freq = not toggle_freq
                if has_winsound:
                    try:
                        winsound.Beep(freq, 220)
                    except Exception:
                        sys.stdout.write('\a')
                        sys.stdout.flush()
                else:
                    sys.stdout.write('\a')
                    sys.stdout.flush()
                time.sleep(0.18)
            else:
                time.sleep(0.1)

    audio_buzzer = threading.Thread(target=buzzer_thread, daemon=True)
    audio_buzzer.start()

    def input_thread():
        while state["running"]:
            try:
                raw = sys.stdin.readline()
                if not raw:
                    break
                cmd = raw.strip().lower()
                
                # Handle d+f or df compound trigger
                if cmd in ['d+f', 'df', 'd f', 'fd', 'f+d', 'f d']:
                    state["doorOpen"] = True
                    state["refrigerationFault"] = True
                    state["buzzerActive"] = True
                    print(f"\n\033[91m>>> [ALARM TRIGGER] DOOR OPEN + COOLING FAULT ACTIVATED!\033[0m")
                    print(f"\033[93m>>> [BUZZER ACTIVE] Continuous alarm beeping (GPIO 18)... Type 'd', 'stop', or 'r' to stop it.\033[0m")
                elif cmd == 'd':
                    state["doorOpen"] = not state["doorOpen"]
                    if state["doorOpen"]:
                        state["buzzerActive"] = True
                        print(f"\n\033[93m>>> [BUTTON TRIGGER] Chamber Door OPENED!\033[0m")
                        print(f"\033[91m>>> [BUZZER ACTIVE] Continuous door open alarm beeping... Type 'd' or 'stop' to close door and stop beep.\033[0m")
                    else:
                        state["buzzerActive"] = False
                        print(f"\n\033[92m>>> [BUTTON TRIGGER] Chamber Door CLOSED. Buzzer stopped.\033[0m")
                elif cmd == 'f':
                    state["refrigerationFault"] = not state["refrigerationFault"]
                    if state["refrigerationFault"]:
                        state["buzzerActive"] = True
                        print(f"\n\033[91m>>> [BUTTON TRIGGER] Compressor Fault INJECTED! Continuous buzzer alarm active.\033[0m")
                    else:
                        if not state["doorOpen"]:
                            state["buzzerActive"] = False
                    print(f"\n\033[91m>>> [BUTTON TRIGGER] Refrigeration Fault changed to: {state['refrigerationFault']}\033[0m")
                elif cmd == 's':
                    state["solarDrop"] = not state["solarDrop"]
                    print(f"\n\033[94m>>> [BUTTON TRIGGER] Solar Irradiance Drop changed to: {state['solarDrop']}\033[0m")
                elif cmd == 'r':
                    state["doorOpen"] = False
                    state["refrigerationFault"] = False
                    state["solarDrop"] = False
                    state["qualityScore"] = 100.0
                    state["shelfLifeDays"] = 100.0 / 15.0
                    state["exposureMinutes"] = 0.0
                    state["batteryPercent"] = 85.0
                    print(f"\n\033[92m>>> [RESET] Twin state restored to nominal storage conditions. Beep stopped.\033[0m")
                elif cmd == 'q':
                    state["running"] = False
                    break
            except Exception:
                break

    listener = threading.Thread(target=input_thread, daemon=True)
    listener.start()

    last_time = time.time()
    while state["running"]:
        time.sleep(2.0)
        now = time.time()
        dt = now - last_time
        last_time = now

        # Battery & solar logic matching sketch.ino lines 140-150
        if state["solarDrop"]:
            state["solarWatts"] = float(random.randint(40, 100))
            state["batteryPercent"] -= 0.15
            if state["coolingOn"]:
                state["batteryPercent"] -= 0.10
        else:
            state["solarWatts"] = float(random.randint(280, 410))
            state["batteryPercent"] += 0.05
        state["batteryPercent"] = max(0.0, min(100.0, state["batteryPercent"]))

        # Cooling logic matching sketch.ino line 153
        state["coolingOn"] = (not state["refrigerationFault"]) and (state["batteryPercent"] >= 10.0)

        # Thermal physics matching sketch.ino lines 127-138
        room_effective = state["roomTemperatureRaw"]
        if state["doorOpen"]:
            room_effective += 2.5
        if state["refrigerationFault"]:
            room_effective += 5.0
        if state["batteryPercent"] < 10.0:
            room_effective += 4.0
        room_effective = max(0.0, min(35.0, room_effective))

        target_product = max(0.0, min(35.0, state["productTemperatureRaw"] + max(0.0, room_effective - state["productTemperatureRaw"]) * 0.35))
        state["productTemperatureEffective"] += (target_product - state["productTemperatureEffective"]) * 0.25

        # Risk calculation matching sketch.ino lines 156-170
        if room_effective > 12.0 or (not state["coolingOn"]) or state["refrigerationFault"] or state["batteryPercent"] < 10.0:
            risk = "CRITICAL"
        elif room_effective <= 8.0 and state["humidity"] <= 90.0 and state["batteryPercent"] > 30.0 and state["coolingOn"] and not state["doorOpen"] and not state["refrigerationFault"]:
            risk = "SAFE"
        else:
            risk = "WARNING"

        # Quality calculation matching sketch.ino lines 172-186
        sim_minutes = dt * 1.5
        state["storageAgeHours"] += sim_minutes / 60.0
        if risk == "WARNING":
            state["exposureMinutes"] += sim_minutes
        elif risk == "CRITICAL":
            state["exposureMinutes"] += sim_minutes * 2.0

        temp_penalty = max(0.0, room_effective - 8.0) * 3.0
        hum_penalty = max(0.0, state["humidity"] - 90.0) * 0.5
        time_penalty = state["exposureMinutes"] * 0.04
        state["qualityScore"] = max(0.0, min(100.0, 100.0 - temp_penalty - hum_penalty - time_penalty))
        state["shelfLifeDays"] = state["qualityScore"] / 15.0

        # Recommendation matching sketch.ino lines 80-94
        if risk == "CRITICAL":
            if state["refrigerationFault"]:
                rec = "Cooling fault: inspect batch"
            elif state["batteryPercent"] < 10.0:
                rec = "Battery critical: arrange backup"
            else:
                rec = "High temp: isolate and inspect"
        elif state["doorOpen"]:
            rec = "Close door and monitor"
        elif 10.0 <= state["batteryPercent"] <= 30.0:
            rec = "Conserve power, dispatch soon"
        elif room_effective > 8.0 or state["humidity"] > 90.0:
            rec = "Restore cooling / Dispatch soon"
        else:
            rec = "Maintain storage"

        payload = {
            "timestampMillis": int(time.time() * 1000),
            "roomTemperatureRaw": state["roomTemperatureRaw"],
            "roomTemperatureEffective": round(room_effective, 1),
            "humidity": round(state["humidity"], 1),
            "productTemperatureRaw": state["productTemperatureRaw"],
            "productTemperatureEffective": round(state["productTemperatureEffective"], 1),
            "solarWatts": round(state["solarWatts"], 1),
            "batteryPercent": round(state["batteryPercent"], 1),
            "solarDrop": state["solarDrop"],
            "doorOpen": state["doorOpen"],
            "refrigerationFault": state["refrigerationFault"],
            "coolingOn": state["coolingOn"],
            "refrigerationHealth": "FAULT" if state["refrigerationFault"] else "HEALTHY",
            "risk": risk,
            "batchId": "TOM-101",
            "crop": "Tomato",
            "quantityKg": 35.0,
            "storageAgeHours": round(state["storageAgeHours"], 2),
            "exposureMinutes": round(state["exposureMinutes"], 1),
            "qualityScore": round(state["qualityScore"], 1),
            "shelfLifeDays": round(state["shelfLifeDays"], 1),
            "recommendation": rec
        }

        success = post_telemetry(backend_url, payload)
        ok_str = "\033[92m[POST OK]\033[0m" if success else "\033[91m[POST FAIL]\033[0m"
        risk_color = "\033[92m" if risk == "SAFE" else ("\033[93m" if risk == "WARNING" else "\033[91m")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {ok_str} Room: {room_effective:.1f}°C | Food: {state['productTemperatureEffective']:.1f}°C | Hum: {state['humidity']:.0f}% | Solar: {state['solarWatts']:.0f}W | Batt: {state['batteryPercent']:.1f}% | Risk: {risk_color}{risk}\033[0m | Quality: {state['qualityScore']:.1f}%")

    print("[Bridge] Simulator terminated.")


def main():
    parser = argparse.ArgumentParser(description="FreshVault Twin - Wokwi ESP32 Hardware Bridge")
    parser.add_argument("--url", default=DEFAULT_BACKEND_URL, help="Backend telemetry URL (default: http://127.0.0.1:8000/api/wokwi/telemetry)")
    parser.add_argument("--port", help="Serial COM port (e.g. COM3 or /dev/ttyUSB0)")
    parser.add_argument("--baud", type=int, default=115200, help="Serial baud rate (default: 115200)")
    parser.add_argument("--stdin", action="store_true", help="Read JSON from stdin")
    parser.add_argument("--simulate", action="store_true", help="Run interactive virtual ESP32 simulator")

    args = parser.parse_args()

    if args.port:
        run_serial_mode(args.port, args.baud, args.url)
    elif args.stdin:
        run_stdin_mode(args.url)
    else:
        # Default to simulator mode if no port or stdin given
        run_simulation_mode(args.url)


if __name__ == "__main__":
    main()
