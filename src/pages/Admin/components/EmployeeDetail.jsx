import React, { useState, useEffect } from 'react';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase, FiDollarSign,
  FiFileText, FiCheckCircle, FiXCircle, FiClock, FiUpload, FiDownload, FiTrash2,
  FiEdit2, FiShield, FiPrinter, FiPlus, FiChevronLeft, FiAlertCircle, FiX, FiKey,
  FiEye, FiExternalLink
} from 'react-icons/fi';
import { employeesApi } from '../../../api/api';
import OfferLetter from './OfferLetter';
import RelievingLetter from './RelievingLetter';
import ExperienceLetter from './ExperienceLetter';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';
import { formatEmpId } from './empUtils';

export default function EmployeeDetail({ employeeId, initialEmployee, onBack, onUpdate, setCredentialsModal, initialTab = 'overview' }) {
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [employee, setEmployee] = useState(initialEmployee || null);
  const [loading, setLoading] = useState(!initialEmployee);
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab, employeeId]);

  // Edit Modals
  const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [showEditPayrollModal, setShowEditPayrollModal] = useState(false);

  // Forms
  const [personalForm, setPersonalForm] = useState({});
  const [empForm, setEmpForm] = useState({});
  const [payrollForm, setPayrollForm] = useState({});

  // Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null); // { title: '', url: '', category: '' }
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  const isImageDoc = (url) => {
    if (!url) return false;
    const str = String(url).trim().toLowerCase();
    if (str.startsWith('data:image/')) return true;
    if (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(str)) return true;
    if (str.includes('/img/') || str.includes('/images/')) return true;
    return false;
  };

  const isPdfDoc = (url) => {
    if (!url) return false;
    const str = String(url).trim().toLowerCase();
    if (str.startsWith('data:application/pdf')) return true;
    if (/\.pdf(\?.*)?$/i.test(str)) return true;
    return false;
  };

  useEffect(() => {
    if (previewDoc && previewDoc.url && isPdfDoc(previewDoc.url)) {
      if (previewDoc.url.startsWith('data:')) {
        try {
          const parts = previewDoc.url.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
          const bstr = atob(parts[1].replace(/\s/g, ''));
          const u8arr = new Uint8Array(bstr.length);
          for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
          }
          const blob = new Blob([u8arr], { type: mime });
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
          return () => URL.revokeObjectURL(url);
        } catch (e) {
          setPdfBlobUrl(previewDoc.url);
        }
      } else {
        setPdfBlobUrl(previewDoc.url);
      }
    } else {
      setPdfBlobUrl(null);
    }
  }, [previewDoc]);

  // Payslip Modal
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [payslipForm, setPayslipForm] = useState({ month: 'September', year: 2026, basicPay: '', allowances: '0', deductions: '0' });

  // Letter Generator Viewer Modal
  const [letterViewerType, setLetterViewerType] = useState(null); // 'Offer' | 'Relieving' | 'Experience'

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

  useEffect(() => {
    const isAnyOpen = showEditPersonalModal || showEditEmpModal || showPayslipModal || !!letterViewerType;
    if (isAnyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showEditPersonalModal, showEditEmpModal, showPayslipModal, letterViewerType]);

  const populateForms = (data) => {
    if (!data) return;
    const fullName = data.name || '';
    const nameParts = fullName.trim().split(' ');
    const defaultFirstName = data.firstName || nameParts[0] || '';
    const defaultLastName = data.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

    setPersonalForm({
      firstName: defaultFirstName,
      middleName: data.middleName || '',
      lastName: defaultLastName,
      phone: data.phone || '',
      personalEmail: data.personalEmail || '',
      altPhone: data.altPhone || '',
      dob: data.dob ? String(data.dob).split('T')[0] : '',
      gender: data.gender || 'Male',
      currentAddress: data.currentAddress || data.address || '',
      permanentAddress: data.permanentAddress || data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      emergencyContactName: data.emergencyContactName || '',
      emergencyRelationship: data.emergencyRelationship || '',
      emergencyPhone: data.emergencyPhone || '',
      bankName: data.bankName || '',
      accountNumber: data.accountNumber || '',
      ifsc: data.ifsc || '',
      panNumber: data.panNumber || '',
      uanNumber: data.uanNumber || '',
      taxInfo: data.taxInfo || 'New Tax Regime'
    });

    setEmpForm({
      empId: formatEmpId(data.empId, data.id) || '',
      joiningDate: data.joiningDate ? String(data.joiningDate).split('T')[0] : (data.joinDate ? String(data.joinDate).split('T')[0] : ''),
      department: data.department || '',
      designation: data.designation || '',
      reportingManager: data.reportingManager || 'HR Manager',
      employmentType: data.employmentType || 'Full-Time',
      workLocation: data.workLocation || 'Mumbai Office',
      workMode: data.workMode || 'On-site',
      shift: data.shift || 'Standard Shift (10:00 AM - 7:00 PM)',
      status: data.status || 'Active'
    });

    setPayrollForm({
      salary: data.salary || 0,
      salaryStructure: data.salaryStructure || 'Standard Corporate',
      basicSalary: data.basicSalary || 0,
      hra: data.hra || 0,
      allowances: data.allowances || 0,
      deductions: data.deductions || 0,
      bankName: data.bankName || '',
      accountNumber: data.accountNumber || '',
      ifsc: data.ifsc || '',
      panNumber: data.panNumber || '',
      uanNumber: data.uanNumber || '',
      taxInfo: data.taxInfo || 'New Tax Regime'
    });
  };

  const fetchEmployeeData = async () => {
    let data = initialEmployee || employee || null;
    if (data) {
      setEmployee(data);
      populateForms(data);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const res = await employeesApi.getById(employeeId);
      if (res && res.success && res.data) {
        data = res.data;
        setEmployee(data);
        populateForms(data);
      }
    } catch (err) {
      console.warn('API getById failed, using initial employee:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchEmployeeData();
  }, [employeeId, initialEmployee]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <FiClock style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '0.75rem', fontWeight: '600' }}>Loading employee master record...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <FiAlertCircle style={{ fontSize: '2.5rem', color: '#ef4444', marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Employee Record Not Found</h3>
        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>Could not load employee details. Your session may have expired or the record does not exist on the server.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={onBack}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back to Employees
          </button>
          <button
            onClick={() => { localStorage.removeItem('admin_token'); window.location.href = '/admin'; }}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: '#e2e8f0', color: '#334155', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            Re-Login
          </button>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    const payload = {
      ...personalForm,
      name: `${personalForm.firstName || ''} ${personalForm.lastName || ''}`.trim()
    };
    const res = await employeesApi.update(employee.id, payload);
    if (res.success) {
      toast.success('Personal information updated!');
      setShowEditPersonalModal(false);
      fetchEmployeeData();
      if (onUpdate) onUpdate();
    }
  };

  const handleSaveEmp = async (e) => {
    e.preventDefault();
    const payload = {
      ...empForm,
      empId: formatEmpId(empForm.empId, employee.id)
    };
    const res = await employeesApi.update(employee.id, payload);
    if (res.success) {
      toast.success('Employment information updated!');
      setShowEditEmpModal(false);
      fetchEmployeeData();
      if (onUpdate) onUpdate();
    }
  };

  const handleSavePayroll = async (e) => {
    e.preventDefault();
    const res = await employeesApi.update(employee.id, payrollForm);
    if (res.success) {
      toast.success('Payroll details updated!');
      setShowEditPayrollModal(false);
      fetchEmployeeData();
      if (onUpdate) onUpdate();
    }
  };

  const downloadFile = (fileUrl, fileName = 'document') => {
    if (!fileUrl) {
      toast.warning('No file URL available to download.');
      return;
    }
    if (fileUrl.startsWith('data:')) {
      try {
        const arr = fileUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const bstr = atob(arr[1].replace(/\s/g, ''));
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const ext = mime.includes('png') ? '.png' : mime.includes('jpeg') || mime.includes('jpg') ? '.jpg' : mime.includes('pdf') ? '.pdf' : '';
        link.download = fileName && fileName.includes('.') ? fileName : `${fileName || 'document'}${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
        return;
      } catch (err) {
        console.error('Download error:', err);
      }
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = (fileUrl) => {
    if (!fileUrl) {
      toast.warning('No document file available.');
      return;
    }
    if (fileUrl.startsWith('data:')) {
      try {
        const arr = fileUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
        const bstr = atob(arr[1].replace(/\s/g, ''));
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
        return;
      } catch (err) {
        console.error('Open new tab error:', err);
      }
    }
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIssuePayslip = async (e) => {
    e.preventDefault();
    const res = await employeesApi.issueSalarySlip({
      employeeId: employee.id || employee.empId,
      ...payslipForm,
      basicPay: payslipForm.basicPay || employee.basicSalary || (employee.salary ? employee.salary * 0.5 : 0)
    });
    if (res && res.success) {
      toast.success(res.message || 'Salary slip issued to employee!');
      setShowPayslipModal(false);
      fetchEmployeeData();
    } else {
      toast.error(res?.message || 'Failed to issue salary slip.');
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    const res = await employeesApi.updateLeaveStatus(leaveId, status);
    if (res.success) {
      toast.success(`Leave request ${status}`);
      fetchEmployeeData();
    }
  };

  const handleToggleStatus = () => {
    const isCurrentlyInactive = (employee.status || '').toLowerCase() === 'inactive';
    const targetStatus = isCurrentlyInactive ? 'Active' : 'Inactive';
    const actionLabel = isCurrentlyInactive ? 'Activate' : 'Deactivate';

    setConfirmModal({
      isOpen: true,
      title: `${actionLabel} Staff`,
      message: `Are you sure you want to ${actionLabel.toLowerCase()} ${employee.name}?`,
      onConfirm: async () => {
        let res;
        if (isCurrentlyInactive) {
          res = await employeesApi.update(employee.id || employee.empId, { status: 'Active' });
        } else {
          res = await employeesApi.delete(employee.id || employee.empId, false);
        }

        toast.success(`Employee status updated to ${targetStatus}.`);
        setEmployee(prev => (prev ? { ...prev, status: targetStatus } : prev));
        if (onUpdate) onUpdate();
        fetchEmployeeData();
      }
    });
  };

  const handleDeleteEmployee = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Staff Member',
      message: `Are you sure you want to PERMANENTLY delete ${employee.name} (${formatEmpId(employee.empId, employee.id)})? All associated employee records will be permanently removed.`,
      onConfirm: async () => {
        try {
          const res = await employeesApi.delete(employee.id || employee.empId, true);
          if (res && res.success) {
            toast.success(res.message || 'Employee permanently deleted.');
            if (onUpdate) onUpdate();
            if (onBack) onBack();
          } else {
            toast.error(res?.message || 'Failed to delete employee.');
          }
        } catch (err) {
          toast.error('Failed to delete employee.');
        }
      }
    });
  };

  const attendances = employee.attendances || [];
  const salarySlips = employee.salarySlips || [];
  const leaveRequests = employee.leaveRequests || [];
  const documents = employee.documents || [];
  const hrLetters = employee.hrLetters || [];
  const employeeRequests = employee.employeeRequests || [];

  const presentCount = attendances.filter(a => a.status === 'Present' || a.checkIn).length;
  const leaveCount = leaveRequests.filter(l => l.status === 'Approved').length;

  return (
    <div className="employee-detail-wrapper">
      {/* Top Bar Navigation */}
      <div className="detail-top-nav">
        <button className="btn-secondary btn-back-list" onClick={onBack}>
          <FiChevronLeft /> Back to Employee List
        </button>
        <div className="detail-top-actions">
          <button
            type="button"
            className="btn-secondary"
            style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
            onClick={async () => {
              if (setCredentialsModal) {
                try {
                  const res = await employeesApi.resetPassword(employee.id || employee.empId, 'Inspire#2026');
                  if (res && res.success && res.data) {
                    setCredentialsModal({
                      empId: formatEmpId(res.data.empId || employee.empId, employee.id),
                      name: res.data.name || employee.name,
                      email: res.data.email || employee.email,
                      password: res.data.password || 'Inspire#2026',
                      designation: res.data.designation || employee.designation
                    });
                  } else {
                    setCredentialsModal({
                      empId: formatEmpId(employee.empId, employee.id),
                      name: employee.name,
                      email: employee.email,
                      password: 'Inspire#2026',
                      designation: employee.designation
                    });
                  }
                } catch (e) {
                  setCredentialsModal({
                    empId: formatEmpId(employee.empId, employee.id),
                    name: employee.name,
                    email: employee.email,
                    password: 'Inspire#2026',
                    designation: employee.designation
                  });
                }
              }
            }}
          >
            <FiKey size={15} /> Portal Credentials
          </button>
          {((employee.status || '').toLowerCase() === 'inactive') ? (
            <button className="btn-secondary" onClick={handleToggleStatus} style={{ color: '#10b981', borderColor: '#6ee7b7', background: '#ecfdf5' }}>
              <FiCheckCircle size={15} /> Activate Staff
            </button>
          ) : (
            <button className="btn-secondary" onClick={handleToggleStatus} style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
              <FiXCircle size={15} /> Deactivate Staff
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
            onClick={handleDeleteEmployee}
          >
            <FiTrash2 size={15} /> Delete Staff
          </button>
          <button className="btn-orange" onClick={() => setLetterViewerType('Offer')}>
            Generate HR Letter
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="admin-card detail-profile-card">
        <div className="profile-card-content">
          <div className="profile-avatar">
            {employee.photoUrl ? (
              <img src={employee.photoUrl} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              employee.name.charAt(0)
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name-row">
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{employee.name}</h2>
              <span className={`status-badge status-${(employee.status || 'Active').toLowerCase().replace(' ', '-')}`}>
                {employee.status || 'Active'}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0', color: '#475569', fontWeight: '600' }}>
              {employee.designation || 'Specialist'} &bull; <span style={{ color: '#0284c7' }}>{employee.department || 'IT'}</span>
            </p>
            <div className="profile-meta-row">
              <span><FiUser /> Emp ID: <strong>{formatEmpId(employee.empId, employee.id)}</strong></span>
              <span><FiMail /> {employee.email}</span>
              <span><FiPhone /> {employee.phone || 'N/A'}</span>
              <span><FiCalendar /> Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="admin-tabs detail-tabs-bar">
        {['overview', 'personal', 'employment', 'attendance', 'leave', 'payroll', 'documents', 'letters'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: '700',
              textTransform: 'capitalize',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '3px solid #f97316' : '3px solid transparent',
              color: activeTab === tab ? '#f97316' : '#64748b',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab === 'personal' ? 'Personal Info' : tab === 'letters' ? 'HR Letters' : tab}
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div>
          {/* Top Metric Cards */}
          <div className="detail-stats-grid">
            <div className="stat-card" style={{ padding: '1.1rem 1.25rem', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Leave Balance</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f97316', margin: '0.2rem 0 0' }}>18 / 24 Days</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Annual Paid Entitlement</span>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiCalendar size={20} />
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1.1rem 1.25rem', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Attendance Logs</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0 0' }}>{presentCount} {presentCount === 1 ? 'Day' : 'Days'} Present</h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Total Clocked-In Days</span>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiClock size={20} />
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1.1rem 1.25rem', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Verification Documents</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284c7', margin: '0.2rem 0 0' }}>
                  {[employee.photoUrl, employee.aadharUrl, employee.panUrl].filter(Boolean).length} / 3 Uploaded
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>ID & Address Verification</span>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiFileText size={20} />
              </div>
            </div>

            <div className="stat-card" style={{ padding: '1.1rem 1.25rem', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Pending Requests</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#6366f1', margin: '0.2rem 0 0' }}>
                  {employeeRequests.filter(r => r.status === 'Pending').length} {employeeRequests.filter(r => r.status === 'Pending').length === 1 ? 'Action Item' : 'Action Items'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Awaiting Admin Action</span>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiAlertCircle size={20} />
              </div>
            </div>
          </div>

          {/* Section Grids */}
          <div className="detail-two-col-grid">
            {/* Employment Summary Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <FiBriefcase style={{ color: '#f97316', fontSize: '1.2rem' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Employment Summary</h4>
              </div>

              <div className="detail-info-grid">
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Reporting Manager</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUser style={{ color: '#0284c7' }} /> {employee.reportingManager || 'HR Manager'}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employment Type</span>
                  <div>
                    <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                      {employee.employmentType || 'Full-Time'}
                    </span>
                  </div>
                </div>

                <div className="full-width-item" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Work Mode & Location</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiMapPin style={{ color: '#f97316' }} /> {employee.workMode || 'On-site'} ({employee.workLocation || 'Mumbai Office'})
                  </div>
                </div>

                <div className="full-width-item" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Shift Timings</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiClock style={{ color: '#10b981' }} /> {employee.shift || 'General (10:00 AM - 7:00 PM)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Overview Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <FiDollarSign style={{ color: '#10b981', fontSize: '1.2rem' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>Payroll & Financial Overview</h4>
              </div>

              <div className="detail-info-grid">
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Monthly Gross Salary</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#16a34a' }}>
                    ₹{Number(employee.salary || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Basic Salary</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0284c7' }}>
                    ₹{Number(employee.basicSalary || (employee.salary ? Math.round(employee.salary * 0.5) : 0)).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="full-width-item" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Bank Account Info</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: employee.accountNumber ? '#0f172a' : '#ef4444' }}>
                    {employee.bankName ? `${employee.bankName} (A/C: ${employee.accountNumber})` : 'Not Configured'}
                  </div>
                </div>

                <div className="full-width-item" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>PAN Card Number</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: employee.panNumber ? '#0f172a' : '#ef4444' }}>
                    {employee.panNumber || 'Not Uploaded'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PERSONAL INFO ── */}
      {activeTab === 'personal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="detail-header-card-row">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUser style={{ color: '#f97316' }} /> Personal & Contact Details
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>Primary identity, emergency contacts, and bank information.</p>
            </div>
            <button className="btn-secondary" onClick={() => setShowEditPersonalModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', fontSize: '0.86rem' }}>
              <FiEdit2 /> Edit Personal & Bank Info
            </button>
          </div>

          <div className="detail-two-col-grid">
            {/* Primary Contact Info Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMail style={{ color: '#0284c7' }} /> Primary Identity & Contact
              </h4>
              <div className="detail-info-grid">
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.name}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                  <div>
                    <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                      {employee.gender || 'Male'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Personal Email</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0284c7' }}>{employee.personalEmail || employee.email}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Primary Phone</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.phone || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Alternate Phone</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.altPhone || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCalendar style={{ color: '#f97316' }} /> {employee.dob ? new Date(employee.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Not Provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Address & Emergency Contact Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMapPin style={{ color: '#10b981' }} /> Residential & Emergency
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Current Address</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{employee.currentAddress || employee.address || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Permanent Address</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{employee.permanentAddress || employee.address || 'N/A'}</div>
                </div>
                <div style={{ background: '#fff7ed', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                  <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Emergency Contact</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#9a3412', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{employee.emergencyContactName || 'Not Set'} {employee.emergencyRelationship ? `(${employee.emergencyRelationship})` : ''}</span>
                    <span style={{ fontWeight: '800' }}>{employee.emergencyPhone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank & Statutory Details Card */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h4 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiDollarSign style={{ color: '#10b981' }} /> Bank Account & Statutory Information
            </h4>
            <div className="detail-stats-grid">
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Bank Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: employee.bankName ? '#0f172a' : '#ef4444' }}>
                  {employee.bankName || 'Not Provided'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Account Number</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: employee.accountNumber ? '#0f172a' : '#ef4444' }}>
                  {employee.accountNumber || 'Not Provided'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>IFSC Code</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: employee.ifsc ? '#0284c7' : '#ef4444', textTransform: 'uppercase' }}>
                  {employee.ifsc || 'Not Provided'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>PAN Card Number</span>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: employee.panNumber ? '#0f172a' : '#ef4444', textTransform: 'uppercase' }}>
                  {employee.panNumber || 'Not Uploaded'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EMPLOYMENT ── */}
      {activeTab === 'employment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="detail-header-card-row">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiBriefcase style={{ color: '#0284c7' }} /> Employment Information
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>Role details, organization structure, work mode, and probation status.</p>
            </div>
            <button className="btn-secondary" onClick={() => setShowEditEmpModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', fontSize: '0.86rem' }}>
              <FiEdit2 /> Edit Employment Info
            </button>
          </div>

          <div className="detail-two-col-grid">
            {/* Role & Org Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiUser style={{ color: '#f97316' }} /> Organization & Role
              </h4>
              <div className="detail-info-grid">
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0284c7' }}>{formatEmpId(employee.empId, employee.id)}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employment Type</span>
                  <div>
                    <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                      {employee.employmentType || 'Full-Time'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Department</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.department || 'N/A'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Designation</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.designation || 'N/A'}</div>
                </div>
                <div className="full-width-item" style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Reporting Manager</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiUser style={{ color: '#0284c7' }} /> {employee.reportingManager || 'HR Manager'}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Status Card */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiClock style={{ color: '#10b981' }} /> Work Setup & Status
              </h4>
              <div className="detail-info-grid">
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Work Mode</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.workMode || 'On-site'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Work Location</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{employee.workLocation || 'Mumbai Office'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Joining Date</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiCalendar style={{ color: '#f97316' }} /> {new Date(employee.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Current Status</span>
                  <div>
                    <span className={`status-badge status-${(employee.status || 'Active').toLowerCase()}`}>
                      {employee.status || 'Active'}
                    </span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Probation Status</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                    {employee.probationPeriod || 'Standard (6 Months)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: ATTENDANCE ── */}
      {activeTab === 'attendance' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="detail-header-card-row" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiClock style={{ color: '#0284c7' }} /> Attendance Logs & History
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', flexWrap: 'wrap' }}>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>
                Present: {attendances.filter(a => (a.status || '').toLowerCase() === 'present' || a.checkIn).length}
              </span>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>
                Late: {attendances.filter(a => (a.status || '').toLowerCase() === 'late').length}
              </span>
              <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.3rem 0.75rem', borderRadius: '20px' }}>
                Absent: {attendances.filter(a => (a.status || '').toLowerCase() === 'absent').length}
              </span>
            </div>
          </div>

          {/* Unified Date & Status Filter Bar */}
          <div className="admin-filter-bar" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <FiClock style={{ color: '#0284c7' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Status:</span>
              <select
                value={attStatusFilter}
                onChange={e => setAttStatusFilter(e.target.value)}
                className="filter-select"
                style={{ background: '#fff' }}
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Work Hours</th>
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
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                        No attendance records match the selected date / status filter.
                      </td>
                    </tr>
                  );
                }

                return filtered.map((att) => {
                  const st = (att.status || 'Present').toLowerCase();
                  let badgeStyle = { background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' };
                  if (st === 'late') {
                    badgeStyle = { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
                  } else if (st === 'absent') {
                    badgeStyle = { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
                  }

                  return (
                    <tr key={att.id}>
                      <td><strong>{att.date ? (isNaN(new Date(att.date).getTime()) ? String(att.date) : new Date(att.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })) : '-'}</strong></td>
                      <td>{att.checkIn ? (typeof att.checkIn === 'string' && (att.checkIn.includes('AM') || att.checkIn.includes('PM')) ? att.checkIn : (isNaN(new Date(att.checkIn).getTime()) ? String(att.checkIn) : new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))) : 'N/A'}</td>
                      <td>{att.checkOut ? (typeof att.checkOut === 'string' && (att.checkOut.includes('AM') || att.checkOut.includes('PM')) ? att.checkOut : (isNaN(new Date(att.checkOut).getTime()) ? String(att.checkOut) : new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }))) : 'N/A'}</td>
                      <td><span className="status-badge" style={badgeStyle}>{(att.status || 'Present').toUpperCase()}</span></td>
                      <td>{att.workDuration || att.workingDuration || '9.0 hrs'}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 5: LEAVE ── */}
      {activeTab === 'leave' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Leave Entitlement Metric Cards */}
          <div className="detail-stats-grid">
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Casual Leave</span>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', fontWeight: '800', color: '#0284c7' }}>8 / 12 Days</h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Available Balance</span>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Sick Leave</span>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', fontWeight: '800', color: '#10b981' }}>6 / 6 Days</h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Available Balance</span>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Earned / Paid Leave</span>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.3rem', fontWeight: '800', color: '#f97316' }}>4 / 6 Days</h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Available Balance</span>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 1.25rem', color: '#0f172a', fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCalendar style={{ color: '#f97316' }} /> Leave Requests & History
            </h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((leave) => (
                    <tr key={leave.id}>
                      <td><strong>{leave.leaveType}</strong></td>
                      <td>{new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span className={`status-badge status-${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td>
                        {leave.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-secondary" style={{ color: '#10b981', borderColor: '#a7f3d0', background: '#ecfdf5', padding: '0.3rem 0.65rem', fontSize: '0.8rem' }} onClick={() => handleLeaveAction(leave.id, 'Approved')}>Approve</button>
                            <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2', padding: '0.3rem 0.65rem', fontSize: '0.8rem' }} onClick={() => handleLeaveAction(leave.id, 'Rejected')}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No leave requests submitted yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 6: PAYROLL ── */}
      {activeTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiDollarSign style={{ color: '#10b981' }} /> Salary Structure & Compensation
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748b' }}>Monthly breakdowns, statutory deductions, and issued payslip records.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={() => setShowEditPayrollModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', fontSize: '0.86rem' }}>
                <FiEdit2 /> Edit Structure
              </button>
              <button className="btn-orange" onClick={() => setShowPayslipModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1rem', fontSize: '0.86rem' }}>
                <FiPlus /> Issue Payslip
              </button>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: '#f0fdf4', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Gross Monthly Compensation</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#15803d', margin: '0.1rem 0 0' }}>
                  ₹{Number(employee.salary || 0).toLocaleString('en-IN')} / month
                </div>
              </div>
              <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d', fontWeight: '700', fontSize: '0.85rem' }}>
                Standard Corporate Structure
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Basic Pay</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7' }}>₹{Number(employee.basicSalary || (employee.salary ? Math.round(employee.salary * 0.5) : 0)).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Special Allowances</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>₹{Number(employee.allowances || 0).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Deductions</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>- ₹{Number(employee.deductions || 0).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Historical Issued Payslips Table */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h4 style={{ margin: '0 0 1.25rem', color: '#0f172a', fontSize: '1.1rem', fontWeight: '800' }}>Historical Issued Payslips</h4>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Month / Year</th>
                  <th>Basic Pay</th>
                  <th>Net Salary</th>
                  <th>Issued Date</th>
                </tr>
              </thead>
              <tbody>
                {salarySlips.length > 0 ? (
                  salarySlips.map((slip) => (
                    <tr key={slip.id}>
                      <td><strong>{slip.month} {slip.year}</strong></td>
                      <td>₹{Number(slip.basicPay).toLocaleString('en-IN')}</td>
                      <td><strong style={{ color: '#16a34a', fontWeight: '800' }}>₹{Number(slip.netSalary).toLocaleString('en-IN')}</strong></td>
                      <td>{new Date(slip.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>No salary slips issued yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 7: DOCUMENTS ── */}
      {activeTab === 'documents' && (
        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiFileText style={{ color: '#0284c7' }} /> Verification Documents & ID Proofs
              </h3>
              <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.86rem' }}>
                Official identity cards and profile avatar provided during onboarding.
              </p>
            </div>
            <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: '800', padding: '0.35rem 0.85rem', borderRadius: '20px' }}>
              {[employee.photoUrl, employee.aadharUrl, employee.panUrl].filter(Boolean).length} / 3 Uploaded
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Profile Photo Card */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '1rem' }}>1. Profile Photo</span>
                {employee.photoUrl ? (
                  <img src={employee.photoUrl} alt="Profile Photo" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 1.25rem', border: '3px solid #0284c7', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                ) : (
                  <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.5rem', fontWeight: '700' }}>
                    <FiUser />
                  </div>
                )}
              </div>
              {employee.photoUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewDoc({ title: `Profile Photo — ${employee.name}`, url: employee.photoUrl, category: 'Identity Documents' })}
                  className="btn-secondary"
                  style={{ fontSize: '0.84rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}
                >
                  <FiEye /> View Profile Photo
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Not Uploaded</span>
              )}
            </div>

            {/* Aadhar Card Card */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '1rem' }}>2. Aadhar Card</span>
                {employee.aadharUrl ? (
                  isImageDoc(employee.aadharUrl) ? (
                    <img src={employee.aadharUrl} alt="Aadhar Card" style={{ width: '140px', height: '85px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto 1.25rem', border: '1px solid #cbd5e1', display: 'block' }} />
                  ) : (
                    <div style={{ padding: '1.25rem', color: '#0284c7', fontWeight: '700', fontSize: '0.9rem', margin: '0 auto 1rem' }}>📄 Aadhar Document</div>
                  )
                ) : (
                  <div style={{ height: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
                    Not Uploaded
                  </div>
                )}
              </div>
              {employee.aadharUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewDoc({ title: `Aadhar Card — ${employee.name}`, url: employee.aadharUrl, category: 'Identity Documents' })}
                  className="btn-secondary"
                  style={{ fontSize: '0.84rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}
                >
                  <FiEye /> View Aadhar Card
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Not Uploaded</span>
              )}
            </div>

            {/* PAN Card Card */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '1rem' }}>3. PAN Card</span>
                {employee.panUrl ? (
                  isImageDoc(employee.panUrl) ? (
                    <img src={employee.panUrl} alt="PAN Card" style={{ width: '140px', height: '85px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto 1.25rem', border: '1px solid #cbd5e1', display: 'block' }} />
                  ) : (
                    <div style={{ padding: '1.25rem', color: '#0284c7', fontWeight: '700', fontSize: '0.9rem', margin: '0 auto 1rem' }}>📄 PAN Document</div>
                  )
                ) : (
                  <div style={{ height: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
                    Not Uploaded
                  </div>
                )}
              </div>
              {employee.panUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewDoc({ title: `PAN Card — ${employee.name}`, url: employee.panUrl, category: 'Identity Documents' })}
                  className="btn-secondary"
                  style={{ fontSize: '0.84rem', padding: '0.45rem 0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}
                >
                  <FiEye /> View PAN Card
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Not Uploaded</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 8: HR LETTERS ── */}
      {activeTab === 'letters' && (
        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiFileText style={{ color: '#f97316' }} /> Official HR Letters & Authorizations
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.86rem', color: '#64748b' }}>Generate official corporate documentation and manage employee portal viewing permissions.</p>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Letter Type</th>
                <th>Title</th>
                <th>Generated Date</th>
                <th>Status</th>
                <th>Portal Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Offer Letter', title: 'Official Offer & Appointment Letter' },
                { type: 'Relieving Letter', title: 'Official Service Relieving Letter' },
                { type: 'Experience Letter', title: 'Official Work Experience Certificate' }
              ].map(letDef => {
                const dbLet = hrLetters.find(l => (l.letterType || '').toLowerCase().includes(letDef.type.toLowerCase().split(' ')[0]));
                const isAccessGranted = dbLet ? dbLet.sentToEmployee : false;

                return (
                  <tr key={letDef.type}>
                    <td><strong>{letDef.type}</strong></td>
                    <td>{dbLet?.title || letDef.title}</td>
                    <td>{dbLet?.createdAt ? new Date(dbLet.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Ready to Generate'}</td>
                    <td>
                      <span className={`status-badge ${dbLet ? 'status-active' : 'status-pending'}`}>
                        {dbLet ? 'Issued' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={isAccessGranted ? 'btn-clock-in' : 'btn-orange'}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                        onClick={async () => {
                          try {
                            const res = await employeesApi.toggleLetterAccess(employee.id, {
                              letterType: letDef.type,
                              sentToEmployee: !isAccessGranted,
                              title: letDef.title
                            });
                            if (res.success) {
                              toast.success(res.message);
                              fetchEmployeeData();
                            }
                          } catch (err) {
                            toast.error('Failed to update employee letter access');
                          }
                        }}
                      >
                        {isAccessGranted ? <><FiCheckCircle /> Access Granted ✅</> : <><FiKey /> Grant Access 🔓</>}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => setLetterViewerType(letDef.type.split(' ')[0])}
                      >
                        <FiEdit2 size={13} /> View & Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Personal Modal */}
      {showEditPersonalModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '680px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Edit Personal & Contact Information</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setShowEditPersonalModal(false)}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSavePersonal}>
              <div className="admin-modal-body detail-form-grid" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-field-group">
                  <label className="form-label">First Name <span className="required-star">*</span></label>
                  <input className="form-control" placeholder="First Name" value={personalForm.firstName} onChange={e => setPersonalForm({...personalForm, firstName: e.target.value})} required />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Last Name <span className="required-star">*</span></label>
                  <input className="form-control" placeholder="Last Name" value={personalForm.lastName} onChange={e => setPersonalForm({...personalForm, lastName: e.target.value})} required />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Official / Primary Phone</label>
                  <input className="form-control" placeholder="Official Phone Number" value={personalForm.phone} onChange={e => setPersonalForm({...personalForm, phone: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Alternate Phone</label>
                  <input className="form-control" placeholder="Alt Phone Number" value={personalForm.altPhone} onChange={e => setPersonalForm({...personalForm, altPhone: e.target.value})} />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Personal Email</label>
                  <input className="form-control" type="email" placeholder="Personal Email Address" value={personalForm.personalEmail} onChange={e => setPersonalForm({...personalForm, personalEmail: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    className="form-control"
                    type="date"
                    min="1950-01-01"
                    max="2035-12-31"
                    style={{ cursor: 'pointer' }}
                    value={personalForm.dob}
                    onChange={e => setPersonalForm({...personalForm, dob: e.target.value})}
                    onClick={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Gender</label>
                  <select className="form-control" value={personalForm.gender} onChange={e => setPersonalForm({...personalForm, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Current Address</label>
                  <textarea className="form-control" rows={2} placeholder="Current Residential Address" value={personalForm.currentAddress} onChange={e => setPersonalForm({...personalForm, currentAddress: e.target.value})} />
                </div>

                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Permanent Address</label>
                  <textarea className="form-control" rows={2} placeholder="Permanent Address" value={personalForm.permanentAddress} onChange={e => setPersonalForm({...personalForm, permanentAddress: e.target.value})} />
                </div>

                <div className="form-field-group">
                  <label className="form-label">City</label>
                  <input className="form-control" placeholder="City" value={personalForm.city} onChange={e => setPersonalForm({...personalForm, city: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">State</label>
                  <input className="form-control" placeholder="State" value={personalForm.state} onChange={e => setPersonalForm({...personalForm, state: e.target.value})} />
                </div>

                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Pincode</label>
                  <input className="form-control" placeholder="Pincode" value={personalForm.pincode} onChange={e => setPersonalForm({...personalForm, pincode: e.target.value})} />
                </div>

                <div style={{ gridColumn: 'span 2', height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }} />
                <h4 style={{ gridColumn: 'span 2', margin: 0, color: '#f97316', fontSize: '0.95rem', fontWeight: '800' }}>Emergency Contact</h4>

                <div className="form-field-group">
                  <label className="form-label">Emergency Contact Name</label>
                  <input className="form-control" placeholder="Contact Person Name" value={personalForm.emergencyContactName} onChange={e => setPersonalForm({...personalForm, emergencyContactName: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Relationship</label>
                  <input className="form-control" placeholder="e.g. Father, Spouse, Guardian" value={personalForm.emergencyRelationship} onChange={e => setPersonalForm({...personalForm, emergencyRelationship: e.target.value})} />
                </div>
                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Emergency Phone</label>
                  <input className="form-control" placeholder="Emergency Phone Number" value={personalForm.emergencyPhone} onChange={e => setPersonalForm({...personalForm, emergencyPhone: e.target.value})} />
                </div>

                <div style={{ gridColumn: 'span 2', height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }} />
                <h4 style={{ gridColumn: 'span 2', margin: 0, color: '#0284c7', fontSize: '0.95rem', fontWeight: '800' }}>Bank & Statutory Information</h4>

                <div className="form-field-group">
                  <label className="form-label">Bank Name</label>
                  <input className="form-control" placeholder="e.g. HDFC Bank, ICICI" value={personalForm.bankName} onChange={e => setPersonalForm({...personalForm, bankName: e.target.value})} />
                </div>

                <div className="form-field-group">
                  <label className="form-label">Account Number</label>
                  <input className="form-control" placeholder="Account Number" value={personalForm.accountNumber} onChange={e => setPersonalForm({...personalForm, accountNumber: e.target.value})} />
                </div>

                <div className="form-field-group">
                  <label className="form-label">IFSC Code</label>
                  <input className="form-control" placeholder="IFSC Code" style={{ textTransform: 'uppercase' }} value={personalForm.ifsc} onChange={e => setPersonalForm({...personalForm, ifsc: e.target.value.toUpperCase()})} />
                </div>

                <div className="form-field-group">
                  <label className="form-label">PAN Card Number</label>
                  <input className="form-control" placeholder="PAN Number" style={{ textTransform: 'uppercase' }} value={personalForm.panNumber} onChange={e => setPersonalForm({...personalForm, panNumber: e.target.value.toUpperCase()})} />
                </div>




              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditPersonalModal(false)}>Cancel</button>
                <button type="submit" className="btn-orange">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employment Modal */}
      {showEditEmpModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Edit Employment Information</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setShowEditEmpModal(false)}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSaveEmp}>
              <div className="admin-modal-body detail-form-grid">
                <div className="form-field-group">
                  <label className="form-label">Employee Code (Emp ID)</label>
                  <input className="form-control" placeholder="e.g. INS001" value={empForm.empId} onChange={e => setEmpForm({...empForm, empId: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Joining Date</label>
                  <input
                    className="form-control"
                    type="date"
                    style={{ cursor: 'pointer' }}
                    value={empForm.joiningDate}
                    onChange={e => setEmpForm({...empForm, joiningDate: e.target.value})}
                    onClick={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Department</label>
                  <input className="form-control" placeholder="Department" value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Designation</label>
                  <input className="form-control" placeholder="Designation" value={empForm.designation} onChange={e => setEmpForm({...empForm, designation: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Reporting Manager</label>
                  <input className="form-control" placeholder="Reporting Manager" value={empForm.reportingManager} onChange={e => setEmpForm({...empForm, reportingManager: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Employment Type</label>
                  <select className="form-control" value={empForm.employmentType} onChange={e => setEmpForm({...empForm, employmentType: e.target.value})}>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div className="form-field-group">
                  <label className="form-label">Work Location</label>
                  <input className="form-control" placeholder="Work Location" value={empForm.workLocation} onChange={e => setEmpForm({...empForm, workLocation: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Work Mode</label>
                  <select className="form-control" value={empForm.workMode} onChange={e => setEmpForm({...empForm, workMode: e.target.value})}>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Shift Timings</label>
                  <input className="form-control" placeholder="e.g. Standard Shift (10:00 AM - 7:00 PM)" value={empForm.shift} onChange={e => setEmpForm({...empForm, shift: e.target.value})} />
                </div>
                <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Status</label>
                  <select className="form-control" value={empForm.status} onChange={e => setEmpForm({...empForm, status: e.target.value})}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Probation">Probation</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditEmpModal(false)}>Cancel</button>
                <button type="submit" className="btn-orange">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {showPayslipModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '560px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Issue Salary Slip</h3>
              <button type="button" className="admin-modal-close-btn" onClick={() => setShowPayslipModal(false)}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleIssuePayslip}>
              <div className="admin-modal-body detail-form-grid">
                <div className="form-field-group">
                  <label className="form-label">Month</label>
                  <input className="form-control" placeholder="Month" value={payslipForm.month} onChange={e => setPayslipForm({...payslipForm, month: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Year</label>
                  <input className="form-control" placeholder="Year" type="number" value={payslipForm.year} onChange={e => setPayslipForm({...payslipForm, year: parseInt(e.target.value, 10)})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Basic Pay (₹)</label>
                  <input className="form-control" placeholder="Basic Pay" value={payslipForm.basicPay} onChange={e => setPayslipForm({...payslipForm, basicPay: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Allowances (₹)</label>
                  <input className="form-control" placeholder="Allowances" value={payslipForm.allowances} onChange={e => setPayslipForm({...payslipForm, allowances: e.target.value})} />
                </div>
                <div className="form-field-group">
                  <label className="form-label">Deductions (₹)</label>
                  <input className="form-control" placeholder="Deductions" value={payslipForm.deductions} onChange={e => setPayslipForm({...payslipForm, deductions: e.target.value})} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPayslipModal(false)}>Cancel</button>
                <button type="submit" className="btn-orange">Issue Salary Slip</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Letter Viewers */}
      {letterViewerType === 'Offer' && (
        <OfferLetter employee={employee} onClose={() => setLetterViewerType(null)} />
      )}
      {letterViewerType === 'Relieving' && (
        <RelievingLetter employee={employee} onClose={() => setLetterViewerType(null)} />
      )}
      {letterViewerType === 'Experience' && (
        <ExperienceLetter employee={employee} onClose={() => setLetterViewerType(null)} />
      )}
      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="admin-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="admin-modal" style={{ maxWidth: '850px', width: '92%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
              <div>
                <h3 className="admin-modal-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  {previewDoc.title || 'Document Viewer'}
                </h3>
                {previewDoc.category && (
                  <span className="status-badge status-active" style={{ background: '#e0f2fe', color: '#0369a1', marginTop: '4px', display: 'inline-block' }}>
                    {previewDoc.category}
                  </span>
                )}
              </div>
              <button type="button" className="admin-modal-close-btn" onClick={() => setPreviewDoc(null)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '340px', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', margin: '1rem 0' }}>
              {previewDoc.url ? (
                isImageDoc(previewDoc.url) ? (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title}
                    style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                  />
                ) : isPdfDoc(previewDoc.url) ? (
                  <iframe
                    src={pdfBlobUrl || previewDoc.url}
                    title={previewDoc.title}
                    style={{ width: '100%', height: '65vh', border: 'none', borderRadius: '8px' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <FiFileText style={{ fontSize: '3.5rem', color: '#0284c7', marginBottom: '1rem' }} />
                    <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>{previewDoc.title}</h4>
                    <p style={{ fontWeight: '600', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Preview is ready for download or external viewing.
                    </p>
                    <button className="btn-orange" onClick={() => downloadFile(previewDoc.url, previewDoc.title)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FiDownload /> Download File
                    </button>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  <FiAlertCircle size={36} style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: '600' }}>No document file content available to preview.</p>
                </div>
              )}
            </div>

            <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setPreviewDoc(null)}>Close</button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => openInNewTab(previewDoc.url)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <FiExternalLink /> Open in New Tab
                </button>
                <button
                  type="button"
                  className="btn-orange"
                  onClick={() => downloadFile(previewDoc.url, previewDoc.title)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        title={confirmModal.title}
        message={confirmModal.message}
        type="confirm"
        confirmText="Confirm"
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
