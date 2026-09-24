import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';

export default function AdminNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  adminName,
  handleLogout,
  onSelectProfile
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onSelectProfile) onSelectProfile();
  };

  const handleSignOutClick = () => {
    setIsOpen(false);
    if (handleLogout) handleLogout();
  };

  const initial = adminName ? adminName.charAt(0).toUpperCase() : 'A';

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
        <div className="admin-user-menu-container" ref={menuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="admin-user-avatar-btn"
            onClick={toggleDropdown}
            aria-expanded={isOpen}
            title="Account Profile Menu"
            style={{
              background: isOpen ? '#f1f5f9' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: 'none'
            }}
            onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#f8fafc'; }}
            onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.2rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
              border: '2.5px solid #ffffff'
            }}>
              {initial}
            </div>
          </button>

          {isOpen && (
            <div
              className="admin-profile-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                background: '#ffffff',
                borderRadius: '18px',
                boxShadow: '0 12px 35px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                padding: '0.65rem',
                minWidth: '200px',
                zIndex: 9999,
                animation: 'dropdownFadeIn 0.15s ease-out forwards'
              }}
            >
              {/* Caret Arrow Triangle Top */}
              <div style={{
                position: 'absolute',
                top: '-7px',
                right: '22px',
                width: '12px',
                height: '12px',
                background: '#ffffff',
                borderLeft: '1px solid #e2e8f0',
                borderTop: '1px solid #e2e8f0',
                transform: 'rotate(45deg)',
                boxSizing: 'border-box'
              }} />

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={handleProfileClick}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.94rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FiUser size={18} style={{ color: '#64748b' }} />
                <span>My Profile</span>
              </button>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '0.4rem 0' }} />

              <button
                type="button"
                className="dropdown-menu-item logout-item"
                onClick={handleSignOutClick}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.94rem',
                  fontWeight: '700',
                  color: '#dc2626',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FiLogOut size={18} style={{ color: '#ef4444' }} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
