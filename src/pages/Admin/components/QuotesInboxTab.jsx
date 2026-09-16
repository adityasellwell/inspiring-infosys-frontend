import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { quotesApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function QuotesInboxTab({ leadsQuotes, setLeadsQuotes }) {
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', service: '', companyName: '', turnover: '', businessDesc: '', message: '', status: 'new' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const startEditQuote = (quote) => {
    setEditingId(quote.id);
    setIsEditing(true);
    setQuoteForm({
      name: quote.name || '',
      email: quote.email || '',
      phone: quote.phone || '',
      service: quote.service || '',
      companyName: quote.companyName || '',
      turnover: quote.turnover || '',
      businessDesc: quote.businessDesc || '',
      message: quote.message || '',
      status: quote.status || 'new'
    });
  };

  const cancelQuoteEdit = () => {
    setEditingId(null);
    setIsEditing(false);
  };

  const handleQuoteFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await quotesApi.update(editingId, quoteForm);
      if (res.success) {
        setLeadsQuotes(prev => prev.map(item => item.id === editingId ? res.data : item));
        cancelQuoteEdit();
        toast.success('Inquiry details updated!');
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleUpdateQuoteStatus = async (id, status) => {
    try {
      const res = await quotesApi.update(id, { status });
      if (res.success) {
        setLeadsQuotes(prev => prev.map(item => item.id === id ? res.data : item));
        toast.success(`Quote status updated to ${status}`);
      }
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleDeleteQuote = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteQuote = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await quotesApi.delete(id);
      if (res.success) {
        setLeadsQuotes(prev => prev.filter(item => item.id !== id));
        toast.success('Quote inquiry deleted');
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
    <div className="admin-quotes-tab-pane">
      <div className="admin-content-header">
        <h1>Get a Quote Inquiries</h1>
      </div>

      {isEditing && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Edit Quote Inquiry Details</h2>
          </div>
          <form onSubmit={handleQuoteFormSubmit} className="login-form">
            <div className="form-grid form-grid-2">
              <div className="admin-input-group">
                <label>Client Name</label>
                <input
                  type="text"
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="admin-input-group">
                <label>Requested Services</label>
                <input
                  type="text"
                  value={quoteForm.service}
                  onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid form-grid-2">
              <div className="admin-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="admin-input-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-grid form-grid-3">
              <div className="admin-input-group">
                <label>Company / Brand Name</label>
                <input
                  type="text"
                  value={quoteForm.companyName}
                  onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                />
              </div>
              <div className="admin-input-group">
                <label>Estimated Annual Turnover</label>
                <select
                  value={quoteForm.turnover}
                  onChange={(e) => setQuoteForm({ ...quoteForm, turnover: e.target.value })}
                >
                  <option value="">Select Turnover...</option>
                  <option value="Below ₹10 Lakhs">Below ₹10 Lakhs</option>
                  <option value="₹10L to ₹40 Lakhs">₹10L to ₹40 Lakhs</option>
                  <option value="Above ₹40 Lakhs">Above ₹40 Lakhs</option>
                </select>
              </div>
              <div className="admin-input-group">
                <label>Lead Status</label>
                <select
                  value={quoteForm.status}
                  onChange={(e) => setQuoteForm({ ...quoteForm, status: e.target.value })}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="admin-input-group">
              <label>Business Description / Concept</label>
              <textarea
                rows={3}
                value={quoteForm.businessDesc}
                onChange={(e) => setQuoteForm({ ...quoteForm, businessDesc: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn-gray" onClick={cancelQuoteEdit}>
                Cancel
              </button>
              <button type="submit" className="btn-orange">
                Update Inquiry Details
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Requested Services</th>
              <th>Business Profile Details</th>
              <th>Submit Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leadsQuotes.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No quote inquiries found.
                </td>
              </tr>
            ) : (
              leadsQuotes.map(lead => (
                <tr key={lead.id}>
                  <td><strong>{lead.name}</strong></td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>
                      <div><a href={`mailto:${lead.email}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>{lead.email}</a></div>
                      <div style={{ color: '#64748b', marginTop: '0.2rem' }}>{lead.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className="status-badge status-done" style={{ fontSize: '0.72rem' }}>
                      {lead.service}
                    </span>
                  </td>
                  <td style={{ maxWidth: '280px', whiteSpace: 'normal', fontSize: '0.82rem', lineHeight: '1.4' }}>
                    {lead.companyName && <div><strong>Company:</strong> {lead.companyName}</div>}
                    {lead.turnover && <div><strong>Turnover:</strong> {lead.turnover}</div>}
                    {lead.businessDesc && <div style={{ marginTop: '0.2rem' }}><strong>Description:</strong> {lead.businessDesc}</div>}
                    {!lead.companyName && !lead.turnover && !lead.businessDesc && (
                      <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{lead.message}</div>
                    )}
                  </td>
                  <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateQuoteStatus(lead.id, e.target.value)}
                      className={`status-badge status-${lead.status}`}
                      style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table-action edit" onClick={() => startEditQuote(lead)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-table-action delete" onClick={() => handleDeleteQuote(lead.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
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
        title="Delete Quote Inquiry"
        message="Are you sure you want to delete this quote inquiry?"
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmDeleteQuote}
      />
    </div>
  );
}
