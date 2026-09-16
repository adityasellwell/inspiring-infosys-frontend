import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { projectsApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function ProjectsManager({ projectsList, setProjectsList }) {
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [projForm, setProjForm] = useState({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  const startEditProj = (proj) => {
    setEditingId(proj.id);
    setIsEditing(true);
    setProjForm({
      title: proj.title,
      category: proj.category,
      imgUrl: proj.imgUrl,
      link: proj.link || '',
      description: proj.description || '',
      isActive: proj.isActive ?? true
    });
  };

  const cancelProjEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setProjForm({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
  };

  const handleProjFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await projectsApi.update(editingId, projForm);
        if (res.success) {
          setProjectsList(prev => prev.map(item => item.id === editingId ? res.data : item));
          cancelProjEdit();
          toast.success('Project updated!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } else {
        const res = await projectsApi.create(projForm);
        if (res.success) {
          setProjectsList(prev => [...prev, res.data]);
          setProjForm({ title: '', category: 'Websites', imgUrl: '/img/ecoms.webp', link: '', description: '', isActive: true });
          toast.success('Project created!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteProj = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteProj = async () => {
    const id = confirmModal.id;
    if (!id) return;
    try {
      const res = await projectsApi.delete(id);
      if (res.success) {
        setProjectsList(prev => prev.filter(item => item.id !== id));
        toast.success('Project deleted');
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
    <div className="admin-projects-tab-pane">
      <div className="admin-content-header">
        <h1>Portfolio Showcase Projects</h1>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditing ? 'Edit Project' : 'Add New Showcase Project'}</h2>
        </div>
        <form onSubmit={handleProjFormSubmit} className="login-form">
          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Project Title</label>
              <input
                type="text"
                placeholder="E.g., Spartan Nutrition"
                value={projForm.title}
                onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Category</label>
              <select
                value={projForm.category}
                onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
              >
                <option value="Websites">Websites</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Software">Software</option>
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Image URL Path</label>
              <input
                type="text"
                placeholder="E.g., /img/web-spartan.webp"
                value={projForm.imgUrl}
                onChange={(e) => setProjForm({ ...projForm, imgUrl: e.target.value })}
                required
              />
            </div>
            <div className="admin-input-group">
              <label>External Website Link</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={projForm.link}
                onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Showcase Description</label>
            <textarea
              placeholder="Provide short explanation of project concept..."
              rows={2}
              value={projForm.description}
              onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <label className="admin-input-group admin-input-checkbox">
              <input
                type="checkbox"
                checked={projForm.isActive}
                onChange={(e) => setProjForm({ ...projForm, isActive: e.target.checked })}
              />
              Is Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditing && (
                <button type="button" className="btn-gray" onClick={cancelProjEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-orange">
                {isEditing ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Category</th>
              <th>Image Source</th>
              <th>Link</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectsList.map(proj => (
              <tr key={proj.id}>
                <td><strong>{proj.title}</strong></td>
                <td><span className="status-badge status-progress">{proj.category}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{proj.imgUrl}</td>
                <td>{proj.link ? <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '700' }}>Visit Link</a> : 'None'}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.82rem' }}>{proj.description}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn-table-action edit" onClick={() => startEditProj(proj)} title="Edit">
                      <FiEdit2 />
                    </button>
                    <button className="btn-table-action delete" onClick={() => handleDeleteProj(proj.id)} title="Delete">
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
        title="Delete Showcase Project"
        message="Are you sure you want to delete this portfolio project?"
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmDeleteProj}
      />
    </div>
  );
}
