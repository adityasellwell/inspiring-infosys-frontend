import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { categoriesApi, turnoverApi } from '../../../api/api';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';

export default function QuoteConfigTab({
  quoteCategories, setQuoteCategories,
  turnoverOptions, setTurnoverOptions,
  selectedCategoryId, setSelectedCategoryId
}) {
  const toast = useToast();
  // Category Form State
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: 0, isActive: true });

  // Filing Form State
  const [filingFormName, setFilingFormName] = useState('');
  const [filingFormOrder, setFilingFormOrder] = useState(1);

  // Turnover Form State
  const [editingTurnoverId, setEditingTurnoverId] = useState(null);
  const isEditingTurnover = editingTurnoverId !== null;
  const [turnoverForm, setTurnoverForm] = useState({ label: '', sortOrder: 1, isActive: true });

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // ── Category Handlers ──
  const startEditCategory = (cat) => {
    setEditingId(cat.id);
    setIsEditing(true);
    setCatForm({
      id: cat.id,
      title: cat.title,
      desc: cat.desc,
      iconName: cat.iconName || 'FiShoppingCart',
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive ?? true
    });
  };

  const cancelCatEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setCatForm({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: quoteCategories.length + 1, isActive: true });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await categoriesApi.updateCategory(editingId, catForm);
        if (res.success) {
          setQuoteCategories(prev => prev.map(c => c.id === editingId ? res.data : c));
          cancelCatEdit();
          toast.success('Category updated!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } else {
        const res = await categoriesApi.createCategory(catForm);
        if (res.success) {
          setQuoteCategories(prev => [...prev, res.data]);
          setCatForm({ id: '', title: '', desc: '', iconName: 'FiShoppingCart', sortOrder: quoteCategories.length + 2, isActive: true });
          toast.success('Category created!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteCategory = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: `Delete category "${id}" and all its filing options?`,
      onConfirm: async () => {
        try {
          const res = await categoriesApi.deleteCategory(id);
          if (res.success) {
            setQuoteCategories(prev => prev.filter(c => c.id !== id));
            if (selectedCategoryId === id) {
              const remaining = quoteCategories.filter(c => c.id !== id);
              setSelectedCategoryId(remaining.length > 0 ? remaining[0].id : '');
            }
            toast.success('Category deleted');
          } else {
            toast.error(res.message || 'Deletion failed');
          }
        } catch (err) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  // ── Filing Checkbox Handlers ──
  const activeCategoryObj = quoteCategories.find(c => c.id === selectedCategoryId) || quoteCategories[0];

  const handleAddFilingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !filingFormName.trim()) {
      toast.warning('Select a category and enter filing name');
      return;
    }
    try {
      const res = await categoriesApi.createFiling({
        categoryId: selectedCategoryId,
        name: filingFormName.trim(),
        sortOrder: filingFormOrder
      });

      if (res.success) {
        setQuoteCategories(prev => prev.map(c => {
          if (c.id === selectedCategoryId) {
            return {
              ...c,
              filings: [...(c.filings || []), res.data].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            };
          }
          return c;
        }));
        setFilingFormName('');
        setFilingFormOrder(prev => prev + 1);
        toast.success('Filing option added!');
      } else {
        toast.error(res.message || 'Failed to add filing option');
      }
    } catch (err) {
      toast.error('Failed to add filing option');
    }
  };

  const handleDeleteFiling = (filingId, catId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Filing Option',
      message: 'Are you sure you want to delete this filing option?',
      onConfirm: async () => {
        try {
          const res = await categoriesApi.deleteFiling(filingId);
          if (res.success) {
            setQuoteCategories(prev => prev.map(c => {
              if (c.id === catId) {
                return {
                  ...c,
                  filings: (c.filings || []).filter(f => f.id !== filingId)
                };
              }
              return c;
            }));
            toast.success('Option removed');
          } else {
            toast.error(res.message || 'Failed to delete option');
          }
        } catch (err) {
          toast.error('Failed to delete option');
        }
      }
    });
  };

  // ── Turnover Option Handlers ──
  const startEditTurnover = (opt) => {
    setEditingTurnoverId(opt.id);
    setTurnoverForm({
      label: opt.label,
      sortOrder: opt.sortOrder || 1,
      isActive: opt.isActive ?? true
    });
  };

  const cancelTurnoverEdit = () => {
    setEditingTurnoverId(null);
    setTurnoverForm({ label: '', sortOrder: turnoverOptions.length + 1, isActive: true });
  };

  const handleTurnoverSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditingTurnover) {
        const res = await turnoverApi.update(editingTurnoverId, turnoverForm);
        if (res.success) {
          setTurnoverOptions(prev => prev.map(item => item.id === editingTurnoverId ? res.data : item).sort((a, b) => a.sortOrder - b.sortOrder));
          cancelTurnoverEdit();
          toast.success('Turnover option updated!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      } else {
        const res = await turnoverApi.create(turnoverForm);
        if (res.success) {
          setTurnoverOptions(prev => [...prev, res.data].sort((a, b) => a.sortOrder - b.sortOrder));
          setTurnoverForm({ label: '', sortOrder: turnoverOptions.length + 2, isActive: true });
          toast.success('Turnover option created!');
        } else {
          toast.error(res.message || 'Operation failed');
        }
      }
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteTurnover = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Turnover Option',
      message: 'Are you sure you want to delete this turnover bracket?',
      onConfirm: async () => {
        try {
          const res = await turnoverApi.delete(id);
          if (res.success) {
            setTurnoverOptions(prev => prev.filter(item => item.id !== id));
            toast.success('Turnover option deleted');
          } else {
            toast.error(res.message || 'Deletion failed');
          }
        } catch (err) {
          toast.error('Deletion failed');
        }
      }
    });
  };

  return (
    <div className="admin-quote-config-tab-pane">
      <div className="admin-content-header">
        <h1>Get Quote Config</h1>
      </div>

      {/* Category Add/Edit Inline Form */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>{isEditing ? 'Edit Services Category' : 'Add New Category (Step 1)'}</h2>
        </div>
        <form onSubmit={handleCategorySubmit} className="login-form">
          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Unique Key ID (No spaces)</label>
              <input
                type="text"
                placeholder="E.g., ecommerce"
                value={catForm.id}
                onChange={(e) => setCatForm({ ...catForm, id: e.target.value.toLowerCase().trim() })}
                required
                disabled={isEditing}
              />
            </div>
            <div className="admin-input-group">
              <label>Display Title</label>
              <input
                type="text"
                placeholder="E.g., E-Commerce & Marketplaces"
                value={catForm.title}
                onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Feather Icon Component Name</label>
              <select
                value={catForm.iconName}
                onChange={(e) => setCatForm({ ...catForm, iconName: e.target.value })}
              >
                <option value="FiShoppingCart">FiShoppingCart (Cart Icon)</option>
                <option value="FiMessageCircle">FiMessageCircle (Chat Icon)</option>
                <option value="FiCode">FiCode (Coding Tag Icon)</option>
                <option value="FiDatabase">FiDatabase (Database Server)</option>
                <option value="FiTrendingUp">FiTrendingUp (Trend Chart)</option>
                <option value="FiSettings">FiSettings (Cog Gear)</option>
              </select>
            </div>
            <div className="admin-input-group">
              <label>Sort Order Index</label>
              <input
                type="number"
                value={catForm.sortOrder}
                onChange={(e) => setCatForm({ ...catForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Description Subtitle</label>
            <textarea
              placeholder="Short description displayed under category card..."
              rows={2}
              value={catForm.desc}
              onChange={(e) => setCatForm({ ...catForm, desc: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <label className="admin-input-group admin-input-checkbox">
              <input
                type="checkbox"
                checked={catForm.isActive}
                onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
              />
              Is Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditing && (
                <button type="button" className="btn-gray" onClick={cancelCatEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-orange">
                Save Category
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Table of Categories */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Services Categories</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key ID</th>
                <th>Category Title</th>
                <th>Icon Class</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quoteCategories.map(cat => (
                <tr key={cat.id}>
                  <td><code>{cat.id}</code></td>
                  <td><strong>{cat.title}</strong></td>
                  <td><code>{cat.iconName}</code></td>
                  <td>{cat.sortOrder}</td>
                  <td>
                    <span className={`status-badge ${cat.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                      {cat.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table-action edit" onClick={() => startEditCategory(cat)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-table-action delete" onClick={() => handleDeleteCategory(cat.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filings Checklist Options Editor */}
      <div className="admin-card" style={{ marginTop: '3rem' }}>
        <div className="admin-card-header">
          <h2>Manage Service Filing Checkboxes (Step 2)</h2>
        </div>

        <div className="form-grid form-grid-2" style={{ gap: '2rem', alignItems: 'start' }}>

          <div>
            <div className="admin-card" style={{ background: '#f8fafc', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                Add Checklist Item
              </h3>
              <form onSubmit={handleAddFilingSubmit} className="login-form">
                <div className="admin-input-group">
                  <label>Select Category</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    {quoteCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-input-group">
                  <label>Filing Service Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Connect WhatsApp API"
                    value={filingFormName}
                    onChange={(e) => setFilingFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Order Index</label>
                  <input
                    type="number"
                    value={filingFormOrder}
                    onChange={(e) => setFilingFormOrder(parseInt(e.target.value) || 1)}
                  />
                </div>

                <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center' }}>
                  <FiPlus /> Add Filing Option
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="admin-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                {activeCategoryObj ? `${activeCategoryObj.title} Checklist` : 'Filings Options'}
              </h3>

              <div className="filings-list-editor">
                {!activeCategoryObj || !activeCategoryObj.filings || activeCategoryObj.filings.length === 0 ? (
                  <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#64748b' }}>
                    No services added yet for this category.
                  </p>
                ) : (
                  activeCategoryObj.filings.map(filing => (
                    <div key={filing.id} className="filing-tag-pill">
                      <span>{filing.name}</span>
                      <button
                        className="btn-remove-tag"
                        onClick={() => handleDeleteFiling(filing.id, selectedCategoryId)}
                        title="Delete Option"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Turnover Options Editor (Step 3) */}
      <div className="admin-card" style={{ marginTop: '3rem' }}>
        <div className="admin-card-header">
          <h2>{isEditingTurnover ? 'Edit Turnover Option' : 'Add New Turnover Option (Step 3)'}</h2>
        </div>
        <form onSubmit={handleTurnoverSubmit} className="login-form">
          <div className="form-grid form-grid-2">
            <div className="admin-input-group">
              <label>Bracket Label</label>
              <input
                type="text"
                placeholder="E.g., ₹40L to ₹1 Crore"
                value={turnoverForm.label}
                onChange={(e) => setTurnoverForm({ ...turnoverForm, label: e.target.value })}
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Sort Order</label>
              <input
                type="number"
                value={turnoverForm.sortOrder}
                onChange={(e) => setTurnoverForm({ ...turnoverForm, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <label className="admin-input-group admin-input-checkbox">
              <input
                type="checkbox"
                checked={turnoverForm.isActive}
                onChange={(e) => setTurnoverForm({ ...turnoverForm, isActive: e.target.checked })}
              />
              Is Active
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditingTurnover && (
                <button type="button" className="btn-gray" onClick={cancelTurnoverEdit}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-orange">
                {isEditingTurnover ? 'Update Option' : 'Save Option'}
              </button>
            </div>
          </div>
        </form>

        <div className="table-responsive" style={{ marginTop: '1.5rem' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bracket Label</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {turnoverOptions.map(opt => (
                <tr key={opt.id}>
                  <td><strong>{opt.label}</strong></td>
                  <td>{opt.sortOrder}</td>
                  <td>
                    <span className={`status-badge ${opt.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                      {opt.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-table-action edit" onClick={() => startEditTurnover(opt)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-table-action delete" onClick={() => handleDeleteTurnover(opt.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        title={confirmModal.title}
        message={confirmModal.message}
        type="confirm"
        confirmText="Delete"
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
