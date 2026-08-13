import { CONTACT, wa } from "@/lib/kiosk";

const LINKS = [
  { small: "WhatsApp", big: CONTACT.phone, href: wa() },
  { small: "Phone", big: CONTACT.phone2, href: `tel:+${CONTACT.phone2Intl}` },
  { small: "Email", big: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { small: "Instagram", big: CONTACT.instagramHandle, href: CONTACT.instagram },
  { small: "Studio", big: CONTACT.studio, href: CONTACT.maps },
];

/** Closing CTA. */
export default function Contact() {
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
            href={wa("Hi Kiosk — I'd like to start a project.")}
            target="_blank"
            rel="noopener"
          >
            Start a project
          </a>
        </div>
      </div>

      <div className="c-links">
        {LINKS.map((l) => (
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
