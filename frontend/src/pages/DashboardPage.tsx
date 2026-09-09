import React from 'react';
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
  Maximize2,
  FileText,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { state, selectedBatchId, setSelectedBatchId, triggerSimulation } = useTwin();

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  const safeCount = state.batches.filter((b) => b.risk === 'safe').length;
  const warningCount = state.batches.filter((b) => b.risk === 'warning').length;
  const criticalCount = state.batches.filter((b) => b.risk === 'critical').length;

  return (
    <div className="dashboard-container">
      {/* Real-Time Facility Telemetry Strip */}
      <div className="telemetry-grid">
        {/* Core Temperature */}
        <div className={`metric-card ${state.temperature > 12 ? 'critical' : state.temperature > 8.5 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Chamber Temperature</span>
            <Thermometer size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.temperature}</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-meta">
            <span>Target: 4.0 - 8.0 °C</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.temperature > 12 ? 'EXCURSION' : state.temperature > 8.5 ? 'ELEVATED' : 'NOMINAL'}
            </span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className={`metric-card ${state.humidity > 92 || state.humidity < 70 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Relative Humidity</span>
            <Droplets size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.humidity}</span>
            <span className="metric-unit">% RH</span>
          </div>
          <div className="metric-meta">
            <span>Target: 80 - 90%</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.humidity > 92 ? 'MOLD RISK' : state.humidity < 70 ? 'DRYING RISK' : 'OPTIMAL'}
            </span>
          </div>
        </div>

        {/* Solar Generation */}
        <div className="metric-card safe">
          <div className="metric-label">
            <span>Solar PV Influx</span>
            <Sun size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.solarPower}</span>
            <span className="metric-unit">W</span>
          </div>
          <div className="metric-meta">
            <span>Array Max: {state.solarMaxPower} W</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.solarPower > 150 ? 'SURPLUS' : 'LOW RADIATION'}
            </span>
          </div>
        </div>

        {/* Battery State */}
        <div className={`metric-card ${state.batteryPercent < 20 ? 'critical' : state.batteryPercent < 40 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Lithium Storage</span>
            <BatteryCharging size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.batteryPercent}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-meta">
            <span>Capacity: 2.4 kWh</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.batteryPercent < 20 ? 'CRITICAL' : 'BUFFER OK'}
            </span>
          </div>
        </div>

        {/* Chiller Unit */}
        <div className={`metric-card ${state.refrigeratorHealth === 'failed' ? 'critical' : state.coolingOn ? 'safe' : 'warning'}`}>
          <div className="metric-label">
            <span>Refrigeration Loop</span>
            <Wind size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.coolingOn ? 'ACTIVE' : 'OFF'}</span>
            <span className="metric-unit" style={{ fontSize: '0.75rem' }}>{state.fanRpm} RPM</span>
          </div>
          <div className="metric-meta">
            <span>Compressor: {state.refrigeratorHealth.toUpperCase()}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.coolingOn ? 'COOLING' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Insulated Door */}
        <div className={`metric-card ${state.doorOpen ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Thermal Seal Door</span>
            <DoorClosed size={14} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.doorOpen ? 'AJAR' : 'SEALED'}</span>
          </div>
          <div className="metric-meta">
            <span>Access Reed Switch</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600 }}>
              {state.doorOpen ? 'HEAT LEAK' : 'ISOLATED'}
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendation Bar */}
      <div className={`recommendation-box ${state.overallRisk}`}>
        <div style={{ marginTop: '2px' }}>
          {state.overallRisk === 'critical' ? (
            <ShieldAlert size={18} color="var(--status-critical)" />
          ) : state.overallRisk === 'warning' ? (
            <AlertTriangle size={18} color="var(--status-warning)" />
          ) : (
            <CheckCircle2 size={18} color="var(--status-safe)" />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Operational Decision Support Advisory:
            </strong>
            <span className={`badge badge-${state.overallRisk}`}>
              RISK: {state.overallRisk.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {state.systemRecommendation}
          </p>
        </div>
        <div>
          <Link to="/simulation" className="btn btn-sm">
            <Sliders size={13} />
            Sim Lab
          </Link>
        </div>
      </div>

      {/* Split Main View: 3D Twin & Batch Triage */}
      <div className="split-layout">
        {/* Left Column: 3D Interactive Cold Storage Twin */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Thermometer size={15} color="#0284c7" />
              Live 3D Digital Twin Viewport (Click crates to inspect)
            </div>
            <div className="panel-actions">
              <Link to="/twin" className="btn btn-sm" title="Expand Fullscreen 3D">
                <Maximize2 size={12} />
                Full 3D
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <ColdStorageScene />
          </div>
          <div style={{ padding: '0.65rem 1rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Interactive Raycast: Click on any colored crate to inspect batch parameters.</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, backgroundColor: '#15803d', borderRadius: 2 }} /> Safe (&ge;75)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, backgroundColor: '#d97706', borderRadius: 2 }} /> Warning (45-74)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 8, height: 8, backgroundColor: '#dc2626', borderRadius: 2 }} /> Critical (&lt;45)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Batch Inspector & Triage Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Inventory Health Summary */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Info size={15} />
                Inventory Triage Summary
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                6 Total Batches (207.5 kg)
              </span>
            </div>
            <div className="panel-body" style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1, padding: '0.65rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#166534', fontFamily: 'var(--font-mono)' }}>{safeCount}</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#166534', fontWeight: 600 }}>Safe Batches</div>
              </div>
              <div style={{ flex: 1, padding: '0.65rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309', fontFamily: 'var(--font-mono)' }}>{warningCount}</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#b45309', fontWeight: 600 }}>Warning Lots</div>
              </div>
              <div style={{ flex: 1, padding: '0.65rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b91c1c', fontFamily: 'var(--font-mono)' }}>{criticalCount}</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#b91c1c', fontWeight: 600 }}>Critical Triage</div>
              </div>
            </div>
          </div>

          {/* Selected Batch Inspector Card */}
          {selectedBatch && (
            <div className="panel inspector-panel" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Lot</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedBatch.id}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedBatch.variety}</div>
                </div>
                <span className={`badge badge-${selectedBatch.risk}`}>
                  {selectedBatch.risk.toUpperCase()}
                </span>
              </div>

              {/* Quality Score Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span>Biological Freshness Index</span>
                  <span className="font-mono">{selectedBatch.qualityScore} / 100</span>
                </div>
                <div className="meter-container">
                  <div
                    className={`meter-fill ${selectedBatch.risk}`}
                    style={{ width: `${selectedBatch.qualityScore}%` }}
                  />
                </div>
              </div>

              <div className="inspector-field">
                <span className="label">Remaining Shelf Life:</span>
                <span className="val" style={{ color: selectedBatch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>
                  {selectedBatch.shelfLifeDays} Days
                </span>
              </div>

              <div className="inspector-field">
                <span className="label">Quantity Monitored:</span>
                <span className="val">{selectedBatch.quantityKg} kg</span>
              </div>

              <div className="inspector-field">
                <span className="label">Harvest Date:</span>
                <span className="val">{selectedBatch.harvestDate}</span>
              </div>

              <div className="inspector-field">
                <span className="label">Producer Cooperative:</span>
                <span className="val" style={{ fontSize: '0.75rem' }}>{selectedBatch.producerCoop}</span>
              </div>

              <div className="inspector-field">
                <span className="label">Compliance Status:</span>
                <span className="val" style={{ fontSize: '0.75rem' }}>{selectedBatch.inspectionStatus}</span>
              </div>

              {/* Action advice */}
              <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid var(--border-subtle)', margin: '0.85rem 0', fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                <strong>Recommendation:</strong> {selectedBatch.recommendedAction}
              </div>

              {/* Link to Passport */}
              <Link
                to={`/batch/${selectedBatch.id}`}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.55rem', fontSize: '0.8125rem' }}
              >
                <FileText size={14} />
                Open QR Product Passport
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Quick Demo Simulator Buttons */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Sliders size={14} />
                Presenter Scenario Bar
              </div>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => triggerSimulation('cooling-failure')}
              >
                Cooling Trip
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => triggerSimulation('door-open')}
              >
                {state.doorOpen ? 'Close Door' : 'Door Ajar (30m)'}
              </button>
              <button
                className="btn btn-sm"
                onClick={() => triggerSimulation('solar-failure')}
              >
                Solar Shading
              </button>
              <button
                className="btn btn-sm"
                onClick={() => triggerSimulation('reset')}
              >
                Reset Nominal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Inventory Table */}
      <div className="panel" style={{ marginTop: '1.25rem' }}>
        <div className="panel-header">
          <div className="panel-title">
            <span>Facility Batch Roster</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>| First-Expired, First-Out (FEFO) Order</span>
          </div>
          <Link to="/batches" className="btn btn-sm">
            Manage All Batches →
          </Link>
        </div>
        <div className="table-container">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Variety</th>
                <th>Cooperative</th>
                <th>Quantity</th>
                <th>Quality Score</th>
                <th>Shelf Life</th>
                <th>Risk State</th>
                <th>Compliance</th>
                <th>Action</th>
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
                  <td className="font-mono" style={{ fontWeight: 700 }}>
                    {batch.id}
                  </td>
                  <td>{batch.variety}</td>
                  <td>{batch.producerCoop}</td>
                  <td className="font-mono">{batch.quantityKg} kg</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ width: '32px' }}>{batch.qualityScore}%</span>
                      <div className="meter-container" style={{ width: '80px', marginTop: 0 }}>
                        <div
                          className={`meter-fill ${batch.risk}`}
                          style={{ width: `${batch.qualityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: batch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>
                    {batch.shelfLifeDays} days
                  </td>
                  <td>
                    <span className={`badge badge-${batch.risk}`}>
                      {batch.risk}
                    </span>
                  </td>
                  <td>{batch.inspectionStatus}</td>
                  <td>
                    <Link
                      to={`/batch/${batch.id}`}
                      className="btn btn-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Passport
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
