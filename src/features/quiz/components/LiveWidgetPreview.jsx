import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, EyeOff, Sparkles } from 'lucide-react';

const LiveWidgetPreview = ({ theme, settings, viewMode, setViewMode, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const isGlassMorph = theme.layoutMode === 'glass-morph';

    const getRadius = () => {
        if (theme.borderRadius === 'pill') return '9999px';
        if (theme.borderRadius === 'rounded') return '1.5rem';
        return '0px';
    };

    const getShadow = () => {
        if (theme.shadowIntensity === 'soft') return '0 10px 25px -5px rgba(0,0,0,0.1)';
        if (theme.shadowIntensity === 'medium') return '0 20px 50px -10px rgba(0,0,0,0.2)';
        if (theme.shadowIntensity === 'hard') return '0 30px 60px 0px rgba(0,0,0,0.4)';
        return 'none';
    };

    const buttonStyles = {
        solid: { backgroundColor: theme.primaryColor, color: '#fff', border: 'none', fontFamily: theme.fontFamily },
        outline: { backgroundColor: 'transparent', color: theme.primaryColor, border: `2px solid ${theme.primaryColor}`, fontFamily: theme.fontFamily },
        ghost: { backgroundColor: `${theme.primaryColor}10`, color: theme.primaryColor, border: 'none', fontFamily: theme.fontFamily }
    };

    const deviceViewStyles = {
        mobile: "w-[340px] h-[680px] rounded-[3rem] border-[8px]",
        tablet: "w-[600px] h-[800px] rounded-[2.5rem] border-[10px]",
        desktop: "w-full max-w-[900px] h-[600px] rounded-[1.5rem] border-[4px]"
    };

    const getTransition = () => {
        if (theme.animationStyle === 'spring') return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        if (theme.animationStyle === 'bounce') return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        if (theme.animationStyle === 'smooth') return 'cubic-bezier(0.4, 0, 0.2, 1)';
        return 'linear';
    };

    const getFrameStyles = () => {
        if (viewMode !== 'desktop') return {};
        const isFullscreen = settings.defaultLayout === 'fullscreen';
        return {
            width: isFullscreen ? '100%' : `${settings.maxWidth}px`,
            height: isFullscreen ? '700px' : `${settings.maxHeight}vh`,
            maxWidth: '100%',
        };
    };

    return (
        <div className={`sticky top-8 shrink-0 transition-all duration-700 ease-in-out ${viewMode === 'desktop' ? 'w-full mt-12' : 'w-fit'}`}>
            <div className="flex flex-col items-center gap-6">
                {/* Device Switcher */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-1 z-30">
                    {[
                        { id: 'mobile', icon: <Smartphone size={14} /> },
                        { id: 'tablet', icon: <Tablet size={14} /> },
                        { id: 'desktop', icon: <Monitor size={14} /> }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`p-2.5 rounded-xl transition-all ${viewMode === mode.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                        >
                            {mode.icon}
                        </button>
                    ))}
                    <div className="w-[1px] h-6 bg-slate-100 mx-1" />
                    <button onClick={onClose} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all" title="Hide Preview">
                        <EyeOff size={14} />
                    </button>
                </div>

                {/* Frame Container */}
                <div
                    className={`bg-slate-900 shadow-2xl border-slate-800 relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${viewMode !== 'desktop' ? deviceViewStyles[viewMode] : 'border-[4px] rounded-[1.5rem]'}`}
                    style={{
                        ...getFrameStyles(),
                        transform: viewMode !== 'desktop' ? (
                            settings.position === 'center' ? 'none' :
                                settings.position === 'bottom-right' ? 'scale(0.8) translate(10%, 10%)' :
                                    settings.position === 'sidebar-left' ? 'translateX(-15%)' : 'translateX(15%)'
                        ) : 'none'
                    }}
                >
                    {/* Notch for Mobile/Tablet */}
                    {viewMode !== 'desktop' && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
                            <div className="w-8 h-1 bg-slate-700/50 rounded-full" />
                        </div>
                    )}

                    <div
                        className={`h-full w-full overflow-hidden flex flex-col relative transition-all duration-700 ${isGlassMorph ? 'bg-slate-900' : ''}`}
                        style={{
                            backgroundColor: isGlassMorph ? undefined : theme.backgroundColor,
                            color: theme.textColor,
                            fontFamily: theme.fontFamily,
                            borderRadius: viewMode === 'desktop' ? '1rem' : '2rem'
                        }}
                    >
                        {/* GLASS MORPH BACKGROUND BLOBS */}
                        {isGlassMorph && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[80px] animate-pulse" />
                                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[60px]" />
                            </div>
                        )}
                        {/* Progress Bar */}
                        {theme.layoutMode !== 'split-hero' && (
                            <div className={`px-8 ${viewMode === 'desktop' ? 'pt-8' : 'pt-12'}`}>
                                {theme.progressStyle === 'bar' && (
                                    <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-700"
                                            style={{
                                                backgroundColor: theme.primaryColor,
                                                width: currentStep === 1 ? '33%' : (currentStep === 2 ? '66%' : '100%'),
                                                transitionTimingFunction: getTransition()
                                            }}
                                        />
                                    </div>
                                )}
                                {theme.progressStyle === 'percentage' && (
                                    <div className="flex items-center justify-between">
                                        <div className="h-1 flex-1 bg-black/10 rounded-full overflow-hidden mr-4">
                                            <div
                                                className="h-full transition-all duration-700"
                                                style={{
                                                    backgroundColor: theme.primaryColor,
                                                    width: currentStep === 1 ? '33%' : (currentStep === 2 ? '66%' : '100%'),
                                                    transitionTimingFunction: getTransition()
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black font-mono opacity-40">
                                            {currentStep === 1 ? '33%' : (currentStep === 2 ? '66%' : '100%')}
                                        </span>
                                    </div>
                                )}
                                {theme.progressStyle === 'minimal' && (
                                    <div className="flex justify-center gap-1.5">
                                        {[1, 2, 3].map(i => (
                                            <div
                                                key={i}
                                                className="h-1 rounded-full transition-all duration-500"
                                                style={{
                                                    width: currentStep === i ? '12px' : '4px',
                                                    backgroundColor: currentStep === i ? theme.primaryColor : theme.primaryColor + '20'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`flex-1 flex flex-col justify-center px-10 space-y-8 ${viewMode === 'desktop' ? (theme.layoutMode === 'split-hero' ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto') : ''}`}>
                            <div className="space-y-4">
                                {theme.layoutMode === 'split-hero' ? (
                                    <div className="flex flex-col items-center gap-4 mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: theme.primaryColor }}>
                                            SECTION {currentStep}
                                        </p>
                                        <div className="h-px w-10" style={{ backgroundColor: `${theme.primaryColor}40` }} />
                                    </div>
                                ) : theme.layoutMode !== 'minimalist' ? (
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 flex items-center justify-center gap-2">
                                        <Sparkles size={12} style={{ color: theme.primaryColor }} />
                                        Step {currentStep} of 3
                                    </span>
                                ) : null}

                                <h2 className={`${viewMode === 'mobile' ? 'text-2xl' : (theme.layoutMode === 'split-hero' ? 'text-5xl' : 'text-4xl')} font-black leading-tight tracking-tight text-center`}>
                                    {currentStep === 1 ? "Which look defines you best?" : currentStep === 2 ? "What's your primary goal?" : "Almost there!"}
                                </h2>
                            </div>

                            <div className={`grid gap-3 ${viewMode === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {[1, 2, 3, 4].map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentStep(currentStep < 3 ? currentStep + 1 : 1)}
                                        className="w-full p-4 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                                        style={{
                                            backgroundColor: isGlassMorph ? 'rgba(255,255,255,0.03)' : theme.secondaryColor + '40',
                                            border: isGlassMorph ? '1px solid rgba(255,255,255,0.05)' : `1.5px solid ${theme.secondaryColor}20`,
                                            borderRadius: isGlassMorph ? '2rem' : getRadius(),
                                            boxShadow: getShadow(),
                                            fontFamily: theme.fontFamily,
                                            backdropFilter: isGlassMorph ? 'blur(10px)' : 'none'
                                        }}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-110"
                                            style={{
                                                backgroundColor: isGlassMorph ? 'white' : theme.primaryColor + '20',
                                                color: isGlassMorph ? 'black' : theme.primaryColor
                                            }}>
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                        <span className="font-bold text-sm opacity-90 truncate">Option Variation {i}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Navigation */}
                        {theme.layoutMode === 'split-hero' ? (
                            <div className="p-6 border-t border-black/5 bg-white/50 backdrop-blur-md">
                                <div className="flex items-center gap-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between text-[8px] font-black uppercase opacity-40">
                                            <span>Progress</span>
                                            <span>{currentStep === 1 ? '33%' : (currentStep === 2 ? '66%' : '100%')}</span>
                                        </div>
                                        <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-700" style={{ backgroundColor: theme.primaryColor, width: currentStep === 1 ? '33%' : (currentStep === 2 ? '66%' : '100%') }} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(currentStep < 3 ? currentStep + 1 : 1)}
                                        className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all"
                                        style={{ ...buttonStyles[theme.buttonStyle], borderRadius: '12px' }}
                                    >
                                        {currentStep === 3 ? "Finish" : "Next"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-8 text-center border-t ${viewMode === 'desktop' ? 'flex flex-row items-center justify-between gap-8 pt-6' : ''}`} style={{ borderColor: theme.secondaryColor + '20' }}>
                                <button
                                    onClick={() => setCurrentStep(currentStep < 3 ? currentStep + 1 : 1)}
                                    className={`font-black uppercase tracking-widest text-xs shadow-lg transition-all ${viewMode === 'desktop' ? 'w-48 h-12 order-2' : 'w-full h-14 mb-6'}`}
                                    style={{
                                        ...buttonStyles[theme.buttonStyle],
                                        borderRadius: getRadius()
                                    }}
                                >
                                    {currentStep === 3 ? "Complete" : "Continue"}
                                </button>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-20">
                                    Powered by Recommendation Engine
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Sync Badge */}
                <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Sync</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveWidgetPreview;
