"use client";

import Toast, { ToastProps } from "./Toast";

interface ToastContainerProps {
  toasts: ToastProps[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 99999 }}
    >
      <div className="absolute top-4 right-4 space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 4}px)`,
              zIndex: 99999 - index,
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </div>
  );
}
