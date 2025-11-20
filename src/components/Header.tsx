'use client';

export default function Header() {
  return (
    <header 
      className="sticky top-0 z-40 border-b"
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Only */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold gradient-text">
              TinyLink
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}