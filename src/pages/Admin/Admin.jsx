import React, { useState, useEffect, useRef } from 'react';
import {
  FiTrendingUp, FiUsers, FiMessageSquare, FiFileText, FiSettings,
  FiLogOut, FiEdit2, FiTrash2, FiPlus, FiX, FiCheckCircle, FiEye, FiEyeOff,
  FiMenu
} from 'react-icons/fi';
import {
  authApi, statsApi, testimonialsApi, projectsApi, quotesApi, consultationsApi, categoriesApi, turnoverApi, employeesApi
} from '../../api/api';
import './Admin.css';

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [adminName, setAdminName] = useState(localStorage.getItem('admin_name') || 'Admin');
  const [activeTab, setActiveTab] = useState('stats'); // Default to Stats like Screenshot 1
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuTimeoutRef = useRef(null);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dynamic Data Lists
  const [leadsConsultations, setLeadsConsultations] = useState([]);
  const [leadsQuotes, setLeadsQuotes] = useState([]);
  const [statsList, setStatsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [quoteCategories, setQuoteCategories] = useState([]);
  const [turnoverOptions, setTurnoverOptions] = useState([]);

  // Editing States (Inline)
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields State
  const [statForm, setStatForm] = useState({ label: '', value: '', suffix: '+', sortOrder: 0, isActive: true });
  const [testiForm, setTestiForm] = useState({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
  const [projForm, setProjForm] = useState({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
  const [catForm, setCatForm] = useState({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: 0, isActive: true });
  const [turnoverForm, setTurnoverForm] = useState({ label: '', sortOrder: 1, isActive: true });
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', service: '', companyName: '', turnover: '', businessDesc: '', message: '', status: 'new' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', joinDate: '' });

  // Specific Filing Option Add Form (inline under Get Quote Config)
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [filingFormName, setFilingFormName] = useState('');
  const [filingFormOrder, setFilingFormOrder] = useState(1);

  // Turnover Option editing (inline under Get Quote Config, Step 3 setup)
  const [editingTurnoverId, setEditingTurnoverId] = useState(null);
  const isEditingTurnover = editingTurnoverId !== null;

  // ── Fetch Actions ────────────────────────────────────────────────
  const fetchAllData = () => {
    if (!token) return;

    // Load stats
    statsApi.getAll()
      .then(res => res.success && setStatsList(res.data))
      .catch(err => console.error(err));

    // Load testimonials
    testimonialsApi.getAll()
      .then(res => res.success && setTestimonialsList(res.data))
      .catch(err => console.error(err));

    // Load quotes leads inbox
    quotesApi.getAll()
      .then(res => res.success && setLeadsQuotes(res.data))
      .catch(err => console.error(err));

    // Load consultations inbox
    consultationsApi.getAll()
      .then(res => res.success && setLeadsConsultations(res.data))
      .catch(err => console.error(err));

    // Load projects
    projectsApi.getAll()
      .then(res => res.success && setProjectsList(res.data))
      .catch(err => console.error(err));

    // Load employees
    employeesApi.getAll()
      .then(res => res.success && setEmployeesList(res.data))
      .catch(err => console.error(err));

    // Load quote setup categories & filings
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

    // Load turnover options (Get Quote Step 3)
    turnoverApi.getAllAdmin()
      .then(res => res.success && setTurnoverOptions(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

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

  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
      userMenuTimeoutRef.current = null;
    }
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current);
      }
    };
  }, []);

  // ── Stats CMS Operations (Inline Form) ───────────────────────────
  const startEditStat = (stat) => {
    setEditingId(stat.id);
    setIsEditing(true);
    setStatForm({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      sortOrder: stat.sortOrder,
      isActive: stat.isActive ?? true
    });
  };

  const cancelStatEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setStatForm({ label: '', value: '', suffix: '+', sortOrder: statsList.length + 1, isActive: true });
  };

  const handleStatFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await statsApi.update(editingId, statForm);
        if (res.success) {
          setStatsList(prev => prev.map(item => item.id === editingId ? res.data : item).sort((a, b) => a.sortOrder - b.sortOrder));
          cancelStatEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      } else {
        const res = await statsApi.create(statForm);
        if (res.success) {
          setStatsList(prev => [...prev, res.data].sort((a, b) => a.sortOrder - b.sortOrder));
          setStatForm({ label: '', value: '', suffix: '+', sortOrder: statsList.length + 2, isActive: true });
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    try {
      const res = await statsApi.delete(id);
      if (res.success) {
        setStatsList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ── Testimonials CMS Operations (Inline Form) ─────────────────────
  const startEditTesti = (testi) => {
    setEditingId(testi.id);
    setIsEditing(true);
    setTestiForm({
      name: testi.name,
      text: testi.text,
      rating: testi.rating,
      timeAgo: testi.timeAgo,
      initials: testi.initials,
      isActive: testi.isActive ?? true
    });
  };

  const cancelTestiEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setTestiForm({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
  };

  const handleTestiFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await testimonialsApi.update(editingId, testiForm);
        if (res.success) {
          setTestimonialsList(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelTestiEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      } else {
        const res = await testimonialsApi.create(testiForm);
        if (res.success) {
          setTestimonialsList(prev => [...prev, res.data]);
          setTestiForm({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDeleteTesti = async (id) => {
    if (!window.confirm('Delete this testimonial review?')) return;
    try {
      const res = await testimonialsApi.delete(id);
      if (res.success) {
        setTestimonialsList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ── Portfolio Projects CMS Operations (Inline Form) ───────────────
  const startEditProj = (proj) => {
    setEditingId(proj.id);
    setIsEditing(true);
    setProjForm({
      title: proj.title,
      category: proj.category,
      imgUrl: proj.imgUrl,
      link: proj.link,
      description: proj.description,
      isActive: proj.isActive ?? true
    });
  };

  const cancelProjEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setProjForm({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
  };

  const handleProjFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await projectsApi.update(editingId, projForm);
        if (res.success) {
          setProjectsList(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelProjEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      } else {
        const res = await projectsApi.create(projForm);
        if (res.success) {
          setProjectsList(prev => [...prev, res.data]);
          setProjForm({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDeleteProj = async (id) => {
    if (!window.confirm('Delete this showcase project?')) return;
    try {
      const res = await projectsApi.delete(id);
      if (res.success) {
        setProjectsList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ── Lead Operations (Inbox List Update & Deletes) ───────────────
  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const res = await consultationsApi.updateStatus(id, status);
      if (res.success) {
        setLeadsConsultations(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      } else {
        alert(res.message || 'Status update failed');
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Delete this consultation submission?')) return;
    try {
      const res = await consultationsApi.delete(id);
      if (res.success) {
        setLeadsConsultations(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const handleUpdateQuoteStatus = async (id, status) => {
    try {
      const res = await quotesApi.updateStatus(id, status);
      if (res.success) {
        setLeadsQuotes(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      } else {
        alert(res.message || 'Status update failed');
      }
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Delete this quote estimate request?')) return;
    try {
      const res = await quotesApi.delete(id);
      if (res.success) {
        setLeadsQuotes(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const startEditQuote = (quote) => {
    setEditingId(quote.id);
    setIsEditing(true);
    setQuoteForm({
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      service: quote.service,
      companyName: quote.companyName || '',
      turnover: quote.turnover || '',
      businessDesc: quote.businessDesc || '',
      message: quote.message || '',
      status: quote.status
    });
  };

  const cancelQuoteEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setQuoteForm({ name: '', email: '', phone: '', service: '', companyName: '', turnover: '', businessDesc: '', message: '', status: 'new' });
  };

  const handleQuoteFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await quotesApi.update(editingId, quoteForm);
        if (res.success) {
          setLeadsQuotes(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelQuoteEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  // ── Service Categories & Filings CMS (Inline Form) ────────────────
  const startEditCategory = (cat) => {
    setEditingId(cat.id);
    setIsEditing(true);
    setCatForm({
      id: cat.id,
      title: cat.title,
      desc: cat.desc,
      iconName: cat.iconName,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive ?? true
    });
  };

  const cancelCatEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setCatForm({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: quoteCategories.length + 1, isActive: true });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await categoriesApi.updateCategory(editingId, catForm);
        if (res.success) {
          setQuoteCategories(prev => prev.map(item => item.id === editingId ? { ...res.data, filings: item.filings } : item).sort((a, b) => a.sortOrder - b.sortOrder));
          cancelCatEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      } else {
        const res = await categoriesApi.createCategory(catForm);
        if (res.success) {
          setQuoteCategories(prev => [...prev, { ...res.data, filings: [] }].sort((a, b) => a.sortOrder - b.sortOrder));
          setCatForm({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: quoteCategories.length + 2, isActive: true });
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed. Check if Key ID is unique.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all specific filings inside it?')) return;
    try {
      const res = await categoriesApi.deleteCategory(id);
      if (res.success) {
        setQuoteCategories(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ── Turnover Options CMS Operations (Inline Form) ─────────────────
  const startEditTurnover = (opt) => {
    setEditingTurnoverId(opt.id);
    setTurnoverForm({ label: opt.label, sortOrder: opt.sortOrder, isActive: opt.isActive ?? true });
  };

  const cancelTurnoverEdit = () => {
    setEditingTurnoverId(null);
    setTurnoverForm({ label: '', sortOrder: turnoverOptions.length + 1, isActive: true });
  };

  const handleTurnoverSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingTurnover) {
        const res = await turnoverApi.update(editingTurnoverId, turnoverForm);
        if (res.success) {
          setTurnoverOptions(prev => prev.map(item => item.id === editingTurnoverId ? res.data : item).sort((a, b) => a.sortOrder - b.sortOrder));
          cancelTurnoverEdit();
        } else {
          alert(res.message || 'Operation failed');
        }
      } else {
        const res = await turnoverApi.create(turnoverForm);
        if (res.success) {
          setTurnoverOptions(prev => [...prev, res.data].sort((a, b) => a.sortOrder - b.sortOrder));
          setTurnoverForm({ label: '', sortOrder: turnoverOptions.length + 2, isActive: true });
        } else {
          alert(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleDeleteTurnover = async (id) => {
    if (!window.confirm('Delete this turnover option?')) return;
    try {
      const res = await turnoverApi.delete(id);
      if (res.success) {
        setTurnoverOptions(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // Specific filings options list handlers
  const handleAddFilingSubmit = async (e) => {
    e.preventDefault();
    if (!filingFormName.trim()) return;

    try {
      const res = await categoriesApi.createFiling({
        categoryId: selectedCategoryId,
        name: filingFormName,
        sortOrder: parseInt(filingFormOrder)
      });
      if (res.success) {
        setQuoteCategories(prev => prev.map(cat => {
          if (cat.id === selectedCategoryId) {
            return { ...cat, filings: [...(cat.filings || []), res.data].sort((a, b) => a.sortOrder - b.sortOrder) };
          }
          return cat;
        }));
        setFilingFormName('');
        setFilingFormOrder(prev => parseInt(prev) + 1);
      } else {
        alert(res.message || 'Could not add service option');
      }
    } catch (err) {
      alert('Could not add service option');
    }
  };

  const handleDeleteFiling = async (id, catId) => {
    if (!window.confirm('Delete this service option?')) return;
    try {
      const res = await categoriesApi.deleteFiling(id);
      if (res.success) {
        setQuoteCategories(prev => prev.map(cat => {
          if (cat.id === catId) {
            return { ...cat, filings: (cat.filings || []).filter(f => f.id !== id) };
          }
          return cat;
        }));
      } else {
        alert(res.message || 'Could not delete option');
      }
    } catch (err) {
      alert('Could not delete option');
    }
  };

  // ── Employee Operations ───────────────────────────────────────────
  const startEditEmployee = (emp) => {
    setEditingId(emp.id);
    setIsEditing(true);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      joinDate: emp.joinDate ? new Date(emp.joinDate).toISOString().split('T')[0] : ''
    });
  };

  const cancelEmployeeEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setEmployeeForm({ name: '', email: '', joinDate: '' });
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await employeesApi.update(editingId, employeeForm);
        if (res.success) {
          setEmployeesList(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelEmployeeEdit();
        } else {
          alert(res.message || 'Failed to update employee');
        }
      } else {
        const res = await employeesApi.create(employeeForm);
        if (res.success) {
          setEmployeeForm({ name: '', email: '', joinDate: '' });
          fetchAllData();
        } else {
          alert(res.message || 'Failed to create employee');
        }
      }
    } catch (error) {
      console.error('[EMPLOYEE FORM]', error);
      alert('Server error');
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      const res = await employeesApi.delete(id);
      if (res.success) {
        setEmployeesList(prev => prev.filter(item => item.id !== id));
      } else {
        alert(res.message || 'Deletion failed');
      }
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ── Render Login Screen if not authenticated ────────────────────
  if (!token) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="login-header">
            <img src="/img/logo.webp" alt="Inspiring Infosys" className="login-logo" onError={(e) => e.target.style.display = 'none'} decoding="async" />
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

  // Active category filings lookups
  const activeCategoryObj = quoteCategories.find(c => c.id === selectedCategoryId);

  return (
    <div className="admin-dashboard-wrapper">

      {/* ── Full Top Navbar ── */}
      <header className="admin-top-navbar">
        <div className="admin-top-navbar-left">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <button
            type="button"
            className="admin-logo-btn"
            onClick={() => {
              const pane = document.querySelector('.admin-content-pane');
              if (pane) pane.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Back to top"
            aria-label="Scroll to top"
          >
            <img
              src="/images/logo2.webp"
              alt="Inspiring Infosys Logo"
              className="admin-top-logo"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
        <div className="admin-top-navbar-right">
          {/* Hover dropdown for user menu */}
          <div className="admin-user-menu" onMouseEnter={handleUserMenuEnter} onMouseLeave={handleUserMenuLeave}>
            <div className="admin-user-trigger">
              <div className="admin-top-avatar">
                {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="admin-top-name">{adminName}</span>
            </div>
            {/* Dropdown card */}
            <div className={`admin-user-dropdown ${isUserMenuOpen ? 'open' : ''}`}>
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

      <div className="admin-dashboard-container">

        {/* Overlay backdrop to close sidebar on mobile when clicked outside */}
        {isSidebarOpen && (
          <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* ── Left Sidebar Panel ── */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
          </div>

          <nav className="admin-sidebar-menu">
            <button
              className={`admin-sidebar-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => { setActiveTab('stats'); cancelStatEdit(); cancelQuoteEdit(); setIsSidebarOpen(false); }}
            >
              <FiTrendingUp size={16} /> Stats
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => { setActiveTab('testimonials'); cancelTestiEdit(); cancelQuoteEdit(); setIsSidebarOpen(false); }}
            >
              <FiUsers size={16} /> Testimonials
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); cancelProjEdit(); cancelQuoteEdit(); setIsSidebarOpen(false); }}
            >
              <FiFileText size={16} /> Portfolio CMS
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => { setActiveTab('employees'); cancelEmployeeEdit(); setIsSidebarOpen(false); }}
            >
              <FiUsers size={16} /> Employees
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'quotes' ? 'active' : ''}`}
              onClick={() => { setActiveTab('quotes'); cancelQuoteEdit(); setIsSidebarOpen(false); }}
            >
              <FiMessageSquare size={16} /> Quotes
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'consultations' ? 'active' : ''}`}
              onClick={() => { setActiveTab('consultations'); cancelQuoteEdit(); setIsSidebarOpen(false); }}
            >
              <FiMessageSquare size={16} /> Consultations
            </button>
            <button
              className={`admin-sidebar-btn ${activeTab === 'quoteConfig' ? 'active' : ''}`}
              onClick={() => { setActiveTab('quoteConfig'); cancelCatEdit(); cancelQuoteEdit(); cancelTurnoverEdit(); setIsSidebarOpen(false); }}
            >
              <FiSettings size={16} /> Get Quote Config
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-exit-btn" onClick={() => { handleExitAdmin(); setIsSidebarOpen(false); }}>
              <FiLogOut size={16} /> Exit Admin
            </button>
          </div>
        </aside>

        {/* ── Right Content Area ── */}
        <main className="admin-content-pane">

          {/* ─── Stats CMS Section ─── */}
          {activeTab === 'stats' && (
            <div className="admin-stats-tab-pane">
              <div className="admin-content-header">
                <h1>Manage Stats</h1>
              </div>

              {/* Inline Add/Edit Stat Form (Matches Screenshot 1 layout) */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>{isEditing ? 'Edit Stat' : 'Add New Stat'}</h2>
                </div>
                <form onSubmit={handleStatFormSubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Label</label>
                      <input
                        type="text"
                        placeholder="E.g., Company Incorporations"
                        value={statForm.label}
                        onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Value</label>
                      <input
                        type="text"
                        placeholder="E.g., 1050"
                        value={statForm.value}
                        onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Suffix (e.g., +, %)</label>
                      <input
                        type="text"
                        placeholder="+"
                        value={statForm.suffix}
                        onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Sort Order</label>
                      <input
                        type="number"
                        value={statForm.sortOrder}
                        onChange={(e) => setStatForm({ ...statForm, sortOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <label className="admin-input-group admin-input-checkbox">
                      <input
                        type="checkbox"
                        checked={statForm.isActive}
                        onChange={(e) => setStatForm({ ...statForm, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {isEditing && (
                        <button type="button" className="btn-gray" onClick={cancelStatEdit}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-orange">
                        {isEditing ? 'Update Stat' : 'Create Stat'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* List Table of Stats */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Value</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsList.map(stat => (
                      <tr key={stat.id}>
                        <td><strong>{stat.label}</strong></td>
                        <td>{stat.value}{stat.suffix}</td>
                        <td>{stat.sortOrder}</td>
                        <td>
                          <span className={`status-badge ${stat.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                            {stat.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table-action edit" onClick={() => startEditStat(stat)} title="Edit">
                              <FiEdit2 />
                            </button>
                            <button className="btn-table-action delete" onClick={() => handleDeleteStat(stat.id)} title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Testimonials CMS Section ─── */}
          {activeTab === 'testimonials' && (
            <div className="admin-testimonials-tab-pane">
              <div className="admin-content-header">
                <h1>Manage Testimonials</h1>
              </div>

              {/* Inline Add/Edit Testimonial Form */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                </div>
                <form onSubmit={handleTestiFormSubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Client Name</label>
                      <input
                        type="text"
                        placeholder="E.g., Neha Kapoor"
                        value={testiForm.name}
                        onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Initials (Avatar)</label>
                      <input
                        type="text"
                        placeholder="E.g., NK"
                        value={testiForm.initials}
                        onChange={(e) => setTestiForm({ ...testiForm, initials: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label>Comment Text</label>
                    <textarea
                      placeholder="Write client comment..."
                      rows={3}
                      value={testiForm.text}
                      onChange={(e) => setTestiForm({ ...testiForm, text: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Rating (1 to 5 Stars)</label>
                      <select
                        value={testiForm.rating}
                        onChange={(e) => setTestiForm({ ...testiForm, rating: parseInt(e.target.value) || 5 })}
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                    <div className="admin-input-group">
                      <label>Relative Time Info</label>
                      <input
                        type="text"
                        placeholder="E.g., 2 months ago"
                        value={testiForm.timeAgo}
                        onChange={(e) => setTestiForm({ ...testiForm, timeAgo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <label className="admin-input-group admin-input-checkbox">
                      <input
                        type="checkbox"
                        checked={testiForm.isActive}
                        onChange={(e) => setTestiForm({ ...testiForm, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {isEditing && (
                        <button type="button" className="btn-gray" onClick={cancelTestiEdit}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-orange">
                        {isEditing ? 'Update Review' : 'Create Review'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* List Table of Testimonials */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Initials</th>
                      <th>Rating</th>
                      <th>Review Content</th>
                      <th>Relative Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonialsList.map(testi => (
                      <tr key={testi.id}>
                        <td><strong>{testi.name}</strong></td>
                        <td><span className="filing-tag-pill">{testi.initials}</span></td>
                        <td style={{ color: '#fbbf24', fontWeight: '800' }}>{'★'.repeat(testi.rating)}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{testi.text}</td>
                        <td>{testi.timeAgo}</td>
                        <td>
                          <span className={`status-badge ${testi.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                            {testi.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table-action edit" onClick={() => startEditTesti(testi)} title="Edit">
                              <FiEdit2 />
                            </button>
                            <button className="btn-table-action delete" onClick={() => handleDeleteTesti(testi.id)} title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Portfolio Projects CMS Section ─── */}
          {activeTab === 'projects' && (
            <div className="admin-projects-tab-pane">
              <div className="admin-content-header">
                <h1>Portfolio Showcase Projects</h1>
              </div>

              {/* Inline Add/Edit Project Form */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>{isEditing ? 'Edit Project' : 'Add New Showcase Project'}</h2>
                </div>
                <form onSubmit={handleProjFormSubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Project Title</label>
                      <input
                        type="text"
                        placeholder="E.g., Spartan Nutrition"
                        value={projForm.title}
                        onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Category</label>
                      <select
                        value={projForm.category}
                        onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                      >
                        <option value="Websites">Websites</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Software">Software</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Image URL Path</label>
                      <input
                        type="text"
                        placeholder="E.g., /img/web-spartan.webp"
                        value={projForm.imgUrl}
                        onChange={(e) => setProjForm({ ...projForm, imgUrl: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>External Website Link</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={projForm.link}
                        onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label>Showcase Description</label>
                    <textarea
                      placeholder="Provide short explanation of project concept..."
                      rows={2}
                      value={projForm.description}
                      onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <label className="admin-input-group admin-input-checkbox">
                      <input
                        type="checkbox"
                        checked={projForm.isActive}
                        onChange={(e) => setProjForm({ ...projForm, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {isEditing && (
                        <button type="button" className="btn-gray" onClick={cancelProjEdit}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-orange">
                        {isEditing ? 'Update Project' : 'Create Project'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* List Table of Projects */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Category</th>
                      <th>Image Source</th>
                      <th>Link</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsList.map(proj => (
                      <tr key={proj.id}>
                        <td><strong>{proj.title}</strong></td>
                        <td><span className="status-badge status-progress">{proj.category}</span></td>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{proj.imgUrl}</td>
                        <td>{proj.link ? <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '700' }}>Visit Link</a> : 'None'}</td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{proj.description}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-table-action edit" onClick={() => startEditProj(proj)} title="Edit">
                              <FiEdit2 />
                            </button>
                            <button className="btn-table-action delete" onClick={() => handleDeleteProj(proj.id)} title="Delete">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Employees Management Section ─── */}
          {activeTab === 'employees' && (
            <div className="admin-projects-tab-pane">
              <div className="admin-content-header">
                <h1>Manage Employees</h1>
              </div>

              {/* Add/Edit Employee Form */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
                </div>
                <form onSubmit={handleEmployeeFormSubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="E.g., Rahul Sharma"
                        value={employeeForm.name}
                        onChange={handleEmployeeChange}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="E.g., rahul@company.com"
                        value={employeeForm.email}
                        onChange={handleEmployeeChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label>Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={employeeForm.joinDate}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.75rem' }}>
                    {isEditing && (
                      <button type="button" className="btn-gray" onClick={cancelEmployeeEdit}>
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn-orange">
                      {isEditing ? 'Update Employee' : <><FiPlus size={15} /> Add Employee</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Employee List Table */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesList.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No employees found.
                        </td>
                      </tr>
                    ) : (
                      employeesList.map(employee => (
                        <tr key={employee.id}>
                          <td>{employee.id}</td>
                          <td><strong>{employee.name}</strong></td>
                          <td>{employee.email}</td>
                          <td>{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : '-'}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-table-action edit" onClick={() => startEditEmployee(employee)} title="Edit">
                                <FiEdit2 />
                              </button>
                              <button className="btn-table-action delete" onClick={() => handleDeleteEmployee(employee.id)} title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Quotes Leads Inbox Section ─── */}
          {activeTab === 'quotes' && (
            <div className="admin-quotes-tab-pane">
              <div className="admin-content-header">
                <h1>Get a Quote Inquiries</h1>
              </div>

              {/* Edit Quote Form (when isEditing is true) */}
              {isEditing && (
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Edit Quote Inquiry Details</h2>
                  </div>
                  <form onSubmit={handleQuoteFormSubmit} className="login-form">
                    <div className="form-grid form-grid-2">
                      <div className="admin-input-group">
                        <label>Client Name</label>
                        <input
                          type="text"
                          value={quoteForm.name}
                          onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Requested Services</label>
                        <input
                          type="text"
                          value={quoteForm.service}
                          onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid form-grid-2">
                      <div className="admin-input-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid form-grid-3">
                      <div className="admin-input-group">
                        <label>Company / Brand Name</label>
                        <input
                          type="text"
                          value={quoteForm.companyName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Estimated Annual Turnover</label>
                        <select
                          value={quoteForm.turnover}
                          onChange={(e) => setQuoteForm({ ...quoteForm, turnover: e.target.value })}
                        >
                          <option value="">Select Turnover...</option>
                          <option value="Below ₹10 Lakhs">Below ₹10 Lakhs</option>
                          <option value="₹10L to ₹40 Lakhs">₹10L to ₹40 Lakhs</option>
                          <option value="Above ₹40 Lakhs">Above ₹40 Lakhs</option>
                        </select>
                      </div>
                      <div className="admin-input-group">
                        <label>Lead Status</label>
                        <select
                          value={quoteForm.status}
                          onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-input-group">
                      <label>Business Description / Concept</label>
                      <textarea
                        rows={3}
                        value={quoteForm.businessDesc}
                        onChange={(e) => setQuoteForm({ ...quoteForm, businessDesc: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button type="button" className="btn-gray" onClick={cancelQuoteEdit}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-orange">
                        Update Inquiry Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact Info</th>
                      <th>Requested Services</th>
                      <th>Business Profile Details</th>
                      <th>Submit Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsQuotes.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No quote inquiries found.
                        </td>
                      </tr>
                    ) : (
                      leadsQuotes.map(lead => (
                        <tr key={lead.id}>
                          <td><strong>{lead.name}</strong></td>
                          <td>
                            <div style={{ fontSize: '0.82rem' }}>
                              <div><a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>{lead.email}</a></div>
                              <div style={{ color: '#64748b', marginTop: '0.2rem' }}>{lead.phone}</div>
                            </div>
                          </td>
                          <td>
                            <span className="status-badge status-done" style={{ fontSize: '0.72rem' }}>
                              {lead.service}
                            </span>
                          </td>
                          <td style={{ maxWidth: '280px', whiteSpace: 'normal', fontSize: '0.82rem', lineHeight: '1.4' }}>
                            {lead.companyName && <div><strong>Company:</strong> {lead.companyName}</div>}
                            {lead.turnover && <div><strong>Turnover:</strong> {lead.turnover}</div>}
                            {lead.businessDesc && <div style={{ marginTop: '0.2rem' }}><strong>Description:</strong> {lead.businessDesc}</div>}
                            {!lead.companyName && !lead.turnover && !lead.businessDesc && (
                              <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{lead.message}</div>
                            )}
                          </td>
                          <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateQuoteStatus(lead.id, e.target.value)}
                              className={`status-badge status-${lead.status}`}
                              style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-table-action edit" onClick={() => startEditQuote(lead)} title="Edit">
                                <FiEdit2 />
                              </button>
                              <button className="btn-table-action delete" onClick={() => handleDeleteQuote(lead.id)} title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Consultations Leads Inbox Section ─── */}
          {activeTab === 'consultations' && (
            <div className="admin-consultations-tab-pane">
              <div className="admin-content-header">
                <h1>Contact Form Consultations</h1>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email Address</th>
                      <th>Subject / Company</th>
                      <th>Message</th>
                      <th>Submit Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsConsultations.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No consultation inquiries found.
                        </td>
                      </tr>
                    ) : (
                      leadsConsultations.map(lead => (
                        <tr key={lead.id}>
                          <td><strong>{lead.name}</strong></td>
                          <td><a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>{lead.email}</a></td>
                          <td>{lead.company || lead.phone || 'General Inquiry'}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{lead.message}</td>
                          <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateConsultationStatus(lead.id, e.target.value)}
                              className={`status-badge status-${lead.status}`}
                              style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            >
                              <option value="new">New</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td>
                            <button className="btn-table-action delete" onClick={() => handleDeleteConsultation(lead.id)} title="Delete">
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Get Quote Config Section ─── */}
          {activeTab === 'quoteConfig' && (
            <div className="admin-quote-config-tab-pane">
              <div className="admin-content-header">
                <h1>Get Quote Config</h1>
              </div>

              {/* Category Add/Edit Inline Form */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>{isEditing ? 'Edit Services Category' : 'Add New Category (Step 1)'}</h2>
                </div>
                <form onSubmit={handleCategorySubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Unique Key ID (No spaces)</label>
                      <input
                        type="text"
                        placeholder="E.g., ecommerce"
                        value={catForm.id}
                        onChange={(e) => setCatForm({ ...catForm, id: e.target.value.toLowerCase().trim() })}
                        required
                        disabled={isEditing}
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Display Title</label>
                      <input
                        type="text"
                        placeholder="E.g., E-Commerce & Marketplaces"
                        value={catForm.title}
                        onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Feather Icon Component Name</label>
                      <select
                        value={catForm.iconName}
                        onChange={(e) => setCatForm({ ...catForm, iconName: e.target.value })}
                      >
                        <option value="FiShoppingCart">FiShoppingCart (Cart Icon)</option>
                        <option value="FiMessageCircle">FiMessageCircle (Chat Icon)</option>
                        <option value="FiCode">FiCode (Coding Tag Icon)</option>
                        <option value="FiDatabase">FiDatabase (Database Server)</option>
                        <option value="FiTrendingUp">FiTrendingUp (Trend Chart)</option>
                        <option value="FiSettings">FiSettings (Cog Gear)</option>
                      </select>
                    </div>
                    <div className="admin-input-group">
                      <label>Sort Order Index</label>
                      <input
                        type="number"
                        value={catForm.sortOrder}
                        onChange={(e) => setCatForm({ ...catForm, sortOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label>Description Subtitle</label>
                    <textarea
                      placeholder="Short description displayed under category card..."
                      rows={2}
                      value={catForm.desc}
                      onChange={(e) => setCatForm({ ...catForm, desc: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <label className="admin-input-group admin-input-checkbox">
                      <input
                        type="checkbox"
                        checked={catForm.isActive}
                        onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {isEditing && (
                        <button type="button" className="btn-gray" onClick={cancelCatEdit}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-orange">
                        Save Category
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* List Table of Categories */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2>Services Categories</h2>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Key ID</th>
                        <th>Category Title</th>
                        <th>Icon Class</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteCategories.map(cat => (
                        <tr key={cat.id}>
                          <td><code>{cat.id}</code></td>
                          <td><strong>{cat.title}</strong></td>
                          <td><code>{cat.iconName}</code></td>
                          <td>{cat.sortOrder}</td>
                          <td>
                            <span className={`status-badge ${cat.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                              {cat.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-table-action edit" onClick={() => startEditCategory(cat)} title="Edit">
                                <FiEdit2 />
                              </button>
                              <button className="btn-table-action delete" onClick={() => handleDeleteCategory(cat.id)} title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Filings Checklist Options Editor (Matches reference screen split options layout) */}
              <div className="admin-card" style={{ marginTop: '3rem' }}>
                <div className="admin-card-header">
                  <h2>Manage Service Filing Checkboxes (Step 2)</h2>
                </div>

                <div className="form-grid form-grid-2" style={{ gap: '2rem', alignItems: 'start' }}>

                  {/* 1. Category selector & Add Option */}
                  <div>
                    <div className="admin-card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Add Checklist Item
                      </h3>
                      <form onSubmit={handleAddFilingSubmit} className="login-form">
                        <div className="admin-input-group">
                          <label>Select Category</label>
                          <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                          >
                            {quoteCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="admin-input-group">
                          <label>Filing Service Name</label>
                          <input
                            type="text"
                            placeholder="E.g., Connect WhatsApp API"
                            value={filingFormName}
                            onChange={(e) => setFilingFormName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="admin-input-group">
                          <label>Order Index</label>
                          <input
                            type="number"
                            value={filingFormOrder}
                            onChange={(e) => setFilingFormOrder(parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center' }}>
                          <FiPlus /> Add Filing Option
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* 2. Visual Checkbox Options List Tag Pills */}
                  <div>
                    <div className="admin-card" style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                        {activeCategoryObj ? `${activeCategoryObj.title} Checklist` : 'Filings Options'}
                      </h3>

                      <div className="filings-list-editor">
                        {!activeCategoryObj || !activeCategoryObj.filings || activeCategoryObj.filings.length === 0 ? (
                          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#64748b' }}>
                            No services added yet for this category.
                          </p>
                        ) : (
                          activeCategoryObj.filings.map(filing => (
                            <div key={filing.id} className="filing-tag-pill">
                              <span>{filing.name}</span>
                              <button
                                className="btn-remove-tag"
                                onClick={() => handleDeleteFiling(filing.id, selectedCategoryId)}
                                title="Delete Option"
                              >
                                <FiX />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Turnover Options Editor (Step 3 — Business Profile setup) */}
              <div className="admin-card" style={{ marginTop: '3rem' }}>
                <div className="admin-card-header">
                  <h2>{isEditingTurnover ? 'Edit Turnover Option' : 'Add New Turnover Option (Step 3)'}</h2>
                </div>
                <form onSubmit={handleTurnoverSubmit} className="login-form">
                  <div className="form-grid form-grid-2">
                    <div className="admin-input-group">
                      <label>Bracket Label</label>
                      <input
                        type="text"
                        placeholder="E.g., ₹40L to ₹1 Crore"
                        value={turnoverForm.label}
                        onChange={(e) => setTurnoverForm({ ...turnoverForm, label: e.target.value })}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Sort Order</label>
                      <input
                        type="number"
                        value={turnoverForm.sortOrder}
                        onChange={(e) => setTurnoverForm({ ...turnoverForm, sortOrder: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <label className="admin-input-group admin-input-checkbox">
                      <input
                        type="checkbox"
                        checked={turnoverForm.isActive}
                        onChange={(e) => setTurnoverForm({ ...turnoverForm, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {isEditingTurnover && (
                        <button type="button" className="btn-gray" onClick={cancelTurnoverEdit}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn-orange">
                        {isEditingTurnover ? 'Update Option' : 'Save Option'}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Bracket Label</th>
                        <th>Order</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnoverOptions.map(opt => (
                        <tr key={opt.id}>
                          <td><strong>{opt.label}</strong></td>
                          <td>{opt.sortOrder}</td>
                          <td>
                            <span className={`status-badge ${opt.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                              {opt.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn-table-action edit" onClick={() => startEditTurnover(opt)} title="Edit">
                                <FiEdit2 />
                              </button>
                              <button className="btn-table-action delete" onClick={() => handleDeleteTurnover(opt.id)} title="Delete">
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default Admin;
