import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { statsApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function StatsManager({ statsList, setStatsList }) {
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [statForm, setStatForm] = useState({ label: '', value: '', suffix: '+', sortOrder: 0, isActive: true });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const startEditStat = (stat) => {
    setEditingId(stat.id);
    setIsEditing(true);
    setStatForm({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      sortOrder: stat.sortOrder,
      isActive: stat.isActive ?? true
    });
  };

  const cancelStatEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setStatForm({ label: '', value: '', suffix: '+', sortOrder: statsList.length + 1, isActive: true });
  };

  const handleStatFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await statsApi.update(editingId, statForm);
        if (res.success) {
          setStatsList(prev => prev.map(item => item.id === editingId ? res.data : item).sort((a, b) => a.sortOrder - b.sortOrder));
          cancelStatEdit();
          toast.success('Stat updated successfully!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } else {
        const res = await statsApi.create(statForm);
        if (res.success) {
          setStatsList(prev => [...prev, res.data].sort((a, b) => a.sortOrder - b.sortOrder));
          setStatForm({ label: '', value: '', suffix: '+', sortOrder: statsList.length + 2, isActive: true });
          toast.success('New stat created successfully!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteStat = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteStat = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await statsApi.delete(id);
      if (res.success) {
        setStatsList(prev => prev.filter(item => item.id !== id));
        toast.success('Stat deleted');
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
    <div className="admin-stats-tab-pane">
      <div className="admin-content-header">
        <h1>Manage Stats</h1>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditing ? 'Edit Stat' : 'Add New Stat'}</h2>
        </div>
        <form onSubmit={handleStatFormSubmit} className="login-form">
          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Label</label>
              <input
                type="text"
                placeholder="E.g., Company Incorporations"
                value={statForm.label}
                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Value</label>
              <input
                type="text"
                placeholder="E.g., 1050"
                value={statForm.value}
                onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Suffix (e.g., +, %)</label>
              <input
                type="text"
                placeholder="+"
                value={statForm.suffix}
                onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })}
              />
            </div>
            <div className="admin-input-group">
              <label>Sort Order</label>
              <input
                type="number"
                value={statForm.sortOrder}
                onChange={(e) => setStatForm({ ...statForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <label className="admin-input-group admin-input-checkbox">
              <input
                type="checkbox"
                checked={statForm.isActive}
                onChange={(e) => setStatForm({ ...statForm, isActive: e.target.checked })}
              />
              Is Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditing && (
                <button type="button" className="btn-gray" onClick={cancelStatEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-orange">
                {isEditing ? 'Update Stat' : 'Create Stat'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statsList.map(stat => (
              <tr key={stat.id}>
                <td><strong>{stat.label}</strong></td>
                <td>{stat.value}{stat.suffix}</td>
                <td>{stat.sortOrder}</td>
                <td>
                  <span className={`status-badge ${stat.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                    {stat.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn-table-action edit" onClick={() => startEditStat(stat)} title="Edit">
                      <FiEdit2 />
                    </button>
                    <button className="btn-table-action delete" onClick={() => handleDeleteStat(stat.id)} title="Delete">
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
        title="Delete Stat"
        message="Are you sure you want to delete this stat metric?"
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmDeleteStat}
      />
    </div>
  );
}
