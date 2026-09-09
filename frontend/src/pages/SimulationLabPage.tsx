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
  CheckCircle2,
  Cpu,
  Radio,
  Terminal,
  Copy
} from 'lucide-react';

export const SimulationLabPage: React.FC = () => {
  const { state, triggerSimulation, tickSimulation } = useTwin();
  const [accelerating, setAccelerating] = useState(false);
  const [oledPage, setOledPage] = useState(0);

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

      {/* WOKWI ESP32 Hardware Deck & Edge Controller Integration */}
      <div className="panel" style={{ border: '2px solid #0284c7', backgroundColor: '#f8fafc', marginBottom: '0.5rem' }}>
        <div className="panel-header" style={{ backgroundColor: '#f0f9ff', borderBottom: '2px solid #bae6fd', padding: '0.65rem 1rem' }}>
          <div className="panel-title" style={{ color: '#0369a1', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={16} color="#0284c7" />
            WOKWI ESP32 Virtual Hardware Simulation & Physical Controller Deck
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontFamily: 'monospace'
            }}>
              WOKWI sketch.ino ONLINE
            </span>
          </div>
        </div>

        <div className="panel-body" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Subpanel: Physical SSD1306 OLED & Hardware Status LEDs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* SSD1306 128x64 OLED Monitor */}
              <div style={{
                backgroundColor: '#050b14',
                border: '4px solid #1e293b',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                color: '#38bdf8',
                fontFamily: 'monospace',
                minHeight: '175px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px', marginBottom: '8px', fontSize: '11px', color: '#64748b' }}>
                  <span>SSD1306 OLED (I2C: 0x3C)</span>
                  <span style={{ color: '#38bdf8' }}>PAGE {oledPage + 1}/4</span>
                </div>

                {/* OLED Page 0: Overview */}
                {oledPage === 0 && (
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>FreshVault Twin</div>
                    <div>Room: <strong style={{ color: state.temperature > 8 ? '#f87171' : '#38bdf8' }}>{state.temperature.toFixed(1)} C</strong></div>
                    <div>Food: <strong style={{ color: '#38bdf8' }}>{(state.temperature + 0.3).toFixed(1)} C</strong></div>
                    <div>Hum:  <strong style={{ color: '#38bdf8' }}>{state.humidity.toFixed(0)} %</strong></div>
                    <div>Door: <strong style={{ color: state.doorOpen ? '#f87171' : '#4ade80' }}>{state.doorOpen ? 'OPEN' : 'CLOSED'}</strong></div>
                  </div>
                )}

                {/* OLED Page 1: Solar & Energy */}
                {oledPage === 1 && (
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>Solar & Power</div>
                    <div>Power:   <strong style={{ color: '#fbbf24' }}>{state.solarPower.toFixed(0)} W</strong></div>
                    <div>Battery: <strong style={{ color: state.batteryPercent < 25 ? '#f87171' : '#4ade80' }}>{state.batteryPercent.toFixed(1)} %</strong></div>
                    <div>Cooling: <strong style={{ color: state.coolingOn ? '#38bdf8' : '#64748b' }}>{state.coolingOn ? 'ON' : 'OFF'}</strong></div>
                    <div>Health:  <strong style={{ color: state.refrigeratorHealth === 'failed' ? '#f87171' : '#4ade80' }}>{state.refrigeratorHealth === 'failed' ? 'FAULT' : 'OK'}</strong></div>
                  </div>
                )}

                {/* OLED Page 2: Produce Batch Quality */}
                {oledPage === 2 && (
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>Batch Status</div>
                    <div style={{ color: '#ffffff' }}>TOM-101 Tomato</div>
                    <div>Stock:   42.5 kg</div>
                    <div>Quality: <strong style={{ color: (state.batches[0]?.qualityScore ?? 100) < 60 ? '#f87171' : '#4ade80' }}>{(state.batches[0]?.qualityScore ?? 100).toFixed(1)} /100</strong></div>
                    <div>Life:    <strong style={{ color: '#38bdf8' }}>{(state.batches[0]?.shelfLifeDays ?? 6.5).toFixed(1)} days</strong></div>
                  </div>
                )}

                {/* OLED Page 3: FAO System Recommendation */}
                {oledPage === 3 && (
                  <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 800, color: state.overallRisk === 'critical' ? '#f87171' : state.overallRisk === 'warning' ? '#fbbf24' : '#4ade80', letterSpacing: '0.05em' }}>
                      STATUS: {state.overallRisk.toUpperCase()}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '6px' }}>
                      {state.refrigeratorHealth === 'failed' ? 'Cooling fault: inspect batch' : state.doorOpen ? 'Close door and monitor' : state.overallRisk === 'critical' ? 'High temp: isolate and inspect' : 'Maintain nominal storage'}
                    </div>
                  </div>
                )}

                {/* OLED Screen Navigation */}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '10px', paddingTop: '6px', borderTop: '1px solid #1e293b' }}>
                  {[0, 1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setOledPage(p)}
                      style={{
                        flex: 1,
                        padding: '3px 0',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: oledPage === p ? '#0284c7' : '#0f172a',
                        color: oledPage === p ? '#ffffff' : '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      P{p + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setOledPage((p) => (p + 1) % 4)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: '#1e293b',
                      color: '#38bdf8',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>

              {/* Physical GPIO LEDs & Buzzer Status */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: state.overallRisk === 'safe' ? '#22c55e' : '#e2e8f0',
                    boxShadow: state.overallRisk === 'safe' ? '0 0 10px #22c55e' : 'none',
                    border: '1px solid #16a34a'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: state.overallRisk === 'safe' ? '#15803d' : '#94a3b8' }}>
                    SAFE (D25)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: state.overallRisk === 'warning' ? '#eab308' : '#e2e8f0',
                    boxShadow: state.overallRisk === 'warning' ? '0 0 10px #eab308' : 'none',
                    border: '1px solid #ca8a04'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: state.overallRisk === 'warning' ? '#a16207' : '#94a3b8' }}>
                    WARN (D26)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: state.overallRisk === 'critical' ? '#ef4444' : '#e2e8f0',
                    boxShadow: state.overallRisk === 'critical' ? '0 0 12px #ef4444' : 'none',
                    border: '1px solid #dc2626'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: state.overallRisk === 'critical' ? '#b91c1c' : '#94a3b8' }}>
                    CRIT (D27)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: state.coolingOn ? '#3b82f6' : '#e2e8f0',
                    boxShadow: state.coolingOn ? '0 0 10px #3b82f6' : 'none',
                    border: '1px solid #2563eb'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: state.coolingOn ? '#1d4ed8' : '#94a3b8' }}>
                    COOL (D23)
                  </span>
                </div>
              </div>

            </div>

            {/* Right Subpanel: GPIO Hardware Pushbuttons & Bridge Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Interactive Wokwi Pushbuttons */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Radio size={14} color="#0284c7" />
                  WOKWI Interactive Pushbuttons (Simulate ESP32 Physical Pins)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {/* Button 1: Door Switch (Pin 19) */}
                  <button
                    onClick={() => handleScenario('door-open')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: `2px solid ${state.doorOpen ? '#f97316' : '#cbd5e1'}`,
                      backgroundColor: state.doorOpen ? '#fff7ed' : '#ffffff',
                      color: state.doorOpen ? '#c2410c' : '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <DoorOpen size={18} color={state.doorOpen ? '#ea580c' : '#64748b'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700 }}>Door Pin 19</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{state.doorOpen ? 'OPEN (+2.5°C)' : 'CLOSED'}</span>
                  </button>

                  {/* Button 2: Compressor Fault (Pin 32) */}
                  <button
                    onClick={() => handleScenario('cooling-failure')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: `2px solid ${state.refrigeratorHealth === 'failed' ? '#ef4444' : '#cbd5e1'}`,
                      backgroundColor: state.refrigeratorHealth === 'failed' ? '#fef2f2' : '#ffffff',
                      color: state.refrigeratorHealth === 'failed' ? '#dc2626' : '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={18} color={state.refrigeratorHealth === 'failed' ? '#dc2626' : '#64748b'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700 }}>Fault Pin 32</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{state.refrigeratorHealth === 'failed' ? 'FAULT (+5°C)' : 'NOMINAL'}</span>
                  </button>

                  {/* Button 3: Solar Drop (Pin 33) */}
                  <button
                    onClick={() => handleScenario('solar-failure')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: `2px solid ${state.solarPower < 100 ? '#eab308' : '#cbd5e1'}`,
                      backgroundColor: state.solarPower < 100 ? '#fefce8' : '#ffffff',
                      color: state.solarPower < 100 ? '#a16207' : '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sun size={18} color={state.solarPower < 100 ? '#ca8a04' : '#64748b'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700 }}>Solar Pin 33</span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>{state.solarPower < 100 ? 'CLOUD (28W)' : '340W SUN'}</span>
                  </button>
                </div>
              </div>

              {/* Dual Sensors Telemetry Preview */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>DHT22 Cold Room Sensor (Pin 15)</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {state.temperature.toFixed(1)}°C <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>/ {state.humidity.toFixed(0)}% RH</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>DS18B20 1-Wire Food Core (Pin 4)</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                    {(state.temperature + 0.3).toFixed(1)}°C <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Pulp Temp</span>
                  </div>
                </div>
              </div>

              {/* Python Gateway Bridge Quickstart */}
              <div style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Terminal size={13} color="#0284c7" />
                    Wokwi Serial & Python Gateway Command:
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('python backend/wokwi_bridge.py --simulate');
                      alert('Copied command: python backend/wokwi_bridge.py --simulate');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Copy size={11} /> Copy CLI
                  </button>
                </div>

                <div style={{
                  padding: '6px 10px',
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>python backend/wokwi_bridge.py --simulate</span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                  Also supports live hardware via: <code style={{ color: '#0f172a' }}>--port COM3 --baud 115200</code>
                </div>
              </div>

            </div>
          </div>
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
