import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, BrainCircuit, Globe, Wrench, ChevronRight, Hash, ExternalLink } from "lucide-react";
import "./SkillsLab.css";

const skillsData = [
  { id: "python", name: "Python", category: "PROGRAMMING", icon: <Code2 size={16}/>, level: "CURRENT FOCUS", focus: "AI/ML, Automation, Scripting", projects: ["Flight Reservation System", "Jarvis"], x: 30, y: 30 },
  { id: "c", name: "C", category: "PROGRAMMING", icon: <Code2 size={16}/>, level: "FOUNDATIONAL", focus: "Memory Management, Algorithms", projects: [], x: 15, y: 50 },
  { id: "js", name: "JavaScript", category: "WEB", icon: <Globe size={16}/>, level: "WORKING", focus: "Frontend Interactions, DOM", projects: ["Community Sports Equipment Library"], x: 85, y: 50 },
  { id: "react", name: "React", category: "WEB", icon: <Globe size={16}/>, level: "CURRENT FOCUS", focus: "UI Architecture, State Management", projects: ["Water Delivery System"], x: 70, y: 30 },
  { id: "htmlcss", name: "HTML & CSS", category: "WEB", icon: <Globe size={16}/>, level: "WORKING", focus: "Responsive Design, Layouts", projects: ["Community Sports Equipment Library"], x: 30, y: 70 },
  { id: "aiml", name: "AI / ML", category: "AI / ML", icon: <BrainCircuit size={16}/>, level: "CURRENT FOCUS", focus: "Intelligent Systems, NLP", projects: ["Jarvis"], x: 50, y: 50 },
  { id: "node", name: "Node.js", category: "TOOLS", icon: <Wrench size={16}/>, level: "WORKING", focus: "Backend API, REST", projects: ["Water Delivery System"], x: 70, y: 70 },
  { id: "git", name: "Git & GitHub", category: "TOOLS", icon: <Hash size={16}/>, level: "WORKING", focus: "Version Control, Collaboration", projects: [], x: 50, y: 85 }
];

const connections = [
  ["python", "aiml"], ["python", "c"], ["aiml", "react"], 
  ["js", "react"], ["js", "htmlcss"], ["react", "node"], 
  ["htmlcss", "aiml"], ["git", "node"], ["git", "htmlcss"]
];

const categories = ["ALL", "PROGRAMMING", "AI / ML", "WEB", "TOOLS"];

export default function SkillsLab() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeSkill, setActiveSkill] = useState(skillsData[0]);

  const filteredSkills = activeCategory === "ALL" 
    ? skillsData 
    : skillsData.filter(s => s.category === activeCategory);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section skills-lab-section" id="skills">
      <div className="sl-header-container">
        <div>
          <div className="section-label">04 / SKILLS</div>
          <div className="section-heading" style={{ textAlign: 'left', marginBottom: 0 }}>
            <h2>Engineering <span className="gradient-text">Toolkit.</span></h2>
            <p>Technologies I use to build, experiment, and solve problems.</p>
          </div>
        </div>
        <div className="sl-total-count">
          <span className="sl-count-label">TOTAL SKILLS</span>
          <span className="sl-count-number">{skillsData.length < 10 ? `0${skillsData.length}` : skillsData.length}</span>
        </div>
      </div>

      <div className="sl-grid">
        
        {/* LEFT: SKILL SELECTOR */}
        <div className="sl-glass-panel sl-left-panel">
          <div className="sl-filter-row">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`sl-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="sl-skill-list">
            <AnimatePresence>
              {filteredSkills.map((skill) => (
                <motion.button
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`sl-skill-btn ${activeSkill.id === skill.id ? 'active' : ''}`}
                  onClick={() => setActiveSkill(skill)}
                  aria-selected={activeSkill.id === skill.id}
                >
                  <span className="sl-btn-icon">{skill.icon}</span>
                  <span className="sl-btn-name">{skill.name}</span>
                  {activeSkill.id === skill.id && <ChevronRight size={14} className="sl-active-arrow" />}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTER: CAPABILITY MAP */}
        <div className="sl-glass-panel sl-center-panel">
          <span className="sl-panel-eyebrow">CAPABILITY MAP</span>
          <div className="sl-svg-container">
            <svg viewBox="0 0 100 100" className="sl-svg-map" preserveAspectRatio="xMidYMid meet">
              {/* Connections */}
              <g className="sl-map-lines">
                {connections.map(([sourceId, targetId]) => {
                  const source = skillsData.find(s => s.id === sourceId);
                  const target = skillsData.find(s => s.id === targetId);
                  const isConnected = activeSkill.id === sourceId || activeSkill.id === targetId;
                  return (
                    <line 
                      key={`${sourceId}-${targetId}`}
                      x1={`${source.x}%`} y1={`${source.y}%`}
                      x2={`${target.x}%`} y2={`${target.y}%`}
                      className={isConnected ? 'active' : ''}
                    />
                  );
                })}
              </g>
              
              {/* Nodes */}
              <g className="sl-map-nodes">
                {skillsData.map((skill) => {
                  const isActive = activeSkill.id === skill.id;
                  const isRelated = connections.some(([s, t]) => (s === skill.id && t === activeSkill.id) || (t === skill.id && s === activeSkill.id));
                  return (
                    <g 
                      key={skill.id} 
                      className={`sl-node ${isActive ? 'active' : isRelated ? 'related' : ''}`}
                      transform={`translate(${skill.x}, ${skill.y})`}
                      onClick={() => setActiveSkill(skill)}
                    >
                      <circle r={isActive ? "4" : isRelated ? "2.5" : "1.5"} />
                      <text y="8" fontSize="4" className="sl-node-label">{skill.name}</text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* RIGHT: DETAILS PANEL */}
        <div className="sl-glass-panel sl-right-panel">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSkill.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="sl-details-content"
            >
              <div className="sl-details-header">
                <span className="sl-panel-eyebrow">{activeSkill.category}</span>
                <h3>{activeSkill.name}</h3>
                <div className="sl-level-badge">{activeSkill.level}</div>
              </div>

              <div className="sl-details-block">
                <span className="sl-block-label">CURRENT FOCUS</span>
                <p>{activeSkill.focus}</p>
              </div>

              <div className="sl-details-block sl-projects-block">
                <span className="sl-block-label">RELATED PROJECTS</span>
                {activeSkill.projects.length > 0 ? (
                  <ul className="sl-related-projects">
                    {activeSkill.projects.map((proj, idx) => (
                      <li key={idx}>
                        <button className="sl-project-link" onClick={scrollToProjects}>
                          {proj} <ExternalLink size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sl-empty-state">No specific projects currently highlighted.</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}




