import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../shared/components/layout/Layout';
import { User, Mail, Shield, Bell, Save, CheckCircle2, Copy, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../lib/axios';

const Profile = () => {
    const { user } = useAuth();

    const [emailInput, setEmailInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved team emails on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiClient.get('/auth/profile');
                const emails = data?.user?.employeeEmails || [];
                setEmailInput(emails.join(', '));
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleCopyId = () => {
        navigator.clipboard.writeText(user?.id);
        toast.success('Identity ID copied to clipboard!');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Split by comma, trim whitespace, filter blanks
            const emailArray = emailInput
                .split(',')
                .map(e => e.trim())
                .filter(e => e.length > 0);

            const data = await apiClient.patch('/auth/profile', {
                employeeEmails: emailArray,
            });

            const saved = data?.employeeEmails || [];
            setEmailInput(saved.join(', '));

            const skipped = emailArray.length - saved.length;
            if (skipped > 0) {
                toast.success(`Saved ${saved.length} email(s). ${skipped} invalid email(s) were removed.`, {
                    icon: '⚠️',
                    duration: 4000,
                });
            } else {
                toast.success(`${saved.length} team email(s) synchronized successfully!`);
            }
        } catch (err) {
            toast.error(err?.message || 'Failed to save preferences. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto animate-reveal">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Identity Profile</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Manage your architectural credentials and notification preferences.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Col: Avatar & Status */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="premium-glass p-8 rounded-[32px] text-center border-primary/20 bg-primary/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                            <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary/30 mb-6 group-hover:rotate-3 transition-transform">
                                <span className="text-4xl font-black">{user?.email?.[0]?.toUpperCase() || 'Q'}</span>
                            </div>
                            <h2 className="text-xl font-black text-foreground">{user?.email?.split('@')[0]}</h2>
                            <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mt-1">Enterprise Admin</p>

                            <div className="mt-8 pt-8 border-t border-border/10">
                                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                                    <CheckCircle2 size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Multi-Tenant</span>
                                </div>
                            </div>
                        </div>

                        <div className="premium-glass p-6 rounded-2xl border-border/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Security Identifier</h3>
                            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border/50 group cursor-pointer" onClick={handleCopyId}>
                                <code className="text-[10px] font-bold text-foreground truncate mr-2">{user?.id}</code>
                                <Copy size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Details & Notifications */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Core Details */}
                        <div className="premium-glass p-8 rounded-[32px] border-border/50 bg-card/30 backdrop-blur-3xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                                    <User size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground">Core Credentials</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Primary access email and authority role.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Authority Email</label>
                                    <div className="h-14 bg-muted/30 border border-border/50 rounded-2xl flex items-center px-4 text-foreground font-bold">
                                        <Mail size={18} className="text-muted-foreground mr-3" />
                                        {user?.email}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Role</label>
                                    <div className="h-14 bg-muted/30 border border-border/50 rounded-2xl flex items-center px-4 text-foreground font-bold">
                                        <Shield size={18} className="text-muted-foreground mr-3" />
                                        {user?.role?.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Notifications */}
                        <div className="premium-glass p-8 rounded-[32px] border-border/50 bg-card/30 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Bell size={80} className="text-primary rotate-12" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Bell size={22} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-foreground">Email Notifications</h3>
                                    <p className="text-xs text-muted-foreground font-medium">Automatic lead alerts for your team members.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Team Recipient List</label>

                                    {isLoading ? (
                                        <div className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 min-h-[100px] flex items-center justify-center">
                                            <Loader2 size={20} className="text-muted-foreground animate-spin" />
                                        </div>
                                    ) : (
                                        <textarea
                                            className="w-full bg-muted/30 border border-border/50 rounded-2xl p-4 text-foreground font-bold min-h-[100px] focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all resize-none"
                                            placeholder="Enter emails separated by commas (e.g. sales@company.com, ceo@company.com)"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                        />
                                    )}

                                    <div className="flex items-start gap-2 px-1">
                                        <AlertCircle size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                                        <p className="text-[9px] text-muted-foreground font-medium italic">
                                            These emails will receive a premium HTML notification for every new lead captured. Invalid emails will be automatically removed on save.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading}
                                    className="w-full h-14 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Synchronize Preferences
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
