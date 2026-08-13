"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CONTACT, SERVICES } from "@/lib/kiosk";

type Props = {
  /** Title of the service the visitor opened the form from, if any. */
  preselect?: string | null;
  onClose: () => void;
};

/**
 * Inquiry dialog. There is no backend on this site, so a completed form is
 * composed into a message and handed to WhatsApp — or to email as a fallback.
 * Nothing is stored or sent anywhere else.
 */
export default function InquiryForm({ preselect, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState<string[]>(preselect ? [preselect] : []);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    // The page behind must not scroll while the dialog is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const toggle = (title: string) =>
    setScope((s) =>
      s.includes(title) ? s.filter((t) => t !== title) : [...s, title],
    );

  const message = () => {
    const lines = ["Hi Kiosk — I'd like to make an inquiry."];
    if (name.trim()) lines.push(`Name: ${name.trim()}`);
    if (phone.trim()) lines.push(`Phone: ${phone.trim()}`);
    if (email.trim()) lines.push(`Email: ${email.trim()}`);
    if (scope.length) lines.push(`Interested in: ${scope.join(", ")}`);
    return lines.join("\n");
  };

  /** Name plus at least one way to reply — anything less is not an inquiry. */
  const validate = () => {
    if (!name.trim()) {
      setError("Please add your name.");
      return false;
    }
    if (!phone.trim() && !email.trim()) {
      setError("Please add a phone number or an email so we can reply.");
      return false;
    }
    setError(null);
    return true;
  };

  const send = () => {
    if (!validate()) return;
    open(
      `https://api.whatsapp.com/send?phone=${CONTACT.phoneIntl}&text=${encodeURIComponent(message())}`,
      "_blank",
      "noopener",
    );
  };

  const mail = () => {
    if (!validate()) return;
    location.href =
      `mailto:${CONTACT.email}?subject=` +
      encodeURIComponent("Inquiry — Kiosk Agency") +
      "&body=" +
      encodeURIComponent(message());
  };

  return (
    <div
      className="iq-wrap"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-t`}
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <div className="iq-panel" ref={panelRef}>
        <button className="iq-x" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="iq-head">
          <h3 className="display" id={`${uid}-t`}>
            Start an <i>inquiry</i>
          </h3>
          <p>Tell us who you are and what you need. We reply within a day.</p>
        </div>

        <div className="iq-scope">
          <span className="iq-label">Scope of work</span>
          <div className="iq-chips">
            {SERVICES.map((s) => (
              <button
                type="button"
                key={s.idx}
                className={`iq-chip${scope.includes(s.title) ? " on" : ""}`}
                aria-pressed={scope.includes(s.title)}
                onClick={() => toggle(s.title)}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <div className="iq-fields">
          <label className="iq-field">
            <span className="iq-label">Name</span>
            <input
              ref={firstRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="iq-field">
            <span className="iq-label">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+968 ····"
              inputMode="tel"
              autoComplete="tel"
            />
          </label>
          <label className="iq-field">
            <span className="iq-label">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              inputMode="email"
              autoComplete="email"
            />
          </label>
        </div>

        {error ? (
          <p className="iq-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="iq-actions">
          <button type="button" className="iq-send" onClick={send}>
            Send via WhatsApp
          </button>
          <button type="button" className="iq-mail" onClick={mail}>
            or email us
          </button>
        </div>
      </div>
    </div>
  );
}
