import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 4 + 3,
}));

const LoadingScreen = ({ message = "Initializing Platform..." }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [isFirstLoad] = useState(() => {
    const hasShown = sessionStorage.getItem('quizora_splash_shown');
    if (!hasShown) {
      sessionStorage.setItem('quizora_splash_shown', 'true');
      return true;
    }
    return false;
  });

  const steps = [
    "Establishing Secure Connection...",
    "Loading Intelligence Core...",
    "Syncing Quiz Engine...",
    "Preparing Your Dashboard...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 4 + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const clampedProgress = Math.min(progress, 100);

  // --- QUIET LOADING MODE (Subsequent entries) ---
  // Return null to show site "directly" as requested by user
  if (!isFirstLoad) {
    return null;
  }

  // --- FULL PREMIUM ANIMATION (First load of session) ---
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={{ background: '#050507' }}>

      {/* animated gradient orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)',
        animation: 'floatOrb 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', top: '55%', right: '10%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)',
        animation: 'floatOrb 10s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '35%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(70px)',
        animation: 'floatOrb 12s ease-in-out infinite 2s'
      }} />

      {/* floating particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.6)',
          boxShadow: '0 0 6px rgba(99,102,241,0.8)',
          animation: `particleFloat ${p.duration}s ease-in-out infinite ${p.delay}s`,
          opacity: 0,
        }} />
      ))}

      {/* grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>

        {/* logo container */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          {/* outer glow rings */}
          <div style={{
            position: 'absolute',
            inset: -30,
            borderRadius: '50%',
            border: '1px solid rgba(99,102,241,0.08)',
            animation: 'ringPulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: -18,
            borderRadius: '44px',
            border: '1px solid rgba(99,102,241,0.15)',
            animation: 'ringPulse 3s ease-in-out infinite 0.5s',
          }} />
          <div style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '38px',
            border: '1px solid rgba(99,102,241,0.25)',
            animation: 'ringPulse 3s ease-in-out infinite 1s',
          }} />

          {/* spinning orbit */}
          <div style={{
            position: 'absolute',
            inset: -20,
            borderRadius: '46px',
            border: '1.5px solid transparent',
            borderTopColor: 'rgba(99,102,241,0.5)',
            borderRightColor: 'rgba(139,92,246,0.3)',
            animation: 'spin 2.5s linear infinite',
          }} />

          {/* icon box */}
          <div style={{
            width: 88, height: 88,
            borderRadius: 28,
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #3b82f6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
            position: 'relative', zIndex: 10,
            animation: 'logoPulse 3s ease-in-out infinite',
          }}>
            <Sparkles size={38} color="white" />
          </div>
        </div>

        {/* brand name */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 900, letterSpacing: '0.25em',
            color: 'white', margin: 0, marginBottom: 6,
            textTransform: 'uppercase',
            textShadow: '0 0 30px rgba(99,102,241,0.5)',
          }}>
            QUIZORA
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ height: 1, width: 30, background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.6))' }} />
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.35em',
              color: 'rgba(99,102,241,0.8)', margin: 0, textTransform: 'uppercase'
            }}>
              Intelligence Platform
            </p>
            <div style={{ height: 1, width: 30, background: 'linear-gradient(to left, transparent, rgba(99,102,241,0.6))' }} />
          </div>
        </div>

        {/* progress section */}
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* progress bar */}
          <div style={{
            height: 4, borderRadius: 99,
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              height: '100%',
              width: `${clampedProgress}%`,
              borderRadius: 99,
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #3b82f6)',
              boxShadow: '0 0 12px rgba(99,102,241,0.7)',
              transition: 'width 0.08s linear',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                width: 8, height: 8, borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 8px rgba(99,102,241,1)',
              }} />
            </div>
          </div>

          {/* step message */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
          }}>
            {/* animated dots */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.9)',
                  animation: `dotBounce 1.2s ease-in-out infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
            <p style={{
              fontSize: 10, fontWeight: 700, margin: 0,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {steps[step]}
            </p>
            <p style={{
              fontSize: 10, fontWeight: 800, margin: 0, marginLeft: 'auto', flexShrink: 0,
              color: 'rgba(99,102,241,0.8)',
              letterSpacing: '0.05em',
            }}>
              {Math.round(clampedProgress)}%
            </p>
          </div>
        </div>
      </div>

      {/* bottom branding */}
      <div style={{
        position: 'absolute', bottom: 28, left: 0, right: 0, textAlign: 'center',
      }}>
        <p style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.4em',
          color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', margin: 0,
        }}>
          Enterprise Edition • v2.4.0
        </p>
      </div>

      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(0px); }
          50% { opacity: 0.7; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.25); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
