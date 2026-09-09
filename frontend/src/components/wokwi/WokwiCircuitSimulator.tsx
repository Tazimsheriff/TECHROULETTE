import React, { useState, useEffect, useRef } from 'react';
import '@wokwi/elements';
import { useTwin } from '../../context/TwinContext';
import {
  Cpu,
  RotateCcw,
  Zap,
  DoorOpen,
  Sun,
  Activity,
  Maximize2,
  Minimize2,
  Terminal,
  Layers,
  Sparkles,
  Info,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sliders
} from 'lucide-react';
import { playClickSound } from '../../utils/soundEffects';

export const WokwiCircuitSimulator: React.FC = () => {
  const { state, triggerSimulation } = useTwin();
  const [oledPage, setOledPage] = useState<number>(0);
  const [autoCycleOled, setAutoCycleOled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredNet, setHoveredNet] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'circuit' | 'terminal' | 'schematic'>('circuit');

  // Auto-cycle OLED page every 3.5s like Wokwi firmware sketch.ino
  useEffect(() => {
    if (!autoCycleOled) return;
    const timer = setInterval(() => {
      setOledPage((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoCycleOled]);

  const isSafe = state.overallRisk === 'safe';
  const isWarning = state.overallRisk === 'warning';
  const isCritical = state.overallRisk === 'critical';
  const isCooling = state.coolingOn;

  // Derived effective values matching sketch.ino
  const roomEffective = state.temperature;
  const productEffective = +(state.temperature + 0.3).toFixed(1);
  const batchQuality = state.batches[0]?.qualityScore ?? 94.0;
  const batchLife = state.batches[0]?.shelfLifeDays ?? 6.6;

  // OLED recommendation string matching sketch.ino lines 80-94
  const oledRecommendation = isCritical
    ? (state.refrigeratorHealth === 'failed' ? 'Cooling fault: inspect batch' : state.batteryPercent < 10 ? 'Battery critical: backup' : 'High temp: isolate')
    : state.doorOpen
    ? 'Close door and monitor'
    : (state.batteryPercent <= 30 ? 'Conserve power, dispatch' : 'Maintain storage');

  // Interactive hardware button triggers
  const handleButtonPress = async (action: 'door' | 'fault' | 'solar' | 'reset') => {
    playClickSound();
    if (action === 'door') {
      await triggerSimulation('door-open');
    } else if (action === 'fault') {
      await triggerSimulation('cooling-failure');
    } else if (action === 'solar') {
      await triggerSimulation('solar-failure');
    } else if (action === 'reset') {
      await triggerSimulation('reset');
    }
  };

  // Wire list matching WOKWI/diagram.json
  const wires = [
    // 3V3 Power Rails (Red)
    { id: 'w_3v3_dht', from: [205, 230], to: [450, 160], color: '#ef4444', label: '3V3 -> DHT22 VCC' },
    { id: 'w_3v3_oled', from: [205, 230], to: [205, 115], color: '#ef4444', label: '3V3 -> OLED 3V3' },
    { id: 'w_3v3_ds', from: [205, 230], to: [450, 310], color: '#ef4444', label: '3V3 -> DS18B20 VCC' },
    { id: 'w_3v3_pullup', from: [450, 310], to: [550, 275], color: '#ef4444', label: '3V3 -> DS18B20 Pullup' },

    // Ground Rails (Dark Slate / Black)
    { id: 'w_gnd_oled', from: [215, 230], to: [215, 115], color: '#1e293b', strokeWidth: 3, label: 'GND -> OLED GND' },
    { id: 'w_gnd_dht', from: [215, 230], to: [480, 160], color: '#1e293b', strokeWidth: 3, label: 'GND -> DHT22 GND' },
    { id: 'w_gnd_ds', from: [215, 230], to: [480, 310], color: '#1e293b', strokeWidth: 3, label: 'GND -> DS18B20 GND' },
    { id: 'w_gnd_buzzer', from: [215, 230], to: [485, 495], color: '#1e293b', strokeWidth: 3, label: 'GND -> Buzzer GND' },
    { id: 'w_gnd_door', from: [215, 230], to: [120, 600], color: '#1e293b', strokeWidth: 3, label: 'GND -> Door Switch' },
    { id: 'w_gnd_fault', from: [215, 230], to: [260, 600], color: '#1e293b', strokeWidth: 3, label: 'GND -> Fault Switch' },
    { id: 'w_gnd_solar', from: [215, 230], to: [400, 600], color: '#1e293b', strokeWidth: 3, label: 'GND -> Solar Switch' },
    { id: 'w_gnd_leds', from: [215, 230], to: [150, 520], color: '#1e293b', strokeWidth: 3, label: 'GND -> LED Cathodes' },

    // Data / Signal Lines
    { id: 'w_dht_sda', from: [245, 230], to: [465, 160], color: '#22c55e', label: 'GPIO 15 -> DHT22 Data (SDA)' },
    { id: 'w_ds_dq', from: [235, 230], to: [465, 310], color: '#22c55e', label: 'GPIO 4 -> DS18B20 1-Wire Data' },
    { id: 'w_oled_sda', from: [225, 230], to: [175, 115], color: '#38bdf8', label: 'GPIO 21 -> OLED SDA' },
    { id: 'w_oled_scl', from: [235, 230], to: [185, 115], color: '#38bdf8', label: 'GPIO 22 -> OLED SCL' },

    // GPIO Outputs (LEDs & Buzzer)
    { id: 'w_safe_led', from: [175, 330], to: [150, 430], color: '#22c55e', label: 'GPIO 25 -> SAFE LED (Green)' },
    { id: 'w_warn_led', from: [185, 330], to: [240, 430], color: '#eab308', label: 'GPIO 26 -> WARNING LED (Yellow)' },
    { id: 'w_crit_led', from: [195, 330], to: [330, 430], color: '#ef4444', label: 'GPIO 27 -> CRITICAL LED (Red)' },
    { id: 'w_cool_led', from: [245, 330], to: [240, 690], color: '#3b82f6', label: 'GPIO 23 -> COOLING ACTIVE LED (Blue)' },
    { id: 'w_buzzer', from: [225, 330], to: [465, 495], color: '#a855f7', label: 'GPIO 18 -> Buzzer' },

    // GPIO Pushbutton Inputs
    { id: 'w_btn_door', from: [165, 330], to: [100, 580], color: '#f97316', label: 'GPIO 19 -> Door Button' },
    { id: 'w_btn_fault', from: [155, 330], to: [240, 580], color: '#f97316', label: 'GPIO 32 -> Fault Button' },
    { id: 'w_btn_solar', from: [145, 330], to: [380, 580], color: '#f97316', label: 'GPIO 33 -> Solar Button' },
  ];

  return (
    <div
      className="wokwi-circuit-container"
      style={{
        backgroundColor: '#0a0f1d',
        borderRadius: '16px',
        border: '2px solid #1e293b',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        color: '#f8fafc',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : 'auto',
        zIndex: isFullscreen ? 99999 : 10,
        marginBottom: '1.5rem'
      }}
    >
      {/* Top Header & Mode Switcher */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '6px 10px',
              backgroundColor: '#0284c7',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '13px'
            }}
          >
            <Cpu size={17} color="#ffffff" />
            WOKWI ESP32 CIRCUIT SIMULATOR GUI
          </div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            Interactive Virtual Breadboard • diagram.json & sketch.ino
          </span>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', backgroundColor: '#1e293b', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setActiveTab('circuit')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'circuit' ? '#0284c7' : 'transparent',
                color: activeTab === 'circuit' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Interactive Circuit
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'terminal' ? '#0284c7' : 'transparent',
                color: activeTab === 'terminal' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Serial Telemetry Monitor
            </button>
            <button
              onClick={() => setActiveTab('schematic')}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'schematic' ? '#0284c7' : 'transparent',
                color: activeTab === 'schematic' ? '#ffffff' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Pinout Table
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            style={{
              padding: '6px 10px',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Interactive Circuit Canvas */}
      {activeTab === 'circuit' && (
        <div style={{ position: 'relative', overflowX: 'auto', padding: '1rem', minHeight: '620px' }}>
          
          {/* Quick Hardware Controls Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              zIndex: 30,
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '0.85rem',
              width: '280px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚡ Live Hardware Test Bench
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              <button
                onClick={() => handleButtonPress('door')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${state.doorOpen ? '#ea580c' : '#475569'}`,
                  backgroundColor: state.doorOpen ? '#7c2d12' : '#1e293b',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Pushbutton 1 (Pin 19)</span>
                <span>{state.doorOpen ? 'DOOR OPEN (+2.5°C)' : 'DOOR CLOSED'}</span>
              </button>

              <button
                onClick={() => handleButtonPress('fault')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${state.refrigeratorHealth === 'failed' ? '#dc2626' : '#475569'}`,
                  backgroundColor: state.refrigeratorHealth === 'failed' ? '#7f1d1d' : '#1e293b',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Pushbutton 2 (Pin 32)</span>
                <span>{state.refrigeratorHealth === 'failed' ? 'FAULT ACTIVE (+5°C)' : 'COMPRESSOR OK'}</span>
              </button>

              <button
                onClick={() => handleButtonPress('solar')}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${state.solarPower < 100 ? '#ca8a04' : '#475569'}`,
                  backgroundColor: state.solarPower < 100 ? '#713f12' : '#1e293b',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>Pushbutton 3 (Pin 33)</span>
                <span>{state.solarPower < 100 ? 'SOLAR COLLAPSE (28W)' : '340W FULL SUN'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleButtonPress('reset')}
                style={{
                  flex: 1,
                  padding: '5px',
                  borderRadius: '6px',
                  border: '1px solid #475569',
                  backgroundColor: '#334155',
                  color: '#f8fafc',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RotateCcw size={11} /> Reset Circuit
              </button>
              <button
                onClick={() => setAutoCycleOled(!autoCycleOled)}
                style={{
                  flex: 1,
                  padding: '5px',
                  borderRadius: '6px',
                  border: '1px solid #0284c7',
                  backgroundColor: autoCycleOled ? '#0284c7' : 'transparent',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                OLED: {autoCycleOled ? 'Auto Loop' : `Page ${oledPage + 1}`}
              </button>
            </div>
          </div>

          {/* Circuit Grid Stage */}
          <div
            style={{
              position: 'relative',
              width: '880px',
              height: '760px',
              margin: '0 auto',
              backgroundColor: '#070d19',
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              border: '1px solid #1e293b',
              borderRadius: '12px'
            }}
          >
            {/* SVG Wire Layer */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <defs>
                <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" />
                </filter>
              </defs>

              {wires.map((wire) => {
                const [x1, y1] = wire.from;
                const [x2, y2] = wire.to;
                // Generate a natural curved wire path
                const midX = (x1 + x2) / 2 + (y2 > y1 ? 25 : -25);
                const midY = (y1 + y2) / 2 + (x2 > x1 ? -25 : 25);
                const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

                const isHovered = hoveredNet === wire.id;
                return (
                  <g key={wire.id}>
                    {/* Shadow for depth */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.6)"
                      strokeWidth={wire.strokeWidth ? wire.strokeWidth + 2 : 5}
                    />
                    {/* Main wire */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isHovered ? '#38bdf8' : wire.color}
                      strokeWidth={wire.strokeWidth || 3}
                      strokeLinecap="round"
                      filter={isHovered ? 'url(#wire-glow)' : 'none'}
                    />
                    {/* Solder junction pins */}
                    <circle cx={x1} cy={y1} r={3} fill={wire.color} stroke="#ffffff" strokeWidth={1} />
                    <circle cx={x2} cy={y2} r={3} fill={wire.color} stroke="#ffffff" strokeWidth={1} />
                  </g>
                );
              })}
            </svg>

            {/* PART 1: SSD1306 128x64 OLED Screen (Top, left: 140, top: 30) */}
            <div
              style={{
                position: 'absolute',
                left: '120px',
                top: '25px',
                zIndex: 20,
                width: '180px',
                backgroundColor: '#020617',
                border: '3px solid #334155',
                borderRadius: '8px',
                padding: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', fontFamily: 'monospace', marginBottom: '4px' }}>
                <span>SSD1306 0x3C</span>
                <span style={{ color: '#38bdf8' }}>P{oledPage + 1}/4</span>
              </div>

              {/* Realistic OLED Display Glow Surface */}
              <div
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #1e293b',
                  borderRadius: '4px',
                  padding: '8px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#38bdf8',
                  minHeight: '80px',
                  boxShadow: 'inset 0 0 10px rgba(56, 189, 248, 0.15)',
                  lineHeight: 1.5
                }}
              >
                {oledPage === 0 && (
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>FreshVault Twin</div>
                    <div>Room: {roomEffective.toFixed(1)} C</div>
                    <div>Food: {productEffective.toFixed(1)} C</div>
                    <div>Hum:  {state.humidity.toFixed(0)} %</div>
                    <div>Door: {state.doorOpen ? 'OPEN' : 'CLOSED'}</div>
                  </div>
                )}
                {oledPage === 1 && (
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>Solar & Power</div>
                    <div>Power:   {state.solarPower.toFixed(0)} W</div>
                    <div>Battery: {state.batteryPercent.toFixed(1)} %</div>
                    <div>Cooling: {isCooling ? 'ON' : 'OFF'}</div>
                    <div>Health:  {state.refrigeratorHealth === 'failed' ? 'FAULT' : 'OK'}</div>
                  </div>
                )}
                {oledPage === 2 && (
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>Batch TOM-101</div>
                    <div>Stock:   42.5 kg</div>
                    <div>Quality: {batchQuality.toFixed(1)} /100</div>
                    <div>Life:    {batchLife.toFixed(1)} days</div>
                  </div>
                )}
                {oledPage === 3 && (
                  <div>
                    <div style={{ color: isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#4ade80', fontWeight: 800 }}>
                      STATUS: {state.overallRisk.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#cbd5e1', marginTop: '4px' }}>
                      {oledRecommendation}
                    </div>
                  </div>
                )}
              </div>

              {/* Header Pins on OLED */}
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '6px', fontSize: '8px', color: '#64748b', fontFamily: 'monospace' }}>
                <span>DATA</span>
                <span>CLK</span>
                <span>3V3</span>
                <span>GND</span>
              </div>
            </div>

            {/* PART 2: ESP32-DevKit-v1 Microcontroller (Center, left: 140, top: 180) */}
            <div
              style={{
                position: 'absolute',
                left: '120px',
                top: '180px',
                zIndex: 20,
                width: '180px',
                height: '240px',
                backgroundColor: '#111827',
                border: '3px solid #1e293b',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* ESP32 Header / Wi-Fi Metal Shield */}
              <div
                style={{
                  backgroundColor: '#cbd5e1',
                  borderRadius: '4px',
                  padding: '8px 6px',
                  color: '#0f172a',
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                }}
              >
                ESP32-WROOM-32
                <div style={{ fontSize: '9px', fontWeight: 500, color: '#475569' }}>2.4GHz Wi-Fi + BLE IoT Node</div>
              </div>

              {/* ESP32 Status LED & USB */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>PWR</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>TX/RX</span>
                </div>
              </div>

              {/* Labeled Pinout Legend on Board */}
              <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div>3V3 • GPIO 15</div>
                  <div>GND • GPIO 4</div>
                  <div>D18 • GPIO 19</div>
                  <div>D21 • GPIO 32</div>
                  <div>D22 • GPIO 33</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>D25 (SAFE)</div>
                  <div>D26 (WARN)</div>
                  <div>D27 (CRIT)</div>
                  <div>D23 (COOL)</div>
                  <div>VIN (5V)</div>
                </div>
              </div>

              {/* Micro-USB Port */}
              <div
                style={{
                  width: '40px',
                  height: '14px',
                  backgroundColor: '#475569',
                  borderRadius: '2px',
                  margin: '0 auto',
                  textAlign: 'center',
                  fontSize: '8px',
                  color: '#e2e8f0',
                  lineHeight: '14px'
                }}
              >
                USB
              </div>
            </div>

            {/* PART 3: DHT22 Temperature & Humidity Sensor (Right Top, left: 440, top: 80) */}
            <div
              style={{
                position: 'absolute',
                left: '430px',
                top: '70px',
                zIndex: 20,
                width: '130px',
                backgroundColor: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px',
                color: '#0f172a',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>DHT22 Sensor</div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>Cold Room Air Ambient</div>

              {/* Ventilated Grille Pattern */}
              <div
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  margin: '6px 0',
                  padding: '4px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '2px'
                }}
              >
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{ height: 4, backgroundColor: '#94a3b8', borderRadius: 1 }} />
                ))}
              </div>

              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                {roomEffective.toFixed(1)}°C
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0284c7' }}>
                {state.humidity.toFixed(0)}% RH
              </div>
              <div style={{ fontSize: '8px', color: '#64748b', marginTop: '4px' }}>Pins: VCC • SDA • GND</div>
            </div>

            {/* PART 4: DS18B20 1-Wire Food Core Pulp Sensor (Right Middle, left: 430, top: 240) */}
            <div
              style={{
                position: 'absolute',
                left: '430px',
                top: '230px',
                zIndex: 20,
                width: '140px',
                backgroundColor: '#1e293b',
                border: '2px solid #334155',
                borderRadius: '8px',
                padding: '8px',
                color: '#ffffff',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>DS18B20 Probe</div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>Core Fruit Pulp Sensor</div>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '4px',
                  padding: '6px',
                  margin: '6px 0',
                  border: '1px solid #334155'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>
                  {productEffective.toFixed(1)}°C
                </div>
                <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>1-Wire Bus (GPIO 4)</div>
              </div>

              <div style={{ fontSize: '8px', color: '#64748b' }}>Pullup 4.7kΩ Connected</div>
            </div>

            {/* PART 5: 4 Hardware Status LEDs (Middle, left: 80, top: 450) */}
            <div
              style={{
                position: 'absolute',
                left: '60px',
                top: '440px',
                zIndex: 20,
                display: 'flex',
                gap: '1.25rem',
                backgroundColor: '#111827',
                border: '2px solid #1e293b',
                borderRadius: '10px',
                padding: '10px 16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
              }}
            >
              {/* LED 1: SAFE (Green) */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    margin: '0 auto',
                    backgroundColor: isSafe ? '#22c55e' : '#14532d',
                    boxShadow: isSafe ? '0 0 16px #22c55e, inset 0 0 4px #ffffff' : 'none',
                    border: '2px solid #16a34a',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div style={{ fontSize: '10px', fontWeight: 800, color: isSafe ? '#4ade80' : '#64748b', marginTop: '4px' }}>
                  SAFE
                </div>
                <div style={{ fontSize: '8px', color: '#475569' }}>D25</div>
              </div>

              {/* LED 2: WARNING (Yellow) */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    margin: '0 auto',
                    backgroundColor: isWarning ? '#eab308' : '#713f12',
                    boxShadow: isWarning ? '0 0 16px #eab308, inset 0 0 4px #ffffff' : 'none',
                    border: '2px solid #ca8a04',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div style={{ fontSize: '10px', fontWeight: 800, color: isWarning ? '#fde047' : '#64748b', marginTop: '4px' }}>
                  WARN
                </div>
                <div style={{ fontSize: '8px', color: '#475569' }}>D26</div>
              </div>

              {/* LED 3: CRITICAL (Red) */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    margin: '0 auto',
                    backgroundColor: isCritical ? '#ef4444' : '#7f1d1d',
                    boxShadow: isCritical ? '0 0 20px #ef4444, inset 0 0 4px #ffffff' : 'none',
                    border: '2px solid #dc2626',
                    animation: isCritical ? 'pulse 0.6s infinite alternate' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div style={{ fontSize: '10px', fontWeight: 800, color: isCritical ? '#f87171' : '#64748b', marginTop: '4px' }}>
                  CRIT
                </div>
                <div style={{ fontSize: '8px', color: '#475569' }}>D27</div>
              </div>

              {/* LED 4: COOLING ON (Blue) */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    margin: '0 auto',
                    backgroundColor: isCooling ? '#3b82f6' : '#1e3a8a',
                    boxShadow: isCooling ? '0 0 16px #3b82f6, inset 0 0 4px #ffffff' : 'none',
                    border: '2px solid #2563eb',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div style={{ fontSize: '10px', fontWeight: 800, color: isCooling ? '#60a5fa' : '#64748b', marginTop: '4px' }}>
                  CHILL
                </div>
                <div style={{ fontSize: '8px', color: '#475569' }}>D23</div>
              </div>
            </div>

            {/* PART 6: Piezo Buzzer (Right Middle, left: 450, top: 410) */}
            <div
              style={{
                position: 'absolute',
                left: '450px',
                top: '410px',
                zIndex: 20,
                width: '75px',
                height: '75px',
                borderRadius: '50%',
                backgroundColor: '#111827',
                border: `3px solid ${isCritical ? '#dc2626' : '#334155'}`,
                boxShadow: isCritical ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCritical ? '#ef4444' : '#64748b',
                fontSize: '9px',
                fontWeight: 800
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#000000', marginBottom: '2px' }} />
              BUZZER
              <span style={{ fontSize: '8px', color: '#475569' }}>GPIO 18</span>
            </div>

            {/* PART 7: 3 Physical Tactile Pushbuttons (Bottom, left: 60, top: 560) */}
            <div
              style={{
                position: 'absolute',
                left: '60px',
                top: '550px',
                zIndex: 20,
                display: 'flex',
                gap: '1.5rem',
                backgroundColor: '#111827',
                border: '2px solid #1e293b',
                borderRadius: '12px',
                padding: '14px 20px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
              }}
            >
              {/* Pushbutton 1: Door Switch (Pin 19) */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleButtonPress('door')}
                  title="Click to toggle magnetic door reed switch"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: state.doorOpen ? '#ea580c' : '#334155',
                    border: '4px solid #1e293b',
                    boxShadow: state.doorOpen ? '0 0 12px #ea580c' : '0 4px 6px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <DoorOpen size={20} />
                </button>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>Door Switch</div>
                <div style={{ fontSize: '9px', color: state.doorOpen ? '#fb923c' : '#94a3b8' }}>
                  {state.doorOpen ? 'OPEN' : 'CLOSED'} (D19)
                </div>
              </div>

              {/* Pushbutton 2: Compressor Fault Switch (Pin 32) */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleButtonPress('fault')}
                  title="Click to simulate compressor thermal overload trip"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: state.refrigeratorHealth === 'failed' ? '#dc2626' : '#334155',
                    border: '4px solid #1e293b',
                    boxShadow: state.refrigeratorHealth === 'failed' ? '0 0 12px #dc2626' : '0 4px 6px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Zap size={20} />
                </button>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>Cooling Fault</div>
                <div style={{ fontSize: '9px', color: state.refrigeratorHealth === 'failed' ? '#f87171' : '#94a3b8' }}>
                  {state.refrigeratorHealth === 'failed' ? 'TRIPPED' : 'NORMAL'} (D32)
                </div>
              </div>

              {/* Pushbutton 3: Solar Drop Switch (Pin 33) */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleButtonPress('solar')}
                  title="Click to simulate cloud cover / night solar drop"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: state.solarPower < 100 ? '#ca8a04' : '#334155',
                    border: '4px solid #1e293b',
                    boxShadow: state.solarPower < 100 ? '0 0 12px #ca8a04' : '0 4px 6px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sun size={20} />
                </button>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>Solar Drop</div>
                <div style={{ fontSize: '9px', color: state.solarPower < 100 ? '#fde047' : '#94a3b8' }}>
                  {state.solarPower < 100 ? 'SHADED' : '340W SUN'} (D33)
                </div>
              </div>
            </div>

            {/* PART 8: 220Ω Current Limiting Resistors Indicator */}
            <div
              style={{
                position: 'absolute',
                left: '420px',
                top: '550px',
                zIndex: 20,
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '11px',
                color: '#94a3b8'
              }}
            >
              <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                5x Resistors Circuit Protection
              </div>
              <div>• 4x 220Ω (LED Cathodes to GND)</div>
              <div>• 1x 4.7kΩ (DS18B20 1-Wire Pullup)</div>
            </div>
          </div>
        </div>
      )}

      {/* Serial Telemetry Live Terminal Tab */}
      {activeTab === 'terminal' && (
        <div style={{ padding: '1.25rem', backgroundColor: '#090d16' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
              SERIAL CONSOLE @ 115200 BAUD (WOKWI FIRMWARE TELEMETRY STREAM)
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Auto-sync: POST /api/wokwi/telemetry (Every 2,000ms)
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#030712',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#4ade80',
              lineHeight: 1.6,
              maxHeight: '380px',
              overflowY: 'auto'
            }}
          >
            <div>[00:00:01.042] [BOOT] ESP32 DevKit V1 Initialized (CPU: 240MHz, RAM: 520KB)</div>
            <div>[00:00:01.115] [I2C] SSD1306 OLED Display Detected at Address 0x3C (128x64 px)</div>
            <div>[00:00:01.189] [1-WIRE] DS18B20 Temperature Probe Attached on GPIO 4</div>
            <div>[00:00:01.240] [DHT22] Precision Room Sensor Attached on GPIO 15</div>
            <div>[00:00:01.300] [OUTPUTS] LEDs Configured: SAFE(25), WARN(26), CRIT(27), COOL(23)</div>
            <div>[00:00:01.350] [INPUTS] Pushbuttons Configured with Internal Pullups: D19, D32, D33</div>
            <div style={{ color: '#38bdf8' }}>--------------------------------------------------------------------------------</div>
            <div style={{ color: '#ffffff' }}>
              {JSON.stringify(
                {
                  timestampMillis: Date.now(),
                  roomTemperatureRaw: 6.0,
                  roomTemperatureEffective: roomEffective,
                  humidity: state.humidity,
                  productTemperatureRaw: 6.1,
                  productTemperatureEffective: productEffective,
                  solarWatts: state.solarPower,
                  batteryPercent: state.batteryPercent,
                  solarDrop: state.solarPower < 100,
                  doorOpen: state.doorOpen,
                  refrigerationFault: state.refrigeratorHealth === 'failed',
                  coolingOn: isCooling,
                  refrigerationHealth: state.refrigeratorHealth === 'failed' ? 'FAULT' : 'HEALTHY',
                  risk: state.overallRisk.toUpperCase(),
                  batchId: 'TOM-101',
                  crop: 'Tomato',
                  quantityKg: 42.5,
                  qualityScore: batchQuality,
                  shelfLifeDays: batchLife,
                  recommendation: oledRecommendation
                },
                null,
                2
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pinout Table Tab */}
      {activeTab === 'schematic' && (
        <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px' }}>Component</th>
                <th style={{ padding: '8px 12px' }}>ESP32 GPIO Pin</th>
                <th style={{ padding: '8px 12px' }}>Signal Function</th>
                <th style={{ padding: '8px 12px' }}>Wire Color</th>
                <th style={{ padding: '8px 12px' }}>Operating State</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>DHT22 Sensor</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 15</td>
                <td style={{ padding: '8px 12px' }}>Cold Room Air Temp & Humidity</td>
                <td style={{ padding: '8px 12px', color: '#22c55e' }}>Green (SDA)</td>
                <td style={{ padding: '8px 12px' }}>{roomEffective}°C / {state.humidity}% RH</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>DS18B20 1-Wire Probe</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 4</td>
                <td style={{ padding: '8px 12px' }}>Internal Tomato Core Pulp Temp</td>
                <td style={{ padding: '8px 12px', color: '#22c55e' }}>Green (DQ + 4.7kΩ)</td>
                <td style={{ padding: '8px 12px' }}>{productEffective}°C</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>SSD1306 OLED (128x64)</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 21 (SDA) / 22 (SCL)</td>
                <td style={{ padding: '8px 12px' }}>I2C Local Diagnostics Screen (0x3C)</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>Blue</td>
                <td style={{ padding: '8px 12px' }}>Page {oledPage + 1}/4 Active</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>SAFE Indicator LED</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 25</td>
                <td style={{ padding: '8px 12px' }}>Nominal storage parameters active</td>
                <td style={{ padding: '8px 12px', color: '#22c55e' }}>Green (+ 220Ω)</td>
                <td style={{ padding: '8px 12px', color: isSafe ? '#4ade80' : '#94a3b8' }}>{isSafe ? 'ON' : 'OFF'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>WARNING Indicator LED</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 26</td>
                <td style={{ padding: '8px 12px' }}>Thermal drift / door open / low solar</td>
                <td style={{ padding: '8px 12px', color: '#eab308' }}>Yellow (+ 220Ω)</td>
                <td style={{ padding: '8px 12px', color: isWarning ? '#fde047' : '#94a3b8' }}>{isWarning ? 'ON' : 'OFF'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>CRITICAL Alarm LED</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 27</td>
                <td style={{ padding: '8px 12px' }}>Compressor failure / high excursion (&gt;12°C)</td>
                <td style={{ padding: '8px 12px', color: '#ef4444' }}>Red (+ 220Ω)</td>
                <td style={{ padding: '8px 12px', color: isCritical ? '#f87171' : '#94a3b8' }}>{isCritical ? 'FLASHING' : 'OFF'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>Cooling Relay Active LED</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 23</td>
                <td style={{ padding: '8px 12px' }}>Refrigeration compressor energized</td>
                <td style={{ padding: '8px 12px', color: '#3b82f6' }}>Blue (+ 220Ω)</td>
                <td style={{ padding: '8px 12px', color: isCooling ? '#60a5fa' : '#94a3b8' }}>{isCooling ? 'ON' : 'OFF'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>Piezo Alert Buzzer</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 18</td>
                <td style={{ padding: '8px 12px' }}>Audible high-risk warning sound</td>
                <td style={{ padding: '8px 12px', color: '#a855f7' }}>Purple</td>
                <td style={{ padding: '8px 12px' }}>{isCritical ? 'AUDIBLE PULSE' : 'SILENT'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>Door Magnetic Switch</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 19</td>
                <td style={{ padding: '8px 12px' }}>Chamber access door ingress detection</td>
                <td style={{ padding: '8px 12px', color: '#f97316' }}>Orange</td>
                <td style={{ padding: '8px 12px' }}>{state.doorOpen ? 'DOOR OPEN' : 'DOOR CLOSED'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>Compressor Fault Trigger</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 32</td>
                <td style={{ padding: '8px 12px' }}>Thermal overload circuit relay trip</td>
                <td style={{ padding: '8px 12px', color: '#f97316' }}>Orange</td>
                <td style={{ padding: '8px 12px' }}>{state.refrigeratorHealth === 'failed' ? 'FAULT ACTIVE' : 'NOMINAL'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', fontWeight: 700 }}>Solar Irradiance Drop</td>
                <td style={{ padding: '8px 12px', color: '#38bdf8' }}>GPIO 33</td>
                <td style={{ padding: '8px 12px' }}>Simulate cloud cover / night solar collapse</td>
                <td style={{ padding: '8px 12px', color: '#f97316' }}>Orange</td>
                <td style={{ padding: '8px 12px' }}>{state.solarPower < 100 ? 'CLOUD (28W)' : '340W SUN'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info Bar */}
      <div
        style={{
          padding: '0.65rem 1.25rem',
          backgroundColor: '#0b1120',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          <span>Circuit Synced with FreshVault Digital Twin Engine</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>WOKWI Diagram v1</span>
          <a
            href="https://wokwi.com/projects/new/esp32"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0284c7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}
          >
            Open in Wokwi.com <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
