import React, { useState } from 'react';
import { FiX, FiMenu, FiLogOut } from 'react-icons/fi';

export default function AdminNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  adminName,
  isUserMenuOpen: controlledOpen,
  handleUserMenuEnter,
  handleUserMenuLeave,
  handleLogout
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
        <div className="admin-user-menu" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <div className="admin-user-trigger" onClick={() => setInternalOpen(prev => !prev)}>
            <div className="admin-top-avatar">
              {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="admin-top-name">{adminName}</span>
          </div>
          <div className={`admin-user-dropdown ${isMenuOpen ? 'open' : ''}`}>
            <div className="admin-user-dropdown-header">
              <div className="admin-user-dropdown-avatar">
                {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="admin-user-dropdown-name">{adminName}</p>
                <p className="admin-user-dropdown-role">Administrator</p>
              </div>
            </div>
            <div className="admin-user-dropdown-divider" />
            <button className="admin-user-dropdown-btn logout" onClick={handleLogout}>
              <FiLogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
