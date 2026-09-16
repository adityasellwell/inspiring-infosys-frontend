import React, { useState } from 'react';
import { FiDownload, FiPlus, FiKey } from 'react-icons/fi';
import EmployeeDetail from './EmployeeDetail';
import EmployeeRequestsHub from './EmployeeRequestsHub';
import QueriesManagerTab from './QueriesManagerTab';
import LeavesManagerTab from './LeavesManagerTab';
import AttendanceLogsTab from './AttendanceLogsTab';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';

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

  React.useEffect(() => {
    if (empSubTab === 'add' && !addEmpForm.empId) {
      setAddEmpForm(prev => ({ ...prev, empId: generateNextEmpId(employeesList) }));
    }
  }, [empSubTab, employeesList]);

  React.useEffect(() => {
    setSelectedEmployeeDetailId(null);
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
    } catch (err) {
      setCredentialsModal({
        empId: formatEmpId(employee.empId, employee.id),
        name: employee.name,
        email: employee.email,
        password: 'Inspire#2026',
        designation: employee.designation
      });
    }
  };

  return (
    <div className="admin-employees-tab-pane">
      {selectedEmployeeDetailId ? (
        <EmployeeDetail
          employeeId={selectedEmployeeDetailId}
          initialTab={selectedEmployeeDetailTab || 'overview'}
          onBack={() => setSelectedEmployeeDetailId(null)}
          onUpdate={fetchAllData}
          setCredentialsModal={setCredentialsModal}
        />
      ) : (
        <div>
          {/* Top Dashboard Header */}
          <div className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Employees</h1>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                Manage employee profiles, employment information, documents, attendance, leave, payroll and employee requests.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleExportEmployeesCSV}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FiDownload /> Export CSV
              </button>
              <button
                type="button"
                className="btn-orange"
                onClick={() => setEmpSubTab('add')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FiPlus /> Add Employee
              </button>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Total Employees</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{dashboardMetrics.totalEmployees || (employeesList || []).length}</h3>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Active Employees</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', margin: '0.2rem 0 0' }}>{dashboardMetrics.activeEmployees || (employeesList || []).filter(e => e.status === 'Active').length}</h3>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>On Leave</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f97316', margin: '0.2rem 0 0' }}>{dashboardMetrics.onLeaveEmployees || 0}</h3>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Pending Requests</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366f1', margin: '0.2rem 0 0' }}>{dashboardMetrics.pendingRequests || 2}</h3>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>New Joiners</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284c7', margin: '0.2rem 0 0' }}>{dashboardMetrics.newJoiners || 1}</h3>
            </div>
            <div className="stat-card" style={{ padding: '0.85rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Documents Pending</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ec4899', margin: '0.2rem 0 0' }}>{dashboardMetrics.pendingDocuments || 0}</h3>
            </div>
          </div>

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
                  <option value="IT">IT</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Development">Development</option>
                  <option value="Sales">Sales</option>
                </select>
                <select value={empDesigFilter} onChange={e => setEmpDesigFilter(e.target.value)} style={{ flex: '1 1 120px', minWidth: '110px', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                  <option value="All">All Designations</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Marketplace Specialist">Marketplace Specialist</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="FULL STACK">FULL STACK</option>
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
                        <th style={{ textAlign: 'center', width: '50px', whiteSpace: 'nowrap' }}>Profile</th>
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
                          <tr key={employee.id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedEmployeeDetailTab('overview'); setSelectedEmployeeDetailId(employee.id); }}>
                            <td style={{ textAlign: 'left', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap' }}>{formatEmpId(employee.empId, employee.id)}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem', border: '1px solid #bae6fd', margin: '0 auto' }}>
                                {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                              </div>
                            </td>
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
                                  onClick={() => { setSelectedEmployeeDetailTab('overview'); setSelectedEmployeeDetailId(employee.id); }}
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

              <form onSubmit={async (e) => {
                e.preventDefault();
                setEmployeeSubmitting(true);
                try {
                  const payload = {
                    ...addEmpForm,
                    name: `${addEmpForm.firstName} ${addEmpForm.lastName}`.trim() || addEmpForm.name,
                    email: addEmpForm.email || addEmpForm.personalEmail
                  };
                  const res = await employeesApi.create(payload);
                  if (res.success) {
                    toast.success('Employee added successfully to Master Database!');
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
                      <input className="form-control" placeholder="First Name" required value={addEmpForm.firstName} onChange={e => setAddEmpForm({ ...addEmpForm, firstName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Middle Name</label>
                      <input className="form-control" placeholder="Middle Name" value={addEmpForm.middleName} onChange={e => setAddEmpForm({ ...addEmpForm, middleName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Last Name <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="Last Name" required value={addEmpForm.lastName} onChange={e => setAddEmpForm({ ...addEmpForm, lastName: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Personal Email <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="Personal Email" type="email" required value={addEmpForm.personalEmail} onChange={e => setAddEmpForm({ ...addEmpForm, personalEmail: e.target.value, email: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Mobile Phone <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="Mobile Phone" required value={addEmpForm.phone} onChange={e => setAddEmpForm({ ...addEmpForm, phone: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Alternate Phone</label>
                      <input className="form-control" placeholder="Alternate Phone" value={addEmpForm.altPhone} onChange={e => setAddEmpForm({ ...addEmpForm, altPhone: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Date of Birth</label>
                      <input className="form-control" type="date" min="1950-01-01" max="2035-12-31" value={addEmpForm.dob} onChange={e => setAddEmpForm({ ...addEmpForm, dob: e.target.value })} />
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
                      <textarea className="form-control" placeholder="Current Address" required value={addEmpForm.currentAddress} onChange={e => setAddEmpForm({ ...addEmpForm, currentAddress: e.target.value })} rows={2} />
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
                      <input className="form-control" placeholder="Pincode" value={addEmpForm.pincode} onChange={e => setAddEmpForm({ ...addEmpForm, pincode: e.target.value })} />
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
                      <input className="form-control" placeholder="Emergency Phone" value={addEmpForm.emergencyPhone} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyPhone: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Alt Emergency Phone</label>
                      <input className="form-control" placeholder="Alternate Emergency Phone" value={addEmpForm.emergencyAltPhone} onChange={e => setAddEmpForm({ ...addEmpForm, emergencyAltPhone: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Section 4: Employment Information */}
                <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f97316', margin: '0 0 1rem' }}>4. Employment Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div className="form-field-group">
                      <label className="form-label">Employee ID <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="e.g. INS001" required value={addEmpForm.empId || generateNextEmpId(employeesList)} onChange={e => setAddEmpForm({ ...addEmpForm, empId: e.target.value })} />
                      <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', display: 'block' }}>Auto-generated. You can edit this if needed.</span>
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Department <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="Department" required value={addEmpForm.department} onChange={e => setAddEmpForm({ ...addEmpForm, department: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Designation <span className="required-star">*</span></label>
                      <input className="form-control" placeholder="Designation" required value={addEmpForm.designation} onChange={e => setAddEmpForm({ ...addEmpForm, designation: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Reporting Manager</label>
                      <input className="form-control" placeholder="Reporting Manager" value={addEmpForm.reportingManager} onChange={e => setAddEmpForm({ ...addEmpForm, reportingManager: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">Joining Date <span className="required-star">*</span></label>
                      <input className="form-control" type="date" required value={addEmpForm.joinDate} onChange={e => setAddEmpForm({ ...addEmpForm, joinDate: e.target.value })} />
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
                      <input className="form-control" placeholder="Monthly Salary" type="number" required value={addEmpForm.salary} onChange={e => setAddEmpForm({ ...addEmpForm, salary: e.target.value })} />
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
                      <input className="form-control" placeholder="IFSC Code" value={addEmpForm.ifsc} onChange={e => setAddEmpForm({ ...addEmpForm, ifsc: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">PAN Number</label>
                      <input className="form-control" placeholder="PAN Number" value={addEmpForm.panNumber} onChange={e => setAddEmpForm({ ...addEmpForm, panNumber: e.target.value })} />
                    </div>
                    <div className="form-field-group">
                      <label className="form-label">UAN Number</label>
                      <input className="form-control" placeholder="UAN Number" value={addEmpForm.uanNumber} onChange={e => setAddEmpForm({ ...addEmpForm, uanNumber: e.target.value })} />
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
            <LeavesManagerTab empLeavesList={empLeavesList} setEmpLeavesList={setEmpLeavesList} />
          )}

          {/* SUB TAB: EMPLOYEE QUERIES */}
          {empSubTab === 'queries' && (
            <QueriesManagerTab empQueriesList={empQueriesList} setEmpQueriesList={setEmpQueriesList} />
          )}

          {/* SUB TAB: PAYROLL */}
          {empSubTab === 'payroll' && (
            <div className="admin-card">
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem' }}>Payroll & Issued Salary Slips</h2>
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
          )}
        </div>
      )}
    </div>
  );
}
