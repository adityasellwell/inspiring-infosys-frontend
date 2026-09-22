import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { authApi } from '../../../api/api';
import { useToast } from '../../../components/common/ToastContext';

export default function AdminProfileTab() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: 'Admin Sellwell',
    email: 'support@sellwellone.com',
    newPassword: ''
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const res = await authApi.me();
      if (res && res.success) {
        if (res.admin) {
          setForm(prev => ({
            ...prev,
            name: res.admin.name || prev.name,
            email: res.admin.email || prev.email
          }));
        } else if (res.name) {
          setForm(prev => ({ ...prev, name: res.name }));
        }
      }
    } catch (err) {
      console.warn('Failed to fetch admin profile me details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Full Name and Email Address are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        newPassword: form.newPassword ? form.newPassword.trim() : undefined
      });

      if (res && res.success) {
        toast.success(res.message || 'Admin profile & security credentials updated!');
        if (res.token) {
          localStorage.setItem('admin_token', res.token);
        }
        if (res.name) {
          localStorage.setItem('admin_name', res.name);
        }
        setForm(prev => ({ ...prev, newPassword: '' }));
        fetchAdminProfile();
      } else {
        toast.error(res?.message || 'Failed to update admin profile.');
      }
    } catch (err) {
      toast.error(err?.message || 'Server error. Failed to update credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontWeight: '700' }}>Loading administrator profile...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* ── Top Header Profile Hero Banner ── */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Avatar Initials Badge */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.1rem',
            fontWeight: '900',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
            border: '3px solid #ffffff',
            flexShrink: 0
          }}>
            {form.name ? form.name.charAt(0).toUpperCase() : 'A'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{form.name}</h2>
              <span style={{
                background: '#e0e7ff',
                color: '#4338ca',
                fontWeight: '800',
                fontSize: '0.74rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FiCheckCircle size={12} /> Administrator
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.86rem', color: '#64748b', marginTop: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FiMail style={{ color: '#6366f1' }} /> {form.email}</span>
            </div>
          </div>
        </div>

        <div>
          <span style={{
            background: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            fontWeight: '700',
            fontSize: '0.82rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            Account Status: <strong>Active</strong>
          </span>
        </div>
      </div>

      {/* ── Form Section Grid Layout ── */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'stretch' }}>
          
          {/* Card 1: Administrator Details */}
          <div style={{
            background: '#fff',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiUser size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>ADMINISTRATOR DETAILS</h3>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>Update administrator contact details</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-field-group">
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.86rem', color: '#334155' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.4rem', fontWeight: '600' }}
                      placeholder="Admin Sellwell"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="form-label" style={{ fontWeight: '700', fontSize: '0.86rem', color: '#334155' }}>
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="email"
                      className="form-control"
                      style={{ paddingLeft: '2.4rem', fontWeight: '600' }}
                      placeholder="support@sellwellone.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Password */}
          <div style={{
            background: '#fff',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiLock size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>SECURITY & PASSWORD</h3>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>Leave blank if you do not wish to change password</p>
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.86rem', color: '#334155' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem', background: '#f0f7ff', border: '1px solid #bfdbfe' }}
                    placeholder="••••••••••••"
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                  💡 Tip: Use a strong password with letters & numbers.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Row: Save Changes Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.85rem 2.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <FiSave size={18} /> {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
