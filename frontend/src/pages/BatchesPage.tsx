import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import {
  Search,
  FileText,
  Layers,
  ShieldCheck,
  ArrowRight
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
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0 3rem' }}>
      
      {/* Header Banner */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.25rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '6px 14px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#1d4ed8',
              marginBottom: '1rem'
            }}>
              <Layers size={16} color="#2563eb" />
              <span>COLD STORAGE INVENTORY • FIRST-EXPIRED, FIRST-OUT (FEFO) LEDGER</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>
              Batch Inventory & Shelf-Life Dispatch Ledger
            </h1>

            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '880px', lineHeight: 1.6, margin: 0 }}>
              Continuous biological freshness and residual shelf life audit across all stored crates. Prioritizes lots requiring immediate market dispatch.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search lot, variety, coop..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.65rem 1rem 0.65rem 2.25rem',
                  fontSize: '14.5px',
                  border: '2px solid #cbd5e1',
                  borderRadius: '10px',
                  width: '260px',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
              onClick={() => setFilter('all')}
              style={{ padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
            >
              All ({state.batches.length})
            </button>
            <button
              className={`btn ${filter === 'safe' ? 'btn-primary' : ''}`}
              onClick={() => setFilter('safe')}
              style={{ padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
            >
              Safe ({state.batches.filter((b) => b.risk === 'safe').length})
            </button>
            <button
              className={`btn ${filter === 'warning' ? 'btn-warning' : ''}`}
              onClick={() => setFilter('warning')}
              style={{ padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
            >
              Aging ({state.batches.filter((b) => b.risk === 'warning').length})
            </button>
            <button
              className={`btn ${filter === 'critical' ? 'btn-danger' : ''}`}
              onClick={() => setFilter('critical')}
              style={{ padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
            >
              Critical ({state.batches.filter((b) => b.risk === 'critical').length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Tabular Dispatch Ledger */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="tech-table" style={{ fontSize: '14.5px', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Lot ID</th>
                <th style={{ padding: '1rem 1.25rem' }}>Produce Variety</th>
                <th style={{ padding: '1rem 1.25rem' }}>Farmer Cooperative</th>
                <th style={{ padding: '1rem 1.25rem' }}>Harvest Date</th>
                <th style={{ padding: '1rem 1.25rem' }}>Net Weight</th>
                <th style={{ padding: '1rem 1.25rem' }}>Freshness Score</th>
                <th style={{ padding: '1rem 1.25rem' }}>Remaining Shelf Life</th>
                <th style={{ padding: '1rem 1.25rem' }}>Risk State</th>
                <th style={{ padding: '1rem 1.25rem' }}>Compliance Protocol</th>
                <th style={{ padding: '1rem 1.25rem' }}>Action</th>
                <th style={{ padding: '1rem 1.25rem' }}>Digital Passport</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: '#0f172a' }}>{batch.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{batch.variety}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{batch.producerCoop}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{batch.harvestDate}</td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700 }}>{batch.quantityKg} kg</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, width: '40px' }}>{batch.qualityScore}%</span>
                      <div className="meter-container" style={{ width: '70px', height: '8px', margin: 0 }}>
                        <div
                          className={`meter-fill ${batch.risk}`}
                          style={{ width: `${batch.qualityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800, color: batch.shelfLifeDays < 2 ? '#dc2626' : '#0f172a' }}>
                    {batch.shelfLifeDays} days left
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge badge-${batch.risk}`} style={{ fontSize: '12px', padding: '4px 10px' }}>
                      {batch.risk.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '13.5px' }}>{batch.inspectionStatus}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {batch.risk === 'critical' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => inspectBatch(batch.id, 'quarantine')}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '13px', fontWeight: 700 }}
                      >
                        Quarantine
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => inspectBatch(batch.id, 'certify')}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '13px', fontWeight: 700 }}
                      >
                        Certify Safe
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Link
                      to={`/batch/${batch.id}`}
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedBatchId(batch.id)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FileText size={14} />
                      Passport
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

