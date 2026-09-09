import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import {
  Layers,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  MapPin,
  Calendar,
  Weight
} from 'lucide-react';

export const BatchesPage: React.FC = () => {
  const { state, setSelectedBatchId, inspectBatch } = useTwin();
  const [filter, setFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [search, setSearch] = useState('');

  const filteredBatches = state.batches.filter((b) => {
    const matchesFilter = filter === 'all' || b.risk === filter;
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.variety.toLowerCase().includes(search.toLowerCase()) ||
      b.producerCoop.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Batch Inventory & Triage Management
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Individual lot tracking, quality deterioration curves, and QR digital product passports
          </p>
        </div>

        {/* Filter Badges & Search */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ID, variety, coop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                width: '210px'
              }}
            />
          </div>

          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({state.batches.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'safe' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('safe')}
          >
            Safe ({state.batches.filter((b) => b.risk === 'safe').length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'warning' ? 'btn-warning' : ''}`}
            onClick={() => setFilter('warning')}
          >
            Warning ({state.batches.filter((b) => b.risk === 'warning').length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'critical' ? 'btn-danger' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Critical ({state.batches.filter((b) => b.risk === 'critical').length})
          </button>
        </div>
      </div>

      {/* Batches Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {filteredBatches.map((batch) => (
          <div key={batch.id} className="panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LOT IDENTIFIER</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{batch.id}</div>
              </div>
              <span className={`badge badge-${batch.risk}`}>
                {batch.risk}
              </span>
            </div>

            <div className="panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{batch.variety}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{batch.product}</div>
                </div>

                {/* Score Progress */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px' }}>
                    <span>Freshness Index</span>
                    <span className="font-mono">{batch.qualityScore} / 100</span>
                  </div>
                  <div className="meter-container">
                    <div className={`meter-fill ${batch.risk}`} style={{ width: `${batch.qualityScore}%` }} />
                  </div>
                </div>

                <div className="inspector-field">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> Shelf Life Left:
                  </span>
                  <span className="val" style={{ color: batch.shelfLifeDays < 2 ? 'var(--status-critical)' : 'inherit' }}>
                    {batch.shelfLifeDays} Days
                  </span>
                </div>

                <div className="inspector-field">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Weight size={12} /> Monitored Quantity:
                  </span>
                  <span className="val font-mono">{batch.quantityKg} kg</span>
                </div>

                <div className="inspector-field">
                  <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> Producer Origin:
                  </span>
                  <span className="val" style={{ fontSize: '0.75rem' }}>{batch.originLocation}</span>
                </div>

                <div style={{ padding: '0.65rem', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '4px', margin: '0.75rem 0', fontSize: '0.75rem' }}>
                  <strong>Operational Protocol:</strong> {batch.recommendedAction}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Link
                  to={`/batch/${batch.id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                  onClick={() => setSelectedBatchId(batch.id)}
                >
                  <FileText size={13} />
                  Product Passport (QR)
                </Link>
                {batch.risk === 'critical' ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => inspectBatch(batch.id, 'quarantine')}
                    title="Quarantine batch"
                  >
                    Quarantine
                  </button>
                ) : (
                  <button
                    className="btn btn-sm"
                    onClick={() => inspectBatch(batch.id, 'certify')}
                    title="Certify batch quality"
                  >
                    Certify
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
