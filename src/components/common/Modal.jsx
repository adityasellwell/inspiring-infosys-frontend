import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle, FiHelpCircle, FiX } from 'react-icons/fi';
import './Modal.css';

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'info' | 'success' | 'warning' | 'error' | 'confirm'
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm
}) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={30} />;
      case 'error':
        return <FiXCircle size={30} />;
      case 'warning':
        return <FiAlertTriangle size={30} />;
      case 'confirm':
        return <FiHelpCircle size={30} />;
      default:
        return <FiInfo size={30} />;
    }
  };

  const getDefaultTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'confirm': return 'Are you sure?';
      default: return 'Notice';
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-box" onClick={e => e.stopPropagation()}>
        <button className="custom-modal-close-icon" onClick={onClose} aria-label="Close modal">
          <FiX size={18} />
        </button>

        <div className={`custom-modal-icon-wrapper ${type}`}>
          {renderIcon()}
        </div>

        <h3 className="custom-modal-title">{getDefaultTitle()}</h3>
        <p className="custom-modal-message">{message}</p>

        <div className="custom-modal-actions">
          {type === 'confirm' && (
            <button
              type="button"
              className="custom-modal-btn secondary"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={`custom-modal-btn ${type === 'error' || type === 'confirm' ? 'primary' : 'primary'}`}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
