import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen auth-mesh-bg flex items-center justify-center p-6 font-sans selection:bg-primary/30 selection:text-white">
            {/* Dynamic Background Auras */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-float opacity-50"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] animate-float opacity-30" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Brand/Logo Section */}
                <div className="text-center mb-10 transition-all duration-700 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 shadow-2xl shadow-primary/30 mb-6 group hover:rotate-6 transition-transform duration-500 cursor-pointer">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
                        Quizora<span className="text-primary">.</span>
                    </h1>
                    <p className="text-foreground/60 text-[10px] font-black uppercase tracking-[0.3em] opacity-90">
                        Intelligence Platform
                    </p>
                </div>

                {/* The Card */}
                <div className="premium-glass p-10 rounded-[40px] relative group transition-all duration-700 hover:shadow-primary/5">
                    {/* Subtle top glow line */}
                    <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                    <div className="mb-8 font-jakarta">
                        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium opacity-80">{subtitle}</p>
                    </div>

                    {children}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        End-to-End Encryption Active
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
