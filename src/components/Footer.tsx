'use client';

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#1e293b',
        color: '#e2e8f0',
        padding: '1.25rem 1rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '75rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            margin: 0,
            marginBottom: '0.375rem',
            color: '#f8fafc',
            letterSpacing: '0.01em'
          }}
        >
          © 2025 <span style={{ color: '#fbbf24', fontWeight: 700 }}>TinyLink</span>. Built For Assignment.
        </p>
        <p
          style={{
            fontSize: '0.8125rem',
            margin: 0,
            color: '#94a3b8',
            fontWeight: 500
          }}
        >
          Made with 💛 using Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
