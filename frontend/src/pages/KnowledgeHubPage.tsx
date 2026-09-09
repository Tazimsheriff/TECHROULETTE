import React, { useState } from 'react';
import {
  BookOpen,
  Globe,
  Download,
  CheckCircle,
  FileText,
  MapPin,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AdaptationProfile {
  country: string;
  flag: string;
  commodity: string;
  targetTemp: string;
  targetHumidity: string;
  shelfLifeGain: string;
  localChallenge: string;
  twinArchitecture: string;
}

export const KnowledgeHubPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('India');

  const profiles: AdaptationProfile[] = [
    {
      country: 'India',
      flag: '🇮🇳',
      commodity: 'Tomatoes & Capsicum (Solanaceae)',
      targetTemp: '6.0°C - 8.5°C',
      targetHumidity: '82% - 88% RH',
      shelfLifeGain: '+5 to 9 Days extension',
      localChallenge: 'Hilly North-Eastern agro-corridors lack 3-phase grid power; transit roads experience frequent monsoon landslides.',
      twinArchitecture: 'Solar PV rooftop (450W) with 2.4kWh LiFePO4 battery pack and dual ESP32 nodes communicating via local Wi-Fi / LoRa.'
    },
    {
      country: 'Kenya',
      flag: '🇰🇪',
      commodity: 'Export French Beans & Snow Peas',
      targetTemp: '4.0°C - 6.0°C',
      targetHumidity: '90% - 95% RH',
      shelfLifeGain: '+6 to 8 Days extension',
      localChallenge: 'Smallholders in Rift Valley face rejection at airport cold terminals due to unmonitored farm-to-packhouse temperature breaks.',
      twinArchitecture: 'Mobile solar cool-boxes equipped with BLE beacons logging directly into the regional cooperative export ledger.'
    },
    {
      country: 'Bangladesh',
      flag: '🇧🇩',
      commodity: 'Raw Bovine Dairy / Milk Cans',
      targetTemp: '3.0°C - 4.5°C',
      targetHumidity: 'N/A (Liquid Chilling)',
      shelfLifeGain: '+18 to 24 Hours raw stability',
      localChallenge: 'High ambient humidity and unpasteurized milk souring within 3 hours during riverboat transit to collection dairies.',
      twinArchitecture: 'Immersion solar chiller with DS18B20 digital stainless-steel probe and SMS alert gateway for boat operators.'
    },
    {
      country: 'Indonesia',
      flag: '🇮🇩',
      commodity: 'Artisanal Skipjack Tuna & Reef Fish',
      targetTemp: '0.0°C - 2.0°C (Ice Slurry)',
      targetHumidity: '95% - 98% RH',
      shelfLifeGain: '+4 to 6 Days freshness retention',
      localChallenge: 'Island archipelagos lack ice plants; artisanal fishermen suffer 40% value loss from histamine formation in unchilled fish.',
      twinArchitecture: 'Solar saltwater slurry ice-maker digital twin with battery state predictor and GPS voyage track logger.'
    }
  ];

  const currentProfile = profiles.find((p) => p.country === selectedCountry) || profiles[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '2px 8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 600, color: '#166534', marginBottom: '0.35rem' }}>
            <Globe size={13} />
            UN SOUTH-SOUTH & TRIANGULAR COOPERATION (SSTC) FRAMEWORK
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Food-Safety Knowledge Hub & Solution Exchange
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Open-source blueprints, local adaptation profiles, and standard operating procedures (SOPs) for decentralized cold storage
          </p>
        </div>

        <button className="btn btn-sm btn-primary">
          <Download size={13} /> Download Open Blueprint (PDF)
        </button>
      </div>

      {/* South-South Transferability Section */}
      <div className="panel" style={{ borderRadius: 'var(--radius-md)' }}>
        <div className="panel-header">
          <div className="panel-title">
            <Globe size={16} color="#0284c7" />
            Cross-Border Commodity Blueprints (Select Region)
          </div>
        </div>
        <div className="panel-body">
          {/* Country Selection Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {profiles.map((p) => (
              <button
                key={p.country}
                className={`btn ${selectedCountry === p.country ? 'btn-primary' : ''}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setSelectedCountry(p.country)}
              >
                <span style={{ fontSize: '1.1rem' }}>{p.flag}</span>
                {p.country} ({p.commodity.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Active Profile Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '1.5rem',
            padding: '1.25rem',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{currentProfile.flag}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {currentProfile.commodity} — {currentProfile.country}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1rem 0' }}>
                <div style={{ padding: '0.65rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Temperature</div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#0284c7' }}>
                    {currentProfile.targetTemp}
                  </div>
                </div>

                <div style={{ padding: '0.65rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Humidity</div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                    {currentProfile.targetHumidity}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>Regional Supply-Chain Bottleneck:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                  {currentProfile.localChallenge}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>Low-Cost Twin Implementation:</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                  {currentProfile.twinArchitecture}
                </p>
              </div>
            </div>

            {/* Impact Metric & FAO alignment */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1.5rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', textTransform: 'uppercase' }}>
                  Verified Postharvest Gain
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#166534', margin: '4px 0' }}>
                  {currentProfile.shelfLifeGain}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                  Versus unmonitored ambient storage
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '1rem' }}>
                <strong>FAO AGRIS Benchmark:</strong> Adheres to Codex Alimentarius guidelines for the hygienic transport of bulk foods and semi-packed perishable foodstuffs (CAC/RCP 47-2001).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Operating Procedures (SOPs) Grid */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>
          Standard Operating Procedures (SOPs) for Rural Operators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={15} color="#166534" />
                SOP-01: Pre-Cooling & Intake Protocol
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Harvest in early morning hours (&lt;8:00 AM). Remove field heat within 90 minutes of arrival. Never mix over-ripe climacteric batches with mature-green stock.
              </p>
              <span className="badge badge-safe">STANDARD COMPLIANCE</span>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={15} color="#d97706" />
                SOP-02: Cold-Breach Emergency Response
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                If internal chamber exceeds 12.0°C for &gt;45 minutes, immediately halt incoming loads. Prioritize batches with shelf life &lt;2 days for urgent processing or direct liquidation.
              </p>
              <span className="badge badge-warning">EMERGENCY PROCEDURE</span>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <FileText size={15} color="#0284c7" />
                SOP-03: Solar Battery Maintenance
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Clean photovoltaic panel glass weekly in dusty agricultural zones. Ensure minimum 20% state-of-charge buffer at sunset to guarantee night-time compressor cycling.
              </p>
              <span className="badge badge-safe">PREVENTIVE MAINTENANCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
