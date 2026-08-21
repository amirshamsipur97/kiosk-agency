/**
 * The CMS behind /studio.
 *
 * The site ships with its content compiled in (src/lib/kiosk.ts) so the first
 * paint is instant and the pages still work if the database is unreachable.
 * On mount the live rows are fetched and, if any exist, they replace the
 * compiled defaults. That is what lets the site be hosted as static files and
 * still be edited without a rebuild.
 */

import { createClient } from "@supabase/supabase-js";
import { CONTACT, FILMS, JOURNAL, SERVICES } from "./kiosk";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const cmsReady = Boolean(URL && KEY);

/** One client for the whole tab. Sessions persist so /studio stays signed in. */
export const supabase = cmsReady
  ? createClient(URL, KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

/* ------------------------------------------------------------------ types */

export type Film = {
  id?: string;
  sort: number;
  title: string;
  meta: string;
  href: string;
  cursor: string;
  img: string;
  published?: boolean;
};

export type Service = {
  id?: string;
  sort: number;
  title: string;
  body: string;
  img: string;
  published?: boolean;
};

export type Post = {
  id?: string;
  sort: number;
  title: string;
  body: string;
  img: string;
  href?: string | null;
  date?: string | null;
  published?: boolean;
};

export type Settings = {
  phone: string;
  phone_intl: string;
  phone2: string;
  phone2_intl: string;
  email: string;
  instagram: string;
  instagram_handle: string;
  maps: string;
  studio: string;
};

export type Content = {
  films: Film[];
  services: Service[];
  posts: Post[];
  settings: Settings;
};

/* --------------------------------------------------------------- defaults */

/** What the site renders before the database answers, and if it never does. */
export const DEFAULT_CONTENT: Content = {
  films: FILMS.map((f, i) => ({
    sort: i + 1,
    title: f.title,
    meta: f.meta,
    href: f.href,
    cursor: f.cursor,
    img: f.img,
  })),
  services: SERVICES.map((s, i) => ({
    sort: i + 1,
    title: s.title,
    body: s.body,
    img: s.img,
  })),
  posts: JOURNAL.map((j, i) => ({
    sort: i + 1,
    title: j.title,
    body: j.body,
    img: j.img,
    href: j.href ?? null,
    date: j.date ?? null,
  })),
  settings: {
    phone: CONTACT.phone,
    phone_intl: CONTACT.phoneIntl,
    phone2: CONTACT.phone2,
    phone2_intl: CONTACT.phone2Intl,
    email: CONTACT.email,
    instagram: CONTACT.instagram,
    instagram_handle: CONTACT.instagramHandle,
    maps: CONTACT.maps,
    studio: CONTACT.studio,
  },
};

/* ---------------------------------------------------------------- reading */

/**
 * Fetch everything in one round trip. A table that comes back empty keeps its
 * compiled default rather than emptying a section of the site, which is the
 * behaviour you want if a delete goes wrong.
 */
export async function fetchContent(): Promise<Content> {
  if (!supabase) return DEFAULT_CONTENT;
  try {
    const [films, services, posts, settings] = await Promise.all([
      supabase
        .from("cms_films")
        .select("*")
        .eq("published", true)
        .order("sort"),
      supabase
        .from("cms_services")
        .select("*")
        .eq("published", true)
        .order("sort"),
      supabase
        .from("cms_posts")
        .select("*")
        .eq("published", true)
        .order("sort"),
      supabase.from("cms_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    return {
      films: films.data?.length
        ? (films.data as Film[])
        : DEFAULT_CONTENT.films,
      services: services.data?.length
        ? (services.data as Service[])
        : DEFAULT_CONTENT.services,
      posts: posts.data?.length
        ? (posts.data as Post[])
        : DEFAULT_CONTENT.posts,
      settings: (settings.data as Settings) || DEFAULT_CONTENT.settings,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

/** Everything the panel sees, drafts included. */
export async function fetchAll(table: string) {
  if (!supabase) return [];
  const { data, error } = await supabase.from(table).select("*").order("sort");
  if (error) throw error;
  return data || [];
}

/* --------------------------------------------------------------- deriving */

/** `/01`, `/02`, … from a row's position. The site shows these, not the sort. */
export const idxOf = (i: number) => "/" + String(i + 1).padStart(2, "0");

/** A WhatsApp deep link built from whatever number is currently configured. */
export const waFor = (s: Settings, text?: string) =>
  `https://api.whatsapp.com/send?phone=${s.phone_intl}` +
  (text ? `&text=${encodeURIComponent(text)}` : "");
