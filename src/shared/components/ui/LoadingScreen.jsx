import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = "Synchronizing Architectural Data..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0b] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] animate-bounce pointer-events-none" style={{ animationDuration: '8s' }} />
      
      <div className="relative flex flex-col items-center gap-10">
        {/* Logo Icon with Glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-primary via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-2xl relative z-10 animate-reveal">
            <Sparkles size={44} className="animate-pulse" />
          </div>
          
          {/* Orbiting Ring */}
          <div className="absolute inset-[-12px] border border-primary/20 rounded-[40px] animate-[spin_4s_linear_infinite]" />
        </div>

        {/* Text Area */}
        <div className="text-center space-y-4 max-w-xs">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase animate-reveal">
              Quizora
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center gap-3 py-2 px-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
             <Loader2 size={16} className="text-primary animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 whitespace-nowrap">
               {message}
             </p>
          </div>
        </div>

        {/* Technical Deco */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-primary/50 to-transparent" />
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">
          Platform Version 2.4.0 • Enterprise Edition
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
