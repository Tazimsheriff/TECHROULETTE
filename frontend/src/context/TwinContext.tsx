import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TwinState, Batch, SimulationAction } from '../types';

const INITIAL_BATCHES: Batch[] = [
  {
    id: "TOM-101",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "Roma Hybrid",
    quantityKg: 42.5,
    harvestDate: "2026-09-07",
    producerCoop: "Shillong Farmers Collective, Unit A",
    originLocation: "East Khasi Hills, Meghalaya",
    cratePosition: [-1.8, 0.45, -0.9],
    qualityScore: 94.0,
    shelfLifeDays: 7.2,
    risk: "safe",
    recommendedAction: "Optimal batch condition. Suitable for standard 7-day cold storage or long-distance transit.",
    inspectionStatus: "Certified Safe",
    complianceCertification: "FAO-SSC Grade A Cold-Chain Assured",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 6.0, humidity: 83.5 },
      { timestamp: "10:00", temperature: 6.1, humidity: 84.0 },
      { timestamp: "12:00", temperature: 6.3, humidity: 84.5 },
      { timestamp: "14:00", temperature: 6.2, humidity: 84.0 },
    ]
  },
  {
    id: "TOM-102",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "San Marzano Plum",
    quantityKg: 36.0,
    harvestDate: "2026-09-06",
    producerCoop: "Bhoomi FPO Agro-cluster",
    originLocation: "Ribhoi Valley Orchard, Meghalaya",
    cratePosition: [0.0, 0.45, -0.9],
    qualityScore: 78.5,
    shelfLifeDays: 4.8,
    risk: "safe",
    recommendedAction: "Normal respiration rate observed. Maintain continuous temperature monitoring.",
    inspectionStatus: "Certified Safe",
    complianceCertification: "FAO-SSC Grade A Cold-Chain Assured",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 6.4, humidity: 82.0 },
      { timestamp: "10:00", temperature: 6.8, humidity: 83.0 },
      { timestamp: "12:00", temperature: 7.1, humidity: 83.5 },
      { timestamp: "14:00", temperature: 6.9, humidity: 84.0 },
    ]
  },
  {
    id: "TOM-103",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "Pusa Ruby Local",
    quantityKg: 28.5,
    harvestDate: "2026-09-04",
    producerCoop: "Kisan Vikas Agro Producer Co.",
    originLocation: "Jowai Highland Farmlands",
    cratePosition: [1.8, 0.45, -0.9],
    qualityScore: 62.0,
    shelfLifeDays: 2.4,
    risk: "warning",
    recommendedAction: "Elevated maturity index. Prioritize for regional distribution or retail sale within 48 hours.",
    inspectionStatus: "Certified Safe",
    complianceCertification: "FAO-SSC Grade B Triage Recommended",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 7.5, humidity: 85.0 },
      { timestamp: "10:00", temperature: 8.2, humidity: 86.0 },
      { timestamp: "12:00", temperature: 8.6, humidity: 86.5 },
      { timestamp: "14:00", temperature: 8.4, humidity: 85.5 },
    ]
  },
  {
    id: "TOM-104",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "Heirloom Cherry Cluster",
    quantityKg: 18.0,
    harvestDate: "2026-09-08",
    producerCoop: "Shillong Organic Smallholders",
    originLocation: "Barapani Micro-Farm",
    cratePosition: [-1.8, 1.35, -0.9],
    qualityScore: 96.5,
    shelfLifeDays: 8.5,
    risk: "safe",
    recommendedAction: "Premium export-grade quality. Maintain at stable 6.0°C - 7.5°C.",
    inspectionStatus: "Certified Safe",
    complianceCertification: "FAO-SSC Grade A Cold-Chain Assured",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 5.9, humidity: 84.0 },
      { timestamp: "10:00", temperature: 6.0, humidity: 84.5 },
      { timestamp: "12:00", temperature: 6.1, humidity: 84.0 },
      { timestamp: "14:00", temperature: 6.0, humidity: 84.0 },
    ]
  },
  {
    id: "TOM-105",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "Himsona Hybrid",
    quantityKg: 50.0,
    harvestDate: "2026-09-05",
    producerCoop: "Highland Farmers Federation",
    originLocation: "Cherrapunjee Agricultural Belt",
    cratePosition: [0.0, 1.35, -0.9],
    qualityScore: 82.0,
    shelfLifeDays: 5.2,
    risk: "safe",
    recommendedAction: "Standard inventory rotation (FIFO). Quality metrics within standard deviations.",
    inspectionStatus: "Certified Safe",
    complianceCertification: "FAO-SSC Grade A Cold-Chain Assured",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 6.2, humidity: 83.0 },
      { timestamp: "10:00", temperature: 6.5, humidity: 83.5 },
      { timestamp: "12:00", temperature: 6.6, humidity: 84.0 },
      { timestamp: "14:00", temperature: 6.3, humidity: 84.0 },
    ]
  },
  {
    id: "TOM-106",
    product: "Fresh Tomato (Solanum lycopersicum)",
    variety: "Roma Hybrid",
    quantityKg: 32.0,
    harvestDate: "2026-09-03",
    producerCoop: "Kisan Vikas Agro Producer Co.",
    originLocation: "Jowai Highland Farmlands",
    cratePosition: [1.8, 1.35, -0.9],
    qualityScore: 38.0,
    shelfLifeDays: 0.7,
    risk: "critical",
    recommendedAction: "Quality compromised from prior transit excursion. Immediate sorting required; process into purée/sauce or divert from fresh supply chain.",
    inspectionStatus: "Requires Urgent Triage",
    complianceCertification: "FAO-SSC Quarantine Notice Issued",
    temperatureHistory: [
      { timestamp: "08:00", temperature: 9.8, humidity: 88.0 },
      { timestamp: "10:00", temperature: 11.5, humidity: 89.0 },
      { timestamp: "12:00", temperature: 12.8, humidity: 91.0 },
      { timestamp: "14:00", temperature: 13.4, humidity: 92.0 },
    ]
  }
];

const INITIAL_STATE: TwinState = {
  facilityId: "FAC-VAULT-04-NE",
  facilityName: "FreshVault Solar Storage Unit #4",
  location: "Cooperative Hub, Meghalaya / North-East Agro Corridor",
  timestamp: new Date().toLocaleTimeString(),
  simulatedHour: 14.0,
  temperature: 6.2,
  humidity: 84.0,
  outsideTemperature: 28.5,
  solarPower: 340.0,
  solarMaxPower: 450.0,
  batteryPercent: 78.0,
  coolingOn: true,
  doorOpen: false,
  refrigeratorHealth: "healthy",
  fanRpm: 1450.0,
  compressorDutyCycle: 65.0,
  overallRisk: "safe",
  activeAlert: null,
  systemRecommendation: "Optimal environmental parameters sustained. Chilling temperature steady at 6.2°C.",
  lastUpdated: new Date().toLocaleString(),
  activeSimulation: null,
  batches: INITIAL_BATCHES
};

interface TwinContextType {
  state: TwinState;
  isConnected: boolean;
  selectedBatchId: string | null;
  setSelectedBatchId: (id: string | null) => void;
  triggerSimulation: (action: SimulationAction) => Promise<void>;
  tickSimulation: (minutes: number) => Promise<void>;
  inspectBatch: (batchId: string, action: 'certify' | 'quarantine' | 'dispatch') => Promise<void>;
  refreshState: () => Promise<void>;
}

const TwinContext = createContext<TwinContextType | undefined>(undefined);

export const TwinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TwinState>(INITIAL_STATE);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>("TOM-103");

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('/api/twin');
      if (res.ok) {
        const data: TwinState = await res.json();
        setState(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 2500);
    return () => clearInterval(interval);
  }, [refreshState]);

  const triggerSimulation = async (action: SimulationAction) => {
    try {
      const res = await fetch(`/api/simulation/${action}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setIsConnected(true);
        return;
      }
    } catch {
      // Client-side fallback if backend is offline
    }

    // Client-side simulation fallback
    setState(prev => {
      if (action === 'reset') return INITIAL_STATE;

      let temp = prev.temperature;
      let cooling = prev.coolingOn;
      let fan = prev.fanRpm;
      let health = prev.refrigeratorHealth;
      let door = prev.doorOpen;
      let solar = prev.solarPower;
      let batt = prev.batteryPercent;
      let alertMsg = prev.activeAlert;
      let simName: string | null = action;

      if (action === 'cooling-failure') {
        cooling = false;
        fan = 0;
        health = 'failed';
        temp = 11.8;
        alertMsg = "CRITICAL: Refrigeration system failure. Temperature rising rapidly.";
        simName = "Compressor Thermal Trip";
      } else if (action === 'door-open') {
        door = !prev.doorOpen;
        temp = door ? prev.temperature + 2.8 : prev.temperature;
        alertMsg = door ? "WARNING: Cold vault door opened. Atmospheric thermal ingress." : null;
        simName = door ? "Insulated Seal Breach (Door Open)" : "";
      } else if (action === 'solar-failure') {
        solar = 45.0;
        alertMsg = "ADVISORY: Solar PV generation dropped below threshold (45 W). Battery discharging.";
        simName = "Photovoltaic Shading / Monsoon Cloud Cover";
      } else if (action === 'battery-low') {
        batt = 14.5;
        cooling = false;
        fan = 0;
        health = 'warning';
        alertMsg = "CRITICAL: Battery reserve depleted below 15%. Compressor auto-shedding engaged.";
        simName = "Lithium Storage Depletion";
      } else if (action === 'ambient-heat-spike') {
        temp = 12.5;
        alertMsg = "WARNING: Ambient thermal load exceeding standard refrigeration delta.";
        simName = "High Ambient Heatwave Spurt (38.5°C)";
      }

      const batches = prev.batches.map(b => {
        const penalty = (action === 'cooling-failure' || action === 'ambient-heat-spike') ? 22 : 8;
        const newScore = Math.max(10, b.qualityScore - (cooling ? 2 : penalty));
        const newLife = Math.max(0.2, +(b.shelfLifeDays * (newScore / b.qualityScore)).toFixed(1));
        const risk: 'safe' | 'warning' | 'critical' = newScore >= 75 ? 'safe' : newScore >= 45 ? 'warning' : 'critical';
        return {
          ...b,
          qualityScore: newScore,
          shelfLifeDays: newLife,
          risk,
          recommendedAction: risk === 'critical' ? 'Urgent triage required: divert to canning or local processing.' : b.recommendedAction
        };
      });

      const overallRisk: 'safe' | 'warning' | 'critical' = temp > 12.0 || !cooling || batches.some(b => b.risk === 'critical')
        ? 'critical' : temp > 8.5 ? 'warning' : 'safe';

      return {
        ...prev,
        temperature: +temp.toFixed(1),
        coolingOn: cooling,
        fanRpm: fan,
        refrigeratorHealth: health,
        doorOpen: door,
        solarPower: solar,
        batteryPercent: batt,
        overallRisk,
        activeAlert: alertMsg,
        activeSimulation: simName,
        batches
      };
    });
  };

  const tickSimulation = async (minutes: number) => {
    try {
      const res = await fetch('/api/simulation/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deltaMinutes: minutes })
      });
      if (res.ok) {
        const data = await res.json();
        setState(data);
        return;
      }
    } catch {
      // fallback
    }

    setState(prev => ({
      ...prev,
      simulatedHour: (prev.simulatedHour + minutes / 60) % 24
    }));
  };

  const inspectBatch = async (batchId: string, action: 'certify' | 'quarantine' | 'dispatch') => {
    try {
      const res = await fetch(`/api/batches/${batchId}/inspect?action=${action}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setState(data);
        return;
      }
    } catch {
      // fallback
    }

    setState(prev => ({
      ...prev,
      batches: prev.batches.map(b => {
        if (b.id === batchId) {
          const status = action === 'certify' ? 'Certified Safe' : action === 'quarantine' ? 'Quarantine' : 'Certified Safe';
          const risk = action === 'quarantine' ? 'critical' : b.risk;
          return { ...b, inspectionStatus: status, risk };
        }
        return b;
      })
    }));
  };

  return (
    <TwinContext.Provider
      value={{
        state,
        isConnected,
        selectedBatchId,
        setSelectedBatchId,
        triggerSimulation,
        tickSimulation,
        inspectBatch,
        refreshState
      }}
    >
      {children}
    </TwinContext.Provider>
  );
};

export const useTwin = () => {
  const context = useContext(TwinContext);
  if (!context) {
    throw new Error('useTwin must be used within a TwinProvider');
  }
  return context;
};
