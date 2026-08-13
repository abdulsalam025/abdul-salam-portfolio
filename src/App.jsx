import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Mail,
  Moon,
  Sun,
  Code2,
  BrainCircuit,
  Sparkles,
  GitBranch,
  BriefcaseBusiness,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import profilePhoto from "./assets/profile-optimized.webp";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://abdul-salam-portfolio.onrender.com";
const scrollReveal = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scrollRevealLeft = {
  hidden: {
    opacity: 0,
    x: -35,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const scrollRevealRight = {
  hidden: {
    opacity: 0,
    x: 35,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const revealViewport = {
  once: true,
  amount: 0.18,
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSending, setContactSending] = useState(false);

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setContactSending(true);
    setContactStatus("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send message.");
      }

      setContactStatus("Message sent successfully.");
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      setContactStatus(
        "Unable to send the message right now. Please try again."
      );
    } finally {
      setContactSending(false);
    }
  };
  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <span>AS</span>
        </div>

        <nav className={mobileMenuOpen ? "mobile-nav mobile-open" : "mobile-nav"}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#resume" onClick={() => setMobileMenuOpen(false)}>Resume</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      {/* HERO */}
      <main className={mobileMenuOpen ? "mobile-menu-active" : ""}>
        <section className="hero" id="home">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="availability">
              <span></span>
              Available for opportunities
            </div>

            <p className="eyebrow">AI & ML ENGINEERING STUDENT</p>

            <h1>
              Hi, I'm <span>Abdul Salam.</span>
              <br />
              I build things with <em>intelligence.</em>
            </h1>

            <p className="hero-description">
              Engineering student focused on Artificial Intelligence,
              Machine Learning and software development. I turn ideas into
              practical digital solutions.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="primary-button">
                Explore My Work
                <ArrowRight size={18} />
              </a>

              <a href="#contact" className="secondary-button">
                Contact Me
              </a>
            </div>

            <div className="social-links">
              <a href="https://github.com/abdulsalam025" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <GitBranch size={20} />
              </a>
              <a href="https://www.linkedin.com/in/abdul-salam-ai025/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <BriefcaseBusiness size={20} />
              </a>
              <a href="mailto:abdulsalam024.main@gmail.com" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </motion.div>

          {/* HERO VISUAL */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="profile-core">
              <img src={profilePhoto} alt="Abdul Salam" />
              <div className="profile-glow"></div>
            </div>
            <div className="floating-card card-one">
              <Code2 size={18} />
              <span>Software</span>
            </div>

            <div className="floating-card card-two">
              <Sparkles size={18} />
              <span>AI / ML</span>
            </div>
          </motion.div>

          <a href="#about" className="scroll-indicator">
            <span>Scroll to explore</span>
            <ArrowDown size={16} />
          </a>
        </section>

        {/* ABOUT */}
        <motion.section className="section about-section" id="about" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">01 — ABOUT ME</div>

          <div className="section-grid">
            <div>
              <p className="eyebrow">WHO I AM</p>

              <h2>
                Building my path in
                <span> AI & technology.</span>
              </h2>
            </div>

            <div className="about-text">
              <p>
                I'm Abdul Salam, an Artificial Intelligence and Machine Learning
                engineering student with a strong interest in software development,
                intelligent systems and practical problem solving.
              </p>

              <p>
                I enjoy turning ideas into working projects and continuously
                improving my programming, development and engineering skills.
                My current focus is building a strong foundation in Python,
                software engineering and AI/ML.
              </p>

              <p>
                My long-term goal is to become a technically strong engineer who
                can build reliable products and solve meaningful real-world
                problems with technology.
              </p>

              <div className="stats">
                <div>
                  <strong>01+</strong>
                  <span>Years Learning</span>
                </div>

                <div>
                  <strong>05+</strong>
                  <span>Projects</span>
                </div>

                <div>
                  <strong>∞</strong>
                  <span>Curiosity</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="section education-section" id="education" variants={scrollRevealLeft} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">02 — EDUCATION</div>

          <div className="section-heading">
            <h2>
              My academic <span>journey.</span>
            </h2>

            <p>
              Building a strong engineering foundation through academics,
              programming and hands-on projects.
            </p>
          </div>

          <div className="education-card">
            <div className="education-year">
              <span>2025</span>
              <div className="timeline-dot"></div>
            </div>

            <div className="education-content">
              <p className="project-type">UNDERGRADUATE ENGINEERING</p>

              <h3>
                Bachelor of Engineering — Artificial Intelligence & Machine Learning
              </h3>

              <p className="education-institution">
                BMS College of Engineering
              </p>

              <p className="education-description">
                Developing foundations in programming, artificial intelligence,
                machine learning, mathematics, engineering and software development
                through coursework and practical projects.
              </p>

              <div className="tags">
                <span>AI & ML</span>
                <span>Programming</span>
                <span>Engineering</span>
                <span>Software Development</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SKILLS */}
        <motion.section className="section" id="skills" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">03 — SKILLS</div>

          <div className="section-heading">
            <h2>
              My technical <span>toolbox.</span>
            </h2>
            <p>
              Technologies and concepts I use while building projects and
              improving my engineering skills.
            </p>
          </div>

          <div className="skills-grid">
            {[
              ["Python", "Programming"],
              ["C", "Programming"],
              ["JavaScript", "Web"],
              ["React", "Frontend"],
              ["HTML & CSS", "Web"],
              ["Git & GitHub", "Development"],
              ["AI / ML", "Artificial Intelligence"],
              ["Node.js", "Backend"],
            ].map(([name, category], index) => (
              <motion.div
                className="skill-card"
                key={name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PROJECTS */}
        <motion.section className="section" id="projects" variants={scrollRevealRight} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">04 — PROJECTS</div>

          <div className="section-heading">
            <h2>
              Things I've <span>built.</span>
            </h2>

            <p>
              A selection of projects that demonstrate my development and
              problem-solving skills.
            </p>
          </div>

          <div className="projects-grid">

            {/* PROJECT 01 */}
            <article
              className="project-card featured"
              onClick={() => setSelectedProject("sports")}
            >
              <div className="project-number">01</div>

              <div>
                <p className="project-type">DESIGN THINKING / WEB</p>

                <h3>Community Sports Equipment Library</h3>

                <p>
                  A platform designed to connect students, institutions and
                  organizations with reusable sports equipment.
                </p>

                <div className="tags">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>JavaScript</span>
                </div>
              </div>

              <ArrowRight className="project-arrow" />
            </article>

            {/* PROJECT 02 */}
            <article
              className="project-card"
              onClick={() => setSelectedProject("flight")}
            >
              <div className="project-number">02</div>

              <div>
                <p className="project-type">PYTHON / SOFTWARE</p>

                <h3>Flight Reservation System</h3>

                <p>
                  A reservation system focused on flight search, passenger
                  information and booking workflows.
                </p>

                <div className="tags">
                  <span>Python</span>
                  <span>Logic</span>
                </div>
              </div>

              <ArrowRight className="project-arrow" />
            </article>

            {/* PROJECT 03 */}
            <article
              className="project-card"
              onClick={() => setSelectedProject("jarvis")}
            >
              <div className="project-number">03</div>

              <div>
                <p className="project-type">AI / PERSONAL ASSISTANT</p>

                <h3>Jarvis</h3>

                <p>
                  An AI-powered personal assistant project designed to interact
                  with the user and perform useful tasks through intelligent
                  automation.
                </p>

                <div className="tags">
                  <span>Python</span>
                  <span>AI</span>
                </div>
              </div>

              <ArrowRight className="project-arrow" />
            </article>

            {/* PROJECT 04 */}
            <article
              className="project-card"
              onClick={() => setSelectedProject("water")}
            >
              <div className="project-number">04</div>

              <div>
                <p className="project-type">FULL STACK / WEB</p>

                <h3>Water Delivery System</h3>

                <p>
                  A web-based water delivery platform designed to manage
                  customers, water orders and delivery workflows.
                </p>

                <div className="tags">
                  <span>React</span>
                  <span>Node.js</span>
                  <span>Express</span>
                </div>
              </div>

              <ArrowRight className="project-arrow" />
            </article>

          </div>
        </motion.section>

        {/* RESUME */}
        <motion.section className="section resume-section" id="resume" variants={scrollRevealLeft} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">05 — RESUME</div>

          <div className="section-heading">
            <div>
              <h2>
                My professional <span>profile.</span>
              </h2>
            </div>

            <p>
              A concise overview of my education, technical skills, projects
              and engineering goals.
            </p>
          </div>

          <div className="resume-grid">
            <div className="resume-card">
              <span className="resume-card-label">EDUCATION</span>
              <h3>Bachelor of Engineering</h3>
              <p>
                Artificial Intelligence & Machine Learning
              </p>
              <span className="resume-meta">
                BMS College of Engineering
              </span>
            </div>

            <div className="resume-card">
              <span className="resume-card-label">TECHNICAL SKILLS</span>
              <h3>Engineering Toolkit</h3>
              <p>
                Python, C, JavaScript, React, HTML & CSS, Git & GitHub,
                AI / ML and Node.js.
              </p>
            </div>

            <div className="resume-card">
              <span className="resume-card-label">SELECTED PROJECTS</span>
              <h3>Hands-on Development</h3>
              <p>
                Community Sports Equipment Library, Flight Reservation System
                and Jarvis.
              </p>
            </div>

            <div className="resume-card">
              <span className="resume-card-label">CAREER OBJECTIVE</span>
              <h3>Building Intelligent Systems</h3>
              <p>
                Developing strong foundations in software engineering,
                artificial intelligence and machine learning while solving
                meaningful real-world problems.
              </p>
            </div>
          </div>

          <div className="resume-actions">
            <a
              href="/Abdul_Salam_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
            >
              View Resume
              <ArrowRight size={18} />
            </a>

            <a
              href="/Abdul_Salam_Resume.pdf"
              download="Abdul_Salam_Resume.pdf"
              className="secondary-button"
            >
              Download Resume
              <ArrowDown size={18} />
            </a>
          </div>
        </motion.section>
        {/* CONTACT */}
        <motion.section className="section contact-section" id="contact" variants={scrollReveal} initial="hidden" whileInView="visible" viewport={revealViewport}>
          <div className="section-label">05 — CONTACT</div>

          <div className="contact-box contact-form-box">
            <div className="contact-intro">
              <p className="eyebrow">LET'S CONNECT</p>

              <h2>
                Have an idea?
                <br />
                <span>Let's build it.</span>
              </h2>

              <p>
                I'm interested in projects, collaboration and opportunities
                related to software, AI and technology.
              </p>

              <div className="contact-direct">
                <span>Prefer email?</span>
                <a href="mailto:abdulsalam024.main@gmail.com">
                  abdulsalam024.main@gmail.com
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-form-row">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label>
                <span>Subject</span>
                <input
                  type="text"
                  name="subject"
                  placeholder="What would you like to discuss?"
                  required
                />
              </label>

              <label>
                <span>Message</span>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell me about your idea, project or opportunity..."
                  required
                ></textarea>
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={contactSending}
              >
                {contactSending ? "Sending..." : "Send Message"}
                <Mail size={18} />
              </button>

              {contactStatus && (
                <p className="contact-status" role="status">
                  {contactStatus}
                </p>
              )}
            </form>
          </div>
        </motion.section>

        {selectedProject && (
  <div
    className="project-modal-overlay"
    onClick={() => setSelectedProject(null)}
  >
    <motion.div
      className="project-modal"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setSelectedProject(null)}
        aria-label="Close project"
      >
        ×
      </button>

      {selectedProject === "sports" && (
        <>
          <p className="project-type">DESIGN THINKING / WEB</p>

          <h2>Community Sports Equipment Library</h2>

          <p className="modal-description">
            A platform designed to connect students, institutions and
            organizations with reusable sports equipment.
          </p>

          <div className="modal-section">
            <h4>Technologies</h4>

            <div className="tags">
              <span>HTML</span>
              <span>CSS</span>
              <span>JavaScript</span>
            </div>
          </div>

          <div className="modal-section">
            <h4>Key Features</h4>

            <ul>
              <li>Sports equipment discovery</li>
              <li>Student-oriented interface</li>
              <li>Equipment sharing concept</li>
              <li>Responsive web design</li>
            </ul>
          </div>
        </>
      )}

      {selectedProject === "flight" && (
        <>
          <p className="project-type">PYTHON / SOFTWARE</p>

          <h2>Flight Reservation System</h2>

          <p className="modal-description">
            A reservation system focused on flight search, passenger
            information and booking workflows.
          </p>

          <div className="modal-section">
            <h4>Technologies</h4>

            <div className="tags">
              <span>Python</span>
              <span>Programming Logic</span>
            </div>
          </div>

          <div className="modal-section">
            <h4>Key Features</h4>

            <ul>
              <li>Flight search</li>
              <li>Passenger information</li>
              <li>Reservation workflow</li>
              <li>Structured interface</li>
            </ul>
          </div>
        </>
      )}

      {selectedProject === "jarvis" && (
        <>
          <div className="modal-project-header">
            <div>
              <p className="project-type">AI / PERSONAL ASSISTANT</p>
              <h2>Jarvis</h2>
            </div>

            <span className="modal-status">
              <span></span>
              Personal Project
            </span>
          </div>

          <p className="modal-description">
            Jarvis is a personal assistant project focused on creating
            an intelligent interface between the user and useful digital
            tasks.
          </p>

          <div className="modal-divider"></div>

          <div className="modal-project-grid">

            <div className="modal-info-card">
              <span className="info-number">01</span>
              <h4>Project Focus</h4>
              <p>
                Artificial Intelligence, automation and personal
                assistant interaction.
              </p>
            </div>

            <div className="modal-info-card">
              <span className="info-number">02</span>
              <h4>Development</h4>
              <p>
                A practical project exploring intelligent software and
                automation workflows.
              </p>
            </div>

            <div className="modal-info-card">
              <span className="info-number">03</span>
              <h4>Goal</h4>
              <p>
                Build an assistant experience that can be extended with
                additional intelligent capabilities.
              </p>
            </div>

          </div>

          <div className="modal-section">
            <div className="modal-section-title">
              <span>TECH STACK</span>
            </div>

            <div className="tech-stack">

              <div className="tech-item">
                <strong>∞</strong>
                <span>Core Development</span>
              </div>

              <div className="tech-item">
                <strong>∞</strong>
                <span>Intelligent Systems</span>
              </div>

              <div className="tech-item">
                <strong>∞</strong>
                <span>Task Handling</span>
              </div>

            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-title">
              <span>KEY FEATURES</span>
            </div>

            <div className="feature-list">

              <div className="feature-item">
                <span>01</span>
                <p>Personal assistant interaction</p>
              </div>

              <div className="feature-item">
                <span>02</span>
                <p>Intelligent task handling</p>
              </div>

              <div className="feature-item">
                <span>03</span>
                <p>Automation-oriented workflow</p>
              </div>

              <div className="feature-item">
                <span>04</span>
                <p>Expandable AI architecture</p>
              </div>

            </div>
          </div>

      {selectedProject === "water" && (
        <>
          <p className="project-type">FULL STACK / WEB</p>

          <h2>Water Delivery System</h2>

          <p className="modal-description">
            A web-based water delivery platform designed to simplify customer
            orders, delivery management and water-service workflows.
          </p>

          <div className="modal-section">
            <h4>Technologies</h4>

            <div className="tags">
              <span>React</span>
              <span>Node.js</span>
              <span>Express</span>
            </div>
          </div>

          <div className="modal-section">
            <h4>Key Features</h4>

            <ul>
              <li>Customer-oriented ordering interface</li>
              <li>Water delivery workflow management</li>
              <li>Frontend and backend architecture</li>
              <li>Responsive web application</li>
            </ul>
          </div>
        </>
      )}
          <div className="modal-footer">
            <div>
              <span className="modal-footer-label">
                PROJECT
              </span>

              <strong>∞</strong>
            </div>

            <a
              href="#"
              className="modal-github-button"
              onClick={(event) => event.preventDefault()}
            >
              View GitHub
              <ArrowRight size={17} />
            </a>
          </div>
        </>
      )}

    </motion.div>
  </div>
)}
      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <strong>∞</strong>
          <span>Abdul Salam</span>
        </div>

        <p>© 2026 Abdul Salam. Built with React.</p>

        <div className="footer-socials">
          <a
            href="https://github.com/abdulsalam025"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitBranch size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/abdul-salam-ai025/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <BriefcaseBusiness size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

