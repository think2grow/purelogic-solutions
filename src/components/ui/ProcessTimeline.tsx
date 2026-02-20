import { useState } from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Discovery Call & Site Visit',
    short: 'Free Consultation',
    description: 'We start with a 30-minute conversation to understand your vision, timeline, and goals. Then we come to you — measuring, photographing, and truly understanding your project before a single number is quoted.',
    detail: 'No obligation. No pressure. Just an honest conversation.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Detailed Estimate & Proposal',
    short: 'Written Estimate',
    description: "Within 5–7 business days, you receive a fully itemized, written estimate. Every line item is explained. No vague costs. No hidden fees. Just complete clarity on what you're investing and exactly what you're getting.",
    detail: 'Delivered within 5–7 business days of site visit.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Design & Material Selection',
    short: 'Design Phase',
    description: 'We guide you through every selection — cabinetry, countertops, tile, fixtures, finishes — and document every decision in writing. Nothing is left to interpretation or memory. Every choice is locked in before we build.',
    detail: 'Every selection documented. Nothing left to guesswork.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Contract, Permits & Scheduling',
    short: 'Pre-Construction',
    description: 'We handle all permits, order materials, and schedule every trade. Your project start date is locked in before we ask for a single dollar. You know exactly when work begins before you sign anything.',
    detail: 'We pull all permits. Your start date is locked before payment.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Construction & Communication',
    short: 'Build Phase',
    description: 'Work begins. You receive regular updates via your preferred method — text, email, or phone. Daily cleanup. Proactive problem-solving. If something unexpected comes up, you hear about it immediately — not after the fact.',
    detail: 'Daily cleanup. Regular updates. Zero surprises.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'Final Walkthrough & Warranty',
    short: 'Completion',
    description: "We walk through every inch of the finished project together. Every punch-list item is resolved before we call it done. You receive full warranty documentation. We don't consider a job finished until you are completely satisfied.",
    detail: 'Full warranty documentation. Every punch-list item resolved.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <style>{`
        .process-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .process-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        .process-detail-panel {
          padding: 1.25rem;
          min-height: 280px;
        }
        @media (min-width: 480px) {
          .process-detail-panel {
            padding: 2rem;
            min-height: 320px;
          }
        }
        .process-step-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          text-align: left;
          transition: all 0.25s ease;
          width: 100%;
          cursor: pointer;
          min-height: 56px;
        }
        @media (min-width: 480px) {
          .process-step-btn {
            gap: 1rem;
            padding: 1rem 1.25rem;
          }
        }
      `}</style>

      <div className="process-grid">
        {/* Step selector — left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className="process-step-btn"
              style={{
                border: `1px solid ${activeStep === i ? 'rgba(60,225,225,0.4)' : 'rgba(255,255,255,0.06)'}`,
                background: activeStep === i
                  ? 'rgba(60,225,225,0.08)'
                  : 'rgba(255,255,255,0.03)',
              }}
            >
              {/* Step number circle */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `2px solid ${activeStep === i ? 'var(--color-cyan)' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: activeStep === i ? 'rgba(60,225,225,0.15)' : 'transparent',
                transition: 'all 0.25s ease',
              }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  color: activeStep === i ? 'var(--color-cyan)' : 'rgba(255,255,255,0.4)',
                }}>
                  {step.number}
                </span>
              </div>

              {/* Labels */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: activeStep === i ? 'var(--color-cyan)' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '0.1rem',
                }}>
                  {step.short}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: activeStep === i ? 'white' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-heading)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {step.title}
                </div>
              </div>

              {/* Active indicator */}
              {activeStep === i && (
                <div style={{ flexShrink: 0 }}>
                  <svg style={{ width: '14px', height: '14px', color: 'var(--color-cyan)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Detail panel — right column */}
        <div
          className="process-detail-panel"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(60,225,225,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(60,225,225,0.12)',
              border: '1px solid rgba(60,225,225,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-cyan)',
              flexShrink: 0,
            }}>
              {STEPS[activeStep].icon}
            </div>
            <div>
              <div style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-cyan)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '0.15rem',
              }}>
                Step {STEPS[activeStep].number}
              </div>
              <h3 style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)',
                fontWeight: 800,
                color: 'white',
                margin: 0,
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.3,
              }}>
                {STEPS[activeStep].title}
              </h3>
            </div>
          </div>

          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            lineHeight: 1.7,
            marginBottom: '1.25rem',
          }}>
            {STEPS[activeStep].description}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(60,225,225,0.08)',
            borderRadius: '6px',
            border: '1px solid rgba(60,225,225,0.15)',
          }}>
            <svg style={{ width: '14px', height: '14px', color: 'var(--color-cyan)', flexShrink: 0, marginTop: '1px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
              {STEPS[activeStep].detail}
            </span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem' }}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  width: i === activeStep ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === activeStep ? 'var(--color-cyan)' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                  minHeight: 'unset',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
