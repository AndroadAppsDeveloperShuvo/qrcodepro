import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div
      id="toast-container"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full max-w-md px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-600/95 text-white border-emerald-500 shadow-emerald-900/20'
                : toast.type === 'error'
                ? 'bg-rose-600/95 text-white border-rose-500 shadow-rose-900/20'
                : 'bg-blue-600/95 text-white border-blue-500 shadow-blue-900/20'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}

            <span className="flex-1">{toast.text}</span>

            <button
              id={`toast-close-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
