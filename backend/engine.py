import math
from datetime import datetime
from typing import List, Tuple
from .models import TwinState, Batch, TemperatureLog

def get_initial_batches() -> List[Batch]:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    return [
        Batch(
            id="TOM-101",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="Roma Hybrid",
            quantityKg=42.5,
            harvestDate="2026-09-07",
            producerCoop="Shillong Farmers Collective, Unit A",
            originLocation="East Khasi Hills, Meghalaya",
            cratePosition=[-1.8, 0.45, -0.9],
            qualityScore=94.0,
            shelfLifeDays=7.2,
            risk="safe",
            recommendedAction="Optimal batch condition. Suitable for standard 7-day cold storage or long-distance transit.",
            inspectionStatus="Certified Safe",
            complianceCertification="FAO-SSC Grade A Cold-Chain Assured",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=6.0, humidity=83.5),
                TemperatureLog(timestamp="10:00", temperature=6.1, humidity=84.0),
                TemperatureLog(timestamp="12:00", temperature=6.3, humidity=84.5),
                TemperatureLog(timestamp="14:00", temperature=6.2, humidity=84.0),
            ]
        ),
        Batch(
            id="TOM-102",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="San Marzano Plum",
            quantityKg=36.0,
            harvestDate="2026-09-06",
            producerCoop="Bhoomi FPO Agro-cluster",
            originLocation="Ribhoi Valley Orchard, Meghalaya",
            cratePosition=[0.0, 0.45, -0.9],
            qualityScore=78.5,
            shelfLifeDays=4.8,
            risk="safe",
            recommendedAction="Normal respiration rate observed. Maintain continuous temperature monitoring.",
            inspectionStatus="Certified Safe",
            complianceCertification="FAO-SSC Grade A Cold-Chain Assured",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=6.4, humidity=82.0),
                TemperatureLog(timestamp="10:00", temperature=6.8, humidity=83.0),
                TemperatureLog(timestamp="12:00", temperature=7.1, humidity=83.5),
                TemperatureLog(timestamp="14:00", temperature=6.9, humidity=84.0),
            ]
        ),
        Batch(
            id="TOM-103",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="Pusa Ruby Local",
            quantityKg=28.5,
            harvestDate="2026-09-04",
            producerCoop="Kisan Vikas Agro Producer Co.",
            originLocation="Jowai Highland Farmlands",
            cratePosition=[1.8, 0.45, -0.9],
            qualityScore=62.0,
            shelfLifeDays=2.4,
            risk="warning",
            recommendedAction="Elevated maturity index. Prioritize for regional distribution or retail sale within 48 hours.",
            inspectionStatus="Certified Safe",
            complianceCertification="FAO-SSC Grade B Triage Recommended",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=7.5, humidity=85.0),
                TemperatureLog(timestamp="10:00", temperature=8.2, humidity=86.0),
                TemperatureLog(timestamp="12:00", temperature=8.6, humidity=86.5),
                TemperatureLog(timestamp="14:00", temperature=8.4, humidity=85.5),
            ]
        ),
        Batch(
            id="TOM-104",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="Heirloom Cherry Cluster",
            quantityKg=18.0,
            harvestDate="2026-09-08",
            producerCoop="Shillong Organic Smallholders",
            originLocation="Barapani Micro-Farm",
            cratePosition=[-1.8, 1.35, -0.9],
            qualityScore=96.5,
            shelfLifeDays=8.5,
            risk="safe",
            recommendedAction="Premium export-grade quality. Maintain at stable 6.0°C - 7.5°C.",
            inspectionStatus="Certified Safe",
            complianceCertification="FAO-SSC Grade A Cold-Chain Assured",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=5.9, humidity=84.0),
                TemperatureLog(timestamp="10:00", temperature=6.0, humidity=84.5),
                TemperatureLog(timestamp="12:00", temperature=6.1, humidity=84.0),
                TemperatureLog(timestamp="14:00", temperature=6.0, humidity=84.0),
            ]
        ),
        Batch(
            id="TOM-105",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="Himsona Hybrid",
            quantityKg=50.0,
            harvestDate="2026-09-05",
            producerCoop="Highland Farmers Federation",
            originLocation="Cherrapunjee Agricultural Belt",
            cratePosition=[0.0, 1.35, -0.9],
            qualityScore=82.0,
            shelfLifeDays=5.2,
            risk="safe",
            recommendedAction="Standard inventory rotation (FIFO). Quality metrics within standard deviations.",
            inspectionStatus="Certified Safe",
            complianceCertification="FAO-SSC Grade A Cold-Chain Assured",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=6.2, humidity=83.0),
                TemperatureLog(timestamp="10:00", temperature=6.5, humidity=83.5),
                TemperatureLog(timestamp="12:00", temperature=6.6, humidity=84.0),
                TemperatureLog(timestamp="14:00", temperature=6.3, humidity=84.0),
            ]
        ),
        Batch(
            id="TOM-106",
            product="Fresh Tomato (Solanum lycopersicum)",
            variety="Roma Hybrid",
            quantityKg=32.0,
            harvestDate="2026-09-03",
            producerCoop="Kisan Vikas Agro Producer Co.",
            originLocation="Jowai Highland Farmlands",
            cratePosition=[1.8, 1.35, -0.9],
            qualityScore=38.0,
            shelfLifeDays=0.7,
            risk="critical",
            recommendedAction="Quality compromised from prior transit excursion. Immediate sorting required; process into purée/sauce or divert from fresh supply chain.",
            inspectionStatus="Requires Urgent Triage",
            complianceCertification="FAO-SSC Quarantine Notice Issued",
            temperatureHistory=[
                TemperatureLog(timestamp="08:00", temperature=9.8, humidity=88.0),
                TemperatureLog(timestamp="10:00", temperature=11.5, humidity=89.0),
                TemperatureLog(timestamp="12:00", temperature=12.8, humidity=91.0),
                TemperatureLog(timestamp="14:00", temperature=13.4, humidity=92.0),
            ]
        )
    ]

def create_initial_state() -> TwinState:
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return TwinState(
        facilityId="FAC-VAULT-04-NE",
        facilityName="FreshVault Solar Storage Unit #4",
        location="Cooperative Hub, Meghalaya / North-East Agro Corridor",
        timestamp=now_str,
        simulatedHour=14.0,
        temperature=6.2,
        humidity=84.0,
        outsideTemperature=28.5,
        solarPower=340.0,
        solarMaxPower=450.0,
        batteryPercent=78.0,
        coolingOn=True,
        doorOpen=False,
        refrigeratorHealth="healthy",
        fanRpm=1450.0,
        compressorDutyCycle=65.0,
        overallRisk="safe",
        activeAlert=None,
        systemRecommendation="Optimal environmental parameters sustained. Chilling temperature steady at 6.2°C.",
        lastUpdated=now_str,
        activeSimulation=None,
        batches=get_initial_batches()
    )

def evaluate_kinetics(state: TwinState, delta_minutes: float) -> TwinState:
    """
    Computes dynamic physics & biological respiration deterioration over time step delta_minutes.
    """
    # 1. Thermal infiltration & refrigeration dynamics
    target_temp = 6.0
    cooling_capacity_kw = 1.8 if (state.coolingOn and state.refrigeratorHealth != "failed") else 0.0

    # Door open significantly increases thermal load (ambient heat rushes in)
    heat_ingress_coef = 0.045 if not state.doorOpen else 0.28
    ambient_gradient = state.outsideTemperature - state.temperature
    thermal_rise = heat_ingress_coef * ambient_gradient * (delta_minutes / 15.0)

    cooling_pull_down = 0.0
    if cooling_capacity_kw > 0:
        cooling_pull_down = 0.065 * max(0.0, state.temperature - target_temp) * (delta_minutes / 15.0)

    new_temp = state.temperature + thermal_rise - cooling_pull_down
    new_temp = max(3.5, round(new_temp, 2))

    # 2. Humidity equilibrium
    if state.doorOpen:
        # Outside air dilutes controlled humidity
        new_humidity = state.humidity + (65.0 - state.humidity) * 0.12 * (delta_minutes / 15.0)
    elif state.coolingOn:
        # Refrigeration condenser stabilizes humidity ~ 82-86%
        new_humidity = state.humidity + (84.0 - state.humidity) * 0.05 * (delta_minutes / 15.0)
    else:
        # In stagnant warm air, transpiration raises humidity
        new_humidity = state.humidity + 0.8 * (delta_minutes / 15.0)
    new_humidity = min(98.0, max(50.0, round(new_humidity, 1)))

    # 3. Solar & Battery equilibrium
    solar_watts = state.solarPower
    compressor_draw_watts = 220.0 if state.coolingOn else 15.0
    net_power = solar_watts - compressor_draw_watts

    # 1 kWh battery approx 100%
    battery_delta = (net_power / 1000.0) * (delta_minutes / 60.0) * 10.0
    new_battery = min(100.0, max(0.0, round(state.batteryPercent + battery_delta, 1)))

    cooling_on = state.coolingOn
    refrigerator_health = state.refrigeratorHealth
    fan_rpm = state.fanRpm

    if new_battery < 15.0 and cooling_on:
        # Battery safeguard trip
        cooling_on = False
        refrigerator_health = "warning"
        fan_rpm = 0.0

    if cooling_on and refrigerator_health != "failed":
        fan_rpm = 1450.0 if new_battery > 30.0 else 980.0
    else:
        fan_rpm = 0.0

    # 4. Batch respiration & shelf-life deterioration kinetics
    # Q10 biological respiration model for tomatoes (Solanum lycopersicum)
    # Optimum: 7.0 - 10.0°C.
    # Below 5.0°C: mild chilling injury risk over extended time.
    # Above 10.0°C: exponential metabolic acceleration (spoilage, softening, decay fungi).
    time_hours = delta_minutes / 60.0
    updated_batches: List[Batch] = []

    timestamp_str = datetime.now().strftime("%H:%M")

    for b in state.batches:
        # Temperature excess factor
        temp_excess = max(0.0, new_temp - 8.0)
        # Respiration rate multiplier Q10 ~ 2.4
        respiration_factor = math.pow(2.4, temp_excess / 10.0) if temp_excess > 0 else 1.0

        # Humidity penalty if condensation forms (>92%) or excessive drying (<70%)
        rh_penalty = 1.0
        if new_humidity > 92.0:
            rh_penalty = 1.35  # Botrytis cinerea / fungal mould acceleration
        elif new_humidity < 70.0:
            rh_penalty = 1.25  # Water loss / skin shrivel

        # Base decay per hour at optimum (approx 0.15 pts/hr)
        base_decay = 0.15 * time_hours
        total_loss = base_decay * respiration_factor * rh_penalty

        new_quality = max(0.0, round(b.qualityScore - total_loss, 1))

        # Dynamic remaining shelf life
        # Nominal shelf life at optimum is approx (Quality / 100) * 8.0 days
        effective_daily_rate = 1.0 * (respiration_factor * rh_penalty)
        new_shelf_life = max(0.0, round((new_quality / 100.0) * (7.5 / effective_daily_rate), 1))

        # Categorize risk
        if new_quality >= 75.0 and new_temp <= 8.5:
            risk = "safe"
            action = "Condition optimal. Maintain standard cold-chain parameters."
            inspection = "Certified Safe"
        elif new_quality >= 45.0 or (new_temp > 8.5 and new_temp <= 12.0):
            risk = "warning"
            action = "Accelerated ripening detected. Prioritize dispatch or lower temperature setpoint."
            inspection = "Pending Inspection"
        else:
            risk = "critical"
            action = "High spoilage hazard. Remove from primary cold vault; perform immediate physical triage."
            inspection = "Requires Urgent Triage"

        # Update historical log (keep last 12 data points)
        new_history = list(b.temperatureHistory)
        new_history.append(TemperatureLog(timestamp=timestamp_str, temperature=new_temp, humidity=new_humidity))
        if len(new_history) > 12:
            new_history = new_history[-12:]

        updated_batches.append(
            b.copy(update={
                "qualityScore": new_quality,
                "shelfLifeDays": new_shelf_life,
                "risk": risk,
                "recommendedAction": action,
                "inspectionStatus": inspection,
                "temperatureHistory": new_history
            })
        )

    # 5. Facility-wide risk & operational recommendation
    critical_count = sum(1 for b in updated_batches if b.risk == "critical")
    warning_count = sum(1 for b in updated_batches if b.risk == "warning")

    if new_temp > 12.0 or not cooling_on or critical_count > 0:
        overall_risk = "critical"
    elif new_temp > 8.5 or warning_count > 0 or new_battery < 25.0:
        overall_risk = "warning"
    else:
        overall_risk = "safe"

    # Actionable control-room recommendations
    if not cooling_on and state.refrigeratorHealth == "failed":
        active_alert = "CRITICAL: Refrigeration compressor shutdown. Temperature excursion in progress."
        recommendation = "Engage emergency cooling bypass or deploy backup portable chiller immediately. Dispatch high-risk batches."
    elif state.doorOpen:
        active_alert = "WARNING: Cold-vault access door open. Rapid thermal ingress detected."
        recommendation = "Verify facility access protocol and close the insulated seal door to prevent condensation shock."
    elif new_temp > 12.0:
        active_alert = "CRITICAL: Internal temperature exceeded maximum safety threshold (12.0°C)."
        recommendation = "Initiate cold-chain emergency protocol. Triage batches TOM-103 and TOM-106 to prevent total postharvest loss."
    elif new_battery < 20.0:
        active_alert = "WARNING: Lithium backup storage below 20%. Compressor load shedding imminent."
        recommendation = "Switch auxiliary non-essential loads off. Inspect solar photovoltaic array or connect rural grid line."
    elif warning_count > 0:
        active_alert = f"ADVISORY: {warning_count} batch(es) exhibiting accelerated degradation."
        recommendation = "Implement First-Expired, First-Out (FEFO) logistics. Fast-track affected lots to local market."
    else:
        active_alert = None
        recommendation = "Facility operating within target parameters (4.0°C - 8.0°C). Normal cold-chain integrity verified."

    sim_hour = (state.simulatedHour + (delta_minutes / 60.0)) % 24.0

    return state.copy(update={
        "temperature": new_temp,
        "humidity": new_humidity,
        "solarPower": round(solar_watts, 1),
        "batteryPercent": new_battery,
        "coolingOn": cooling_on,
        "refrigeratorHealth": refrigerator_health,
        "fanRpm": fan_rpm,
        "overallRisk": overall_risk,
        "activeAlert": active_alert,
        "systemRecommendation": recommendation,
        "simulatedHour": round(sim_hour, 2),
        "lastUpdated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "batches": updated_batches
    })
