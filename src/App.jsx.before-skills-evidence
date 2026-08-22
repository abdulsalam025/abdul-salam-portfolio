import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, Mail, Moon, Sun, Code2, Sparkles, GitBranch, BriefcaseBusiness, Menu, X, Terminal, Search, Copy, Download, Home, Briefcase, FileText, User } from "lucide-react";
import {useEffect, useState, Suspense } from "react";
import profilePhoto from "./assets/profile-optimized.webp";
import "./App.css";
import CinematicIntro from "./components/CinematicIntro/CinematicIntro";
import EngineeringDashboard from "./components/EngineeringDashboard/EngineeringDashboard";
import ProjectCaseStudies from "./components/ProjectCaseStudies/ProjectCaseStudies";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { PROJECTS } from "./data/projects";
import SectionFallback from "./components/SectionFallback/SectionFallback";
import { AILab } from "./lazySections";
import { GitHubActivity } from "./lazySections";
import { EngineeringJournal } from "./lazySections";
import ResumePreview from "./components/ResumePreview/ResumePreview";
import ContactCenter from "./components/ContactCenter/ContactCenter";
import CommandCenter from "./components/CommandCenter/CommandCenter";
import EngineeringScrollNav from "./components/EngineeringScrollNav/EngineeringScrollNav";
import { EngineeringTimeline } from "./lazySections";
import { dashboardStatus, useGitHub } from "./hooks/useGitHub";

const API_URL = import.meta.env.VITE_API_URL || "https://abdul-salam-portfolio.onrender.com";

const scrollReveal = { hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const scrollRevealLeft = { hidden: { opacity: 0, x: -50, scale: 0.95 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
const scrollRevealRight = { hidden: { opacity: 0, x: 50, scale: 0.95 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [terminalLine, setTerminalLine] = useState(0);
  
  const [cmdOpen, setCmdOpen] = useState(false);
  const github = useGitHub();

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
      <a className="skip-link" href="#home">Skip to content</a>
      <CinematicIntro />
      <EngineeringScrollNav />

      <div className="liquid-aura-cursor"></div>

      <div className="global-fluids">
        <div className="g-blob g-peach"></div>
        <div className="g-blob g-purple"></div>
        <div className="g-blob g-cyan"></div>
      </div>

      <CommandCenter open={cmdOpen} onClose={() => setCmdOpen(false)} />

      <header className="navbar">
        <div className="nav-container">
          <div className="logo"><span>AS</span></div>
          <nav className={mobileMenuOpen ? "mobile-nav mobile-open" : "mobile-nav"}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#resume" onClick={() => setMobileMenuOpen(false)}>Resume</a>
            <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
            <a href="#ailab" onClick={() => setMobileMenuOpen(false)}>AI Lab</a>
            <a href="#github" onClick={() => setMobileMenuOpen(false)}>GitHub</a>
            <a href="#buildlog" onClick={() => setMobileMenuOpen(false)}>Build Log</a>
            <a href="#roadmap" onClick={() => setMobileMenuOpen(false)}>Roadmap</a>
            <a href="#timeline" onClick={() => setMobileMenuOpen(false)}>Timeline</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
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
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><GitBranch size={24} color="var(--accent)"/> <div><strong style={{display:'block', fontSize:'1.2rem'}}>{github.data && github.data.profile ? github.data.profile.publicRepos : '-'}</strong><span style={{fontSize:'0.75rem', color: 'var(--text-secondary)', textTransform:'uppercase', fontWeight:'bold'}}>Public Repos</span></div></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><Code2 size={24} color="var(--accent)"/> <div><strong style={{display:'block', fontSize:'1.2rem'}}>{github.data && github.data.profile ? github.data.profile.followers : '-'}</strong><span style={{fontSize:'0.75rem', color: 'var(--text-secondary)', textTransform:'uppercase', fontWeight:'bold'}}>Followers</span></div></div>
              </div>

              <p>My long-term goal is to become a technically strong engineer who can build reliable products and solve meaningful real-world problems with technology.</p>
              <div className="stats"><div><strong>01+</strong><span>Years Learning</span></div><div><strong>04+</strong><span>Projects</span></div><div><strong>∞</strong><span>Curiosity</span></div></div>
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
            {PROJECTS.map((p, i) => (
              <article className="glass-panel project-card" key={p.id} onClick={() => setSelectedProject(p.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedProject(p.id); } }} role="button" tabIndex={0} aria-label={"Open case study: " + p.title}>
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
          
          <ResumePreview />
        </motion.section>

        <motion.section className="section" id="contact" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          <div className="section-label">06 — CONTACT</div>
          <div className="glass-panel contact-box">
            <div className="contact-grid">
              <div><span className="eyebrow">LET'S CONNECT</span><h2>Have an idea?<br /><span className="gradient-text">Let's build it.</span></h2><p>I'm interested in projects, collaboration and opportunities related to software, AI and technology.</p><div className="contact-direct" style={{marginTop: '30px'}}><span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Prefer email?</span><a href="mailto:abdulsalam024.main@gmail.com" style={{color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none'}}>abdulsalam024.main@gmail.com</a></div></div>
              <ContactCenter />
            </div>
          </div>
        </motion.section>

        <ErrorBoundary fallbackTitle="Case study failed to render">
          <ProjectCaseStudies projectId={selectedProject} onClose={() => setSelectedProject(null)} />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Timeline failed to render">
          <Suspense fallback={<SectionFallback label="Loading timeline" />}><EngineeringTimeline onOpenProject={setSelectedProject} /></Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Dashboard failed to render">
          <EngineeringDashboard projectCount={4} repos={github.data && github.data.profile ? github.data.profile.publicRepos : '-'} followers={github.data && github.data.profile ? github.data.profile.followers : '-'} status={dashboardStatus(github)} />
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="AI Lab failed to render">
          <Suspense fallback={<SectionFallback label="Loading AI Lab" />}><AILab /></Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="GitHub section failed to render">
          <Suspense fallback={<SectionFallback label="Loading GitHub" />}><GitHubActivity github={github} /></Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallbackTitle="Engineering journal failed to render">
          <Suspense fallback={<SectionFallback label="Loading journal" />}><EngineeringJournal /></Suspense>
        </ErrorBoundary>
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
