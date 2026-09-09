import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import { ColdStorageScene } from '../components/3d/ColdStorageScene';
import { Link } from 'react-router-dom';
import {
  Box,
  Eye,
  Layers,
  Thermometer,
  ShieldCheck,
  FileText,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';

export const TwinPage: React.FC = () => {
  const { state, selectedBatchId, setSelectedBatchId, triggerSimulation } = useTwin();
  const [activeTab, setActiveTab] = useState<'crates' | 'equipment'>('crates');

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Page Title & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Interactive 3D Digital Twin Viewport
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Spatial representation of Facility {state.facilityId} • Real-time raycasting & mesh telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-sm"
            onClick={() => triggerSimulation('reset')}
          >
            <RotateCcw size={13} />
            Reset Camera & Twin
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => triggerSimulation('cooling-failure')}
          >
            <Zap size={13} />
            Trip Cooling Unit
          </button>
        </div>
      </div>

      {/* Main 3D Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '1.25rem' }}>
        {/* 3D Scene Viewport */}
        <div className="panel" style={{ marginBottom: 0, height: '620px', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title">
              <Box size={16} color="#0284c7" />
              Chamber Interior & Equipment Roster
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              <span>TEMP: <strong>{state.temperature}°C</strong></span>
              <span>COMPRESSOR: <strong>{state.coolingOn ? 'ON' : 'OFF'}</strong></span>
              <span>DOOR: <strong>{state.doorOpen ? 'AJAR' : 'CLOSED'}</strong></span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <ColdStorageScene enableControls={true} />
          </div>

          <div style={{ padding: '0.65rem 1rem', backgroundColor: '#fafbfd', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Controls: <strong>Left Click + Drag</strong> to Orbit | <strong>Right Click + Drag</strong> to Pan | <strong>Scroll</strong> to Zoom</span>
            <span>Click any tomato crate to focus metadata</span>
          </div>
        </div>

        {/* Side Diagnostic Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Diagnostic Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', padding: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
            <button
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '3px',
                backgroundColor: activeTab === 'crates' ? '#ffffff' : 'transparent',
                color: activeTab === 'crates' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('crates')}
            >
              Batch Crate Inspector
            </button>
            <button
              style={{
                flex: 1,
                padding: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '3px',
                backgroundColor: activeTab === 'equipment' ? '#ffffff' : 'transparent',
                color: activeTab === 'equipment' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('equipment')}
            >
              Hardware Subsystems
            </button>
          </div>

          {activeTab === 'crates' ? (
            /* Selected Batch Details */
            <div className="panel" style={{ flex: 1, marginBottom: 0 }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Layers size={15} />
                  Selected Crate: {selectedBatch.id}
                </div>
                <span className={`badge badge-${selectedBatch.risk}`}>
                  {selectedBatch.risk}
                </span>
              </div>
              <div className="panel-body">
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CROP & BOTANICAL VARIETY</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{selectedBatch.variety}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedBatch.product}</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>Biological Freshness Index</span>
                    <span className="font-mono">{selectedBatch.qualityScore} / 100</span>
                  </div>
                  <div className="meter-container" style={{ height: '8px' }}>
                    <div
                      className={`meter-fill ${selectedBatch.risk}`}
                      style={{ width: `${selectedBatch.qualityScore}%` }}
                    />
                  </div>
                </div>

                <div className="inspector-field">
                  <span className="label">Estimated Remaining Shelf Life:</span>
                  <span className="val" style={{ color: selectedBatch.shelfLifeDays < 2 ? 'var(--status-critical)' : '#0f172a' }}>
                    {selectedBatch.shelfLifeDays} Days
                  </span>
                </div>

                <div className="inspector-field">
                  <span className="label">Spatial Coordinates in Vault:</span>
                  <span className="val font-mono">[{selectedBatch.cratePosition.join(', ')}]</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Batch Net Weight:</span>
                  <span className="val">{selectedBatch.quantityKg} kg</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Producer Cooperative:</span>
                  <span className="val" style={{ fontSize: '0.75rem' }}>{selectedBatch.producerCoop}</span>
                </div>

                <div className="inspector-field">
                  <span className="label">Harvest Date:</span>
                  <span className="val">{selectedBatch.harvestDate}</span>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px', margin: '1rem 0', fontSize: '0.8rem' }}>
                  <strong>Operational Protocol:</strong> {selectedBatch.recommendedAction}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link
                    to={`/batch/${selectedBatch.id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                  >
                    <FileText size={14} />
                    Open Product Passport
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Subsystems Health */
            <div className="panel" style={{ flex: 1, marginBottom: 0 }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Info size={15} />
                  Facility Hardware Subsystems
                </div>
              </div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: '#fafbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Chilling Evaporator & Fan</strong>
                    <span className={`badge badge-${state.refrigeratorHealth === 'failed' ? 'critical' : state.coolingOn ? 'safe' : 'warning'}`}>
                      {state.refrigeratorHealth.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Speed: {state.fanRpm} RPM | Thermal load: {state.compressorDutyCycle}%
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: '#fafbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Solar PV Array (Roof)</strong>
                    <span className="badge badge-safe">ONLINE</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Output: {state.solarPower} W / {state.solarMaxPower} W peak | Influx: 820 W/m²
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: '#fafbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Lithium Battery Rack (LiFePO4)</strong>
                    <span className={`badge badge-${state.batteryPercent < 20 ? 'critical' : 'safe'}`}>
                      {state.batteryPercent}% CHARGE
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Voltage: 51.2 V | Estimated Run-time: {(state.batteryPercent / 12).toFixed(1)} hrs
                  </div>
                </div>

                <div style={{ padding: '0.75rem', border: '1px solid var(--border-subtle)', borderRadius: '4px', backgroundColor: '#fafbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Insulated Chamber Seal Door</strong>
                    <span className={`badge badge-${state.doorOpen ? 'warning' : 'safe'}`}>
                      {state.doorOpen ? 'AJAR' : 'SEALED'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Magnetic reed switch: {state.doorOpen ? 'CONTACT OPEN (Thermal Leak)' : 'SECURE'}
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
