import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Error Header Decor */}
        <div className="h-2 bg-red-500 w-full" />
        
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">Error Occurred</h3>
            <p className="text-muted-foreground leading-relaxed">
              {message || "An unexpected error happened. Please try again."}
            </p>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-all active:scale-95"
            >
              Close and Fix
            </button>
          </div>
        </div>

        {/* Close Icon (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
