# FreshVault Twin — IoT Food Safety & Cold Storage Digital Twin

> **"See the cold chain before it fails."**  
> An IoT-enabled digital twin for food safety, biological quality prediction, and cold-chain decision support, specifically engineered for solar-powered decentralized cold storage under the UN/FAO South-South Cooperation (SSTC) framework.

---

## Overview

FreshVault Twin creates a continuous virtual representation of a solar-powered cold-storage facility and the fresh produce (tomatoes) stored inside it. By combining low-cost IoT telemetry with Arrhenius biological respiration kinetics ($Q_{10} \approx 2.4$), the platform predicts quality degradation and remaining shelf life in real time, alerting operators and cooperatives to cold-chain failures before irreversible postharvest loss occurs.

### Key Capabilities

1. **Interactive 3D Cold Storage Digital Twin**:
   - Built with **React Three Fiber** and **Three.js**.
   - Open cutaway chamber view displaying dynamic, color-shifting tomato crates ($\ge 75$: Safe Green, $45–74$: Warning Amber, $< 45$: Critical Red).
   - Animated compressor fan blades that spin when cooling is active and halt on faults.
   - Hinging insulated cold-vault access door responsive to door-open telemetry.
   - Photovoltaic solar array and lithium battery cabinet with live charge-level LEDs.
   - Raycasting interaction: click any crate in 3D to inspect real-time batch diagnostics.

2. **Kinetic Respiration Engine**:
   - Python FastAPI backend evaluating thermal infiltration, refrigeration capacity, and tomato senescence.
   - Replaces arbitrary calendar expiration dates with dynamic, temperature-exposure-based shelf life calculations.

3. **Simulation Laboratory (`/simulation`)**:
   - Deterministic failure scenarios: Compressor Thermal Trip, Door Ajar, Monsoon Cloud Cover, Low Battery Reserve, and Exterior Heatwave.
   - Time acceleration engine (+15m, +1h, +4h, +12h) to observe the multi-stage chain reaction in seconds.

4. **Digital Product Passport & Dynamic QR Code (`/batch/:id`)**:
   - Field-scannable QR code generated for every batch lot.
   - Full chain-of-custody, provenance, and temperature excursion history chart.
   - FAO South-South Cooperation (SSTC) compliance stamp and inspector audit actions.

5. **Supply Chain Traceability & South-South Knowledge Hub**:
   - Farm $\to$ Harvest $\to$ Packhouse $\to$ Cold Vault $\to$ Transit $\to$ Distribution milestone timeline.
   - Regional commodity blueprints for India (Tomatoes), Kenya (French Beans), Bangladesh (Raw Dairy), and Indonesia (Artisanal Tuna).
   - Standard Operating Procedures (SOPs) for rural solar microgrid operations.

6. **Wokwi ESP32 Hardware Twin & Live Gateway**:
   - Located in `WOKWI/`: complete PlatformIO & Wokwi virtual hardware project including firmware (`sketch.ino`), wiring diagram (`diagram.json`), SSD1306 OLED display, DHT22 room sensor, DS18B20 food pulp probe, 4 LEDs, buzzer, and 3 pushbuttons.
   - Live Python gateway bridge (`backend/wokwi_bridge.py`) for serial ingestion, stdin pipe, or interactive terminal simulation (`--simulate`).

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Three Fiber, Three.js, Recharts, Lucide Icons, QR Code SVG.
- **Backend**: Python 3.11, FastAPI, Uvicorn, Pydantic, SQLite3.
- **IoT Firmware**: ESP32 C++ (DHT22, DS18B20, SSD1306 OLED, ArduinoJson, PlatformIO, Wokwi).

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ recommended) & npm
- Python (v3.10+)

### 2. Backend Setup
```bash
# Navigate to project root
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend and interactive OpenAPI documentation will be available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. WOKWI ESP32 Hardware Simulator & Live Bridge
```bash
# Option A: Run the virtual hardware bridge in interactive simulation mode
python backend/wokwi_bridge.py --simulate

# Option B: Connect real or virtual COM port (115200 baud)
python backend/wokwi_bridge.py --port COM3 --baud 115200
```

---

## Architecture Diagram

```
[ Wokwi ESP32 Virtual MCU / Hardware ]
          │ (115200 Baud Serial / JSON)
          ▼
[ Wokwi Python Gateway Bridge (backend/wokwi_bridge.py) ]
          │ (HTTP POST /api/wokwi/telemetry)
          ▼
[ FastAPI Backend Engine ] ──► [ Respiration Kinetics & Physics Model ]
          │                ──► [ SQLite Audit & Telemetry Database ]
          ▼ (JSON /api/twin)
[ React + TypeScript Frontend ]
   ├── 3D Cold Storage Twin (Three.js / R3F)
   ├── Operations Command Center (/dashboard)
   ├── Simulation Lab (/simulation)
   ├── Digital Product Passport & Dynamic QR (/batch/:id)
   ├── Farm-to-Fork Traceability Timeline (/traceability)
   └── South-South FAO Knowledge Hub (/knowledge)
```

---

## License

MIT License. Designed for hackathons, open innovation, and South-South agricultural technology transfer.
