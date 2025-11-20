'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Link as LinkType } from '@/types';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (!res.ok) throw new Error('Link not found');
        const data = await res.json();
        setLink(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchStats();
  }, [code]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center', maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626', marginBottom: '1rem' }}>Link Not Found</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => router.push('/')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937' }}>Link Statistics</h1>
          <button onClick={() => router.push('/')} style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Back</button>
        </div>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Short Code</label>
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '1.125rem', fontWeight: 600, color: '#667eea' }}>{link.code}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Original URL</label>
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1f2937', wordBreak: 'break-all' }}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>{link.url}</a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Total Clicks</label>
              <div style={{ padding: '0.875rem 1rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1e40af', textAlign: 'center' }}>{link.clicks}</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Status</label>
              <div style={{ padding: '0.875rem 1rem', backgroundColor: link.isActive ? '#d1fae5' : '#fee2e2', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: link.isActive ? '#065f46' : '#991b1b', textAlign: 'center' }}>{link.isActive ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Last Clicked</label>
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1f2937' }}>{link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>Created At</label>
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1f2937' }}>{new Date(link.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}