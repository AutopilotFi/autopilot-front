"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink, X } from "lucide-react";

export interface ToastProps {
  id: string;
  type: "success" | "error";
  title: string;
  message: string;
  txHash?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, txHash, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getExplorerUrl = (hash: string) => {
    // Base network explorer - adjust based on your network
    return `https://basescan.org/tx/${hash}`;
  };

  return (
    <div
      className={`${type === 'error' ? 'max-w-lg' : 'max-w-md'} w-full bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ${
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            {type === "success" ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 break-words">{title}</h4>
            <p className="text-sm text-gray-600 mt-1 break-words leading-relaxed">{message}</p>
            
            {/* Transaction Hash Link */}
            {txHash && (
              <a
                href={getExplorerUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full transition-all ease-linear ${
              type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
