/**
 * Lead capture. Every inquiry on the site goes through here.
 *
 * The site is built to be hosted as static files, so there is no server of our
 * own to post to: the browser talks straight to a Google Apps Script Web App,
 * which appends the lead to a sheet. See docs/GOOGLE-SHEET-SETUP.md.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_SHEET_ENDPOINT || "";
const TOKEN = process.env.NEXT_PUBLIC_SHEET_TOKEN || "";

/** Whether lead capture is configured at all. */
export const leadCaptureReady = Boolean(ENDPOINT);

export type Lead = {
  name: string;
  phone?: string;
  email?: string;
  /** Services the visitor ticked, if the form offers them. */
  scope?: string[];
  message?: string;
  /** Which form this came from, so one sheet can serve several. */
  form: string;
  /** Populated by the honeypot input; anything here means a bot filled it. */
  company_website?: string;
};

/** Everything about the visit worth keeping alongside the lead itself. */
function context() {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(location.search);
  return {
    page: location.pathname + location.search,
    referrer: document.referrer,
    utm_source: q.get("utm_source") || "",
    utm_medium: q.get("utm_medium") || "",
    utm_campaign: q.get("utm_campaign") || "",
    utm_term: q.get("utm_term") || "",
    utm_content: q.get("utm_content") || "",
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    userAgent: navigator.userAgent,
  };
}

function payload(lead: Lead) {
  return JSON.stringify({ token: TOKEN, ...lead, ...context() });
}

/**
 * Send a lead and wait for the answer. Resolves false if it did not land, so
 * the caller can offer the visitor another way through rather than pretending.
 */
export async function submitLead(lead: Lead): Promise<boolean> {
  if (!ENDPOINT) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      // text/plain keeps this a "simple" request, so the browser never sends a
      // CORS preflight. Apps Script cannot answer a preflight, so a normal
      // application/json post would fail before it ever arrived.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload(lead),
      redirect: "follow",
    });
    if (!res.ok) return false;
    const out = await res.json().catch(() => null);
    return out ? out.ok !== false : true;
  } catch {
    return false;
  }
}

/**
 * Send a lead without waiting, for the paths that immediately hand the visitor
 * to WhatsApp. `keepalive` lets the request finish after the page is gone, and
 * not awaiting keeps the window.open inside the click, where popup blockers
 * still allow it.
 */
export function submitLeadInBackground(lead: Lead): void {
  if (!ENDPOINT) return;
  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload(lead),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* a lead is never worth breaking the page over */
  }
}
