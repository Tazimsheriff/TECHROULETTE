from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class TemperatureLog(BaseModel):
    timestamp: str
    temperature: float
    humidity: float

class Batch(BaseModel):
    id: str
    product: str = "Fresh Tomato (Solanum lycopersicum)"
    variety: str = "Roma / San Marzano"
    quantityKg: float
    harvestDate: str
    producerCoop: str
    originLocation: str
    cratePosition: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0])
    qualityScore: float  # 0 to 100
    shelfLifeDays: float
    risk: Literal["safe", "warning", "critical"]
    recommendedAction: str
    temperatureHistory: List[TemperatureLog] = Field(default_factory=list)
    inspectionStatus: Literal["Pending Inspection", "Certified Safe", "Requires Urgent Triage", "Quarantine"] = "Certified Safe"
    complianceCertification: str = "FAO-SSC Grade A Cold-Chain Assured"

class TwinState(BaseModel):
    facilityId: str = "FAC-VAULT-04-NE"
    facilityName: str = "FreshVault Solar Storage Unit #4"
    location: str = "Cooperative Hub, Meghalaya / North-East Grid"
    timestamp: str
    simulatedHour: float = 14.0
    temperature: float = 6.2  # target 4-8 C
    humidity: float = 84.0    # target 80-90%
    outsideTemperature: float = 28.5
    solarPower: float = 340.0 # Watts
    solarMaxPower: float = 450.0 # Watts
    batteryPercent: float = 78.0 # %
    coolingOn: bool = True
    doorOpen: bool = False
    refrigeratorHealth: Literal["healthy", "warning", "failed"] = "healthy"
    fanRpm: float = 1450.0
    compressorDutyCycle: float = 65.0 # %
    overallRisk: Literal["safe", "warning", "critical"] = "safe"
    activeAlert: Optional[str] = None
    systemRecommendation: str = "Optimal environmental parameters sustained. No intervention required."
    lastUpdated: str
    activeSimulation: Optional[str] = None
    batches: List[Batch] = Field(default_factory=list)

class SensorPayload(BaseModel):
    temperature: float
    humidity: float
    solarPower: Optional[float] = None
    batteryPercent: Optional[float] = None
    doorOpen: Optional[bool] = None
    coolingOn: Optional[bool] = None

class SimulationRequest(BaseModel):
    scenario: Literal["cooling-failure", "door-open", "solar-failure", "battery-low", "transport-delay", "ambient-heat-spike", "reset"]
    intensity: Optional[float] = 1.0

class TickRequest(BaseModel):
    deltaMinutes: float = 15.0
