import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation of reset link sending
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
            toast.success('Recovery link dispatched!');
        }, 1800);
    };

    return (
        <AuthLayout
            title="Recovery Protocol"
            subtitle={isSent
                ? "A secure reset link has been dispatched to your identity."
                : "Initiate identity recovery to regain platform access."}
        >
            {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] mb-3 block ml-1">
                            Registered Email
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors duration-300" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="premium-input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2 transition-all duration-500 disabled:opacity-50 mt-4 shadow-2xl shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                Request Link
                                <Send size={16} />
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <div className="text-center py-6 animate-fade-in">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 className="text-primary animate-pulse" size={32} />
                    </div>
                    <p className="text-foreground font-bold text-lg mb-3 tracking-tight">Transmission Successful</p>
                    <p className="text-muted-foreground/80 text-[13px] leading-relaxed mb-8">
                        Check your inbox for <br />
                        <span className="text-foreground font-bold">{email}</span>
                    </p>
                    <button
                        onClick={() => setIsSent(false)}
                        className="text-primary font-black uppercase tracking-widest text-[10px] hover:text-foreground transition-colors border-b border-primary/20 pb-1"
                    >
                        Try alternative identity?
                    </button>
                </div>
            )}

            <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                <Link to="/login" className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2">
                    <ArrowLeft size={14} />
                    Return to Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
