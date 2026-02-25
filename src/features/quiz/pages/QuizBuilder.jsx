import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus, Save, Eye, Type, Mail, List, CheckSquare,
  Trash2, ChevronRight, Loader2, X, Smartphone,
  LayoutGrid, Tablet, Monitor, RotateCcw, Sparkles, Settings2, Link, BarChart3,
  ChevronDown, Check, Tag
} from "lucide-react";
import { useQuiz } from "../hooks/useQuizQueries";
import { useUpdateQuiz } from "../hooks/useQuizMutations";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from 'react-hot-toast';
import ThemeCustomizer from '../components/ThemeCustomizer';
import AnalyticsDashboard from '../../analytics/components/AnalyticsDashboard';
import ConfirmModal from '../../../shared/components/ui/ConfirmModal';


import PremiumSelect from '../components/builder/PremiumSelect';
import ToolActionBtn from '../components/builder/ToolActionBtn';
import PreviewModal from '../components/builder/PreviewModal';
import TagInput from '../components/builder/TagInput';

const QuizBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quiz, isLoading } = useQuiz(id);
  const { mutate: saveQuiz, isPending: isSaving } = useUpdateQuiz();
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [settings, setSettings] = useState({ collectEmail: true });
  const [theme, setTheme] = useState({});
  const [branding, setBranding] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', id: null, title: '' }); // type: 'question' or 'outcome'

  const confirmDelete = () => {
    if (confirmModal.type === 'question') {
      setQuestions(questions.filter(q => (q.id || q._id) !== confirmModal.id));
      if (selectedId === confirmModal.id) setSelectedId(null);
    } else if (confirmModal.type === 'outcome') {
      setOutcomes(outcomes.filter(o => (o.id || o._id) !== confirmModal.id));
      if (selectedId === confirmModal.id) setSelectedId(null);
    }
    setConfirmModal({ isOpen: false, type: '', id: null, title: '' });
  };

  useEffect(() => {
    if (quiz) {
      setQuestions(quiz.questions || []);
      setOutcomes(quiz.outcomes || []);
      setSettings(quiz.settings || { collectEmail: true });
      setTheme(quiz.theme || {});
      setBranding(quiz.branding || {});
    }
  }, [quiz]);

  const handleSave = () => {
    saveQuiz({ id, data: { questions, outcomes, settings, theme, branding, status: 'published' } }, {
      onSuccess: () => toast.success('Quiz Updated!'),
      onError: (err) => toast.error(err.message)
    });
  };

  const addQuestion = (type) => {
    const newQ = { id: uuidv4(), type, text: "New Question", options: type === 'multiple_choice' ? [{ id: uuidv4(), text: "Option 1", tags: [], weights: [] }] : [] };
    setQuestions([...questions, newQ]);
    setSelectedId(newQ.id);
  };
  const removeQuestion = (qId) => { setQuestions(questions.filter(q => (q.id || q._id) !== qId)); if (selectedId === qId) setSelectedId(null); };
  const addOutcome = () => {
    const newO = { id: uuidv4(), title: "Result Title", description: "Explain why they got this result.", buttonText: "View Product", buttonUrl: "", tags: [], recommendedProducts: [], priority: 0 };
    setOutcomes([...outcomes, newO]);
    setSelectedId(newO.id);
  };
  const removeOutcome = (oId) => { setOutcomes(outcomes.filter(o => (o.id || o._id) !== oId)); if (selectedId === oId) setSelectedId(null); };

  const selectedQuestion = questions.find(q => (q.id || q._id) === selectedId);
  const selectedOutcome = outcomes.find(o => (o.id || o._id) === selectedId);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  const tabClass = (tab) => `px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? 'bg-white text-primary shadow-lg shadow-primary/5 border border-primary/20 scale-105' : 'text-slate-400 hover:text-slate-600'}`;

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Toaster position="top-right" />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} questions={questions} outcomes={outcomes} settings={settings} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: '', id: null, title: '' })}
        onConfirm={confirmDelete}
        title={`Delete ${confirmModal.type === 'question' ? 'Step' : 'Result'}?`}
        message={`Are you sure you want to permanently delete "${confirmModal.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete it"
        cancelText="Cancel"
        type="danger"
      />

      <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-50 shadow-sm">
        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/quizzes')} className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-2xl transition-all border border-border/50 text-muted-foreground group">
            <ChevronRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
            <button onClick={() => { setActiveTab('questions'); setSelectedId(null); }} className={tabClass('questions')}>Steps</button>
            <button onClick={() => { setActiveTab('outcomes'); setSelectedId(null); }} className={tabClass('outcomes')}>Results</button>
            <button onClick={() => { setActiveTab('settings'); setSelectedId(null); }} className={tabClass('settings')}>Settings</button>
            <button onClick={() => { setActiveTab('customize'); setSelectedId(null); }} className={tabClass('customize')}>Customize</button>
            <button onClick={() => { setActiveTab('analytics'); setSelectedId(null); }} className={`${tabClass('analytics')} flex items-center gap-2 px-4`}>
              <BarChart3 size={12} className={activeTab === 'analytics' ? 'text-primary' : 'opacity-50'} /> Analytics
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsPreviewOpen(true)} className="h-11 px-5 rounded-xl border border-slate-200 text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2.5 uppercase tracking-widest text-slate-600 shadow-sm active:scale-95 bg-white">
            <Eye size={16} className="text-primary" /> Live Preview
          </button>
          <button onClick={handleSave} disabled={isSaving} className="h-11 px-6 rounded-xl bg-primary text-white text-[10px] font-bold flex items-center gap-2.5 uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Publish Changes
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {activeTab !== 'customize' && activeTab !== 'analytics' && (
          <aside className="w-[320px] bg-white border-r border-slate-100 p-6 overflow-y-auto hidden lg:flex flex-col z-20 shadow-sm transition-all duration-500">
            <div className="mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2 mb-4 text-primary/40">Toolkit</h3>
              <div className="space-y-3">
                {activeTab === 'questions' ? (
                  <>
                    <ToolActionBtn label="Multiple Choice" icon={List} onClick={() => addQuestion('multiple_choice')} />
                    <ToolActionBtn label="Written Response" icon={Type} onClick={() => addQuestion('short_text')} />
                    <ToolActionBtn label="Checkbox Selection" icon={CheckSquare} onClick={() => addQuestion('checkboxes')} />
                  </>
                ) : activeTab === 'outcomes' ? (
                  <button onClick={addOutcome} className="w-full py-12 border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-[36px] flex flex-col items-center justify-center transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 bg-primary/5 rounded-[24px] flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-primary/30"><Plus size={32} /></div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary relative">New Outcome</span>
                  </button>
                ) : (
                  <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Mail size={20} /></div>
                      <div onClick={() => setSettings({ ...settings, collectEmail: !settings.collectEmail })} className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${settings.collectEmail ? 'bg-primary' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.collectEmail ? 'left-7' : 'left-1'}`} />
                      </div>
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-tight mb-2">Lead Capture</h4>
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Collect user emails before showing results to grow your marketing list.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        <main className={`flex-1 overflow-y-auto ${activeTab === 'analytics' ? 'bg-slate-50' : 'bg-background'} flex flex-col ${activeTab === 'analytics' ? '' : 'items-center'} scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent`}>
          {activeTab === 'customize' ? (
            <ThemeCustomizer
              quiz={{ ...quiz, theme, settings, branding }}
              onSave={(themeData) => {
                setTheme(themeData.theme);
                setSettings(themeData.settings || settings);
                setBranding(themeData.branding || branding);
                saveQuiz({ id, data: { ...themeData } }, {
                  onSuccess: () => toast.success('Theme Saved!'),
                  onError: (err) => toast.error(err.message)
                });
              }}
              onChange={(themeData) => {
                setTheme(themeData.theme);
                setSettings(themeData.settings || settings);
                setBranding(themeData.branding || branding);
              }}
              isSaving={isSaving}
            />
          ) : activeTab === 'analytics' ? (
            <div className="w-full p-6 lg:p-8 animate-reveal"><AnalyticsDashboard quizId={id} /></div>
          ) : (
            <div className="w-full max-w-3xl space-y-8 pb-40 pt-10 px-4">
              {activeTab === 'questions' ? (
                questions.length === 0 ? (
                  <div className="py-40 text-center border-4 border-dashed border-border/10 rounded-[64px] animate-reveal bg-card/10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-card rounded-[36px] flex items-center justify-center border border-border/50 text-muted-foreground/20 mb-10 shadow-xl"><LayoutGrid size={48} /></div>
                    <h2 className="text-3xl font-black mb-10 text-foreground/20 tracking-tight uppercase tracking-[0.2em]">Flow is Empty</h2>
                    <button onClick={() => addQuestion('multiple_choice')} className="btn-premium">Add First Question</button>
                  </div>
                ) : questions.map((q, idx) => (
                  <div key={q.id || q._id} onClick={() => setSelectedId(q.id || q._id)} className={`group p-7 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer transition-all border-2 relative overflow-hidden ${selectedId === (q.id || q._id) ? 'bg-white border-primary shadow-2xl shadow-primary/10 scale-[1.02] z-10' : 'bg-white/40 backdrop-blur-sm border-transparent hover:border-primary/20 hover:bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-5 mb-8">
                      <span className="text-[12px] font-bold bg-primary text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12">{idx + 1}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">{q.type.replace('_', ' ')}</span>
                      {selectedId === (q.id || q._id) && <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">{q.text}</h3>
                    {q.type === 'multiple_choice' && <div className="flex gap-2 mt-10">{q.options.map((_, i) => <div key={i} className="w-10 h-1.5 rounded-full bg-muted group-hover:bg-primary/20 transition-colors" />)}</div>}
                  </div>
                ))
              ) : (
                outcomes.length === 0 ? (
                  <div className="py-40 text-center border-4 border-dashed border-border/10 rounded-[64px] animate-reveal bg-card/10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-card rounded-[36px] flex items-center justify-center border border-border/50 text-primary/10 mb-10 shadow-xl"><Sparkles size={48} /></div>
                    <h2 className="text-3xl font-black mb-10 text-foreground/20 tracking-tight uppercase tracking-[0.2em]">No Outcomes</h2>
                    <button onClick={addOutcome} className="btn-premium">Create First Outcome</button>
                  </div>
                ) : outcomes.map((o, idx) => (
                  <div key={o.id || o._id} onClick={() => setSelectedId(o.id || o._id)} className={`group p-7 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer transition-all border-2 relative overflow-hidden ${selectedId === (o.id || o._id) ? 'bg-white border-primary shadow-2xl shadow-primary/10 scale-[1.02] z-10' : 'bg-white/40 backdrop-blur-sm border-transparent hover:border-primary/20 hover:bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-5 mb-8 text-primary">
                      <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/40">Result #{idx + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight mb-4">{o.title}</h3>
                    <p className="text-muted-foreground/60 text-[15px] line-clamp-2 italic leading-relaxed font-medium">{o.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </main>

        <aside className={`w-[420px] bg-white border-l border-slate-100 p-8 fixed inset-y-0 right-0 lg:relative z-40 transition-all duration-500 ease-out shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.05)] overflow-y-auto custom-scrollbar ${selectedId ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'}`}>
          {activeTab === 'questions' && selectedQuestion ? (
            <div className="space-y-10 animate-reveal">
              <div className="flex items-center justify-between border-b border-border/50 pb-8">
                <div><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Configuration</h3><span className="text-xl font-black text-foreground tracking-tight">Step Logic</span></div>
                <button onClick={() => setSelectedId(null)} className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-2xl transition-colors border border-border/50 text-muted-foreground"><X size={20} /></button>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] ml-1">Question Text</label>
                  <textarea value={selectedQuestion.text} onChange={(e) => setQuestions(questions.map(q => (q.id || q._id) === selectedId ? { ...q, text: e.target.value } : q))} className="w-full bg-slate-50/50 p-4 rounded-xl outline-none text-sm font-bold min-h-[100px] border border-slate-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 text-slate-900 shadow-sm transition-all" />
                </div>
                {selectedQuestion.type === 'multiple_choice' && (
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-[0.2em] ml-1">Answer Choices & Scoring</label>
                    <div className="space-y-4">
                      {selectedQuestion.options.map((o, io) => (
                        <div key={o.id} className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-slate-200 group/opt relative" style={{ zIndex: selectedQuestion.options.length - io }}>
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black shrink-0 border border-slate-200 text-slate-500">{io + 1}</div>
                            <input type="text" value={o.text} onChange={(e) => { const newQs = [...questions]; const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId); newQs[qIdx].options[io].text = e.target.value; setQuestions(newQs); }} className="flex-1 bg-transparent p-1 text-[13px] font-bold outline-none text-slate-800" />
                            <button onClick={() => { const newQs = [...questions]; const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId); newQs[qIdx].options.splice(io, 1); setQuestions(newQs); }} className="p-2 text-rose-500/30 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover/opt:opacity-100"><Trash2 size={16} /></button>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-border/20">
                            <div className="space-y-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-1">Affinity Tags (Matching)</span>
                              <TagInput
                                tags={o.tags || []}
                                onChange={(newTags) => {
                                  const newQs = [...questions];
                                  const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId);
                                  newQs[qIdx].options[io].tags = newTags;
                                  setQuestions(newQs);
                                }}
                                placeholder="e.g. oily-skin, budget"
                              />
                            </div>

                            <div className="space-y-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 ml-1">Precision Weights (Direct Points)</span>
                              <div className="space-y-2">
                                {(o.weights || []).map((w, iw) => (
                                  <div key={iw} className="flex items-center gap-2 animate-reveal relative" style={{ zIndex: o.weights.length - iw }}>
                                    <div className="flex-1">
                                      <PremiumSelect
                                        value={w.outcomeId}
                                        options={outcomes}
                                        onChange={(val) => {
                                          const newQs = [...questions];
                                          const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId);
                                          newQs[qIdx].options[io].weights[iw].outcomeId = val;
                                          setQuestions(newQs);
                                        }}
                                        placeholder="Select Result"
                                      />
                                    </div>
                                    <input
                                      type="number"
                                      value={w.points || 1}
                                      onChange={(e) => {
                                        const newQs = [...questions];
                                        const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId);
                                        newQs[qIdx].options[io].weights[iw].points = parseInt(e.target.value);
                                        setQuestions(newQs);
                                      }}
                                      className="w-16 h-11 bg-white border border-slate-200 rounded-xl text-center text-[11px] font-bold shadow-sm"
                                    />
                                    <button onClick={() => {
                                      const newQs = [...questions];
                                      const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId);
                                      newQs[qIdx].options[io].weights.splice(iw, 1);
                                      setQuestions(newQs);
                                    }} className="p-2 text-rose-500/40 hover:text-rose-500 transition-all"><X size={14} /></button>
                                  </div>
                                ))}
                                <button onClick={() => {
                                  const newQs = [...questions];
                                  const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId);
                                  if (!newQs[qIdx].options[io].weights) newQs[qIdx].options[io].weights = [];
                                  newQs[qIdx].options[io].weights.push({ outcomeId: '', points: 1 });
                                  setQuestions(newQs);
                                }} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline ml-1">+ Add Weight Override</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { const newQs = [...questions]; const qIdx = newQs.findIndex(q => (q.id || q._id) === selectedId); newQs[qIdx].options.push({ id: uuidv4(), text: 'New Choice', tags: [], weights: [] }); setQuestions(newQs); }} className="w-full h-12 border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black rounded-xl hover:bg-slate-50 hover:border-primary/40 hover:text-primary transition-all uppercase tracking-widest">+ Add Answer Choice</button>
                    </div>
                  </div>
                )}
                <div className="pt-10 border-t border-border/50">
                  <button onClick={() => setConfirmModal({ isOpen: true, type: 'question', id: selectedId, title: selectedQuestion.text })} className="w-full py-4 flex items-center justify-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 shadow-sm"><Trash2 size={14} /> Delete This Step</button>
                </div>
              </div>
            </div>
          ) : activeTab === 'outcomes' && selectedOutcome ? (
            <div className="space-y-10 animate-reveal">
              <div className="flex items-center justify-between border-b border-border/50 pb-8">
                <div><h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary mb-1">Configuration</h3><span className="text-lg font-bold text-slate-800 tracking-tight">Outcome Meta</span></div>
                <button onClick={() => setSelectedId(null)} className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-2xl transition-colors border border-border/50 text-muted-foreground"><X size={20} /></button>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em] ml-1">Outcome Headline</label>
                  <input type="text" value={selectedOutcome.title} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, title: e.target.value } : o))} className="w-full h-14 bg-slate-50/50 px-5 rounded-2xl outline-none text-lg font-bold border border-slate-200 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900 shadow-sm" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em] ml-1">Detail Description</label>
                  <textarea value={selectedOutcome.description} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, description: e.target.value } : o))} className="w-full bg-slate-50/50 p-5 rounded-2xl outline-none text-sm font-medium min-h-[120px] border border-slate-200 focus:border-primary/40 leading-relaxed text-slate-600 italic shadow-sm" />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em] ml-1 flex items-center justify-between">
                    Matching Tags
                    <span className="text-[9px] font-bold text-slate-300 lowercase italic normal-case">semantic matching active</span>
                  </label>
                  <TagInput
                    tags={selectedOutcome.tags || []}
                    onChange={(newTags) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, tags: newTags } : o))}
                    placeholder="e.g. oily-skin, deep-cleanse"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest ml-1">CTA Text</label>
                    <input type="text" value={selectedOutcome.buttonText || ""} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, buttonText: e.target.value } : o))} className="w-full h-11 bg-white px-4 rounded-xl text-[11px] font-bold border border-slate-200 text-slate-800 shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1">Redirect <Link size={10} className="text-primary" /></label>
                    <input type="text" placeholder="https://..." value={selectedOutcome.buttonUrl || ""} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, buttonUrl: e.target.value } : o))} className="w-full h-11 bg-white px-4 rounded-xl text-[11px] font-bold border border-slate-200 text-slate-700 shadow-sm" />
                  </div>
                </div>

                <div className="space-y-5 pt-8 border-t border-slate-100 italic">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em] ml-1 flex items-center justify-between">
                    Scoring Intelligence
                    <span className="text-[9px] font-bold text-primary/40 lowercase">Tie-breaker & Thresholds</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-bold uppercase text-slate-400 ml-1">Selection Priority</span>
                      <input type="number" placeholder="10" value={selectedOutcome.priority || 0} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, priority: parseInt(e.target.value) } : o))} className="w-full h-10 bg-slate-50 px-4 rounded-xl text-[11px] font-bold border border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-bold uppercase text-slate-400 ml-1">Min Match Score</span>
                      <input type="number" placeholder="0" value={selectedOutcome.minScore || 0} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, minScore: parseInt(e.target.value) } : o))} className="w-full h-10 bg-slate-50 px-4 rounded-xl text-[11px] font-bold border border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold uppercase text-slate-400 ml-1">Incentive / Coupon Code</span>
                    <div className="relative">
                      <Tag size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                      <input type="text" placeholder="e.g. WELCOME20" value={selectedOutcome.discountCode || ""} onChange={(e) => setOutcomes(outcomes.map(o => (o.id || o._id) === selectedId ? { ...o, discountCode: e.target.value } : o))} className="w-full h-11 bg-primary/[0.03] pl-10 pr-4 rounded-xl text-[11px] font-black border border-primary/10 text-primary placeholder:text-primary/20 uppercase tracking-widest" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-slate-100">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.1em] ml-1 flex items-center justify-between">Recommended Products<span className="text-[9px] font-bold text-slate-300 lowercase italic">Inventory Link</span></label>
                  <div className="space-y-4">
                    {(selectedOutcome.recommendedProducts || []).map((p, ip) => (
                      <div key={ip} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-300 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">{p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <Link size={14} className="opacity-10" />}</div>
                            <input type="text" placeholder="Product Name" value={p.title || ''} onChange={(e) => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); newO[oIdx].recommendedProducts[ip].title = e.target.value; setOutcomes(newO); }} className="bg-transparent text-[13px] font-bold outline-none border-none p-0 w-44 text-slate-800" />
                          </div>
                          <button onClick={() => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); newO[oIdx].recommendedProducts.splice(ip, 1); setOutcomes(newO); }} className="p-3 text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold uppercase text-slate-400 ml-1">Price</span>
                            <input type="text" placeholder="e.g. $49.00" value={p.price || ''} onChange={(e) => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); newO[oIdx].recommendedProducts[ip].price = e.target.value; setOutcomes(newO); }} className="w-full h-9 bg-slate-50 px-3 rounded-lg text-[10px] font-bold outline-none border border-slate-200 focus:border-primary/40 transition-all shadow-inner" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold uppercase text-slate-400 ml-1">Image Link</span>
                            <input type="text" placeholder="URL" value={p.imageUrl || ''} onChange={(e) => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); newO[oIdx].recommendedProducts[ip].imageUrl = e.target.value; setOutcomes(newO); }} className="w-full h-9 bg-slate-50 px-3 rounded-lg text-[10px] font-bold outline-none border border-slate-200 focus:border-primary/40 transition-all shadow-inner" />
                          </div>
                        </div>
                        <div className="space-y-1 text-primary">
                          <span className="text-[8px] font-bold uppercase text-primary/40 ml-1 flex items-center gap-1">Why recommend this? <Sparkles size={8} /></span>
                          <textarea placeholder="e.g. This matches your oily skin profile perfectly." value={p.reason || ''} onChange={(e) => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); newO[oIdx].recommendedProducts[ip].reason = e.target.value; setOutcomes(newO); }} className="w-full h-16 bg-primary/[0.02] p-3 rounded-xl text-[10px] font-medium italic border border-primary/5 focus:border-primary/20 outline-none text-slate-600 leading-normal" />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { const newO = [...outcomes]; const oIdx = newO.findIndex(o => (o.id || o._id) === selectedId); if (!newO[oIdx].recommendedProducts) newO[oIdx].recommendedProducts = []; newO[oIdx].recommendedProducts.push({ title: 'New Product', price: '$0.00', imageUrl: '', handle: '' }); setOutcomes(newO); }} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 text-[10px] font-black rounded-2xl hover:bg-slate-50 hover:border-primary/40 hover:text-primary transition-all uppercase tracking-widest shadow-sm">+ Add Recommendation</button>
                  </div>
                </div>

                <div className="pt-10 border-t border-border/50">
                  <button onClick={() => setConfirmModal({ isOpen: true, type: 'outcome', id: selectedId, title: selectedOutcome.title })} className="w-full py-4 flex items-center justify-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 shadow-sm"><Trash2 size={14} /> Delete This Result</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8 animate-reveal">
              <div className="w-32 h-32 rounded-[48px] bg-muted/40 flex items-center justify-center text-muted-foreground/10 border border-border/50 shadow-inner"><Settings2 size={64} /></div>
              <div className="space-y-3">
                <p className="font-black text-3xl tracking-tighter text-foreground/10 uppercase tracking-[0.1em]">Stage Select</p>
                <p className="text-sm font-bold text-muted-foreground/30 max-w-[220px] mx-auto italic">Pick a step from the timeline to refine its scoring logic and content metadata.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default QuizBuilder;
