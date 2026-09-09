import React from 'react';
import { Link } from 'react-router-dom';
import { useTwin } from '../context/TwinContext';
import {
  Activity,
  Box,
  Sliders,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertOctagon,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { state } = useTwin();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#166534', marginBottom: '1.25rem' }}>
          <Globe size={14} />
          FAO-SSC DIGITAL AGRICULTURE & FOOD SAFETY STANDARD
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.15, maxWidth: '850px', marginBottom: '1rem' }}>
          See the cold chain before it fails.
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '780px', lineHeight: 1.6, marginBottom: '2rem' }}>
          An IoT-enabled digital twin for food safety, biological quality prediction, and proactive cold-chain decision support. Engineered for solar-powered decentralized cold storage, protecting smallholder harvests across the Global South.
        </p>

        {/* Live status badge from active facility */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facility Node</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{state.facilityId}</div>
          </div>
          <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Temp</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: state.temperature > 12 ? 'var(--status-critical)' : 'var(--status-safe)' }}>
              {state.temperature} °C
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PV Power / Battery</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              {state.solarPower} W / {state.batteryPercent}%
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Batches</div>
            <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              {state.batches.length} Lots (100% Monitored)
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className={`badge badge-${state.overallRisk}`}>
              SYSTEM {state.overallRisk.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Activity size={16} />
            Open Operations Dashboard
            <ArrowRight size={14} />
          </Link>
          <Link to="/twin" className="btn" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Box size={16} />
            Launch 3D Cold Twin
          </Link>
          <Link to="/simulation" className="btn btn-warning" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Sliders size={16} />
            Test Failure Scenarios
          </Link>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '1rem' }}>
          Engineered Digital-Twin Architecture
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Cpu size={16} color="#0284c7" />
                1. Low-Cost IoT Node
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                ESP32 dual-core microcontrollers coupled with DS18B20/DHT22 temperature & humidity sensors, door reed switches, and INA219 solar-battery telemetry.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Target BOM cost &lt; $35 USD per cold chamber.
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Box size={16} color="#166534" />
                2. Live 3D Spatial Twin
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                React Three Fiber cutaway environment displaying dynamic color-shifting produce crates, animated compressor blower fans, opening insulated seal doors, and thermal breach overlays.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Real-time raycast batch inspection.
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <Zap size={16} color="#d97706" />
                3. Respiration Kinetics Engine
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                Arrhenius-based postharvest respiration kinetics calculate quality degradation and remaining shelf life based on temperature excursion duration rather than static calendar dates.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                FEFO (First-Expired, First-Out) optimization.
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header">
              <div className="panel-title">
                <ShieldCheck size={16} color="#7c3aed" />
                4. QR Product Passport
              </div>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                Scannable digital identity for each tomato crate containing full chain-of-custody, temperature logs, compliance stamps, and action advisories for buyers, cooperatives, and food inspectors.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                FAO-compliant digital traceability.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & South-South Solution */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', marginBottom: '0.5rem' }}>
              <AlertOctagon size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Cold-Chain Blindspot</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Why fixed expiration dates fail smallholders
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
              Over 35% of harvested horticultural produce in developing regions is lost before reaching consumers due to unrecorded cold-chain ruptures, solar battery drops, or doors left ajar. Traditional manual logs detect spoilage only when physical rot is already irreversible.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#64748b' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <TrendingDown size={14} color="#dc2626" />
                Reactive testing: issues discovered only at consumer terminal
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <TrendingDown size={14} color="#dc2626" />
                Unfair price deductions imposed on small farmers by middlemen
              </li>
            </ul>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The FreshVault Remedy</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Proactive early warning & actionable triage
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
              FreshVault Twin transforms blind storage into an intelligent operational control room. If a solar panel is shaded or cooling trips, the system immediately predicts the exact remaining shelf life for every crate and tells operators which lot to sell first.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#166534' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={14} />
                Dynamic shelf life computed from continuous physics & biological model
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={14} />
                Reusable blueprints for India, Kenya, Indonesia, and Bangladesh
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
