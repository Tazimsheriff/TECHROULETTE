import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import {
  MapPin,
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state, isConnected, triggerSimulation } = useTwin();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/dashboard', label: 'Command Center' },
    { path: '/twin', label: '3D Cold Twin' },
    { path: '/simulation', label: 'Simulation Lab' },
    { path: '/batches', label: 'Batch Ledger' },
    { path: '/traceability', label: 'Traceability' },
    { path: '/insights', label: 'Telemetry & Physics' },
    { path: '/knowledge', label: 'FAO Knowledge Hub' },
  ];

  return (
    <header className="control-header">
      {/* Top telemetry status bar */}
      <div className="header-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <MapPin size={12} />
            <span style={{ fontWeight: 700 }}>{state.facilityId}</span>
            <span style={{ color: 'var(--text-muted)' }}>:: {state.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid var(--border-hairline)', paddingLeft: '0.85rem' }}>
            <span className={`pulse-dot ${isConnected ? 'online' : 'alert'}`} />
            <span style={{ color: isConnected ? 'var(--scada-normal)' : 'var(--scada-alarm)', fontWeight: 600 }}>
              {isConnected ? 'LIVE BMS LINK (WOKWI/ESP32)' : 'STANDALONE PHYSICAL MODEL'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>PV INFLUX: </span>
            <span style={{ fontWeight: 700, color: '#c2410c' }}>{state.solarPower} W</span>
            <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem' }}>STORAGE BUFFER: </span>
            <span style={{ fontWeight: 700, color: state.batteryPercent < 25 ? 'var(--scada-alarm)' : 'var(--scada-normal)' }}>
              {state.batteryPercent}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderLeft: '1px solid var(--border-hairline)', paddingLeft: '0.85rem' }}>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => triggerSimulation('cooling-failure')}
              title="Test cooling fault chain-reaction"
            >
              <Zap size={11} />
              Fault Trip
            </button>
            <button
              className="btn btn-sm"
              onClick={() => triggerSimulation('reset')}
              title="Reset twin state to nominal"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-badge">FV-TWIN</div>
          <div className="brand-titles">
            <h1>FreshVault Cold-Chain Twin</h1>
            <p>DECISION SUPPORT SYSTEM • UN-FAO SSTC CODEX AGRI-04</p>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <AlertTriangle size={14} />
            <span>{state.activeAlert}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '10px' }}>FAULT CODE: {state.activeSimulation || 'PARAM_EXCURSION'}</span>
            <Link to="/simulation" style={{ color: 'inherit', textDecoration: 'underline', fontSize: '10px' }}>
              DIAGNOSTIC LAB &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
