import React, { useState } from 'react';
import {
  Globe,
  Download,
  FileText
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '2px 6px', backgroundColor: 'var(--scada-normal-bg)', border: '1px solid var(--scada-normal-border)', borderRadius: '2px', fontSize: '10px', fontWeight: 700, color: 'var(--scada-normal)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>
            <Globe size={11} />
            UN-FAO SOUTH-SOUTH & TRIANGULAR COOPERATION (SSTC) PROTOCOL
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Knowledge Hub // Cross-Border Commodity Blueprints
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            OPEN HARDWARE SCHEMATICS & STANDARD OPERATING PROCEDURES (SOPS)
          </p>
        </div>

        <button className="btn btn-sm btn-primary">
          <Download size={11} /> Export Blueprint PDF
        </button>
      </div>

      {/* Blueprint Selector Panel */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            <Globe size={13} color="#0369a1" />
            Regional Commodity Profiles (Select Global South Node)
          </div>
        </div>
        <div className="panel-body">
          {/* Country Selection */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {profiles.map((p) => (
              <button
                key={p.country}
                className={`btn btn-sm ${selectedCountry === p.country ? 'btn-primary' : ''}`}
                onClick={() => setSelectedCountry(p.country)}
              >
                <span>{p.flag}</span>
                {p.country} ({p.commodity.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Active Blueprint Spec */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '1rem',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-hairline)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{currentProfile.flag}</span>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  {currentProfile.commodity} — {currentProfile.country}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '0.5rem 0' }}>
                <div style={{ padding: '0.45rem', backgroundColor: '#ffffff', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Temperature</div>
                  <div style={{ fontWeight: 700, color: '#0369a1' }}>{currentProfile.targetTemp}</div>
                </div>

                <div style={{ padding: '0.45rem', backgroundColor: '#ffffff', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Humidity</div>
                  <div style={{ fontWeight: 700 }}>{currentProfile.targetHumidity}</div>
                </div>
              </div>

              <div style={{ marginBottom: '0.45rem' }}>
                <strong style={{ textTransform: 'uppercase' }}>Local Supply Chain Challenge:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1px', lineHeight: 1.4 }}>
                  {currentProfile.localChallenge}
                </p>
              </div>

              <div>
                <strong style={{ textTransform: 'uppercase' }}>Decentralized Digital Twin Spec:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1px', lineHeight: 1.4 }}>
                  {currentProfile.twinArchitecture}
                </p>
              </div>
            </div>

            {/* Impact Box */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--border-hairline)', paddingLeft: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--scada-normal-bg)', border: '1px solid var(--scada-normal-border)', textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--scada-normal)', textTransform: 'uppercase' }}>
                  Verified Postharvest Retention
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--scada-normal)', margin: '2px 0' }}>
                  {currentProfile.shelfLifeGain}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--scada-normal)' }}>
                  VERSUS UNMONITORED AMBIENT STORAGE
                </div>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '0.75rem' }}>
                <strong>FAO CODEX BENCHMARK:</strong> Complies with CAC/RCP 47-2001 for hygienic transport and pre-cooling of bulk and perishable commodities.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOP Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={12} color="#15803d" />
              SOP-01: Rapid Pre-Cooling Protocol
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
              Remove field heat within 90 minutes of morning harvest (&lt;8:00 AM). Never intermix climacteric ripe lots with green harvest stock.
            </p>
            <span className="badge badge-safe">STANDARD COMPLIANCE</span>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={12} color="#b45309" />
              SOP-02: Cold-Breach Emergency Response
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
              If chamber exceeds 12.0°C for &gt;45 min, halt incoming consignments. Divert lots with residual life &lt;2 days to regional processing.
            </p>
            <span className="badge badge-warning">EMERGENCY PROCEDURE</span>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={12} color="#0369a1" />
              SOP-03: Solar Battery Preservation
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
              Clean photovoltaic panel glass weekly in dusty agricultural corridors. Maintain minimum 20% state-of-charge reserve at twilight.
            </p>
            <span className="badge badge-safe">PREVENTIVE MAINTENANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
