'use client';

export default function Header() {
  return (
    <header
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '1rem 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '75rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo with Icon */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Link Icon */}
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 800 600" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="67" y="234" width="300" height="132" rx="66" fill="white"/>
            <rect x="433" y="234" width="300" height="132" rx="66" fill="white"/>
            <rect x="133" y="300" width="168" height="66" fill="#4f46e5"/>
            <rect x="499" y="300" width="168" height="66" fill="#4f46e5"/>
            <rect x="233" y="283" width="334" height="34" rx="17" fill="#fbbf24"/>
          </svg>

          {/* Logo Text */}
          <span
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.01em',
            }}
          >
            TinyLink
          </span>
        </a>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/healthz');
                const data = await res.json();
                alert(`Health Check:\n${JSON.stringify(data, null, 2)}`);
              } catch (error) {
                alert('Health check failed!');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fbbf24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            Health
          </button>

          <a
            href="https://github.com/raagul666?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = 'white';
            }}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
