import React, { useState } from 'react';
import {
  Globe,
  Download,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Battery,
  Sun,
  ShieldCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';

interface AdaptationProfile {
  country: string;
  flag: string;
  commodity: string;
  targetTemp: string;
  targetHumidity: string;
  shelfLifeGain: string;
  localChallenge: string;
  twinArchitecture: string;
  faoBenchmark: string;
}

export const KnowledgeHubPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const profiles: AdaptationProfile[] = [
    {
      country: 'India',
      flag: '🇮🇳',
      commodity: 'Tomatoes & Capsicum (Solanaceae)',
      targetTemp: '6.0°C - 8.5°C',
      targetHumidity: '82% - 88% RH',
      shelfLifeGain: '+5 to 9 Days Extra Shelf Life',
      localChallenge: 'Hilly North-Eastern agro-corridors lack 3-phase grid power. Transit roads experience frequent monsoon landslides, delaying delivery to markets.',
      twinArchitecture: 'Solar PV rooftop (450W) with 2.4kWh LiFePO4 battery pack and dual ESP32 nodes communicating via local Wi-Fi and LoRa.',
      faoBenchmark: 'Complies with Codex Alimentarius CAC/RCP 47-2001 for hygienic transport and pre-cooling of perishable horticultural produce.'
    },
    {
      country: 'Kenya',
      flag: '🇰🇪',
      commodity: 'Export French Beans & Snow Peas',
      targetTemp: '4.0°C - 6.0°C',
      targetHumidity: '90% - 95% RH',
      shelfLifeGain: '+6 to 8 Days Extra Shelf Life',
      localChallenge: 'Smallholders in the Rift Valley face rejection at airport cold terminals due to unmonitored farm-to-packhouse temperature breaks in transit.',
      twinArchitecture: 'Mobile solar cool-boxes equipped with BLE beacons logging temperature directly into the regional cooperative export ledger.',
      faoBenchmark: 'Complies with UNECE Standard FFV-06 concerning marketing and commercial quality control of fresh beans.'
    },
    {
      country: 'Bangladesh',
      flag: '🇧🇩',
      commodity: 'Fresh Bovine Milk & Dairy Cans',
      targetTemp: '3.0°C - 4.5°C',
      targetHumidity: 'Liquid Immersion Chilling',
      shelfLifeGain: '+18 to 24 Hours Raw Stability',
      localChallenge: 'High ambient humidity and tropical heat cause unpasteurized morning milk to sour within 3 hours during riverboat transit to collection dairies.',
      twinArchitecture: 'Immersion solar chiller with DS18B20 digital stainless-steel probe and automated SMS alerts for boat operators.',
      faoBenchmark: 'Complies with FAO/WHO Milk and Milk Products Codex Code of Hygienic Practice (CAC/RCP 57-2004).'
    },
    {
      country: 'Indonesia',
      flag: '🇮🇩',
      commodity: 'Artisanal Tuna & Coastal Reef Fish',
      targetTemp: '0.0°C - 2.0°C (Ice Slurry)',
      targetHumidity: '95% - 98% RH',
      shelfLifeGain: '+4 to 6 Days Prime Freshness',
      localChallenge: 'Island archipelagos lack land-based ice plants; artisanal fishermen suffer up to 40% harvest loss from rapid histamine formation in unchilled fish.',
      twinArchitecture: 'Solar saltwater slurry ice-maker digital twin with battery state predictor and GPS voyage tracking.',
      faoBenchmark: 'Complies with FAO Code of Practice for Fish and Fishery Products (CXC 52-2003).'
    }
  ];

  const faqs = [
    {
      question: 'What is the optimal temperature for storing fresh tomatoes?',
      answer: 'The ideal temperature range for mature green and ripe tomatoes is between 8.0°C and 12.0°C (with chilling limit not below 4.0°C). Storing them too cold (below 4°C) causes irreversible "chilling injury"—loss of aroma, mealiness, and surface pitting. Storing them above 12°C accelerates ethylene respiration, cutting shelf life by more than half.'
    },
    {
      question: 'Why does leaving the cold room door open ruin produce so fast?',
      answer: 'When the door is left open, dense cold air instantly rushes out and hot ambient air enters. This immediately triggers moisture condensation on tomato skins, creating the perfect damp breeding ground for fungal spores (Botrytis cinerea). Simultaneously, tomato respiration jumps by 240% (Q10 = 2.4 Arrhenius rate), shaving days off shelf life within an hour.'
    },
    {
      question: 'How does the solar cold room stay cold overnight without sunshine?',
      answer: 'The system uses a two-stage thermal and electrical energy buffer: during peak daylight hours, rooftop solar panels charge a 2.4 kWh LiFePO4 battery pack and run the compressor at full capacity to sub-cool the insulated thermal mass. At night, the battery takes over at a steady eco-throttle (620 RPM) to maintain constant temperature until sunrise.'
    },
    {
      question: 'What does the "Freshness Score" percentage mean?',
      answer: 'Unlike static calendar expiration dates, our biological twin uses continuous temperature sensor readings to calculate biological degradation: 100% to 75% = Premium Grade (Full retail market price); 74% to 45% = Good Commercial Quality (Fast-track to local markets); Below 45% = Triage State (Divert immediately to tomato puree, sauce making, or drying to avoid total loss).'
    },
    {
      question: 'How does a farmer or buyer use the QR Product Passport?',
      answer: 'Every crate is tagged with a unique digital passport ID (like TOM-101). Anyone with a smartphone camera can scan the crate QR code to see: harvest date, farmer cooperative origin, continuous cold-chain compliance history, and verified remaining shelf life days—building trust and fetching higher market prices.'
    },
    {
      question: 'What should the operator do immediately if a cooling fault occurs?',
      answer: 'Follow SOP-02: 1) Keep the vault doors tightly sealed to preserve thermal mass; 2) Check the PV inverter and circuit breakers; 3) Check the Command Center tab for lots marked "CRITICAL"; 4) Dispatch crates with less than 2 days of remaining shelf life to market or processing first (FEFO dispatch).'
    }
  ];

  const currentProfile = profiles.find((p) => p.country === selectedCountry) || profiles[0];

  const handleDownloadBlueprint = () => {
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
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
              <Globe size={16} color="#2563eb" />
              <span>UN-FAO SOUTH-SOUTH & TRIANGULAR COOPERATION (SSTC) PROTOCOL</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>
              FAO Knowledge Hub & Cold-Chain Best Practices
            </h1>

            <p style={{ fontSize: '16px', color: '#475569', maxWidth: '880px', lineHeight: 1.6, margin: 0 }}>
              Practical blueprints, regional commodity standards, standard operating procedures (SOPs), and frequently asked questions for solar-powered decentralized food cold storage.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleDownloadBlueprint}
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
            <Download size={18} />
            {pdfDownloaded ? '✓ Blueprint Downloaded' : 'Export Full Blueprint PDF'}
          </button>
        </div>
      </section>

      {/* Regional Commodity Blueprints Selector */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            Regional Commodity Profiles (Select Global South Corridor)
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            Choose a region to view specific postharvest temperature targets, local supply chain challenges, and proven shelf-life extension:
          </p>
        </div>

        {/* Country Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          {profiles.map((p) => {
            const isSelected = selectedCountry === p.country;
            return (
              <button
                key={p.country}
                onClick={() => setSelectedCountry(p.country)}
                style={{
                  padding: '0.75rem 1.4rem',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                  backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                  color: isSelected ? '#0284c7' : '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 3px 10px rgba(2, 132, 199, 0.12)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{p.flag}</span>
                <span>{p.country}</span>
                <span style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>
                  ({p.commodity.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Commodity Detail Card */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '14px',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{currentProfile.flag}</span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {currentProfile.commodity}
                </h3>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  Target Node: {currentProfile.country} Agricultural Corridor
                </span>
              </div>
            </div>

            {/* Target Numbers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0 1.5rem' }}>
              <div style={{
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #bae6fd',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Thermometer size={24} color="#0284c7" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Target Storage Temp</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>
                    {currentProfile.targetTemp}
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={24} color="#059669" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>Target Humidity</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669' }}>
                    {currentProfile.targetHumidity}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                  <AlertTriangle size={16} color="#d97706" />
                  Local Supply Chain Challenge
                </div>
                <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {currentProfile.localChallenge}
                </p>
              </div>

              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                  <Sun size={16} color="#0284c7" />
                  Decentralized Digital Twin Solution
                </div>
                <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {currentProfile.twinArchitecture}
                </p>
              </div>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '2px solid #bbf7d0',
            padding: '2rem',
            boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '4px 10px',
                backgroundColor: '#f0fdf4',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#15803d',
                marginBottom: '1rem'
              }}>
                <CheckCircle2 size={16} color="#16a34a" />
                VERIFIED POSTHARVEST BENEFIT
              </div>

              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#15803d', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                {currentProfile.shelfLifeGain}
              </div>

              <div style={{ fontSize: '14px', color: '#166534', fontWeight: 600, marginBottom: '1.5rem' }}>
                Compared to unmonitored ambient farm storage
              </div>

              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.65, margin: 0 }}>
                Maintaining this precise temperature prevents cellular respiration spikes, keeping produce crisp, firm, and market-ready for up to an additional week.
              </p>
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '2px solid #f1f5f9',
              fontSize: '13px',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#0f172a' }}>FAO CODEX BENCHMARK:</strong>
              <div>{currentProfile.faoBenchmark}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section - Layman Friendly */}
      <section style={{
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2.25rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #bfdbfe'
          }}>
            <HelpCircle size={22} color="#2563eb" />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Frequently Asked Questions (Cold Storage FAQ)
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: '2px 0 0' }}>
              Common questions answered in plain, non-technical language for farmers, operators, and co-op managers:
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  border: `2px solid ${isOpen ? '#93c5fd' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '1rem'
                  }}
                >
                  <span style={{ fontSize: '16.5px', fontWeight: 700, color: isOpen ? '#1d4ed8' : '#0f172a' }}>
                    {faq.question}
                  </span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isOpen ? '#dbeafe' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isOpen ? <ChevronUp size={18} color="#1d4ed8" /> : <ChevronDown size={18} color="#64748b" />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem',
                    fontSize: '15px',
                    color: '#334155',
                    lineHeight: 1.7,
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '1rem'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Standard Operating Procedures (SOPs) - Colorful, Prominent, Clear */}
      <section>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Standard Operating Procedures (Field Guidelines)
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: '4px 0 0' }}>
            Daily rules for operators to ensure maximum produce lifespan and energy efficiency:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* SOP 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '2px solid #a7f3d0',
            padding: '1.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#059669" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '20px' }}>
                SOP-01 • HARVEST
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Rapid Pre-Cooling Protocol
            </h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Harvest tomatoes during the cool early morning (before 8:00 AM). Transfer crates into the cold room within <strong>90 minutes</strong> to strip away residual field heat. Never stack hot fresh crates directly touching pre-cooled crates.
            </p>
          </div>

          {/* SOP 2 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '2px solid #fde68a',
            padding: '1.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={22} color="#d97706" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', backgroundColor: '#fffbeb', padding: '4px 10px', borderRadius: '20px' }}>
                SOP-02 • EMERGENCY
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Cold-Breach Emergency Response
            </h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              If chamber temperature stays above <strong>12.0°C for more than 45 minutes</strong>, immediately halt incoming shipments. Check the Command Center for lots with less than 2 days shelf life and prioritize them for emergency market dispatch.
            </p>
          </div>

          {/* SOP 3 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '2px solid #bae6fd',
            padding: '1.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={22} color="#0284c7" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7', backgroundColor: '#f0f9ff', padding: '4px 10px', borderRadius: '20px' }}>
                SOP-03 • MAINTENANCE
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Solar & Battery Preservation
            </h3>
            <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              Wipe dust and agricultural pollen off rooftop solar panels weekly. Ensure the battery bank maintains at least <strong>25% charge</strong> before twilight to guarantee uninterrupted overnight cooling without generator backup.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

