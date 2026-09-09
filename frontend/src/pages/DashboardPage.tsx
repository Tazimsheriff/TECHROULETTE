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
  ArrowRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { state, selectedBatchId, setSelectedBatchId, triggerSimulation } = useTwin();

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  const safeCount = state.batches.filter((b) => b.risk === 'safe').length;
  const warningCount = state.batches.filter((b) => b.risk === 'warning').length;
  const criticalCount = state.batches.filter((b) => b.risk === 'critical').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* SCADA Instrument Telemetry Strip */}
      <div className="telemetry-grid">
        {/* Core Temperature */}
        <div className={`metric-card ${state.temperature > 12 ? 'critical' : state.temperature > 8.5 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>PV: Chamber Temperature</span>
            <Thermometer size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.temperature}</span>
            <span className="metric-unit">°C</span>
          </div>
          <div className="metric-meta">
            <span>SP: 6.0°C | TOL: ±2.0°C</span>
            <span style={{ fontWeight: 700, color: state.temperature > 12 ? 'var(--scada-alarm)' : 'inherit' }}>
              {state.temperature > 12 ? 'EXCURSION' : state.temperature > 8.5 ? 'WARNING' : 'NORMAL'}
            </span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className={`metric-card ${state.humidity > 92 || state.humidity < 70 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Chamber Humidity</span>
            <Droplets size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.humidity}</span>
            <span className="metric-unit">% RH</span>
          </div>
          <div className="metric-meta">
            <span>RANGE: 80 - 90%</span>
            <span style={{ fontWeight: 700 }}>
              {state.humidity > 92 ? 'CONDENSATION' : state.humidity < 70 ? 'TRANSPIRATION' : 'OPTIMAL'}
            </span>
          </div>
        </div>

        {/* Solar Generation */}
        <div className="metric-card safe">
          <div className="metric-label">
            <span>Solar PV Generation</span>
            <Sun size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.solarPower}</span>
            <span className="metric-unit">W</span>
          </div>
          <div className="metric-meta">
            <span>CAPACITY: {state.solarMaxPower} W</span>
            <span style={{ fontWeight: 700, color: state.solarPower > 100 ? 'var(--scada-normal)' : 'var(--scada-warning)' }}>
              {state.solarPower > 100 ? 'SOLAR ACTIVE' : 'DIFFUSE SKY'}
            </span>
          </div>
        </div>

        {/* Battery State */}
        <div className={`metric-card ${state.batteryPercent < 20 ? 'critical' : state.batteryPercent < 40 ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>LiFePO4 Reserve</span>
            <BatteryCharging size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{state.batteryPercent}</span>
            <span className="metric-unit">%</span>
          </div>
          <div className="metric-meta">
            <span>EST: {(state.batteryPercent / 12).toFixed(1)} HRS RUNTIME</span>
            <span style={{ fontWeight: 700 }}>
              {state.batteryPercent < 20 ? 'SHED LOAD' : 'BUFFER OK'}
            </span>
          </div>
        </div>

        {/* Chiller Evaporator */}
        <div className={`metric-card ${state.refrigeratorHealth === 'failed' ? 'critical' : state.coolingOn ? 'safe' : 'warning'}`}>
          <div className="metric-label">
            <span>Chiller Compressor</span>
            <Wind size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value" style={{ fontSize: '1.25rem', paddingTop: '4px' }}>
              {state.coolingOn ? 'RUNNING' : 'OFFLINE'}
            </span>
            <span className="metric-unit font-mono">{state.fanRpm} RPM</span>
          </div>
          <div className="metric-meta">
            <span>HEALTH: {state.refrigeratorHealth.toUpperCase()}</span>
            <span style={{ fontWeight: 700 }}>
              {state.coolingOn ? 'DUTY 65%' : 'STANDSTILL'}
            </span>
          </div>
        </div>

        {/* Insulated Door */}
        <div className={`metric-card ${state.doorOpen ? 'warning' : 'safe'}`}>
          <div className="metric-label">
            <span>Insulated Door</span>
            <DoorClosed size={12} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value" style={{ fontSize: '1.25rem', paddingTop: '4px' }}>
              {state.doorOpen ? 'AJAR' : 'SEALED'}
            </span>
          </div>
          <div className="metric-meta">
            <span>REED CONTACT #1</span>
            <span style={{ fontWeight: 700 }}>
              {state.doorOpen ? 'THERMAL LEAK' : 'SECURE'}
            </span>
          </div>
        </div>
      </div>

      {/* Actionable Decision Support Advisory */}
      <div className={`recommendation-box ${state.overallRisk}`}>
        <div style={{ marginTop: '2px' }}>
          {state.overallRisk === 'critical' ? (
            <ShieldAlert size={16} color="var(--scada-alarm)" />
          ) : state.overallRisk === 'warning' ? (
            <AlertTriangle size={16} color="var(--scada-warning)" />
          ) : (
            <CheckCircle2 size={16} color="var(--scada-normal)" />
          )}
        </div>
        <div style={{ flex: 1, fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
              DECISION SUPPORT ADVISORY:
            </span>
            <span className={`badge badge-${state.overallRisk}`}>
              SYSTEM STATUS: {state.overallRisk.toUpperCase()}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            {state.systemRecommendation}
          </p>
        </div>
        <div>
          <Link to="/simulation" className="btn btn-sm">
            <Sliders size={11} />
            Diagnostic Lab
          </Link>
        </div>
      </div>

      {/* Split Main View: 3D Twin & Batch Triage */}
      <div className="split-layout">
        {/* Left Column: 3D Interactive Cold Storage Twin */}
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Thermometer size={13} color="#0369a1" />
              Spatial Cold Storage Twin [3D Viewport]
            </div>
            <div className="panel-actions">
              <Link to="/twin" className="btn btn-sm" title="Expand Fullscreen 3D">
                <Maximize2 size={11} />
                Expand View
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <ColdStorageScene />
          </div>
          <div style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--bg-surface-header)', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>RAYCAST INTERACTION: CLICK ANY CRATE TO LOAD LOT PARAMETERS</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, backgroundColor: '#15803d', borderRadius: 1 }} /> SAFE (&ge;75)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, backgroundColor: '#b45309', borderRadius: 1 }} /> WARNING (45-74)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: 6, height: 6, backgroundColor: '#b91c1c', borderRadius: 1 }} /> CRITICAL (&lt;45)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Triage Summary & Selected Crate Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Inventory Health Summary */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                Lot Health Triage Distribution
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                6 LOTS (207.5 KG)
              </span>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', padding: '0.5rem' }}>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--scada-normal-bg)', border: '1px solid var(--scada-normal-border)', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--scada-normal)', fontFamily: 'var(--font-mono)' }}>{safeCount}</div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--scada-normal)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Safe Lots</div>
              </div>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--scada-warning-bg)', border: '1px solid var(--scada-warning-border)', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--scada-warning)', fontFamily: 'var(--font-mono)' }}>{warningCount}</div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--scada-warning)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Watch Lots</div>
              </div>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--scada-alarm-bg)', border: '1px solid var(--scada-alarm-border)', borderRadius: '2px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--scada-alarm)', fontFamily: 'var(--font-mono)' }}>{criticalCount}</div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--scada-alarm)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Triage Lots</div>
              </div>
            </div>
          </div>

          {/* Selected Batch Inspector Card */}
          {selectedBatch && (
            <div className="panel inspector-panel" style={{ marginBottom: 0, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>ACTIVE SELECTION</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', lineHeight: 1.1 }}>{selectedBatch.id}</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedBatch.variety}</div>
                </div>
                <span className={`badge badge-${selectedBatch.risk}`}>
                  {selectedBatch.risk.toUpperCase()}
                </span>
              </div>

              {/* Quality Score Bar */}
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  <span>FRESHNESS RETENTION</span>
                  <span>{selectedBatch.qualityScore} / 100</span>
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
                <span className="val" style={{ color: selectedBatch.shelfLifeDays < 2 ? 'var(--scada-alarm)' : 'inherit' }}>
                  {selectedBatch.shelfLifeDays} Days
                </span>
              </div>

              <div className="inspector-field">
                <span className="label">Monitored Quantity:</span>
                <span className="val">{selectedBatch.quantityKg} kg</span>
              </div>

              <div className="inspector-field">
                <span className="label">Harvest Date:</span>
                <span className="val">{selectedBatch.harvestDate}</span>
              </div>

              <div className="inspector-field">
                <span className="label">Cooperative:</span>
                <span className="val" style={{ fontSize: '10px' }}>{selectedBatch.producerCoop}</span>
              </div>

              <div className="inspector-field">
                <span className="label">Compliance:</span>
                <span className="val" style={{ fontSize: '10px' }}>{selectedBatch.inspectionStatus}</span>
              </div>

              <div style={{ padding: '0.45rem 0.6rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '2px', border: '1px solid var(--border-hairline)', margin: '0.5rem 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <strong>Directive:</strong> {selectedBatch.recommendedAction}
              </div>

              <Link
                to={`/batch/${selectedBatch.id}`}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.4rem', fontSize: '11px' }}
              >
                <FileText size={12} />
                Open QR Product Passport
                <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* Quick Scenario Test Bench */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                Quick Fault Test Bench
              </div>
            </div>
            <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '0.45rem' }}>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => triggerSimulation('cooling-failure')}
              >
                Cooling Fault
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => triggerSimulation('door-open')}
              >
                {state.doorOpen ? 'Close Door' : 'Door Ajar (30m)'}
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => triggerSimulation('solar-failure')}
              >
                Solar Shading
              </button>
              <button
                className="btn btn-sm"
                onClick={() => triggerSimulation('reset')}
              >
                Reset State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabular Batch Dispatch Ledger */}
      <div className="panel" style={{ marginTop: '0.25rem' }}>
        <div className="panel-header">
          <div className="panel-title">
            Facility Produce Dispatch Ledger [FEFO Priority Order]
          </div>
          <Link to="/batches" className="btn btn-sm">
            View Full Inventory Ledger &rarr;
          </Link>
        </div>
        <div className="table-container">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Lot ID</th>
                <th>Variety</th>
                <th>Cooperative Entity</th>
                <th>Net Kg</th>
                <th>Quality Score</th>
                <th>Remaining Shelf Life</th>
                <th>Risk State</th>
                <th>Inspection Protocol</th>
                <th>Audit</th>
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
                  <td style={{ fontWeight: 700 }}>{batch.id}</td>
                  <td>{batch.variety}</td>
                  <td>{batch.producerCoop}</td>
                  <td>{batch.quantityKg} kg</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '28px' }}>{batch.qualityScore}%</span>
                      <div className="meter-container" style={{ width: '60px', marginTop: 0 }}>
                        <div
                          className={`meter-fill ${batch.risk}`}
                          style={{ width: `${batch.qualityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: batch.shelfLifeDays < 2 ? 'var(--scada-alarm)' : 'inherit' }}>
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
