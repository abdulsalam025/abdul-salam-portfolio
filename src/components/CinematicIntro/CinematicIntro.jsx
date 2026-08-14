import React, { useState, useEffect } from 'react';
import './CinematicIntro.css';

const CinematicIntro = () => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="vision-intro-overlay" aria-hidden="true">
      
      {/* 1. THE FALLING SPARK & RIPPLE */}
      <div className="liquid-spark"></div>
      <div className="liquid-ripple"></div>

      {/* 2. THE VIBRANT NEON FLUIDS */}
      <div className="vision-fluid-container">
        <div className="v-blob v-blob-peach"></div>
        <div className="v-blob v-blob-purple"></div>
        <div className="v-blob v-blob-cyan"></div>
      </div>

      {/* 3. MULTIPLE FLOATING BUBBLES WITH SPARKS */}
      <div className="glass-bubble bubble-1">
        <div className="v-highlight top-left"></div>
        <div className="b-sparkle s-1"></div>
      </div>
      <div className="glass-bubble bubble-2">
        <div className="v-highlight top-left"></div>
        <div className="b-sparkle s-2"></div>
      </div>
      <div className="glass-bubble bubble-3">
        <div className="b-sparkle s-3"></div>
      </div>
      <div className="glass-bubble bubble-4">
        <div className="v-highlight top-left"></div>
        <div className="b-sparkle s-4"></div>
      </div>
      <div className="glass-bubble bubble-5">
        <div className="b-sparkle s-1"></div>
      </div>

      {/* 4. THE MASSIVE LIQUID GLASS CARD */}
      <div className="vision-glass-container">
        <div className="vision-glass-card">
          
          <div className="vision-card-inner">
            <div className="v-highlight top-left"></div>

            <h1 className="vision-massive-logo">AS</h1>
            
            <div className="vision-identity-box">
              <p className="vision-greeting">WELCOME</p>
              
              <h2 className="vision-full-name">Abdul Salam</h2>
              <p className="vision-title">AI & ML Engineering</p>
              
              <div className="vision-badges">
                <div className="v-badge">System Online</div>
                <div className="v-badge">Access Granted</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CinematicIntro;
