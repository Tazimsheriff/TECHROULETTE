import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTwin } from '../context/TwinContext';
import {
  ShieldCheck,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BatchPassportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, inspectBatch } = useTwin();

  const batch = state.batches.find((b) => b.id.toUpperCase() === (id || '').toUpperCase()) || state.batches[0];
  const passportUrl = window.location.href;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Navigation Breadcrumb */}
      <div>
        <Link to="/batches" className="btn btn-sm" style={{ display: 'inline-flex', gap: '4px' }}>
          <ArrowLeft size={11} /> Return to Batch Ledger
        </Link>
      </div>

      {/* Official Phyto-Digital Product Passport Document */}
      <div className="panel" style={{ border: '2px solid var(--steel-slate)' }}>
        {/* Document Header */}
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--steel-slate)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              <ShieldCheck size={14} color="#38bdf8" />
              UN-FAO SSTC CODEX STANDARD • DIGITAL PRODUCT PASSPORT
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '2px 0' }}>
              LOT PASSPORT: {batch.id}
            </h1>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
              {batch.variety} • {batch.product}
            </div>
          </div>

          <div>
            <span className={`badge badge-${batch.risk}`} style={{ fontSize: '11px', padding: '0.25rem 0.6rem' }}>
              RISK: {batch.risk.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Passport Document Grid */}
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
            {/* Left: Origin & Cold-Chain Excursion Log */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                Provenance & Physical Custody Chain
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '0.75rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Producer Entity</div>
                  <div style={{ fontWeight: 600 }}>{batch.producerCoop}</div>
                </div>

                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orchard / Farm Origin</div>
                  <div style={{ fontWeight: 600 }}>{batch.originLocation}</div>
                </div>

                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Harvest Date</div>
                  <div style={{ fontWeight: 600 }}>{batch.harvestDate}</div>
                </div>

                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monitored Net Mass</div>
                  <div style={{ fontWeight: 600 }}>{batch.quantityKg} kg</div>
                </div>
              </div>

              {/* Quality Index */}
              <div style={{ padding: '0.65rem', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-hairline)', borderRadius: '2px', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '11px' }}>
                  <span style={{ fontWeight: 700 }}>BIOLOGICAL FRESHNESS SCORE</span>
                  <span style={{ fontWeight: 700 }}>{batch.qualityScore} / 100</span>
                </div>
                <div className="meter-container" style={{ height: '6px', marginBottom: '6px' }}>
                  <div className={`meter-fill ${batch.risk}`} style={{ width: `${batch.qualityScore}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                  <span>REMAINING SHELF LIFE: <strong>{batch.shelfLifeDays} DAYS</strong></span>
                  <span>INSPECTION STATUS: <strong>{batch.inspectionStatus}</strong></span>
                </div>
              </div>

              {/* Temperature Excursion History Graph */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontWeight: 700 }}>TEMPERATURE LOG (°C)</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TARGET: 4.0 - 8.0 °C</span>
                </div>
                <div style={{ height: '160px', width: '100%', backgroundColor: '#ffffff', border: '1px solid var(--border-hairline)', padding: '6px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={batch.temperatureHistory}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                      <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                      <YAxis domain={[4, 16]} stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                      <Tooltip />
                      <Line
                        type="stepAfter"
                        dataKey="temperature"
                        stroke={batch.risk === 'critical' ? '#dc2626' : '#0369a1'}
                        strokeWidth={1.5}
                        dot={{ r: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quality Directive */}
              <div style={{ padding: '0.5rem 0.65rem', backgroundColor: 'var(--bg-surface-subtle)', borderLeft: '3px solid var(--steel-slate)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <strong>ASSURANCE DIRECTIVE:</strong> {batch.recommendedAction}
              </div>
            </div>

            {/* Right: Scannable QR Code & Audit Seals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid var(--border-hairline)', paddingLeft: '1.25rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                  FIELD SCANNABLE QR
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  VERIFIED PRODUCT PASSPORT
                </div>
              </div>

              {/* QR Box */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '2px',
                marginBottom: '0.65rem'
              }}>
                <QRCodeSVG
                  value={passportUrl}
                  size={140}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                CERT-HASH: {batch.id}-SEC-2026
              </div>

              {/* Compliance Badge */}
              <div style={{ width: '100%', padding: '0.5rem', backgroundColor: 'var(--scada-normal-bg)', border: '1px solid var(--scada-normal-border)', borderRadius: '2px', textAlign: 'center', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={14} color="var(--scada-normal)" style={{ margin: '0 auto 2px' }} />
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--scada-normal)', fontFamily: 'var(--font-mono)' }}>
                  {batch.complianceCertification}
                </div>
                <div style={{ fontSize: '9px', color: 'var(--scada-normal)', fontFamily: 'var(--font-mono)' }}>
                  SOUTH-SOUTH COLD CHAIN CERTIFIED
                </div>
              </div>

              {/* Inspector Manual Actions */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Inspector Actions:
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => inspectBatch(batch.id, 'certify')}
                >
                  <FileCheck size={11} />
                  Certify Quality Audit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => inspectBatch(batch.id, 'quarantine')}
                >
                  <ShieldAlert size={11} />
                  Issue Quarantine
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => inspectBatch(batch.id, 'dispatch')}
                >
                  FEFO Fast-Track
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
