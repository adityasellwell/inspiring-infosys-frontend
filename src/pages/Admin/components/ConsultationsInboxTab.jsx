import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { consultationsApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function ConsultationsInboxTab({ leadsConsultations, setLeadsConsultations }) {
  const toast = useToast();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const handleUpdateConsultationStatus = async (id, status) => {
    try {
      const res = await consultationsApi.update(id, { status });
      if (res.success) {
        setLeadsConsultations(prev => prev.map(item => item.id === id ? res.data : item));
        toast.success(`Consultation status updated to ${status}`);
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleDeleteConsultation = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteConsultation = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await consultationsApi.delete(id);
      if (res.success) {
        setLeadsConsultations(prev => prev.filter(item => item.id !== id));
        toast.success('Consultation inquiry deleted');
      } else {
        toast.error(res.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  return (
    <div className="admin-consultations-tab-pane">
      <div className="admin-content-header">
        <h1>Contact Form Consultations</h1>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Subject / Company</th>
              <th>Message</th>
              <th>Submit Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leadsConsultations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No consultation inquiries found.
                </td>
              </tr>
            ) : (
              leadsConsultations.map(lead => (
                <tr key={lead.id}>
                  <td><strong>{lead.name}</strong></td>
                  <td><a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>{lead.email}</a></td>
                  <td>{lead.company || lead.phone || 'General Inquiry'}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{lead.message}</td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateConsultationStatus(lead.id, e.target.value)}
                      className={`status-badge status-${lead.status}`}
                      style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-table-action delete" onClick={() => handleDeleteConsultation(lead.id)} title="Delete">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        title="Delete Consultation Inquiry"
        message="Are you sure you want to delete this consultation inquiry?"
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmDeleteConsultation}
      />
    </div>
  );
}
