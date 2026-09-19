import React, { useState } from 'react';
import {
  FiGrid, FiStar, FiLayers, FiUserCheck, FiClock,
  FiMessageSquare, FiCalendar, FiInbox, FiPhoneCall, FiSliders, FiLogOut,
  FiChevronDown, FiChevronUp, FiGlobe
} from 'react-icons/fi';

export default function AdminSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  empSubTab,
  setEmpSubTab,
  employeesList,
  empAttendanceList,
  empQueriesList,
  empLeavesList,
  leadsQuotes,
  leadsConsultations,
  cancelStatEdit,
  cancelTestiEdit,
  cancelProjEdit,
  cancelQuoteEdit,
  cancelEmployeeEdit,
  cancelCatEdit,
  cancelTurnoverEdit,
  handleExitAdmin
}) {
  const [isEmployeesExpanded, setIsEmployeesExpanded] = useState(true);

  const handleTabClick = (tabKey, cancelFn) => {
    setActiveTab(tabKey);
    if (cancelFn) cancelFn();
    if (cancelQuoteEdit) cancelQuoteEdit();
    if (window.innerWidth < 1024 && setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleSubTabClick = (subKey) => {
    setActiveTab('employees');
    if (setEmpSubTab) setEmpSubTab(subKey);
    if (window.innerWidth < 1024 && setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <nav className="admin-sidebar-menu">
        <div className="menu-category-label">MAIN DASHBOARD</div>

        <button
          className={`admin-sidebar-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabClick('stats', cancelStatEdit)}
        >
          <span className="btn-icon-wrapper icon-blue-wrap">
            <FiGrid size={18} className="sidebar-btn-icon icon-blue" />
          </span>
          <span className="btn-label-text">Dashboard</span>
        </button>

        <button
          className={`admin-sidebar-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => handleTabClick('testimonials', cancelTestiEdit)}
        >
          <span className="btn-icon-wrapper icon-cyan-wrap">
            <FiStar size={18} className="sidebar-btn-icon icon-cyan" />
          </span>
          <span className="btn-label-text">Testimonials</span>
        </button>

        <button
          className={`admin-sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => handleTabClick('projects', cancelProjEdit)}
        >
          <span className="btn-icon-wrapper icon-purple-wrap">
            <FiLayers size={18} className="sidebar-btn-icon icon-purple" />
          </span>
          <span className="btn-label-text">Portfolio Projects</span>
        </button>

        <div>
          <button
            className={`admin-sidebar-btn ${activeTab === 'employees' ? 'active' : ''} ${isEmployeesExpanded ? 'expanded-parent' : ''}`}
            onClick={() => {
              handleTabClick('employees', cancelEmployeeEdit);
              setIsEmployeesExpanded(prev => !prev);
            }}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="btn-icon-wrapper icon-emerald-wrap">
                <FiUserCheck size={18} className="sidebar-btn-icon icon-emerald" />
              </span>
              <span className="btn-label-text">Employees</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {(employeesList || []).length > 0 && (
                <span className="sidebar-pill-badge badge-emerald">{(employeesList || []).length}</span>
              )}
              {isEmployeesExpanded ? <FiChevronUp size={15} style={{ color: '#94a3b8' }} /> : <FiChevronDown size={15} style={{ color: '#94a3b8' }} />}
            </div>
          </button>

          {isEmployeesExpanded && (
            <div className="sidebar-submenu-container">
              {[
                { key: 'all', label: 'All Employees' },
                { key: 'attendance', label: 'Employees Attendance' },
                { key: 'leave', label: 'Leave Applications' },
                { key: 'payroll', label: 'Payroll & Slips' },
                { key: 'queries', label: 'Employee Queries' }
              ].map(subItem => (
                <button
                  key={subItem.key}
                  className={`sidebar-submenu-btn ${activeTab === 'employees' && (empSubTab || 'all') === subItem.key ? 'active' : ''}`}
                  onClick={() => handleSubTabClick(subItem.key)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>{subItem.label}</span>
                  {subItem.key === 'queries' && (empQueriesList || []).filter(q => (q.status || '').toLowerCase() === 'pending').length > 0 && (
                    <span className="sidebar-pill-badge badge-pink" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', marginLeft: 'auto' }}>
                      {(empQueriesList || []).filter(q => (q.status || '').toLowerCase() === 'pending').length}
                    </span>
                  )}
                  {subItem.key === 'leave' && (empLeavesList || []).filter(l => (l.status || '').toLowerCase() === 'pending').length > 0 && (
                    <span className="sidebar-pill-badge badge-amber" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', marginLeft: 'auto' }}>
                      {(empLeavesList || []).filter(l => (l.status || '').toLowerCase() === 'pending').length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className={`admin-sidebar-btn ${activeTab === 'quotes' ? 'active' : ''}`}
          onClick={() => handleTabClick('quotes', cancelQuoteEdit)}
        >
          <span className="btn-icon-wrapper icon-pink-wrap">
            <FiInbox size={18} className="sidebar-btn-icon icon-pink" />
          </span>
          <span className="btn-label-text">Quote Requests</span>
          {(leadsQuotes || []).length > 0 && (
            <span className="sidebar-pill-badge badge-pink">{(leadsQuotes || []).length}</span>
          )}
        </button>

        <button
          className={`admin-sidebar-btn ${activeTab === 'consultations' ? 'active' : ''}`}
          onClick={() => handleTabClick('consultations')}
        >
          <span className="btn-icon-wrapper icon-amber-wrap">
            <FiPhoneCall size={18} className="sidebar-btn-icon icon-amber" />
          </span>
          <span className="btn-label-text">Consultations</span>
          {(leadsConsultations || []).length > 0 && (
            <span className="sidebar-pill-badge badge-amber">{(leadsConsultations || []).length}</span>
          )}
        </button>

        <button
          className={`admin-sidebar-btn ${activeTab === 'clientServices' ? 'active' : ''}`}
          onClick={() => handleTabClick('clientServices')}
        >
          <span className="btn-icon-wrapper icon-emerald-wrap">
            <FiGlobe size={18} className="sidebar-btn-icon icon-emerald" />
          </span>
          <span className="btn-label-text">Client Services & Renewals</span>
        </button>

        <button
          className={`admin-sidebar-btn ${activeTab === 'quoteConfig' ? 'active' : ''}`}
          onClick={() => {
            if (cancelCatEdit) cancelCatEdit();
            if (cancelTurnoverEdit) cancelTurnoverEdit();
            handleTabClick('quoteConfig');
          }}
        >
          <span className="btn-icon-wrapper icon-slate-wrap">
            <FiSliders size={18} className="sidebar-btn-icon icon-slate" />
          </span>
          <span className="btn-label-text">Get Quote Config</span>
        </button>
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-exit-btn" onClick={() => { if (handleExitAdmin) handleExitAdmin(); if (window.innerWidth < 1024 && setIsSidebarOpen) setIsSidebarOpen(false); }}>
          <span className="btn-icon-wrapper icon-red-wrap">
            <FiLogOut size={18} className="sidebar-btn-icon icon-red" />
          </span>
          <span className="btn-label-text">Exit Admin</span>
        </button>
      </div>
    </aside>
  );
}
