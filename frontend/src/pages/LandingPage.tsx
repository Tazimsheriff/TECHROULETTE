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
  Warehouse,
  Thermometer,
  Sun,
  Battery,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { state } = useTwin();

  const featureCards = [
    {
      step: '01',
      title: 'Real-Time Smart Sensors',
      subtitle: 'Edge IoT Hardware',
      description: 'Continuous monitoring of temperature, humidity, and door status using low-cost ESP32 solar-powered sensors.',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: Cpu,
      link: '/dashboard',
      actionText: 'View Live Sensors'
    },
    {
      step: '02',
      title: '3D Virtual Cold Room',
      subtitle: 'Interactive Digital Twin',
      description: 'Explore the cold storage facility in 3D. Click any tomato crate to inspect its freshness and quality in real time.',
      color: '#059669',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      icon: Warehouse,
      link: '/twin',
      actionText: 'Open 3D Cold Room'
    },
    {
      step: '03',
      title: 'Tomato Freshness Predictor',
      subtitle: 'Biological Kinetic Model',
      description: 'Calculates exact shelf life days based on accumulated heat, telling farmers which crates to sell first before spoiling.',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      icon: Zap,
      link: '/simulation',
      actionText: 'Try Spoilage Simulator'
    },
    {
      step: '04',
      title: 'QR Digital Food Passports',
      subtitle: 'Transparent Traceability',
      description: 'Each crate gets a scannable QR code showing harvest date, temperature history, and quality guarantee for buyers.',
      color: '#7c3aed',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      icon: ShieldCheck,
      link: '/batches',
      actionText: 'Browse Produce Crates'
    }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0 3rem' }}>
      
      {/* Hero Welcome Card with Vibrant Colors and Clear Typography */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        {/* UN-FAO Badge */}
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
          marginBottom: '1.25rem'
        }}>
          <Globe size={16} color="#2563eb" />
          <span>UN-FAO SOUTH-SOUTH COOPERATION • DIGITAL COLD CHAIN FRAMEWORK</span>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          marginBottom: '1rem'
        }}>
          Solar Cold Storage & Freshness Digital Twin
        </h1>

        <p style={{
          fontSize: '17px',
          color: '#334155',
          maxWidth: '920px',
          lineHeight: 1.65,
          marginBottom: '2rem'
        }}>
          FreshVault Twin monitors decentralized, solar-powered cold storage rooms for smallholder farming cooperatives.
          It combines live temperature sensors with biological food science to predict produce shelf life, preventing food waste before it happens.
        </p>

        {/* Live Facility Health Banner (Layman Friendly with Big Numbers and Colors) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: '14px',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          {/* Room Temperature */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: state.temperature > 12 ? '#fef2f2' : '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${state.temperature > 12 ? '#fca5a5' : '#a7f3d0'}`
            }}>
              <Thermometer size={26} color={state.temperature > 12 ? '#dc2626' : '#059669'} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Cold Room Temp</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: state.temperature > 12 ? '#dc2626' : '#059669' }}>
                {state.temperature}°C
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {state.temperature > 12 ? '⚠️ Above Safe Limit' : '✓ Safe & Cold (4-12°C)'}
              </div>
            </div>
          </div>

          {/* Solar Power */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fde68a'
            }}>
              <Sun size={26} color="#d97706" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Rooftop Solar Power</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706' }}>
                {state.solarPower} W
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {state.solarPower > 500 ? '☀️ Generating Peak Power' : '☁️ Low Sun / In Battery Mode'}
              </div>
            </div>
          </div>

          {/* Battery Reserve */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: state.batteryPercent < 25 ? '#fef2f2' : '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${state.batteryPercent < 25 ? '#fca5a5' : '#bbf7d0'}`
            }}>
              <Battery size={26} color={state.batteryPercent < 25 ? '#dc2626' : '#16a34a'} />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Battery Reserve</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: state.batteryPercent < 25 ? '#dc2626' : '#16a34a' }}>
                {state.batteryPercent}%
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {state.batteryPercent < 25 ? 'Low Battery Backup' : '✓ Full Overnight Buffer'}
              </div>
            </div>
          </div>

          {/* Stored Produce */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ddd6fe'
            }}>
              <Layers size={26} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Monitored Lots</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#7c3aed' }}>
                {state.batches.length} Crates
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                100% Tracked & Monitored
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '16px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderRadius: '10px'
            }}
          >
            <Activity size={18} />
            Open Command Center
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/twin"
            className="btn"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '16px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              borderColor: '#bae6fd'
            }}
          >
            <Box size={18} />
            View 3D Cold Twin
          </Link>

          <Link
            to="/simulation"
            className="btn"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '16px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              borderColor: '#fde68a'
            }}
          >
            <Sliders size={18} />
            Test Scenarios & Outages
          </Link>
        </div>
      </section>

      {/* Feature Pillar Cards - Vibrant, Colorful, Spacious, Clickable */}
      <section>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            How FreshVault Protects Smallholder Produce
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '4px 0 0' }}>
            Four integrated technologies working together to stop food spoilage in decentralized agricultural communities:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.5rem'
        }}>
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.step}
                to={card.link}
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: `2px solid ${card.border}`,
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.08)`;
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = card.border;
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${card.border}`
                    }}>
                      <Icon size={24} color={card.color} />
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: card.color,
                      backgroundColor: card.bg,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: `1px solid ${card.border}`
                    }}>
                      Step {card.step}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    {card.subtitle}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {card.description}
                  </p>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: card.color,
                  fontSize: '14px',
                  fontWeight: 700
                }}>
                  <span>{card.actionText}</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real-World Context Section with Clean Friendly Contrast */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Why This Matters for Farmers & Co-ops
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '4px 0 0' }}>
            Transforming postharvest loss into farmer income through smart, affordable technology:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* The Problem */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff1f2',
            borderRadius: '12px',
            border: '2px solid #fecdd3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={22} color="#e11d48" />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#9f1239', margin: 0 }}>
                The Challenge: 35%+ Food Loss
              </h3>
            </div>
            <p style={{ fontSize: '14.5px', color: '#881337', lineHeight: 1.6, margin: 0 }}>
              In rural areas, grid blackouts and hot weather spoil harvested tomatoes before they can reach the city.
              Without temperature tracking, co-ops don't know which crates are expiring first, leading to widespread spoilage and financial loss.
            </p>
          </div>

          {/* The Solution */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            border: '2px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={22} color="#16a34a" />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                The Solution: Smart Cold Chain Twin
              </h3>
            </div>
            <p style={{ fontSize: '14.5px', color: '#166534', lineHeight: 1.6, margin: 0 }}>
              FreshVault Twin monitors temperature continuously and calculates the remaining freshness days for every crate.
              Co-ops are alerted instantly when cooling drops, and they can prioritize dispatching the most urgent produce first (FEFO dispatch).
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

