import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PORTFOLIO_SECTIONS } from "../../config/sections";
import "./ScrollExperience.css";

export default function ScrollExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const sectionElements = PORTFOLIO_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    if (sectionElements.length === 0) return;

    const observerOptions = { root: null, rootMargin: "-20% 0px -40% 0px", threshold: 0.1 };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = PORTFOLIO_SECTIONS.findIndex(s => s.id === entry.target.id);
          if (index !== -1) setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionElements.forEach(el => observer.observe(el));

    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActiveIndex(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const activeSection = PORTFOLIO_SECTIONS[activeIndex] || PORTFOLIO_SECTIONS[0];
  const progressPercent = PORTFOLIO_SECTIONS.length > 1 
    ? (activeIndex / (PORTFOLIO_SECTIONS.length - 1)) * 100 
    : 0;

  return (
    <>
      <motion.div className="se-scroll-progress" style={{ scaleX, transformOrigin: "0% 50%" }} />

      <div className="se-floating-indicator" aria-label="Page section progress">
        <div className="se-indicator-capsule">
          <span className="se-num-current">{activeSection.number}</span>
          
          <div className="se-track-wrapper">
            <div className="se-track-line"></div>
            <motion.div 
              className="se-track-dot" 
              animate={{ top: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <span className="se-num-total">
            {PORTFOLIO_SECTIONS.length < 10 ? `0${PORTFOLIO_SECTIONS.length}` : PORTFOLIO_SECTIONS.length}
          </span>

          <div className="se-active-label">{activeSection.label}</div>
        </div>
      </div>
    </>
  );
}
