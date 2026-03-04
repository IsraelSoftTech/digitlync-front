import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './ConfirmModal.css';

/**
 * Reusable confirmation modal with a cool message box design.
 * @param {boolean} open - Whether the modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Main message body
 * @param {string} confirmLabel - Text for confirm button (default: "Confirm")
 * @param {string} cancelLabel - Text for cancel button (default: "Cancel")
 * @param {string} variant - 'danger' | 'warning' | 'neutral' (default: 'danger' for destructive actions)
 * @param {function} onConfirm - Called when user confirms
 * @param {function} onCancel - Called when user cancels or clicks overlay
 * @param {boolean} loading - Disable buttons and show loading state
 * @param {string} loadingLabel - Text shown on confirm button when loading (default: confirmLabel + "...")
 */
function ConfirmModal({
  open,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  loadingLabel,
}) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) onCancel?.();
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div className={`confirm-modal confirm-modal-${variant}`}>
        <div className="confirm-modal-icon-wrap">
          <FiAlertTriangle className="confirm-modal-icon" aria-hidden />
        </div>
        <h2 id="confirm-modal-title" className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn confirm-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-modal-btn confirm-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (loadingLabel ?? `${confirmLabel}ing...`) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
