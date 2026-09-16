import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import { formatEmpId } from './empUtils';

export default function LeavesManagerTab({ empLeavesList, setEmpLeavesList }) {
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

  return (
    <div className="admin-leaves-tab-pane">
      <div className="admin-content-header">
        <h1>Employee Leave Applications</h1>
        <p>Review and manage leave requests from team members.</p>
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
