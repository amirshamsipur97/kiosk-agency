"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cmsReady, supabase } from "@/lib/cms";

type Row = Record<string, unknown> & { id?: string; sort?: number };

type Field = {
  key: string;
  label: string;
  type?: "text" | "area" | "image" | "bool";
  hint?: string;
};

type Section = {
  key: string;
  table: string;
  label: string;
  blurb: string;
  /** A single-row table is a settings form, not a list. */
  single?: boolean;
  fields: Field[];
  /** What a brand new row starts as. */
  blank?: Row;
};

const SECTIONS: Section[] = [
  {
    key: "films",
    table: "cms_films",
    label: "Films",
    blurb:
      "The reel on /films, in this order. Each thumbnail also joins the feed band on the home page.",
    fields: [
      { key: "title", label: "Title" },
      {
        key: "meta",
        label: "Under the title",
        hint: "e.g. Destination film · 156K views",
      },
      { key: "href", label: "Link", hint: "YouTube, Instagram, anywhere" },
      { key: "cursor", label: "Button word", hint: "Watch, Listen, View" },
      { key: "img", label: "Thumbnail", type: "image" },
      { key: "published", label: "Show on the site", type: "bool" },
    ],
    blank: {
      title: "New film",
      meta: "",
      href: "",
      cursor: "Watch",
      img: "",
      published: true,
    },
  },
  {
    key: "services",
    table: "cms_services",
    label: "Services",
    blurb:
      "What we do on the home page and every section of /services. Both read this list, so they can never disagree.",
    fields: [
      { key: "title", label: "Service" },
      { key: "body", label: "Description", type: "area" },
      {
        key: "img",
        label: "Photograph",
        type: "image",
        hint: "Shown on /services",
      },
      { key: "published", label: "Show on the site", type: "bool" },
    ],
    blank: { title: "New service", body: "", img: "", published: true },
  },
  {
    key: "posts",
    table: "cms_posts",
    label: "Blog",
    blurb:
      "The subjects on /insights. Give one a link and a date and its card becomes a published piece.",
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Summary", type: "area" },
      { key: "img", label: "Cover", type: "image" },
      {
        key: "href",
        label: "Link",
        hint: "Leave empty while it is still being written",
      },
      {
        key: "date",
        label: "Date",
        hint: "However you want it to read, e.g. August 2026",
      },
      { key: "published", label: "Show on the site", type: "bool" },
    ],
    blank: {
      title: "New subject",
      body: "",
      img: "",
      href: "",
      date: "",
      published: true,
    },
  },
  {
    key: "settings",
    table: "cms_settings",
    label: "Contact details",
    blurb:
      "Every number, address and handle on the site comes from here: the menu, the closing block, the WhatsApp buttons and the inquiry form.",
    single: true,
    fields: [
      {
        key: "phone",
        label: "WhatsApp number",
        hint: "As people should read it",
      },
      {
        key: "phone_intl",
        label: "WhatsApp, digits only",
        hint: "For the link. 968… with no + or spaces",
      },
      { key: "phone2", label: "Second number" },
      { key: "phone2_intl", label: "Second number, digits only" },
      { key: "email", label: "Email" },
      { key: "instagram", label: "Instagram link" },
      { key: "instagram_handle", label: "Instagram handle" },
      { key: "maps", label: "Map link" },
      { key: "studio", label: "Studio address" },
    ],
  },
];

/**
 * Strip the invisible marks a paste can carry.
 *
 * Copying an address out of a chat window, a PDF or a right-to-left document
 * often brings zero-width and bidi control characters with it. They are never
 * part of an address or a password, they cannot be seen, and the browser then
 * refuses the field with a message that does not mention them.
 */
const clean = (v: string) =>
  v.replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "");

/* ------------------------------------------------------------------- shell */

export default function Studio() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState(SECTIONS[0].key);

  useEffect(() => {
    if (!supabase) {
      // Still async, so the first render is not interrupted by a setState.
      queueMicrotask(() => setChecking(false));
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user.email ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: clean(email).trim(),
      password: clean(password),
    });
    if (error) setAuthError(error.message);
  };

  if (!cmsReady) {
    return (
      <main className="st-gate">
        <p className="st-note">
          The panel is not configured on this build. NEXT_PUBLIC_SUPABASE_URL
          and NEXT_PUBLIC_SUPABASE_ANON_KEY have to be set where the site is
          built.
        </p>
      </main>
    );
  }

  if (checking) return <main className="st-gate" />;

  if (!user) {
    return (
      <main className="st-gate">
        <form className="st-login" onSubmit={signIn}>
          <div className="st-brand">
            Kiosk<i>.</i> <span>Studio</span>
          </div>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(clean(e.target.value).trim())}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(clean(e.target.value))}
              required
            />
          </label>
          {authError ? <p className="st-err">{authError}</p> : null}
          <button type="submit">Sign in</button>
          <Link className="st-home" href="/">
            ← back to the site
          </Link>
        </form>
      </main>
    );
  }

  const section = SECTIONS.find((s) => s.key === tab)!;

  return (
    <main className="st">
      <header className="st-top">
        <div className="st-brand">
          Kiosk<i>.</i> <span>Studio</span>
        </div>
        <nav className="st-tabs">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={s.key === tab ? "on" : undefined}
              onClick={() => setTab(s.key)}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="st-who">
          <span>{user}</span>
          <a href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <button onClick={() => supabase?.auth.signOut()}>Sign out</button>
        </div>
      </header>

      {section.single ? (
        <SettingsEditor key={section.key} section={section} />
      ) : (
        <ListEditor key={section.key} section={section} />
      )}
    </main>
  );
}

/* -------------------------------------------------------------- list editor */

function ListEditor({ section }: { section: Section }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from(section.table)
        .select("*")
        .order("sort");
      if (!alive) return;
      if (error) return setStatus(error.message);
      setRows((data as Row[]) || []);
      setDirty(new Set());
      setStatus("");
    })();
    return () => {
      alive = false;
    };
  }, [section.table]);

  const mark = (id: string) => setDirty((d) => new Set(d).add(id));

  const edit = (id: string, key: string, value: unknown) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
    mark(id);
  };

  const save = async () => {
    if (!supabase) return;
    setStatus("Saving…");
    // Positions are rewritten from the visible order, so a move is just a save.
    const payload = rows.map((r, i) => ({ ...r, sort: i + 1 }));
    const { error } = await supabase.from(section.table).upsert(payload);
    setStatus(error ? error.message : "Saved");
    if (!error) {
      setRows(payload);
      setDirty(new Set());
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const add = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from(section.table)
      .insert({ ...section.blank, sort: rows.length + 1 })
      .select()
      .single();
    if (error) return setStatus(error.message);
    setRows((rs) => [...rs, data as Row]);
  };

  const remove = async (id: string, title: string) => {
    if (!supabase) return;
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const { error } = await supabase.from(section.table).delete().eq("id", id);
    if (error) return setStatus(error.message);
    setRows((rs) => rs.filter((r) => r.id !== id));
  };

  const move = (i: number, by: number) => {
    const j = i + by;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    next.forEach((r) => r.id && mark(r.id as string));
  };

  return (
    <section className="st-body">
      <div className="st-head">
        <div>
          <h1>{section.label}</h1>
          <p>{section.blurb}</p>
        </div>
        <div className="st-actions">
          <span className="st-status">{status}</span>
          <button className="st-ghost" onClick={add}>
            Add
          </button>
          <button
            className="st-save"
            onClick={save}
            disabled={!dirty.size && status !== ""}
          >
            {dirty.size
              ? `Save ${dirty.size} change${dirty.size > 1 ? "s" : ""}`
              : "Save order"}
          </button>
        </div>
      </div>

      <div className="st-rows">
        {rows.map((r, i) => (
          <article className="st-row" key={String(r.id)}>
            <div className="st-row-top">
              <span className="st-n">{String(i + 1).padStart(2, "0")}</span>
              <strong>{String(r.title || "Untitled")}</strong>
              <div className="st-row-tools">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className="st-del"
                  onClick={() => remove(String(r.id), String(r.title))}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="st-fields">
              {section.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={r[f.key]}
                  onChange={(v) => edit(String(r.id), f.key, v)}
                />
              ))}
            </div>
          </article>
        ))}
        {!rows.length && !status ? (
          <p className="st-note">
            Nothing here yet. Add returns the site to its built-in defaults
            until the first row is published.
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- settings editor */

function SettingsEditor({ section }: { section: Section }) {
  const [row, setRow] = useState<Row | null>(null);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from(section.table)
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (!alive) return;
      if (error) return setStatus(error.message);
      setRow((data as Row) || { id: 1 });
      setStatus("");
    })();
    return () => {
      alive = false;
    };
  }, [section.table]);

  const save = async () => {
    if (!supabase || !row) return;
    setStatus("Saving…");
    const { error } = await supabase
      .from(section.table)
      .upsert({ ...row, id: 1 });
    setStatus(error ? error.message : "Saved");
    if (!error) setTimeout(() => setStatus(""), 2000);
  };

  if (!row) return <section className="st-body">{status}</section>;

  return (
    <section className="st-body">
      <div className="st-head">
        <div>
          <h1>{section.label}</h1>
          <p>{section.blurb}</p>
        </div>
        <div className="st-actions">
          <span className="st-status">{status}</span>
          <button className="st-save" onClick={save}>
            Save
          </button>
        </div>
      </div>

      <div className="st-row">
        <div className="st-fields">
          {section.fields.map((f) => (
            <FieldInput
              key={f.key}
              field={f}
              value={row[f.key]}
              onChange={(v) => setRow({ ...row, [f.key]: v })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- one field */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!supabase) return;
    setBusy(true);
    setErr(null);
    // Name it by time and original name so two uploads never collide.
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const path = `${Date.now()}-${safe}`;
    const { error } = await supabase.storage
      .from("cms")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("cms").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
  };

  if (field.type === "bool") {
    return (
      <label className="st-field st-check">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "image") {
    const src = String(value || "");
    return (
      <label className="st-field st-image">
        <span className="st-label">
          {field.label}
          {field.hint ? <i>{field.hint}</i> : null}
        </span>
        <div className="st-image-in">
          <div className="st-thumb">
            {src ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={src} alt="" />
            ) : (
              <span>none</span>
            )}
          </div>
          <div className="st-image-controls">
            <input
              type="text"
              value={src}
              placeholder="/k/feed/… or an uploaded URL"
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            {busy ? <em>Uploading…</em> : null}
            {err ? <em className="st-err">{err}</em> : null}
          </div>
        </div>
      </label>
    );
  }

  return (
    <label className="st-field">
      <span className="st-label">
        {field.label}
        {field.hint ? <i>{field.hint}</i> : null}
      </span>
      {field.type === "area" ? (
        <textarea
          rows={3}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
