import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTwin } from '../../context/TwinContext';
import {
  AlertTriangle,
  LayoutDashboard,
  Activity,
  Box,
  Sliders,
  Layers,
  MapPin,
  LineChart,
  BookOpen,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { state } = useTwin();
  const location = useLocation();

  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [acknowledgedAlert, setAcknowledgedAlert] = useState<string | null>(null);

  // If a new alert message appears, make sure the banner pops up again
  useEffect(() => {
    if (state.activeAlert && state.activeAlert !== acknowledgedAlert) {
      setIsAlertDismissed(false);
    }
  }, [state.activeAlert, acknowledgedAlert]);

  const handleClearAlert = () => {
    setIsAlertDismissed(true);
    setAcknowledgedAlert(state.activeAlert);
  };

  const handleRestoreAlert = () => {
    setIsAlertDismissed(false);
  };

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

      {/* Main branding & color navigation row */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-badge">
            FV-TWIN
          </div>
          <div className="brand-titles">
            <h1>FreshVault Cold-Chain Twin</h1>
            <p>Solar Cold Storage & Postharvest Quality Digital Twin • UN-FAO SSTC</p>
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

      {/* Active Alert Banner if abnormal condition and NOT dismissed */}
      {state.activeAlert && !isAlertDismissed && (
        <div className={`alert-banner ${state.overallRisk}`} style={{ padding: '0.65rem 2rem', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
            <AlertTriangle size={17} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {state.activeAlert}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', opacity: 0.9 }}>
              FAULT CODE: {state.activeSimulation || 'PARAM_EXCURSION'}
            </span>
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

            {/* Clear Button */}
            <button
              onClick={handleClearAlert}
              title="Clear this notification banner"
              style={{
                background: 'rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'inherit',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.16)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)')}
            >
              <X size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* When cleared, display an acknowledged status strip so notifications are not removed in entirety */}
      {state.activeAlert && isAlertDismissed && (
        <div style={{
          padding: '0.35rem 2rem',
          backgroundColor: '#fafbfc',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: state.overallRisk === 'critical' ? '#dc2626' : '#f59e0b',
              display: 'inline-block'
            }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              1 Active Alarm Acknowledged:
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {state.activeAlert}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/simulation" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
              Diagnostic Lab
            </Link>
            <button
              onClick={handleRestoreAlert}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              Show Banner Again
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


