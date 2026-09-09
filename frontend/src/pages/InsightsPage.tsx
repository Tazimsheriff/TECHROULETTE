import React from 'react';
import { useTwin } from '../context/TwinContext';
import {
  LineChart,
  Line,
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
  Activity,
  Sun,
  Battery,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { state } = useTwin();

  // Energy balance telemetry dataset
  const energyData = [
    { time: '06:00', solarWatts: 20, compressorWatts: 0, batteryPct: 62 },
    { time: '08:00', solarWatts: 140, compressorWatts: 180, batteryPct: 60 },
    { time: '10:00', solarWatts: 310, compressorWatts: 220, batteryPct: 71 },
    { time: '12:00', solarWatts: 420, compressorWatts: 230, batteryPct: 86 },
    { time: '14:00', solarWatts: state.solarPower, compressorWatts: state.coolingOn ? 220 : 15, batteryPct: state.batteryPercent },
    { time: '16:00', solarWatts: 210, compressorWatts: 200, batteryPct: 76 },
    { time: '18:00', solarWatts: 35, compressorWatts: 190, batteryPct: 70 },
  ];

  // Batch quality comparison data
  const batchComparisonData = state.batches.map((b) => ({
    id: b.id,
    qualityScore: b.qualityScore,
    shelfLifeDays: b.shelfLifeDays,
    weightKg: b.quantityKg
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Quality, Shelf-Life & Thermodynamic Analytics
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Empirical postharvest biological decay kinetics and solar microgrid energy equilibrium
          </p>
        </div>

        <button className="btn btn-sm">
          <FileSpreadsheet size={13} /> Export Telemetry (CSV)
        </button>
      </div>

      {/* Primary Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Chart 1: Solar Power vs Compressor Draw */}
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <Sun size={15} color="#d97706" />
              Solar Generation vs. Compressor Duty Draw (Watts)
            </div>
          </div>
          <div className="panel-body">
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area
                    type="monotone"
                    dataKey="solarWatts"
                    name="Solar PV (W)"
                    stroke="#d97706"
                    fill="#fef3c7"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="compressorWatts"
                    name="Chiller Draw (W)"
                    stroke="#0284c7"
                    fill="#e0f2fe"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Microgrid net equilibrium: Solar surplus charges battery buffer during peak daylight hours.
            </div>
          </div>
        </div>

        {/* Chart 2: Inventory Quality Comparison */}
        <div className="panel" style={{ marginBottom: 0 }}>
          <div className="panel-header">
            <div className="panel-title">
              <TrendingUp size={15} color="#166534" />
              Produce Freshness Index vs. Remaining Shelf Life
            </div>
          </div>
          <div className="panel-body">
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="id" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="qualityScore" name="Quality Score (0-100)" fill="#166534" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="shelfLifeDays" name="Shelf Life (Days)" fill="#0284c7" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Batches scoring &lt; 45 require immediate triage to prevent complete loss before liquidation.
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Validation Note */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={15} color="#0f172a" />
            Biological Decay & Mathematical Kinetics Formulation
          </div>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                Arrhenius Respiration Acceleration:
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Fresh produce continues aerobic respiration after harvest. For tomatoes, the metabolic rate doubles for every 10°C temperature excursion ($Q_{10} \approx 2.4$). When cold-storage temperature rises from 6°C to 16°C, senescence speed jumps 240%, depleting soluble sugars and accelerating fungal mycelium germination.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.45rem' }}>
                Operational Decision Boundary:
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Rather than claiming sensors confirm chemical or microbiological pathogens, FreshVault Twin provides an early-warning risk triage engine. This gives cooperatives clear First-Expired, First-Out (FEFO) logistics priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
