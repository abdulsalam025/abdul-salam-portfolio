import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, Mail, Moon, Sun, Code2, Sparkles, GitBranch, BriefcaseBusiness, Menu, X, Terminal, Search, Copy, Download, Home, Briefcase, FileText, User } from "lucide-react";
import { useEffect, useState } from "react";
import profilePhoto from "./assets/profile-optimized.webp";
import "./App.css";
import CinematicIntro from "./components/CinematicIntro/CinematicIntro";

const API_URL = import.meta.env.VITE_API_URL || "https://abdul-salam-portfolio.onrender.com";

const scrollReveal = { hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const scrollRevealLeft = { hidden: { opacity: 0, x: -50, scale: 0.95 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const scrollRevealRight = { hidden: { opacity: 0, x: 50, scale: 0.95 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [terminalLine, setTerminalLine] = useState(0);
  
  const [cmdOpen, setCmdOpen] = useState(false);
  const [ghStats, setGhStats] = useState({ repos: '-', followers: '-' });

  const terminalSequence = [
    "Initializing Neural Core...",
    "Loading weights: model_v4.h5",
    "Optimizing hyper-parameters...",
    "Status: 100% ONLINE."
  ];

  // Sync body class with theme state so background changes correctly
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }
  }, [darkMode]);

  useEffect(() => {
    const updateTime = () => {
      const options = { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    };
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);
    const terminalTimer = setInterval(() => setTerminalLine((prev) => (prev + 1) % terminalSequence.length), 2500);
    return () => { clearInterval(clockTimer); clearInterval(terminalTimer); };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/abdulsalam025')
      .then(res => res.json())
      .then(data => {
        if(data.public_repos !== undefined) {
          setGhStats({ repos: data.public_repos, followers: data.followers });
        }
      }).catch(() => {});
  }, []);

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    setContactSending(true); setContactStatus("");
    try {
      const response = await fetch(`${API_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!response.ok) throw new Error("Unable to send message.");
      setContactStatus("Message sent successfully.");
      event.currentTarget.reset();
    } catch (error) { setContactStatus("Unable to send the message right now. Please try again."); } 
    finally { setContactSending(false); }
  };

  const executeCommand = (action) => {
    setCmdOpen(false);
    if (action === 'theme') setDarkMode(!darkMode);
    if (action === 'projects') document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    if (action === 'contact') document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    if (action === 'email') navigator.clipboard.writeText('abdulsalam024.main@gmail.com');
    if (action === 'resume') window.open('/Abdul_Salam_Resume.pdf', '_blank');
  };

  const handleMagnetic = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  };

  const resetMagnetic = (e) => {
    const btn = e.currentTarget;
    btn.style.transform = `translate(0px, 0px) scale(1)`;
  };

  return (
    <div className="app">
      <CinematicIntro />

      <div className="liquid-aura-cursor"></div>

      <div className="global-fluids">
        <div className="g-blob g-peach"></div>
        <div className="g-blob g-purple"></div>
        <div className="g-blob g-cyan"></div>
      </div>

      <AnimatePresence>
        {cmdOpen && (
          <motion.div className="cmd-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCmdOpen(false)}>
            <motion.div className="cmd-modal" initial={{ scale: 0.95, y: -20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: -20 }} onClick={(e) => e.stopPropagation()}>
              <div className="cmd-header">
                <Search size={24} />
                <input type="text" className="cmd-input" placeholder="Search commands..." autoFocus />
              </div>
              <div className="cmd-list">
                <button className="cmd-item" onClick={() => executeCommand('theme')}><Sun size={20}/> Toggle Light/Dark Theme</button>
                <button className="cmd-item" onClick={() => executeCommand('projects')}><Code2 size={20}/> Jump to Projects</button>
                <button className="cmd-item" onClick={() => executeCommand('email')}><Copy size={20}/> Copy Email Address</button>
                <button className="cmd-item" onClick={() => executeCommand('resume')}><Download size={20}/> Download Resume PDF</button>
                <button className="cmd-item" onClick={() => executeCommand('contact')}><Mail size={20}/> Open Contact Form</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="navbar">
        <div className="nav-container">
          <div className="logo"><span>AS</span></div>
          <nav className={mobileMenuOpen ? "mobile-nav mobile-open" : "mobile-nav"}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          </nav>
          
          <div className="header-actions">
            <button className="cmd-shortcut" onClick={() => setCmdOpen(true)}><Search size={16}/> Ctrl K</button>
            <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="mobile-menu-button icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* SPECIAL MOBILE BOTTOM DOCK */}
      <nav className="mobile-bottom-dock">
        <a href="#home" className="dock-item"><Home size={20} /><span>Home</span></a>
        <a href="#projects" className="dock-item"><Briefcase size={20} /><span>Projects</span></a>
        <a href="#resume" className="dock-item"><FileText size={20} /><span>Resume</span></a>
        <a href="#contact" className="dock-item"><User size={20} /><span>Contact</span></a>
      </nav>

      <main className={mobileMenuOpen ? "mobile-menu-active" : ""}>
        <section className="hero" id="home">
          <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            <div className="fancy-time-hud">
              <div className="hud-radar"></div>
              <div className="hud-data">
                <span className="hud-title">SYSTEM TIME • KTM_NPL</span>
                <span className="hud-time">{localTime}</span>
              </div>
            </div>

            <p className="eyebrow">AI & ML ENGINEERING STUDENT</p>
            <h1>Hi, I'm <span className="cinematic-text">Abdul Salam.</span><br />I build things with <em className="gradient-text">intelligence.</em></h1>
            
            <div className="ai-terminal-widget">
              <div className="terminal-header">
                <div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div>
              </div>
              <div style={{display: 'flex'}}>
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-text">{terminalSequence[terminalLine]}</span>
                <span className="cursor-blink"></span>
              </div>
            </div>

            <div className="hero-buttons">
              <a href="#projects" className="glass-btn primary-button" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}>
                Explore My Work <ArrowRight size={20} />
              </a>
              <a href="/Abdul_Salam_Resume.pdf" target="_blank" rel="noopener noreferrer" className="glass-btn secondary-button" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}>
                View Resume
              </a>
            </div>

            <div className="circle-buttons-container">
              <a href="https://github.com/abdulsalam025" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="circle-btn cb-github"><GitBranch /></a>
              <a href="https://www.linkedin.com/in/abdul-salam-ai025/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="circle-btn cb-linkedin"><BriefcaseBusiness /></a>
              <a href="mailto:abdulsalam024.main@gmail.com" aria-label="Email" className="circle-btn cb-email"><Mail /></a>
            </div>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div className="profile-core">
              <div className="profile-rings">
                <div className="ring r1"></div>
                <div className="ring r2"></div>
                <div className="ring r3"></div>
                <div className="orbiter-container"><div className="orbiter"></div></div>
              </div>
              <img src={profilePhoto} alt="Abdul Salam" className="profile-img" />
            </div>
            <div className="floating-card card-one"><Terminal size={18} /><span>System: Online</span></div>
            <div className="floating-card card-two"><Sparkles size={18} /><span>AI Models</span></div>
          </motion.div>
        </section>

        <div className="tech-marquee">
          <div className="marquee-content">
            <span className="marquee-item">MACHINE LEARNING</span><span className="marquee-item">•</span>
            <span className="marquee-item">NEURAL NETWORKS</span><span className="marquee-item">•</span>
            <span className="marquee-item">PYTHON 3</span><span className="marquee-item">•</span>
            <span className="marquee-item">DATA STRUCTURES</span><span className="marquee-item">•</span>
            <span className="marquee-item">REACT.JS</span><span className="marquee-item">•</span>
            <span className="marquee-item">TENSORFLOW</span><span className="marquee-item">•</span>
            <span className="marquee-item">SYSTEM DESIGN</span><span className="marquee-item">•</span>
            <span className="marquee-item">MACHINE LEARNING</span><span className="marquee-item">•</span>
            <span className="marquee-item">NEURAL NETWORKS</span><span className="marquee-item">•</span>
            <span className="marquee-item">PYTHON 3</span><span className="marquee-item">•</span>
            <span className="marquee-item">DATA STRUCTURES</span><span className="marquee-item">•</span>
            <span className="marquee-item">REACT.JS</span><span className="marquee-item">•</span>
            <span className="marquee-item">TENSORFLOW</span><span className="marquee-item">•</span>
            <span className="marquee-item">SYSTEM DESIGN</span>
          </div>
        </div>

        <motion.section className="section" id="about" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">01 — ABOUT ME</div>
          <div className="section-grid">
            <div><span className="eyebrow">WHO I AM</span><h2>Building my path in <span className="gradient-text">AI & Technology.</span></h2></div>
            <div className="glass-panel about-text">
              <p>I'm Abdul Salam, an Artificial Intelligence and Machine Learning engineering student with a strong interest in software development, intelligent systems and practical problem solving.</p>
              
              <div style={{display: 'flex', gap: '20px', marginTop: '20px', marginBottom: '20px', padding: '15px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--glass-border-dark)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><GitBranch size={24} color="var(--accent)"/> <div><strong style={{display:'block', fontSize:'1.2rem'}}>{ghStats.repos}</strong><span style={{fontSize:'0.75rem', color: 'var(--text-secondary)', textTransform:'uppercase', fontWeight:'bold'}}>Public Repos</span></div></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Code2 size={24} color="var(--accent)"/> <div><strong style={{display:'block', fontSize:'1.2rem'}}>{ghStats.followers}</strong><span style={{fontSize:'0.75rem', color: 'var(--text-secondary)', textTransform:'uppercase', fontWeight:'bold'}}>Followers</span></div></div>
              </div>

              <p>My long-term goal is to become a technically strong engineer who can build reliable products and solve meaningful real-world problems with technology.</p>
              <div className="stats"><div><strong>01+</strong><span>Years Learning</span></div><div><strong>05+</strong><span>Projects</span></div><div><strong>∞</strong><span>Curiosity</span></div></div>
            </div>
          </div>
        </motion.section>

        <motion.section className="section" id="education" variants={scrollRevealLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">02 — EDUCATION</div>
          <div className="section-heading"><h2>My academic <span className="gradient-text">Journey.</span></h2><p>Building a strong engineering foundation through academics, programming and hands-on projects.</p></div>
          <div className="glass-panel education-card">
            <div className="education-year"><span>2025</span><div className="timeline-dot"></div></div>
            <div className="education-content">
              <span className="eyebrow">UNDERGRADUATE ENGINEERING</span><h3>Bachelor of Engineering — AI & Machine Learning</h3><p className="education-institution">BMS College of Engineering</p>
              <p>Developing foundations in programming, artificial intelligence, machine learning, mathematics, engineering and software development through coursework and practical projects.</p>
              <div className="tags"><span>AI & ML</span><span>Programming</span><span>Engineering</span><span>Software Development</span></div>
            </div>
          </div>
        </motion.section>

        <motion.section className="section" id="skills" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">03 — SKILLS</div>
          <div className="section-heading"><h2>My technical <span className="gradient-text">Toolbox.</span></h2><p>Technologies and concepts I use while building projects and improving my engineering skills.</p></div>
          <div className="skills-grid">
            {[["Python", "Programming"], ["C", "Programming"], ["JavaScript", "Web"], ["React", "Frontend"], ["HTML & CSS", "Web"], ["Git & GitHub", "Development"], ["AI / ML", "Artificial Intelligence"], ["Node.js", "Backend"]].map(([name, category], index) => (
              <motion.div className="glass-panel skill-card" key={name} initial={{ opacity: 0, y: 25, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: index * 0.05 }}>
                <span>{String(index + 1).padStart(2, "0")}</span><div><h3>{name}</h3><p>{category}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.section>



        <motion.section className="section" id="projects" variants={scrollRevealRight} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">04 — PROJECTS</div>
          <div className="section-heading"><h2>Things I've <span className="gradient-text">Built.</span></h2><p>A selection of projects that demonstrate my development and problem-solving skills.</p></div>
          <div className="projects-grid">
            {[
              { id: "sports", type: "DESIGN THINKING / WEB", title: "Community Sports Equipment Library", tags: ["HTML", "CSS", "JavaScript"], desc: "A platform designed to connect students, institutions and organizations with reusable sports equipment." },
              { id: "flight", type: "PYTHON / SOFTWARE", title: "Flight Reservation System", tags: ["Python", "Logic"], desc: "A reservation system focused on flight search, passenger information and booking workflows." },
              { id: "jarvis", type: "AI / PERSONAL ASSISTANT", title: "Jarvis", tags: ["Python", "AI"], desc: "An AI-powered personal assistant project designed to interact with the user and perform useful tasks through intelligent automation." },
              { id: "water", type: "FULL STACK / WEB", title: "Water Delivery System", tags: ["React", "Node.js", "Express"], desc: "A web-based water delivery platform designed to manage customers, water orders and delivery workflows." }
            ].map((p, i) => (
              <article className="glass-panel project-card" key={p.id} onClick={() => {setSelectedProject(p.id); setActiveTab("overview");}}>
                <div className="project-number">0{i+1}</div>
                <div style={{position: 'relative', zIndex: 2}}><span className="eyebrow">{p.type}</span><h3>{p.title}</h3><p>{p.desc}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></div>
                <ArrowRight className="project-arrow" size={28} />
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section className="section" id="resume" variants={scrollRevealLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">05 — RESUME</div>
          <div className="section-heading"><h2>My professional <span className="gradient-text">Profile.</span></h2><p>A concise overview of my education, technical skills, projects and engineering goals.</p></div>
          
          <div className="resume-grid">
            <div className="glass-panel resume-card wide">
              <span className="resume-watermark">01</span>
              <span className="eyebrow">EDUCATION</span><h3>Bachelor of Engineering</h3><p>Artificial Intelligence & Machine Learning. Developing strong theoretical and practical frameworks for modern software challenges.</p><span className="resume-meta">BMS College of Engineering • 2025</span>
            </div>
            <div className="glass-panel resume-card">
              <span className="resume-watermark">02</span>
              <span className="eyebrow">TECHNICAL SKILLS</span><h3>Engineering Toolkit</h3><p>Python, C, JavaScript, React, HTML & CSS, Git & GitHub, AI / ML and Node.js.</p>
            </div>
            <div className="glass-panel resume-card">
              <span className="resume-watermark">03</span>
              <span className="eyebrow">SELECTED PROJECTS</span><h3>Hands-on Development</h3><p>Community Sports Equipment Library, Flight Reservation System and Jarvis.</p>
            </div>
            <div className="glass-panel resume-card wide">
              <span className="resume-watermark">04</span>
              <span className="eyebrow">CAREER OBJECTIVE</span><h3>Building Intelligent Systems</h3><p>Developing strong foundations in software engineering, artificial intelligence and machine learning while solving meaningful real-world problems.</p>
            </div>
          </div>
          
          <div className="resume-actions">
            <a href="/Abdul_Salam_Resume.pdf" target="_blank" rel="noopener noreferrer" className="glass-btn primary-button" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}>View Resume <ArrowRight size={20} /></a>
            <a href="/Abdul_Salam_Resume.pdf" download="Abdul_Salam_Resume.pdf" className="glass-btn secondary-button" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}>Download Data <ArrowDown size={20} /></a>
          </div>
        </motion.section>

        <motion.section className="section" id="contact" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">06 — CONTACT</div>
          <div className="glass-panel contact-box">
            <div className="contact-grid">
              <div><span className="eyebrow">LET'S CONNECT</span><h2>Have an idea?<br /><span className="gradient-text">Let's build it.</span></h2><p>I'm interested in projects, collaboration and opportunities related to software, AI and technology.</p><div className="contact-direct" style={{marginTop: '30px'}}><span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Prefer email?</span><a href="mailto:abdulsalam024.main@gmail.com" style={{color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none'}}>abdulsalam024.main@gmail.com</a></div></div>
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="contact-form-row"><label><span>Name</span><input type="text" name="name" placeholder="Your name" autoComplete="name" required /></label><label><span>Email</span><input type="email" name="email" placeholder="you@example.com" autoComplete="email" required /></label></div>
                <label><span>Subject</span><input type="text" name="subject" placeholder="What would you like to discuss?" required /></label>
                <label><span>Message</span><textarea name="message" rows="5" placeholder="Tell me about your idea, project or opportunity..." required></textarea></label>
                <button type="submit" className="glass-btn primary-button" disabled={contactSending} onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}>{contactSending ? "Sending..." : "Send Message"} <Mail size={20} /></button>
                {contactStatus && <p style={{color: 'var(--accent)', fontWeight: 'bold'}}>{contactStatus}</p>}
              </form>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {selectedProject && (
            <motion.div className="project-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)}>
              <motion.div className="glass-panel project-modal" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>

                <div className="modal-tabs">
                  <button className={`modal-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Sparkles size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'5px'}}/> Overview</button>
                  <button className={`modal-tab ${activeTab === 'arch' ? 'active' : ''}`} onClick={() => setActiveTab('arch')}><Code2 size={16} style={{display:'inline', verticalAlign:'middle', marginRight:'5px'}}/> Architecture</button>
                </div>

                {selectedProject === "sports" && activeTab === 'overview' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <span className="eyebrow">DESIGN THINKING / WEB</span><h2>Community Sports Equipment Library</h2>
                    <p>A platform designed to connect students, institutions and organizations with reusable sports equipment.</p>
                    <div className="modal-section"><h4>Key Features</h4><ul><li>Sports equipment discovery</li><li>Student-oriented interface</li><li>Equipment sharing concept</li></ul></div>
                  </motion.div>
                )}
                {selectedProject === "sports" && activeTab === 'arch' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="modal-section"><h4>Frontend Stack</h4><div className="tags"><span>HTML5</span><span>CSS3</span><span>Vanilla JS</span></div></div>
                    <div className="modal-section"><h4>System Design</h4><p>DOM manipulation and event-driven architecture focusing on accessible, responsive UI without heavy framework overhead.</p></div>
                  </motion.div>
                )}

                {selectedProject === "flight" && activeTab === 'overview' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <span className="eyebrow">PYTHON / SOFTWARE</span><h2>Flight Reservation System</h2>
                    <p>A reservation system focused on flight search, passenger information and booking workflows.</p>
                    <div className="modal-section"><h4>Key Features</h4><ul><li>Flight search</li><li>Passenger information</li><li>Reservation workflow</li></ul></div>
                  </motion.div>
                )}
                {selectedProject === "flight" && activeTab === 'arch' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="modal-section"><h4>Core Logic</h4><div className="tags"><span>Python 3</span><span>Data Structures</span></div></div>
                    <div className="modal-section"><h4>System Design</h4><p>Terminal-based software utilizing OOP principles. Implements state management for passenger booking arrays and flight schedules.</p></div>
                  </motion.div>
                )}

                {selectedProject === "jarvis" && activeTab === 'overview' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="modal-project-header">
                      <div><span className="eyebrow">AI / PERSONAL ASSISTANT</span><h2>Jarvis</h2></div>
                      <span className="modal-status"><span></span> Personal Project</span>
                    </div>
                    <p>Jarvis is a personal assistant project focused on creating an intelligent interface between the user and useful digital tasks.</p>
                    <div className="modal-section"><h4>Key Features</h4><ul><li>Personal assistant interaction</li><li>Intelligent task handling</li><li>Automation-oriented workflow</li></ul></div>
                  </motion.div>
                )}
                {selectedProject === "jarvis" && activeTab === 'arch' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="modal-section"><h4>AI Stack</h4><div className="tags"><span>Python</span><span>NLTK</span><span>SpeechRecognition</span></div></div>
                    <div className="modal-section"><h4>System Design</h4><p>Event-loop driven automation script. Captures audio input, parses intent using natural language logic, and executes OS-level scripts dynamically.</p></div>
                  </motion.div>
                )}

                {selectedProject === "water" && activeTab === 'overview' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <span className="eyebrow">FULL STACK / WEB</span><h2>Water Delivery System</h2>
                    <p>A web-based water delivery platform designed to simplify customer orders, delivery management and water-service workflows.</p>
                    <div className="modal-section"><h4>Key Features</h4><ul><li>Customer-oriented ordering interface</li><li>Water delivery workflow management</li><li>Responsive web application</li></ul></div>
                  </motion.div>
                )}
                {selectedProject === "water" && activeTab === 'arch' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <div className="modal-section"><h4>Tech Stack</h4><div className="tags"><span>React</span><span>Node.js</span><span>Express</span><span>REST API</span></div></div>
                    <div className="modal-section"><h4>System Design</h4><p>Full MERN-like stack without MongoDB (Stateless or SQL logic). React frontend communicates via REST to an Express backend handling delivery logic.</p></div>
                  </motion.div>
                )}

                <div className="modal-footer">
                  <div><span className="modal-footer-label">PROJECT</span><strong>AI</strong></div>
                  <a href="#" className="glass-btn secondary-button" onClick={(e) => e.preventDefault()}>View GitHub <ArrowRight size={20} /></a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer style={{ borderTop: '1px solid var(--glass-border-dark)', padding: '50px 5%', textAlign: 'center', marginTop: '60px' }}>
        <div><strong style={{ fontFamily: 'Cinzel', fontSize: '2.5rem', marginRight: '15px' }}>AS</strong><span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Abdul Salam</span></div>
        <p style={{ marginTop: '15px' }}>© 2026 Abdul Salam. Engineered with React & Liquid Glass.</p>
        <div className="circle-buttons-container" style={{ justifyContent: 'center', margin: '30px auto 0 auto', width: 'fit-content' }}>
          <a href="https://github.com/abdulsalam025" target="_blank" rel="noopener noreferrer" className="circle-btn cb-github"><GitBranch /></a>
          <a href="https://www.linkedin.com/in/abdul-salam-ai025/" target="_blank" rel="noopener noreferrer" className="circle-btn cb-linkedin"><BriefcaseBusiness /></a>
          <a href="mailto:abdulsalam024.main@gmail.com" className="circle-btn cb-email"><Mail /></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
