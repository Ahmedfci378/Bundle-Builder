import { useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';

const AUTO_DISMISS_MS = 4000;

const VARIANT_CLASS: Record<string, string> = {
  success: 'text-bg-success',
  info: 'text-bg-dark',
  danger: 'text-bg-danger',
};

/**
 * Reads the one active toast from builder state (state.ui.toast) and
 * auto-dismisses it. Toast content is produced by the reducer as a
 * side-effect-free part of the same action that caused it (e.g.
 * SAVE_CONFIGURATION), so this component never decides what message to
 * show — it only renders whatever's currently in state.
 */
export function ToastContainer() {
  const { toast, clear } = useToast();

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(clear, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [toast, clear]);

  if (!toast) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
      <div className={`toast show ${VARIANT_CLASS[toast.variant]}`} role="status" aria-live="polite">
        <div className="d-flex">
          <div className="toast-body">{toast.message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Dismiss"
            onClick={clear}
          />
        </div>
      </div>
    </div>
  );
}
