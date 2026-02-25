import React from 'react';
import { Plus } from 'lucide-react';

const ToolActionBtn = ({ label, icon: Icon, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-primary/30 text-slate-700 transition-all duration-200 group shadow-sm active:scale-95">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 group-hover:bg-primary/10 mr-3 transition-colors text-primary"><Icon size={18} /></div>
        <span className="text-[12px] font-bold tracking-tight flex-1 text-left">{label}</span>
        <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </button>
);

export default ToolActionBtn;
