'use client';

import { useState, useEffect } from 'react';
import { Link as LinkType } from '@/types';
import { Copy, BarChart2, Trash2, Link, X, RefreshCw } from 'lucide-react';

interface LinksTableProps {
  links: LinkType[];
  onDelete: (code: string) => void;
  onViewStats: (code: string) => void;
  onRefresh: () => void;
}

export default function LinksTable({ links, onDelete, onViewStats, onRefresh }: LinksTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkType | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // ✅ NEW: Track refresh state

  // Auto-refresh when new link is created
  useEffect(() => {
    const handleLinkCreated = () => {
      console.log('🔔 Link created event received, refreshing table...');
      onRefresh();
    };

    window.addEventListener('linkCreated', handleLinkCreated);
    
    return () => {
      window.removeEventListener('linkCreated', handleLinkCreated);
    };
  }, [onRefresh]);

  //  NEW: Manual refresh handler with animation
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCopy = (code: string) => {
    const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleViewStats = (link: LinkType) => {
    setSelectedLink(link);
    setStatsModalOpen(true);
  };

  //  Toggle Active/Inactive (soft delete)
  const handleToggleStatus = async (code: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/links/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        await onRefresh();
        alert(`Link ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const data = await res.json();
        alert('Failed to update status: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error toggling status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  // Soft delete
  const handleSoftDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to deactivate /${code}?`)) {
      return;
    }

    try {
      await onDelete(code);
      await onRefresh();
    } catch (error: any) {
      console.error('Error deactivating link:', error);
    }
  };

  //  Permanent remove
  const handlePermanentRemove = async (code: string) => {
    if (!confirm(`⚠️ PERMANENTLY DELETE /${code}?\n\nThis will erase all data and cannot be undone!`)) {
      return;
    }

    try {
      const res = await fetch(`/api/links/${code}/permanent`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await onRefresh();
        alert('Link permanently deleted!');
      } else {
        const data = await res.json();
        alert('Failed to delete: ' + (data.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error deleting link:', error);
      alert('Error deleting link: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <section 
        className="w-full py-12"
        style={{ 
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div 
          className="w-full mx-auto px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: '75rem' }}
        >
          {/*  UPDATED: Header WITH Refresh Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Your Links
              </h2>
              <p 
                style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}
              >
                {links.length} {links.length === 1 ? 'link' : 'links'}
              </p>
            </div>

            {/*  NEW: Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-light)',
                borderRadius: '0.5rem',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isRefreshing ? 0.6 : 1
              }}
              title="Refresh links"
            >
              <RefreshCw 
                size={16} 
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                }}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* Empty State OR Table */}
          {links.length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center"
              style={{ 
                padding: '4rem 2rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '1rem',
                textAlign: 'center'
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: 'rgba(37, 99, 235, 0.1)'
                }}
              >
                <Link 
                  size={32} 
                  style={{ color: '#2563EB' }} 
                />
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                No links yet
              </h3>
              <p 
                style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}
              >
                Create your first short link above to get started
              </p>
            </div>
          ) : (
            <div 
              style={{ 
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)',
                borderRadius: '1rem',
                overflow: 'hidden'
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table 
                  style={{ 
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}
                >
                  <thead>
                    <tr 
                      style={{ 
                        backgroundColor: 'var(--bg-tertiary)',
                        borderBottom: '1px solid var(--border-light)'
                      }}
                    >
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Short Link
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Original Link
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Clicks
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Last Clicked
                      </th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr 
                        key={link.code}
                        style={{ borderBottom: '1px solid var(--border-light)' }}
                      >
                        {/* Short Link */}
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <button
                            onClick={() => handleCopy(link.code)}
                            className="flex items-center gap-2"
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#2563EB',
                              backgroundColor: 'rgba(37, 99, 235, 0.05)',
                              border: '1px solid rgba(37, 99, 235, 0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Copy size={14} />
                            <span>/{link.code}</span>
                          </button>
                          {copiedCode === link.code && (
                            <span 
                              style={{ 
                                fontSize: '0.75rem',
                                color: '#10b981',
                                marginTop: '0.25rem',
                                display: 'block'
                              }}
                            >
                              Copied!
                            </span>
                          )}
                        </td>

                        {/* Original Link */}
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-secondary)',
                              textDecoration: 'none',
                              maxWidth: '20rem',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {link.url}
                          </a>
                        </td>

                        {/* Clicks */}
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                          <span 
                            style={{ 
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)'
                            }}
                          >
                            {link.clicks || 0}
                          </span>
                        </td>

                        {/* Status - Clickable to toggle */}
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleStatus(link.code, link.isActive)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: link.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: link.isActive ? '#10b981' : '#dc2626',
                              border: `1px solid ${link.isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title="Click to toggle status"
                          >
                            {link.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Last Clicked */}
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span 
                            style={{ 
                              fontSize: '0.875rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {formatDateTime(link.lastClickedAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <div className="flex items-center justify-center gap-2">
                            {/* Stats Button */}
                                                        <button
                              onClick={() => handleViewStats(link)}
                              className="flex items-center gap-1.5"
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '0.375rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-light)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                              title="View Stats"
                            >
                              <BarChart2 size={14} />
                              <span>Stats</span>
                            </button>

                            {/* Delete Button (Soft Delete for Active, Permanent Delete for Inactive) */}
                            {link.isActive ? (
                              <button
                                onClick={() => handleSoftDelete(link.code)}
                                style={{
                                  padding: '0.5rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: 'transparent',
                                  border: '1px solid var(--border-light)',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                title="Deactivate Link"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePermanentRemove(link.code)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  backgroundColor: '#dc2626',
                                  border: 'none',
                                  color: 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                                title="Permanently Delete"
                              >
                                <X size={14} />
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Modal */}
      {statsModalOpen && selectedLink && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999
          }}
          onClick={() => setStatsModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              maxWidth: '32rem',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>
                  Link Statistics
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  /{selectedLink.code}
                </p>
              </div>
              <button
                onClick={() => setStatsModalOpen(false)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Total Clicks */}
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#eff6ff', 
                  borderRadius: '0.5rem',
                  border: '1px solid #dbeafe'
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600, marginBottom: '0.5rem' }}>
                    TOTAL CLICKS
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1e3a8a' }}>
                    {selectedLink.clicks || 0}
                  </p>
                </div>

                {/* Status */}
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: selectedLink.isActive ? '#f0fdf4' : '#fef2f2', 
                  borderRadius: '0.5rem',
                  border: `1px solid ${selectedLink.isActive ? '#bbf7d0' : '#fecaca'}`
                }}>
                  <p style={{ fontSize: '0.75rem', color: selectedLink.isActive ? '#15803d' : '#b91c1c', fontWeight: 600, marginBottom: '0.5rem' }}>
                    STATUS
                  </p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 700, color: selectedLink.isActive ? '#10b981' : '#dc2626' }}>
                    {selectedLink.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {/* Link Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Original URL
                </p>
                <a
                  href={selectedLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    color: '#3b82f6',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {selectedLink.url}
                </a>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Created Date
                </p>
                <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                  {formatDate(selectedLink.createdAt)}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Last Clicked
                </p>
                <p style={{ fontSize: '0.875rem', color: '#1f2937' }}>
                  {formatDateTime(selectedLink.lastClickedAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleCopy(selectedLink.code)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Copy size={16} />
                  Copy Link
                </button>
                <button
                  onClick={() => setStatsModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD: CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
