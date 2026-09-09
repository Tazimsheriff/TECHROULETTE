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
  Sprout,
  ArrowRight,
  CheckCircle2,
  Calendar,
  User,
  Activity
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
  color: string;
  bg: string;
  border: string;
}

export const TraceabilityPage: React.FC = () => {
  const { state } = useTwin();
  const [selectedBatchId, setSelectedBatchId] = useState('TOM-101');

  const selectedBatch = state.batches.find((b) => b.id === selectedBatchId) || state.batches[0];

  const stages: TraceStage[] = [
    {
      id: 'harvest',
      name: 'Field Harvesting & Primary Culling',
      location: `${selectedBatch.producerCoop}, ${selectedBatch.originLocation}`,
      timestamp: `${selectedBatch.harvestDate} • 06:30 AM`,
      status: 'completed',
      tempRecorded: '18.5°C (Ambient Dawn)',
      notes: 'Hand-picked during cool morning hours at mature-pink stage. Surface soil culled; zero chemical fungicides applied.',
      operator: 'D. Marak (Lead Agronomist)',
      icon: Sprout,
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0'
    },
    {
      id: 'aggregation',
      name: 'Packhouse Primary Aggregation & Sorting',
      location: 'Jowai Rural Aggregation Center • Hub 2',
      timestamp: `${selectedBatch.harvestDate} • 09:15 AM`,
      status: 'completed',
      tempRecorded: '19.2°C (Intake Pulp)',
      notes: 'Optical grading and weight sorting into 20kg food-grade vented polymer crates. Digital RFID and scannable QR passport tags applied.',
      operator: 'P. Lyngdoh (Quality In-charge)',
      icon: Boxes,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd'
    },
    {
      id: 'cold-vault',
      name: 'Solar Cold Storage Vault [Active Node]',
      location: `FreshVault Storage Chamber #4 • ${state.location}`,
      timestamp: `${selectedBatch.harvestDate} • 11:30 AM – Present`,
      status: 'active',
      tempRecorded: `${state.temperature}°C (Continuous IoT Digital Twin)`,
      notes: 'Rapid pre-cooling brought core temperature down to optimal 6.2°C within 110 minutes. Relative humidity maintained at 84% to prevent moisture shrinkage.',
      operator: 'Autonomous Twin BMS Node #4',
      icon: Warehouse,
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd'
    },
    {
      id: 'transport',
      name: 'Secondary Insulated Feeder Logistics',
      location: 'Route: Shillong → Guwahati Central Agro-Corridor',
      timestamp: 'Scheduled: Next Morning 05:00 AM Departure',
      status: 'upcoming',
      tempRecorded: 'Target: 6.0°C – 8.5°C Controlled',
      notes: 'Insulated eutectic reefer truck. Continuous BLE temperature beacon logged directly into regional cooperative blockchain API.',
      operator: 'Meghalaya Agri-Logistics Transit Fleet',
      icon: Truck,
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe'
    },
    {
      id: 'distribution',
      name: 'Terminal Wholesale Market & Cooperative Retail',
      location: 'Guwahati Agri-Fresh Terminal Market • Bay 12',
      timestamp: 'Scheduled: Next Day 11:00 AM Delivery',
      status: 'upcoming',
      tempRecorded: 'Pending Intake Reception',
      notes: 'First-Expired, First-Out (FEFO) stock allocation for regional urban consumer markets and institutional culinary buyers.',
      operator: 'Regional APMC Distribution Board',
      icon: Store,
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a'
    }
  ];

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
              <ShieldCheck size={16} color="#2563eb" />
              <span>UN-FAO CODEX COMPLIANT • END-TO-END SUPPLY CHAIN JOURNEY</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>
              Physical Chain-of-Custody & Traceability Log
            </h1>

            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '880px', lineHeight: 1.6, margin: 0 }}>
              Immutable handover milestones with continuous temperature logging from farm field harvest through solar cold-room storage and urban market dispatch.
            </p>
          </div>

          {/* Batch Selector Dropdown */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Select Lot to Trace:
            </span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                fontSize: '15px',
                fontWeight: 700,
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              {state.batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} — {b.variety} ({b.quantityKg} kg)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Lot Snapshot Bar */}
        <div style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '2px solid #e2e8f0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Active Crate Lot</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{selectedBatch.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Variety</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{selectedBatch.variety}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Farmer Cooperative</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{selectedBatch.producerCoop}</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Freshness Score</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: selectedBatch.risk === 'critical' ? '#dc2626' : '#15803d' }}>
              {selectedBatch.qualityScore}% ({selectedBatch.shelfLifeDays} days left)
            </div>
          </div>
          <div>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: selectedBatch.risk === 'critical' ? '#fef2f2' : selectedBatch.risk === 'warning' ? '#fffbeb' : '#f0fdf4',
              color: selectedBatch.risk === 'critical' ? '#dc2626' : selectedBatch.risk === 'warning' ? '#d97706' : '#15803d',
              border: `1px solid ${selectedBatch.risk === 'critical' ? '#fca5a5' : selectedBatch.risk === 'warning' ? '#fde68a' : '#bbf7d0'}`
            }}>
              STATUS: {selectedBatch.risk.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Main Timeline Card */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              Milestone Handover Timeline for Batch {selectedBatch.id}
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
              Physical and digital custody transfers verified by sensor telemetry:
            </p>
          </div>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '6px 14px',
            backgroundColor: '#f0fdf4',
            borderRadius: '20px',
            border: '1px solid #bbf7d0',
            fontSize: '13px',
            fontWeight: 700,
            color: '#15803d'
          }}>
            <ShieldCheck size={16} />
            FAO CODEX VERIFIED HANDOVER
          </span>
        </div>

        {/* Stepped Timeline Cards with Large Legible Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1080px', margin: '0 auto' }}>
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr',
                  gap: '1.5rem',
                  alignItems: 'start'
                }}
              >
                {/* Step Circle & Connecting Line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: stg.bg,
                    border: `2px solid ${stg.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <Icon size={24} color={stg.color} />
                  </div>
                  {idx < stages.length - 1 && (
                    <div style={{
                      width: '3px',
                      height: '70px',
                      backgroundColor: '#e2e8f0',
                      margin: '8px 0'
                    }} />
                  )}
                </div>

                {/* Milestone Detail Card */}
                <div style={{
                  backgroundColor: stg.status === 'active' ? '#f0f9ff' : '#ffffff',
                  border: `2px solid ${stg.status === 'active' ? '#7dd3fc' : '#e2e8f0'}`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: stg.status === 'active' ? '0 4px 16px rgba(2, 132, 199, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  {/* Title & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: stg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Step 0{idx + 1}
                      </div>
                      <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '3px 0 0' }}>
                        {stg.name}
                      </h3>
                    </div>

                    <span style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: '20px',
                      backgroundColor: stg.status === 'completed' ? '#ecfdf5' : stg.status === 'active' ? '#eff6ff' : '#f1f5f9',
                      color: stg.status === 'completed' ? '#059669' : stg.status === 'active' ? '#0284c7' : '#64748b',
                      border: `1px solid ${stg.status === 'completed' ? '#a7f3d0' : stg.status === 'active' ? '#bfdbfe' : '#cbd5e1'}`
                    }}>
                      {stg.status === 'completed' ? '✓ COMPLETED' : stg.status === 'active' ? '● CURRENT STAGE' : '○ UPCOMING'}
                    </span>
                  </div>

                  {/* Metadata Grid (Bigger Fonts) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={15} color="#0284c7" />
                        Location
                      </div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {stg.location}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={15} color="#d97706" />
                        Date & Time
                      </div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {stg.timestamp}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Thermometer size={15} color="#059669" />
                        Temperature Logged
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                        {stg.tempRecorded}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={15} color="#7c3aed" />
                        Responsible Party
                      </div>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                        {stg.operator}
                      </div>
                    </div>
                  </div>

                  {/* Stage Notes */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${stg.color}`,
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    color: '#334155',
                    lineHeight: 1.6
                  }}>
                    <strong style={{ color: '#0f172a' }}>Handover Protocol Notes: </strong>
                    {stg.notes}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

