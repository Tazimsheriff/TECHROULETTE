# Wokwi ESP32 Sensor Simulation for FreshVault Twin

This directory contains the virtual hardware specification and ESP32 firmware for simulating real IoT sensors in cold-storage environments.

## Simulated Hardware Components
1. **ESP32-DevKit-v1**: Microcontroller node with onboard Wi-Fi.
2. **DHT22**: Precision digital temperature and relative humidity sensor.
3. **Door Switch (Pushbutton)**: Simulates magnetic reed switch detecting insulated chamber access.
4. **Fault Trigger (Pushbutton)**: Simulates thermal overload relay tripping on compressor unit.
5. **Chiller Active LED (Green)**: Visual status for refrigeration active.
6. **Alarm Strobe LED (Red)**: Warning indicator during temperature excursions (>12.0°C).

## Running in Wokwi (Web Simulator)
1. Open [wokwi.com](https://wokwi.com/projects/new/esp32).
2. Paste `sketch.ino` into the code editor.
3. Paste `diagram.json` into the `diagram.json` tab.
4. Click **Start Simulation**.
5. Adjust the slider on the DHT22 sensor to raise or lower temperature and observe the real-time POST telemetries being logged to the FreshVault Twin backend.
