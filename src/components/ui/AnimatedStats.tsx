import { useState, useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  { value: 100, suffix: '%', label: 'Licensed & Insured', sub: 'Utah License #14253923-5501' },
  { value: 6, suffix: '', label: 'Step Process', sub: 'No guesswork, ever' },
  { value: 24, suffix: 'hr', label: 'Response Time', sub: 'We pick up the phone' },
  { value: 0, suffix: '', prefix: '$', label: 'Surprise Invoices', sub: 'Itemized estimates. Always.' },
];

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(isDecimal ? Math.round(current * 10) / 10 : Math.round(current));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return count;
}

function StatItem({ stat, started, index, isLast, totalCount }: {
  stat: Stat;
  started: boolean;
  index: number;
  isLast: boolean;
  totalCount: number;
}) {
  const count = useCountUp(stat.value, 1800 + index * 200, started);
  const isDecimal = stat.value % 1 !== 0;

  // On mobile (2x2 grid): show right border on even indices (0, 2), bottom border on top row (0, 1)
  // On desktop (4x1 grid): show right border on all except last
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.25rem 0.75rem',
        position: 'relative',
      }}
    >
      {/* Glowing number */}
      <div
        style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
          fontWeight: 900,
          lineHeight: 1,
          fontFamily: 'var(--font-heading)',
          color: 'white',
          marginBottom: '0.4rem',
          letterSpacing: '-0.02em',
        }}
      >
        <span style={{ color: 'var(--color-cyan)' }}>
          {stat.prefix || ''}
          {isDecimal ? count.toFixed(1) : count}
          {stat.suffix}
        </span>
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'white',
          marginBottom: '0.2rem',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {stat.label}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.50)', lineHeight: 1.3 }}>
        {stat.sub}
      </div>
    </div>
  );
}

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  return (
    <div ref={ref}>
      {/* Mobile: 2x2 grid. Desktop: 4x1 row. Using CSS media query via a style tag */}
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .stats-grid .stat-cell {
          border-right: 1px solid rgba(60,225,225,0.15);
          border-bottom: 1px solid rgba(60,225,225,0.15);
        }
        .stats-grid .stat-cell:nth-child(2n) {
          border-right: none;
        }
        .stats-grid .stat-cell:nth-child(3),
        .stats-grid .stat-cell:nth-child(4) {
          border-bottom: none;
        }
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .stats-grid .stat-cell {
            border-right: 1px solid rgba(60,225,225,0.15);
            border-bottom: none;
          }
          .stats-grid .stat-cell:nth-child(2n) {
            border-right: 1px solid rgba(60,225,225,0.15);
          }
          .stats-grid .stat-cell:last-child {
            border-right: none;
          }
        }
      `}</style>
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div key={i} className="stat-cell">
            <StatItem
              stat={stat}
              started={started}
              index={i}
              isLast={i === STATS.length - 1}
              totalCount={STATS.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
