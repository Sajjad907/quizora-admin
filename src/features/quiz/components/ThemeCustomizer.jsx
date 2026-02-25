import React, { useState, useEffect } from 'react';
import {
  Palette, Type, Box, Sparkles, RotateCcw, Save, Loader2, Check, Layout,
  MousePointerClick, Layers, Smartphone, Tablet, Monitor, Eye, EyeOff,
  Zap, Sliders, Activity, MousePointer2, Waves, Gauge, Diamond, Compass
} from 'lucide-react';
import ColorPicker from '../../../shared/components/ui/ColorPicker';

import { THEME_PRESETS, BLUEPRINT_PRESETS, LAYOUT_PRESETS } from '../../../constants';

import LiveWidgetPreview from './LiveWidgetPreview';
const ThemeCustomizer = ({ quiz, onSave, isSaving, onChange }) => {
  // Initialize theme state with quiz data or defaults
  const [theme, setTheme] = useState({
    primaryColor: '#6366f1',
    backgroundColor: '#0a0a0b',
    textColor: '#ffffff',
    secondaryColor: '#1e293b',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    borderRadius: 'rounded',
    buttonStyle: 'solid',
    shadowIntensity: 'medium',
    animationStyle: 'spring', // spring, smooth, bounce, none
    progressStyle: 'bar', // bar, percentage, minimal
    layoutMode: 'classic', // classic, split-hero, full-center
  });

  const [settings, setSettings] = useState({
    defaultLayout: 'modal', // modal, fullscreen, inline
    position: 'center', // center, bottom-right, sidebar-left, sidebar-right
    maxWidth: 900,
    maxHeight: 85, // in vh
    contentWidth: 100, // in %
  });

  const [branding, setBranding] = useState({
    removeWatermark: false,
  });

  const [activeTab, setActiveTab] = useState('presets'); // presets | fine-tune
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [viewMode, setViewMode] = useState('mobile');
  // Load initial data from quiz
  useEffect(() => {
    if (quiz?.theme && Object.keys(quiz.theme).length > 0) {
      setTheme(prev => ({ ...prev, ...quiz.theme }));
    }
    if (quiz?.settings && Object.keys(quiz.settings).length > 0) {
      setSettings(prev => ({ ...prev, ...quiz.settings }));
    }
    if (quiz?.branding && Object.keys(quiz.branding).length > 0) {
      setBranding(prev => ({ ...prev, ...quiz.branding }));
    }
  }, [quiz?.id]); // Only run when the quiz ID changes (initial load)

  // Bubble up changes to parent
  useEffect(() => {
    if (onChange) {
      onChange({ theme, settings, branding });
    }
  }, [theme, settings, branding, onChange]);

  // Load Google Fonts dynamically
  useEffect(() => {
    if (theme.fontFamily) {
      const fontId = `font-${theme.fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.href = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/\s+/g, '+')}:wght@400;500;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [theme.fontFamily]);

  // Pre-load common fonts for presets & blueprints
  useEffect(() => {
    const presetFonts = [...new Set([
      ...THEME_PRESETS.map(p => p.theme.fontFamily),
      ...BLUEPRINT_PRESETS.map(p => p.blueprint.fontFamily)
    ])];
    presetFonts.forEach(font => {
      const fontId = `font-preset-${font.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, []);

  const handleSave = () => {
    onSave({ theme, settings, branding });
  };

  const applyPreset = (presetTheme) => {
    setTheme({ ...theme, ...presetTheme });
  };

  const handleReset = () => {
    setTheme({
      primaryColor: '#6366f1',
      backgroundColor: '#0a0a0b',
      textColor: '#ffffff',
      secondaryColor: '#1e293b',
      accentColor: '#8b5cf6',
      fontFamily: 'Inter',
      borderRadius: 'rounded',
      buttonStyle: 'solid',
      shadowIntensity: 'medium',
      animationStyle: 'spring',
      progressStyle: 'bar',
    });
    setSettings({
      defaultLayout: 'modal',
      position: 'center',
      maxWidth: 900,
      maxHeight: 85,
      contentWidth: 100,
    });
    setBranding({
      removeWatermark: false,
    });
  };

  const googleFonts = [
    'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Open Sans',
    'Lato', 'Raleway', 'Playfair Display', 'Merriweather',
    'Roboto Slab', 'Quicksand', 'Outfit',
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 lg:p-8 animate-reveal pb-20">

      {/* Header Actions - Compact */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none">
            Widget Studio
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 text-[10px] flex items-center gap-2">
            <MousePointerClick size={12} className="text-primary" />
            Design your experience
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/30">
          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isPreviewVisible ? 'text-primary bg-primary/5' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {isPreviewVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            {isPreviewVisible ? 'Hide' : 'Show'}
          </button>
          <div className="h-6 w-px bg-slate-100"></div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <div className="h-6 w-px bg-slate-100"></div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={`flex flex-col transition-all duration-700 ${viewMode === 'desktop' && isPreviewVisible ? 'gap-0' : 'lg:flex-row gap-10'}`}>
        {/* Left Side: Controls */}
        <div className={`transition-all duration-700 ${isPreviewVisible && viewMode !== 'desktop' ? 'flex-1 min-w-0' : 'w-full'}`}>
          <div className="space-y-6">
            {/* Navigation Tabs - More Compact */}
            <div className="flex bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200/60">
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-5 py-1.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${activeTab === 'presets'
                  ? 'bg-white text-primary shadow-sm border border-primary/10'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Sparkles size={12} />
                Themes
              </button>
              <button
                onClick={() => setActiveTab('layout')} // Keeping 'layout' id for compatibility
                className={`px-5 py-1.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${activeTab === 'layout'
                  ? 'bg-white text-primary shadow-sm border border-primary/10'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Layout size={12} />
                Experiences
              </button>
              <button
                onClick={() => setActiveTab('fine-tune')}
                className={`px-5 py-1.5 rounded-lg font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${activeTab === 'fine-tune'
                  ? 'bg-white text-primary shadow-sm border border-primary/10'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <Sliders size={12} />
                Fine-Tune
              </button>
            </div>

            {/* VIEW: EXPERIENCE GALLERY */}
            {activeTab === 'layout' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BLUEPRINT_PRESETS.map((bp) => {
                    const isActive = theme.layoutMode === bp.blueprint.layoutMode;
                    return (
                      <button
                        key={bp.id}
                        onClick={() => setTheme({ ...theme, ...bp.blueprint })}
                        className={`group relative flex flex-col p-6 rounded-[2.5rem] border-2 transition-all text-left h-full ${isActive ? 'bg-primary border-primary shadow-2xl shadow-primary/20 scale-[1.02] z-10' : 'bg-white border-slate-100 hover:border-primary/40 hover:scale-[1.01]'}`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isActive ? 'bg-white text-primary shadow-lg' : bp.color + ' text-white'}`}>
                          {bp.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-black text-base tracking-tight mb-2 ${isActive ? 'text-white' : 'text-slate-900'}`}>{bp.name}</h4>
                          <p className={`text-[10px] font-bold leading-relaxed mb-4 ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{bp.description}</p>

                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-black/5 mt-auto">
                            {Object.entries(bp.blueprint).filter(([key]) => ['layoutMode', 'fontFamily', 'buttonStyle'].includes(key)).map(([key, val]) => (
                              <span key={key} className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${isActive ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                {val}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check size={12} className="text-primary" strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW: PRESETS GALLERY */}
            {activeTab === 'presets' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                {/* Gallery Header & Stats */}
                <div className="flex items-center justify-between px-1">
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-slate-900">Theme Library</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select a base to start from</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase tracking-widest text-slate-500 rounded-md border border-slate-200/60">
                      {THEME_PRESETS.length} Versions
                    </span>
                  </div>
                </div>

                {/* Scrollable Container */}
                <div className="relative group/gallery bg-slate-50/30 rounded-[2.5rem] border border-slate-100 p-2">
                  <div
                    className="grid gap-6 p-4 overflow-y-auto max-h-[640px] custom-scrollbar-premium pr-6"
                    style={{
                      scrollbarGutter: 'stable'
                    }}
                  >
                    <div className={`grid gap-6 ${isPreviewVisible && viewMode !== 'desktop' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                      {THEME_PRESETS.map((preset) => {
                        const isActive =
                          theme.primaryColor === preset.theme.primaryColor &&
                          theme.backgroundColor === preset.theme.backgroundColor;

                        return (
                          <button
                            key={preset.id}
                            onClick={() => applyPreset(preset.theme)}
                            className={`relative group/card text-left rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${isActive
                              ? 'border-primary ring-4 ring-primary/5 shadow-2xl shadow-primary/20 scale-[1.02] z-10'
                              : 'border-slate-100 hover:border-primary/40 bg-white shadow-sm hover:shadow-2xl hover:scale-[1.01]'
                              }`}
                            style={{ fontFamily: preset.theme.fontFamily }}
                          >
                            {/* Visual Preview Header */}
                            <div
                              className="h-32 w-full relative overflow-hidden transition-all duration-500 group-hover/card:saturate-150"
                              style={{ backgroundColor: preset.theme.backgroundColor }}
                            >
                              {/* Abstract Background Element */}
                              <div
                                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-3xl transition-transform duration-700 group-hover/card:scale-125"
                                style={{ backgroundColor: preset.theme.primaryColor }}
                              />

                              {/* Dummy Widget Content */}
                              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                <div className="space-y-2">
                                  <div className="h-1 w-8 rounded-full opacity-30 bg-current" style={{ color: preset.theme.textColor }} />
                                  <div className="space-y-1">
                                    <div className="h-3 w-4/5 rounded-lg bg-current opacity-10" style={{ color: preset.theme.textColor }} />
                                    <div className="h-2 w-1/2 rounded-lg bg-current opacity-5" style={{ color: preset.theme.textColor }} />
                                  </div>
                                </div>

                                <div
                                  className="h-8 w-full rounded-lg flex items-center justify-center text-[8px] font-black uppercase tracking-[0.2em] shadow-lg transition-transform duration-300 group-hover/card:translate-y-[-2px]"
                                  style={{
                                    backgroundColor: preset.theme.primaryColor,
                                    color: '#fff',
                                    borderRadius: preset.theme.borderRadius === 'pill' ? '99px' : '8px',
                                    fontFamily: preset.theme.fontFamily
                                  }}
                                >
                                  Use Preset
                                </div>
                              </div>
                            </div>

                            {/* Card Info */}
                            <div className="p-4 bg-white relative">
                              <div className="flex justify-between items-center gap-3">
                                <div className="flex-1 truncate">
                                  <h3 className="font-black text-[13px] tracking-tight text-slate-900 group-hover/card:text-primary transition-colors">{preset.name}</h3>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-0.5 truncate">{preset.description}</p>
                                </div>
                                {isActive ? (
                                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 animate-in zoom-in-50 duration-300">
                                    <Check size={12} className="text-white" strokeWidth={4} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border border-slate-100 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decorative Scroll Hints */}
                  <div className="absolute top-2 left-6 right-8 h-8 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none rounded-t-[2rem] opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-6 right-8 h-12 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none rounded-b-[2rem] opacity-0 group-hover/gallery:opacity-100 transition-opacity" />
                </div>
              </div>
            )}

            {/* VIEW: FINE TUNING */}
            {/* VIEW: FINE TUNING */}
            {activeTab === 'fine-tune' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className={`grid gap-6 ${isPreviewVisible && viewMode !== 'desktop' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
                  {/* COLORS CARD */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 space-y-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                      <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary shadow-inner"><Palette size={20} /></div>
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900">Brand Identity</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Color Palette</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <ColorPicker label="Primary Color" description="Buttons & progress" value={theme.primaryColor} onChange={(c) => setTheme({ ...theme, primaryColor: c })} />
                      <ColorPicker label="Background" description="Canvas color" value={theme.backgroundColor} onChange={(c) => setTheme({ ...theme, backgroundColor: c })} />
                      <ColorPicker label="Text Contrast" description="Readability" value={theme.textColor} onChange={(c) => setTheme({ ...theme, textColor: c })} />
                      <ColorPicker label="Option Bg" description="Secondary elements" value={theme.secondaryColor} onChange={(c) => setTheme({ ...theme, secondaryColor: c })} />
                    </div>
                  </div>

                  {/* STYLE & GEOMETRY CARD */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 space-y-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                      <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500 shadow-inner"><Type size={20} /></div>
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900">Visual Style</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Font & Geometry</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Typography</label>
                          <select
                            value={theme.fontFamily}
                            onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
                            className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm transition-all hover:bg-white focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 cursor-pointer shadow-sm"
                          >
                            {googleFonts.map((font) => <option key={font} value={font}>{font}</option>)}
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Roundness</label>
                          <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                            {['sharp', 'rounded', 'pill'].map((opt) => (
                              <button key={opt} onClick={() => setTheme({ ...theme, borderRadius: opt })}
                                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme.borderRadius === opt ? 'bg-white text-primary shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                                  }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Interaction Model</label>
                        <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner max-w-md">
                          {['solid', 'outline', 'ghost'].map((opt) => (
                            <button key={opt} onClick={() => setTheme({ ...theme, buttonStyle: opt })}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme.buttonStyle === opt ? 'bg-white text-primary shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`grid gap-6 ${isPreviewVisible && viewMode !== 'desktop' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
                  {/* MOTION & ANIMATION CARD */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 space-y-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                      <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner"><Zap size={20} /></div>
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900">Motion & Feel</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interaction & Transitions</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Transition Style</label>
                        <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                          {[
                            { id: 'spring', icon: <Waves size={12} /> },
                            { id: 'smooth', icon: <Activity size={12} /> },
                            { id: 'bounce', icon: <Gauge size={12} /> }
                          ].map((opt) => (
                            <button key={opt.id} onClick={() => setTheme({ ...theme, animationStyle: opt.id })}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${theme.animationStyle === opt.id ? 'bg-white text-primary shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt.icon}
                              <span className="hidden sm:inline">{opt.id}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Progress Bar</label>
                        <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                          {['bar', 'percentage', 'minimal'].map((opt) => (
                            <button key={opt} onClick={() => setTheme({ ...theme, progressStyle: opt })}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${theme.progressStyle === opt ? 'bg-white text-primary shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LAYOUT & PLACEMENT CARD */}
                  <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 space-y-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-5">
                      <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner"><Sliders size={20} /></div>
                      <div>
                        <h3 className="text-base font-black tracking-tight text-slate-900">Placement</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Layout & Position</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Experience Layout (The internal quiz design) */}
                      <div className="space-y-3 pb-6 border-b border-slate-50">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Experience Layout</label>
                        <div className="grid grid-cols-3 gap-3">
                          {LAYOUT_PRESETS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setTheme({ ...theme, layoutMode: opt.id })}
                              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme.layoutMode === opt.id || (!theme.layoutMode && opt.id === 'classic')
                                ? 'border-primary bg-primary/5 text-primary shadow-md'
                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'
                                }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.layoutMode === opt.id ? 'bg-primary text-white' : 'bg-slate-50'}`}>
                                {opt.icon}
                              </div>
                              <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-wider">{opt.name}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 ml-1 italic">Controls the internal design and flow of the quiz components.</p>
                      </div>

                      {/* Display Mode (How it appears on page) */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Widget Display Mode</label>
                        <div className="flex gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                          {[
                            { id: 'modal', label: 'Modal' },
                            { id: 'fullscreen', label: 'Full Screen' },
                            { id: 'inline', label: 'Inline' }
                          ].map((opt) => (
                            <button key={opt.id} onClick={() => setSettings({ ...settings, defaultLayout: opt.id })}
                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.defaultLayout === opt.id ? 'bg-white text-primary shadow-md ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Position - only for modal */}
                      {settings.defaultLayout === 'modal' && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Widget Position</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'center', label: 'Screen Center' },
                              { id: 'bottom-right', label: 'Floating Bubble' },
                              { id: 'sidebar-left', label: 'Left Sidebar' },
                              { id: 'sidebar-right', label: 'Right Sidebar' }
                            ].map((opt) => (
                              <button key={opt.id} onClick={() => setSettings({ ...settings, position: opt.id })}
                                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${settings.position === opt.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-400 hover:border-primary/30'}`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sizing Controls */}
                      <div className="space-y-6 pt-2 border-t border-slate-50">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Max Width</label>
                            <span className="text-[10px] font-black text-primary">{settings.maxWidth}px</span>
                          </div>
                          <input
                            type="range" min="400" max="1400" step="50"
                            value={settings.maxWidth}
                            onChange={(e) => setSettings({ ...settings, maxWidth: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Max Height</label>
                            <span className="text-[10px] font-black text-primary">{settings.maxHeight}vh</span>
                          </div>
                          <input
                            type="range" min="50" max="100" step="5"
                            value={settings.maxHeight}
                            onChange={(e) => setSettings({ ...settings, maxHeight: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADVANCED SETTINGS CARD */}
                <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 lg:p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-pink-50 rounded-[1.25rem] flex items-center justify-center text-pink-500 shadow-inner border border-pink-100/30"><Layers size={22} /></div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-slate-900">White-label Branding</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Remove "Powered by" branding</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner min-w-[200px] justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Remove Watermark</span>
                    <button
                      onClick={() => setBranding({ ...branding, removeWatermark: !branding.removeWatermark })}
                      className={`w-12 h-7 rounded-full transition-all relative ${branding.removeWatermark ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200 hover:bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${branding.removeWatermark ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Preview (Sticky) */}
        {isPreviewVisible && (
          <LiveWidgetPreview
            theme={theme}
            settings={settings}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onClose={() => setIsPreviewVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ThemeCustomizer;
