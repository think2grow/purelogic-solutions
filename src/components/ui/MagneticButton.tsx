import { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
}

export default function MagneticButton({ href, children, variant = 'primary', className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch/coarse pointer devices — disable magnetic effect on mobile
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isTouchDevice) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    setPos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPos({ x: 0, y: 0 });
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.875rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '0.875rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    transform: isTouchDevice ? 'none' : `translate(${pos.x}px, ${pos.y}px)`,
    transition: isHovered
      ? 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, background 0.2s ease'
      : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, background 0.2s ease',
    willChange: isTouchDevice ? 'auto' : 'transform',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '48px',
    width: '100%',
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    background: isHovered
      ? 'linear-gradient(135deg, var(--color-cyan) 0%, #5EEAEA 100%)'
      : 'var(--color-cyan)',
    color: 'var(--color-navy)',
    border: '2px solid var(--color-cyan)',
    boxShadow: isHovered
      ? '0 12px 40px rgba(60,225,225,0.5), 0 4px 16px rgba(60,225,225,0.3)'
      : '0 4px 16px rgba(60,225,225,0.2)',
  };

  const ghostStyle: React.CSSProperties = {
    ...baseStyle,
    background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.5)',
    boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
  };

  const style = variant === 'primary' ? primaryStyle : ghostStyle;

  return (
    <a
      ref={ref}
      href={href}
      style={style}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shimmer overlay on hover — desktop only */}
      {isHovered && !isTouchDevice && variant === 'primary' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 0.8s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </a>
  );
}
