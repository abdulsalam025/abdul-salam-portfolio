export default function EngineeringHub({ children }) {
  return (
    <section className="section engineering-hub" id="engineering" aria-labelledby="engineering-heading">
      <div className="section-label">06 — ENGINEERING</div>
      <div className="section-heading">
        <h2 id="engineering-heading">
          One <span className="gradient-text">engineering story.</span>
        </h2>
        <p>Profile, lab, journey and roadmap — grouped here so they do not compete with Who I am and What I built.</p>
      </div>
      <nav className="eng-subnav" aria-label="Engineering areas">
        <a href="#dashboard">Profile</a>
        <a href="#ailab">Lab</a>
        <a href="#timeline">Journey</a>
        <a href="#roadmap">Roadmap</a>
      </nav>
      {children}
    </section>
  );
}