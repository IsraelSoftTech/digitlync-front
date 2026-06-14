import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Toaster.css';

let enqueueExternal = null;

export function showToast(message, { type = 'info', timeout = 4000 } = {}) {
  if (enqueueExternal) enqueueExternal({ message, type, timeout });
}

export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    enqueueExternal = (t) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...t }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, t.timeout || 4000);
    };
    return () => {
      enqueueExternal = null;
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="toaster-root">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
}
