import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ tags = [], onChange, placeholder }) => {
    const [input, setInput] = useState('');
    const addTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            onChange([...tags, input.trim()]);
            setInput('');
        }
    };
    const removeTag = (tag) => onChange(tags.filter(t => t !== tag));
    return (
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/30 rounded-xl border border-border min-h-[40px] transition-all hover:bg-muted/50 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/5 focus-within:border-primary/40 shadow-sm">
            {tags.map(t => (
                <span key={t} className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-lg flex items-center gap-1.5 shrink-0 border border-primary/10 group animate-in fade-in zoom-in-95 duration-200">
                    {t}
                    <X size={10} className="cursor-pointer opacity-40 hover:opacity-100 transition-all" onClick={() => removeTag(t)} />
                </span>
            ))}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 bg-transparent border-none outline-none text-[11px] font-medium p-1 min-w-[100px] text-foreground placeholder:text-muted-foreground/30"
            />
        </div>
    );
};

export default TagInput;
