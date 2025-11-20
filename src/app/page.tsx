'use client';

import { useState, useEffect, useCallback } from 'react';
import Hero from '@/components/Hero';
import LinksTable from '@/components/LinksTable';
import { Link } from '@/types';

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch('/api/links', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleDelete = async (code: string) => {
    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (res.ok) {
        fetchLinks();
      } else {
        const data = await res.json();
        alert('Failed to delete: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleViewStats = (code: string) => {
    console.log('📊 View stats:', code);
  };

  return (
    <>
      <Hero />
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Loading links...
          </p>
        </div>
      ) : (
        <LinksTable
          links={links}
          onDelete={handleDelete}
          onViewStats={handleViewStats}
          onRefresh={fetchLinks}
        />
      )}
    </>
  );
}
