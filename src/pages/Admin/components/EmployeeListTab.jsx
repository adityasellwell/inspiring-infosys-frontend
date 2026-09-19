import React, { useState } from 'react';
import { FiDownload, FiPlus, FiKey, FiTrash2, FiUsers, FiUserCheck, FiCalendar, FiClock, FiUserPlus, FiFileText } from 'react-icons/fi';
import EmployeeDetail from './EmployeeDetail';
import EmployeeRequestsHub from './EmployeeRequestsHub';
import QueriesManagerTab from './QueriesManagerTab';
import LeavesManagerTab from './LeavesManagerTab';
import AttendanceLogsTab from './AttendanceLogsTab';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import Modal from '../../../components/common/Modal';

import { formatEmpId, generateNextEmpId } from './empUtils';
export { formatEmpId, generateNextEmpId };

export default function EmployeeListTab({
  employeesList,
  dashboardMetrics,
  empAttendanceList,
  empLeavesList,
  setEmpLeavesList,
  empQueriesList,
  setEmpQueriesList,
  fetchAllData,
  setCredentialsModal,
  empSubTab: empSubTabProp,
  setEmpSubTab: setEmpSubTabProp
}) {
  const toast = useToast();
  const [selectedEmployeeDetailId, setSelectedEmployeeDetailId] = useState(null);
  const [selectedEmployeeObj, setSelectedEmployeeObj] = useState(null);
  const [selectedEmployeeDetailTab, setSelectedEmployeeDetailTab] = useState('overview');
  const [localEmpSubTab, setLocalEmpSubTab] = useState('all'); // 'all' | 'add' | 'requests' | 'attendance' | 'leave' | 'queries' | 'payroll'

  const empSubTab = empSubTabProp !== undefined ? empSubTabProp : localEmpSubTab;
  const setEmpSubTab = setEmpSubTabProp || setLocalEmpSubTab;

  // Filters for Employees List
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('All');
  const [empDesigFilter, setEmpDesigFilter] = useState('All');
  const [empTypeFilter, setEmpTypeFilter] = useState('All');
  const [empStatusFilter, setEmpStatusFilter] = useState('All');
  const [employeeSubmitting, setEmployeeSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const [customDepts, setCustomDepts] = useState([]);
  const [customDesigs, setCustomDesigs] = useState([]);
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [isCustomDesig, setIsCustomDesig] = useState(false);

  // Dynamically extract all unique Departments and Designations from employee list + defaults + custom additions
  const availableDepartments = React.useMemo(() => {
    const defaults = ['IT', 'E-Commerce', 'Development', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
    const empDepts = (employeesList || []).map(e => (e.department || '').trim()).filter(Boolean);
    return Array.from(new Set([...defaults, ...empDepts, ...customDepts])).sort();
  }, [employeesList, customDepts]);

  const availableDesignations = React.useMemo(() => {
    const defaults = [
      'Software Engineer',
      'Senior Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Marketplace Specialist',
      'UI/UX Designer',
      'HR Manager',
      'Project Manager',
      'Team Lead'
    ];
    const empDesigs = (employeesList || []).map(e => (e.designation || '').trim()).filter(Boolean);
    return Array.from(new Set([...defaults, ...empDesigs, ...customDesigs])).sort();
  }, [employeesList, customDesigs]);

  const handleDeleteEmployeeRow = (employee) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Staff Member',
      message: `Are you sure you want to PERMANENTLY delete ${employee.name} (${formatEmpId(employee.empId, employee.id)})? All associated employee records will be permanently removed.`,
      onConfirm: async () => {
        try {
          const res = await employeesApi.delete(employee.id || employee.empId, true);
          if (res && res.success) {
            toast.success(res.message || 'Employee permanently deleted.');
            if (fetchAllData) fetchAllData();
          } else {
            toast.error(res?.message || 'Failed to delete employee.');
          }
        } catch (err) {
          toast.error('Failed to delete employee.');
        } finally {
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
        }
      }
    });
  };

  // Structured Add Employee Form State
  const [addEmpForm, setAddEmpForm] = useState({
    firstName: '', middleName: '', lastName: '', name: '',
    personalEmail: '', email: '', phone: '', altPhone: '',
    dob: '', gender: 'Male', photoUrl: '',
    currentAddress: '', permanentAddress: '', sameAsCurrent: true,
    city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode: '',
    emergencyContactName: '', emergencyRelationship: '', emergencyPhone: '', emergencyAltPhone: '',
    empId: '', department: 'IT', designation: 'Software Engineer',
    reportingManager: 'HR Manager', joinDate: new Date().toISOString().split('T')[0], confirmationDate: '',
    employmentType: 'Full-Time', workLocation: 'Mumbai Office', workMode: 'On-site',
    shift: 'Standard Shift (10:00 AM - 7:00 PM)', probationPeriod: '3 Months', status: 'Active',
    salary: '', salaryStructure: 'Standard Corporate', basicSalary: '', hra: '', allowances: '0', deductions: '0',
    bankName: '', accountNumber: '', ifsc: '', panNumber: '', uanNumber: '', taxInfo: 'New Tax Regime', password: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const focusField = (fieldKey, errorMsg) => {
    setFormErrors({ [fieldKey]: errorMsg });
    toast.warning(errorMsg);
    setTimeout(() => {
      const el = document.getElementById(`input-${fieldKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 50);
  };

  React.useEffect(() => {
    if (empSubTab === 'add' && !addEmpForm.empId) {
      setAddEmpForm(prev => ({ ...prev, empId: generateNextEmpId(employeesList) }));
    }
  }, [empSubTab, employeesList]);

  React.useEffect(() => {
    setSelectedEmployeeDetailId(null);
    setSelectedEmployeeObj(null);
  }, [empSubTabProp]);

  const handleExportEmployeesCSV = () => {
    if (!employeesList || employeesList.length === 0) {
      toast.warning('No employee data available to export.');
      return;
    }
    const headers = ['Emp ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date', 'Salary', 'Status'];
    const rows = employeesList.map(e => [
      `"${formatEmpId(e.empId, e.id)}"`,
      `"${e.name || ''}"`,
      `"${e.email || ''}"`,
      `"${e.phone || ''}"`,
      `"${e.department || ''}"`,
      `"${e.designation || ''}"`,
      `"${e.joinDate ? new Date(e.joinDate).toLocaleDateString() : ''}"`,
      `"${e.salary || 0}"`,
      `"${e.status || 'Active'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `employees_master_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewCredentials = async (employee) => {
    const targetEmpId = formatEmpId(employee.empId, employee.id);
    try {
      const res = await employeesApi.resetPassword(employee.id || employee.empId, 'Inspire#2026');
      setCredentialsModal({
        empId: targetEmpId,
        name: employee.name,
        email: employee.email,
        password: (res && res.data && res.data.password) || 'Inspire#2026',
        designation: employee.designation
      });
    } catch (err) {
      setCredentialsModal({
        empId: targetEmpId,
        name: employee.name,
        email: employee.email,
        password: 'Inspire#2026',
        designation: employee.designation
      });
    }
  };

  // Calculate On Leave count dynamically from approved leave applications & employee status
  const approvedOnLeaveCount = new Set(
    (empLeavesList || [])
      .filter(l => (l.status || '').toLowerCase() === 'approved')
      .map(l => l.employeeId || l.employee?.id || l.employee?.empId)
  ).size;

  const statusOnLeaveCount = (employeesList || []).filter(e => (e.status || '').toLowerCase() === 'on leave').length;

  const calculatedOnLeave = Math.max(
    dashboardMetrics?.onLeaveEmployees || 0,
    approvedOnLeaveCount,
    statusOnLeaveCount
  );

  const pendingLeavesCount = (empLeavesList || []).filter(l => (l.status || 'Pending').toLowerCase() === 'pending').length;
  const pendingQueriesCount = (empQueriesList || []).filter(q => (q.status || 'Pending').toLowerCase() === 'pending').length;
  const calculatedPendingRequests = pendingLeavesCount + pendingQueriesCount;

  return (
    <div className="admin-employees-tab-pane">
      {selectedEmployeeDetailId ? (
        <EmployeeDetail
          employeeId={selectedEmployeeDetailId}
          initialEmployee={selectedEmployeeObj || (employeesList || []).find(e => String(e.id) === String(selectedEmployeeDetailId) || String(e.empId) === String(selectedEmployeeDetailId))}
          initialTab={selectedEmployeeDetailTab || 'overview'}
          onBack={() => { setSelectedEmployeeDetailId(null); setSelectedEmployeeObj(null); }}
          onUpdate={fetchAllData}
          setCredentialsModal={setCredentialsModal}
        />
      ) : (
        <div>
          {/* Top Dashboard Header (Shown only on All Employees main tab) */}
          {empSubTab === 'all' && (
            <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: '1 1 auto', minWidth: '0' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Employees</h1>
                <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                  Manage employee profiles, employment information, documents, attendance, leave, payroll and employee requests.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, marginLeft: 'auto', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleExportEmployeesCSV}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  <FiDownload /> Export CSV
                </button>
                <button
                  type="button"
                  className="btn-orange"
                  onClick={() => setEmpSubTab('add')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  <FiPlus /> Add Employee
                </button>
              </div>
            </div>
          )}

          {/* Summary Metric Cards (Shown only on All Employees main tab) */}
          {empSubTab === 'all' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Total Employees</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{(employeesList || []).length}</h3>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f1f5f9', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiUsers size={19} />
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Active Employees</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0 0' }}>{(employeesList || []).filter(e => (e.status || 'Active').toLowerCase() === 'active').length}</h3>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiUserCheck size={19} />
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>On Leave</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f97316', margin: '0.2rem 0 0' }}>{calculatedOnLeave}</h3>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiCalendar size={19} />
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Pending Requests</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', margin: '0.2rem 0 0' }}>{calculatedPendingRequests}</h3>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiClock size={19} />
                </div>
              </div>

              <div className="stat-card" style={{ padding: '0.9rem 1.1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>New Joiners</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7', margin: '0.2rem 0 0' }}>{(employeesList || []).filter(e => e.joinDate && new Date(e.joinDate) >= new Date(Date.now() - 30 * 86400000)).length}</h3>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiUserPlus size={19} />
              </div>
            </div>
          )}

          {/* SUB TAB: ALL EMPLOYEES */}
          {empSubTab === 'all' && (
            <div>
              {/* Filter & Search Bar */}
              <div className="admin-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem', background: '#fff', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search by Name, Emp ID, Email..."
                  value={empSearch}
                  onChange={e => setEmpSearch(e.target.value)}
                  style={{ flex: '2 1 180px', minWidth: '160px', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <select value={empDeptFilter} onChange={e => setEmpDeptFilter(e.target.value)} style={{ flex: '1 1 120px', minWidth: '110px', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="All">All Departments</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select value={empDesigFilter} onChange={e => setEmpDesigFilter(e.target.value)} style={{ flex: '1 1 120px', minWidth: '110px', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="All">All Designations</option>
                  {availableDesignations.map(desig => (
                    <option key={desig} value={desig}>{desig}</option>
                  ))}
                </select>
                <select value={empTypeFilter} onChange={e => setEmpTypeFilter(e.target.value)} style={{ flex: '1 1 120px', minWidth: '110px', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="All">All Employment Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
                <select value={empStatusFilter} onChange={e => setEmpStatusFilter(e.target.value)} style={{ flex: '1 1 110px', minWidth: '100px', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Probation">Probation</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Employee Data Table */}
              <div className="admin-card employee-list-card" style={{ padding: '0.75rem' }}>
                <div className="table-responsive" style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <table className="admin-table" style={{ width: '100%', minWidth: '850px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', width: '70px', whiteSpace: 'nowrap' }}>Emp ID</th>
                        <th style={{ textAlign: 'left', minWidth: '150px', whiteSpace: 'nowrap' }}>Employee Name</th>
                        <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>Department</th>
                        <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>Designation</th>
                        <th style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>Manager</th>
                        <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Type</th>
                        <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Join Date</th>
                        <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Status</th>
                        <th style={{ textAlign: 'center', width: '110px', whiteSpace: 'nowrap' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(employeesList || [])
                        .filter(emp => {
                          const q = (empSearch || '').toLowerCase().trim();
                          const matchesSearch = !q || (emp.name && emp.name.toLowerCase().includes(q)) ||
                            (emp.empId && emp.empId.toLowerCase().includes(q)) ||
                            (emp.email && emp.email.toLowerCase().includes(q));
                          const matchesDept = empDeptFilter === 'All' || emp.department === empDeptFilter;
                          const matchesDesig = empDesigFilter === 'All' || emp.designation === empDesigFilter;
                          const matchesType = empTypeFilter === 'All' || (emp.employmentType || 'Full-Time') === empTypeFilter;
                          const matchesStatus = empStatusFilter === 'All' || emp.status === empStatusFilter;
                          return matchesSearch && matchesDept && matchesDesig && matchesType && matchesStatus;
                        })
                        .map((employee) => (
                          <tr key={employee.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedEmployeeDetailTab('overview'); setSelectedEmployeeDetailId(employee.id); setSelectedEmployeeObj(employee); }}>
                            <td style={{ textAlign: 'left', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>{formatEmpId(employee.empId, employee.id)}</td>
                            <td style={{ textAlign: 'left' }}>
                              <strong style={{ color: '#0284c7', display: 'block', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{employee.name}</strong>
                              <div style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap' }}>{employee.email}</div>
                            </td>
                            <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{employee.department}</td>
                            <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{employee.designation}</td>
                            <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{employee.reportingManager || 'HR Manager'}</td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569', padding: '0.18rem 0.5rem', borderRadius: '6px', fontSize: '0.74rem', fontWeight: '600', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                {employee.employmentType || 'Full-Time'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : '-'}</td>
                            <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <span className={`status-badge status-${(employee.status || 'Active').toLowerCase().replace(' ', '-')}`} style={{ whiteSpace: 'nowrap' }}>
                                {employee.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: '0.18rem 0.55rem', fontSize: '0.75rem', width: '100%', maxWidth: '95px', textAlign: 'center' }}
                                  onClick={() => { setSelectedEmployeeDetailTab('overview'); setSelectedEmployeeDetailId(employee.id); setSelectedEmployeeObj(employee); }}
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: '0.18rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', width: '100%', maxWidth: '95px', whiteSpace: 'nowrap' }}
                                  onClick={() => handleViewCredentials(employee)}
                                >
                                  <FiKey size={11} /> Credentials
                                </button>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{ padding: '0.18rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', width: '100%', maxWidth: '95px', whiteSpace: 'nowrap' }}
                                  onClick={() => handleDeleteEmployeeRow(employee)}
                                >
                                  <FiTrash2 size={11} /> Delete
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

          {/* SUB TAB: ADD EMPLOYEE STRUCTURED FORM */}
          {empSubTab === 'add' && (
            <div className="admin-card" style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 1.25rem' }}>+ Add New Employee Master Record</h2>

              <form noValidate onSubmit={async (e) => {
                e.preventDefault();

                // Form Field Validations
                const firstName = (addEmpForm.firstName || '').trim();
                const lastName = (addEmpForm.lastName || '').trim();
                const email = (addEmpForm.personalEmail || addEmpForm.email || '').trim().toLowerCase();
                const phone = (addEmpForm.phone || '').replace(/\D/g, '');
                const currentAddress = (addEmpForm.currentAddress || '').trim();
                const salary = parseFloat(addEmpForm.salary);

                // Multi-Field Validation Collector
                const newErrors = {};

                if (firstName.length < 2) {
                  newErrors.firstName = 'First Name is too short (min 2 letters).';
                }
                if (lastName.length < 2) {
                  newErrors.lastName = 'Last Name is too short (min 2 letters).';
                }
                if (!email) {
                  newErrors.personalEmail = 'Email address is required.';
                } else if (!email.includes('@')) {
                  newErrors.personalEmail = 'Invalid Email: "@" symbol is missing.';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  newErrors.personalEmail = 'Invalid Email: domain extension missing (e.g. .com).';
                }
                if (!phone || phone.length !== 10) {
                  newErrors.phone = 'Mobile Phone must be 10 digits.';
                }
                if (!currentAddress || currentAddress.length < 5) {
                  newErrors.currentAddress = 'Current Address is required.';
                }
                if (!addEmpForm.empId || !addEmpForm.empId.trim()) {
                  newErrors.empId = 'Employee ID is required.';
                }
                if (!addEmpForm.department || !addEmpForm.department.trim()) {
                  newErrors.department = 'Department is required.';
                }
                if (!addEmpForm.designation || !addEmpForm.designation.trim()) {
                  newErrors.designation = 'Designation is required.';
                }
                if (!salary || isNaN(salary) || salary <= 0) {
                  newErrors.salary = 'Monthly Salary must be greater than 0.';
                }
                if (addEmpForm.pincode && !/^\d{6}$/.test(addEmpForm.pincode.trim())) {
                  newErrors.pincode = 'Pincode must be 6 digits.';
                }
                if (addEmpForm.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(addEmpForm.panNumber.trim())) {
                  newErrors.panNumber = 'Invalid PAN format (e.g. ABCDE1234F).';
                }
                if (addEmpForm.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(addEmpForm.ifsc.trim())) {
                  newErrors.ifsc = 'Invalid IFSC format (e.g. SBIN0001234).';
                }

                if (Object.keys(newErrors).length > 0) {
                  setFormErrors(newErrors);
                  const errKeys = Object.keys(newErrors);
                  const firstKey = errKeys[0];
                  const count = errKeys.length;

                  toast.warning(
                    count === 1
                      ? newErrors[firstKey]
                      : `Please fix the ${count} highlighted errors below.`
                  );

                  setTimeout(() => {
                    const el = document.getElementById(`input-${firstKey}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.focus();
                    }
                  }, 50);

                  return;
                }

                setEmployeeSubmitting(true);
                try {
                  const payload = {
                    ...addEmpForm,
                    name: `${firstName} ${lastName}`.trim(),
                    email,
                    phone,
                    panNumber: (addEmpForm.panNumber || '').toUpperCase().trim(),
                    ifsc: (addEmpForm.ifsc || '').toUpperCase().trim()
                  };
                  const res = await employeesApi.create(payload);
                  if (res.success) {
                    toast.success('Employee added successfully to Master Database!');
                    if (addEmpForm.department && !customDepts.includes(addEmpForm.department.trim())) {
                      setCustomDepts(prev => [...prev, addEmpForm.department.trim()]);
                    }
                    if (addEmpForm.designation && !customDesigs.includes(addEmpForm.designation.trim())) {
                      setCustomDesigs(prev => [...prev, addEmpForm.designation.trim()]);
                    }
                    setIsCustomDept(false);
                    setIsCustomDesig(false);
                    setCredentialsModal({
                      empId: res.data.empId,
                      name: res.data.name,
                      email: res.data.email,
                      password: addEmpForm.password || 'Inspire#2026',
                      designation: res.data.designation
                    });
                    setEmpSubTab('all');
                    fetchAllData();
                  } else {
                    toast.error(res.message || 'Failed to add employee');
                  }
                } catch (err) {
                  console.error('Failed to create employee:', err);
                  toast.error(err.message || 'Network connection error while adding employee. Please try again.');
                } finally {
                  setEmployeeSubmitting(false);
                }
              }}>
                {/* Section 1: Personal Information */}
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>1. Personal Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">First Name <span className="required-star">*</span></label>
                      <input id="input-firstName" className="form-control" style={formErrors.firstName ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="First Name" required minLength={2} value={addEmpForm.firstName} onChange={e => { setFormErrors(prev => ({ ...prev, firstName: null })); setAddEmpForm({ ...addEmpForm, firstName: e.target.value }); }} />
                      {formErrors.firstName && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.firstName}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Middle Name</label>
                      <input className="form-control" placeholder="Middle Name" value={addEmpForm.middleName} onChange={e => setAddEmpForm({ ...addEmpForm, middleName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Last Name <span className="required-star">*</span></label>
                      <input id="input-lastName" className="form-control" style={formErrors.lastName ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="Last Name" required minLength={2} value={addEmpForm.lastName} onChange={e => { setFormErrors(prev => ({ ...prev, lastName: null })); setAddEmpForm({ ...addEmpForm, lastName: e.target.value }); }} />
                      {formErrors.lastName && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.lastName}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Personal Email <span className="required-star">*</span></label>
                      <input id="input-personalEmail" className="form-control" style={formErrors.personalEmail ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="Personal Email" type="email" required value={addEmpForm.personalEmail} onChange={e => { setFormErrors(prev => ({ ...prev, personalEmail: null })); setAddEmpForm({ ...addEmpForm, personalEmail: e.target.value, email: e.target.value }); }} />
                      {formErrors.personalEmail && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.personalEmail}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Mobile Phone <span className="required-star">*</span></label>
                      <input id="input-phone" className="form-control" style={formErrors.phone ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="10-Digit Mobile Phone" type="tel" maxLength={10} required value={addEmpForm.phone} onChange={e => { setFormErrors(prev => ({ ...prev, phone: null })); setAddEmpForm({ ...addEmpForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); }} />
                      {formErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.phone}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Alternate Phone</label>
                      <input className="form-control" placeholder="10-Digit Alternate Phone" type="tel" maxLength={10} value={addEmpForm.altPhone} onChange={e => setAddEmpForm({ ...addEmpForm, altPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Date of Birth</span>
                        <select
                          style={{ fontSize: '0.75rem', padding: '1px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#f0f9ff', color: '#0284c7', fontWeight: '600' }}
                          value={addEmpForm.dob ? addEmpForm.dob.split('-')[0] : ''}
                          onChange={e => {
                            const yr = e.target.value;
                            if (!yr) return;
                            const parts = (addEmpForm.dob || '').split('-');
                            const month = parts[1] || '01';
                            const day = parts[2] || '01';
                            setAddEmpForm({ ...addEmpForm, dob: `${yr}-${month}-${day}` });
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
                        value={addEmpForm.dob}
                        onChange={e => setAddEmpForm({ ...addEmpForm, dob: e.target.value })}
                        onClick={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Gender</label>
                      <select className="form-control" value={addEmpForm.gender} onChange={e => setAddEmpForm({ ...addEmpForm, gender: e.target.value })}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Address */}
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>2. Address & Location</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">Current Address <span className="required-star">*</span></label>
                      <textarea id="input-currentAddress" className="form-control" style={formErrors.currentAddress ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="Current Address" required minLength={5} value={addEmpForm.currentAddress} onChange={e => { setFormErrors(prev => ({ ...prev, currentAddress: null })); setAddEmpForm({ ...addEmpForm, currentAddress: e.target.value }); }} rows={2} />
                      {formErrors.currentAddress && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.currentAddress}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Permanent Address</label>
                      <textarea className="form-control" placeholder="Permanent Address" value={addEmpForm.permanentAddress} onChange={e => setAddEmpForm({ ...addEmpForm, permanentAddress: e.target.value })} rows={2} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">City</label>
                      <input className="form-control" placeholder="City" value={addEmpForm.city} onChange={e => setAddEmpForm({ ...addEmpForm, city: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">State</label>
                      <input className="form-control" placeholder="State" value={addEmpForm.state} onChange={e => setAddEmpForm({ ...addEmpForm, state: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Country</label>
                      <input className="form-control" placeholder="Country" value={addEmpForm.country} onChange={e => setAddEmpForm({ ...addEmpForm, country: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Pincode</label>
                      <input id="input-pincode" className="form-control" style={formErrors.pincode ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="6-digit Pincode" maxLength={6} value={addEmpForm.pincode} onChange={e => { setFormErrors(prev => ({ ...prev, pincode: null })); setAddEmpForm({ ...addEmpForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }); }} />
                      {formErrors.pincode && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.pincode}</span>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Emergency Contact */}
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>3. Emergency Contact</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">Emergency Contact Name</label>
                      <input className="form-control" placeholder="Emergency Contact Name" value={addEmpForm.emergencyContactName} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyContactName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Relationship</label>
                      <input className="form-control" placeholder="Relationship" value={addEmpForm.emergencyRelationship} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyRelationship: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Emergency Phone</label>
                      <input className="form-control" placeholder="10-Digit Emergency Phone" type="tel" maxLength={10} value={addEmpForm.emergencyPhone} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Alt Emergency Phone</label>
                      <input className="form-control" placeholder="10-Digit Alternate Phone" type="tel" maxLength={10} value={addEmpForm.emergencyAltPhone} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyAltPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                    </div>
                  </div>
                </div>

                {/* Section 4: Employment Information */}
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>4. Employment Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">Employee ID <span className="required-star">*</span></label>
                      <input id="input-empId" className="form-control" style={formErrors.empId ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="e.g. INS001" required value={addEmpForm.empId || generateNextEmpId(employeesList)} onChange={e => { setFormErrors(prev => ({ ...prev, empId: null })); setAddEmpForm({ ...addEmpForm, empId: e.target.value }); }} />
                      {formErrors.empId && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.empId}</span>}
                      <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Auto-generated. You can edit this if needed.</span>
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Department <span className="required-star">*</span></label>
                      {!isCustomDept ? (
                        <select
                          id="input-department"
                          className="form-control"
                          style={formErrors.department ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                          value={addEmpForm.department}
                          onChange={e => {
                            setFormErrors(prev => ({ ...prev, department: null }));
                            if (e.target.value === '__ADD_NEW__') {
                              setIsCustomDept(true);
                              setAddEmpForm({ ...addEmpForm, department: '' });
                            } else {
                              setAddEmpForm({ ...addEmpForm, department: e.target.value });
                            }
                          }}
                        >
                          {availableDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                          <option value="__ADD_NEW__" style={{ fontWeight: '700', color: '#2563eb' }}>+ Add New Department...</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input
                            id="input-department"
                            className="form-control"
                            style={formErrors.department ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                            placeholder="Enter New Department Name"
                            autoFocus
                            value={addEmpForm.department}
                            onChange={e => {
                              setFormErrors(prev => ({ ...prev, department: null }));
                              setAddEmpForm({ ...addEmpForm, department: e.target.value });
                            }}
                          />
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: '600' }}
                            onClick={() => {
                              setIsCustomDept(false);
                              setAddEmpForm({ ...addEmpForm, department: availableDepartments[0] || 'IT' });
                            }}
                          >
                            ← Select from existing list
                          </button>
                        </div>
                      )}
                      {formErrors.department && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.department}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Designation <span className="required-star">*</span></label>
                      {!isCustomDesig ? (
                        <select
                          id="input-designation"
                          className="form-control"
                          style={formErrors.designation ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                          value={addEmpForm.designation}
                          onChange={e => {
                            setFormErrors(prev => ({ ...prev, designation: null }));
                            if (e.target.value === '__ADD_NEW__') {
                              setIsCustomDesig(true);
                              setAddEmpForm({ ...addEmpForm, designation: '' });
                            } else {
                              setAddEmpForm({ ...addEmpForm, designation: e.target.value });
                            }
                          }}
                        >
                          {availableDesignations.map(desig => (
                            <option key={desig} value={desig}>{desig}</option>
                          ))}
                          <option value="__ADD_NEW__" style={{ fontWeight: '700', color: '#2563eb' }}>+ Add New Designation...</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input
                            id="input-designation"
                            className="form-control"
                            style={formErrors.designation ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}}
                            placeholder="Enter New Designation Title"
                            autoFocus
                            value={addEmpForm.designation}
                            onChange={e => {
                              setFormErrors(prev => ({ ...prev, designation: null }));
                              setAddEmpForm({ ...addEmpForm, designation: e.target.value });
                            }}
                          />
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: '600' }}
                            onClick={() => {
                              setIsCustomDesig(false);
                              setAddEmpForm({ ...addEmpForm, designation: availableDesignations[0] || 'Software Engineer' });
                            }}
                          >
                            ← Select from existing list
                          </button>
                        </div>
                      )}
                      {formErrors.designation && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.designation}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Reporting Manager</label>
                      <input className="form-control" placeholder="Reporting Manager" value={addEmpForm.reportingManager} onChange={e => setAddEmpForm({ ...addEmpForm, reportingManager: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Joining Date <span className="required-star">*</span></label>
                      <input
                        className="form-control"
                        type="date"
                        required
                        style={{ cursor: 'pointer' }}
                        value={addEmpForm.joinDate}
                        onChange={e => setAddEmpForm({ ...addEmpForm, joinDate: e.target.value })}
                        onClick={e => { try { e.currentTarget.showPicker?.(); } catch (err) { } }}
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Employment Type</label>
                      <select className="form-control" value={addEmpForm.employmentType} onChange={e => setAddEmpForm({ ...addEmpForm, employmentType: e.target.value })}>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Work Mode</label>
                      <select className="form-control" value={addEmpForm.workMode} onChange={e => setAddEmpForm({ ...addEmpForm, workMode: e.target.value })}>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Work Location</label>
                      <input className="form-control" placeholder="Work Location" value={addEmpForm.workLocation} onChange={e => setAddEmpForm({ ...addEmpForm, workLocation: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Status</label>
                      <select className="form-control" value={addEmpForm.status} onChange={e => setAddEmpForm({ ...addEmpForm, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Probation">Probation</option>
                        <option value="Resigned">Resigned</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 5: Payroll Information */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>5. Payroll Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">Monthly Salary (₹) <span className="required-star">*</span></label>
                      <input id="input-salary" className="form-control" style={formErrors.salary ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="Monthly Salary" type="number" min="1" required value={addEmpForm.salary} onChange={e => { setFormErrors(prev => ({ ...prev, salary: null })); setAddEmpForm({ ...addEmpForm, salary: e.target.value }); }} />
                      {formErrors.salary && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.salary}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Bank Name</label>
                      <input className="form-control" placeholder="Bank Name" value={addEmpForm.bankName} onChange={e => setAddEmpForm({ ...addEmpForm, bankName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Account Number</label>
                      <input className="form-control" placeholder="Account Number" value={addEmpForm.accountNumber} onChange={e => setAddEmpForm({ ...addEmpForm, accountNumber: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">IFSC Code</label>
                      <input id="input-ifsc" className="form-control" style={formErrors.ifsc ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="e.g. SBIN0001234" maxLength={11} value={addEmpForm.ifsc} onChange={e => { setFormErrors(prev => ({ ...prev, ifsc: null })); setAddEmpForm({ ...addEmpForm, ifsc: e.target.value.toUpperCase() }); }} />
                      {formErrors.ifsc && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.ifsc}</span>}
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">PAN Number</label>
                      <input id="input-panNumber" className="form-control" style={formErrors.panNumber ? { borderColor: '#ef4444', backgroundColor: '#fef2f2' } : {}} placeholder="e.g. ABCDE1234F" maxLength={10} value={addEmpForm.panNumber} onChange={e => { setFormErrors(prev => ({ ...prev, panNumber: null })); setAddEmpForm({ ...addEmpForm, panNumber: e.target.value.toUpperCase() }); }} />
                      {formErrors.panNumber && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block', fontWeight: '600' }}>⚠️ {formErrors.panNumber}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setEmpSubTab('all')}>Cancel</button>
                  <button type="submit" className="btn-orange" disabled={employeeSubmitting}>{employeeSubmitting ? 'Saving to Database...' : 'Save Employee Record'}</button>
                </div>
              </form>
            </div>
          )}

          {/* SUB TAB: EMPLOYEE REQUESTS HUB */}
          {empSubTab === 'requests' && <EmployeeRequestsHub />}

          {/* SUB TAB: ATTENDANCE LOGS */}
          {empSubTab === 'attendance' && (
            <AttendanceLogsTab
              empAttendanceList={empAttendanceList}
              employeesList={employeesList}
              empLeavesList={empLeavesList}
              onRefreshAttendance={fetchAllData}
            />
          )}

          {/* SUB TAB: LEAVE APPLICATIONS */}
          {empSubTab === 'leave' && (
            <LeavesManagerTab
              empLeavesList={empLeavesList}
              setEmpLeavesList={setEmpLeavesList}
              employeesList={employeesList}
            />
          )}

          {/* SUB TAB: EMPLOYEE QUERIES */}
          {empSubTab === 'queries' && (
            <QueriesManagerTab empQueriesList={empQueriesList} setEmpQueriesList={setEmpQueriesList} />
          )}

          {/* SUB TAB: PAYROLL */}
          {empSubTab === 'payroll' && (
            <div className="admin-payroll-tab-pane">
              <div className="admin-content-header">
                <h1>Payroll & Issued Salary Slips</h1>
                <p>View employee salary breakdown, generate official monthly pay slips, and manage compensation structure.</p>
              </div>

              <div className="admin-card">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Gross Monthly Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(employeesList || []).map(emp => (
                        <tr key={emp.id}>
                          <td><strong>{emp.name}</strong> ({formatEmpId(emp.empId, emp.id)})</td>
                          <td>{emp.department}</td>
                          <td>₹{Number(emp.salary || 0).toLocaleString('en-IN')}</td>
                          <td>
                            <button
                              className="btn-orange"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                setSelectedEmployeeDetailTab('payroll');
                                setSelectedEmployeeDetailId(emp.id);
                              }}
                            >
                              Manage Payroll
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        title={confirmModal.title}
        message={confirmModal.message}
        type="confirm"
        confirmText="Yes, Delete Permanently"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
