import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import {
  Search,
  FileText
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Title & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Batch Inventory Ledger // First-Expired, First-Out (FEFO)
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            BIOLOGICAL RESIDUAL SHELF-LIFE AUDIT & COMPLIANCE CERTIFICATION
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search lot, variety, coop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.35rem 0.65rem 0.35rem 1.65rem',
                fontSize: '11px',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-sharp)',
                fontFamily: 'var(--font-mono)',
                width: '220px'
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

      {/* Main Tabular Dispatch Ledger */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="table-container">
          <table className="tech-table">
            <thead>
              <tr>
                <th>Lot ID</th>
                <th>Botanical Variety</th>
                <th>Cooperative Entity</th>
                <th>Harvest Date</th>
                <th>Monitored Mass</th>
                <th>Chamber Coords</th>
                <th>Quality Retention</th>
                <th>Remaining Life</th>
                <th>Risk State</th>
                <th>Compliance Status</th>
                <th>Inspector Audit</th>
                <th>Passport</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => (
                <tr key={batch.id}>
                  <td style={{ fontWeight: 700 }}>{batch.id}</td>
                  <td>{batch.variety}</td>
                  <td>{batch.producerCoop}</td>
                  <td>{batch.harvestDate}</td>
                  <td>{batch.quantityKg} kg</td>
                  <td>[{batch.cratePosition.join(', ')}]</td>
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
                    {batch.risk === 'critical' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => inspectBatch(batch.id, 'quarantine')}
                      >
                        Quarantine
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => inspectBatch(batch.id, 'certify')}
                      >
                        Certify
                      </button>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/batch/${batch.id}`}
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedBatchId(batch.id)}
                    >
                      <FileText size={10} />
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
