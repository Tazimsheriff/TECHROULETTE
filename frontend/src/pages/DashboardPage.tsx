import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import { ColdStorageScene } from '../components/3d/ColdStorageScene';
import {
  Thermometer,
  Droplets,
  Sun,
  BatteryCharging,
  Wind,
  DoorClosed,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileText,
  ShieldAlert,
  ArrowRight,
  Box,
  Activity,
  Layers
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { state, selectedBatchId, setSelectedBatchId, triggerSimulation } = useTwin();
  const [activeTab, setActiveTab] = useState<'twin' | 'sensors' | 'batches'>('twin');

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  const safeCount = state.batches.filter((b) => b.risk === 'safe').length;
  const warningCount = state.batches.filter((b) => b.risk === 'warning').length;
  const criticalCount = state.batches.filter((b) => b.risk === 'critical').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* High-Level Human Status Card */}
      <div className={`recommendation-box ${state.overallRisk}`} style={{ margin: 0 }}>
        <div style={{ marginTop: '2px' }}>
          {state.overallRisk === 'critical' ? (
            <ShieldAlert size={22} color="var(--status-critical)" />
          ) : state.overallRisk === 'warning' ? (
            <AlertTriangle size={22} color="var(--status-warning)" />
          ) : (
            <CheckCircle2 size={22} color="var(--status-safe)" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
              {state.overallRisk === 'critical'
                ? 'Action Required: Cold Storage Alert'
                : state.overallRisk === 'warning'
                ? 'Notice: Storage Conditions Need Attention'
                : 'All Systems Normal: Produce is Safe and Cold'}
            </h2>
            <span className={`badge badge-${state.overallRisk}`}>
              {state.overallRisk.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {state.systemRecommendation}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/simulation" className="btn btn-sm">
            <Sliders size={13} />
            Test Scenarios
          </Link>
        </div>
      </div>

      {/* Main View Tabs (Separating content so nothing feels stuffed) */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === 'twin' ? 'active' : ''}`}
          onClick={() => setActiveTab('twin')}
        >
          <Box size={16} />
          3D Cold-Room Twin & Produce
        </button>
        <button
          className={`tab-btn ${activeTab === 'sensors' ? 'active' : ''}`}
          onClick={() => setActiveTab('sensors')}
        >
          <Activity size={16} />
          Temperature & Facility Sensors ({state.temperature}°C)
        </button>
        <button
          className={`tab-btn ${activeTab === 'batches' ? 'active' : ''}`}
          onClick={() => setActiveTab('batches')}
        >
          <Layers size={16} />
          Produce Inventory & Lifespan ({state.batches.length} Lots)
        </button>
      </div>

      {/* TAB 1: 3D Twin & Produce Inspection */}
      {activeTab === 'twin' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* 3D Scene */}
          <div className="panel" style={{ margin: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Box size={15} color="#0284c7" />
                Virtual Cold-Room View (Click any crate to inspect)
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Click & drag to orbit • Scroll to zoom
              </span>
            </div>
            <ColdStorageScene />
            <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#fafbfc', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Crate Colors:</span>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: '#15803d', borderRadius: 2 }} /> Green = Fresh (&ge;75)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: '#b45309', borderRadius: 2 }} /> Yellow = Aging (45-74)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: '#b91c1c', borderRadius: 2 }} /> Red = Spoilage Risk (&lt;45)
                </span>
              </div>
            </div>
          </div>

          {/* Clean Crate Inspector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick Summary Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--status-safe-bg)', border: '1px solid var(--status-safe-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-safe)', fontFamily: 'var(--font-mono)' }}>{safeCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--status-safe)', fontWeight: 600, textTransform: 'uppercase' }}>Fresh Lots</div>
              </div>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-warning)', fontFamily: 'var(--font-mono)' }}>{warningCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--status-warning)', fontWeight: 600, textTransform: 'uppercase' }}>Aging Lots</div>
              </div>
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>{criticalCount}</div>
                <div style={{ fontSize: '11px', color: 'var(--status-critical)', fontWeight: 600, textTransform: 'uppercase' }}>At Risk</div>
              </div>
            </div>

            {/* Selected Crate Details */}
            {selectedBatch && (
              <div className="panel" style={{ margin: 0 }}>
                <div className="panel-header">
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Crate</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '2px 0 0' }}>{selectedBatch.id} — {selectedBatch.variety}</h3>
                  </div>
                  <span className={`badge badge-${selectedBatch.risk}`}>
                    {selectedBatch.risk.toUpperCase()}
                  </span>
                </div>

                <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Freshness Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                      <span>Produce Freshness Score</span>
                      <span className="font-mono">{selectedBatch.qualityScore}%</span>
                    </div>
                    <div className="meter-container" style={{ height: '8px' }}>
                      <div className={`meter-fill ${selectedBatch.risk}`} style={{ width: `${selectedBatch.qualityScore}%` }} />
                    </div>
                  </div>

                  <div className="inspector-field">
                    <span className="label">Remaining Good Days:</span>
                    <span className="val" style={{ fontSize: '14px', color: selectedBatch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>
                      {selectedBatch.shelfLifeDays} Days Left
                    </span>
                  </div>

                  <div className="inspector-field">
                    <span className="label">Total Quantity:</span>
                    <span className="val">{selectedBatch.quantityKg} kg</span>
                  </div>

                  <div className="inspector-field">
                    <span className="label">Farmer Cooperative:</span>
                    <span className="val" style={{ fontSize: '12px' }}>{selectedBatch.producerCoop}</span>
                  </div>

                  <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '13px', lineHeight: 1.5 }}>
                    <strong>Recommended Action:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {selectedBatch.recommendedAction}
                    </div>
                  </div>

                  <Link
                    to={`/batch/${selectedBatch.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem' }}
                  >
                    <FileText size={15} />
                    View Lot Passport & QR Code
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Simple One-Click Demo Bar */}
            <div className="panel" style={{ margin: 0 }}>
              <div className="panel-header">
                <div className="panel-title">
                  <Sliders size={14} />
                  Demonstration Controls (Try a failure)
                </div>
              </div>
              <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => triggerSimulation('cooling-failure')}
                >
                  Cooling Failure
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => triggerSimulation('door-open')}
                >
                  {state.doorOpen ? 'Close Door' : 'Door Left Open'}
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => triggerSimulation('solar-failure')}
                >
                  Monsoon Cloud Cover
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => triggerSimulation('reset')}
                >
                  Reset to Normal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Clean, Spacious Sensors View */}
      {activeTab === 'sensors' && (
        <div>
          <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Real-time measurements from the cold-storage unit. The optimal temperature for tomatoes is between <strong>4.0°C and 8.0°C</strong>.
          </div>

          <div className="telemetry-grid">
            {/* Core Temperature */}
            <div className={`metric-card ${state.temperature > 12 ? 'critical' : state.temperature > 8.5 ? 'warning' : 'safe'}`}>
              <div className="metric-label">
                <span>Room Temperature</span>
                <Thermometer size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{state.temperature}</span>
                <span className="metric-unit">°C</span>
              </div>
              <div className="metric-meta">
                <span>Healthy Range: 4°C - 8°C</span>
                <span style={{ fontWeight: 700, color: state.temperature > 12 ? 'var(--status-critical)' : 'inherit' }}>
                  {state.temperature > 12 ? 'Too Warm!' : state.temperature > 8.5 ? 'Elevated' : 'Safe'}
                </span>
              </div>
            </div>

            {/* Relative Humidity */}
            <div className={`metric-card ${state.humidity > 92 || state.humidity < 70 ? 'warning' : 'safe'}`}>
              <div className="metric-label">
                <span>Air Humidity</span>
                <Droplets size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{state.humidity}</span>
                <span className="metric-unit">%</span>
              </div>
              <div className="metric-meta">
                <span>Target: 80% - 90%</span>
                <span style={{ fontWeight: 700 }}>
                  {state.humidity > 92 ? 'Moist / Condensation' : 'Good Moisture'}
                </span>
              </div>
            </div>

            {/* Solar Generation */}
            <div className="metric-card safe">
              <div className="metric-label">
                <span>Solar Generation</span>
                <Sun size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{state.solarPower}</span>
                <span className="metric-unit">Watts</span>
              </div>
              <div className="metric-meta">
                <span>Rooftop Solar Array</span>
                <span style={{ fontWeight: 700, color: state.solarPower > 100 ? 'var(--status-safe)' : 'var(--status-warning)' }}>
                  {state.solarPower > 100 ? 'Powering Chiller' : 'Low Sunlight'}
                </span>
              </div>
            </div>

            {/* Battery State */}
            <div className={`metric-card ${state.batteryPercent < 20 ? 'critical' : state.batteryPercent < 40 ? 'warning' : 'safe'}`}>
              <div className="metric-label">
                <span>Backup Battery</span>
                <BatteryCharging size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value">{state.batteryPercent}</span>
                <span className="metric-unit">%</span>
              </div>
              <div className="metric-meta">
                <span>Estimated Runtime</span>
                <span style={{ fontWeight: 700 }}>
                  ~{(state.batteryPercent / 12).toFixed(1)} Hours Backup
                </span>
              </div>
            </div>

            {/* Chiller Evaporator */}
            <div className={`metric-card ${state.refrigeratorHealth === 'failed' ? 'critical' : state.coolingOn ? 'safe' : 'warning'}`}>
              <div className="metric-label">
                <span>Cooling System</span>
                <Wind size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value" style={{ fontSize: '1.5rem', paddingTop: '4px' }}>
                  {state.coolingOn ? 'Active' : 'Off'}
                </span>
                <span className="metric-unit font-mono">{state.fanRpm} RPM</span>
              </div>
              <div className="metric-meta">
                <span>Compressor Status</span>
                <span style={{ fontWeight: 700 }}>
                  {state.coolingOn ? 'Chilling Room' : 'Stopped'}
                </span>
              </div>
            </div>

            {/* Insulated Door */}
            <div className={`metric-card ${state.doorOpen ? 'warning' : 'safe'}`}>
              <div className="metric-label">
                <span>Cold Room Door</span>
                <DoorClosed size={16} />
              </div>
              <div className="metric-value-row">
                <span className="metric-value" style={{ fontSize: '1.5rem', paddingTop: '4px' }}>
                  {state.doorOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="metric-meta">
                <span>Magnetic Sensor</span>
                <span style={{ fontWeight: 700 }}>
                  {state.doorOpen ? 'Heat Leaking In' : 'Properly Sealed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Clean, Spacious Produce Table */}
      {activeTab === 'batches' && (
        <div className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>All Stored Produce Lots</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Sorted by First-Expired, First-Out (FEFO) so operators know which crates to sell or ship first.
              </p>
            </div>
            <Link to="/batches" className="btn btn-sm">
              Open Full Batch Ledger &rarr;
            </Link>
          </div>

          <div className="table-container">
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Variety</th>
                  <th>Farmer Cooperative</th>
                  <th>Weight</th>
                  <th>Freshness</th>
                  <th>Remaining Shelf Life</th>
                  <th>Status</th>
                  <th>Recommended Action</th>
                  <th>QR Passport</th>
                </tr>
              </thead>
              <tbody>
                {state.batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className={selectedBatchId === batch.id ? 'selected' : ''}
                    onClick={() => setSelectedBatchId(batch.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="font-mono" style={{ fontWeight: 700 }}>{batch.id}</td>
                    <td>{batch.variety}</td>
                    <td>{batch.producerCoop}</td>
                    <td>{batch.quantityKg} kg</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="font-mono" style={{ width: '32px' }}>{batch.qualityScore}%</span>
                        <div className="meter-container" style={{ width: '70px', marginTop: 0 }}>
                          <div className={`meter-fill ${batch.risk}`} style={{ width: `${batch.qualityScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: batch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>
                      {batch.shelfLifeDays} days
                    </td>
                    <td>
                      <span className={`badge badge-${batch.risk}`}>
                        {batch.risk}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', maxWidth: '280px' }}>{batch.recommendedAction}</td>
                    <td>
                      <Link
                        to={`/batch/${batch.id}`}
                        className="btn btn-sm btn-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText size={12} />
                        Passport
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
