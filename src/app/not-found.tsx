import Link from "next/link";
import "./kiosk.css";

/**
 * The 404. Worth building properly rather than leaving to the framework:
 * this component is serialised into every page's payload, so whatever it
 * imports is carried by the whole site.
 */
export default function NotFound() {
  return (
    <div className="ksite">
      <section id="nf">
        <div className="nf-ghost" aria-hidden>
          404
        </div>
        <div className="nf-in">
          <div className="sec-label">404 — Not here</div>
          <h1 className="display nf-title">
            This page has <i>moved on</i>
          </h1>
          <p>
            The address does not exist, or it did and no longer does. The work
            is all still here, one link away.
          </p>
          <div className="nf-links">
            <Link className="nf-cta" href="/">
              Back to home
            </Link>
            <Link href="/services">Services</Link>
            <Link href="/clients">Clients</Link>
            <Link href="/films">Films</Link>
            <Link href="/on-the-ground">On the ground</Link>
            <Link href="/insights">Blog</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
