import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Map, Crosshair, Binoculars, Rocket, ArrowRight } from "lucide-react";
import "./EngineeringRoadmap.css";

const roadmapData = [
  {
    id: "current",
    stage: "01",
    status: "CURRENT FOCUS",
    title: "AI / ML Foundations",
    shortDesc: "Building stronger foundations in artificial intelligence, machine learning, and intelligent software systems.",
    tags: ["Python", "AI", "Algorithms"],
    icon: <Crosshair size={18} />,
    why: "Deepening my theoretical and practical understanding of ML is essential for building reliable intelligent systems.",
    focus: "Understanding core neural network architectures and data processing pipelines.",
    potentialBuild: "Refining the Jarvis AI assistant with more robust natural language intent parsing.",
    linkText: "EXPLORE IN AI LAB",
    linkTarget: "ailab"
  },
  {
    id: "next",
    stage: "02",
    status: "NEXT",
    title: "Intelligent Integration",
    shortDesc: "Connecting AI/ML models seamlessly with full-stack web interfaces.",
    tags: ["React", "APIs", "Integration"],
    icon: <Map size={18} />,
    why: "AI models require accessible user interfaces to be truly useful in solving real-world problems.",
    focus: "Bridging Python-based logic with React frontends via efficient REST APIs.",
    potentialBuild: "Upgrading the Water Delivery System or Flight System with predictive capabilities.",
    linkText: "RELATED BUILD",
    linkTarget: "projects"
  },
  {
    id: "exploring",
    stage: "03",
    status: "EXPLORING",
    title: "Computer Vision Basics",
    shortDesc: "Initial exploration into image processing pipelines and visual data extraction.",
    tags: ["Vision", "Processing", "Python"],
    icon: <Binoculars size={18} />,
    why: "Visual data forms a massive part of modern AI. Understanding how machines interpret images is a logical next step.",
    focus: "Learning foundational image classification and processing workflows.",
    potentialBuild: "Expanding the Image Classification concept from the AI Lab into a functional local script.",
    linkText: "RELATED SKILLS",
    linkTarget: "skills"
  },
  {
    id: "future",
    stage: "04",
    status: "FUTURE",
    title: "Scalable AI Systems",
    shortDesc: "Long-term direction towards understanding production-level engineering and system design.",
    tags: ["System Design", "Production", "Architecture"],
    icon: <Rocket size={18} />,
    why: "Transitioning from local scripts and prototypes to reliable software that can operate at scale.",
    focus: "Studying distributed systems, efficient database management, and robust deployment architectures.",
    potentialBuild: "Future exploration only; laying the theoretical groundwork now.",
    linkText: "RELATED BUILD",
    linkTarget: "projects"
  }
];

const filters = ["ALL", "CURRENT FOCUS", "NEXT", "EXPLORING", "FUTURE"];

export default function EngineeringRoadmap() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = activeFilter === "ALL" 
    ? roadmapData 
    : roadmapData.filter(item => item.status === activeFilter);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNavigation = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section engineering-roadmap-section" id="roadmap">
      <div className="section-label">07 / ROADMAP</div>
      <div className="section-heading">
        <h2>What's <span className="gradient-text">Next.</span></h2>
        <p>Areas I'm currently exploring, building, and developing further.</p>
      </div>

      <div className="er-filter-bar">
        {filters.map(f => (
          <button 
            key={f}
            className={`er-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => { setActiveFilter(f); setExpandedId(null); }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="er-container">
        {/* Subtle background connecting line */}
        <div className="er-connection-line"></div>

        <div className="er-grid">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item, index) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  className={`er-card-wrapper ${isExpanded ? "expanded" : ""}`}
                >
                  <div className={`er-node ${item.id === 'current' ? 'glow' : ''}`}>
                    <div className="er-node-inner"></div>
                  </div>

                  <div className="er-glass-card">
                    <div className="er-card-header">
                      <div className="er-stage-badge">
                        {item.icon} <span className="er-stage-num">{item.stage}</span>
                      </div>
                      <span className={`er-status-label ${item.id}`}>{item.status}</span>
                    </div>

                    <h3 className="er-title">{item.title}</h3>
                    <p className="er-short-desc">{item.shortDesc}</p>

                    <div className="er-tags">
                      {item.tags.map(t => <span key={t}>{t}</span>)}
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="er-expanded-content"
                        >
                          <div className="er-divider"></div>
                          
                          <div className="er-detail-block">
                            <span className="er-detail-label">WHY</span>
                            <p>{item.why}</p>
                          </div>
                          
                          <div className="er-detail-block">
                            <span className="er-detail-label">FOCUS</span>
                            <p>{item.focus}</p>
                          </div>

                          <div className="er-detail-block">
                            <span className="er-detail-label">POTENTIAL BUILD</span>
                            <p className="er-italic">{item.potentialBuild}</p>
                          </div>

                          <button 
                            className="er-link-btn" 
                            onClick={() => handleNavigation(item.linkTarget)}
                          >
                            {item.linkText} <ArrowRight size={14} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      className="er-expand-btn"
                      onClick={() => toggleExpand(item.id)}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "CLOSE" : "EXPLORE"} 
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="er-summary-panel">
        <span className="er-summary-label">ENGINEERING DIRECTION</span>
        <p>AI / ML <span className="er-plus">+</span> SOFTWARE ENGINEERING <span className="er-plus">+</span> INTELLIGENT SYSTEMS</p>
      </div>
    </section>
  );
}


