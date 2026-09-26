import React, { useState, useEffect, useMemo } from 'react';
import {
  FiGlobe, FiServer, FiShield, FiTool, FiCloud, FiSearch,
  FiPlus, FiEdit, FiTrash2, FiSend, FiRefreshCw, FiCalendar,
  FiUser, FiMail, FiPhone, FiDollarSign, FiAlertTriangle,
  FiCheckCircle, FiClock, FiX, FiExternalLink, FiCheckSquare
} from 'react-icons/fi';
import { clientServicesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import Modal from '../../../components/common/Modal';

export default function ClientServicesTab() {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, expiredCount: 0, criticalCount: 0, expiringSoonCount: 0, activeCount: 0, totalRenewalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm' });

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [providerFilter, setProviderFilter] = useState('All');

  // Form Panel Visibility State
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lookingUpIdx, setLookingUpIdx] = useState(null);
  const [sendingAlertId, setSendingAlertId] = useState(null);
  const [runningAutoAlerts, setRunningAutoAlerts] = useState(false);

  // Table Multi-Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Client Info State
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    companyName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });

  // Dynamic Service Rows for Multi-Service Clients
  const [serviceRows, setServiceRows] = useState([
    {
      id: 'sr-1',
      serviceType: 'Domain Name',
      serviceName: '',
      provider: 'GoDaddy',
      purchaseDate: '',
      expiryDate: '',
      renewalAmount: '',
      autoRenew: false
    }
  ]);

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
    setClientInfo({
      clientName: '',
      companyName: '',
      clientEmail: '',
      clientPhone: '',
      notes: ''
    });
    setServiceRows([
      {
        id: 'sr-1',
        serviceType: 'Domain Name',
        serviceName: '',
        provider: 'GoDaddy',
        purchaseDate: '',
        expiryDate: '',
        renewalAmount: '',
        autoRenew: false
      }
    ]);
    setEditingService(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('client-service-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleOpenEditForm = (service) => {
    setEditingService(service);
    setClientInfo({
      clientName: service.clientName || '',
      companyName: service.companyName || '',
      clientEmail: service.clientEmail || '',
      clientPhone: service.clientPhone || '',
      notes: service.notes || ''
    });
    setServiceRows([
      {
        id: `sr-${service.id}`,
        serviceType: service.serviceType || 'Domain Name',
        serviceName: service.serviceName || '',
        provider: service.provider || 'GoDaddy',
        purchaseDate: service.purchaseDate ? new Date(service.purchaseDate).toISOString().split('T')[0] : '',
        expiryDate: service.expiryDate ? new Date(service.expiryDate).toISOString().split('T')[0] : '',
        renewalAmount: service.renewalAmount || '',
        autoRenew: Boolean(service.autoRenew)
      }
    ]);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('client-service-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Service Row Actions inside Form
  const handleAddServiceRow = () => {
    setServiceRows(prev => [
      ...prev,
      {
        id: `sr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        serviceType: 'Web Hosting',
        serviceName: '',
        provider: 'GoDaddy',
        purchaseDate: '',
        expiryDate: '',
        renewalAmount: '',
        autoRenew: false
      }
    ]);
    toast.info('Added another service row for this client');
  };

  const handleRemoveServiceRow = (index) => {
    if (serviceRows.length <= 1) {
      toast.warning('At least one service is required.');
      return;
    }
    setServiceRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleServiceRowChange = (index, field, value) => {
    setServiceRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Auto-Lookup Domain & SSL expiry for a specific row
  const handleAutoLookupDomainRow = async (index) => {
    const row = serviceRows[index];
    if (!row.serviceName || !row.serviceName.trim()) {
      toast.warning('Please enter a domain name first (e.g. clientwebsite.com)');
      return;
    }
    setLookingUpIdx(index);
    try {
      const res = await clientServicesApi.autoLookup(row.serviceName);
      if (res && res.success) {
        if (res.expiryDate) {
          handleServiceRowChange(index, 'serviceName', res.serviceName || row.serviceName);
          handleServiceRowChange(index, 'expiryDate', res.expiryDate);
          if (res.provider && res.provider !== 'GoDaddy') {
            handleServiceRowChange(index, 'provider', res.provider);
          }
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
      setLookingUpIdx(null);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!clientInfo.clientName || !clientInfo.clientEmail) {
      toast.warning('Please fill in Client Name and Client Email Address.');
      return;
    }

    // Validate each service row
    for (let i = 0; i < serviceRows.length; i++) {
      const s = serviceRows[i];
      if (!s.serviceName || !s.expiryDate) {
        toast.warning(`Service #${i + 1}: Please specify Service Name and Expiration Date.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (editingService) {
        // Edit single service
        const payload = {
          ...clientInfo,
          ...serviceRows[0]
        };
        const res = await clientServicesApi.update(editingService.id, payload);
        if (res && res.success) {
          toast.success('Client service updated successfully!');
          setShowForm(false);
          resetForm();
          fetchServices();
        } else {
          toast.error(res?.message || 'Failed to update client service');
        }
      } else {
        // Create multiple services if added
        let successCount = 0;
        for (const row of serviceRows) {
          const payload = {
            ...clientInfo,
            ...row
          };
          const res = await clientServicesApi.create(payload);
          if (res && res.success) {
            successCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully saved ${successCount} service(s) for ${clientInfo.clientName}!`);
          setShowForm(false);
          resetForm();
          fetchServices();
        } else {
          toast.error('Failed to save client services');
        }
      }
    } catch (err) {
      toast.error('Failed to save client service record(s)');
    } finally {
      setSubmitting(false);
    }
  };

  // Table Row Checkbox Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredServices.length && filteredServices.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredServices.map(s => s.id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Action: Delete Selected Services
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: `Delete ${selectedIds.length} Client Service(s)`,
      message: `Are you sure you want to delete ${selectedIds.length} selected client service records? This action cannot be undone.`,
      confirmText: `Yes, Delete ${selectedIds.length} Services`,
      onConfirm: async () => {
        try {
          let count = 0;
          for (const id of selectedIds) {
            const res = await clientServicesApi.delete(id);
            if (res && res.success) count++;
          }
          toast.success(`Successfully deleted ${count} service record(s)!`);
          setSelectedIds([]);
          fetchServices();
        } catch (err) {
          toast.error('Failed to delete selected records');
        }
      }
    });
  };

  // Bulk Action: Send Alert Emails to Selected Services
  const handleBulkSendAlert = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: `Send Renewal Alerts (${selectedIds.length} Selected)`,
      message: `Send Renewal Expiry Warning Email alerts to clients for all ${selectedIds.length} selected services?`,
      confirmText: `Send ${selectedIds.length} Alert Emails`,
      onConfirm: async () => {
        try {
          let sentCount = 0;
          for (const id of selectedIds) {
            const res = await clientServicesApi.sendAlert(id);
            if (res && res.success) sentCount++;
          }
          toast.success(`Sent ${sentCount} renewal alert email(s) successfully!`);
          fetchServices();
        } catch (err) {
          toast.error('Failed to send alert emails');
        }
      }
    });
  };

  const handleDeleteService = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Client Service',
      message: 'Are you sure you want to delete this client service record?',
      confirmText: 'Yes, Delete',
      onConfirm: async () => {
        try {
          const res = await clientServicesApi.delete(id);
          if (res && res.success) {
            toast.success('Client service record deleted!');
            setSelectedIds(prev => prev.filter(item => item !== id));
            fetchServices();
          } else {
            toast.error(res?.message || 'Failed to delete record');
          }
        } catch (err) {
          toast.error('Failed to delete record');
        }
      }
    });
  };

  // Trigger Expiry Warning Email to Client & Admin
  const handleSendRenewalAlert = (service) => {
    setConfirmModal({
      isOpen: true,
      title: 'Send Renewal Alert Email',
      message: `Send Renewal Expiry Alert Email to ${service.clientName} (${service.clientEmail}) and Admin?`,
      confirmText: 'Send Email',
      onConfirm: async () => {
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
      }
    });
  };



  // Manual Trigger for Automated Email Expiry Alerts
  const handleRunAutoAlerts = async () => {
    setRunningAutoAlerts(true);
    try {
      const res = await clientServicesApi.runAutoAlerts();
      if (res && res.success) {
        toast.success(res.message || 'Automated expiry alert scan completed!');
        fetchServices();
      } else {
        toast.error(res?.message || 'Failed to run auto-alert scan');
      }
    } catch (err) {
      toast.error('Failed to run automated expiry alerts check');
    } finally {
      setRunningAutoAlerts(false);
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

  // Sort services so that services belonging to the same client/domain are listed right next to each other ("ek ke neeche ek")
  const sortedServices = useMemo(() => {
    const list = [...filteredServices];
    return list.sort((a, b) => {
      const keyA = (a.clientEmail || a.clientName || '').toLowerCase().trim();
      const keyB = (b.clientEmail || b.clientName || '').toLowerCase().trim();
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;

      // Secondary sort by service name / domain
      const nameA = (a.serviceName || '').toLowerCase().trim();
      const nameB = (b.serviceName || '').toLowerCase().trim();
      return nameA.localeCompare(nameB);
    });
  }, [filteredServices]);

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
    <div className="admin-client-services-pane" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 280px' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiGlobe style={{ color: '#0284c7' }} /> Client Services & Domain Renewal Tracker
          </h1>
          <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.82rem' }}>
            Track client domains, web hosting, SSL certificates & AMC renewals with automated <strong>Client & Admin Email Expiry Alerts</strong>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
          <button
            type="button"
            className="btn-outline-primary"
            onClick={handleRunAutoAlerts}
            disabled={runningAutoAlerts}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: runningAutoAlerts ? 'not-allowed' : 'pointer'
            }}
            title="Scan for services expiring within 30 days and automatically trigger warning emails to clients & admin"
          >
            <FiRefreshCw size={15} className={runningAutoAlerts ? 'spin' : ''} style={{ color: '#0284c7' }} />
            {runningAutoAlerts ? 'Running Auto Scan...' : '⚡ Run Auto-Alert Check'}
          </button>
          <button
            type="button"
            className="btn-orange"
            onClick={() => {
              if (showForm && !editingService) {
                setShowForm(false);
              } else {
                handleOpenAddForm();
              }
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            {showForm && !editingService ? <FiX size={16} /> : <FiPlus size={16} />}
            {showForm && !editingService ? 'Close Form' : 'Add Client Service'}
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
        <div className="stat-card" style={{ padding: '0.75rem 0.85rem', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Services</span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: '0.15rem 0 0' }}>{metrics.total}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 0.85rem', background: '#fff', borderRadius: '10px', border: '1px solid #fee2e2' }}>
          <span style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>Expired / Critical</span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#dc2626', margin: '0.15rem 0 0' }}>{metrics.expiredCount + metrics.criticalCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 0.85rem', background: '#fff', borderRadius: '10px', border: '1px solid #ffedd5' }}>
          <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: '700', textTransform: 'uppercase' }}>Expiring In 30 Days</span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ea580c', margin: '0.15rem 0 0' }}>{metrics.expiringSoonCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 0.85rem', background: '#fff', borderRadius: '10px', border: '1px solid #dcfce7' }}>
          <span style={{ fontSize: '0.68rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Active & Healthy</span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#16a34a', margin: '0.15rem 0 0' }}>{metrics.activeCount}</h3>
        </div>

        <div className="stat-card" style={{ padding: '0.75rem 0.85rem', background: '#fff', borderRadius: '10px', border: '1px solid #e0f2fe' }}>
          <span style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: '700', textTransform: 'uppercase' }}>Renewal Revenue</span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0284c7', margin: '0.15rem 0 0' }}>₹{metrics.totalRenewalRevenue.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* ── INLINE ADD / EDIT CLIENT SERVICE FORM PANEL ── */}
      {showForm && (
        <div
          id="client-service-form-card"
          className="admin-card"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '2px solid #0284c7',
            boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {editingService ? '✏️ Edit Client Service Record' : '➕ Add New Client & Services'}
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Track expiration dates, start dates, and configure automated email alerts for client renewals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              title="Close Form"
            >
              <FiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmitForm}>
            {/* Section 1: Client Information */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: '800', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiUser size={15} /> Client Contact Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                <div className="form-field-group">
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Client Name *</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    required
                    style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                    value={clientInfo.clientName}
                    onChange={e => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Company Name</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acme Enterprises"
                    style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                    value={clientInfo.companyName}
                    onChange={e => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Client Email Address *</label>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="client@example.com"
                    required
                    style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                    value={clientInfo.clientEmail}
                    onChange={e => setClientInfo({ ...clientInfo, clientEmail: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Client Phone Number</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                    value={clientInfo.clientPhone}
                    onChange={e => setClientInfo({ ...clientInfo, clientPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Services List (Supports Multiple Services per Client) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiGlobe size={15} style={{ color: '#0284c7' }} /> Client Services ({serviceRows.length})
                </h4>
                {!editingService && (
                  <button
                    type="button"
                    onClick={handleAddServiceRow}
                    style={{
                      background: '#e0f2fe',
                      color: '#0284c7',
                      border: '1px solid #7dd3fc',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <FiPlus size={14} /> Add Another Service for this Client
                  </button>
                )}
              </div>

              {serviceRows.map((row, idx) => (
                <div
                  key={row.id || idx}
                  style={{
                    background: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    marginBottom: '1.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Service #{idx + 1} Details
                    </span>
                    {serviceRows.length > 1 && !editingService && (
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceRow(idx)}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Remove this service row"
                      >
                        <FiTrash2 size={13} /> Delete Service
                      </button>
                    )}
                  </div>

                  {/* Service Row 1: Identification */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Service Type Dropdown */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Service Type *</label>
                      </div>
                      <select
                        className="form-control"
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.serviceType}
                        onChange={e => handleServiceRowChange(idx, 'serviceType', e.target.value)}
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

                    {/* Service / Domain Name */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Service / Domain Name *</label>
                        <button
                          type="button"
                          disabled={lookingUpIdx === idx || !row.serviceName}
                          onClick={() => handleAutoLookupDomainRow(idx)}
                          style={{ border: 'none', background: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                        >
                          {lookingUpIdx === idx ? 'Detecting...' : '⚡ Auto WHOIS Expiry'}
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. clientwebsite.com"
                        required
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.serviceName}
                        onChange={e => handleServiceRowChange(idx, 'serviceName', e.target.value)}
                      />
                    </div>

                    {/* Provider */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Provider / Registrar</label>
                      </div>
                      <select
                        className="form-control"
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.provider}
                        onChange={e => handleServiceRowChange(idx, 'provider', e.target.value)}
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
                  </div>

                  {/* Service Row 2: Dates & Billing */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    {/* Start Date / Purchase Date */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiCalendar size={13} /> Start / Purchase Date
                        </label>
                      </div>
                      <input
                        type="date"
                        className="form-control"
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.purchaseDate}
                        onChange={e => handleServiceRowChange(idx, 'purchaseDate', e.target.value)}
                      />
                    </div>

                    {/* Expiration Date */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#dc2626', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiCalendar size={13} /> Expiration Date *
                        </label>
                      </div>
                      <input
                        type="date"
                        className="form-control"
                        required
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.expiryDate}
                        onChange={e => handleServiceRowChange(idx, 'expiryDate', e.target.value)}
                      />
                    </div>

                    {/* Renewal Amount */}
                    <div className="form-field-group">
                      <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#475569', margin: 0 }}>Renewal Amount (₹)</label>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 1500"
                        style={{ height: '42px', width: '100%', boxSizing: 'border-box' }}
                        value={row.renewalAmount}
                        onChange={e => handleServiceRowChange(idx, 'renewalAmount', e.target.value)}
                      />
                    </div>


                  </div>
                </div>
              ))}
            </div>

            {/* Notes Field */}
            <div className="form-field-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155' }}>Notes / Service Credentials</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Additional remarks or registrar account notes..."
                value={clientInfo.notes}
                onChange={e => setClientInfo({ ...clientInfo, notes: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-orange" disabled={submitting}>
                {submitting ? 'Saving Record...' : editingService ? 'Update Service' : `Save ${serviceRows.length} Service(s)`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', background: '#fff', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
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

      {/* ── BULK ACTION SELECTION BAR ── */}
      {selectedIds.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          background: '#eff6ff',
          border: '1.5px solid #3b82f6',
          padding: '0.75rem 1.1rem',
          borderRadius: '12px',
          marginBottom: '1rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e40af', fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            <FiCheckSquare size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>{selectedIds.length} service(s) selected</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleBulkSendAlert}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
            >
              <FiSend size={13} /> Send Alert Emails ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              style={{
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
            >
              <FiTrash2 size={13} /> Delete Selected ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              style={{
                background: '#e2e8f0',
                color: '#475569',
                border: 'none',
                padding: '0.45rem 0.75rem',
                borderRadius: '7px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div className="table-responsive" style={{ overflowX: 'auto', width: '100%' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ width: '36px', textAlign: 'center', verticalAlign: 'middle', padding: '0.6rem 0.3rem' }}>
                  <input
                    type="checkbox"
                    checked={filteredServices.length > 0 && selectedIds.length === filteredServices.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#0284c7', display: 'block', margin: '0 auto' }}
                  />
                </th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569' }}>Client & Company</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569' }}>Service Name & Type</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569' }}>Provider</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', whiteSpace: 'nowrap' }}>Start Date</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', whiteSpace: 'nowrap' }}>Expiry Date</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', whiteSpace: 'nowrap' }}>Renewal Status</th>
                <th style={{ verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', whiteSpace: 'nowrap' }}>Cost (₹)</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.6rem 0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#475569', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedServices.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <FiGlobe size={28} style={{ color: '#94a3b8', marginBottom: '0.4rem' }} />
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.85rem' }}>No client service records found.</p>
                  </td>
                </tr>
              ) : (
                sortedServices.map((s, idx) => {
                  const prev = idx > 0 ? sortedServices[idx - 1] : null;
                  const isSameClientAsPrev = prev && (
                    (prev.clientEmail && s.clientEmail && prev.clientEmail.trim().toLowerCase() === s.clientEmail.trim().toLowerCase()) ||
                    (prev.clientName && s.clientName && prev.clientName.trim().toLowerCase() === s.clientName.trim().toLowerCase())
                  );

                  const daysLeft = s.daysLeft;
                  const isExpired = daysLeft !== null && daysLeft <= 0;
                  const isCritical = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
                  const isWarning = daysLeft !== null && daysLeft > 7 && daysLeft <= 30;
                  const isSelected = selectedIds.includes(s.id);

                  return (
                    <tr
                      key={s.id}
                      style={{
                        background: isSelected ? '#f0f9ff' : isSameClientAsPrev ? '#fafafa' : 'transparent',
                        borderBottom: '1px solid #f1f5f9',
                        borderLeft: isSameClientAsPrev ? '3px solid #0284c7' : '3px solid transparent'
                      }}
                    >
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.55rem 0.3rem' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(s.id)}
                          style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: '#0284c7', display: 'block', margin: '0 auto' }}
                        />
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                          <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>{s.clientName}</strong>
                          {isSameClientAsPrev && (
                            <span style={{ fontSize: '0.66rem', color: '#0284c7', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                              Same Client
                            </span>
                          )}
                        </div>
                        {s.companyName && <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{s.companyName}</span>}
                        <div style={{ fontSize: '0.74rem', color: '#0284c7', marginTop: '1px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.clientEmail}>
                          <FiMail size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                          {s.clientEmail}
                        </div>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', color: '#0f172a', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          {getServiceTypeIcon(s.serviceType)}
                          {s.serviceName}
                          {s.serviceType === 'Domain Name' && (
                            <a href={`https://${s.serviceName}`} target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>
                              <FiExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '1px' }}>{s.serviceType}</span>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '600', color: '#334155', fontSize: '0.78rem' }}>
                          {s.provider || 'GoDaddy'}
                        </span>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: '600' }}>
                          {formatDateDisplay(s.purchaseDate)}
                        </span>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '0.78rem', color: isExpired || isCritical ? '#dc2626' : isWarning ? '#ea580c' : '#0f172a' }}>
                          {formatDateDisplay(s.expiryDate)}
                        </strong>
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem', whiteSpace: 'nowrap' }}>
                        {isExpired ? (
                          <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FiAlertTriangle size={11} /> Expired ({Math.abs(daysLeft)}d ago)
                          </span>
                        ) : isCritical ? (
                          <span style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FiClock size={11} /> Critical! {daysLeft} Days Left
                          </span>
                        ) : isWarning ? (
                          <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FiClock size={11} /> {daysLeft} Days Left
                          </span>
                        ) : (
                          <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.2rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <FiCheckCircle size={11} /> Active ({daysLeft}d left)
                          </span>
                        )}
                      </td>

                      <td style={{ verticalAlign: 'middle', padding: '0.55rem 0.5rem', whiteSpace: 'nowrap' }}>
                        <strong style={{ color: '#0f172a', fontSize: '0.82rem' }}>
                          {s.renewalAmount ? `₹${Number(s.renewalAmount).toLocaleString('en-IN')}` : '-'}
                        </strong>
                      </td>

                      <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.55rem 0.4rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                          <button
                            type="button"
                            disabled={sendingAlertId === s.id}
                            style={{
                              width: '28px',
                              height: '28px',
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '6px',
                              border: '1px solid #0284c7',
                              background: '#f0f9ff',
                              color: '#0284c7',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSendRenewalAlert(s)}
                            title="Send Renewal Expiry Alert Email to Client & Admin"
                          >
                            <FiSend size={13} />
                          </button>

                          <button
                            type="button"
                            className="btn-table-action edit"
                            onClick={() => handleOpenEditForm(s)}
                            title="Edit Service Record"
                            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <FiEdit size={13} />
                          </button>

                          <button
                            type="button"
                            className="btn-table-action delete"
                            onClick={() => handleDeleteService(s.id)}
                            title="Delete Record"
                            style={{ width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
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

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirm' })}
        title={confirmModal.title}
        message={confirmModal.message}
        type="confirm"
        confirmText={confirmModal.confirmText || 'Confirm'}
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
