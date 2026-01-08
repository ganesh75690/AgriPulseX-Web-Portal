import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface SaveConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function SaveConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: SaveConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#2f9d58] p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dialog Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-[#2f9d58]" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Dialog Actions */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f9d58]/50 transition-all shadow-sm hover:shadow-md"
          >
            No
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f9d58]/50 transition-all shadow-sm hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 text-sm font-medium text-white bg-[#2f9d58] border-2 border-[#237a3f] rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-105 hover:bg-[#237a3f]"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
