import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import {
  Activity,
  Box,
  Sliders,
  Layers,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Zap,
  BookOpen,
  LineChart,
  GitCommit
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state, isConnected, triggerSimulation } = useTwin();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: Layers },
    { path: '/dashboard', label: 'Command Center', icon: Activity },
    { path: '/twin', label: '3D Cold Twin', icon: Box },
    { path: '/simulation', label: 'Simulation Lab', icon: Sliders },
    { path: '/batches', label: 'Batch Triage', icon: Layers },
    { path: '/traceability', label: 'Traceability', icon: GitCommit },
    { path: '/insights', label: 'Analytics', icon: LineChart },
    { path: '/knowledge', label: 'Knowledge Hub', icon: BookOpen },
  ];

  return (
    <header className="control-header">
      {/* Top telemetry status bar */}
      <div className="header-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
            <MapPin size={13} />
            <span style={{ fontWeight: 600 }}>{state.facilityId}</span>
            <span style={{ color: 'var(--text-muted)' }}>| {state.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span className={`pulse-dot ${isConnected ? 'online' : 'alert'}`} />
            <span>{isConnected ? 'LIVE TELEMETRY (WOKWI/ESP32)' : 'STANDALONE ENGINE'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-muted)' }}>SOLAR INFLUX:</span>
            <span style={{ fontWeight: 600, color: '#b45309' }}>{state.solarPower} W</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>BATTERY:</span>
            <span style={{ fontWeight: 600, color: state.batteryPercent < 25 ? 'var(--status-critical)' : 'var(--status-safe)' }}>
              {state.batteryPercent}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => triggerSimulation('cooling-failure')}
              title="Test cooling fault chain-reaction"
            >
              <Zap size={12} />
              Simulate Failure
            </button>
            <button
              className="btn btn-sm"
              onClick={() => triggerSimulation('reset')}
              title="Reset twin state to nominal"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-logo-mark">FV</div>
          <div className="brand-titles">
            <h1>FreshVault Twin</h1>
            <p>IoT Food Safety & Cold-Chain Decision Twin • FAO-SSC Protocol</p>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={14} />
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
        <div className={`alert-banner ${state.overallRisk}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={15} />
            <span>{state.activeAlert}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.725rem' }}>ACTIVE SCENARIO: {state.activeSimulation || 'System Threshold Anomaly'}</span>
            <Link to="/simulation" style={{ color: 'inherit', textDecoration: 'underline', fontSize: '0.725rem' }}>
              View in Simulation Lab →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
