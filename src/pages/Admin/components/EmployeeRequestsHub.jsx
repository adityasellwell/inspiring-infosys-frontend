import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import { formatEmpId } from './empUtils';

export default function EmployeeRequestsHub() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Pending');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await employeesApi.getAllRequests();
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await employeesApi.updateRequestStatus(id, status);
      if (res.success) {
        toast.success(res.message || `Request updated to ${status}!`);
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to update request status.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesType = filterType === 'All' || req.requestType === filterType;
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesType && matchesStatus;
  });

  return (
    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Employee Requests & Staged Approvals</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Review employee portal submissions (WFH, Expenses, Leave, Attendance, Profile Changes) before updating Master Records.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchRequests} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FiRefreshCw /> Refresh Inbox
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Request Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option value="All">All Types</option>
            <option value="Profile Change">Profile Change Requests</option>
            <option value="WFH">Work From Home (WFH)</option>
            <option value="Expense Claim">Expense Claims</option>
            <option value="Attendance Correction">Attendance Correction</option>
            <option value="Document Request">Document Request</option>
            <option value="HR Helpdesk">HR Helpdesk</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '4px' }}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending Only</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading employee requests...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Employee</th>
              <th>Type</th>
              <th>Subject / Details</th>
              <th>Old Value vs New Value</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td><strong>REQ#{req.id}</strong></td>
                  <td>
                    <strong>{req.employee?.name || 'Employee'}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatEmpId(req.employee?.empId, req.employee?.id)} &bull; {req.employee?.department}</div>
                  </td>
                  <td>
                    <span className="status-badge status-active" style={{ background: req.requestType === 'Profile Change' ? '#fef3c7' : '#e0f2fe', color: req.requestType === 'Profile Change' ? '#92400e' : '#0369a1' }}>
                      {req.requestType}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{req.title}</div>
                    <div style={{ fontSize: '0.825rem', color: '#475569' }}>{req.description}</div>
                  </td>
                  <td>
                    {req.oldValue || req.newValue ? (
                      <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div><span style={{ color: '#ef4444' }}>Old:</span> {req.oldValue || 'N/A'}</div>
                        <div><span style={{ color: '#10b981' }}>New:</span> <strong>{req.newValue}</strong></div>
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>N/A</span>
                    )}
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${req.status.toLowerCase().replace(' ', '-')}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn-secondary"
                          style={{ color: '#10b981', borderColor: '#a7f3d0', padding: '0.35rem 0.65rem' }}
                          onClick={() => handleUpdateStatus(req.id, 'Approved')}
                        >
                          <FiCheckCircle /> Approve
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.35rem 0.65rem' }}
                          onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                        >
                          <FiXCircle /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reviewed by {req.reviewedBy || 'Admin'}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  No requests matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
