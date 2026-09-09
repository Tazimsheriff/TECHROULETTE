import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Sun,
  FileSpreadsheet
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { state } = useTwin();

  const energyData = [
    { time: '06:00', solarWatts: 20, compressorWatts: 0, batteryPct: 62 },
    { time: '08:00', solarWatts: 140, compressorWatts: 180, batteryPct: 60 },
    { time: '10:00', solarWatts: 310, compressorWatts: 220, batteryPct: 71 },
    { time: '12:00', solarWatts: 420, compressorWatts: 230, batteryPct: 86 },
    { time: '14:00', solarWatts: state.solarPower, compressorWatts: state.coolingOn ? 220 : 15, batteryPct: state.batteryPercent },
    { time: '16:00', solarWatts: 210, compressorWatts: 200, batteryPct: 76 },
    { time: '18:00', solarWatts: 35, compressorWatts: 190, batteryPct: 70 },
  ];

  const batchComparisonData = state.batches.map((b) => ({
    id: b.id,
    qualityScore: b.qualityScore,
    shelfLifeDays: b.shelfLifeDays,
    weightKg: b.quantityKg
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            Scientific Telemetry & Thermodynamic Analytics
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ARRHENIUS RESPIRATION ACCELERATION & SOLAR MICROGRID POWER EQUILIBRIUM
          </p>
        </div>

        <button className="btn btn-sm">
          <FileSpreadsheet size={11} /> Export Telemetry CSV
        </button>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {/* Chart 1: Energy balance */}
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Sun size={13} color="#c2410c" />
              Solar PV Influx vs. Compressor Load Draw (Watts)
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0.5rem' }}>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Area
                    type="monotone"
                    dataKey="solarWatts"
                    name="Solar PV (W)"
                    stroke="#c2410c"
                    fill="#ffedd5"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="compressorWatts"
                    name="Chiller Draw (W)"
                    stroke="#0369a1"
                    fill="#e0f2fe"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              MICROGRID EQUILIBRIUM: SOLAR SURPLUS POWERS ACTIVE CHILLING AND RECHARGES LiFePO4 BUFFER.
            </div>
          </div>
        </div>

        {/* Chart 2: Inventory Quality Comparison */}
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={13} color="#15803d" />
              Produce Quality Score vs. Remaining Shelf Life
            </div>
          </div>
          <div className="panel-body" style={{ padding: '0.5rem' }}>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchComparisonData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />
                  <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="qualityScore" name="Quality Score (0-100)" fill="#166534" radius={[1, 1, 0, 0]} />
                  <Bar dataKey="shelfLifeDays" name="Shelf Life (Days)" fill="#0369a1" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              FEFO TRIAGE THRESHOLD: BATCHES SCORING &lt;45 ENTER EMERGENCY LIQUIDATION PROTOCOL.
            </div>
          </div>
        </div>
      </div>

      {/* Kinetic formulation block */}
      <div className="panel" style={{ marginBottom: 0 }}>
        <div className="panel-header">
          <div className="panel-title">
            Mathematical Formulation: Arrhenius Biological Senescence Kinetics
          </div>
        </div>
        <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)' }}>Metabolic Respiration Acceleration:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              For climacteric tomatoes (Solanum lycopersicum), metabolic respiration doubles for every 10°C temperature excursion ($Q_{10} \approx 2.4$). When cold vault temperature exceeds 10°C, pectin esterase and polygalacturonase degrade pericarp cell walls, halving market shelf life within 36 hours.
            </p>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '1.25rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Dynamic Early-Warning Decision Boundary:</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              FreshVault Twin does not claim IoT sensors confirm microscopic bacterial pathogens. Rather, it serves as an early-warning decision support system to prioritize sorting, rapid refrigeration, and First-Expired, First-Out (FEFO) logistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
