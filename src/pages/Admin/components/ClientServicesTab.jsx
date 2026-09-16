import React, { useState, useEffect } from 'react';
import {
  FiGlobe, FiServer, FiShield, FiTool, FiCloud, FiSearch,
  FiPlus, FiEdit, FiTrash2, FiSend, FiRefreshCw, FiCalendar,
  FiUser, FiMail, FiPhone, FiDollarSign, FiAlertTriangle,
  FiCheckCircle, FiClock, FiX, FiExternalLink
} from 'react-icons/fi';
import { clientServicesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';

export default function ClientServicesTab() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, expiredCount: 0, criticalCount: 0, expiringSoonCount: 0, activeCount: 0, totalRenewalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [sendingAlertId, setSendingAlertId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    clientName: '',
    companyName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: 'Domain Name',
    serviceName: '',
    provider: 'GoDaddy',
    purchaseDate: '',
    expiryDate: '',
    renewalAmount: '',
    autoRenew: false,
    notes: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await clientServicesApi.getAll();
      if (res && res.success) {
        setServices(res.data || []);
        if (res.metrics) setMetrics(res.metrics);
      } else {
        toast.error(res?.message || 'Failed to fetch client services');
      }
    } catch (err) {
      toast.error('Failed to load client services data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setForm({
      clientName: '',
      companyName: '',
      clientEmail: '',
      clientPhone: '',
      serviceType: 'Domain Name',
      serviceName: '',
      provider: 'GoDaddy',
      purchaseDate: '',
      expiryDate: '',
      renewalAmount: '',
      autoRenew: false,
      notes: ''
    });
    setEditingService(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setForm({
      clientName: service.clientName || '',
      companyName: service.companyName || '',
      clientEmail: service.clientEmail || '',
      clientPhone: service.clientPhone || '',
      serviceType: service.serviceType || 'Domain Name',
      serviceName: service.serviceName || '',
      provider: service.provider || 'GoDaddy',
      purchaseDate: service.purchaseDate ? new Date(service.purchaseDate).toISOString().split('T')[0] : '',
      expiryDate: service.expiryDate ? new Date(service.expiryDate).toISOString().split('T')[0] : '',
      renewalAmount: service.renewalAmount || '',
      autoRenew: Boolean(service.autoRenew),
      notes: service.notes || ''
    });
    setShowModal(true);
  };

  // Auto-Lookup Domain & SSL expiry
  const handleAutoLookupDomain = async () => {
    if (!form.serviceName.trim()) {
      toast.warning('Please enter a domain name first (e.g. clientwebsite.com)');
      return;
    }
    setLookingUp(true);
    try {
      const res = await clientServicesApi.autoLookup(form.serviceName);
      if (res && res.success) {
        if (res.expiryDate) {
          setForm(prev => ({
            ...prev,
            serviceName: res.serviceName || prev.serviceName,
            expiryDate: res.expiryDate,
            provider: res.provider !== 'GoDaddy' ? res.provider : prev.provider
          }));
          toast.success(`Auto-detected expiry date: ${res.expiryDate} (${res.daysLeft || 0} days remaining)`);
        } else {
          toast.info('Could not auto-detect WHOIS expiry date. Please select manually.');
        }
      } else {
        toast.error(res?.message || 'Domain lookup failed');
      }
    } catch (err) {
      toast.error('Domain WHOIS lookup failed');
    } finally {
      setLookingUp(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!form.clientName || !form.clientEmail || !form.serviceName || !form.expiryDate) {
      toast.warning('Please fill in Client Name, Client Email, Service Name, and Expiry Date.');
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (editingService) {
        res = await clientServicesApi.update(editingService.id, form);
      } else {
        res = await clientServicesApi.create(form);
      }

      if (res && res.success) {
        toast.success(res.message || 'Client service saved successfully!');
        setShowModal(false);
        resetForm();
        fetchServices();
      } else {
        toast.error(res?.message || 'Failed to save client service');
      }
    } catch (err) {
      toast.error('Failed to save client service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client service record?')) return;
    try {
      const res = await clientServicesApi.delete(id);
      if (res && res.success) {
        toast.success('Client service record deleted!');
        fetchServices();
      } else {
        toast.error(res?.message || 'Failed to delete record');
      }
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  // Trigger Expiry Warning Email to Client & Admin
  const handleSendRenewalAlert = async (service) => {
    if (!window.confirm(`Send Renewal Expiry Alert Email to ${service.clientName} (${service.clientEmail}) and Admin?`)) return;
    setSendingAlertId(service.id);
    try {
      const res = await clientServicesApi.sendAlert(service.id);
      if (res && res.success) {
        toast.success(`Expiry alert email sent successfully to ${service.clientEmail} & Admin!`);
        fetchServices();
      } else {
        toast.error(res?.message || 'Failed to send alert email');
      }
    } catch (err) {
      toast.error('Failed to send alert email');
    } finally {
      setSendingAlertId(null);
    }
  };

  // Filtered Services List
  const filteredServices = services.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = (s.clientName || '').toLowerCase().includes(q);
      const matchCompany = (s.companyName || '').toLowerCase().includes(q);
      const matchEmail = (s.clientEmail || '').toLowerCase().includes(q);
      const matchService = (s.serviceName || '').toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchEmail && !matchService) return false;
    }

    if (categoryFilter !== 'All' && s.serviceType !== categoryFilter) return false;
    if (providerFilter !== 'All' && s.provider !== providerFilter) return false;

    if (statusFilter !== 'All') {
      if (statusFilter === 'Expired' && s.daysLeft > 0) return false;
      if (statusFilter === 'Expiring Soon' && (s.daysLeft <= 0 || s.daysLeft > 30)) return false;
      if (statusFilter === 'Active' && s.daysLeft <= 30) return false;
    }

    return true;
  });

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'Domain Name': return <FiGlobe style={{ color: '#0284c7' }} />;
      case 'Web Hosting': return <FiServer style={{ color: '#16a34a' }} />;
      case 'SSL Certificate': return <FiShield style={{ color: '#6366f1' }} />;
      case 'AMC / Maintenance': return <FiTool style={{ color: '#f97316' }} />;
      case 'Cloud Server': return <FiCloud style={{ color: '#8b5cf6' }} />;
      default: return <FiGlobe style={{ color: '#64748b' }} />;
    }
  };

  const formatDateDisplay = (dateVal) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '-';
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return String(dateVal);
    }
  };

  return (
    <div className="admin-client-services-pane">
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: '1 1 320px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiGlobe style={{ color: '#0284c7' }} /> Client Services & Domain Renewal Tracker
          </h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.86rem' }}>
            Track client domains, web hosting, SSL certificates & AMC renewals with automated <strong>Client & Admin Email Expiry Alerts</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          <button
            type="button"
            className="btn-orange"
            onClick={handleOpenAddModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
          >
            <FiPlus size={16} /> Add Client Service
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Services</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{metrics.total}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #fee2e2' }}>
          <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>Expired / Critical</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#dc2626', margin: '0.2rem 0 0' }}>{metrics.expiredCount + metrics.criticalCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #ffedd5' }}>
          <span style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: '700', textTransform: 'uppercase' }}>Expiring In 30 Days</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ea580c', margin: '0.2rem 0 0' }}>{metrics.expiringSoonCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #dcfce7' }}>
          <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Active & Healthy</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a', margin: '0.2rem 0 0' }}>{metrics.activeCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
          <span style={{ fontSize: '0.72rem', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase' }}>Renewal Revenue</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7', margin: '0.2rem 0 0' }}>₹{metrics.totalRenewalRevenue.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#fff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
        <div style={{ flex: '2 1 200px', display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <FiSearch style={{ color: '#64748b', marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Search Client, Domain, Email or Company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: '#0f172a' }}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ flex: '1 1 130px', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a', background: '#f8fafc', fontWeight: '600' }}
        >
          <option value="All">All Service Types</option>
          <option value="Domain Name">Domain Name</option>
          <option value="Web Hosting">Web Hosting</option>
          <option value="SSL Certificate">SSL Certificate</option>
          <option value="AMC / Maintenance">AMC / Maintenance</option>
          <option value="Cloud Server">Cloud Server</option>
          <option value="SEO & Marketing">SEO & Marketing</option>
          <option value="Custom IT Service">Custom IT Service</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ flex: '1 1 130px', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0f172a', background: '#f8fafc', fontWeight: '600' }}
        >
          <option value="All">All Statuses</option>
          <option value="Expired">🔴 Expired</option>
          <option value="Expiring Soon">🟠 Expiring Soon (30 Days)</option>
          <option value="Active">🟢 Active & Healthy</option>
        </select>

        <button
          type="button"
          onClick={fetchServices}
          style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#334155', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Services Table */}
      <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client & Company</th>
                <th>Service Name & Type</th>
                <th>Provider</th>
                <th>Expiry Date</th>
                <th>Renewal Status</th>
                <th>Cost (₹)</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    <FiGlobe size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontWeight: '600' }}>No client service records found.</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map(s => {
                  const daysLeft = s.daysLeft;
                  const isExpired = daysLeft !== null && daysLeft <= 0;
                  const isCritical = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
                  const isWarning = daysLeft !== null && daysLeft > 7 && daysLeft <= 30;

                  return (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.clientName}</strong>
                        {s.companyName && <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>{s.companyName}</span>}
                        <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '2px' }}>
                          <FiMail size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                          {s.clientEmail}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: '#0f172a' }}>
                          {getServiceTypeIcon(s.serviceType)}
                          {s.serviceName}
                          {s.serviceType === 'Domain Name' && (
                            <a href={`https://${s.serviceName}`} target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>
                              <FiExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '2px' }}>{s.serviceType}</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: '600', color: '#334155' }}>{s.provider || 'GoDaddy'}</span>
                        {s.autoRenew && (
                          <span style={{ display: 'block', fontSize: '0.72rem', color: '#16a34a', fontWeight: '700' }}>⚡ Auto-Renew ON</span>
                        )}
                      </td>

                      <td>
                        <strong style={{ color: isExpired || isCritical ? '#dc2626' : isWarning ? '#ea580c' : '#0f172a' }}>
                          {formatDateDisplay(s.expiryDate)}
                        </strong>
                      </td>

                      <td>
                        {isExpired ? (
                          <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiAlertTriangle size={12} /> Expired ({Math.abs(daysLeft)}d ago)
                          </span>
                        ) : isCritical ? (
                          <span style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock size={12} /> Critical! {daysLeft} Days Left
                          </span>
                        ) : isWarning ? (
                          <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock size={12} /> {daysLeft} Days Left
                          </span>
                        ) : (
                          <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiCheckCircle size={12} /> Active ({daysLeft}d left)
                          </span>
                        )}
                      </td>

                      <td>
                        <strong style={{ color: '#0f172a' }}>
                          {s.renewalAmount ? `₹${Number(s.renewalAmount).toLocaleString('en-IN')}` : '-'}
                        </strong>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            type="button"
                            disabled={sendingAlertId === s.id}
                            style={{
                              padding: '0.28rem 0.55rem',
                              fontSize: '0.76rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              borderRadius: '6px',
                              border: '1px solid #0284c7',
                              background: '#f0f9ff',
                              color: '#0284c7',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSendRenewalAlert(s)}
                            title="Send Expiry Warning Email to Client & Admin"
                          >
                            <FiSend size={12} /> {sendingAlertId === s.id ? 'Sending...' : 'Send Alert Email'}
                          </button>

                          <button
                            type="button"
                            className="btn-table-action edit"
                            onClick={() => handleOpenEditModal(s)}
                            title="Edit Service Record"
                            style={{ padding: '0.28rem 0.45rem' }}
                          >
                            <FiEdit size={13} />
                          </button>

                          <button
                            type="button"
                            className="btn-table-action delete"
                            onClick={() => handleDeleteService(s.id)}
                            title="Delete Record"
                            style={{ padding: '0.28rem 0.45rem' }}
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT CLIENT SERVICE MODAL ── */}
      {showModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 3500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
          <div className="admin-modal" style={{ maxWidth: '660px', width: '100%', maxHeight: '90vh', background: '#ffffff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div>
                <h3 className="admin-modal-title" style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {editingService ? '✏️ Edit Client Service Record' : '➕ Add New Client Service'}
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Track expiration dates and configure automated email alerts for client renewals.
                </p>
              </div>
              <button type="button" className="admin-modal-close-btn" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Client Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. John Doe"
                      required
                      value={form.clientName}
                      onChange={e => setForm({ ...form, clientName: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Acme Enterprises"
                      value={form.companyName}
                      onChange={e => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Client Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="client@example.com"
                      required
                      value={form.clientEmail}
                      onChange={e => setForm({ ...form, clientEmail: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Client Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={form.clientPhone}
                      onChange={e => setForm({ ...form, clientPhone: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Service Type *</label>
                    <select
                      className="form-control"
                      value={form.serviceType}
                      onChange={e => setForm({ ...form, serviceType: e.target.value })}
                    >
                      <option value="Domain Name">🌐 Domain Name</option>
                      <option value="Web Hosting">🖥️ Web Hosting</option>
                      <option value="SSL Certificate">🔒 SSL Certificate</option>
                      <option value="AMC / Maintenance">🛠️ AMC / Maintenance</option>
                      <option value="Cloud Server">☁️ Cloud Server (AWS/DigitalOcean)</option>
                      <option value="SEO & Marketing">📈 SEO & Marketing Retainer</option>
                      <option value="Custom IT Service">💻 Custom IT Service</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Service / Domain Name *</label>
                      <button
                        type="button"
                        disabled={lookingUp || !form.serviceName}
                        onClick={handleAutoLookupDomain}
                        style={{ border: 'none', background: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                      >
                        {lookingUp ? 'Detecting...' : '⚡ Auto WHOIS Expiry'}
                      </button>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. clientdomain.com or Annual Web AMC"
                      required
                      value={form.serviceName}
                      onChange={e => setForm({ ...form, serviceName: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Provider / Registrar</label>
                    <select
                      className="form-control"
                      value={form.provider}
                      onChange={e => setForm({ ...form, provider: e.target.value })}
                    >
                      <option value="GoDaddy">GoDaddy</option>
                      <option value="Hostinger">Hostinger</option>
                      <option value="Namecheap">Namecheap</option>
                      <option value="BigRock">BigRock</option>
                      <option value="AWS">AWS Cloud</option>
                      <option value="Cloudflare">Cloudflare</option>
                      <option value="Internal / Inspiring Infosys">Internal / Inspiring Infosys</option>
                      <option value="Other">Other Registrar</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Expiration Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={form.expiryDate}
                      onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Renewal Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 1500"
                      value={form.renewalAmount}
                      onChange={e => setForm({ ...form, renewalAmount: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>
                      <input
                        type="checkbox"
                        checked={form.autoRenew}
                        onChange={e => setForm({ ...form, autoRenew: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                      />
                      ⚡ Auto-Renew Enabled
                    </label>
                  </div>
                </div>

                <div className="form-field-group" style={{ marginTop: '0.85rem' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Notes / Service Credentials</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Additional remarks or registrar account notes..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexShrink: 0 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" disabled={submitting}>
                  {submitting ? 'Saving Record...' : editingService ? 'Update Service' : 'Save Client Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
