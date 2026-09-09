import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import { ColdStorageScene } from '../components/3d/ColdStorageScene';
import { Link } from 'react-router-dom';
import {
  Box,
  Layers,
  FileText,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export const TwinPage: React.FC = () => {
  const { state, selectedBatchId, triggerSimulation } = useTwin();
  const [activeTab, setActiveTab] = useState<'crates' | 'equipment'>('crates');

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Spatial Digital Twin // Facility {state.facilityId}
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            REAL-TIME RAYCAST ENGINE • HARDWARE MESH TELEMETRY BINDING
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className="btn btn-sm"
            onClick={() => triggerSimulation('reset')}
          >
            <RotateCcw size={11} />
            Reset Spatial Twin
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => triggerSimulation('cooling-failure')}
          >
            <Zap size={11} />
            Compressor Trip
          </button>
        </div>
      </div>

      {/* Main 3D Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '0.75rem' }}>
        {/* 3D Scene Viewport */}
        <div className="panel" style={{ marginBottom: 0, height: '620px', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title">
              <Box size={14} color="#0369a1" />
              Chamber Spatial Layout & Subsystems
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              <span>TEMP: <strong>{state.temperature}°C</strong></span>
              <span>CHILLER: <strong>{state.coolingOn ? 'ONLINE' : 'STOP'}</strong></span>
              <span>DOOR: <strong>{state.doorOpen ? 'AJAR' : 'SEALED'}</strong></span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <ColdStorageScene enableControls={true} />
          </div>

          <div style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--bg-surface-header)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            <span>LEFT CLICK + DRAG: ORBIT | RIGHT CLICK: PAN | SCROLL: ZOOM</span>
            <span>RAYCAST TARGET: CRATE SELECTION ACTIVE</span>
          </div>
        </div>

        {/* Side Diagnostic Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Diagnostic Tabs */}
          <div style={{ display: 'flex', gap: '2px', padding: '2px', backgroundColor: 'var(--bg-control)', borderRadius: 'var(--radius-sharp)' }}>
            <button
              style={{
                flex: 1,
                padding: '5px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 'var(--radius-sharp)',
                backgroundColor: activeTab === 'crates' ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === 'crates' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('crates')}
            >
              Produce Lot Diagnostics
            </button>
            <button
              style={{
                flex: 1,
                padding: '5px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: 'var(--radius-sharp)',
                backgroundColor: activeTab === 'equipment' ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === 'equipment' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('equipment')}
            >
              Hardware Nodes
            </button>
          </div>

          {activeTab === 'crates' ? (
            /* Selected Batch Details */
            <div className="panel" style={{ flex: 1, marginBottom: 0 }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Layers size={13} />
                  Selected Crate: {selectedBatch.id}
                </div>
                <span className={`badge badge-${selectedBatch.risk}`}>
                  {selectedBatch.risk}
                </span>
              </div>
              <div className="panel-body">
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>BOTANICAL TAXONOMY</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedBatch.variety}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedBatch.product}</div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                    <span>BIOLOGICAL FRESHNESS INDEX</span>
                    <span>{selectedBatch.qualityScore} / 100</span>
                  </div>
                  <div className="meter-container" style={{ height: '5px' }}>
                    <div
                      className={`meter-fill ${selectedBatch.risk}`}
                      style={{ width: `${selectedBatch.qualityScore}%` }}
                    />
                  </div>
                </div>

                <div className="inspector-field">
                  <span className="label">Remaining Shelf Life:</span>
                  <span className="val" style={{ color: selectedBatch.shelfLifeDays < 2 ? 'var(--scada-alarm)' : 'inherit' }}>
                    {selectedBatch.shelfLifeDays} Days
                  </span>
                </div>

                <div className="inspector-field">
                  <span className="label">Chamber Grid Coords:</span>
                  <span className="val">[{selectedBatch.cratePosition.join(', ')}]</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Lot Net Mass:</span>
                  <span className="val">{selectedBatch.quantityKg} kg</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Producer Entity:</span>
                  <span className="val" style={{ fontSize: '10px' }}>{selectedBatch.producerCoop}</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Harvest Timestamp:</span>
                  <span className="val">{selectedBatch.harvestDate}</span>
                </div>

                <div style={{ padding: '0.5rem 0.65rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', margin: '0.75rem 0', fontSize: '11px' }}>
                  <strong>Operational Protocol:</strong> {selectedBatch.recommendedAction}
                </div>

                <Link
                  to={`/batch/${selectedBatch.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.45rem', fontSize: '11px' }}
                >
                  <FileText size={12} />
                  Open Product Passport & Audit Ledger
                </Link>
              </div>
            </div>
          ) : (
            /* Subsystems Health */
            <div className="panel" style={{ flex: 1, marginBottom: 0 }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Info size={13} />
                  Facility Instrumentation Nodes
                </div>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ padding: '0.5rem 0.65rem', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>EVAPORATOR BLOWER [EVAP-01]</strong>
                    <span className={`badge badge-${state.refrigeratorHealth === 'failed' ? 'critical' : state.coolingOn ? 'safe' : 'warning'}`}>
                      {state.refrigeratorHealth.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    RATING: 1.8 kW | SPEED: {state.fanRpm} RPM | DUTY: {state.compressorDutyCycle}%
                  </div>
                </div>

                <div style={{ padding: '0.5rem 0.65rem', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>ROOFTOP SOLAR PV [PV-ARRAY-A]</strong>
                    <span className="badge badge-safe">ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    OUTPUT: {state.solarPower} W / {state.solarMaxPower} W PEAK | IRRADIANCE: 820 W/m²
                  </div>
                </div>

                <div style={{ padding: '0.5rem 0.65rem', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>LiFePO4 BATTERY BANK [BAT-01]</strong>
                    <span className={`badge badge-${state.batteryPercent < 20 ? 'critical' : 'safe'}`}>
                      {state.batteryPercent}% CHARGE
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    51.2 VDC BUS | CAPACITY: 2.4 kWh | ESTIMATED BUFFER: {(state.batteryPercent / 12).toFixed(1)} HRS
                  </div>
                </div>

                <div style={{ padding: '0.5rem 0.65rem', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: 'var(--bg-surface-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>INSULATED VAULT ACCESS DOOR</strong>
                    <span className={`badge badge-${state.doorOpen ? 'warning' : 'safe'}`}>
                      {state.doorOpen ? 'AJAR' : 'SEALED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    MAGNETIC REED SWITCH: {state.doorOpen ? 'CIRCUIT OPEN (Heat Ingress)' : 'COMPRESSION CLOSED'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
