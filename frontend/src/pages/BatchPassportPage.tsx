import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTwin } from '../context/TwinContext';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Weight,
  Thermometer,
  FileCheck,
  AlertTriangle,
  ArrowLeft,
  Download,
  Share2,
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button */}
      <div>
        <Link to="/batches" className="btn btn-sm" style={{ display: 'inline-flex', gap: '4px' }}>
          <ArrowLeft size={14} /> Back to Batch Inventory
        </Link>
      </div>

      {/* Main Passport Document Card */}
      <div className="panel" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-strong)' }}>
        {/* Passport Header */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#0f172a',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
              <ShieldCheck size={16} color="#38bdf8" />
              FAO-SSC Traceability Protocol • Digital Product Passport
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0.25rem 0' }}>
              BATCH {batch.id}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {batch.variety} • {batch.product}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`badge badge-${batch.risk}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
              RISK: {batch.risk.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Passport Content Layout */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Left Column: Provenance & Technical Metrics */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>
                Batch Provenance & Chain of Custody
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Producer Collective</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{batch.producerCoop}</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Farm Location</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{batch.originLocation}</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Harvest Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{batch.harvestDate}</div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monitored Weight</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{batch.quantityKg} kg</div>
                </div>
              </div>

              {/* Quality & Shelf Life Score */}
              <div style={{ padding: '1rem', backgroundColor: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: '4px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a' }}>
                    Biological Quality & Respiration Index
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {batch.qualityScore} / 100
                  </span>
                </div>
                <div className="meter-container" style={{ height: '8px', marginBottom: '0.75rem' }}>
                  <div className={`meter-fill ${batch.risk}`} style={{ width: `${batch.qualityScore}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Remaining Shelf Life: <strong style={{ color: batch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>{batch.shelfLifeDays} Days</strong></span>
                  <span>Inspection: <strong>{batch.inspectionStatus}</strong></span>
                </div>
              </div>

              {/* Temperature Excursion Graph */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    Cold Storage Temperature History (°C)
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: 4.0 - 8.0 °C</span>
                </div>
                <div style={{ height: '180px', width: '100%', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '10px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={batch.temperatureHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={11} />
                      <YAxis domain={[4, 16]} stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke={batch.risk === 'critical' ? '#dc2626' : '#0284c7'}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderLeft: '4px solid #0f172a', borderRadius: '3px', fontSize: '0.8125rem' }}>
                <strong>Quality Assurance Directive:</strong> {batch.recommendedAction}
              </div>
            </div>

            {/* Right Column: Scannable QR Code & Audit Seals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Field Scannable QR Code
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Scan on smartphone for live passport
                </div>
              </div>

              {/* QR Code Container */}
              <div style={{
                padding: '1rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1rem'
              }}>
                <QRCodeSVG
                  value={passportUrl}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                ID: {batch.id}-SEC-2026
              </div>

              {/* Compliance Badges */}
              <div style={{ width: '100%', padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', textAlign: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={16} color="#166534" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
                  {batch.complianceCertification}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#166534' }}>
                  South-South Cooperative Verified
                </div>
              </div>

              {/* Inspector Manual Actions */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Inspector Actions:
                </span>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => inspectBatch(batch.id, 'certify')}
                >
                  <FileCheck size={12} />
                  Certify Quality Audit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => inspectBatch(batch.id, 'quarantine')}
                >
                  <ShieldAlert size={12} />
                  Issue Quarantine
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => inspectBatch(batch.id, 'dispatch')}
                >
                  Priority Dispatch (FEFO)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
