'use client';

import { useState, useCallback } from 'react';
import { ToastProps } from '@/components/UI/Toast';

interface ToastData {
  type: 'success' | 'error';
  title: string;
  message: string;
  txHash?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toastData: ToastData) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      ...toastData,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== toastId));
      },
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, txHash?: string) => {
      return addToast({
        type: 'success',
        title,
        message,
        txHash,
        duration: 8000, // Longer duration for success with tx hash
      });
    },
    [addToast]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      return addToast({
        type: 'error',
        title,
        message,
        duration: 6000,
      });
    },
    [addToast]
  );

  return {
    toasts,
    showSuccess,
    showError,
    removeToast,
  };
}
