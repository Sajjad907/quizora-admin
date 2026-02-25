import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const PremiumSelect = ({ value, options, onChange, placeholder = "Select option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const selectedOption = options.find(opt => (opt.id || opt._id) === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative w-full transition-all duration-300 ${isOpen ? 'z-[30]' : 'z-10'}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-11 px-4 flex items-center justify-between bg-white border rounded-xl transition-all duration-200 group shadow-sm active:scale-[0.98] ${isOpen ? 'border-primary ring-2 ring-primary/10 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
            >
                <span className={`text-[11px] font-bold tracking-tight truncate ${selectedOption ? "text-slate-900" : "text-slate-400 font-medium italic"}`}>
                    {selectedOption ? selectedOption.title : placeholder}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] z-[40] animate-in fade-in slide-in-from-top-2 duration-200 origin-top overflow-hidden ring-1 ring-black/5">
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5 bg-white">
                        <div className="px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.05em] text-slate-300 pointer-events-none">Results</div>
                        <button
                            onClick={() => { onChange(""); setIsOpen(false); }}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between ${!value ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 text-slate-400 font-medium italic'}`}
                        >
                            <span>{placeholder}</span>
                            {!value && <Check size={12} strokeWidth={3} />}
                        </button>
                        <div className="h-[1px] bg-slate-50 mx-2 my-1" />
                        {options.length === 0 ? (
                            <div className="p-6 text-center"><p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">No results available</p></div>
                        ) : options.map((opt) => (
                            <button
                                key={opt.id || opt._id}
                                onClick={() => { onChange(opt.id || opt._id); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between group/opt ${value === (opt.id || opt._id) ? 'bg-primary text-white shadow shadow-primary/20' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-950'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${value === (opt.id || opt._id) ? 'bg-white scale-110' : 'bg-slate-200 group-hover/opt:bg-primary/40'}`} />
                                    <span className="truncate max-w-[160px]">{opt.title}</span>
                                </div>
                                {value === (opt.id || opt._id) && <Check size={12} strokeWidth={3} className="animate-reveal" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumSelect;
