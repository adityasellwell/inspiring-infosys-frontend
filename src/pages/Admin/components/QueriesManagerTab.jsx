import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { employeesApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';
import Modal from '../../../components/common/Modal';
import { formatEmpId } from './empUtils';

export default function QueriesManagerTab({ empQueriesList, setEmpQueriesList }) {
  const [queryReplyText, setQueryReplyText] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const toast = useToast();

  const handleReplyQuery = async (queryId) => {
    const text = queryReplyText[queryId];
    if (!text || !text.trim()) {
      toast.warning('Please enter reply text before sending.');
      return;
    }
    try {
      const res = await employeesApi.replyQuery(queryId, text);
      if (res && res.success) {
        setEmpQueriesList(prev => prev.map(q => (q.id === queryId || String(q.id) === String(queryId)) ? { ...q, ...(res.data || {}), reply: text, status: 'Replied' } : q));
        setQueryReplyText(prev => ({ ...prev, [queryId]: '' }));
        toast.success('Reply sent successfully to employee!');
      } else {
        toast.error(res?.message || 'Failed to send reply');
      }
    } catch (err) {
      toast.error('Error sending reply');
    }
  };

  const handleDeleteQuery = (queryId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Query',
      message: 'Are you sure you want to delete this employee query record?',
      onConfirm: async () => {
        setDeletingId(queryId);
        try {
          const res = await employeesApi.deleteQuery(queryId);
          if (res && res.success) {
            setEmpQueriesList(prev => (prev || []).filter(q => q.id !== queryId && String(q.id) !== String(queryId)));
            toast.success('Query deleted successfully!');
          } else {
            toast.error(res?.message || 'Failed to delete query');
          }
        } catch (err) {
          setEmpQueriesList(prev => (prev || []).filter(q => q.id !== queryId && String(q.id) !== String(queryId)));
          toast.success('Query removed');
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  return (
    <div className="admin-queries-tab-pane">
      <div className="admin-content-header">
        <h1>Employee Queries & Help Desk</h1>
        <p>Manage and respond to support questions submitted by staff.</p>
      </div>

      <div className="admin-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Subject & Query</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Action / Reply</th>
              </tr>
            </thead>
            <tbody>
              {(empQueriesList || []).length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No employee queries submitted yet.
                  </td>
                </tr>
              ) : (
                (empQueriesList || []).map(query => (
                  <tr key={query.id}>
                    <td>
                      <strong>{query.employee?.name || 'Employee'}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {formatEmpId(query.employee?.empId, query.employee?.id)} • {query.employee?.department}
                      </div>
                    </td>
                    <td style={{ maxWidth: '350px' }}>
                      <strong style={{ color: '#0f172a' }}>{query.subject}</strong>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#475569' }}>{query.message}</p>
                      {query.reply && (
                        <div style={{ marginTop: '0.5rem', background: '#f0f9ff', borderLeft: '3px solid #0284c7', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: '#0369a1' }}>
                          <strong>Admin Reply:</strong> {query.reply}
                        </div>
                      )}
                    </td>
                    <td>{query.createdAt ? (isNaN(new Date(query.createdAt).getTime()) ? String(query.createdAt) : new Date(query.createdAt).toLocaleDateString('en-IN')) : '-'}</td>
                    <td>
                      <span className={`status-badge ${query.status === 'Replied' ? 'status-active' : 'status-pending'}`}>
                        {query.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ minWidth: '220px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {query.status === 'Replied' ? (
                          <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600' }}>✓ Answered</span>
                        ) : (
                          <>
                            <textarea
                              placeholder="Type reply to employee..."
                              rows={2}
                              value={queryReplyText[query.id] || ''}
                              onChange={(e) => setQueryReplyText({ ...queryReplyText, [query.id]: e.target.value })}
                              style={{ width: '100%', fontSize: '0.825rem', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                            />
                            <button
                              type="button"
                              className="btn-orange"
                              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem', alignSelf: 'flex-start' }}
                              onClick={() => handleReplyQuery(query.id)}
                            >
                              Send Reply
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          disabled={deletingId === query.id}
                          onClick={() => handleDeleteQuery(query.id)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '6px',
                            border: '1px solid #fca5a5',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontWeight: '600',
                            cursor: 'pointer',
                            alignSelf: 'flex-start',
                            marginTop: '0.25rem'
                          }}
                        >
                          <FiTrash2 size={13} /> {deletingId === query.id ? 'Deleting...' : 'Delete'}
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

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
        title={confirmModal.title}
        message={confirmModal.message}
        type="confirm"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
