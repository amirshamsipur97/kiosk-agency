"use client";

import { waFor } from "@/lib/cms";
import { useContent } from "./Content";

/** Closing CTA. Every number, address and handle comes from the panel. */
export default function Contact() {
  const { settings } = useContent();
  const links = [
    { small: "WhatsApp", big: settings.phone, href: waFor(settings) },
    {
      small: "Phone",
      big: settings.phone2,
      href: `tel:+${settings.phone2_intl}`,
    },
    { small: "Email", big: settings.email, href: `mailto:${settings.email}` },
    {
      small: "Instagram",
      big: settings.instagram_handle,
      href: settings.instagram,
    },
    { small: "Studio", big: settings.studio, href: settings.maps },
  ].filter((l) => l.big);

  return (
    <section id="contact">
      <div className="c-inner">
        <h2 className="display mega">
          <span className="ln">
            <span>Let&apos;s grow</span>
          </span>
          <span className="ln">
            <span>
              <i>your brand.</i>
            </span>
          </span>
        </h2>

        <div className="c-row">
          <p>
            Tell us what you need — scope is tailored to your goals, markets and
            priorities.
          </p>
          <a
            className="cta magnetic"
            id="waCta"
            href={waFor(settings, "Hi Kiosk — I'd like to start a project.")}
            target="_blank"
            rel="noopener"
          >
            Start a project
          </a>
        </div>
      </div>

      <div className="c-links">
        {links.map((l) => (
          <a
            className="c-link"
            key={l.small}
            href={l.href}
            target={l.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener"
          >
            <small>{l.small}</small>
            <b>{l.big}</b>
            <span className="arr">↗</span>
          </a>
        ))}
      </div>

      <footer>
        <span className="f-mark">
          Kiosk<b>.</b>
        </span>
        <span>
          We design. We create. <b>You grow.</b>
        </span>
        <span>© 2026 Kiosk Agency · Muscat, Oman</span>
      </footer>
    </section>
  );
}
