import { CLIENTS, wa } from "@/lib/kiosk";

/** Editorial brand index — hover scrambles the name and ghosts it behind. */
export default function Clients() {
  const columns = [CLIENTS.slice(0, 12), CLIENTS.slice(12)];

  return (
    <section id="clients">
      <div className="cl-ghost" aria-hidden>
        <span id="clGhost">Samsung</span>
      </div>

      <div className="cl-inner">
        <div className="sec-label">06 — Delivered for</div>

        <div className="cl-top">
          <h2>
            Brands we&apos;ve
            <br />
            <i>delivered for</i>
          </h2>
          <div className="cl-tally">
            <div>
              <b>
                <span data-count="24">0</span>
              </b>
              <small>Brands</small>
            </div>
            <div>
              <b>
                <span data-count="5">0</span>
              </b>
              <small>Countries</small>
            </div>
            <div>
              <b>
                <span data-count="17">0</span>
              </b>
              <small>Years</small>
            </div>
          </div>
        </div>

        <div className="cl-grid">
          {columns.map((col, c) => (
            <div className="cl-col" key={c}>
              {col.map((client, i) => (
                <div className="cl-row" key={client.name}>
                  <span className="idx">
                    /{String(c * 12 + i + 1).padStart(2, "0")}
                  </span>
                  <span className="nm">{client.name}</span>
                  <span className="sec">{client.sector}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="cl-note">
          <span>
            Produced and delivered by our team across Oman, the UAE and the
            wider GCC.
          </span>
          <a href={wa()} target="_blank" rel="noopener">
            Ask for sector references ↗
          </a>
        </div>
      </div>
    </section>
  );
}
