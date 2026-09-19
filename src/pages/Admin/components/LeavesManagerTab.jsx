import React from 'react';
import { FiCheckCircle, FiXCircle, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import { formatEmpId } from './empUtils';

export default function LeavesManagerTab({ empLeavesList, setEmpLeavesList, employeesList = [] }) {
  const toast = useToast();

  const handleUpdateLeaveStatus = async (leaveId, status) => {
    try {
      const res = await employeesApi.updateLeaveStatus(leaveId, status);
      if (res && res.success) {
        setEmpLeavesList(prev => prev.map(l => l.id === leaveId ? { ...l, status } : l));
        toast.success(`Leave application marked as ${status}!`);
      } else {
        toast.error(res?.message || 'Failed to update leave status');
      }
    } catch (err) {
      toast.error('Error updating leave status');
    }
  };

  const totalEmployees = (employeesList || []).length;

  const approvedOnLeaveCount = new Set(
    (empLeavesList || [])
      .filter(l => (l.status || '').toLowerCase() === 'approved')
      .map(l => l.employeeId || l.employee?.id || l.employee?.empId)
      .filter(Boolean)
  ).size;

  const statusOnLeaveCount = (employeesList || []).filter(e => (e.status || '').toLowerCase() === 'on leave').length;

  const onLeaveCount = Math.max(approvedOnLeaveCount, statusOnLeaveCount);

  const pendingRequestsCount = (empLeavesList || []).filter(
    l => (l.status || 'Pending').toLowerCase() === 'pending'
  ).length;

  return (
    <div className="admin-leaves-tab-pane">
      <div className="admin-content-header">
        <h1>Employee Leave Applications</h1>
        <p>Review and manage leave requests from team members.</p>
      </div>

      {/* Summary Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ padding: '1rem 1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Total Employees</span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', margin: '0.2rem 0 0' }}>{totalEmployees}</h3>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f1f5f9', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUsers size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ padding: '1rem 1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>On Leave</span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#f97316', margin: '0.2rem 0 0' }}>{onLeaveCount}</h3>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCalendar size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ padding: '1rem 1.25rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>Pending Requests</span>
            <h3 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#6366f1', margin: '0.2rem 0 0' }}>{pendingRequestsCount}</h3>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiClock size={22} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration / Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(empLeavesList || []).length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No leave requests submitted yet.
                  </td>
                </tr>
              ) : (
                (empLeavesList || []).map(leave => (
                  <tr key={leave.id}>
                    <td>
                      <strong>{leave.employee?.name || 'Employee'}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {formatEmpId(leave.employee?.empId, leave.employee?.id)} • {leave.employee?.department}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: '#2563eb' }}>{leave.leaveType}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                        {leave.startDate ? (isNaN(new Date(leave.startDate).getTime()) ? String(leave.startDate) : new Date(leave.startDate).toLocaleDateString('en-IN')) : '-'} to {leave.endDate ? (isNaN(new Date(leave.endDate).getTime()) ? String(leave.endDate) : new Date(leave.endDate).toLocaleDateString('en-IN')) : '-'}
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', fontSize: '0.85rem', color: '#475569' }}>
                      {leave.reason}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        leave.status === 'Approved' ? 'status-active' : leave.status === 'Rejected' ? 'status-inactive' : 'status-pending'
                      }`}>
                        {leave.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateLeaveStatus(leave.id, 'Approved')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '0.4rem 0.85rem',
                              background: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #86efac',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '0.825rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <FiCheckCircle size={14} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateLeaveStatus(leave.id, 'Rejected')}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '0.4rem 0.85rem',
                              background: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '0.825rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <FiXCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>✓ Handled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
