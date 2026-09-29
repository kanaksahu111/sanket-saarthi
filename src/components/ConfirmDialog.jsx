import { useEffect, useRef } from 'react';
export default function ConfirmDialog({ title, children, pending, error, onCancel, onConfirm }) {
  const dialog = useRef(null);
  useEffect(() => { const node = dialog.current; node.showModal(); return () => node.close(); }, []);
  return <dialog ref={dialog} className="confirm-dialog" aria-labelledby="confirm-heading" onCancel={e => { e.preventDefault(); if (!pending) onCancel(); }}><h2 id="confirm-heading">{title}</h2>{children}<p>This update will be shown to affected visitors.</p>{error && <p role="alert" className="error-text">{error}</p>}<div className="action-row"><button autoFocus className="secondary-action" onClick={onCancel} disabled={pending}>Cancel</button><button className="continue-button" onClick={onConfirm} disabled={pending}>{pending ? 'Updating…' : 'Confirm Update'}</button></div></dialog>;
}
