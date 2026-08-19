export default function SectionFallback({ label = "Loading section" }) {
  return (
    <section className="section" aria-busy="true">
      <div className="glass-panel" style={{ padding: "20px 18px" }}>{label}...</div>
    </section>
  );
}