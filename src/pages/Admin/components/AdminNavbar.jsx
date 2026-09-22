import React, { useState } from 'react';
import { FiX, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';

export default function AdminNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  adminName,
  isUserMenuOpen: controlledOpen,
  handleUserMenuEnter,
  handleUserMenuLeave,
  handleLogout,
  onSelectProfile
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMenuOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const onEnter = () => {
    if (handleUserMenuEnter) handleUserMenuEnter();
    else setInternalOpen(true);
  };

  const onLeave = () => {
    if (handleUserMenuLeave) handleUserMenuLeave();
    else setInternalOpen(false);
  };

  const handleProfileClick = () => {
    setInternalOpen(false);
    if (onSelectProfile) onSelectProfile();
  };

  return (
    <header className="admin-top-navbar">
      <div className="admin-top-navbar-left">
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      <div className="admin-top-navbar-right">
        <div className="admin-user-menu" onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ position: 'relative' }}>
          <div
            className="admin-user-trigger"
            onClick={() => setInternalOpen(prev => !prev)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.15rem',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)',
              border: '2px solid #ffffff'
            }}>
              {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>

          <div
            className={`admin-user-dropdown ${isMenuOpen ? 'open' : ''}`}
            style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              background: '#ffffff',
              borderRadius: '14px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e2e8f0',
              padding: '0.5rem',
              minWidth: '170px',
              zIndex: 999,
              display: isMenuOpen ? 'block' : 'none'
            }}
          >
            <button
              type="button"
              onClick={handleProfileClick}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <FiUser size={16} style={{ color: '#475569' }} />
              My Profile
            </button>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '0.35rem 0' }} />

            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                border: 'none',
                background: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem',
                fontWeight: '700',
                color: '#dc2626',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <FiLogOut size={16} style={{ color: '#ef4444' }} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
