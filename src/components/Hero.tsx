'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function Hero() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleShorten = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Validate custom code format if provided
    if (customCode && !/^[A-Za-z0-9]{3,8}$/.test(customCode)) {
      setError('Custom code must be 3-8 characters (letters and numbers only)');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          code: customCode || undefined 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(`${origin}/${data.code}`);
      setUrl('');
      setCustomCode('');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('linkCreated'));
      }, 500); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Copied to clipboard!');
  };

  return (
    <section
      style={{
        width: '100%',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '3rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '42rem', textAlign: 'center' }}>
        {/* Logo */}
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            color: '#ffffff',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          TinyLink
        </h1>

        {/* Tagline */}
        <div style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.75rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            Shorten Your <span style={{ color: '#e0e7ff' }}>Long Links :)</span>
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.95)',
              maxWidth: '32rem',
              margin: '0 auto',
            }}
          >
            TinyLink is an efficient and easy-to-use URL shortening service that streamlines
            your online experience.
          </p>
        </div>

        {/* Input Container */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* URL Input */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#f9fafb',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1rem',
                transition: 'all 0.2s',
              }}
            >
              <LinkIcon size={20} style={{ color: '#9ca3af' }} />
              <input
                type="url"
                placeholder="Enter the link here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  backgroundColor: 'transparent',
                  color: '#1f2937',
                }}
              />
            </div>
          </div>

          {/* Custom Code Input (Optional) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Custom short code (optional, 3-8 chars)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.replace(/[^A-Za-z0-9]/g, ''))}
              onKeyPress={(e) => e.key === 'Enter' && handleShorten()}
              maxLength={8}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                backgroundColor: '#f9fafb',
                outline: 'none',
                transition: 'all 0.2s',
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'left' }}>
              Leave empty for auto-generated • 3-8 chars • Letters & numbers only
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '0.875rem',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Shorten Button */}
          <button
            onClick={handleShorten}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(102, 126, 234, 0.3)',
            }}
          >
            {loading ? 'Shortening...' : 'Shorten Now!'}
          </button>

          {/* Short URL Result */}
          {shortUrl && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                backgroundColor: '#ede9fe',
                borderRadius: '0.75rem',
                border: '1px solid #c7d2fe',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#5b21b6',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                }}
              >
                Your shortened link is ready!
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #c7d2fe',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#5b21b6',
                    fontWeight: 600,
                  }}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}