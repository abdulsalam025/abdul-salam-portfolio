export default function AboutPanel({ repos, followers }) {
  return (
    <div className="glass-panel about-text about-panel">
      <span className="eyebrow">Who I am</span>
      <p>I am Abdul Salam, an Artificial Intelligence and Machine Learning student at BMS College of Engineering. I build practical software, small AI experiments and full-stack applications while I learn the fundamentals properly.</p>
      <span className="eyebrow">Current focus</span>
      <ul className="about-list">
        <li>Artificial Intelligence and Machine Learning</li>
        <li>Programming fundamentals (Python, C, JavaScript)</li>
        <li>Data structures and algorithms</li>
        <li>Software development with React</li>
        <li>Backend development with Node.js / Express</li>
      </ul>
      <span className="eyebrow">How I work</span>
      <ul className="about-list">
        <li>Build before claiming.</li>
        <li>Understand the fundamentals.</li>
        <li>Learn through projects.</li>
        <li>Document problems and solutions.</li>
        <li>Iterate instead of pretending the first version is finished.</li>
      </ul>
      <div className="about-gh">
        <div><strong>{repos}</strong><span>Public repos</span></div>
        <div><strong>{followers}</strong><span>Followers</span></div>
      </div>
      <p className="about-note">GitHub counts come from the public API. If they show as a dash, the request has not succeeded yet.</p>
    </div>
  );
}