import React from 'react';
import {
    LayoutDashboard, PlusCircle, Settings, FileText, Users,
    Monitor, Layers, Zap, Sparkles, Diamond, Compass
} from 'lucide-react';

export const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Create Quiz", icon: PlusCircle, path: "/quiz/create" },
    { name: "Quizzes", icon: FileText, path: "/quizzes" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Settings", icon: Settings, path: "/settings" },
];

export const THEME_PRESETS = [
    {
        id: 'zenith-luxe',
        name: 'Zenith Healthcare',
        description: 'Ultra-modern deep teal & emerald',
        theme: {
            primaryColor: '#2ecc71',
            backgroundColor: '#1a323d',
            textColor: '#ffffff',
            secondaryColor: '#14252d',
            accentColor: '#10b981',
            fontFamily: 'Inter',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'smooth',
            progressStyle: 'bar',
            layoutMode: 'split-hero'
        }
    },
    {
        id: 'obsidian-noir',
        name: 'Obsidian Noir',
        description: 'Deep violet & glossy darks',
        theme: {
            primaryColor: '#8b5cf6',
            backgroundColor: '#020617',
            textColor: '#f8fafc',
            secondaryColor: '#1e293b',
            accentColor: '#c026d3',
            fontFamily: 'Inter',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            progressStyle: 'bar',
            layoutMode: 'classic'
        }
    },
    {
        id: 'emerald-luxury',
        name: 'Emerald Royale',
        description: 'Deep forest & gold accents',
        theme: {
            primaryColor: '#10b981',
            backgroundColor: '#064e3b',
            textColor: '#ecfdf5',
            secondaryColor: '#065f46',
            accentColor: '#fbbf24',
            fontFamily: 'Playfair Display',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'hard',
            animationStyle: 'smooth',
            progressStyle: 'minimal',
            layoutMode: 'classic',
        }
    },
    {
        id: 'midnight-pro',
        name: 'Midnight SaaS',
        description: 'Professional indigo workspace',
        theme: {
            primaryColor: '#6366f1',
            backgroundColor: '#0f172a',
            textColor: '#f1f5f9',
            secondaryColor: '#1e293b',
            accentColor: '#38bdf8',
            fontFamily: 'Inter',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            progressStyle: 'bar',
            layoutMode: 'classic',
        }
    },
    {
        id: 'sunset-mirage',
        name: 'Sunset Mirage',
        description: 'Vibrant amber & deep crimson',
        theme: {
            primaryColor: '#f59e0b',
            backgroundColor: '#450a0a',
            textColor: '#fef2f2',
            secondaryColor: '#7f1d1d',
            accentColor: '#f87171',
            fontFamily: 'Quicksand',
            borderRadius: 'pill',
            buttonStyle: 'solid',
            shadowIntensity: 'hard',
            animationStyle: 'bounce',
            progressStyle: 'percentage',
            layoutMode: 'classic',
        }
    },
    {
        id: 'frost-glass',
        name: 'Arctic Minimal',
        description: 'Pure white & glassmorphism',
        theme: {
            primaryColor: '#0f172a',
            backgroundColor: '#ffffff',
            textColor: '#1e293b',
            secondaryColor: '#f1f5f9',
            accentColor: '#3b82f6',
            fontFamily: 'Outfit',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'soft',
            animationStyle: 'smooth',
            progressStyle: 'bar',
            layoutMode: 'classic',
        }
    },
    {
        id: 'sakura-bloom',
        name: 'Sakura Petal',
        description: 'Soft rose & elegant white',
        theme: {
            primaryColor: '#ec4899',
            backgroundColor: '#fff1f2',
            textColor: '#881337',
            secondaryColor: '#ffe4e6',
            accentColor: '#f43f5e',
            fontFamily: 'Poppins',
            borderRadius: 'pill',
            buttonStyle: 'ghost',
            shadowIntensity: 'soft',
            animationStyle: 'smooth',
            progressStyle: 'minimal',
        }
    },
    {
        id: 'ocean-deep',
        name: 'Oceanic Pro',
        description: 'Azure blue & marine depth',
        theme: {
            primaryColor: '#0ea5e9',
            backgroundColor: '#0c4a6e',
            textColor: '#f0f9ff',
            secondaryColor: '#075985',
            accentColor: '#7dd3fc',
            fontFamily: 'Montserrat',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            progressStyle: 'bar',
        }
    },
    {
        id: 'toxic-night',
        name: 'Cyber Lime',
        description: 'Neon green & absolute black',
        theme: {
            primaryColor: '#84cc16',
            backgroundColor: '#000000',
            textColor: '#ffffff',
            secondaryColor: '#1a1a1a',
            accentColor: '#d9f99d',
            fontFamily: 'Roboto',
            borderRadius: 'sharp',
            buttonStyle: 'outline',
            shadowIntensity: 'hard',
            animationStyle: 'bounce',
            progressStyle: 'percentage',
        }
    },
    {
        id: 'royal-orchid',
        name: 'Royal Orchid',
        description: 'Regal purple & gold dust',
        theme: {
            primaryColor: '#a855f7',
            backgroundColor: '#2e1065',
            textColor: '#f5f3ff',
            secondaryColor: '#4c1d95',
            accentColor: '#fbbf24',
            fontFamily: 'Playfair Display',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'hard',
            animationStyle: 'smooth',
            progressStyle: 'bar',
        }
    },
    {
        id: 'slate-modern',
        name: 'Slate Minimal',
        description: 'Clean gray & workspace blue',
        theme: {
            primaryColor: '#3b82f6',
            backgroundColor: '#f8fafc',
            textColor: '#0f172a',
            secondaryColor: '#f1f5f9',
            accentColor: '#60a5fa',
            fontFamily: 'Inter',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'soft',
            animationStyle: 'smooth',
            progressStyle: 'bar',
        }
    },
    {
        id: 'lava-ember',
        name: 'Lava Ember',
        description: 'Fiery red & charcoal dark',
        theme: {
            primaryColor: '#ef4444',
            backgroundColor: '#111827',
            textColor: '#f9fafb',
            secondaryColor: '#1f2937',
            accentColor: '#f87171',
            fontFamily: 'Montserrat',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'hard',
            animationStyle: 'smooth',
            progressStyle: 'bar',
        }
    },
    {
        id: 'champagne-luxury',
        name: 'Champagne Pro',
        description: 'Luxury gold & stone ivory',
        theme: {
            primaryColor: '#d4af37',
            backgroundColor: '#fafaf9',
            textColor: '#1c1917',
            secondaryColor: '#f5f5f4',
            accentColor: '#a8a29e',
            fontFamily: 'Montserrat',
            borderRadius: 'sharp',
            buttonStyle: 'outline',
            shadowIntensity: 'soft',
            animationStyle: 'smooth',
            progressStyle: 'minimal',
        }
    },
    {
        id: 'corporate-blue',
        name: 'Enterprise Blue',
        description: 'Trustworthy & clean professional',
        theme: {
            primaryColor: '#2563eb',
            backgroundColor: '#ffffff',
            textColor: '#1e3a8a',
            secondaryColor: '#f8fafc',
            accentColor: '#60a5fa',
            fontFamily: 'Roboto',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            progressStyle: 'bar',
        }
    },
    {
        id: 'midnight-rose',
        name: 'Rose Copper',
        description: 'Elegant rose & dark clay',
        theme: {
            primaryColor: '#fb7185',
            backgroundColor: '#2d1a1a',
            textColor: '#fff1f2',
            secondaryColor: '#4c2a2a',
            accentColor: '#f43f5e',
            fontFamily: 'Outfit',
            borderRadius: 'rounded',
            buttonStyle: 'solid',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            progressStyle: 'bar',
        }
    },
    {
        id: 'nordic-sky',
        name: 'Nordic Sky',
        description: 'Boreal blue & clean gray',
        theme: {
            primaryColor: '#6366f1',
            backgroundColor: '#f1f5f9',
            textColor: '#334155',
            secondaryColor: '#e2e8f0',
            accentColor: '#818cf8',
            fontFamily: 'Quicksand',
            borderRadius: 'pill',
            buttonStyle: 'solid',
            shadowIntensity: 'soft',
            animationStyle: 'spring',
            progressStyle: 'minimal',
        }
    },
    {
        id: 'clean-minimalist',
        name: 'Clean Minimalist',
        description: 'Pure, focused & distraction-free',
        theme: {
            primaryColor: '#18181b', // zinc-900
            backgroundColor: '#ffffff',
            textColor: '#09090b',
            secondaryColor: '#f4f4f5',
            accentColor: '#52525b',
            fontFamily: 'Inter',
            borderRadius: 'rounded',
            buttonStyle: 'outline',
            shadowIntensity: 'none',
            animationStyle: 'smooth',
            progressStyle: 'minimal',
            layoutMode: 'minimalist',
        }
    }
];

export const BLUEPRINT_PRESETS = [
    {
        id: 'blueprint-standard',
        name: 'Modern Classic',
        description: 'The high-converting standard for e-commerce.',
        icon: <Monitor size={24} />,
        color: 'bg-indigo-500',
        blueprint: {
            layoutMode: 'classic',
            buttonStyle: 'solid',
            borderRadius: 'rounded',
            shadowIntensity: 'medium',
            animationStyle: 'spring',
            fontFamily: 'Inter',
            progressStyle: 'bar'
        }
    },
    {
        id: 'blueprint-luxury',
        name: 'Luxury Immersive',
        description: 'Premium editorial layout for high-end boutique brands.',
        icon: <Diamond size={24} />,
        color: 'bg-emerald-600',
        blueprint: {
            layoutMode: 'split-hero',
            buttonStyle: 'outline',
            borderRadius: 'sharp',
            shadowIntensity: 'soft',
            animationStyle: 'smooth',
            fontFamily: 'Playfair Display',
            progressStyle: 'minimal'
        }
    },
    {
        id: 'blueprint-glass',
        name: 'Glass Future',
        description: 'Modern translucent UI with glowing depth and motion.',
        icon: <Sparkles size={24} />,
        color: 'bg-violet-500',
        blueprint: {
            layoutMode: 'glass-morph',
            buttonStyle: 'solid',
            borderRadius: 'pill',
            shadowIntensity: 'hard',
            animationStyle: 'bounce',
            fontFamily: 'Outfit',
            progressStyle: 'percentage'
        }
    },
    {
        id: 'blueprint-minimal',
        name: 'Focus Minimal',
        description: 'Stripped back for maximum speed and zero friction.',
        icon: <Compass size={24} />,
        color: 'bg-slate-900',
        blueprint: {
            layoutMode: 'minimalist',
            buttonStyle: 'solid',
            borderRadius: 'rounded',
            shadowIntensity: 'none',
            animationStyle: 'smooth',
            fontFamily: 'Inter',
            progressStyle: 'none'
        }
    }
];

export const LAYOUT_PRESETS = [
    {
        id: 'classic',
        name: 'Standard Hero',
        description: 'Centered content with clean structure',
        icon: <Monitor size={20} />,
        theme: { layoutMode: 'classic' }
    },
    {
        id: 'split-hero',
        name: 'Split Experience',
        description: 'Immersive media-driven layout',
        icon: <Layers size={20} />,
        theme: { layoutMode: 'split-hero' }
    },
    {
        id: 'minimalist',
        name: 'Minimal Focus',
        description: 'Focus solely on interaction',
        icon: <Zap size={20} />,
        theme: { layoutMode: 'minimalist' }
    }
];
