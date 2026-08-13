import { Fragment } from "react";
import Glow from "./Glow";

const LEAD = "Born on the production floor. Built for the";
const ACCENT = "full funnel.";

/**
 * Positioning statement. The headline is split into words here rather than by
 * script: the reveal then only animates nodes it did not create, so a second
 * effect run can never leave the words half-set and clipped.
 */
export default function Manifesto() {
  const words = [
    ...LEAD.split(" ").map((t) => ({ t, accent: false })),
    ...ACCENT.split(" ").map((t) => ({ t, accent: true })),
  ];

  return (
    <section id="manifesto">
      <Glow intensity={0.28} />
      <p className="rv mani-sys">
        We don&apos;t sell services. <em>We build systems.</em>
      </p>
      <h2 className="display" id="mani">
        {words.map((w, i) => (
          <Fragment key={`${w.t}-${i}`}>
            <span className="w">
              <span style={w.accent ? { color: "var(--accent)" } : undefined}>
                {w.t}
              </span>
            </span>{" "}
          </Fragment>
        ))}
      </h2>
    </section>
  );
}
