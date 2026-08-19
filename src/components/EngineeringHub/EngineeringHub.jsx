export default function EngineeringHub({ children }) {
  return (
    <section className="section engineering-hub" id="engineering" aria-labelledby="engineering-heading">
      <div className="section-label">06 - ENGINEERING</div>
      <div className="section-heading">
        <h2 id="engineering-heading">One <span className="gradient-text">engineering story.</span></h2>
        <p>Snapshot, lab, public GitHub, journal and journey - grouped so they do not compete with who I am and what I built.</p>
      </div>
      <nav className="eng-subnav" aria-label="Engineering areas">
        <a href="#dashboard">Profile</a>
        <a href="#ailab">Lab</a>
        <a href="#github">GitHub</a>
        <a href="#buildlog">Log</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#timeline">Journey</a>
        <a href="#notes">Notes</a>
      </nav>
      {children}
    </section>
  );
}