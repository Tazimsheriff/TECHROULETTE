# FreshVault Twin — WOKWI ESP32 Hardware Simulation

This directory contains the virtual hardware specification and ESP32 firmware for the **FreshVault Cold-Chain Digital Twin**, designed for simulation in [Wokwi](https://wokwi.com) and physical deployment on ESP32 development boards.

---

## 🛠️ Circuit & Sensor Specification

| Component | Pin / Bus | Function | Description |
|---|---|---|---|
| **ESP32-DevKit-v1** | Main MCU | IoT Edge Gateway | Runs kinetic monitoring loop, updates OLED, and serializes JSON |
| **DHT22** | GPIO 15 | Cold Room Ambient | Measures chamber air temperature and relative humidity |
| **DS18B20** | GPIO 4 | Food Core Pulp Probe | 1-Wire sensor measuring internal produce core pulp temperature (4.7kΩ pullup) |
| **SSD1306 OLED** | I2C (SDA=21, SCL=22) | Local SCADA Display | 128x64 monochrome OLED cycling 4 diagnostic screens (0x3C) |
| **Green LED** | GPIO 25 | SAFE Status | Lit when temperature & storage parameters are nominal (4.0 - 8.0°C) |
| **Yellow LED** | GPIO 26 | WARNING Status | Lit when door is open, solar is low, or temp drifts (8.1 - 12.0°C) |
| **Red LED** | GPIO 27 | CRITICAL Alarm | Flashes during compressor fault, temp spike (>12°C), or battery drop (<10%) |
| **Blue LED** | GPIO 23 | Chiller Active | Active when refrigeration compressor duty cycle is engaged |
| **Buzzer** | GPIO 18 | Audible Alarm | Pulses in sync with red LED during critical spoilage excursions |
| **Pushbutton 1** | GPIO 19 (Pullup) | Door Switch | Simulates chamber access door breach (adds +2.5°C infiltration) |
| **Pushbutton 2** | GPIO 32 (Pullup) | Cooling Fault | Simulates compressor thermal trip (stops cooling, adds +5.0°C) |
| **Pushbutton 3** | GPIO 33 (Pullup) | Solar Drop | Simulates monsoon cloud cover / night (solar collapses, draining battery) |

---

## 🚀 How to Run the Simulation

### Option 1: Live in Wokwi Web Simulator (Easiest)
1. Open [wokwi.com/projects/new/esp32](https://wokwi.com/projects/new/esp32).
2. Copy the contents of [`sketch.ino`](sketch.ino) into the sketch tab.
3. Switch to the `diagram.json` tab and paste the contents of [`diagram.json`](diagram.json).
4. Add the libraries listed in [`libraries.txt`](libraries.txt) (DHT sensor library for ESPx, DallasTemperature, OneWire, Adafruit SSD1306, Adafruit GFX, ArduinoJson).
5. Click **Start Simulation**.
6. The OLED will initialize and cycle diagnostic telemetry pages, while structured JSON is output over Serial at 115200 baud.

---

### Option 2: Live Gateway Bridge to FreshVault Twin
We provide a Python gateway bridge in `backend/wokwi_bridge.py` that connects the Wokwi simulation stream directly to the digital twin backend:

```bash
# Mode A: Virtual Simulator (Runs exact sketch.ino logic with interactive CLI controls)
python backend/wokwi_bridge.py --simulate

# Mode B: Physical or Virtual COM Port (115200 baud)
python backend/wokwi_bridge.py --port COM3 --baud 115200

# Mode C: Pipe output from Wokwi CLI
wokwi-cli . | python backend/wokwi_bridge.py --stdin
```

---

## 📡 Serial & Network Telemetry Schema

Every 2 seconds, the firmware transmits a structured JSON telemetry packet over Serial at 115200 baud to `POST /api/wokwi/telemetry`:

```json
{
  "timestampMillis": 14280,
  "roomTemperatureRaw": 6.0,
  "roomTemperatureEffective": 6.0,
  "humidity": 85.0,
  "productTemperatureRaw": 6.1,
  "productTemperatureEffective": 6.1,
  "solarWatts": 320.0,
  "batteryPercent": 85.0,
  "solarDrop": false,
  "doorOpen": false,
  "refrigerationFault": false,
  "coolingOn": true,
  "refrigerationHealth": "HEALTHY",
  "risk": "SAFE",
  "batchId": "TOM-101",
  "crop": "Tomato",
  "quantityKg": 35.0,
  "storageAgeHours": 6.0,
  "exposureMinutes": 0.0,
  "qualityScore": 100.0,
  "shelfLifeDays": 6.6,
  "recommendation": "Maintain storage"
}
```

This payload is ingested by the FastAPI backend, which recalculates Arrhenius biological decay, propagates changes to the 3D WebGL digital twin, and logs immutable audit records.
