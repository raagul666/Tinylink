'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '2rem 1rem',
        marginTop: 'auto',
        borderTop: '1px solid #34495e'
      }}
    >
      <div
        style={{
          maxWidth: '75rem',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <p style={{ fontSize: '0.875rem', margin: 0 }}>
          © {currentYear} TinyLink. Built For Assignment.
        </p>
      </div>
    </footer>
  );
}