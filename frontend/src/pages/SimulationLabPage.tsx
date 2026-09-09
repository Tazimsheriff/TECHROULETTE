import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import { SimulationAction } from '../types';
import {
  Sliders,
  Play,
  RotateCcw,
  Zap,
  DoorOpen,
  Sun,
  BatteryLow,
  Flame,
  Truck,
  ArrowRight,
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
    setTimeout(() => setAccelerating(false), 300);
  };

  const scenarios = [
    {
      action: 'cooling-failure' as SimulationAction,
      title: 'Compressor Thermal Trip',
      desc: 'Simulates complete electrical fault in refrigeration compressor. Temperature climbs rapidly past 11°C.',
      icon: Zap,
      variant: 'btn-danger',
      severity: 'Critical'
    },
    {
      action: 'door-open' as SimulationAction,
      title: state.doorOpen ? 'Seal Chamber Door' : 'Door Left Ajar (30 min)',
      desc: 'Simulates an unsealed vault door. Ambient atmospheric air infiltrates, causing condensation and heat spike.',
      icon: DoorOpen,
      variant: 'btn-warning',
      severity: 'Warning'
    },
    {
      action: 'solar-failure' as SimulationAction,
      title: 'Monsoon Solar Shading',
      desc: 'Solar generation collapses to 45 W under dense cloud cover. Battery begins rapid discharge.',
      icon: Sun,
      variant: 'btn-warning',
      severity: 'Advisory'
    },
    {
      action: 'battery-low' as SimulationAction,
      title: 'Battery Deep Discharge (<15%)',
      desc: 'Lithium battery drops below safety threshold; automated BMS cuts chiller power to prevent cell damage.',
      icon: BatteryLow,
      variant: 'btn-danger',
      severity: 'Critical'
    },
    {
      action: 'ambient-heat-spike' as SimulationAction,
      title: 'Exterior Heatwave (38.5°C)',
      desc: 'Extreme outside thermal shock tests the thermal insulation barrier and compressor capacity limit.',
      icon: Flame,
      variant: 'btn-warning',
      severity: 'Warning'
    },
    {
      action: 'transport-delay' as SimulationAction,
      title: '6-Hour Feeder Transit Delay',
      desc: 'Simulates secondary logistics roadblock during uncooled road transit from village hub to cold terminal.',
      icon: Truck,
      variant: 'btn-danger',
      severity: 'High Loss'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Cold-Chain Simulation Laboratory
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Stress-test perishable tomato inventory under accelerated thermodynamic & biological failure conditions
          </p>
        </div>

        <button
          className="btn"
          onClick={() => handleScenario('reset')}
          style={{ padding: '0.5rem 1rem' }}
        >
          <RotateCcw size={14} />
          Reset Facility to Nominal State
        </button>
      </div>

      {/* Active Simulation State Tracker Banner */}
      <div className={`recommendation-box ${state.overallRisk}`}>
        <div style={{ marginTop: '2px' }}>
          {state.overallRisk === 'critical' ? (
            <AlertTriangle size={20} color="var(--status-critical)" />
          ) : (
            <CheckCircle2 size={20} color="var(--status-safe)" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Environment State:
            </span>
            <span className={`badge badge-${state.overallRisk}`}>
              {state.activeSimulation || 'NOMINAL BASELINE'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              SIM CLOCK: {Math.floor(state.simulatedHour)}:00 HRS
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {state.activeAlert || 'Facility is currently running under optimal parameters. Select a stress scenario below to observe how the digital twin responds.'}
          </p>
        </div>
      </div>

      {/* Time Acceleration Control Bar */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Clock size={15} color="#0284c7" />
            Time Acceleration Engine (Advance Biological Respiration Clock)
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dynamic Q10 kinetic progression
          </span>
        </div>
        <div className="panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Simulate Elapsed Time:
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
            +12 Hours (Half Day Decay)
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Calculates Arrhenius respiration rate & mould probability
          </span>
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
          Available Cold-Chain Fault Scenarios
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <div key={sc.action} className="panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <Icon size={16} />
                    {sc.title}
                  </div>
                  <span className={`badge ${sc.severity === 'Critical' || sc.severity === 'High Loss' ? 'badge-critical' : 'badge-warning'}`}>
                    {sc.severity}
                  </span>
                </div>
                <div className="panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {sc.desc}
                  </p>
                  <button
                    className={`btn ${sc.variant}`}
                    style={{ width: '100%', padding: '0.5rem' }}
                    onClick={() => handleScenario(sc.action)}
                  >
                    <Play size={13} />
                    Trigger Scenario
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chain Reaction Breakdown Diagram */}
      <div className="panel" style={{ marginTop: '0.5rem' }}>
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={15} color="#166534" />
            Digital-Twin Cause & Effect Chain Reaction
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Multi-stage deterministic telemetry propagation
          </span>
        </div>
        <div className="panel-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '0.75rem'
          }}>
            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>1. Physical Event</div>
              <div style={{ color: 'var(--text-muted)' }}>Compressor trip / door open / solar clouding</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>→</div>

            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>2. IoT Telemetry</div>
              <div style={{ color: 'var(--text-muted)' }}>Temp rises &gt;8°C, fan RPM drops to 0</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>→</div>

            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>3. Respiration Kinetics</div>
              <div style={{ color: 'var(--text-muted)' }}>Arrhenius Q10 accelerates decay rate</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>→</div>

            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>4. 3D Twin & Crates</div>
              <div style={{ color: 'var(--text-muted)' }}>Crates shift green → yellow → red in 3D</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>→</div>

            <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>5. FEFO Decision</div>
              <div style={{ color: 'var(--text-muted)' }}>Prioritize dispatch of affected lots</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
