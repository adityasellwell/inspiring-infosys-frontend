import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { testimonialsApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function TestimonialsManager({ testimonialsList, setTestimonialsList }) {
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [testiForm, setTestiForm] = useState({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const startEditTesti = (testi) => {
    setEditingId(testi.id);
    setIsEditing(true);
    setTestiForm({
      name: testi.name,
      text: testi.text,
      rating: testi.rating,
      timeAgo: testi.timeAgo,
      initials: testi.initials,
      isActive: testi.isActive ?? true
    });
  };

  const cancelTestiEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setTestiForm({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
  };

  const handleTestiFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await testimonialsApi.update(editingId, testiForm);
        if (res.success) {
          setTestimonialsList(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelTestiEdit();
          toast.success('Testimonial updated!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } else {
        const res = await testimonialsApi.create(testiForm);
        if (res.success) {
          setTestimonialsList(prev => [...prev, res.data]);
          setTestiForm({ name: '', text: '', rating: 5, timeAgo: 'Just now', initials: '', isActive: true });
          toast.success('Testimonial added!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteTesti = (id) => {
    setConfirmModal({
      isOpen: true,
      id
    });
  };

  const confirmDeleteTesti = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await testimonialsApi.delete(id);
      if (res.success) {
        setTestimonialsList(prev => prev.filter(item => item.id !== id));
        toast.success('Testimonial deleted');
      } else {
        toast.error(res.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  return (
    <div className="admin-testimonials-tab-pane">
      <div className="admin-content-header">
        <h1>Manage Testimonials</h1>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        </div>
        <form onSubmit={handleTestiFormSubmit} className="login-form">
          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Client Name</label>
              <input
                type="text"
                placeholder="E.g., Neha Kapoor"
                value={testiForm.name}
                onChange={(e) => setTestiForm({ ...testiForm, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Initials (Avatar)</label>
              <input
                type="text"
                placeholder="E.g., NK"
                value={testiForm.initials}
                onChange={(e) => setTestiForm({ ...testiForm, initials: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Comment Text</label>
            <textarea
              placeholder="Write client comment..."
              rows={3}
              value={testiForm.text}
              onChange={(e) => setTestiForm({ ...testiForm, text: e.target.value })}
              required
            />
          </div>

          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Rating (1 to 5 Stars)</label>
              <select
                value={testiForm.rating}
                onChange={(e) => setTestiForm({ ...testiForm, rating: parseInt(e.target.value) || 5 })}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>
            <div className="admin-input-group">
              <label>Relative Time Info</label>
              <input
                type="text"
                placeholder="E.g., 2 months ago"
                value={testiForm.timeAgo}
                onChange={(e) => setTestiForm({ ...testiForm, timeAgo: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <label className="admin-input-group admin-input-checkbox">
              <input
                type="checkbox"
                checked={testiForm.isActive}
                onChange={(e) => setTestiForm({ ...testiForm, isActive: e.target.checked })}
              />
              Is Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditing && (
                <button type="button" className="btn-gray" onClick={cancelTestiEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-orange">
                {isEditing ? 'Update Review' : 'Create Review'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Initials</th>
              <th>Rating</th>
              <th>Review Content</th>
              <th>Relative Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonialsList.map(testi => (
              <tr key={testi.id}>
                <td><strong>{testi.name}</strong></td>
                <td><span className="filing-tag-pill">{testi.initials}</span></td>
                <td style={{ color: '#fbbf24', fontWeight: '800' }}>{'★'.repeat(testi.rating)}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{testi.text}</td>
                <td>{testi.timeAgo}</td>
                <td>
                  <span className={`status-badge ${testi.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                    {testi.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-table-action edit" onClick={() => startEditTesti(testi)} title="Edit">
                      <FiEdit2 />
                    </button>
                    <button className="btn-table-action delete" onClick={() => handleDeleteTesti(testi.id)} title="Delete">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial review?"
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmDeleteTesti}
      />
    </div>
  );
}
