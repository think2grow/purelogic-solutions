import { useState, useRef } from 'react';

const WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/0D3c4ZHt2RrTnSl27Qgl/webhook-trigger/3672958f-cf62-465f-b5e9-d78885b3f6f7';

type FormState = 'idle' | 'submitting' | 'error';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

function validate(data: FormData): FieldError {
  const errors: FieldError = {};
  if (!data.firstName.trim()) errors.firstName = 'First name is required.';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\d\s\-\(\)\+]{7,}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!data.notes.trim()) {
    errors.notes = 'Please describe your project so we can prepare for your call.';
  } else if (data.notes.trim().length < 20) {
    errors.notes = 'Please provide a bit more detail (at least 20 characters).';
  }
  return errors;
}

// Light input on dark background — white fill, dark navy text
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.875rem 1rem',
  border: `1.5px solid ${hasError ? '#e53e3e' : '#d1d5db'}`,
  borderRadius: '6px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: '#0D1B2A',           // dark navy text
  background: '#ffffff',      // white fill
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.80)',   // white label on dark bg
  marginBottom: '0.4rem',
};

const errorStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: '#fc8181',
  marginTop: '0.35rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
};

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FieldError] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FieldError] }));
    // restore border on blur
    const hasError = !!newErrors[name as keyof FieldError];
    e.target.style.borderColor = hasError ? '#e53e3e' : '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#3CE1E1';
    e.target.style.boxShadow = '0 0 0 3px rgba(60,225,225,0.20)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, phone: true, notes: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setFormState('submitting');
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          notes: formData.notes.trim(),
        }),
      });
      window.location.href = '/thank-you';
    } catch {
      setFormState('error');
    }
  };

  const isSubmitting = formState === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(60,225,225,0.20)',
        borderRadius: '12px',
        padding: 'clamp(1.25rem, 5vw, 2.5rem)',
      }}
    >
      {/* Section header inside form */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.35rem', color: '#ffffff', marginBottom: '0.35rem' }}>
          Tell Us About Your Project
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
          All fields are required. We respond within 24 hours.
        </p>
      </div>

      {/* Name row — 1 col on mobile, 2 col on wider screens */}
      <style>{`.name-row { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 1.25rem; } @media (min-width: 480px) { .name-row { grid-template-columns: 1fr 1fr; } }`}</style>
      <div className="name-row">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" style={labelStyle}>
            First Name <span style={{ color: '#3CE1E1' }}>*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={inputStyle(!!errors.firstName)}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <p style={errorStyle}><ErrorIcon />{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" style={labelStyle}>
            Last Name <span style={{ color: '#3CE1E1' }}>*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Smith"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            style={inputStyle(!!errors.lastName)}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <p style={errorStyle}><ErrorIcon />{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="email" style={labelStyle}>
          Email Address <span style={{ color: '#3CE1E1' }}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={inputStyle(!!errors.email)}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p style={errorStyle}><ErrorIcon />{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="phone" style={labelStyle}>
          Phone Number <span style={{ color: '#3CE1E1' }}>*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(801) 555-0100"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={inputStyle(!!errors.phone)}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p style={errorStyle}><ErrorIcon />{errors.phone}</p>
        )}
      </div>

      {/* Project Description */}
      <div style={{ marginBottom: '1.75rem' }}>
        <label htmlFor="notes" style={labelStyle}>
          Describe Your Project <span style={{ color: '#3CE1E1' }}>*</span>
        </label>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5rem' }}>
          Tell us what you have in mind — the more detail, the better we can prepare for your call.
        </p>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder="e.g. We want to remodel our kitchen — new cabinets, quartz countertops, and open up the wall to the living room. Budget around $40k, looking to start this spring..."
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{
            ...inputStyle(!!errors.notes),
            resize: 'vertical',
            minHeight: '130px',
            lineHeight: '1.6',
          }}
          disabled={isSubmitting}
        />
        {errors.notes && (
          <p style={errorStyle}><ErrorIcon />{errors.notes}</p>
        )}
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.30)', textAlign: 'right', marginTop: '0.3rem' }}>
          {formData.notes.length} characters
        </p>
      </div>

      {/* Error banner */}
      {formState === 'error' && (
        <div style={{
          background: 'rgba(229,62,62,0.12)',
          border: '1px solid rgba(229,62,62,0.4)',
          borderRadius: '6px',
          padding: '0.875rem 1rem',
          marginBottom: '1.25rem',
          color: '#fc8181',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Something went wrong. Please call us at{' '}
          <a href="tel:+18019058175" style={{ color: '#3CE1E1', fontWeight: 600 }}>(801) 905-8175</a>
          {' '}or email{' '}
          <a href="mailto:Purelogicsolutionsutah@gmail.com" style={{ color: '#3CE1E1', fontWeight: 600 }}>Purelogicsolutionsutah@gmail.com</a>.
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          padding: '1rem 2rem',
          background: isSubmitting ? 'rgba(60,225,225,0.5)' : '#3CE1E1',
          color: '#0D1B2A',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '0.9rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          border: 'none',
          borderRadius: '6px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(60,225,225,0.30)',
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = '#ffffff';
            btn.style.boxShadow = '0 8px 32px rgba(60,225,225,0.40)';
            btn.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = '#3CE1E1';
            btn.style.boxShadow = '0 4px 20px rgba(60,225,225,0.30)';
            btn.style.transform = 'translateY(0)';
          }
        }}
      >
        {isSubmitting ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ animation: 'spin 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Sending Your Request...
          </>
        ) : (
          <>
            Send My Free Estimate Request
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      {/* Privacy note */}
      <p style={{
        textAlign: 'center',
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.35)',
        marginTop: '1rem',
        lineHeight: 1.5,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your information is private and will never be sold. We respond within 24 hours.{' '}
        By submitting you agree to our{' '}
        <a href="/privacy-policy" style={{ color: 'rgba(60,225,225,0.65)', textDecoration: 'underline' }}>
          Privacy Policy
        </a>.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        #firstName::placeholder, #lastName::placeholder,
        #email::placeholder, #phone::placeholder, #notes::placeholder {
          color: #9ca3af;
        }
        #firstName, #lastName, #email, #phone, #notes {
          color: #0D1B2A !important;
        }
        #firstName:-webkit-autofill,
        #lastName:-webkit-autofill,
        #email:-webkit-autofill,
        #phone:-webkit-autofill {
          -webkit-text-fill-color: #0D1B2A !important;
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
        }
      `}</style>
    </form>
  );
}
