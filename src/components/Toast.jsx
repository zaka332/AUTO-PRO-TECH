import { createContext, useContext, useState, useCallback } from 'react'

// نظام إشعارات Toast — ردود فعل احترافية لإجراءات المستخدم
const ToastCtx = createContext(null)
let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  const notify = useCallback((msg, opts = {}) => {
    const id = ++_id
    setToasts((t) => [...t.slice(-2), { id, msg, ...opts }])
    setTimeout(() => dismiss(id), opts.duration || 3200)
  }, [])

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span className="toast-msg">{t.msg}</span>
            {t.actionLabel && (
              <button className="toast-action" onClick={() => { t.onAction?.(); dismiss(t.id) }}>
                {t.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx) || { notify: () => {} }
}
