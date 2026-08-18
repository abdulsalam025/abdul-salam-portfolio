import { useRef, useState } from "react";
import { Mail } from "lucide-react";
import "./ContactCenter.css";

const API_URL = import.meta.env.VITE_API_URL || "https://abdul-salam-portfolio.onrender.com";
const EMAIL = "abdulsalam024.main@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data) {
  const errors = {};
  if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_RE.test(data.email.trim())) errors.email = "Enter a valid email address.";
  if (data.subject.trim().length < 2) errors.subject = "Subject must be at least 2 characters.";
  if (data.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
  return errors;
}

function mailtoHref(data) {
  const subject = encodeURIComponent(data.subject || "Portfolio contact");
  const body = encodeURIComponent("From: " + data.name + " <" + data.email + ">\n\n" + data.message);
  return "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
}

export default function ContactCenter() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const lock = useRef(false);
  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (lock.current || sending) return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setResult(null);
    if (Object.keys(nextErrors).length) return;
    lock.current = true;
    setSending(true);
    try {
      const response = await fetch(API_URL + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "Unable to send the message right now.");
      setResult({ type: "success", text: payload.message || "Message sent successfully." });
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setResult({ type: "error", text: error.message || "Unable to send the message right now." });
    } finally {
      setSending(false);
      lock.current = false;
    }
  };
  return (
    <form className="contact-form contact-center" onSubmit={onSubmit} noValidate>
      <div className="contact-form-row">
        <label>
          <span>Name</span>
          <input type="text" name="name" value={values.name} onChange={onChange} autoComplete="name" required />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" value={values.email} onChange={onChange} autoComplete="email" required />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input type="text" name="subject" value={values.subject} onChange={onChange} required />
        {errors.subject && <small className="field-error">{errors.subject}</small>}
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows="5" value={values.message} onChange={onChange} required />
        {errors.message && <small className="field-error">{errors.message}</small>}
      </label>
      <button type="submit" className="glass-btn primary-button" disabled={sending}>
        {sending ? "Sending..." : "Send Message"} <Mail size={20} />
      </button>
      {result && <p className={result.type === "success" ? "contact-result is-ok" : "contact-result is-bad"} role="status">{result.text}</p>}
      {result && result.type === "error" && (
        <a className="contact-fallback" href={mailtoHref(values)}>API did not accept the message. Open email instead.</a>
      )}
    </form>
  );
}