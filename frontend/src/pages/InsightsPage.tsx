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
  FileSpreadsheet,
  Zap,
  Battery,
  ShieldCheck,
  Activity,
  Info,
  Layers,
  Thermometer
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { state } = useTwin();

  const energyData = [
    { time: '06:00', solarWatts: 20, compressorWatts: 40, batteryPct: 62 },
    { time: '08:00', solarWatts: 180, compressorWatts: 190, batteryPct: 65 },
    { time: '10:00', solarWatts: 380, compressorWatts: 220, batteryPct: 78 },
    { time: '12:00', solarWatts: 460, compressorWatts: 230, batteryPct: 92 },
    { time: '14:00', solarWatts: state.solarPower, compressorWatts: state.coolingOn ? 220 : 15, batteryPct: state.batteryPercent },
    { time: '16:00', solarWatts: 240, compressorWatts: 200, batteryPct: 82 },
    { time: '18:00', solarWatts: 45, compressorWatts: 180, batteryPct: 74 },
  ];

  const batchComparisonData = state.batches.map((b) => ({
    id: b.id,
    qualityScore: b.qualityScore,
    shelfLifeDays: b.shelfLifeDays,
    weightKg: b.quantityKg,
    variety: b.variety
  }));

  const avgQuality = (state.batches.reduce((acc, b) => acc + b.qualityScore, 0) / state.batches.length).toFixed(1);
  const avgShelfLife = (state.batches.reduce((acc, b) => acc + b.shelfLifeDays, 0) / state.batches.length).toFixed(1);

  const handleExportCSV = () => {
    const headers = ["Batch ID", "Variety", "Quality Score (%)", "Shelf Life (Days)", "Weight (Kg)", "Risk State"];
    const rows = state.batches.map(b => [b.id, `"${b.variety}"`, b.qualityScore, b.shelfLifeDays, b.quantityKg, b.risk]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `freshvault_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0 3rem' }}>
      
      {/* Header Banner */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.25rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
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
              marginBottom: '1rem'
            }}>
              <Activity size={16} color="#2563eb" />
              <span>UN-FAO SSTC DIGITAL TWIN PHYSICS • ARRHENIUS POSTHARVEST ENGINE</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>
              Scientific Telemetry & Thermodynamic Analytics
            </h1>

            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '880px', lineHeight: 1.6, margin: 0 }}>
              Live thermodynamic power balance and biochemical produce decay modeling. Comparing rooftop solar energy influx against biological tomato respiration kinetics.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleExportCSV}
            style={{
              padding: '0.85rem 1.65rem',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              borderRadius: '10px'
            }}
          >
            <FileSpreadsheet size={18} />
            Export Telemetry CSV
          </button>
        </div>

        {/* Real-time Summary KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '2px solid #f1f5f9'
        }}>
          {/* Solar Rate */}
          <div style={{ padding: '1.25rem', backgroundColor: '#fffbeb', borderRadius: '12px', border: '2px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', fontSize: '14px', fontWeight: 700 }}>
              <Sun size={18} />
              Rooftop Solar Influx
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#b45309', margin: '6px 0 2px' }}>
              {state.solarPower} W
            </div>
            <div style={{ fontSize: '13px', color: '#92400e' }}>
              {state.solarPower > 200 ? '☀️ Surplus energy available' : '☁️ Low sun / Battery assisting'}
            </div>
          </div>

          {/* Chiller Load */}
          <div style={{ padding: '1.25rem', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '2px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontSize: '14px', fontWeight: 700 }}>
              <Zap size={18} />
              Chiller Power Load
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0369a1', margin: '6px 0 2px' }}>
              {state.coolingOn ? '220 W' : '15 W'}
            </div>
            <div style={{ fontSize: '13px', color: '#075985' }}>
              {state.coolingOn ? '❄️ Active Vapor Compression' : 'Idle / Eco-Standby'}
            </div>
          </div>

          {/* Battery State */}
          <div style={{ padding: '1.25rem', backgroundColor: state.batteryPercent < 25 ? '#fef2f2' : '#f0fdf4', borderRadius: '12px', border: `2px solid ${state.batteryPercent < 25 ? '#fca5a5' : '#bbf7d0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: state.batteryPercent < 25 ? '#dc2626' : '#16a34a', fontSize: '14px', fontWeight: 700 }}>
              <Battery size={18} />
              LiFePO4 Storage Buffer
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: state.batteryPercent < 25 ? '#dc2626' : '#15803d', margin: '6px 0 2px' }}>
              {state.batteryPercent}%
            </div>
            <div style={{ fontSize: '13px', color: state.batteryPercent < 25 ? '#991b1b' : '#166534' }}>
              {state.batteryPercent < 25 ? '⚠️ Low reserve buffer' : '✓ 14.5 Hours Overnight Reserve'}
            </div>
          </div>

          {/* Average Quality */}
          <div style={{ padding: '1.25rem', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '2px solid #ddd6fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7c3aed', fontSize: '14px', fontWeight: 700 }}>
              <ShieldCheck size={18} />
              Average Produce Quality
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#6d28d9', margin: '6px 0 2px' }}>
              {avgQuality}%
            </div>
            <div style={{ fontSize: '13px', color: '#5b21b6' }}>
              Avg. Shelf Life: ~{avgShelfLife} Days Left
            </div>
          </div>
        </div>
      </section>

      {/* Large Analytics Graphs Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(580px, 1fr))', gap: '2rem' }}>
        
        {/* Chart 1: Solar & Energy Microgrid Equilibrium */}
        <section style={{
          backgroundColor: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sun size={22} color="#ea580c" />
                Solar PV Generation vs. Chiller Electrical Draw
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', margin: 0 }}>
                Diurnal power equilibrium curve across the 24-hour solar cycle (Watts)
              </p>
            </div>
          </div>

          {/* Large Graph 380px Height */}
          <div style={{ height: '380px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="chillerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={13} fontWeight={600} />
                <YAxis stroke="#64748b" fontSize={13} fontWeight={600} unit=" W" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '15px', fontSize: '14px', fontWeight: 600 }}
                  iconSize={14}
                />
                <Area
                  type="monotone"
                  dataKey="solarWatts"
                  name="Solar PV Influx (Watts)"
                  stroke="#ea580c"
                  fill="url(#solarGrad)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="compressorWatts"
                  name="Chiller Compressor Draw (Watts)"
                  stroke="#0284c7"
                  fill="url(#chillerGrad)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#fff7ed',
            borderRadius: '10px',
            border: '1px solid #fed7aa',
            fontSize: '14px',
            color: '#9a3412',
            lineHeight: 1.6
          }}>
            <strong>⚡ Microgrid Energy Equilibrium:</strong> When the orange solar generation line exceeds the blue chiller line (between 09:00 and 16:00), surplus power automatically recharges the LiFePO4 battery bank to power the cooling compressor overnight.
          </div>
        </section>

        {/* Chart 2: Inventory Quality Comparison */}
        <section style={{
          backgroundColor: '#ffffff',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={22} color="#15803d" />
                Produce Quality Score vs. Remaining Shelf Life
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', margin: 0 }}>
                Comparison across monitored tomato crates for First-Expired, First-Out (FEFO) dispatch
              </p>
            </div>
          </div>

          {/* Large Graph 380px Height */}
          <div style={{ height: '380px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batchComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="id" stroke="#64748b" fontSize={13} fontWeight={700} />
                <YAxis stroke="#64748b" fontSize={13} fontWeight={600} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '15px', fontSize: '14px', fontWeight: 600 }}
                  iconSize={14}
                />
                <Bar
                  dataKey="qualityScore"
                  name="Biological Freshness Score (0-100%)"
                  fill="#15803d"
                  radius={[6, 6, 0, 0]}
                  barSize={34}
                />
                <Bar
                  dataKey="shelfLifeDays"
                  name="Remaining Shelf Life (Days)"
                  fill="#0284c7"
                  radius={[6, 6, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
            border: '1px solid #bbf7d0',
            fontSize: '14px',
            color: '#166534',
            lineHeight: 1.6
          }}>
            <strong>📦 FEFO Priority Triage:</strong> Crates with shorter green/blue bars (like TOM-106) have experienced cumulative thermal exposure and must be fast-tracked to market or processed first, leaving fresh crates (like TOM-101 and TOM-104) in cold storage.
          </div>
        </section>

      </div>

      {/* Kinetic Formulation & Mathematical Explanation Block */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.25rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 12px',
            backgroundColor: '#eff6ff',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#1d4ed8',
            marginBottom: '0.5rem'
          }}>
            BIOPHYSICAL FOUNDATION
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Mathematical Formulation: Arrhenius Biological Kinetics ($Q_{10} = 2.4$)
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            How FreshVault Twin computes biological degradation from continuous sensor telemetry:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          
          {/* Theory Card 1 */}
          <div style={{
            padding: '1.75rem',
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={20} color="#dc2626" />
              Metabolic Respiration Acceleration
            </h3>
            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              For climacteric tomatoes (<em>Solanum lycopersicum</em>), metabolic respiration rate jumps by a factor of <strong>2.4x for every 10°C temperature rise</strong>:
            </p>
            <div style={{
              margin: '1rem 0',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontFamily: 'monospace',
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f172a'
            }}>
              Rate(T) = Rate_ref × Q₁₀^((T - T_ref) / 10)
            </div>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              When vault temperature spikes above 12°C, ripening enzymes (pectin methyl esterase and polygalacturonase) accelerate rapidly, softening tissue and cutting shelf life by over 50% within 36 hours.
            </p>
          </div>

          {/* Theory Card 2 */}
          <div style={{
            padding: '1.75rem',
            backgroundColor: '#f8fafc',
            borderRadius: '14px',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="#059669" />
              Dynamic Early-Warning Decision Boundary
            </h3>
            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
              Conventional cold storage relies on fixed calendar expiry dates, which fail to account for transit temperature spikes or door openings.
            </p>
            <div style={{
              margin: '1rem 0',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              border: '1px solid #a7f3d0',
              fontSize: '14px',
              fontWeight: 700,
              color: '#065f46'
            }}>
              ✓ Cumulative Thermal Excursion Integration (Degree-Hours)
            </div>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              By integrating temperature deviations over time, FreshVault Twin gives farmers and co-ops immediate decision boundaries: whether to store, dispatch to nearby markets, or divert to tomato sauce processing before spoilage occurs.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

