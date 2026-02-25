import React, { useEffect } from 'react';
import { X, AlertTriangle, Archive, Trash2, Info, AlertCircle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger", // 'danger', 'warning', 'info', 'error'
    isLoading = false,
    showCancel = true,
    confirmIcon: CustomIcon = null
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const getIcon = () => {
        if (CustomIcon) return <CustomIcon size={36} />;
        switch (type) {
            case 'danger': return <Trash2 size={36} />;
            case 'warning': return <AlertTriangle size={32} />;
            case 'error': return <AlertCircle size={36} />;
            case 'info': return <Info size={32} />;
            default: return <Archive size={32} />;
        }
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'danger': return {
                iconBg: 'bg-rose-500/10 text-rose-500 shadow-inner',
                confirmBtn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white',
            };
            case 'error': return {
                iconBg: 'bg-red-500/10 text-red-500 shadow-inner border border-red-500/20',
                confirmBtn: 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white',
            };
            case 'warning': return {
                iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                confirmBtn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
            };
            case 'info': return {
                iconBg: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                confirmBtn: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20 text-white',
            };
            default: return {
                iconBg: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                confirmBtn: 'bg-slate-900 hover:bg-black text-white',
            };
        }
    };

    const styles = getTypeStyles();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in">
            {/* Backdrop click to close */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative max-w-md w-full bg-card border border-border shadow-2xl rounded-[40px] p-10 animate-reveal overflow-hidden flex flex-col max-h-[90vh]">
                <div className="overflow-y-auto custom-scrollbar pr-2 -mr-2">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon Container */}
                        <div className={`w-20 h-20 rounded-3xl ${styles.iconBg} flex items-center justify-center mb-6 shadow-inner shrink-0`}>
                            {getIcon()}
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight uppercase italic">
                                {title}
                            </h3>
                            <p className="text-muted-foreground mt-2 font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-10">
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`h-14 ${styles.confirmBtn} font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {!CustomIcon && type === 'danger' && <Trash2 size={18} />}
                                    {confirmText}
                                </>
                            )}
                        </button>

                        {showCancel && (
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="h-14 bg-muted hover:bg-muted/80 text-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 border border-transparent shadow-sm"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>

                {/* Close Interaction */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-muted-foreground/30 hover:text-foreground transition-all"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
