import { useState, useEffect } from 'react';

const PHRASES = [
  'Like It\'s Our Own.',
  'Right The First Time.',
  'On Time, On Budget.',
  'With Zero Surprises.',
];

export default function TypewriterHero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIndex];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2400);
      return () => clearTimeout(timer);
    }

    if (!isDeleting) {
      // Typing
      if (displayed.length < current.length) {
        const timer = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 55);
        return () => clearTimeout(timer);
      } else {
        // Finished typing — pause
        setIsPaused(true);
      }
    } else {
      // Deleting
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length - 1));
        }, 30);
        return () => clearTimeout(timer);
      } else {
        // Move to next phrase
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
      }
    }
  }, [displayed, isDeleting, isPaused, phraseIndex]);

  return (
    <span
      style={{
        color: 'var(--color-cyan)',
        display: 'inline-block',
        minWidth: '2ch',
      }}
    >
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '0.85em',
          background: 'var(--color-cyan)',
          marginLeft: '2px',
          verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
          borderRadius: '1px',
        }}
      />
    </span>
  );
}
