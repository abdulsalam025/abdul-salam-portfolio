import { useEffect, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import "./ResumePreview.css";

const PDF_PATH = "/Abdul_Salam_Resume.pdf";

export default function ResumePreview() {
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch(PDF_PATH, { method: "HEAD", signal: controller.signal })
      .then((response) => setStatus(response.ok ? "ready" : "missing"))
      .catch((error) => { if (error.name !== "AbortError") setStatus("missing"); });
    return () => controller.abort();
  }, []);
  if (status === "loading") {
    return <p className="resume-preview-note">Checking that the resume file is actually published...</p>;
  }
  if (status === "missing") {
    return (
      <div className="glass-panel resume-preview-missing" role="status">
        <FileText size={18} aria-hidden="true" />
        <div>
          <h3>Resume PDF unavailable</h3>
          <p>This build could not find {PDF_PATH}. No fake download is offered.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="resume-preview">
      <div className="resume-actions">
        <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" className="glass-btn primary-button">View resume <ArrowRight size={20} /></a>
        <a href={PDF_PATH} download="Abdul_Salam_Resume.pdf" className="glass-btn secondary-button">Download resume</a>
      </div>
      <iframe className="resume-frame" title="Abdul Salam resume preview" src={PDF_PATH} />
    </div>
  );
}