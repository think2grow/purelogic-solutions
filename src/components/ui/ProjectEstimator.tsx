import { useState, useEffect } from 'react';

type ProjectType = 'kitchen' | 'bathroom' | 'basement' | 'addition' | 'custom' | 'whole-home';

interface ProjectConfig {
  label: string;
  icon: string;
  min: number;
  max: number;
  tiers: { label: string; range: string; description: string }[];
  roiNote: string;
}

const PROJECTS: Record<ProjectType, ProjectConfig> = {
  kitchen: {
    label: 'Kitchen Remodel',
    icon: '🍳',
    min: 15000,
    max: 150000,
    tiers: [
      { label: 'Refresh', range: '$15K–$35K', description: 'New countertops, backsplash, fixtures & hardware. Same layout.' },
      { label: 'Mid-Range', range: '$35K–$80K', description: 'New cabinetry, quartz countertops, appliances, updated lighting.' },
      { label: 'Premium', range: '$80K–$150K+', description: 'Full custom cabinetry, layout changes, high-end appliances, structural work.' },
    ],
    roiNote: '60–80% ROI at resale',
  },
  bathroom: {
    label: 'Bathroom Remodel',
    icon: '🚿',
    min: 8000,
    max: 80000,
    tiers: [
      { label: 'Refresh', range: '$8K–$20K', description: 'New vanity, fixtures, toilet, paint & accessories.' },
      { label: 'Mid-Range', range: '$20K–$45K', description: 'Full tile work, walk-in shower, new tub, vanity & lighting.' },
      { label: 'Spa Suite', range: '$45K–$80K+', description: 'Custom tile, heated floors, steam shower, soaking tub, custom cabinetry.' },
    ],
    roiNote: '70–80% ROI at resale',
  },
  basement: {
    label: 'Basement Finishing',
    icon: '🏠',
    min: 20000,
    max: 100000,
    tiers: [
      { label: 'Basic Finish', range: '$20K–$40K', description: 'Framing, drywall, flooring, lighting & basic bathroom.' },
      { label: 'Living Space', range: '$40K–$70K', description: 'Full living area, bedroom, bathroom, kitchenette & egress windows.' },
      { label: 'Premium Suite', range: '$70K–$100K+', description: 'Home theater, wet bar, gym, full apartment suite or ADU.' },
    ],
    roiNote: '70–75% ROI — adds livable sq ft',
  },
  addition: {
    label: 'Home Addition',
    icon: '📐',
    min: 50000,
    max: 250000,
    tiers: [
      { label: 'Room Addition', range: '$50K–$100K', description: 'Single room addition — bedroom, office or sunroom.' },
      { label: 'Suite Addition', range: '$100K–$175K', description: 'Master suite, in-law suite or garage addition.' },
      { label: 'Major Addition', range: '$175K–$250K+', description: 'Second story, full wing or large multi-room addition.' },
    ],
    roiNote: '50–65% ROI — major space gains',
  },
  custom: {
    label: 'Custom Home Build',
    icon: '🏗️',
    min: 300000,
    max: 1200000,
    tiers: [
      { label: 'Production-Style', range: '$300K–$500K', description: 'Semi-custom home with standard finishes and efficient floor plans.' },
      { label: 'Semi-Custom', range: '$500K–$800K', description: 'Custom floor plan, elevated finishes, premium fixtures throughout.' },
      { label: 'Fully Custom', range: '$800K–$1.2M+', description: 'Architect-designed, fully custom materials, smart home systems.' },
    ],
    roiNote: 'Built to your exact vision',
  },
  'whole-home': {
    label: 'Whole Home Remodel',
    icon: '🔨',
    min: 75000,
    max: 400000,
    tiers: [
      { label: 'Cosmetic Update', range: '$75K–$150K', description: 'Flooring, paint, fixtures, trim & surface-level updates throughout.' },
      { label: 'Full Remodel', range: '$150K–$250K', description: 'Kitchen, bathrooms, flooring, layout changes & systems updates.' },
      { label: 'Gut Renovation', range: '$250K–$400K+', description: 'Complete gut renovation — new everything from studs out.' },
    ],
    roiNote: 'Transforms your home entirely',
  },
};

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function getTierIndex(value: number, min: number, max: number): number {
  const pct = (value - min) / (max - min);
  if (pct < 0.33) return 0;
  if (pct < 0.67) return 1;
  return 2;
}

export default function ProjectEstimator() {
  const [projectType, setProjectType] = useState<ProjectType>('kitchen');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const config = PROJECTS[projectType];

  // Set default slider to mid-point when project type changes
  useEffect(() => {
    const mid = Math.round((config.min + config.max) / 2);
    setSliderValue(mid);
    setAnimatedValue(mid);
  }, [projectType]);

  // Animate the displayed number
  useEffect(() => {
    if (!hasInteracted) return;
    const start = animatedValue;
    const end = sliderValue;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [sliderValue]);

  const tierIndex = getTierIndex(sliderValue, config.min, config.max);
  const tier = config.tiers[tierIndex];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    setSliderValue(Number(e.target.value));
  };

  const handleProjectChange = (type: ProjectType) => {
    setProjectType(type);
    setHasInteracted(false);
  };

  const sliderPercent = ((sliderValue - config.min) / (config.max - config.min)) * 100;

  return (
    <div className="estimator-widget" style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid var(--color-warm-gray)',
      overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(13,27,42,0.10)',
    }}>
      {/* Header */}
        <div style={{
          background: 'var(--color-navy)',
          padding: '1.25rem 1.25rem',
          borderBottom: '2px solid var(--color-cyan)',
        }} className="estimator-header">
          <style>{`@media (min-width: 480px) { .estimator-header { padding: 1.5rem 2rem !important; } }`}</style>
        <div style={{ color: 'var(--color-cyan)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
          Interactive Tool
        </div>
        <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
          Project Investment Estimator
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
          Get a ballpark range for your project — no strings attached.
        </p>
      </div>

      <div style={{ padding: '1.25rem 1.25rem' }} className="estimator-body">
        <style>{`@media (min-width: 480px) { .estimator-body { padding: 1.75rem 2rem !important; } }`}</style>
        {/* Project Type Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-navy)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            1. Select Your Project
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }} className="estimator-project-grid">
            <style>{`@media (min-width: 480px) { .estimator-project-grid { grid-template-columns: repeat(3, 1fr) !important; } }`}</style>
            {(Object.entries(PROJECTS) as [ProjectType, ProjectConfig][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleProjectChange(key)}
                style={{
                  padding: '0.6rem 0.5rem',
                  borderRadius: '6px',
                  border: `2px solid ${projectType === key ? 'var(--color-cyan)' : 'var(--color-warm-gray)'}`,
                  background: projectType === key ? 'var(--color-navy)' : 'white',
                  color: projectType === key ? 'white' : 'var(--color-body-text)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.3,
                }}
              >
                <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{val.icon}</div>
                {val.label.replace(' Remodel', '').replace(' Build', '').replace(' Finishing', '').replace(' Addition', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-navy)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
            2. Adjust Your Budget
          </label>

          {/* Animated value display */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-cyan-mid) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}>
              {formatCurrency(hasInteracted ? animatedValue : sliderValue)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-mid-gray)' }}>estimated investment</div>
          </div>

          {/* Custom styled range input */}
          <div style={{ position: 'relative', paddingBottom: '0.5rem' }}>
            <input
              type="range"
              min={config.min}
              max={config.max}
              step={Math.round((config.max - config.min) / 100)}
              value={sliderValue}
              onChange={handleSliderChange}
              className="estimator-range"
              style={{
                background: `linear-gradient(to right, var(--color-cyan) 0%, var(--color-cyan) ${sliderPercent}%, var(--color-warm-gray) ${sliderPercent}%, var(--color-warm-gray) 100%)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-mid-gray)' }}>{formatCurrency(config.min)}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-mid-gray)' }}>{formatCurrency(config.max)}+</span>
            </div>
          </div>
        </div>

        {/* Tier Result */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          border: '1px solid rgba(60,225,225,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--color-cyan)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
              {tier.label}
            </span>
            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              {tier.range}
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            {tier.description}
          </p>
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(60,225,225,0.15)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <svg style={{ width: '14px', height: '14px', color: 'var(--color-cyan)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{config.roiNote}</span>
          </div>
        </div>

        {/* Tier progress dots */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
          {config.tiers.map((t, i) => (
            <div key={i} style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: i <= tierIndex ? 'var(--color-cyan)' : 'var(--color-warm-gray)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {/* Disclaimer + CTA */}
        <p style={{ fontSize: '0.72rem', color: 'var(--color-mid-gray)', marginBottom: '1rem', lineHeight: 1.5 }}>
          These are ballpark ranges based on current Utah market conditions. Your actual cost depends on scope, materials, and site conditions. The only way to get an accurate number is a free site visit.
        </p>

        <a
          href="/contact"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.875rem',
            background: 'var(--color-cyan)',
            color: 'var(--color-navy)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderRadius: '4px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-navy)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-cyan)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-cyan)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-navy)';
          }}
        >
          Get a Precise Free Estimate
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
