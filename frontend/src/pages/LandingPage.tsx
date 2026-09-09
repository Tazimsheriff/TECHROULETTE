import React from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import {
  Activity,
  Box,
  Sliders,
  Globe,
  ArrowRight,
  Cpu,
  Zap,
  ShieldCheck,
  Warehouse
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { state } = useTwin();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0 2rem' }}>
      {/* Technical Briefing Header */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-hairline)',
        borderTop: '3px solid var(--steel-slate)',
        borderRadius: 'var(--radius-panel)',
        padding: '1.5rem 1.5rem',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '2px 8px', backgroundColor: 'var(--scada-normal-bg)', border: '1px solid var(--scada-normal-border)', borderRadius: '2px', fontSize: '10px', fontWeight: 700, color: 'var(--scada-normal)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
          <Globe size={12} />
          UN-FAO SOUTH-SOUTH COOPERATION DIGITAL TWIN FRAMEWORK [SSTC-AGRI]
        </div>

        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2, maxWidth: '850px', marginBottom: '0.5rem' }}>
          FreshVault Twin: Decentralized Cold-Chain Digital Twin
        </h1>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.5, marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
          Operational digital twin platform for solar-powered decentralized cold storage. Connects low-cost IoT sensor telemetry with Arrhenius postharvest respiration kinetics to predict quality loss and trigger proactive triage decisions before food spoilage occurs.
        </p>

        {/* Live Facility Status Line */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '0.65rem 1rem',
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-sharp)',
          marginBottom: '1.25rem',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>NODE: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{state.facilityId}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>CHAMBER TEMP: </span>
            <strong style={{ color: state.temperature > 12 ? 'var(--scada-alarm)' : 'var(--scada-normal)' }}>
              {state.temperature}°C
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>PV / BATTERY: </span>
            <strong style={{ color: 'var(--text-primary)' }}>
              {state.solarPower} W / {state.batteryPercent}%
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>MONITORED LOTS: </span>
            <strong>{state.batches.length} Crates (100% Telemetry)</strong>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className={`badge badge-${state.overallRisk}`}>
              SYS: {state.overallRisk.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">
            <Activity size={12} />
            Launch Operations Console
            <ArrowRight size={11} />
          </Link>
          <Link to="/twin" className="btn">
            <Box size={12} />
            Inspect 3D Cold Twin
          </Link>
          <Link to="/simulation" className="btn btn-warning">
            <Sliders size={12} />
            Fault Injection Bench
          </Link>
        </div>
      </section>

      {/* Engineering Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Cpu size={13} color="#0369a1" />
              1. Edge IoT Instrumentation
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Dual-core ESP32 microcontrollers with DS18B20 1-wire digital temperature probes, DHT22 humidity sensors, and magnetic reed switches logging chamber integrity.
            </p>
            <div style={{ color: 'var(--text-muted)' }}>
              Target hardware BOM &lt; $35 USD per unit.
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Warehouse size={13} color="#15803d" />
              2. 3D Spatial Digital Twin
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Real-time React Three Fiber cutaway vault displaying dynamic color-coded batch lots, rotating refrigeration blowers, hinging seal doors, and solar generation arrays.
            </p>
            <div style={{ color: 'var(--text-muted)' }}>
              Interactive raycasting crate inspection.
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Zap size={13} color="#c2410c" />
              3. Respiration Kinetics Model
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Arrhenius biological respiration kinetics (Q10 = 2.4) evaluating cumulative temperature excursion duration rather than arbitrary calendar expiry dates.
            </p>
            <div style={{ color: 'var(--text-muted)' }}>
              First-Expired, First-Out (FEFO) triage.
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <ShieldCheck size={13} color="#0f172a" />
              4. QR Product Passport
            </div>
          </div>
          <div className="panel-body" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              Field-scannable digital product passports displaying harvest origin, continuous temperature logs, residual shelf life, and FAO Codex compliance seals.
            </p>
            <div style={{ color: 'var(--text-muted)' }}>
              Compatible with standard smartphones.
            </div>
          </div>
        </div>
      </div>

      {/* South-South Context Box */}
      <section className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            South-South Agro-Corridor Problem & Solution Mapping
          </div>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <div>
            <strong style={{ color: 'var(--scada-alarm)', textTransform: 'uppercase' }}>
              The Cold-Chain Deficit in Developing Regions:
            </strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              Over 35% of harvested horticultural produce is lost postharvest due to unmonitored temperature ruptures, rural grid outages, and doors left unsealed. Reactive inspections catch damage only when rotting is already irreversible.
            </p>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '1.5rem' }}>
            <strong style={{ color: 'var(--scada-normal)', textTransform: 'uppercase' }}>
              The FreshVault Twin Decision Support:
            </strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              By modeling the thermodynamic state of each crate in real time, cooperatives receive immediate early warnings and know exactly which lots to fast-track to market, preventing catastrophic economic loss for smallholder farmers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
