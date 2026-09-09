export interface TemperatureLog {
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface Batch {
  id: string;
  product: string;
  variety: string;
  quantityKg: number;
  harvestDate: string;
  producerCoop: string;
  originLocation: string;
  cratePosition: [number, number, number];
  qualityScore: number;
  shelfLifeDays: number;
  risk: 'safe' | 'warning' | 'critical';
  recommendedAction: string;
  temperatureHistory: TemperatureLog[];
  inspectionStatus: 'Pending Inspection' | 'Certified Safe' | 'Requires Urgent Triage' | 'Quarantine';
  complianceCertification: string;
}

export interface TwinState {
  facilityId: string;
  facilityName: string;
  location: string;
  timestamp: string;
  simulatedHour: number;
  temperature: number;
  humidity: number;
  outsideTemperature: number;
  solarPower: number;
  solarMaxPower: number;
  batteryPercent: number;
  coolingOn: boolean;
  doorOpen: boolean;
  refrigeratorHealth: 'healthy' | 'warning' | 'failed';
  fanRpm: number;
  compressorDutyCycle: number;
  overallRisk: 'safe' | 'warning' | 'critical';
  activeAlert: string | null;
  systemRecommendation: string;
  lastUpdated: string;
  activeSimulation: string | null;
  batches: Batch[];
}

export type SimulationAction =
  | 'cooling-failure'
  | 'door-open'
  | 'solar-failure'
  | 'battery-low'
  | 'ambient-heat-spike'
  | 'transport-delay'
  | 'reset';
