import React, { useState, useEffect, useRef } from 'react';
import {
  FiUser, FiClock, FiDollarSign, FiCalendar, FiHelpCircle, FiFileText,
  FiBell, FiLogOut, FiUpload, FiCheckCircle, FiAlertCircle, FiPrinter,
  FiPlus, FiBriefcase, FiMapPin, FiMail, FiPhone, FiCheck, FiSend, FiFile,
  FiGrid, FiTrendingUp, FiCreditCard, FiMenu, FiX
} from 'react-icons/fi';
import { employeePortalApi } from '../../api/api';
import OfferLetter from '../Admin/components/OfferLetter';
import RelievingLetter from '../Admin/components/RelievingLetter';
import ExperienceLetter from '../Admin/components/ExperienceLetter';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/ToastContext';
import './EmployeeDashboard.css';

const DEFAULT_EMPLOYEE_DATA = null;

function EmployeeDashboard() {
  const toast = useToast();
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('employee_token');
    return (saved && saved !== 'undefined' && saved !== 'null') ? saved : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileSubTab, setProfileSubTab] = useState('details'); // 'details' | 'bank' | 'docs' | 'letters'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [portalModal, setPortalModal] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form states
  const [leaveForm, setLeaveForm] = useState({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  const [queryForm, setQueryForm] = useState({ subject: '', message: '' });
  const [querySubmitting, setQuerySubmitting] = useState(false);

  const [dwrForm, setDwrForm] = useState({ summary: '', hoursWorked: '8.0' });
  const [dwrSubmitting, setDwrSubmitting] = useState(false);

  // Document upload & profile bank details state
  const [photoInput, setPhotoInput] = useState('');
  const [aadharInput, setAadharInput] = useState('');
  const [panInput, setPanInput] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountNumber: '',
    ifsc: '',
    panNumber: '',
    uanNumber: '',
    taxInfo: 'New Tax Regime'
  });

  const [personalForm, setPersonalForm] = useState({
    phone: '',
    altPhone: '',
    personalEmail: '',
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyRelationship: '',
    emergencyPhone: ''
  });

  // Document Letter Modal Viewers & ID Card Controls
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRelievingModal, setShowRelievingModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [idCardSide, setIdCardSide] = useState('both'); // 'front' | 'back' | 'both'

  // Attendance filter states
  const [attYearFilter, setAttYearFilter] = useState('All');
  const [attMonthFilter, setAttMonthFilter] = useState('All');
  const [attDateFilter, setAttDateFilter] = useState('');
  const [attStatusFilter, setAttStatusFilter] = useState('All');

  const getYearOptions = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 2; y >= currentYear - 3; y--) {
      years.push(y);
    }
    return years;
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ val, label });
    }
    return options;
  };

  // Fetch employee dashboard payload
  const fetchDashboardData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await employeePortalApi.getMe();
      if (res && res.success && res.data && res.data.employee) {
        const emp = res.data.employee;
        setData(res.data);
        setPhotoInput(emp.photoUrl || '');
        setAadharInput(emp.aadharUrl || '');
        setPanInput(emp.panUrl || '');
        setBankForm({
          bankName: emp.bankName || '',
          accountNumber: emp.accountNumber || '',
          ifsc: emp.ifsc || '',
          panNumber: emp.panNumber || '',
          uanNumber: emp.uanNumber || '',
          taxInfo: emp.taxInfo || 'New Tax Regime'
        });
        setPersonalForm({
          phone: emp.phone || '',
          altPhone: emp.altPhone || '',
          personalEmail: emp.personalEmail || '',
          currentAddress: emp.currentAddress || emp.address || '',
          permanentAddress: emp.permanentAddress || emp.address || '',
          city: emp.city || 'Mumbai',
          state: emp.state || 'Maharashtra',
          pincode: emp.pincode || '',
          emergencyContactName: emp.emergencyContactName || '',
          emergencyRelationship: emp.emergencyRelationship || '',
          emergencyPhone: emp.emergencyPhone || ''
        });
      } else {
        console.warn("getMe response failed:", res);
        if (res?.status === 401 || res?.message?.includes("expired") || res?.message?.includes("Invalid") || !res?.success) {
          localStorage.removeItem('employee_token');
          localStorage.removeItem('employee_name');
          setToken(null);
          setData(null);
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      localStorage.removeItem('employee_token');
      localStorage.removeItem('employee_name');
      setToken(null);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const silentRefreshDashboard = async () => {
    if (!token) return;
    try {
      const res = await employeePortalApi.getMe();
      if (res && res.success && res.data && res.data.employee) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Silent refresh error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Live real-time background polling for Employee Portal (Queries replies, Leave status, Attendance, Salary Slips)
  useEffect(() => {
    if (!token) return;

    const pollInterval = setInterval(() => {
      silentRefreshDashboard();
    }, 5000);

    const handleFocus = () => {
      silentRefreshDashboard();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token]);

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await employeePortalApi.login(loginEmail, loginPassword);
      if (res && res.success && res.token) {
        const empName = res.employee?.name || res.data?.employee?.name || 'Employee';
        localStorage.setItem('employee_token', res.token);
        localStorage.setItem('employee_name', empName);
        setToken(res.token);
      } else {
        setLoginError(res?.message || 'Invalid employee email or password.');
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setLoginError(err?.message || 'Unable to connect to login server. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    employeePortalApi.logout();
    localStorage.removeItem('employee_token');
    localStorage.removeItem('employee_name');
    setToken(null);
    setData(null);
    setLoading(false);
  };

  // Clock In / Clock Out Handlers
  const handleClockIn = async () => {
    if (isClockedIn) {
      setPortalModal({
        isOpen: true,
        title: 'Already Clocked In Today ⏰',
        message: 'You have already clocked in for today! You can only clock in once per day.',
        type: 'info'
      });
      return;
    }
    try {
      const res = await employeePortalApi.clockIn();
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Attendance Clocked In ✅',
          message: res.message || 'Successfully clocked in! Status recorded in attendance logs.',
          type: 'success'
        });
        fetchDashboardData();
      } else {
        setPortalModal({
          isOpen: true,
          title: 'Already Clocked In Today ⏰',
          message: res?.message || 'You have already clocked in for today! You can only clock in once per day.',
          type: 'info'
        });
        fetchDashboardData();
      }
    } catch (err) {
      setPortalModal({
        isOpen: true,
        title: 'Already Clocked In Today ⏰',
        message: 'You have already clocked in for today! You can only clock in once per day.',
        type: 'info'
      });
      fetchDashboardData();
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await employeePortalApi.clockOut();
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Attendance Clocked Out ✅',
          message: res.message || 'Successfully clocked out! Have a great rest of your day.',
          type: 'success'
        });
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Clock out failed. Please try again.');
      }
    } catch (err) {
      toast.error('Clock out failed. Please try again.');
    }
  };

  // Upload & Auto-Compress Image Helper (Prevents Large Payload Connection Errors)
  const handleFileUpload = (e, setTarget) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (file.type && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.75 quality (~150kb)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          setTarget(compressedBase64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTarget(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDocuments = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setUploadingDoc(true);
    try {
      const res = await employeePortalApi.updateProfile({
        photoUrl: photoInput,
        aadharUrl: aadharInput,
        panUrl: panInput,
        ...bankForm,
        ...personalForm
      });
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Profile & Bank Details Saved',
          message: 'Your Bank Account information, Statutory Payroll details, and Verification Documents have been saved successfully! They are now live on the Admin Panel.',
          type: 'success'
        });
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Failed to save bank details & profile info');
      }
    } catch (err) {
      toast.error('Failed to save bank details & profile info');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Form Submissions
  const handleApplyLeave = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setLeaveSubmitting(true);
    try {
      const res = await employeePortalApi.applyLeave(leaveForm);
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Leave Submitted',
          message: res.message || 'Your leave application has been submitted to HR Manager for review.',
          type: 'success'
        });
        setLeaveForm({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Failed to apply for leave');
      }
    } catch (err) {
      toast.error('Failed to submit leave application');
    } finally {
      setLeaveSubmitting(false);
    }
  };

  const handleSubmitQuery = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setQuerySubmitting(true);
    try {
      const res = await employeePortalApi.submitQuery(queryForm);
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Query Dispatched',
          message: res.message || 'Your query has been sent to Admin / HR Support!',
          type: 'success'
        });
        setQueryForm({ subject: '', message: '' });
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Failed to send query');
      }
    } catch (err) {
      toast.error('Failed to send query');
    } finally {
      setQuerySubmitting(false);
    }
  };

  const handleSubmitDwr = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setDwrSubmitting(true);
    try {
      const res = await employeePortalApi.submitDwr(dwrForm);
      if (res && res.success) {
        setPortalModal({
          isOpen: true,
          title: 'Work Report Submitted',
          message: res.message || 'Daily Work Report logged successfully!',
          type: 'success'
        });
        setDwrForm({ summary: '', hoursWorked: '8.0' });
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Failed to submit DWR');
      }
    } catch (err) {
      toast.error('Failed to submit DWR');
    } finally {
      setDwrSubmitting(false);
    }
  };

  // ── Render Login Screen if not logged in ────────────────────────
  if (!token) {
    return (
      <div className="emp-portal-wrapper emp-login-container">
        <div className="emp-login-card">
          <div className="emp-login-header">
            <img src="/images/logo2.webp" alt="Inspiring Infosys" className="emp-login-logo" onError={(e) => e.target.src = '/img/logo.webp'} />
            <h2>Employee Portal</h2>
            <p>Log in with your official credentials</p>
          </div>

          {loginError && <div className="login-error-msg" style={{ marginBottom: '1.25rem' }}>{loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="admin-input-group">
              <label>Official Email / Personal Email / Employee ID</label>
              <input
                type="text"
                placeholder="e.g. INS001 or name@company.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loginLoading}>
              {loginLoading ? 'Signing In...' : 'Log In to Employee Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="emp-portal-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontWeight: '700', color: '#0284c7' }}>Loading your employee dashboard...</p>
      </div>
    );
  }

  const formatDisplayEmpId = (empId, id) => {
    const raw = String(empId || id || '').trim();
    if (!raw) return 'INS001';

    if (/^INS-?\d+$/i.test(raw)) {
      const numMatch = raw.match(/\d+/);
      if (numMatch) {
        return `INS${String(parseInt(numMatch[0], 10)).padStart(3, '0')}`;
      }
    }

    const match = raw.match(/\d+/);
    if (match && (/^emp\d+$/i.test(raw) || /^emp-\d+$/i.test(raw) || /^insi\d+$/i.test(raw) || /^\d+$/.test(raw))) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num)) {
        return `INS${String(num).padStart(3, '0')}`;
      }
    }

    return raw.toUpperCase();
  };

  if (!data || !data.employee) {
    return (
      <div className="emp-portal-wrapper emp-login-container">
        <div className="emp-login-card">
          <div className="emp-login-header">
            <img src="/images/logo2.webp" alt="Inspiring Infosys" className="emp-login-logo" onError={(e) => e.target.src = '/img/logo.webp'} />
            <h2>Employee Portal</h2>
            <p>Log in with your official credentials</p>
          </div>

          {loginError && <div className="login-error-msg" style={{ marginBottom: '1.25rem' }}>{loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="admin-input-group">
              <label>Official Email / Personal Email / Employee ID</label>
              <input
                type="text"
                placeholder="e.g. INS001 or name@company.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loginLoading}>
              {loginLoading ? 'Signing In...' : 'Log In to Employee Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const employee = data.employee;
  const notices = data.notices || [];
  const attendances = employee.attendances || [];
  const salarySlips = employee.salarySlips || [];
  const leaveRequests = employee.leaveRequests || [];
  const queries = employee.queries || [];
  const dailyWorkReports = employee.dailyWorkReports || [];

  // Check today's clock in status accurately using local date and checkIn timestamp comparison
  const now = new Date();
  const todayAtt = attendances.find(a => {
    if (!a) return false;
    if (a.checkIn) {
      const dIn = new Date(a.checkIn);
      if (!isNaN(dIn.getTime()) &&
        dIn.getFullYear() === now.getFullYear() &&
        dIn.getMonth() === now.getMonth() &&
        dIn.getDate() === now.getDate()) {
        return true;
      }
    }
    if (a.date) {
      const d = new Date(a.date);
      if (!isNaN(d.getTime()) &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()) {
        return true;
      }
    }
    return false;
  });
  const isClockedIn = Boolean(todayAtt && todayAtt.checkIn);
  const isClockedOut = Boolean(todayAtt && todayAtt.checkOut);

  return (
    <div className="emp-portal-wrapper">
      {/* ── Top Header Bar ── */}
      <header className="emp-navbar">
        <div className="emp-nav-left">
          <button
            type="button"
            className="emp-mobile-menu-btn"
            onClick={() => setSidebarOpen(prev => !prev)}
            title="Toggle Menu"
          >
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <img src="/images/logo2.webp" alt="Inspiring Infosys" className="emp-nav-logo" onError={(e) => e.target.src = '/img/logo.webp'} />
        </div>

        <div className="emp-nav-right">
          {/* Realtime Attendance Punch In / Out Header Widget */}
          <div className="emp-clock-widget">
            {!isClockedIn ? (
              <button className="btn-clock-in" onClick={handleClockIn}>
                <FiClock /> <span>Clock In Now</span>
              </button>
            ) : !isClockedOut ? (
              <button className="btn-clock-out" onClick={handleClockOut}>
                <FiClock /> <span>Clock Out</span>
              </button>
            ) : (
              <span className="badge-status badge-approved">Checked Out</span>
            )}
          </div>

          <div className="emp-user-profile">
            {employee.photoUrl ? (
              <img src={employee.photoUrl} alt={employee.name} className="emp-avatar-circle" />
            ) : (
              <div className="emp-avatar-circle">{employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}</div>
            )}
            <div className="emp-profile-meta" style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#0f172a' }}>{employee.name}</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{employee.designation || 'Team Member'}</div>
            </div>
          </div>

          <button className="admin-exit-btn" onClick={handleLogout} style={{ padding: '0.4rem 0.75rem' }} title="Log out">
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div className="emp-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Dashboard Sidebar + Content ── */}
      <div className="emp-main-container">
        <aside className={`emp-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="emp-sidebar-brand-box" style={{ padding: '0.65rem 0.5rem 1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-block' }}>
              EMPLOYEE PORTAL
            </span>
          </div>
          <div className="emp-sidebar-menu">
            <div className="emp-sidebar-section-title">OVERVIEW</div>
            <button className={`emp-sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
              <FiGrid /> <span>Executive Dashboard</span>
            </button>

            <div className="emp-sidebar-section-title">MY RECORDS</div>
            <button className={`emp-sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}>
              <FiUser /> <span>My Profile</span>
            </button>
            <button className={`emp-sidebar-btn ${activeTab === 'idcard' ? 'active' : ''}`} onClick={() => { setActiveTab('idcard'); setSidebarOpen(false); }}>
              <FiCreditCard /> <span>Employee ID Card</span>
            </button>
            <button className={`emp-sidebar-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setSidebarOpen(false); }}>
              <FiClock /> <span>Attendance Logs</span>
            </button>
            <button className={`emp-sidebar-btn ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => { setActiveTab('salary'); setSidebarOpen(false); }}>
              <FiDollarSign /> <span>Salary Slips</span>
            </button>

            <div className="emp-sidebar-section-title">SERVICES & HELP</div>
            <button className={`emp-sidebar-btn ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => { setActiveTab('leaves'); setSidebarOpen(false); }}>
              <FiCalendar /> <span>Leaves Tracker</span>
            </button>
            <button className={`emp-sidebar-btn ${activeTab === 'queries' ? 'active' : ''}`} onClick={() => { setActiveTab('queries'); setSidebarOpen(false); }}>
              <FiHelpCircle /> <span>Query Box</span>
            </button>
          </div>
        </aside>

        <main className="emp-content-area">

          {/* ── 0. Executive Overview Dashboard Tab ── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Welcome Header Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
                borderRadius: '16px',
                padding: '1.75rem 2rem',
                color: '#fff',
                marginBottom: '1.75rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.04em', backdropFilter: 'blur(4px)', marginBottom: '0.65rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></span>
                    EMPLOYEE DASHBOARD
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.35rem', color: '#fff', letterSpacing: '-0.02em' }}>
                    Welcome back, {employee.name}! 👋
                  </h1>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                    {employee.designation || 'Specialist'} &bull; <span style={{ color: '#38bdf8' }}>{employee.department || 'IT'}</span> &bull; Emp ID: <strong>{formatDisplayEmpId(employee.empId, employee.id)}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {!isClockedIn ? (
                    <button className="btn-clock-in" onClick={handleClockIn} style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}>
                      <FiClock /> Clock In Today
                    </button>
                  ) : !isClockedOut ? (
                    <button className="btn-clock-out" onClick={handleClockOut} style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}>
                      <FiClock /> Clock Out
                    </button>
                  ) : (
                    <span className="badge-status badge-approved" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                      ✅ Clocked Out Today
                    </span>
                  )}
                </div>
              </div>

              {/* 4 Executive Stat Cards Grid */}
              {(() => {
                const totalSalaryReceived = salarySlips.reduce((sum, slip) => {
                  const net = Number(slip.netSalary || slip.basicPay || 0);
                  return sum + (isNaN(net) ? 0 : net);
                }, 0);

                const approvedLeavesCount = leaveRequests.filter(l => l.status === 'Approved').length;
                const pendingLeavesCount = leaveRequests.filter(l => l.status === 'Pending').length;
                const remainingLeaves = Math.max(0, 24 - approvedLeavesCount);

                const presentDaysCount = attendances.filter(a => a.status === 'Present' || a.checkIn).length;
                const pendingQueriesCount = queries.filter(q => q.status === 'Pending').length;

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>

                      {/* Card 1: Total Salary Received */}
                      <div className="stat-card" style={{ background: '#fff', padding: '1.35rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Total Salary Received
                          </span>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <FiDollarSign />
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#047857', margin: 0 }}>
                          ₹{totalSalaryReceived.toLocaleString('en-IN')}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiTrendingUp style={{ color: '#10b981' }} /> From {salarySlips.length} Issued Slips
                        </div>
                      </div>

                      {/* Card 2: Leave Balance */}
                      <div className="stat-card" style={{ background: '#fff', padding: '1.35rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Leave Balance
                          </span>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <FiCalendar />
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ea580c', margin: 0 }}>
                          {remainingLeaves} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>/ 24 Days</span>
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '600' }}>
                          {approvedLeavesCount} Approved &bull; {pendingLeavesCount} Pending
                        </div>
                      </div>

                      {/* Card 3: Days Logged */}
                      <div className="stat-card" style={{ background: '#fff', padding: '1.35rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Days Present
                          </span>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <FiClock />
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0284c7', margin: 0 }}>
                          {presentDaysCount} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>Days Logged</span>
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '600' }}>
                          {isClockedIn ? '🟢 Clocked In Today' : '⚪ Not Clocked In Yet'}
                        </div>
                      </div>

                      {/* Card 4: Monthly Gross CTC */}
                      <div className="stat-card" style={{ background: '#fff', padding: '1.35rem 1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Current Monthly CTC
                          </span>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            <FiBriefcase />
                          </div>
                        </div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#9333ea', margin: 0 }}>
                          ₹{Number(employee.salary || 0).toLocaleString('en-IN')}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem', fontWeight: '600' }}>
                          Active Salary Structure
                        </div>
                      </div>

                    </div>

                    {/* Secondary Grid Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>

                      {/* Left Block: Quick Action Shortcuts */}
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Quick Actions & Portal Shortcuts</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                          <button
                            onClick={() => setActiveTab('salary')}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              alignItems: 'flex-start',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiFileText />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>View Payslips</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Download salary slips</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('leaves')}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              alignItems: 'flex-start',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiPlus />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>Apply for Leave</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Submit leave request</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('idcard')}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              alignItems: 'flex-start',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiCreditCard />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>Employee ID Card</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>View & print ID card</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('queries')}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              alignItems: 'flex-start',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiHelpCircle />
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a' }}>HR Query Box</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ask HR questions ({pendingQueriesCount} open)</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Block: Recent Salary Slips Summary Table */}
                      <div className="admin-card">
                        <div className="admin-card-header" style={{ justifyContent: 'space-between' }}>
                          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Issued Salary Slips</h2>
                          <button
                            type="button"
                            onClick={() => setActiveTab('salary')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                          >
                            View All &rarr;
                          </button>
                        </div>

                        {salarySlips.length === 0 ? (
                          <p style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem 0', margin: 0 }}>
                            No salary slips issued yet.
                          </p>
                        ) : (
                          <div className="table-responsive">
                            <table className="admin-table" style={{ fontSize: '0.82rem' }}>
                              <thead>
                                <tr>
                                  <th>Month & Year</th>
                                  <th>Net Disbursed</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {salarySlips.slice(0, 3).map((slip) => (
                                  <tr key={slip.id}>
                                    <td><strong>{slip.month} {slip.year}</strong></td>
                                    <td style={{ color: '#059669', fontWeight: '700' }}>
                                      ₹{Number(slip.netSalary || slip.basicPay || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td>
                                      <span className="badge-status badge-approved" style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}>
                                        Disbursed
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ── 1. Profile & Document Uploads Tab ── */}
          {activeTab === 'profile' && (
            <div>
              {/* Executive Hero Profile Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0284c7 100%)',
                borderRadius: '16px',
                padding: '1.75rem 2rem',
                color: '#fff',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '85px',
                  height: '85px',
                  borderRadius: '50%',
                  background: '#f0f9ff',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {photoInput ? (
                    <img src={photoInput} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    employee.name ? employee.name.charAt(0).toUpperCase() : 'E'
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#fff', letterSpacing: '-0.02em' }}>
                      {employee.name}
                    </h1>
                    <span className="badge-status badge-approved" style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem' }}>
                      ● {employee.status || 'ACTIVE'}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 0.65rem', color: '#94a3b8', fontSize: '0.92rem', fontWeight: '600' }}>
                    {employee.designation || 'Full Stack'} &bull; <span style={{ color: '#38bdf8' }}>{employee.department || 'IT'}</span>
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                    <span style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '0.25rem 0.65rem', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
                      🆔 Emp ID: <strong>{formatDisplayEmpId(employee.empId, employee.id)}</strong>
                    </span>
                    <span style={{ background: 'rgba(255, 255, 255, 0.12)', padding: '0.25rem 0.65rem', borderRadius: '6px', backdropFilter: 'blur(4px)' }}>
                      📅 Joined: {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '01 Jan 2024'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-orange"
                  style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem' }}
                  onClick={() => setActiveTab('idcard')}
                >
                  <FiCreditCard /> View Employee ID Card &rarr;
                </button>
              </div>

              {/* Sub-Tab Pills Bar inside Profile */}
              <div className="profile-subtab-bar">
                <button
                  type="button"
                  className={`profile-subtab-btn ${profileSubTab === 'details' ? 'active' : ''}`}
                  onClick={() => setProfileSubTab('details')}
                >
                  <FiUser /> Employment Details
                </button>
                <button
                  type="button"
                  className={`profile-subtab-btn ${profileSubTab === 'bank' ? 'active' : ''}`}
                  onClick={() => setProfileSubTab('bank')}
                >
                  <FiDollarSign /> Bank & Payroll Details
                </button>
                <button
                  type="button"
                  className={`profile-subtab-btn ${profileSubTab === 'docs' ? 'active' : ''}`}
                  onClick={() => setProfileSubTab('docs')}
                >
                  <FiUpload /> Verification Documents
                </button>
                {(() => {
                  const hrLets = employee.hrLetters || [];
                  const offerLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('offer'));
                  const relLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('reliev'));
                  const expLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('experi'));
                  const hasOfferAccess = offerLet ? offerLet.sentToEmployee !== false : false;
                  const hasRelievingAccess = relLet ? relLet.sentToEmployee !== false : false;
                  const hasExperienceAccess = expLet ? expLet.sentToEmployee !== false : false;
                  const hasAnyLetterAccess = hasOfferAccess || hasRelievingAccess || hasExperienceAccess;
                  if (!hasAnyLetterAccess) return null;

                  return (
                    <button
                      type="button"
                      className={`profile-subtab-btn ${profileSubTab === 'letters' ? 'active' : ''}`}
                      onClick={() => setProfileSubTab('letters')}
                    >
                      <FiCheckCircle /> Official Letters
                    </button>
                  );
                })()}
              </div>

              {/* Sub-Tab 1: Employment Details */}
              {profileSubTab === 'details' && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Official Employment Details</h2>
                    <span className={`status-badge status-${employee.status === 'Active' ? 'active' : 'inactive'}`}>
                      {employee.status || 'Active'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                    <div className="profile-info-tile">
                      <div className="info-icon-box blue-icon">
                        <FiUser />
                      </div>
                      <div>
                        <span className="info-lbl">Employee ID</span>
                        <strong className="info-val">{formatDisplayEmpId(employee.empId, employee.id)}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box green-icon">
                        <FiMail />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <span className="info-lbl">Official Email</span>
                        <strong className="info-val text-truncate">{employee.email}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box orange-icon">
                        <FiPhone />
                      </div>
                      <div>
                        <span className="info-lbl">Phone Number</span>
                        <strong className="info-val">{employee.phone || '-'}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box purple-icon">
                        <FiBriefcase />
                      </div>
                      <div>
                        <span className="info-lbl">Department</span>
                        <strong className="info-val">{employee.department}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box indigo-icon">
                        <FiUser />
                      </div>
                      <div>
                        <span className="info-lbl">Designation</span>
                        <strong className="info-val">{employee.designation}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box red-icon">
                        <FiCalendar />
                      </div>
                      <div>
                        <span className="info-lbl">Joining Date</span>
                        <strong className="info-val">{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</strong>
                      </div>
                    </div>

                    <div className="profile-info-tile">
                      <div className="info-icon-box emerald-icon">
                        <FiDollarSign />
                      </div>
                      <div>
                        <span className="info-lbl">Monthly Salary</span>
                        <strong className="info-val text-emerald">₹{Number(employee.salary).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Bank Account & Statutory Payroll */}
              {profileSubTab === 'bank' && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Bank Account & Statutory Payroll Details</h2>
                    <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '700', background: '#e0f2fe', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                      Updates Live on Admin Panel
                    </span>
                  </div>

                  <form onSubmit={saveDocuments}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div className="form-field-group">
                        <label className="form-label">Bank Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. HDFC Bank, ICICI, SBI"
                          value={bankForm.bankName}
                          onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Bank Account Number"
                          value={bankForm.accountNumber}
                          onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. HDFC0001234"
                          style={{ textTransform: 'uppercase' }}
                          value={bankForm.ifsc}
                          onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">PAN Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. ABCDE1234F"
                          style={{ textTransform: 'uppercase' }}
                          value={bankForm.panNumber}
                          onChange={(e) => setBankForm({ ...bankForm, panNumber: e.target.value.toUpperCase() })}
                        />
                      </div>

                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>Personal & Emergency Contact Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div className="form-field-group">
                          <label className="form-label">Personal Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Personal Email"
                            value={personalForm.personalEmail}
                            onChange={(e) => setPersonalForm({ ...personalForm, personalEmail: e.target.value })}
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="form-label">Alternate Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Alternate Phone"
                            value={personalForm.altPhone}
                            onChange={(e) => setPersonalForm({ ...personalForm, altPhone: e.target.value })}
                          />
                        </div>

                        <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                          <label className="form-label">Current Residential Address</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Current Address"
                            value={personalForm.currentAddress}
                            onChange={(e) => setPersonalForm({ ...personalForm, currentAddress: e.target.value })}
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="form-label">Emergency Contact Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Contact Name"
                            value={personalForm.emergencyContactName}
                            onChange={(e) => setPersonalForm({ ...personalForm, emergencyContactName: e.target.value })}
                          />
                        </div>

                        <div className="form-field-group">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Emergency Phone Number"
                            value={personalForm.emergencyPhone}
                            onChange={(e) => setPersonalForm({ ...personalForm, emergencyPhone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-orange"
                      style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                      disabled={uploadingDoc}
                    >
                      <FiCheckCircle /> {uploadingDoc ? 'Saving Bank & Profile Details...' : 'Save Bank Account & Personal Details'}
                    </button>
                  </form>
                </div>
              )}

              {/* Sub-Tab 3: Verification Documents */}
              {profileSubTab === 'docs' && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Identity & Verification Documents</h2>
                    {employee.docVerified ? (
                      <span className="badge-status badge-approved">Verified ✅</span>
                    ) : (
                      <span className="badge-status badge-pending">Pending Verification</span>
                    )}
                  </div>

                  <div className="doc-upload-grid">
                    {/* Profile Photo */}
                    <div className="doc-upload-box">
                      <label style={{ fontSize: '0.84rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>1. Profile Photo</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPhotoInput)} style={{ fontSize: '0.75rem' }} />
                      {photoInput ? (
                        <img src={photoInput} alt="Profile preview" className="doc-preview-img" />
                      ) : (
                        <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No photo uploaded</div>
                      )}
                    </div>

                    {/* Aadhar Card */}
                    <div className="doc-upload-box">
                      <label style={{ fontSize: '0.84rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>2. Aadhar Card</label>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, setAadharInput)} style={{ fontSize: '0.75rem' }} />
                      {aadharInput ? (
                        <img src={aadharInput} alt="Aadhar preview" className="doc-preview-img" />
                      ) : (
                        <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No Aadhar card uploaded</div>
                      )}
                    </div>

                    {/* PAN Card */}
                    <div className="doc-upload-box">
                      <label style={{ fontSize: '0.84rem', fontWeight: '800', display: 'block', marginBottom: '0.5rem', color: '#0f172a' }}>3. PAN Card</label>
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, setPanInput)} style={{ fontSize: '0.75rem' }} />
                      {panInput ? (
                        <img src={panInput} alt="PAN preview" className="doc-preview-img" />
                      ) : (
                        <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No PAN card uploaded</div>
                      )}
                    </div>
                  </div>

                  <button className="btn-orange" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }} onClick={saveDocuments} disabled={uploadingDoc}>
                    <FiUpload /> {uploadingDoc ? 'Saving Documents...' : 'Save & Update Verification Documents'}
                  </button>
                </div>
              )}

              {/* Sub-Tab 4: Official Company Letters */}
              {profileSubTab === 'letters' && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Company Letters & Official Downloads</h2>
                  </div>

                  {(() => {
                    const hrLets = employee.hrLetters || [];
                    const offerLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('offer'));
                    const relLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('reliev'));
                    const expLet = hrLets.find(l => (l.letterType || '').toLowerCase().includes('experi'));

                    const hasOfferAccess = offerLet ? offerLet.sentToEmployee !== false : false;
                    const hasRelievingAccess = relLet ? relLet.sentToEmployee !== false : false;
                    const hasExperienceAccess = expLet ? expLet.sentToEmployee !== false : false;

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        {hasOfferAccess && (
                          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.75rem' }}>
                              <FiCheckCircle />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 0.35rem', color: '#0f172a' }}>Offer Letter</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Issued & Verified by HR</p>
                            <button type="button" className="btn-letter-dropdown-toggle" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', width: '100%', justifyContent: 'center' }} onClick={() => setShowOfferModal(true)}>
                              <FiCheckCircle /> View & Print Offer Letter
                            </button>
                          </div>
                        )}

                        {hasRelievingAccess && (
                          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.75rem' }}>
                              <FiCheckCircle />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 0.35rem', color: '#0f172a' }}>Relieving Letter</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Issued & Verified by HR</p>
                            <button type="button" className="btn-letter-dropdown-toggle" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', width: '100%', justifyContent: 'center' }} onClick={() => setShowRelievingModal(true)}>
                              <FiCheckCircle /> View & Print Relieving Letter
                            </button>
                          </div>
                        )}

                        {hasExperienceAccess && (
                          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 0.75rem' }}>
                              <FiCheckCircle />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: '0 0 0.35rem', color: '#0f172a' }}>Experience Letter</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>Issued & Verified by HR</p>
                            <button type="button" className="btn-letter-dropdown-toggle" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', width: '100%', justifyContent: 'center' }} onClick={() => setShowExperienceModal(true)}>
                              <FiCheckCircle /> View & Print Experience Letter
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ── 1.5. Dedicated Official Employee ID Card Tab ── */}
          {activeTab === 'idcard' && (
            <div>
              <div className="admin-content-header">
                <h1>Official Employee ID Card</h1>
              </div>

              <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <div className="admin-card" style={{ textAlign: 'center' }}>
                  <div className="admin-card-header" style={{ justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.05rem', margin: 0 }}>Digital Employee Pass</h2>
                    <div className="id-card-side-toggle-group">
                      <button
                        type="button"
                        className={`btn-id-toggle ${idCardSide === 'front' ? 'active' : ''}`}
                        onClick={() => setIdCardSide('front')}
                      >
                        Front
                      </button>
                      <button
                        type="button"
                        className={`btn-id-toggle ${idCardSide === 'back' ? 'active' : ''}`}
                        onClick={() => setIdCardSide('back')}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className={`btn-id-toggle ${idCardSide === 'both' ? 'active' : ''}`}
                        onClick={() => setIdCardSide('both')}
                      >
                        Both
                      </button>
                    </div>
                  </div>

                  {/* Wrapper container for printable ID Card */}
                  <div className="id-card-printable-container" id="printable-id-card">

                    {/* FRONT SIDE */}
                    {(idCardSide === 'front' || idCardSide === 'both') && (
                      <div className="official-id-card clean-white-id-card">
                        {/* Laminated Sheen Overlay */}
                        <div className="id-glossy-sheen"></div>

                        {/* Lanyard Hole Punch Slot */}
                        <div className="id-lanyard-slot-box">
                          <div className="id-lanyard-slot"></div>
                        </div>

                        {/* Top Bar Area: Left Wave Swoosh & Right Logo */}
                        <div className="id-top-bar-area">
                          <div className="id-top-left-swoosh">
                            <svg viewBox="0 0 160 120" preserveAspectRatio="none" className="id-top-swoosh-svg">
                              <path d="M0,0 L160,0 C120,50 60,110 0,110 Z" fill="#38bdf8" opacity="0.45" />
                              <path d="M0,0 L140,0 C100,45 45,95 0,95 Z" fill="#0284c7" />
                            </svg>
                          </div>
                          <div className="id-top-right-logo">
                            <img
                              src="/images/logo2.webp"
                              alt="Logo"
                              className="id-clean-logo-img"
                              onError={(e) => e.target.src = '/img/logo.webp'}
                            />
                          </div>
                        </div>

                        {/* Centered Circular Profile Photo */}
                        <div className="id-center-profile-area">
                          <div className="id-circle-photo-ring">
                            {photoInput ? (
                              <img src={photoInput} alt={employee.name} />
                            ) : (
                              <FiUser size={56} color="#0284c7" />
                            )}
                          </div>
                          <div className="id-emp-fullname">{employee.name.toUpperCase()}</div>
                          <div className="id-emp-jobtitle">{(employee.designation || 'E-COMMERCE EXECUTIVE').toUpperCase()}</div>
                        </div>

                        {/* Aligned Key-Value Details */}
                        <div className="id-aligned-details-box">
                          <div className="id-detail-line">
                            <span className="id-detail-lbl">ID No</span>
                            <span className="id-detail-colon">:</span>
                            <span className="id-detail-val">
                              {formatDisplayEmpId(employee.empId, employee.id)}
                            </span>
                          </div>

                          <div className="id-detail-line">
                            <span className="id-detail-lbl">Join</span>
                            <span className="id-detail-colon">:</span>
                            <span className="id-detail-val">
                              {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString('en-GB') : '01/01/2024'}
                            </span>
                          </div>

                          <div className="id-detail-line">
                            <span className="id-detail-lbl sky-label">Phone</span>
                            <span className="id-detail-colon">:</span>
                            <span className="id-detail-val">
                              {employee.phone || '+91-8444040514'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Right Wave Swoosh Graphic */}
                        <div className="id-bottom-right-swoosh">
                          <svg viewBox="0 0 160 100" preserveAspectRatio="none" className="id-bottom-swoosh-svg">
                            <path d="M160,100 L0,100 C50,60 110,20 160,0 Z" fill="#38bdf8" opacity="0.35" />
                            <path d="M160,100 L20,100 C70,68 120,32 160,15 Z" fill="#0284c7" />
                          </svg>
                        </div>

                        {/* Footer Authorized Signatory Stamp */}
                        <div className="id-clean-footer-wrap">
                          <div className="id-front-signature-wrap">
                            <img
                              src="/images/company-stamp.png"
                              alt="Authorized Stamp"
                              className="id-auth-stamp"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="id-sign-line"></div>
                            <div className="id-sign-title">Authorized Signatory</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BACK SIDE */}
                    {(idCardSide === 'back' || idCardSide === 'both') && (
                      <div className="official-id-card clean-white-id-card official-id-card-back">
                        {/* Laminated Sheen Overlay */}
                        <div className="id-glossy-sheen"></div>

                        {/* Lanyard Hole Punch Slot */}
                        <div className="id-lanyard-slot-box">
                          <div className="id-lanyard-slot"></div>
                        </div>

                        {/* Top Maroon Wave Accent */}
                        <div className="id-back-wave-top">
                          <svg viewBox="0 0 300 35" preserveAspectRatio="none" className="id-wave-svg">
                            <path d="M0,0 L300,0 L300,14 C200,32 100,8 0,26 Z" fill="#881337" />
                          </svg>
                        </div>

                        {/* Sell Well Logo */}
                        <div className="id-back-brand-box">
                          <img src="/images/sellwell_logo.png" alt="SellWell Logo" className="sellwell-logo-img" />
                          <div className="sellwell-tagline">Selling Online Made Easy</div>
                        </div>

                        {/* Address & Contact Info */}
                        <div className="id-back-content">
                          <div className="id-back-sec">
                            <div className="id-back-label">Contact</div>
                            <div className="id-back-val">+91-8444040514 / +91-7387070086</div>
                            <div className="id-back-comp-title">INSPIRING INFOSYS PVT LTD</div>
                          </div>

                          <div className="id-back-sec">
                            <div className="id-back-label">Head Office</div>
                            <div className="id-back-val">B2, Nutan Nagar Society, Turner Road, Bandra West, Mumbai, MH 400050</div>
                          </div>

                          <div className="id-back-sec">
                            <div className="id-back-label">Branch Office</div>
                            <div className="id-back-val">Unit No 11, Ground Floor, Nawalgaria Industrial Estate, Chinchpada, Vasai East, 401208</div>
                          </div>

                          {/* QR Code */}
                          <div className="id-back-qr-box">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://sellwell.co.in" alt="QR Code" className="id-back-qr-img" />
                            <div className="id-back-url">www.sellwell.co.in</div>
                          </div>
                        </div>

                        {/* Bottom Maroon Wave Accent */}
                        <div className="id-back-wave-bottom">
                          <svg viewBox="0 0 300 35" preserveAspectRatio="none" className="id-wave-svg">
                            <path d="M0,35 L300,35 L300,21 C200,3 100,27 0,9 Z" fill="#881337" />
                          </svg>
                        </div>
                      </div>
                    )}

                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="btn-orange"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => window.print()}
                    >
                      <FiPrinter /> Print ID Card ({idCardSide === 'both' ? 'FRONT & BACK' : idCardSide.toUpperCase()})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 2. Attendance Logs Tab ── */}
          {activeTab === 'attendance' && (
            <div>
              <div className="admin-content-header">
                <h1>My Attendance History</h1>
              </div>

              {/* Unified Date & Status Filter Bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem', background: '#fff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCalendar style={{ color: '#0284c7' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Date Filter:</span>
                  <input
                    type="date"
                    value={attDateFilter}
                    onChange={e => setAttDateFilter(e.target.value)}
                    onClick={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                    onFocus={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#fff', cursor: 'pointer' }}
                  />
                  {attDateFilter && (
                    <button
                      type="button"
                      onClick={() => setAttDateFilter('')}
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Clear Date
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiClock style={{ color: '#0284c7' }} />
                  <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Status:</span>
                  <select
                    value={attStatusFilter}
                    onChange={e => setAttStatusFilter(e.target.value)}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#fff' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="admin-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filtered = (attendances || []).filter(att => {
                          if (!att.date) return false;
                          const d = new Date(att.date);
                          if (attDateFilter) {
                            const filterD = new Date(attDateFilter);
                            if (d.getFullYear() !== filterD.getFullYear() || d.getMonth() !== filterD.getMonth() || d.getDate() !== filterD.getDate()) {
                              return false;
                            }
                          }
                          if (attStatusFilter !== 'All') {
                            const st = (att.status || 'Present').toLowerCase();
                            if (attStatusFilter.toLowerCase() !== st) {
                              return false;
                            }
                          }
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                                No attendance records match the selected date / status filter.
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((att) => (
                          <tr key={att.id}>
                            <td><strong>{att.date ? (isNaN(new Date(att.date).getTime()) ? String(att.date) : new Date(att.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })) : '-'}</strong></td>
                            <td>{att.checkIn ? (typeof att.checkIn === 'string' && (att.checkIn.includes('AM') || att.checkIn.includes('PM')) ? att.checkIn : (isNaN(new Date(att.checkIn).getTime()) ? String(att.checkIn) : new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))) : '-'}</td>
                            <td>{att.checkOut ? (typeof att.checkOut === 'string' && (att.checkOut.includes('AM') || att.checkOut.includes('PM')) ? att.checkOut : (isNaN(new Date(att.checkOut).getTime()) ? String(att.checkOut) : new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))) : '-'}</td>
                            <td>
                              <span className={`badge-status ${att.status === 'Present' ? 'badge-approved' : att.status === 'Late' ? 'badge-pending' : 'badge-rejected'}`}>
                                {att.status}
                              </span>
                            </td>
                            <td>{att.notes || '-'}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── 3. Salary Slips Tab ── */}
          {activeTab === 'salary' && (
            <div>
              <div className="admin-content-header">
                <h1>Issued Salary Slips</h1>
              </div>

              <div className="admin-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Month & Year</th>
                        <th>Basic Salary</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Issued Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salarySlips.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                            No salary slips issued by HR yet.
                          </td>
                        </tr>
                      ) : (
                        salarySlips.map((slip) => (
                          <tr key={slip.id}>
                            <td><strong>{slip.month} {slip.year}</strong></td>
                            <td>₹{Number(slip.basicPay).toLocaleString('en-IN')}</td>
                            <td>₹{Number(slip.allowances || 0).toLocaleString('en-IN')}</td>
                            <td style={{ color: '#dc2626' }}>-₹{Number(slip.deductions).toLocaleString('en-IN')}</td>
                            <td style={{ color: '#16a34a', fontWeight: '800' }}>₹{Number(slip.netSalary).toLocaleString('en-IN')}</td>
                            <td>{slip.issuedAt || slip.createdAt ? (isNaN(new Date(slip.issuedAt || slip.createdAt).getTime()) ? String(slip.issuedAt || slip.createdAt) : new Date(slip.issuedAt || slip.createdAt).toLocaleDateString('en-IN')) : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── 4. Leaves Tracker & Apply Tab ── */}
          {activeTab === 'leaves' && (
            <div>
              <div className="admin-content-header">
                <h1>Leave Tracker & Applications</h1>
              </div>

              <div className="form-grid form-grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                {/* Apply Form */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Apply for Leave</h2>
                  </div>
                  <form onSubmit={handleApplyLeave} className="login-form">
                    <div className="admin-input-group">
                      <label>Leave Type</label>
                      <select value={leaveForm.leaveType} onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}>
                        <option value="Casual">Casual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Paid">Paid Annual Leave</option>
                      </select>
                    </div>

                    <div className="form-grid form-grid-2">
                      <div className="admin-input-group">
                        <label>Start Date</label>
                        <input type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} required />
                      </div>
                      <div className="admin-input-group">
                        <label>End Date</label>
                        <input type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} required />
                      </div>
                    </div>

                    <div className="admin-input-group">
                      <label>Reason for Leave</label>
                      <textarea rows={3} placeholder="Provide details..." value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} required />
                    </div>

                    <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center' }} disabled={leaveSubmitting}>
                      <FiSend /> {leaveSubmitting ? 'Submitting...' : 'Submit Leave Application'}
                    </button>
                  </form>
                </div>

                {/* Submitted Applications List */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Leave Requests History</h2>
                  </div>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Dates</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.length === 0 ? (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b' }}>No leave requests submitted yet.</td>
                          </tr>
                        ) : (
                          leaveRequests.map((l) => (
                            <tr key={l.id}>
                              <td><strong>{l.leaveType}</strong></td>
                              <td style={{ fontSize: '0.78rem' }}>
                                {l.startDate ? (isNaN(new Date(l.startDate).getTime()) ? String(l.startDate) : new Date(l.startDate).toLocaleDateString('en-IN')) : '-'} to {l.endDate ? (isNaN(new Date(l.endDate).getTime()) ? String(l.endDate) : new Date(l.endDate).toLocaleDateString('en-IN')) : '-'}
                              </td>
                              <td style={{ maxWidth: '180px', whiteSpace: 'normal', fontSize: '0.8rem' }}>{l.reason}</td>
                              <td>
                                <span className={`badge-status ${l.status === 'Approved' ? 'badge-approved' : l.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. Query Box (Help Desk) Tab ── */}
          {activeTab === 'queries' && (
            <div>
              <div className="admin-content-header">
                <h1>HR Help Desk & Query Box</h1>
              </div>

              <div className="form-grid form-grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Ask HR / Admin</h2>
                  </div>
                  <form onSubmit={handleSubmitQuery} className="login-form">
                    <div className="admin-input-group">
                      <label>Subject</label>
                      <input type="text" placeholder="E.g., Question about PF deduction" value={queryForm.subject} onChange={(e) => setQueryForm({ ...queryForm, subject: e.target.value })} required />
                    </div>
                    <div className="admin-input-group">
                      <label>Question / Query Message</label>
                      <textarea rows={4} placeholder="Describe your question..." value={queryForm.message} onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center' }} disabled={querySubmitting}>
                      <FiSend /> Send Query to Admin
                    </button>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>My Submitted Queries & Responses</h2>
                  </div>
                  {queries.length === 0 ? (
                    <p style={{ fontStyle: 'italic', color: '#64748b' }}>No queries submitted yet.</p>
                  ) : (
                    queries.map((q) => (
                      <div key={q.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{q.subject}</strong>
                          <span className={`badge-status ${q.status === 'Replied' ? 'badge-approved' : 'badge-pending'}`}>{q.status}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}>{q.message}</div>
                        {q.reply && (
                          <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #0284c7', fontSize: '0.85rem' }}>
                            <strong style={{ color: '#0284c7' }}>Admin Reply:</strong> {q.reply}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Official Letters Modals */}
      {showOfferModal && <OfferLetter employee={employee} isReadOnly={true} onClose={() => setShowOfferModal(false)} />}
      {showRelievingModal && <RelievingLetter employee={employee} isReadOnly={true} onClose={() => setShowRelievingModal(false)} />}
      {showExperienceModal && <ExperienceLetter employee={employee} isReadOnly={true} onClose={() => setShowExperienceModal(false)} />}

      {/* Blue and White Custom Modal Popup */}
      <Modal
        isOpen={portalModal.isOpen}
        onClose={() => setPortalModal(prev => ({ ...prev, isOpen: false }))}
        title={portalModal.title}
        message={portalModal.message}
        type={portalModal.type}
        onConfirm={portalModal.onConfirm}
      />
    </div>
  );
}

export default EmployeeDashboard;
