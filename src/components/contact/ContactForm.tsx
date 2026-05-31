"use client";

import { useState } from "react";

const services = [
  "Website & Digital Systems",
  "Media & Content Production",
  "Growth Marketing",
  "SEO Services",
  "Automation & CRM",
  "Not sure yet",
];

const inputCls =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-paper placeholder:text-fog transition-colors focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend yet — acknowledge locally so the flow is testable.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-accent/40 bg-surface p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl font-bold text-ink">
          ✓
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold">
          Thanks — we&apos;ll be in touch.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-mist">
          Your inquiry has been received. A member of the KIOSK team will reach
          out shortly to schedule your strategy call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-surface p-8 md:p-10"
    >
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-mist">Full name</span>
            <input
              required
              name="name"
              type="text"
              placeholder="Your name"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-mist">Email</span>
            <input
              required
              name="email"
              type="email"
              placeholder="you@company.com"
              className={inputCls}
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-mist">Company</span>
            <input
              name="company"
              type="text"
              placeholder="Company name"
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-mist">
              Service of interest
            </span>
            <select name="service" className={inputCls} defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm text-mist">
            Tell us about your project
          </span>
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Goals, timeline, and anything else we should know…"
            className={`${inputCls} resize-none`}
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:bg-paper hover:shadow-[0_0_40px_-8px_rgba(215,255,62,0.6)]"
        >
          Book A Strategy Call
        </button>
      </div>
    </form>
  );
}
