import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import {
  GitCommit,
  Truck,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  Store,
  Warehouse,
  Boxes,
  Sprout
} from 'lucide-react';

interface TraceStage {
  id: string;
  name: string;
  location: string;
  timestamp: string;
  status: 'completed' | 'active' | 'upcoming';
  tempRecorded: string;
  notes: string;
  operator: string;
  icon: any;
}

export const TraceabilityPage: React.FC = () => {
  const { state } = useTwin();
  const [selectedBatchId, setSelectedBatchId] = useState('TOM-101');

  const stages: TraceStage[] = [
    {
      id: 'harvest',
      name: 'Field Harvesting & Primary Culling',
      location: 'Shillong Farmers Collective (Plot 4B), Meghalaya',
      timestamp: '2026-09-07 06:30 AM',
      status: 'completed',
      tempRecorded: '18.5°C (Ambient Dawn)',
      notes: 'Hand-picked at mature-pink stage. Surface soil culled; zero chemical fungicides applied.',
      operator: 'D. Marak (Lead Agronomist)',
      icon: Sprout
    },
    {
      id: 'aggregation',
      name: 'Packhouse Primary Aggregation & Sorting',
      location: 'Jowai Rural Aggregation Center',
      timestamp: '2026-09-07 09:15 AM',
      status: 'completed',
      tempRecorded: '19.2°C',
      notes: 'Optical grading & weight sorting into 40kg food-grade vented polymer crates. RFID / QR applied.',
      operator: 'P. Lyngdoh (Quality In-charge)',
      icon: Boxes
    },
    {
      id: 'cold-vault',
      name: 'Solar Cold Storage Vault [Active Node]',
      location: 'FreshVault Storage Unit #4, Meghalaya',
      timestamp: '2026-09-07 11:30 AM - Present',
      status: 'active',
      tempRecorded: `${state.temperature}°C (Continuous IoT Twin)`,
      notes: 'Rapid pre-cooling brought core temperature to 6.2°C. Relative humidity sustained at 84%.',
      operator: 'Autonomous Twin BMS Node #4',
      icon: Warehouse
    },
    {
      id: 'transport',
      name: 'Secondary Insulated Feeder Logistics',
      location: 'Route: Shillong → Guwahati Central Corridor',
      timestamp: 'Scheduled 2026-09-10 05:00 AM',
      status: 'upcoming',
      tempRecorded: 'Target: 6.0 - 8.5°C',
      notes: 'Insulated eutectic reefer truck. Continuous BLE temperature beacon logged to twin API.',
      operator: 'Meghalaya Agri-Logistics Fleet',
      icon: Truck
    },
    {
      id: 'distribution',
      name: 'Terminal Wholesale Market & Cooperative Retail',
      location: 'Guwahati Agri-Fresh Terminal Market',
      timestamp: 'Scheduled 2026-09-10 11:00 AM',
      status: 'upcoming',
      tempRecorded: 'Pending Reception',
      notes: 'FEFO stock allocation for regional urban cooperatives and institutional culinary buyers.',
      operator: 'Regional APMC Distribution Board',
      icon: Store
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Physical Chain-of-Custody & Traceability Journey
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            IMMUTABLE HANDOVER MILESTONES WITH CONTINUOUS TEMPERATURE TELEMETRY
          </p>
        </div>

        {/* Batch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>TRACK LOT:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sharp)',
              backgroundColor: '#fff'
            }}
          >
            {state.batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.variety}) - {b.risk.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <GitCommit size={13} color="#0369a1" />
            Supply-Chain Handover Log (Batch {selectedBatchId})
          </div>
          <span className="badge badge-safe">
            <ShieldCheck size={11} /> FAO CODEX VERIFIED
          </span>
        </div>

        <div className="panel-body" style={{ padding: '1.25rem 1rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              return (
                <div key={stg.id} className="timeline-step" style={{ paddingLeft: '24px', marginBottom: '1rem' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 2,
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: stg.status === 'completed' ? 'var(--scada-normal)' : stg.status === 'active' ? '#0369a1' : '#94a3b8'
                    }}
                  />

                  <div style={{
                    padding: '0.75rem 0.85rem',
                    backgroundColor: stg.status === 'active' ? 'var(--chiller-bg)' : 'var(--bg-surface-subtle)',
                    border: `1px solid ${stg.status === 'active' ? '#bae6fd' : 'var(--border-hairline)'}`,
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Icon size={14} color={stg.status === 'active' ? '#0369a1' : '#475569'} />
                        <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                          {idx + 1}. {stg.name}
                        </h4>
                      </div>
                      <span className={`badge ${stg.status === 'completed' ? 'badge-safe' : stg.status === 'active' ? 'badge-warning' : ''}`}>
                        {stg.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4px', fontSize: '10px', color: 'var(--text-secondary)', margin: '0.4rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} color="var(--text-muted)" />
                        <span>{stg.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} color="var(--text-muted)" />
                        <span>{stg.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Thermometer size={11} color="#0369a1" />
                        <span style={{ fontWeight: 700 }}>{stg.tempRecorded}</span>
                      </div>
                      <div>
                        <span>OPERATOR: <strong>{stg.operator}</strong></span>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', backgroundColor: '#ffffff', padding: '0.4rem 0.5rem', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
                      {stg.notes}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
