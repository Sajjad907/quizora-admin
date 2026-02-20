import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Check } from 'lucide-react';

const ColorPicker = ({ label, value, onChange, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value || '#6366f1');
  const pickerRef = useRef(null);

  useEffect(() => {
    setTempColor(value || '#6366f1');
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setTempColor(newColor);
    onChange(newColor);
  };

  const presetColors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Green
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#0a0a0b', // Black
    '#ffffff', // White
    '#1e293b', // Slate
    '#475569', // Gray
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">
          {label}
        </label>
        {description && (
          <span className="text-[9px] text-muted-foreground/50 italic">{description}</span>
        )}
      </div>

      <div className="relative" ref={pickerRef}>
        {/* Color Display Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-14 rounded-2xl border-2 border-border/50 hover:border-primary/30 transition-all flex items-center gap-4 px-4 bg-card/50 group"
        >
          {/* Color Preview */}
          <div 
            className="w-8 h-8 rounded-xl border-2 border-white shadow-lg group-hover:scale-110 transition-transform"
            style={{ backgroundColor: tempColor }}
          />
          
          {/* Hex Value */}
          <span className="flex-1 text-left font-mono text-sm font-bold text-foreground">
            {tempColor.toUpperCase()}
          </span>
          
          {/* Pipette Icon */}
          <Pipette size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Dropdown Picker */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-card border-2 border-border/50 rounded-3xl shadow-2xl z-50 space-y-6 animate-reveal">
            {/* Native Color Picker */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                Custom Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  value={tempColor}
                  onChange={handleColorChange}
                  className="w-full h-24 rounded-2xl cursor-pointer border-2 border-border/50"
                />
              </div>
            </div>

            {/* Hex Input */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                Hex Code
              </label>
              <input
                type="text"
                value={tempColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setTempColor(val);
                    if (val.length === 7) {
                      onChange(val);
                    }
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 font-mono text-sm font-bold text-foreground outline-none focus:border-primary/50 transition-all"
                placeholder="#6366f1"
              />
            </div>

            {/* Preset Colors */}
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                Quick Presets
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setTempColor(color);
                      onChange(color);
                    }}
                    className="relative w-full aspect-square rounded-xl border-2 border-white shadow-md hover:scale-110 transition-transform group/preset"
                    style={{ backgroundColor: color }}
                  >
                    {tempColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check size={16} className="text-white drop-shadow-lg" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              Apply Color
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
