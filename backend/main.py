import os
import sqlite3
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .models import TwinState, Batch, SensorPayload, SimulationRequest, TickRequest
from .engine import create_initial_state, evaluate_kinetics, get_initial_batches

app = FastAPI(
    title="FreshVault Twin API",
    description="Digital Twin Backend for Food Safety & Solar Cold Storage",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory single source of truth state
CURRENT_STATE: TwinState = create_initial_state()

DB_PATH = os.path.join(os.path.dirname(__file__), "freshvault.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS telemetry_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            temperature REAL,
            humidity REAL,
            solar_power REAL,
            battery_percent REAL,
            cooling_on INTEGER,
            door_open INTEGER,
            overall_risk TEXT,
            alert TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS audit_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            event_type TEXT,
            batch_id TEXT,
            details TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def log_telemetry(state: TwinState):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO telemetry_logs (
                timestamp, temperature, humidity, solar_power, battery_percent,
                cooling_on, door_open, overall_risk, alert
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            state.timestamp, state.temperature, state.humidity, state.solarPower,
            state.batteryPercent, 1 if state.coolingOn else 0, 1 if state.doorOpen else 0,
            state.overallRisk, state.activeAlert or ""
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Log error: {e}")

@app.get("/")
def read_root():
    return {
        "system": "FreshVault Twin API",
        "status": "Operational",
        "facility": CURRENT_STATE.facilityName,
        "temperature": CURRENT_STATE.temperature,
        "overallRisk": CURRENT_STATE.overallRisk,
        "docs": "/docs"
    }

@app.get("/api/twin", response_model=TwinState)
def get_twin_state():
    return CURRENT_STATE

@app.get("/api/batches", response_model=List[Batch])
def get_batches():
    return CURRENT_STATE.batches

@app.get("/api/batches/{batch_id}", response_model=Batch)
def get_batch(batch_id: str):
    for batch in CURRENT_STATE.batches:
        if batch.id.upper() == batch_id.upper():
            return batch
    raise HTTPException(status_code=404, detail=f"Batch {batch_id} not found")

@app.post("/api/sensor-data", response_model=TwinState)
def receive_sensor_data(payload: SensorPayload):
    """
    Ingests live or simulated IoT telemetries from ESP32 / Wokwi virtual sensors.
    """
    global CURRENT_STATE
    updates = {
        "temperature": payload.temperature,
        "humidity": payload.humidity,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    if payload.solarPower is not None:
        updates["solarPower"] = payload.solarPower
    if payload.batteryPercent is not None:
        updates["batteryPercent"] = payload.batteryPercent
    if payload.doorOpen is not None:
        updates["doorOpen"] = payload.doorOpen
    if payload.coolingOn is not None:
        updates["coolingOn"] = payload.coolingOn

    CURRENT_STATE = CURRENT_STATE.copy(update=updates)
    CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=2.0)
    log_telemetry(CURRENT_STATE)
    return CURRENT_STATE

@app.post("/api/simulation/tick", response_model=TwinState)
def simulation_tick(req: TickRequest):
    """
    Accelerates simulated time by deltaMinutes to observe real food-quality deterioration.
    """
    global CURRENT_STATE
    CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=req.deltaMinutes)
    log_telemetry(CURRENT_STATE)
    return CURRENT_STATE

@app.post("/api/simulation/{action}", response_model=TwinState)
def trigger_simulation(action: str):
    """
    Triggers deterministic cold-chain failure scenarios for hackathon demonstrations.
    """
    global CURRENT_STATE
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if action == "reset":
        CURRENT_STATE = create_initial_state()
        return CURRENT_STATE

    elif action == "cooling-failure":
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "coolingOn": False,
            "refrigeratorHealth": "failed",
            "fanRpm": 0.0,
            "activeSimulation": "Compressor Thermal Trip",
            "activeAlert": "CRITICAL: Refrigeration system failure. Temperature rising rapidly.",
            "systemRecommendation": "Deploy emergency chilling backup or expedite delivery of high-risk tomato crates."
        })
        # Advance physics to show immediate consequence
        CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=45.0)

    elif action == "door-open":
        door_state = not CURRENT_STATE.doorOpen
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "doorOpen": door_state,
            "activeSimulation": "Insulated Seal Breach (Door Open)" if door_state else None,
            "activeAlert": "WARNING: Cold vault door opened. Atmospheric thermal ingress." if door_state else None
        })
        if door_state:
            CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=30.0)

    elif action == "solar-failure":
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "solarPower": 28.0,  # Heavy monsoon overcast
            "batteryPercent": 18.5,  # Accelerated battery depletion
            "fanRpm": 620.0,     # Compressor load shedding
            "temperature": round(CURRENT_STATE.temperature + 2.4, 1),
            "refrigeratorHealth": "warning",
            "activeSimulation": "Photovoltaic Shading / Monsoon Cloud Cover",
            "activeAlert": "WARNING: Solar PV generation collapsed (28 W). Battery down to 18.5%. Compressor throttling."
        })
        CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=45.0)

    elif action == "battery-low":
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "batteryPercent": 14.5,
            "solarPower": 60.0,
            "coolingOn": False,
            "fanRpm": 0.0,
            "refrigeratorHealth": "warning",
            "activeSimulation": "Lithium Storage Depletion",
            "activeAlert": "CRITICAL: Battery reserve depleted below 15%. Compressor auto-shedding engaged."
        })
        CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=30.0)

    elif action == "ambient-heat-spike":
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "outsideTemperature": 38.5,
            "activeSimulation": "High Ambient Heatwave Spurt (38.5°C)",
            "activeAlert": "WARNING: Ambient thermal load exceeding standard refrigeration delta."
        })
        CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=30.0)

    elif action == "transport-delay":
        # Simulates 6-hour delay during transit in non-refrigerated feeder truck
        for idx, b in enumerate(CURRENT_STATE.batches):
            if b.id in ["TOM-102", "TOM-103", "TOM-106"]:
                CURRENT_STATE.batches[idx] = b.copy(update={
                    "qualityScore": max(10.0, b.qualityScore - 28.0),
                    "shelfLifeDays": max(0.2, b.shelfLifeDays - 2.5),
                    "risk": "critical" if b.qualityScore - 28.0 < 45 else "warning",
                    "recommendedAction": "Transit temperature excursion experienced. Perform rapid optical defect inspection upon arrival."
                })
        CURRENT_STATE = CURRENT_STATE.copy(update={
            "activeSimulation": "6-Hour Transit Delay in Ambient Transit",
            "activeAlert": "WARNING: Supply chain delay detected on secondary aggregation route."
        })
        CURRENT_STATE = evaluate_kinetics(CURRENT_STATE, delta_minutes=15.0)

    else:
        raise HTTPException(status_code=400, detail=f"Unknown simulation action '{action}'")

    log_telemetry(CURRENT_STATE)
    return CURRENT_STATE

@app.post("/api/batches/{batch_id}/inspect")
def inspect_batch(batch_id: str, action: str = "certify"):
    global CURRENT_STATE
    found = False
    for idx, b in enumerate(CURRENT_STATE.batches):
        if b.id.upper() == batch_id.upper():
            found = True
            if action == "certify":
                new_status = "Certified Safe"
                new_risk = "safe" if b.qualityScore >= 60 else "warning"
                new_action = "Manual quality audit completed. Complies with FAO Codex Alimentarius standards."
            elif action == "quarantine":
                new_status = "Quarantine"
                new_risk = "critical"
                new_action = "Quarantined for secondary processing (paste/puree) to prevent microbial cross-spoilage."
            elif action == "dispatch":
                new_status = "Certified Safe"
                new_risk = b.risk
                new_action = "Dispatched under Priority First-Expired, First-Out (FEFO) logistics."
            else:
                raise HTTPException(status_code=400, detail="Invalid inspection action")

            CURRENT_STATE.batches[idx] = b.copy(update={
                "inspectionStatus": new_status,
                "risk": new_risk,
                "recommendedAction": new_action
            })
            break

    if not found:
        raise HTTPException(status_code=404, detail="Batch not found")

    return CURRENT_STATE

@app.get("/api/network-ip")
def get_network_ip():
    import subprocess
    import re
    import socket

    ips = []
    try:
        out = subprocess.check_output("ipconfig", text=True, timeout=2)
        current_adapter = "Network"
        for line in out.splitlines():
            line_str = line.strip()
            if "adapter" in line_str:
                current_adapter = line_str.split("adapter")[-1].replace(":", "").strip()
            if "IPv4 Address" in line_str or "IPv4-Adresse" in line_str:
                m = re.search(r":\s*([0-9.]+)", line_str)
                if m:
                    ip = m.group(1).strip()
                    if not ip.startswith("127.") and not ip.startswith("169.254."):
                        ips.append({"ip": ip, "name": current_adapter})
    except Exception:
        pass

    if not ips:
        try:
            hostname = socket.gethostname()
            for info in socket.getaddrinfo(hostname, None):
                candidate = info[4][0]
                if ":" not in candidate and not candidate.startswith("127.") and not candidate.startswith("169.254."):
                    if not any(item["ip"] == candidate for item in ips):
                        ips.append({"ip": candidate, "name": "LAN Interface"})
        except Exception:
            pass

    primary_ip = ips[0]["ip"] if ips else "127.0.0.1"
    for item in ips:
        if "wi-fi" in item["name"].lower() or item["ip"].startswith("192.168."):
            primary_ip = item["ip"]
            break

    return {
        "primary_ip": primary_ip,
        "interfaces": ips if ips else [{"ip": "127.0.0.1", "name": "Localhost"}]
    }

