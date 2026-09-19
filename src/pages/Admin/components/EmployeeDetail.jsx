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
  const [payslipForm, setPayslipForm] = useState({ month: 'September', year: 2026, basicPay: '', hra: '0', allowances: '0', deductions: '0' });

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
    <div className="employee-detail-wrapper" style={{ padding: '1.5rem' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn-secondary" onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FiChevronLeft /> Back to Employee List
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
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
            style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
      <div className="admin-table-container" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', border: '2px solid #bae6fd', overflow: 'hidden' }}>
            {employee.photoUrl ? (
              <img src={employee.photoUrl} alt={employee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              employee.name.charAt(0)
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{employee.name}</h2>
              <span className={`status-badge status-${(employee.status || 'Active').toLowerCase().replace(' ', '-')}`}>
                {employee.status || 'Active'}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0', color: '#475569', fontWeight: '600' }}>
              {employee.designation || 'Specialist'} &bull; <span style={{ color: '#0284c7' }}>{employee.department || 'IT'}</span>
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <span><FiUser /> Emp ID: <strong>{formatEmpId(employee.empId, employee.id)}</strong></span>
              <span><FiMail /> {employee.email}</span>
              <span><FiPhone /> {employee.phone || 'N/A'}</span>
              <span><FiCalendar /> Joined: {new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="stat-card" style={{ padding: '1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Leave Balance</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f97316', margin: '0.5rem 0 0' }}>18 / 24 Days</h3>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Attendance Logs</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', margin: '0.5rem 0 0' }}>{presentCount} Days Present</h3>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Verification Documents</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7', margin: '0.5rem 0 0' }}>
                {[employee.photoUrl, employee.aadharUrl, employee.panUrl].filter(Boolean).length} / 3 Uploaded
              </h3>
            </div>
            <div className="stat-card" style={{ padding: '1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Pending Requests</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', margin: '0.5rem 0 0' }}>{employeeRequests.filter(r => r.status === 'Pending').length} Action Items</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0f172a' }}>Employment Summary</h4>
              <p><strong>Reporting Manager:</strong> {employee.reportingManager || 'HR Manager'}</p>
              <p><strong>Employment Type:</strong> {employee.employmentType || 'Full-Time'}</p>
              <p><strong>Work Mode:</strong> {employee.workMode || 'On-site'} ({employee.workLocation || 'Mumbai Office'})</p>
              <p><strong>Shift:</strong> {employee.shift || 'General (9:30 AM - 6:30 PM)'}</p>
            </div>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#0f172a' }}>Payroll Overview</h4>
              <p><strong>Monthly Gross Salary:</strong> ₹{Number(employee.salary || 0).toLocaleString('en-IN')}</p>
              <p><strong>Basic Salary:</strong> ₹{Number(employee.basicSalary || 0).toLocaleString('en-IN')}</p>
              <p><strong>Bank Account:</strong> {employee.bankName ? `${employee.bankName} (A/C: ${employee.accountNumber})` : 'Not Configured'}</p>
              <p><strong>PAN Card:</strong> {employee.panNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PERSONAL INFO ── */}
      {activeTab === 'personal' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Personal Details</h3>
            <button className="btn-secondary" onClick={() => setShowEditPersonalModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <FiEdit2 /> Edit Personal & Bank Info
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
            <p><strong>Full Name:</strong> {employee.name}</p>
            <p><strong>Personal Email:</strong> {employee.personalEmail || employee.email}</p>
            <p><strong>Official Phone:</strong> {employee.phone}</p>
            <p><strong>Alternate Phone:</strong> {employee.altPhone || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Gender:</strong> {employee.gender || 'Male'}</p>
            <p style={{ gridColumn: 'span 2' }}><strong>Current Address:</strong> {employee.currentAddress || employee.address || 'N/A'}</p>
            <p style={{ gridColumn: 'span 2' }}><strong>Permanent Address:</strong> {employee.permanentAddress || employee.address || 'N/A'}</p>
            <p><strong>Emergency Contact Name:</strong> {employee.emergencyContactName || 'N/A'}</p>
            <p><strong>Emergency Contact Phone:</strong> {employee.emergencyPhone || 'N/A'}</p>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#0284c7', fontSize: '1.05rem', fontWeight: '800' }}>🏦 Bank Account & Statutory Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0 }}><strong>Bank Name:</strong> <strong style={{ color: employee.bankName ? '#0f172a' : '#ef4444' }}>{employee.bankName || 'Not Provided'}</strong></p>
              <p style={{ margin: 0 }}><strong>Account Number:</strong> <strong style={{ color: employee.accountNumber ? '#0f172a' : '#ef4444' }}>{employee.accountNumber || 'Not Provided'}</strong></p>
              <p style={{ margin: 0 }}><strong>IFSC Code:</strong> <strong style={{ color: employee.ifsc ? '#0f172a' : '#ef4444' }}>{employee.ifsc || 'Not Provided'}</strong></p>
              <p style={{ margin: 0 }}><strong>PAN Card Number:</strong> <strong style={{ color: employee.panNumber ? '#0f172a' : '#ef4444' }}>{employee.panNumber || 'Not Provided'}</strong></p>

            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EMPLOYMENT ── */}
      {activeTab === 'employment' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Employment Information</h3>
            <button className="btn-secondary" onClick={() => setShowEditEmpModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <FiEdit2 /> Edit Employment Info
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <p><strong>Employee ID:</strong> {formatEmpId(employee.empId, employee.id)}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Designation:</strong> {employee.designation}</p>
            <p><strong>Reporting Manager:</strong> {employee.reportingManager}</p>
            <p><strong>Joining Date:</strong> {new Date(employee.joinDate).toLocaleDateString()}</p>
            <p><strong>Confirmation Date:</strong> {employee.confirmationDate ? new Date(employee.confirmationDate).toLocaleDateString() : 'Pending Confirmation'}</p>
            <p><strong>Employment Type:</strong> {employee.employmentType}</p>
            <p><strong>Work Location:</strong> {employee.workLocation}</p>
            <p><strong>Work Mode:</strong> {employee.workMode}</p>
            <p><strong>Probation Period:</strong> {employee.probationPeriod}</p>
            <p><strong>Status:</strong> <span className={`status-badge status-${(employee.status || 'Active').toLowerCase()}`}>{employee.status}</span></p>
          </div>
        </div>
      )}

      {/* ── TAB 4: ATTENDANCE ── */}
      {activeTab === 'attendance' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiClock style={{ color: '#0284c7' }} /> Attendance Logs & History
          </h3>

          {/* Year-Wise, Month-Wise, Calendar Date & Status Filter Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar style={{ color: '#0284c7' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Year:</span>
              <select
                value={attYearFilter}
                onChange={e => setAttYearFilter(e.target.value)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#fff' }}
              >
                <option value="All">All Years</option>
                {getYearOptions().map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar style={{ color: '#0284c7' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Month:</span>
              <select
                value={attMonthFilter}
                onChange={e => setAttMonthFilter(e.target.value)}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#fff' }}
              >
                <option value="All">All Months (Real-time Logs)</option>
                {getMonthOptions().map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar style={{ color: '#0284c7' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#334155', whiteSpace: 'nowrap' }}>Date:</span>
              <input
                type="date"
                value={attDateFilter}
                onChange={e => setAttDateFilter(e.target.value)}
                style={{ padding: '0.4rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', background: '#fff' }}
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
                  if (attYearFilter !== 'All') {
                    if (d.getFullYear() !== parseInt(attYearFilter, 10)) {
                      return false;
                    }
                  }
                  if (attMonthFilter !== 'All') {
                    const [y, m] = attMonthFilter.split('-');
                    if (d.getFullYear() !== parseInt(y, 10) || (d.getMonth() + 1) !== parseInt(m, 10)) {
                      return false;
                    }
                  }
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
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No attendance records match the selected month / filters.
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
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem', color: '#0f172a' }}>Leave Applications & Balances</h3>
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
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge status-${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="btn-secondary" style={{ color: '#10b981', padding: '0.25rem 0.5rem' }} onClick={() => handleLeaveAction(leave.id, 'Approved')}>Approve</button>
                          <button className="btn-secondary" style={{ color: '#ef4444', padding: '0.25rem 0.5rem' }} onClick={() => handleLeaveAction(leave.id, 'Rejected')}>Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8' }}>No leave requests submitted.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 6: PAYROLL ── */}
      {activeTab === 'payroll' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Salary & Payslips</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowEditPayrollModal(true)}><FiEdit2 /> Edit Structure</button>
              <button className="btn-orange" onClick={() => setShowPayslipModal(true)}><FiPlus /> Issue Payslip</button>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}><strong>Gross Monthly Salary:</strong> ₹{Number(employee.salary || 0).toLocaleString('en-IN')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.9rem' }}>
              <div><span>Basic:</span> <strong>₹{Number(employee.basicSalary || 0).toLocaleString('en-IN')}</strong></div>
              <div><span>HRA:</span> <strong>₹{Number(employee.hra || 0).toLocaleString('en-IN')}</strong></div>
              <div><span>Allowances:</span> <strong>₹{Number(employee.allowances || 0).toLocaleString('en-IN')}</strong></div>
              <div><span>Deductions:</span> <strong>₹{Number(employee.deductions || 0).toLocaleString('en-IN')}</strong></div>
            </div>
          </div>

          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #bae6fd' }}>
            <h4 style={{ margin: '0 0 0.75rem', color: '#0369a1', fontSize: '1rem' }}>🏦 Bank Account & Statutory Info (From Employee Portal)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#64748b' }}>Bank Name:</span> <strong style={{ color: '#0f172a' }}>{employee.bankName || 'Not Provided'}</strong></div>
              <div><span style={{ color: '#64748b' }}>Account Number:</span> <strong style={{ color: '#0f172a' }}>{employee.accountNumber || 'Not Provided'}</strong></div>
              <div><span style={{ color: '#64748b' }}>IFSC Code:</span> <strong style={{ color: '#0f172a' }}>{employee.ifsc || 'Not Provided'}</strong></div>
              <div><span style={{ color: '#64748b' }}>PAN Number:</span> <strong style={{ color: '#0f172a' }}>{employee.panNumber || 'Not Provided'}</strong></div>

            </div>
          </div>

          <h4 style={{ margin: '1rem 0 0.5rem' }}>Historical Issued Payslips</h4>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Month/Year</th>
                <th>Basic Pay</th>
                <th>HRA</th>
                <th>Net Salary</th>
                <th>Issued On</th>
              </tr>
            </thead>
            <tbody>
              {salarySlips.length > 0 ? (
                salarySlips.map((slip) => (
                  <tr key={slip.id}>
                    <td><strong>{slip.month} {slip.year}</strong></td>
                    <td>₹{Number(slip.basicPay).toLocaleString('en-IN')}</td>
                    <td>₹{Number(slip.hra).toLocaleString('en-IN')}</td>
                    <td><strong style={{ color: '#10b981' }}>₹{Number(slip.netSalary).toLocaleString('en-IN')}</strong></td>
                    <td>{new Date(slip.issuedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8' }}>No salary slips issued yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB 7: DOCUMENTS ── */}
      {activeTab === 'documents' && (
        <div style={{ background: '#fff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: '800' }}>
              Employee Verification Documents
            </h3>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.86rem' }}>
              Identity proofs and profile photo uploaded by the employee.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {/* Profile Photo */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '0.85rem' }}>1. Profile Photo</span>
              {employee.photoUrl ? (
                <div>
                  <img src={employee.photoUrl} alt="Profile Photo" style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 1rem', border: '3px solid #0284c7', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({ title: `Profile Photo — ${employee.name}`, url: employee.photoUrl, category: 'Identity Documents' })}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                  >
                    <FiEye /> View Photo
                  </button>
                </div>
              ) : (
                <div style={{ padding: '1.5rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Not Uploaded</p>
                </div>
              )}
            </div>

            {/* Aadhar Card */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '0.85rem' }}>2. Aadhar Card</span>
              {employee.aadharUrl ? (
                <div>
                  {isImageDoc(employee.aadharUrl) ? (
                    <img src={employee.aadharUrl} alt="Aadhar Card" style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto 1rem', border: '1px solid #cbd5e1', display: 'block' }} />
                  ) : (
                    <div style={{ padding: '0.85rem', color: '#0284c7', fontWeight: '700', fontSize: '0.9rem', margin: '0 auto 1rem' }}>📄 Aadhar Document</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({ title: `Aadhar Card — ${employee.name}`, url: employee.aadharUrl, category: 'Identity Documents' })}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                  >
                    <FiEye /> View Aadhar Card
                  </button>
                </div>
              ) : (
                <div style={{ padding: '1.5rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Not Uploaded</p>
                </div>
              )}
            </div>

            {/* PAN Card */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '0.85rem' }}>3. PAN Card</span>
              {employee.panUrl ? (
                <div>
                  {isImageDoc(employee.panUrl) ? (
                    <img src={employee.panUrl} alt="PAN Card" style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto 1rem', border: '1px solid #cbd5e1', display: 'block' }} />
                  ) : (
                    <div style={{ padding: '0.85rem', color: '#0284c7', fontWeight: '700', fontSize: '0.9rem', margin: '0 auto 1rem' }}>📄 PAN Document</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({ title: `PAN Card — ${employee.name}`, url: employee.panUrl, category: 'Identity Documents' })}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                  >
                    <FiEye /> View PAN Card
                  </button>
                </div>
              ) : (
                <div style={{ padding: '1.5rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>Not Uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 8: HR LETTERS ── */}
      {activeTab === 'letters' && (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, color: '#0f172a' }}>HR Letters & Authorizations</h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>Generate official letters & grant direct access for the employee to view & download from their portal.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => setLetterViewerType('Offer')}>Offer Letter</button>
              <button className="btn-secondary" onClick={() => setLetterViewerType('Relieving')}>Relieving Letter</button>
              <button className="btn-secondary" onClick={() => setLetterViewerType('Experience')}>Experience Letter</button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Letter Type</th>
                <th>Title</th>
                <th>Generated On</th>
                <th>Status</th>
                <th>Employee Portal Access</th>
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
                    <td>{dbLet?.createdAt ? new Date(dbLet.createdAt).toLocaleDateString() : 'Ready to Generate'}</td>
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
                        {isAccessGranted ? <><FiCheckCircle /> Access Granted ✅</> : <><FiKey /> Grant Employee Access 🔓</>}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => setLetterViewerType(letDef.type.split(' ')[0])}
                      >
                        View & Edit Letter
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
              <div className="admin-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem', maxHeight: '70vh', overflowY: 'auto' }}>
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
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Date of Birth</span>
                    <select
                      style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f0f9ff', color: '#0284c7', fontWeight: '600' }}
                      value={personalForm.dob ? personalForm.dob.split('-')[0] : ''}
                      onChange={e => {
                        const yr = e.target.value;
                        if (!yr) return;
                        const parts = (personalForm.dob || '').split('-');
                        const month = parts[1] || '01';
                        const day = parts[2] || '01';
                        setPersonalForm({ ...personalForm, dob: `${yr}-${month}-${day}` });
                      }}
                    >
                      <option value="">Quick Year Select...</option>
                      {Array.from({ length: 77 }, (_, i) => 2026 - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </label>
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
              <div className="admin-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
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
              <div className="admin-modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
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
                  <label className="form-label">HRA (₹)</label>
                  <input className="form-control" placeholder="HRA" value={payslipForm.hra} onChange={e => setPayslipForm({...payslipForm, hra: e.target.value})} />
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
