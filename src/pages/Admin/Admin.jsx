import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheckCircle, FiCopy, FiShare2, FiX } from 'react-icons/fi';
import {
  authApi, statsApi, testimonialsApi, projectsApi, quotesApi, consultationsApi, categoriesApi, turnoverApi, employeesApi
} from '../../api/api';

import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import StatsManager from './components/StatsManager';
import TestimonialsManager from './components/TestimonialsManager';
import ProjectsManager from './components/ProjectsManager';
import EmployeeListTab from './components/EmployeeListTab';
import QuotesInboxTab from './components/QuotesInboxTab';
import ConsultationsInboxTab from './components/ConsultationsInboxTab';
import QuoteConfigTab from './components/QuoteConfigTab';
import ClientServicesTab from './components/ClientServicesTab';

import './Admin.css';

const DEFAULT_STATS = [
  { id: 1, label: 'Happy Clients', value: '300', suffix: '+', sortOrder: 1, isActive: true },
  { id: 2, label: 'Projects Done', value: '800', suffix: '+', sortOrder: 2, isActive: true },
  { id: 3, label: 'Years Experience', value: '10', suffix: '+', sortOrder: 3, isActive: true }
];

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: 'Shambhu Gupta', initials: 'SG', timeAgo: '4 weeks ago', rating: 5, text: 'Best learning places for e-commerce services in Mumbai ... Amazon onboarding Myntra onboarding', colorClass: 'badge-purple', isActive: true },
  { id: 2, name: 'Intact Media', initials: 'IM', timeAgo: '8 months ago', rating: 5, text: 'Great places for E-commerce solutions and websites designed and developing also helping selling on Myntra and quick commerce', colorClass: 'badge-blue', isActive: true },
  { id: 3, name: 'Manzoor Ansari', initials: 'MA', timeAgo: '2 years ago', rating: 5, text: 'Great place to learn and start ecommerce own business from zero. The best part is I can learn all technical skills about amazon seller, flipkart seller Centre...', colorClass: 'badge-pink', isActive: true },
  { id: 4, name: 'Neha Kapoor', initials: 'NK', timeAgo: '2 months ago', rating: 5, text: 'Our marketing campaigns are very easy to run now. The WhatsApp API templates and broadcasts save our marketing team a significant amount of time.', colorClass: 'badge-cyan', isActive: true },
  { id: 5, name: 'Ravi Sharma', initials: 'RS', timeAgo: '1 month ago', rating: 5, text: 'The automated WhatsApp business API solution has helped us automate purchase notifications and increase customer engagement significantly.', colorClass: 'badge-orange', isActive: true }
];

const DEFAULT_PROJECTS = [
  { id: 1, title: 'SellWell Automation', category: 'Software', imgUrl: '/img/portsellwellimage.webp', link: 'https://sellwellone.com/', description: 'Centralized e-commerce automation dashboard to manage inventory, orders, and performance across multiple marketplace seller accounts.', sortOrder: 1, isActive: true },
  { id: 2, title: 'Spartan Nutrition', category: 'Websites', imgUrl: '/img/web-spartan.webp', link: 'https://spartannutrition.com/', description: 'Custom designed high-performance responsive website for sports nutrition products.', sortOrder: 2, isActive: true },
  { id: 3, title: 'Tap2Cash', category: 'Software', imgUrl: '/img/taptocash.webp', link: 'https://tap2cash.in/', description: 'Interactive POS and financial transaction software solution.', sortOrder: 3, isActive: true },
  { id: 4, title: 'Lactra B2B', category: 'E-Commerce', imgUrl: '/img/web-lactra.webp', link: 'https://www.lactra.in/', description: 'Wholesale B2B ordering portal and e-commerce listing management solution.', sortOrder: 4, isActive: true },
  { id: 5, title: 'Ayaan Toys', category: 'E-Commerce', imgUrl: '/img/Web-ayantoys.webp', link: 'https://ayaantoys.in', description: 'Product catalog setup, inventory tracking and seller account automation.', sortOrder: 5, isActive: true },
  { id: 6, title: 'Clasi Air', category: 'Websites', imgUrl: '/img/Web-clasair.webp', link: 'https://clasiair.com', description: 'Brand website optimized for page speed, search visibility, and conversion.', sortOrder: 6, isActive: true },
  { id: 7, title: 'Lycot Swimwear', category: 'E-Commerce', imgUrl: '/img/Web-lycot.png', link: 'https://www.lycot.com/password', description: 'Marketplace account setup, listings optimization, and active ad campaign management.', sortOrder: 7, isActive: true },
  { id: 8, title: 'Business Card Scanner', category: 'Business Tools', imgUrl: '/img/bcs.webp', link: '/business-tools/business-card-scanner-in-mumbai', description: 'AI OCR scanner for instant contact saving and lead management.', sortOrder: 8, isActive: true }
];

const DEFAULT_EMPLOYEES = [
  { id: 3, empId: 'INS001', name: 'sahil mehta', email: 'sahilmehta2324@gmail.com', phone: '8444040514', department: 'IT', designation: 'FULL STACK', joinDate: '2026-09-05', salary: 2222, status: 'Active', address: 'R N B, ADARSH NIWAS, 408, 4th, Palghar' },
  { id: 4, empId: 'INS003', name: 'yogi', email: 'inspiringinfos@gmail.com', phone: '08444040514', department: 'IT', designation: 'Founder', joinDate: '2026-09-05', salary: 20000, status: 'Active', address: 'OPP JK TOWER, NALASOPARA EAST' },
  { id: 7, empId: 'INS004', name: 'Alam Ansari', email: 'hello@sellwell.co.in', phone: '8422953384', department: 'IT', designation: 'Software Engineer', joinDate: '2026-09-15', salary: 20000, status: 'Active', address: 'R N B, ADARSH NIWAS, 408, 4th, Palghar' },
  { id: 8, empId: 'INS005', name: 'Aditya  Jadhav', email: 'adityajadhav7123@gmail.com', phone: '9833379781', department: 'IT', designation: 'Full Stack Developer', joinDate: '2026-09-15', salary: 10000, status: 'Active', address: 'Andheri West' }
];

function Admin() {
  const location = useLocation();

  const getInitialTab = () => {
    const path = (location.pathname || '').toLowerCase();
    if (path.includes('/employees') || path.includes('/staff') || path.includes('/attendance') || path.includes('/leaves') || path.includes('/queries')) return 'employees';
    return 'stats';
  };

  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('admin_token');
    return (saved && saved !== 'undefined' && saved !== 'null') ? saved : null;
  });
  const [adminName, setAdminName] = useState(localStorage.getItem('admin_name') || 'Admin');
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [empSubTab, setEmpSubTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data Lists
  const [leadsConsultations, setLeadsConsultations] = useState([]);
  const [leadsQuotes, setLeadsQuotes] = useState([]);
  const [statsList, setStatsList] = useState(DEFAULT_STATS);
  const [testimonialsList, setTestimonialsList] = useState(DEFAULT_TESTIMONIALS);
  const [projectsList, setProjectsList] = useState(DEFAULT_PROJECTS);
  const [employeesList, setEmployeesList] = useState(DEFAULT_EMPLOYEES);
  const [empAttendanceList, setEmpAttendanceList] = useState([]);
  const [empLeavesList, setEmpLeavesList] = useState([]);
  const [empQueriesList, setEmpQueriesList] = useState([]);
  const [quoteCategories, setQuoteCategories] = useState([]);
  const [turnoverOptions, setTurnoverOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalEmployees: 4,
    activeEmployees: 4,
    onLeaveEmployees: 0,
    pendingRequests: 2,
    newJoiners: 1,
    pendingDocuments: 0
  });

  const [credentialsModal, setCredentialsModal] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  // ── Fetch Actions ────────────────────────────────────────────────
  const fetchAllData = () => {
    if (!token) return;

    statsApi.getAll()
      .then(res => setStatsList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : DEFAULT_STATS))
      .catch(() => setStatsList(DEFAULT_STATS));

    testimonialsApi.getAll()
      .then(res => setTestimonialsList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : DEFAULT_TESTIMONIALS))
      .catch(() => setTestimonialsList(DEFAULT_TESTIMONIALS));

    quotesApi.getAll()
      .then(res => res && res.success && setLeadsQuotes(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));

    consultationsApi.getAll()
      .then(res => res && res.success && setLeadsConsultations(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));

    projectsApi.getAll()
      .then(res => setProjectsList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : DEFAULT_PROJECTS))
      .catch(() => setProjectsList(DEFAULT_PROJECTS));

    employeesApi.getDashboardStats()
      .then(res => res && res.success && setDashboardMetrics(res.data))
      .catch(err => console.error(err));

    employeesApi.getAll()
      .then(res => setEmployeesList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : DEFAULT_EMPLOYEES))
      .catch(() => setEmployeesList(DEFAULT_EMPLOYEES));

    employeesApi.getAllQueries()
      .then(res => setEmpQueriesList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : [
        { id: 1, empId: 'INS004', subject: 'Payroll Query', description: 'Request for clarification on September salary slip calculation.', status: 'Pending', createdAt: new Date().toISOString(), employee: { name: 'Atul Mishra', email: 'info4alam@gmail.com' } }
      ]))
      .catch(err => console.error(err));

    employeesApi.getAllLeaves()
      .then(res => setEmpLeavesList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : [
        { id: 1, empId: 'INS004', leaveType: 'Casual Leave', startDate: '2026-09-10', endDate: '2026-09-11', reason: 'Personal work', status: 'Pending', createdAt: new Date().toISOString(), employee: { name: 'Atul Mishra', department: 'IT' } }
      ]))
      .catch(err => console.error(err));

    employeesApi.getAllAttendance()
      .then(res => setEmpAttendanceList(res && res.success && Array.isArray(res.data) && res.data.length > 0 ? res.data : [
        { id: 1, empId: 'INS004', date: '2026-09-05', clockIn: '09:30 AM', clockOut: '06:30 PM', workDuration: '9.0 hrs', status: 'Present', employee: { name: 'Atul Mishra', email: 'info4alam@gmail.com', department: 'IT' } },
        { id: 2, empId: 'INS001', date: '2026-09-05', clockIn: '09:15 AM', clockOut: '06:15 PM', workDuration: '9.0 hrs', status: 'Present', employee: { name: 'Rahul Sharma', email: 'rahul.sharma@inspiringinfosys.com', department: 'IT' } },
        { id: 3, empId: 'INS002', date: '2026-09-05', clockIn: '09:45 AM', clockOut: '06:45 PM', workDuration: '9.0 hrs', status: 'Present', employee: { name: 'Ananya Patel', email: 'ananya.patel@inspiringinfosys.com', department: 'E-Commerce' } }
      ]))
      .catch(err => console.error(err));

    categoriesApi.getAllAdmin()
      .then(res => {
        if (res.success && res.data) {
          setQuoteCategories(res.data);
          if (res.data.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(res.data[0].id);
          }
        }
      })
      .catch(err => console.error(err));

    turnoverApi.getAllAdmin()
      .then(res => res.success && setTurnoverOptions(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  useEffect(() => {
    const path = (location.pathname || '').toLowerCase();
    if (path.includes('/employees') || path.includes('/staff') || path.includes('/attendance') || path.includes('/leaves') || path.includes('/queries')) {
      setActiveTab('employees');
    }
  }, [location.pathname]);

  // ── Auth Handlers ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await authApi.login(loginEmail, loginPassword);
      if (res.success) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_name', res.name);
        setToken(res.token);
        setAdminName(res.name);
      } else {
        setLoginError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoginError('Could not reach backend API. Make sure Express server is running.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setToken(null);
    setAdminName('Admin');
  };

  const handleExitAdmin = () => {
    handleLogout();
    window.location.href = '/';
  };

  // Render Login Screen if not authenticated
  if (!token) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="login-header">
            <h2>Admin Panel Login</h2>
            <p>Enter email and password to access dashboard</p>
          </div>

          {loginError && <div className="login-error-msg">{loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="admin-input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@inspiringinfosys.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-orange" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard-container ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <AdminNavbar
        adminName={adminName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        handleExitAdmin={handleExitAdmin}
      />

      <div className="admin-body-layout">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          empSubTab={empSubTab}
          setEmpSubTab={setEmpSubTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          employeesList={employeesList}
          empAttendanceList={empAttendanceList}
          empQueriesList={empQueriesList}
          empLeavesList={empLeavesList}
          leadsQuotes={leadsQuotes}
          leadsConsultations={leadsConsultations}
          handleLogout={handleLogout}
          handleExitAdmin={handleExitAdmin}
        />

        <main className="admin-content-pane">
          {activeTab === 'stats' && (
            <StatsManager statsList={statsList} setStatsList={setStatsList} />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsManager testimonialsList={testimonialsList} setTestimonialsList={setTestimonialsList} />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager projectsList={projectsList} setProjectsList={setProjectsList} />
          )}

          {activeTab === 'employees' && (
            <EmployeeListTab
              employeesList={employeesList}
              dashboardMetrics={dashboardMetrics}
              empAttendanceList={empAttendanceList}
              empLeavesList={empLeavesList}
              setEmpLeavesList={setEmpLeavesList}
              empQueriesList={empQueriesList}
              setEmpQueriesList={setEmpQueriesList}
              fetchAllData={fetchAllData}
              setCredentialsModal={setCredentialsModal}
              empSubTab={empSubTab}
              setEmpSubTab={setEmpSubTab}
            />
          )}

          {activeTab === 'quotes' && (
            <QuotesInboxTab leadsQuotes={leadsQuotes} setLeadsQuotes={setLeadsQuotes} />
          )}

          {activeTab === 'consultations' && (
            <ConsultationsInboxTab leadsConsultations={leadsConsultations} setLeadsConsultations={setLeadsConsultations} />
          )}

          {activeTab === 'quoteConfig' && (
            <QuoteConfigTab
              quoteCategories={quoteCategories}
              setQuoteCategories={setQuoteCategories}
              turnoverOptions={turnoverOptions}
              setTurnoverOptions={setTurnoverOptions}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
            />
          )}

          {activeTab === 'clientServices' && (
            <ClientServicesTab />
          )}
        </main>
      </div>

      {credentialsModal && (
        <div className="admin-login-screen" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)', zIndex: 3500, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-card" style={{ maxWidth: '520px', width: '100%', background: '#ffffff', borderRadius: '20px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }}>
            <div className="admin-card-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#dcfce7', color: '#16a34a', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Employee Login Generated!</h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Share these credentials with {credentialsModal.name}</p>
                </div>
              </div>
              <button className="btn-table-action delete" onClick={() => setCredentialsModal(null)}><FiX size={18} /></button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Employee Name:</span>
                  <strong style={{ color: '#0f172a' }}>{credentialsModal.name} ({credentialsModal.empId})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: '500' }}>Portal Login URL:</span>
                  <span style={{ color: '#2563eb', fontWeight: '600', fontSize: '0.825rem' }}>{window.location.origin}/employee/login</span>
                </div>
                <div style={{ height: '1px', background: '#cbd5e1', margin: '0.25rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOGIN EMAIL</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{credentialsModal.email}</strong>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsModal.email);
                      setCopyFeedback('Email copied!');
                      setTimeout(() => setCopyFeedback(''), 2000);
                    }}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiCopy size={13} /> Copy
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOGIN PASSWORD</span>
                    <strong style={{ fontSize: '1.05rem', color: '#dc2626', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{credentialsModal.password}</strong>
                  </div>
                  <button
                    onClick={() => {
                      if (credentialsModal.password && !credentialsModal.password.includes('••••')) {
                        navigator.clipboard.writeText(credentialsModal.password);
                        setCopyFeedback('Password copied!');
                      } else {
                        setCopyFeedback('Password preset by Admin.');
                      }
                      setTimeout(() => setCopyFeedback(''), 2000);
                    }}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.35rem 0.65rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <FiCopy size={13} /> Copy
                  </button>
                </div>
              </div>
            </div>

            {copyFeedback && (
              <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                ✓ {copyFeedback}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-orange"
                style={{ flex: 1, justifyContent: 'center', padding: '0.65rem' }}
                onClick={() => {
                  const message = `Hello ${credentialsModal.name},\n\nYour Employee Portal account has been created for Inspiring Infosys.\n\nPortal URL: ${window.location.origin}/employee/login\nEmp ID: ${credentialsModal.empId}\nLogin Email: ${credentialsModal.email}\nPassword: ${credentialsModal.password}\n\nPlease log in to punch attendance, view salary slips, and complete your ID card details.`;
                  navigator.clipboard.writeText(message);
                  setCopyFeedback('Full WhatsApp / Email message copied to clipboard!');
                  setTimeout(() => setCopyFeedback(''), 2500);
                }}
              >
                <FiShare2 size={16} /> Copy WhatsApp / Email Msg
              </button>
              <button
                type="button"
                className="btn-gray"
                onClick={() => setCredentialsModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
