import React, { useState } from 'react';
import {
    Smartphone, Tablet, Monitor, RotateCcw, X,
    LayoutGrid, Sparkles, ChevronRight, Mail, Tag, Link
} from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, questions, outcomes, settings }) => {
    if (!isOpen) return null;
    const [step, setStep] = useState(0);
    const [device, setDevice] = useState('mobile');
    const [answers, setAnswers] = useState({});
    const [view, setView] = useState('quiz');
    const currentQ = questions[step];

    const handleSelect = (qId, option) => {
        setAnswers(prev => ({ ...prev, [qId]: option }));
        if (step < questions.length - 1) { setStep(step + 1); }
        else { settings?.collectEmail ? setView('email') : setView('results'); }
    };

    const getResults = () => {
        const scores = {};
        outcomes.forEach(o => scores[o.id || o._id] = 0);
        const allSelectedTags = [];
        Object.values(answers).forEach(opt => {
            if (opt.weights && opt.weights.length > 0) {
                opt.weights.forEach(w => { if (w.outcomeId) { scores[w.outcomeId] = (scores[w.outcomeId] || 0) + (w.points || 1); } });
            }
            if (opt.tags && opt.tags.length > 0) { allSelectedTags.push(...opt.tags); }
        });
        const qualifiedOutcomeIds = outcomes
            .filter(o => {
                const requiredTags = o.matchingRules?.requiredTags || [];
                if (requiredTags.length > 0) { return requiredTags.every(tag => allSelectedTags.includes(tag)); }
                return true;
            })
            .map(o => {
                const oId = o.id || o._id;
                const outcomeTags = o.tags || [];
                const matchedTagsCount = outcomeTags.filter(tag => allSelectedTags.includes(tag)).length;
                const totalScore = (scores[oId] || 0) + matchedTagsCount;

                // Min Score Threshold Check
                if (totalScore < (o.minScore || 0)) return null;

                scores[oId] = totalScore;
                return oId;
            })
            .filter(id => id !== null);

        let winnerId = null;
        if (qualifiedOutcomeIds.length > 0) {
            winnerId = qualifiedOutcomeIds.reduce((a, b) => {
                if (scores[a] > scores[b]) return a;
                if (scores[b] > scores[a]) return b;
                const objA = outcomes.find(o => (o.id || o._id) === a);
                const objB = outcomes.find(o => (o.id || o._id) === b);
                if ((objA?.priority || 0) > (objB?.priority || 0)) return a;
                if ((objB?.priority || 0) > (objA?.priority || 0)) return b;
                return a;
            }, qualifiedOutcomeIds[0]);
        }
        const winner = outcomes.find(o => (o.id || o._id) === winnerId) || outcomes[0];
        const allProducts = [];
        const seenProductTitles = new Set();
        if (winner && winner.recommendedProducts) {
            winner.recommendedProducts.forEach(p => { if (!seenProductTitles.has(p.title)) { allProducts.push(p); seenProductTitles.add(p.title); } });
        }
        const touchedOutcomeIds = Object.keys(scores).filter(id => scores[id] > 0 && id !== winnerId);
        touchedOutcomeIds.forEach(id => {
            const outcome = outcomes.find(o => (o.id || o._id) === id);
            if (outcome && outcome.recommendedProducts) {
                outcome.recommendedProducts.forEach(p => { if (!seenProductTitles.has(p.title)) { allProducts.push(p); seenProductTitles.add(p.title); } });
            }
        });
        return { winner, products: allProducts };
    };

    const { winner, products: associatedProducts } = getResults();
    const deviceStyles = {
        mobile: "w-[360px] h-[740px] rounded-[3rem] border-[10px]",
        tablet: "w-[720px] h-[880px] rounded-[2.5rem] border-[12px]",
        desktop: "w-[95%] h-[82vh] rounded-[20px] border-[4px]"
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-3xl p-4 md:p-10 animate-reveal overflow-hidden">
            <div className="absolute top-8 w-full flex items-center justify-between px-12 z-[110]">
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xl">
                    {['mobile', 'tablet', 'desktop'].map(d => (
                        <button key={d} onClick={() => setDevice(d)} className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 uppercase text-[9px] font-bold tracking-widest ${device === d ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
                            {d === 'mobile' ? <Smartphone size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Monitor size={14} />}
                            {device === d && d}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { setStep(0); setView('quiz'); setAnswers({}); }} title="Reset Preview" className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/40 transition-all shadow-md active:scale-95"><RotateCcw size={18} /></button>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 rounded-xl text-slate-400 transition-all shadow-md active:scale-95"><X size={20} /></button>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center w-full mt-12">
                <div className={`relative bg-foreground border-slate-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${deviceStyles[device]} scale-[0.5] sm:scale-[0.65] md:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-center`}>
                    {device === 'mobile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-foreground rounded-b-[2rem] z-20 flex items-center justify-center"><div className="w-12 h-1.5 rounded-full bg-slate-800/50" /></div>}
                    <div className={`flex-1 bg-white flex flex-col h-full overflow-y-auto`}>
                        {questions.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6"><div className="w-24 h-24 bg-muted rounded-[32px] flex items-center justify-center text-muted-foreground/20"><LayoutGrid size={48} /></div><p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">No Content Defined</p></div>
                        ) : view === 'quiz' ? (
                            <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-10 pt-24">
                                <div className="h-1 w-full bg-slate-100 rounded-full mb-10 overflow-hidden shadow-inner"><div className="h-full bg-primary rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.3)]" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
                                <div className="space-y-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-500"><span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={12} /> Step {step + 1} of {questions.length}</span><h2 className="text-3xl font-bold text-slate-900 leading-[1.2] tracking-tight">{currentQ?.text || "Question Title"}</h2></div>
                                <div className="space-y-3 flex-1">
                                    {currentQ?.type === 'multiple_choice' ? currentQ.options?.map((o, i) => (
                                        <button key={o.id} onClick={() => handleSelect(currentQ.id || currentQ._id, o)} className="w-full p-4 border border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02] rounded-2xl text-left font-bold text-slate-800 transition-all duration-200 flex items-center group relative overflow-hidden active:scale-[0.98] shadow-sm hover:shadow-md"><div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 font-bold text-[11px] border border-slate-100 group-hover:border-primary shadow-sm">{String.fromCharCode(65 + i)}</div><span className="flex-1 text-[14px] font-bold tracking-tight">{o.text}</span></button>
                                    )) : (
                                        <div className="space-y-4"><textarea placeholder="Type your answer here..." className="w-full p-8 bg-slate-50 rounded-[32px] border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-slate-800 h-40 transition-all text-lg placeholder:text-slate-300 shadow-inner" /><button onClick={() => step < questions.length - 1 ? setStep(step + 1) : setView('results')} className="btn-premium w-full h-16 rounded-[24px]">Continue</button></div>
                                    )}
                                </div>
                                <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-50"><button onClick={() => setStep(step - 1)} disabled={step === 0} className={`text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all flex items-center gap-2 ${step === 0 && 'opacity-0 pointer-events-none'}`}><div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center rotate-180"><ChevronRight size={14} /></div> Back</button></div>
                            </div>
                        ) : view === 'email' ? (
                            <div className="flex-1 flex flex-col max-w-sm mx-auto w-full p-10 pt-32 animate-reveal"><div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 animate-bounce"><Mail size={32} /></div><h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter mb-4 uppercase">One last thing...</h2><p className="text-slate-500 font-medium text-sm mb-10 italic">Where should we send your personalized recommendations?</p><div className="space-y-4"><input type="email" placeholder="john@example.com" className="w-full h-16 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] px-8 font-bold text-slate-800 outline-none transition-all placeholder:text-slate-300" /><button onClick={() => setView('results')} className="btn-premium w-full h-16 rounded-[24px] shadow-2xl shadow-primary/20">Show My Results</button></div></div>
                        ) : (
                            <div className="flex-1 flex flex-col h-full bg-slate-50 animate-reveal">
                                <div className="flex-1 overflow-y-auto px-10 pt-24 pb-32">
                                    <div className="max-w-md mx-auto space-y-8">
                                        <div className="text-center space-y-3">
                                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 animate-in zoom-in duration-500"><Sparkles size={28} /></div>
                                            <h2 className="text-3xl font-bold text-slate-900 leading-none tracking-tight">{winner?.title}</h2>
                                            <p className="text-slate-500 font-medium italic text-sm leading-relaxed px-4">{winner?.description}</p>

                                            {winner?.discountCode && (
                                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-700">
                                                    <Tag size={12} className="text-primary" />
                                                    <span className="text-[11px] font-black text-primary tracking-widest uppercase">CODE: {winner.discountCode}</span>
                                                </div>
                                            )}
                                        </div>

                                        {associatedProducts?.length > 0 && (
                                            <div className="space-y-4 pt-4">
                                                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ml-1">Top Recommendations</h3>
                                                <div className="space-y-3">
                                                    {associatedProducts.map((prod, idx) => (
                                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0 shadow-inner">
                                                                    {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <Link size={16} className="text-slate-200" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-slate-900 truncate tracking-tight text-sm">{prod.title}</h4>
                                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-0.5">{prod.price}</p>
                                                                </div>
                                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                                                                    <ChevronRight size={14} />
                                                                </div>
                                                            </div>
                                                            {prod.reason && (
                                                                <div className="px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-100 text-[10px] text-slate-500 italic font-medium leading-relaxed">
                                                                    <span className="text-primary/60 font-bold not-italic mr-1">Why this?</span> {prod.reason}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-6"><button className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">{winner?.buttonText || "Get it now"}</button></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
