import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Users, ArrowRight, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const LandingPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-primary/30 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px] animate-float opacity-30"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[140px] animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                        <ShieldCheck size={22} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">Quizora<span className="text-primary">.</span></span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-white/50">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                                <LayoutDashboard size={14} />
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <LogOut size={14} />
                                Exit
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">The Future of Customer Intelligence</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-fade-in-up">
                    Scale User <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500">Discovery</span> <br />
                    At Lightning Speed.
                </h1>

                <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Engineered for high-growth SaaS teams. Create intelligent recommendation engines,
                    capture high-intent leads, and unlock deep behavioral insights in minutes.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link to="/register" className="group w-full md:w-auto px-10 py-5 bg-primary hover:bg-blue-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary/30">
                        Build Your First Quiz
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="w-full md:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all">
                        View Live Demo
                    </button>
                </div>

                {/* Hero Visual Mockup */}
                <div className="mt-28 relative animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-75 opacity-20"></div>
                    <div className="premium-glass rounded-[40px] p-4 border border-white/10 shadow-2xl">
                        <div className="rounded-[32px] overflow-hidden bg-[#16161a] aspect-video flex items-center justify-center border border-white/5">
                            <div className="text-center">
                                <Zap size={48} className="text-primary mb-4 mx-auto animate-pulse" />
                                <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Premium Dashboard Interface</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Enterprise-Ready Features.</h2>
                    <p className="text-white/40 uppercase font-bold tracking-[0.3em] text-[10px]">Engineered for Performance & Scale</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="premium-glass p-8 rounded-[32px] hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap size={24} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Hyper-Fast Engine</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Zero-latency quiz rendering and intelligent branching logic built on top of our proprietary core.
                        </p>
                    </div>

                    <div className="premium-glass p-8 rounded-[32px] hover:border-indigo-500/50 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users size={24} className="text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Lead Intelligence</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Deep affinity matching system that tags leads based on behavioral psychographics and intent.
                        </p>
                    </div>

                    <div className="premium-glass p-8 rounded-[32px] hover:border-blue-400/50 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BarChart3 size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Real-time funnel visualization and conversion tracking and event-level attribution.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6 max-w-4xl mx-auto text-center">
                <div className="premium-glass p-16 rounded-[48px] border-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none"></div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 relative z-10">
                        Ready to revolutionize <br /> your conversion funnel?
                    </h2>
                    <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 relative z-10">
                        Join Quizora Today
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 pt-20 pb-10 border-t border-white/5 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <ShieldCheck size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter">Quizora<span className="text-primary">.</span></span>
                    </div>

                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                        © 2026 Quizora Intelligence Platform. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
