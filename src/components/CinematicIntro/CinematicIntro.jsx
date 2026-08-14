import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./CinematicIntro.css";

export default function CinematicIntro() {
  const [progress, setProgress] = useState(0);
  const [cracked, setCracked] = useState(false);
  const [blasted, setBlasted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCracked(true);
          setTimeout(() => setBlasted(true), 500);
          return 100;
        }
        return prev + 2; // Speed increased
      });
    }, 15); // Faster ticking
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!blasted && (
        <div className="luxury-intro-overlay">
          {!cracked ? (
            <motion.div className="glass-loader-box" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="liquid-text">WELCOME</div>
              <div className="progress-counter">{progress}%</div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </motion.div>
          ) : (
            <motion.div className="shatter-container">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="shard" />
              ))}
              <div className="blast-flash"></div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
