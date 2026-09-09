import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import { SimulationAction } from '../types';
import {
  RotateCcw,
  Zap,
  DoorOpen,
  Sun,
  BatteryLow,
  Flame,
  Truck,
  Play,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const SimulationLabPage: React.FC = () => {
  const { state, triggerSimulation, tickSimulation } = useTwin();
  const [accelerating, setAccelerating] = useState(false);

  const handleScenario = async (action: SimulationAction) => {
    await triggerSimulation(action);
  };

  const handleTick = async (minutes: number) => {
    setAccelerating(true);
    await tickSimulation(minutes);
    setTimeout(() => setAccelerating(false), 250);
  };

  const scenarios = [
    {
      action: 'cooling-failure' as SimulationAction,
      title: 'FAULT-01: Evaporator Compressor Trip',
      desc: 'Simulates mechanical seizure or thermal circuit overload. Cooling halts; internal temperature climbs at ~0.15°C/min.',
      icon: Zap,
      btnClass: 'btn-danger',
      code: 'ERR_COMP_TRIP'
    },
    {
      action: 'door-open' as SimulationAction,
      title: state.doorOpen ? 'DOOR-02: Seal Chamber Access Door' : 'DOOR-02: Cold-Vault Door Left Ajar (30 min)',
      desc: 'Simulates unsealed rubber compression seal. High ambient humidity infiltrates, forming condensation on produce skins.',
      icon: DoorOpen,
      btnClass: 'btn-warning',
      code: 'WARN_SEAL_BREACH'
    },
    {
      action: 'solar-failure' as SimulationAction,
      title: 'SOLAR-03: Monsoon Cloud Cover Shading',
      desc: 'Simulates diffuse solar irradiance collapse to 28 W. Battery drops to 18.5% and BMS throttles compressor duty.',
      icon: Sun,
      btnClass: 'btn-warning',
      code: 'WARN_PV_IRRAD_DROP'
    },
    {
      action: 'battery-low' as SimulationAction,
      title: 'BATT-04: Deep Battery Depletion (<15%)',
      desc: 'Simulates extended night/cloud storage exhaustion. Automated battery protection trips cooling loop completely.',
      icon: BatteryLow,
      btnClass: 'btn-danger',
      code: 'CRIT_BATT_SHED'
    },
    {
      action: 'ambient-heat-spike' as SimulationAction,
      title: 'CLIM-05: Exterior Thermal Wave (38.5°C)',
      desc: 'Simulates severe summer heatwave creating maximum temperature gradient (ΔT = 32°C) across insulated chamber walls.',
      icon: Flame,
      btnClass: 'btn-warning',
      code: 'WARN_HEAT_LOAD'
    },
    {
      action: 'transport-delay' as SimulationAction,
      title: 'LOG-06: Feeder Logistics Transit Delay (6h)',
      desc: 'Simulates roadblock during ambient road transit from farm collection to central cold hub without active chilling.',
      icon: Truck,
      btnClass: 'btn-danger',
      code: 'HIGH_TRANSIT_LOSS'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Simulation Test Bench // Fault Injection Engine
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            DETERMINISTIC STRESS-TESTING OF PERISHABLE PRODUCE UNDER ACCELERATED EXCURSIONS
          </p>
        </div>

        <button
          className="btn btn-sm"
          onClick={() => handleScenario('reset')}
        >
          <RotateCcw size={11} />
          Reset Facility to Nominal Baseline
        </button>
      </div>

      {/* Active State Tracker */}
      <div className={`recommendation-box ${state.overallRisk}`}>
        <div style={{ marginTop: '2px' }}>
          {state.overallRisk === 'critical' ? (
            <AlertTriangle size={16} color="var(--scada-alarm)" />
          ) : (
            <CheckCircle2 size={16} color="var(--scada-normal)" />
          )}
        </div>
        <div style={{ flex: 1, fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '2px' }}>
            <span style={{ fontWeight: 700 }}>ACTIVE STATE:</span>
            <span className={`badge badge-${state.overallRisk}`}>
              {state.activeSimulation || 'NOMINAL BASELINE'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              SIMULATED CLOCK: {Math.floor(state.simulatedHour)}:00 HRS
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {state.activeAlert || 'Facility is operating under baseline conditions (4.0 - 8.0°C). Select a test scenario below to observe how the digital twin and biological kinetics react.'}
          </p>
        </div>
      </div>

      {/* Time Acceleration Strip */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Clock size={13} color="#0369a1" />
            Biological Respiration Chrono-Step (Accelerate Senescence Time)
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Q10 Respiration Kinetic Step
          </span>
        </div>
        <div className="panel-body" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '0.5rem 0.75rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            CHRONO-ADVANCE:
          </span>
          <button
            className="btn btn-sm"
            onClick={() => handleTick(15)}
            disabled={accelerating}
          >
            +15 Minutes
          </button>
          <button
            className="btn btn-sm"
            onClick={() => handleTick(60)}
            disabled={accelerating}
          >
            +1 Hour
          </button>
          <button
            className="btn btn-sm"
            onClick={() => handleTick(240)}
            disabled={accelerating}
          >
            +4 Hours
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleTick(720)}
            disabled={accelerating}
          >
            +12 Hours (Half Day Respiration)
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            EVALUATES TEMPERATURE EXCURSION DURATION ON TOMATO FIRMNESS
          </span>
        </div>
      </div>

      {/* Fault Injection Bench Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          return (
            <div key={sc.action} className="panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Icon size={13} />
                  {sc.title}
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  [{sc.code}]
                </span>
              </div>
              <div className="panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.65rem' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.65rem' }}>
                  {sc.desc}
                </p>
                <button
                  className={`btn ${sc.btnClass}`}
                  style={{ width: '100%', padding: '0.45rem', fontSize: '11px' }}
                  onClick={() => handleScenario(sc.action)}
                >
                  <Play size={11} />
                  Inject Fault Scenario
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deterministic Cause & Effect Propagation Ledger */}
      <div className="panel" style={{ marginTop: '0.25rem' }}>
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={13} color="#15803d" />
            Digital Twin Telemetry Propagation Flow
          </div>
        </div>
        <div className="panel-body" style={{ padding: '0.75rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.5rem',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>1. Physical Event</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Compressor trip / door breach / solar shading</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>&rarr;</div>

            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>2. IoT Sensing</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>DS18B20 & DHT22 log temperature rise</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>&rarr;</div>

            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>3. Kinetic Model</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Arrhenius Q10 accelerates decay rate</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>&rarr;</div>

            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>4. 3D Twin Response</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Fan stops, crates shift color in WebGL</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>&rarr;</div>

            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>5. FEFO Decision</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Dispatch high-risk lots to prevent loss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
