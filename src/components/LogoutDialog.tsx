import React, { useState } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutDialogProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function LogoutDialog({ onLogout, children }: LogoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log('LogoutDialog: handleLogout called');
    setIsOpen(false);
    
    // Rotate login background image immediately when logout is confirmed
    const currentImageIndex = localStorage.getItem('loginImageIndex');
    const nextIndex = currentImageIndex ? (parseInt(currentImageIndex) + 1) % 2 : 0;
    localStorage.setItem('loginImageIndex', nextIndex.toString());
    
    // Add a small delay to show the logout confirmation
    setTimeout(() => {
      console.log('LogoutDialog: calling onLogout callback');
      onLogout();
    }, 300);
  };

  return (
    <>
      {/* Trigger Button */}
      {children ? (
        <div onClick={() => {
          console.log('LogoutDialog: Trigger button clicked');
          setIsOpen(true);
        }}>
          {children}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Secure Logout</span>
        </button>
      )}

      {/* Dialog Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#2f9d58] p-6 max-w-md w-full mx-4 transform transition-all">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Dialog Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <p className="text-sm text-gray-600 mt-2">
                Are you sure you want to logout? You will need to authenticate again to access the system.
              </p>
            </div>

            {/* Dialog Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2f9d58]/50 transition-all shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border-2 border-red-700 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-105 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
