import React, { useState, useEffect } from 'react';
import { Building2, Wifi, Shield, Zap, Sparkles } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, className, delay }) => (
  <div 
    className={`absolute ${className}`}
    style={{
      animation: `float 6s ease-in-out infinite`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white/60" />
    </div>
  </div>
);

export default function MyHostSplash() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 relative overflow-hidden flex flex-col items-center justify-center px-6">
      
      {/* Animated background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-yellow-400/25 rounded-full blur-3xl"
          style={{ animation: 'pulse 8s ease-in-out infinite' }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-300/20 rounded-full blur-3xl"
          style={{ animation: 'pulse 10s ease-in-out infinite reverse' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400/15 rounded-full blur-3xl"
          style={{ animation: 'breathe 6s ease-in-out infinite' }}
        />
        
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(255,200,100,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 60%, rgba(255,255,255,0.05) 0%, transparent 40%)
            `
          }}
        />
      </div>

      {/* Floating feature icons */}
      <FloatingIcon icon={Wifi} className="top-[15%] left-[10%]" delay={0} />
      <FloatingIcon icon={Shield} className="top-[20%] right-[12%]" delay={1.5} />
      <FloatingIcon icon={Zap} className="bottom-[25%] left-[8%]" delay={3} />
      <FloatingIcon icon={Sparkles} className="bottom-[20%] right-[10%]" delay={2} />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md">
        
        {/* Logo container - ORIGINAL Building2 icon */}
        <div 
          className={`
            relative mx-auto mb-4 transition-all duration-1000
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
          `}
        >
          {/* Outer glow ring */}
          <div 
            className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-amber-400/30 to-orange-300/30 blur-2xl"
            style={{ animation: 'breathe 4s ease-in-out infinite' }}
          />
          
          {/* Pulsing ring */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-white/20"
            style={{ animation: 'ringPulse 3s ease-in-out infinite' }}
          />
          
          {/* White circle with ORANGE Building2 icon */}
          <div className="relative w-32 h-32 mx-auto rounded-full bg-white shadow-2xl shadow-orange-900/30 flex items-center justify-center">
            <Building2 
              className="w-16 h-16 text-orange-500" 
              strokeWidth={1.5}
            />
          </div>
          
          {/* Orbiting dot */}
          <div 
            className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-amber-500/50"
            style={{
              top: '50%',
              left: '50%',
              animation: 'orbit 8s linear infinite',
              transformOrigin: '0 0'
            }}
          />
        </div>

        {/* Brand text - MOVED UP with more margin below */}
        <div 
          className={`
            mb-20 transition-all duration-1000 delay-200
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <h1 className="text-5xl font-black text-white tracking-tight mb-1 drop-shadow-lg">
            MY HOST
          </h1>
          <p className="text-4xl font-black text-white/90 tracking-tight drop-shadow-lg">
            BizMate
          </p>
        </div>

        {/* Tagline */}
        <div 
          className={`
            mb-10 transition-all duration-1000 delay-400
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <p className="text-lg font-medium text-white/90 mb-1">
            Smart Management for Modern Hospitality
          </p>
          <p className="text-lg font-medium text-white/90">
            Powered by Artificial Intelligence
          </p>
        </div>

        {/* CTA Button */}
        <div 
          className={`
            transition-all duration-1000 delay-600
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              relative group px-10 py-4 rounded-full
              bg-gradient-to-r from-orange-700 via-orange-800 to-amber-900
              font-semibold text-white
              shadow-xl shadow-orange-950/40
              border border-orange-600/50
              transition-all duration-300 ease-out
              ${isHovered ? 'scale-105 shadow-2xl shadow-orange-950/50' : ''}
            `}
          >
            <div 
              className={`
                absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent
                transition-opacity duration-300
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
            />
            
            <span className="relative flex items-center gap-3">
              Enter Dashboard
              <span 
                className={`
                  transition-transform duration-300
                  ${isHovered ? 'translate-x-1' : ''}
                `}
              >
                →
              </span>
            </span>
          </button>
        </div>

        {/* Version badge */}
        <div 
          className={`
            mt-12 transition-all duration-1000 delay-700
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            v2.0 · All systems operational
          </span>
        </div>

      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg 
          viewBox="0 0 1440 120" 
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" 
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes ringPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}
