import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import {
  MapPin,
  AlertTriangle,
  RotateCcw,
  Zap,
  LayoutDashboard,
  Activity,
  Box,
  Sliders,
  Layers,
  LineChart,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state, isConnected, triggerSimulation } = useTwin();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { path: '/dashboard', label: 'Command Center', icon: Activity, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
    { path: '/twin', label: '3D Cold Twin', icon: Box, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
    { path: '/simulation', label: 'Simulation Lab', icon: Sliders, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
    { path: '/batches', label: 'Batch Ledger', icon: Layers, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { path: '/traceability', label: 'Traceability', icon: MapPin, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
    { path: '/insights', label: 'Telemetry & Physics', icon: LineChart, color: '#475569', bg: '#f8fafc', border: '#cbd5e1' },
    { path: '/knowledge', label: 'FAO Knowledge Hub', icon: BookOpen, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  ];

  return (
    <header className="control-header">
      {/* Top telemetry status bar */}
      <div className="header-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
            <MapPin size={14} color="#0284c7" />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>{state.facilityId}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>• {state.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            <span className={`pulse-dot ${isConnected ? 'online' : 'alert'}`} />
            <span style={{ color: isConnected ? '#15803d' : '#dc2626', fontWeight: 600, fontSize: '12px' }}>
              {isConnected ? 'LIVE BMS LINK (ESP32/WOKWI ONLINE)' : 'SIMULATED COLD-CHAIN STATE'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ fontSize: '13px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>
              <span style={{ color: 'var(--text-muted)' }}>Solar PV: </span>
              <strong style={{ color: '#ea580c' }}>{state.solarPower} W</strong>
            </span>
            <span>
              <span style={{ color: 'var(--text-muted)' }}>Battery: </span>
              <strong style={{ color: state.batteryPercent < 25 ? '#dc2626' : '#15803d' }}>
                {state.batteryPercent}%
              </strong>
            </span>
            <span>
              <span style={{ color: 'var(--text-muted)' }}>Storage Temp: </span>
              <strong style={{ color: state.temperature > 12 ? '#dc2626' : '#15803d' }}>
                {state.temperature}°C
              </strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => triggerSimulation('cooling-failure')}
              title="Test cooling fault chain-reaction"
              style={{ padding: '0.35rem 0.75rem', fontSize: '12px', fontWeight: 600 }}
            >
              <Zap size={13} />
              Fault Trip
            </button>
            <button
              className="btn btn-sm"
              onClick={() => triggerSimulation('reset')}
              title="Reset twin state to nominal"
              style={{ padding: '0.35rem 0.75rem', fontSize: '12px' }}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main branding & color navigation row */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-badge" style={{ backgroundColor: '#0284c7', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontWeight: 800 }}>
            FV-TWIN
          </div>
          <div className="brand-titles">
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              FreshVault Cold-Chain Twin
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Solar Cold Storage & Postharvest Quality Digital Twin • UN-FAO SSTC
            </p>
          </div>
        </div>

        {/* Dedicated color tabs - cleanly laid out with no awkward wrapping */}
        <nav className="header-nav-container">
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-tab-item ${isActive ? 'active' : ''}`}
                    style={{
                      '--tab-color': item.color,
                      '--tab-bg': item.bg,
                      '--tab-border': item.border,
                    } as React.CSSProperties}
                  >
                    <Icon size={16} color={isActive ? item.color : '#64748b'} className="tab-icon" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Active Alert Banner if abnormal condition */}
      {state.activeAlert && (
        <div className={`alert-banner ${state.overallRisk}`} style={{ padding: '0.65rem 2rem', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={17} />
            <span style={{ fontWeight: 600 }}>{state.activeAlert}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '12px', opacity: 0.9 }}>FAULT CODE: {state.activeSimulation || 'PARAM_EXCURSION'}</span>
            <Link
              to="/simulation"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Open Diagnostic Lab &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

