import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, FlaskConical, ArrowRight, CheckCircle2, Wrench, Code2, Activity } from "lucide-react";
import "./BuildLog.css";

const logData = [
  {
    id: "terminal",
    date: "RECENT",
    category: "ENGINEERING",
    status: "COMPLETED",
    title: "Interactive Engineering Terminal",
    shortDesc: "Built a custom React-based developer terminal interface for the portfolio.",
    problem: "Needed to showcase technical engineering capability interactively without cluttering the main graphical UI.",
    approach: "Engineered an isolated, state-driven terminal emulator that parses local commands safely.",
    learned: "Managing complex keyboard event listeners and scroll-locking in React without breaking global accessibility.",
    next: "Potential next step: Implement simple simulated file-system navigation.",
    tech: ["React", "CSS", "Framer Motion"]
  },
  {
    id: "ailab",
    date: "RECENT",
    category: "AI / ML",
    status: "ONGOING",
    title: "Interactive AI Lab Interface",
    shortDesc: "Developed a dynamic interface demonstrating AI engineering concepts.",
    problem: "Presenting abstract machine learning concepts (like neural networks and text classification) in a visual, accessible format.",
    approach: "Used SVG rendering for neural networks and deterministic local logic for fast, safe sentiment analysis simulation.",
    learned: "Optimizing SVG animations in React to ensure smooth rendering without heavy canvas libraries.",
    next: "Potential next step: Integrate WebGL for higher-performance data visualization.",
    tech: ["JavaScript", "React", "SVG"]
  },
  {
    id: "jarvis",
    date: "PREVIOUS",
    category: "EXPERIMENT",
    status: "EXPERIMENT",
    title: "Jarvis AI Assistant Core",
    shortDesc: "Scripted a personal assistant focused on natural language intent and OS automation.",
    problem: "The friction involved in manually executing repetitive digital tasks and retrieving immediate information.",
    approach: "Built a Python event-loop utilizing NLTK and SpeechRecognition to parse intent and execute local machine commands.",
    learned: "Handling asynchronous audio streams and mapping unstructured natural language to strict programmable actions.",
    next: "Potential next step: Expand the intent-parser using a lightweight local LLM model.",
    tech: ["Python", "NLTK", "SpeechRecognition"]
  },
  {
    id: "water",
    date: "PREVIOUS",
    category: "WEB",
    status: "COMPLETED",
    title: "Water Delivery System API",
    shortDesc: "Structured the backend logic for a water delivery logistics platform.",
    problem: "Inefficient manual tracking of customer orders and fragmented delivery routing logistics.",
    approach: "Developed a decoupled MERN-like stack utilizing Express.js to process and route REST API requests.",
    learned: "Designing stateless API architecture and validating client-server data effectively.",
    tech: ["Node.js", "Express", "REST API"]
  },
  {
    id: "flight",
    date: "PREVIOUS",
    category: "PROJECT",
    status: "COMPLETED",
    title: "Flight Reservation Engine",
    shortDesc: "Terminal-based reservation system managing flight searches and booking workflows.",
    problem: "Managing complex booking arrays and passenger states in a reliable logical structure without database collisions.",
    approach: "Utilized strict Object-Oriented Programming principles to manage booking states in memory.",
    learned: "Designing scalable classes and data structures to prevent state collision during booking processes.",
    tech: ["Python 3", "Data Structures"]
  }
];

const categories = ["ALL", "PROJECT", "AI / ML", "WEB", "EXPERIMENT", "ENGINEERING"];

export default function BuildLog() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  const filteredData = activeFilter === "ALL" 
    ? logData 
    : logData.filter(item => item.category === activeFilter || item.status === activeFilter);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section build-log-section" id="buildlog">
      <div className="section-label">06 / LOGS</div>
      
      <div className="bl-header-wrapper">
        <div className="section-heading" style={{ textAlign: "left", marginBottom: 0 }}>
          <h2>Built. Tested. <span className="gradient-text">Iterated.</span></h2>
          <p>A snapshot of the engineering process behind my projects and experiments.</p>
        </div>
        
        {/* ENGINEERING PROCESS VISUAL */}
        <div className="bl-process-strip">
          <div className="bl-process-node"><Code2 size={14} /> IDEA</div>
          <ArrowRight size={12} className="bl-process-arrow" />
          <div className="bl-process-node"><Wrench size={14} /> BUILD</div>
          <ArrowRight size={12} className="bl-process-arrow" />
          <div className="bl-process-node"><FlaskConical size={14} /> TEST</div>
          <ArrowRight size={12} className="bl-process-arrow" />
          <div className="bl-process-node"><Activity size={14} /> DEBUG</div>
          <ArrowRight size={12} className="bl-process-arrow" />
          <div className="bl-process-node"><CheckCircle2 size={14} /> ITERATE</div>
        </div>
      </div>

      {/* FILTER SYSTEM */}
      <div className="bl-filter-bar">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`bl-filter-btn ${activeFilter === cat ? "active" : ""}`}
            onClick={() => { setActiveFilter(cat); setExpandedId(null); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="bl-timeline-container">
        <div className="bl-timeline-line"></div>
        
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isLeft = index % 2 === 0;

            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`bl-timeline-event ${isLeft ? "left-event" : "right-event"} ${isExpanded ? "expanded" : ""}`}
              >
                <div className="bl-timeline-node"></div>
                
                <div className="bl-glass-card">
                  <div className="bl-card-header">
                    <div className="bl-meta-row">
                      <span className="bl-date">{item.date}</span>
                      <span className="bl-dot">•</span>
                      <span className="bl-category">{item.category}</span>
                    </div>
                    <span className={`bl-status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                  </div>

                  <h3 className="bl-title">{item.title}</h3>
                  <p className="bl-short-desc">{item.shortDesc}</p>

                  <div className="bl-tech-tags">
                    {item.tech.map(t => <span key={t}>{t}</span>)}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bl-expanded-content"
                      >
                        <div className="bl-divider"></div>
                        
                        {item.problem && (
                          <div className="bl-detail-block">
                            <span className="bl-detail-label">PROBLEM</span>
                            <p>{item.problem}</p>
                          </div>
                        )}
                        
                        {item.approach && (
                          <div className="bl-detail-block">
                            <span className="bl-detail-label">APPROACH</span>
                            <p>{item.approach}</p>
                          </div>
                        )}

                        {item.learned && (
                          <div className="bl-detail-block">
                            <span className="bl-detail-label">WHAT I LEARNED</span>
                            <p>{item.learned}</p>
                          </div>
                        )}

                        {item.next && (
                          <div className="bl-detail-block">
                            <span className="bl-detail-label">NEXT ITERATION</span>
                            <p className="bl-italic">{item.next}</p>
                          </div>
                        )}

                        {item.category === "PROJECT" && (
                          <button className="bl-project-link-btn" onClick={scrollToProjects}>
                            VIEW PROJECT CASE STUDY <ArrowRight size={14} />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button 
                    className="bl-expand-btn" 
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "HIDE DETAILS" : "VIEW DETAILS"} 
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredData.length === 0 && (
          <div className="bl-empty-state">No engineering logs found for this category.</div>
        )}
      </div>

      {/* SUMMARY PANEL */}
      <div className="bl-summary-panel">
        <span className="bl-summary-label">ENGINEERING MINDSET</span>
        <p>"Build small. Test often. Understand the failure. Improve the system."</p>
      </div>
    </section>
  );
}



