# Putting kioskoman.com on Hostinger

The site is a **static export**. Nothing runs on the server: the pages are
plain files, the content is read from Supabase in the visitor's browser, the
inquiry form posts to Apps Script, and `/studio` signs in against Supabase
Auth. That is why the hosting plan only has to serve files well.

Plan bought: the one with **CDN and daily backups**. Node.js is not needed.

---

## Build

```bash
npm run build:host
```

Writes `out/` and packs it into **`kioskoman-site.zip`**, about 11 MB. One
archive rather than a few thousand files, which is the difference between a
minute and an hour in a File Manager.

The two public values are compiled into that build, so they must be present in
`.env.local` when it runs:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SHEET_ENDPOINT
NEXT_PUBLIC_SHEET_TOKEN
```

If any is missing the site still works, but degraded: without the Supabase
pair `/studio` says it is not configured and the pages fall back to the
content compiled in; without the sheet pair the inquiry form drops back to
WhatsApp only.

## Upload

1. hPanel → **File Manager** → `public_html`.
2. Delete Hostinger's placeholder `index.html` if it is there.
3. Upload `kioskoman-site.zip` and **Extract** it in place.
4. Confirm `public_html/index.html` and `public_html/.htaccess` both exist.
   The File Manager hides dotfiles until you turn on "show hidden files";
   `.htaccess` is not optional, see below.

## Domain and certificate

- hPanel → **Domains** → point `kioskoman.com` at this hosting, and let
  Hostinger issue the SSL certificate. Give DNS an hour.
- The `.htaccess` already forces https and sends the bare domain to `www`, so
  do not add a second redirect in hPanel or the two will fight.
- Set the datacentre to the one nearest Oman (India or the UAE). The CDN
  covers the rest.

---

## What `.htaccess` is doing, and why it matters

It lives in `public/` so every build copies it into `out/`. Without it the site
half works, in a way that is easy to misread as a broken build:

| Rule | What breaks without it |
|---|---|
| `.html` fallback | `/services` returns 404. Only `/services.html` works |
| `.html` → clean URL | both URLs serve the same page and get indexed twice |
| force https | the padlock comes and goes |
| bare → www | the same page is indexed under two hostnames |
| `Cache-Control` on `/_next/*` | the CDN cannot hold anything; every visit re-downloads |
| `Cache-Control: must-revalidate` on HTML | a change made in `/studio` appears to do nothing |
| `ErrorDocument` | a wrong URL shows Hostinger's page, not the site's |

## After it is up

Check these four, in this order. Each one isolates a different failure:

1. `https://www.kioskoman.com` loads, and `http://kioskoman.com` redirects to
   it. → DNS, SSL and the redirects are right.
2. `https://www.kioskoman.com/services` loads **without** `.html`. → the
   rewrite is working, so `.htaccess` was uploaded and mod_rewrite is on.
3. `/studio` signs in and shows the content. → Supabase reached the browser.
4. Send a test inquiry and watch the row land in the sheet. → Apps Script
   reached the browser.

## Publishing a change

Two different things, and only one needs you:

- **Content** (films, services, blog, contact details): edit in `/studio`.
  Live immediately. No build, no upload.
- **Code or design**: `npm run build:host`, then upload and extract the zip
  again. Delete the old `_next` folder first, otherwise stale chunks from the
  previous build pile up.

If uploading by hand becomes tiresome, this can be automated from GitHub with
an FTP deploy action. Ask.

## What was removed to make the export possible

`/api/architect` and the AI consultation panel it served. That panel had not
been on any page since the 2026 rebuild, so nothing on the live site changed.
Its Supabase tables (`kb_*`, `ai_consultation_leads`) are untouched, so the
work is recoverable from git if it is ever wanted back.
