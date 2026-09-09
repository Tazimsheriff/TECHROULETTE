import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTwin } from '../context/TwinContext';
import {
  ShieldCheck,
  FileCheck,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  MapPin,
  Scale,
  Box,
  Truck,
  Sun,
  Thermometer,
  Activity,
  Copy,
  Check,
  Clock,
  Printer,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const BatchPassportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, inspectBatch } = useTwin();
  const [copied, setCopied] = useState(false);

  const batch = state.batches.find((b) => b.id.toUpperCase() === (id || '').toUpperCase()) || state.batches[0];
  const passportUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const crateCount = Math.max(1, Math.round(batch.quantityKg / 18));
  const estimatedFruitCount = Math.round(batch.quantityKg * 11.5);

  const timelineEvents = [
    {
      step: 1,
      title: "Morning Harvest & Field Sorting",
      timestamp: `${batch.harvestDate} • 06:45 AM`,
      location: batch.originLocation,
      party: batch.producerCoop,
      icon: Sun,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      description: `Harvested under cool morning canopy (<8:00 AM) to minimize initial field heat. Sorted for maturity, cleaned, and packed into ${crateCount} standard ventilated crates.`
    },
    {
      step: 2,
      title: "Agro-Corridor Intake & Temperature Check",
      timestamp: `${batch.harvestDate} • 08:20 AM`,
      location: "Cooperative Cold Hub • East Khasi Hills",
      party: "Regional Cold Chain Logistics",
      icon: Truck,
      color: "#0284c7",
      bg: "#f0f9ff",
      border: "#bae6fd",
      description: `Delivered within 95 minutes of harvest. Core pulp temperature measured at 13.8°C upon intake. Initial biological quality confirmed at 100%.`
    },
    {
      step: 3,
      title: "Solar Chamber Storage & Rapid Pull-Down",
      timestamp: `${batch.harvestDate} • 09:30 AM`,
      location: `Chamber 04 • Slot [${batch.cratePosition.map(p => p.toFixed(1)).join(', ')}]`,
      party: "Solar Powered BMS & Inverter System",
      icon: Thermometer,
      color: "#0284c7",
      bg: "#f0f9ff",
      border: "#bae6fd",
      description: `Temperature rapidly brought down to 6.2°C using solar-powered vapor compression chilling. Relative humidity maintained at 84% to prevent moisture loss.`
    },
    {
      step: 4,
      title: "Continuous Kinetic Respiration Logging",
      timestamp: "Active Monitoring (ESP32 IoT Nodes)",
      location: "FAC-VAULT-04-NE Cold Chamber",
      party: "Arrhenius Food Kinetic Engine (Q10 = 2.4)",
      icon: Activity,
      color: batch.risk === 'critical' ? "#dc2626" : batch.risk === 'warning' ? "#d97706" : "#059669",
      bg: batch.risk === 'critical' ? "#fef2f2" : batch.risk === 'warning' ? "#fffbeb" : "#ecfdf5",
      border: batch.risk === 'critical' ? "#fca5a5" : batch.risk === 'warning' ? "#fde68a" : "#a7f3d0",
      description: `Real-time temperature and humidity tracking. Current biological freshness calculated at ${batch.qualityScore}% with ${batch.shelfLifeDays} days of viable shelf life remaining.`
    },
    {
      step: 5,
      title: "Phytosanitary Certification & Dispatch Routing",
      timestamp: batch.shelfLifeDays < 2 ? "Immediate Action Required" : "Standard FEFO Priority",
      location: batch.shelfLifeDays < 2 ? "Priority Cannery / Processing Route" : "Regional Wholesale Produce Terminal",
      party: "Cooperative Quality Assurance",
      icon: ShieldCheck,
      color: batch.risk === 'critical' ? "#dc2626" : "#7c3aed",
      bg: batch.risk === 'critical' ? "#fef2f2" : "#f5f3ff",
      border: batch.risk === 'critical' ? "#fca5a5" : "#ddd6fe",
      description: batch.recommendedAction
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0 3rem' }}>
      
      {/* Top Bar Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Link
          to="/batches"
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.15rem',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1'
          }}
        >
          <ArrowLeft size={16} /> Return to Produce Ledger
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleCopyLink}
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.15rem',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1'
            }}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.15rem',
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1'
            }}
          >
            <Printer size={16} />
            <span>Print Passport</span>
          </button>
        </div>
      </div>

      {/* Main Passport Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        {/* Document Official Header */}
        <div style={{
          padding: '1.75rem 2.25rem',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          borderBottom: '3px solid #0284c7'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#38bdf8',
              fontWeight: 700,
              marginBottom: '0.4rem'
            }}>
              <ShieldCheck size={16} color="#38bdf8" />
              UN-FAO CODEX ALIMENTARIUS • DIGITAL PHYTOSANITARY PRODUCT PASSPORT
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Batch Passport: {batch.id}
            </h1>
            <div style={{ fontSize: '14.5px', color: '#cbd5e1', marginTop: '4px' }}>
              {batch.variety} • {batch.product}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 800,
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: batch.risk === 'critical' ? '#dc2626' : batch.risk === 'warning' ? '#d97706' : '#15803d',
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}>
              STATUS: {batch.risk.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Passport Content Body */}
        <div style={{ padding: '2.25rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Batch Size Data & Specifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Batch Size & Farm Specifications */}
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scale size={20} color="#0284c7" />
                  Batch Size, Quantity & Origin Details
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  {/* Total Net Mass */}
                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Total Net Weight</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
                      {batch.quantityKg} kg
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Monitored produce mass</div>
                  </div>

                  {/* Crate Count */}
                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Packaging Units</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7', margin: '4px 0 2px' }}>
                      {crateCount} Crates
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Ventilated HDPE field boxes</div>
                  </div>

                  {/* Estimated Fruit Count */}
                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Estimated Fruit Count</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed', margin: '4px 0 2px' }}>
                      ~{estimatedFruitCount} pcs
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Medium ripe grade</div>
                  </div>

                  {/* Harvest Date */}
                  <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Harvest Date</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px' }}>
                      {batch.harvestDate}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Morning hand-picked</div>
                  </div>
                </div>

                {/* Cooperative & Farm Origin Strip */}
                <div style={{
                  marginTop: '1rem',
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={15} color="#059669" />
                      Farmer Cooperative
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {batch.producerCoop}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={15} color="#0284c7" />
                      Orchard / Farm Location
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                      {batch.originLocation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Biological Freshness & Shelf Life Card */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: batch.risk === 'critical' ? '#fef2f2' : batch.risk === 'warning' ? '#fffbeb' : '#f0fdf4',
                borderRadius: '14px',
                border: `2px solid ${batch.risk === 'critical' ? '#fca5a5' : batch.risk === 'warning' ? '#fde68a' : '#bbf7d0'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    Current Biological Freshness Score
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: batch.risk === 'critical' ? '#dc2626' : batch.risk === 'warning' ? '#d97706' : '#15803d' }}>
                    {batch.qualityScore}%
                  </span>
                </div>

                <div className="meter-container" style={{ height: '10px', marginBottom: '0.75rem', backgroundColor: '#e2e8f0' }}>
                  <div className={`meter-fill ${batch.risk}`} style={{ width: `${batch.qualityScore}%`, borderRadius: '6px' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                  <div>
                    Remaining Shelf Life: <strong style={{ fontSize: '16px', color: batch.risk === 'critical' ? '#dc2626' : '#0f172a' }}>{batch.shelfLifeDays} Days</strong>
                  </div>
                  <div>
                    Inspection Protocol: <strong style={{ color: '#0f172a' }}>{batch.inspectionStatus}</strong>
                  </div>
                </div>
              </div>

              {/* Continuous Temperature History Graph */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Thermometer size={18} color="#0284c7" />
                    Cold Storage Temperature History Log
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                    Target Safe Band: 4.0°C - 8.0°C
                  </span>
                </div>

                <div style={{
                  height: '190px',
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px'
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={batch.temperatureHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" stroke="#64748b" fontSize={12} />
                      <YAxis domain={[4, 16]} stroke="#64748b" fontSize={12} unit="°C" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name="Chamber Temp"
                        stroke={batch.risk === 'critical' ? '#dc2626' : '#0284c7'}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#ffffff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Directive */}
              <div style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                borderLeft: '4px solid #0f172a',
                border: '1px solid #e2e8f0',
                fontSize: '15px',
                lineHeight: 1.6
              }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                  Quality & Dispatch Directive:
                </strong>
                <span style={{ color: '#334155' }}>{batch.recommendedAction}</span>
              </div>

            </div>

            {/* Right Column: Scannable QR Code & Field Verification */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* QR Code Presentation Box */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 12px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#1d4ed8',
                  marginBottom: '1.25rem'
                }}>
                  FIELD SCANNABLE QR CODE
                </div>

                <div style={{
                  display: 'inline-block',
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                  border: '3px solid #0f172a',
                  borderRadius: '14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  marginBottom: '1rem'
                }}>
                  <QRCodeSVG
                    value={passportUrl}
                    size={175}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Scan with any smartphone camera
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, maxWidth: '240px', margin: '0 auto 1.25rem' }}>
                  Instantly verify farm origin, temperature compliance, and shelf-life on mobile.
                </div>

                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#475569',
                  fontFamily: 'monospace'
                }}>
                  HASH: {batch.id}-SEC-2026-CODEX
                </div>
              </div>

              {/* Compliance Stamp */}
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#f0fdf4',
                border: '2px solid #bbf7d0',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={28} color="#16a34a" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#15803d' }}>
                  {batch.complianceCertification}
                </div>
                <div style={{ fontSize: '13px', color: '#166534', marginTop: '4px' }}>
                  South-South Triangular Cooperation (SSTC) Codex Compliant
                </div>
              </div>

              {/* Auditor Controls */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Inspector Audit Actions:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => inspectBatch(batch.id, 'certify')}
                    style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
                  >
                    <FileCheck size={16} />
                    Certify Quality Audit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => inspectBatch(batch.id, 'quarantine')}
                    style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
                  >
                    <ShieldAlert size={16} />
                    Issue Quarantine Order
                  </button>

                  <button
                    className="btn"
                    onClick={() => inspectBatch(batch.id, 'dispatch')}
                    style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '14px', fontWeight: 700 }}
                  >
                    FEFO Fast-Track Release
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Full Lifecycle Timeline Section */}
          <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '2px solid #f1f5f9' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={22} color="#0284c7" />
                Complete Lifecycle Timeline of Batch {batch.id}
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                Traceable chain-of-custody recorded from farm field harvest through solar cold-room storage and retail dispatch:
              </p>
            </div>

            {/* Stepped Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {timelineEvents.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.step}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr',
                      gap: '1.25rem',
                      alignItems: 'start'
                    }}
                  >
                    {/* Step Number Badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: event.bg,
                        border: `2px solid ${event.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}>
                        <Icon size={22} color={event.color} />
                      </div>
                      {idx < timelineEvents.length - 1 && (
                        <div style={{
                          width: '2px',
                          height: '48px',
                          backgroundColor: '#e2e8f0',
                          margin: '6px 0'
                        }} />
                      )}
                    </div>

                    {/* Timeline Content Card */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      border: `2px solid ${event.border}`,
                      borderRadius: '14px',
                      padding: '1.5rem',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: event.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Step 0{event.step} • {event.timestamp}
                          </div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                            {event.title}
                          </h3>
                        </div>

                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} color="#0284c7" />
                          {event.location}
                        </div>
                      </div>

                      <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                        {event.description}
                      </p>

                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        <strong>Responsible Entity:</strong> {event.party}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

