import React, { useState } from 'react';
import { useTwin } from '../context/TwinContext';
import {
  GitCommit,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  ChevronRight,
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
      name: 'Field Harvesting & Sorting',
      location: 'Shillong Farmers Collective (Plot 4B), Meghalaya',
      timestamp: '2026-09-07 06:30 AM',
      status: 'completed',
      tempRecorded: '18.5°C (Ambient Dawn)',
      notes: 'Hand-picked at mature-pink stage. Surface field dirt removed; zero chemical fungicides applied.',
      operator: 'D. Marak (Lead Agronomist)',
      icon: Sprout
    },
    {
      id: 'aggregation',
      name: 'Packhouse Primary Aggregation',
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
      name: 'Solar Cold Storage (Current Node)',
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
      name: 'Insulated Feeder Logistics',
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
      name: 'Wholesale Distribution & Retail',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Farm-to-Consumer Traceability Journey
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Immutable physical chain of custody with timestamped temperature telemetries across all handling stages
          </p>
        </div>

        {/* Batch Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Track Batch:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
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
      <div className="panel" style={{ borderRadius: 'var(--radius-md)' }}>
        <div className="panel-header">
          <div className="panel-title">
            <GitCommit size={16} color="#0284c7" />
            Active Supply-Chain Handover Milestones (Batch {selectedBatchId})
          </div>
          <span className="badge badge-safe">
            <ShieldCheck size={12} /> FAO-SSC VERIFIED
          </span>
        </div>

        <div className="panel-body" style={{ padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              return (
                <div key={stg.id} className="timeline-step">
                  <div className={`timeline-marker ${stg.status === 'completed' ? 'done' : stg.status === 'active' ? 'active' : ''}`} />

                  <div style={{
                    padding: '1.1rem 1.25rem',
                    backgroundColor: stg.status === 'active' ? '#f0f9ff' : '#fafbfc',
                    border: `1px solid ${stg.status === 'active' ? '#bae6fd' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Icon size={16} color={stg.status === 'active' ? '#0284c7' : '#475569'} />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                          {idx + 1}. {stg.name}
                        </h4>
                      </div>
                      <span className={`badge ${stg.status === 'completed' ? 'badge-safe' : stg.status === 'active' ? 'badge-warning' : ''}`}>
                        {stg.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '0.65rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--text-muted)" />
                        <span>{stg.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span className="font-mono">{stg.timestamp}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Thermometer size={13} color="#0284c7" />
                        <span className="font-mono" style={{ fontWeight: 600 }}>{stg.tempRecorded}</span>
                      </div>
                      <div>
                        <span>Inspector: <strong>{stg.operator}</strong></span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '3px', border: '1px solid var(--border-subtle)' }}>
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
