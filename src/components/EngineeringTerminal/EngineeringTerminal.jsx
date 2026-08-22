import React, { useState, useRef, useEffect } from 'react';
import './EngineeringTerminal.css';

export default function EngineeringTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const PROMPT = "abdul@portfolio:~$";
  const AVAILABLE_COMMANDS = ["help", "about", "skills", "projects", "ai", "github", "education", "contact", "status", "clear", "h", "p", "s", "a"];

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const commandOutputs = {
    help: () => (
      <div className="et-anim-reveal">
        <p className="et-dim">Available commands:</p>
        <div className="et-grid">
          <div><span className="et-cyan">about</span><span className="et-dim">About Abdul Salam</span></div>
          <div><span className="et-cyan">skills</span><span className="et-dim">Technical toolkit</span></div>
          <div><span className="et-cyan">projects</span><span className="et-dim">Selected projects</span></div>
          <div><span className="et-cyan">ai</span><span className="et-dim">AI / ML focus</span></div>
          <div><span className="et-cyan">github</span><span className="et-dim">GitHub activity</span></div>
          <div><span className="et-cyan">education</span><span className="et-dim">Education</span></div>
          <div><span className="et-cyan">contact</span><span className="et-dim">Contact information</span></div>
          <div><span className="et-cyan">status</span><span className="et-dim">Portfolio system status</span></div>
          <div><span className="et-cyan">clear</span><span className="et-dim">Clear terminal</span></div>
        </div>
      </div>
    ),
    about: () => <p className="et-anim-reveal">Abdul Salam. Engineering student at BMSCE focused on building intelligent systems, optimizing software architecture, and solving complex problems with code.</p>,
    skills: () => (
      <div className="et-anim-reveal et-card">
        <p className="et-cyan et-bold">SKILLS</p>
        <p>Python • C • JavaScript • React • HTML • CSS</p>
        <p>AI / ML • Git • GitHub • Node.js</p>
      </div>
    ),
    projects: () => (
      <div className="et-anim-reveal et-card">
        <p className="et-cyan et-bold">PROJECTS</p>
        <p>01 Community Sports Equipment Library</p>
        <p>02 Flight Reservation System</p>
        <p>03 Jarvis</p>
        <p>04 Water Delivery System</p>
      </div>
    ),
    ai: () => <p className="et-anim-reveal">Focused on Artificial Intelligence and Machine Learning architecture. Applying advanced mathematics, calculus, and data science principles to develop scalable neural networks and analytical models.</p>,
    github: () => <p className="et-anim-reveal">Fetching GitHub profile... <br/><span className="et-cyan">Status:</span> PUBLIC PROFILE<br/>View full activity in the GitHub section below.</p>,
    education: () => (
      <div className="et-anim-reveal et-card">
        <p className="et-cyan et-bold">EDUCATION</p>
        <p>BMS College of Engineering</p>
        <p className="et-dim">Bachelor of Engineering — AI & Machine Learning</p>
      </div>
    ),
    contact: () => <p className="et-anim-reveal">Available for collaborations. Please use the Contact form at the bottom of the portfolio to establish a secure transmission.</p>,
    status: () => (
      <div className="et-anim-reveal et-grid-status">
        <div><span className="et-dim">PORTFOLIO SYSTEM</span><span className="et-cyan">ONLINE</span></div>
        <div><span className="et-dim">FRONTEND</span><span className="et-cyan">READY</span></div>
        <div><span className="et-dim">AI LAB</span><span className="et-cyan">READY</span></div>
        <div><span className="et-dim">GITHUB</span><span className="et-cyan">PUBLIC PROFILE</span></div>
        <div><span className="et-dim">PROJECTS</span><span className="et-cyan">AVAILABLE</span></div>
      </div>
    ),
    // Aliases
    h: () => commandOutputs.help(),
    a: () => commandOutputs.about(),
    s: () => commandOutputs.skills(),
    p: () => commandOutputs.projects()
  };

  const processCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    const output = commandOutputs[trimmed.toLowerCase()] 
      ? commandOutputs[trimmed.toLowerCase()]() 
      : <p className="et-anim-reveal">Command not found: <span className="et-error">{trimmed}</span>. Type "help" to see available commands.</p>;

    setHistory(prev => [...prev, { type: 'input', text: trimmed }, { type: 'output', content: output }]);
  };

  const executeCommand = (cmdStr) => {
    if (cmdStr.trim()) {
      setCommandHistory(prev => [...prev, cmdStr.trim()]);
      setHistoryIndex(-1);
    }
    processCommand(cmdStr);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') return; // Protect global Ctrl+K
    
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = AVAILABLE_COMMANDS.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <section id="engineering-console" className="et-section">
      <div className="et-container">
        
        {/* Section Header */}
        <div className="et-section-header">
          <span className="et-eyebrow">04 / ENGINEERING CONSOLE</span>
          <h2 className="et-heading">Inside the Build.</h2>
          <p className="et-subtext">A small interactive window into how I approach engineering problems.</p>
        </div>

        {/* Liquid Glass Terminal Window */}
        <div className="et-terminal-glass" onClick={() => inputRef.current?.focus()}>
          
          {/* Chrome / Top Bar */}
          <div className="et-chrome">
            <div className="et-chrome-dots">
              <span className="et-dot red"></span>
              <span className="et-dot yellow"></span>
              <span className="et-dot green"></span>
            </div>
            <div className="et-chrome-title">ABDUL-SALAM / ENGINEERING-CONSOLE</div>
            <div className="et-chrome-status"><span className="et-pulse"></span> ONLINE</div>
          </div>

          {/* Terminal Output Area */}
          <div className="et-body">
            {history.map((item, idx) => (
              <div key={idx} className="et-history-item">
                {item.type === 'input' && (
                  <div className="et-input-line">
                    <span className="et-prompt">{PROMPT}</span>
                    <span className="et-past-input">{item.text}</span>
                  </div>
                )}
                {item.type === 'output' && (
                  <div className="et-output-block">{item.content}</div>
                )}
              </div>
            ))}
            
            {/* Active Input Line */}
            <div className="et-active-line">
              <span className="et-prompt">{PROMPT}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="et-input"
                spellCheck="false"
                autoComplete="off"
                aria-label="Engineering terminal input"
              />
              <span className="et-cursor"></span>
            </div>
            <div ref={endRef} />
          </div>
        </div>

        {/* Interactive Command Hints */}
        <div className="et-hints-row">
          <span className="et-dim">Try:</span>
          {['help', 'projects', 'skills', 'ai', 'github'].map(cmd => (
            <button key={cmd} className="et-hint-btn" onClick={() => executeCommand(cmd)}>{cmd}</button>
          ))}
        </div>

        {/* Engineering Status Strip */}
        <div className="et-status-strip">
          <div className="et-strip-item">
            <span className="et-dim">SYSTEM</span> <span className="et-cyan">ONLINE</span>
          </div>
          <div className="et-strip-item">
            <span className="et-dim">REACT</span> <span className="et-cyan">ACTIVE</span>
          </div>
          <div className="et-strip-item">
            <span className="et-dim">VITE</span> <span className="et-cyan">ACTIVE</span>
          </div>
          <div className="et-strip-item">
            <span className="et-dim">COMPONENTS</span> <span className="et-cyan">MODULAR</span>
          </div>
          <div className="et-strip-item">
            <span className="et-dim">UI</span> <span className="et-cyan">RESPONSIVE</span>
          </div>
        </div>

      </div>
      
      {/* Subtle Ambient Glow */}
      <div className="et-ambient-cyan"></div>
      <div className="et-ambient-violet"></div>
    </section>
  );
}
