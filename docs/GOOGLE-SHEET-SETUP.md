# Lead capture: site → Google Sheet

Every inquiry on kioskoman.com is appended to a Google Sheet by an Apps Script
Web App. The site is built to be served as static files (Hostinger), so there
is no server of ours in the path: the browser posts straight to the script.

Script: [`apps-script/Code.gs`](apps-script/Code.gs)

---

## 1. Make the sheet

1. Create a Google Sheet. Name it something like **KIOSK — Leads**.
2. The tab does not matter; the script creates a tab called `Leads` and writes
   the header row itself the first time it runs.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**. This binds the script to this
   sheet, which is what lets it write without any credentials.
2. Delete whatever is in `Code.gs` and paste the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs).
3. Edit the three settings at the top:
   - `SECRET` — any string. It must match `NEXT_PUBLIC_SHEET_TOKEN` on the site.
   - `NOTIFY` — the address that gets an email per lead, or `''` for none.
   - `SHEET_NAME` — leave as `Leads` unless you want another tab.
4. Save.

## 3. Prove it works before deploying

In the editor, pick the `testAppend` function and **Run**. Google asks for
authorisation the first time: it is your own sheet and your own mail, so
approve it. A test row appears in the sheet. Delete the row afterwards.

## 4. Deploy it

1. **Deploy → New deployment → Web app**.
2. Description: anything. **Execute as: Me.** **Who has access: Anyone.**
3. Deploy, then copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
4. Open that URL in a browser. It should answer with
   `{"ok":true,"service":"KIOSK lead capture",…}`. If it asks you to sign in,
   access is not set to **Anyone** and the site will not be able to post.

> Every time you edit the script you must **Deploy → Manage deployments → edit
> → New version**. Saving alone changes nothing that is live. This is the
> single most common reason a sheet silently stops filling.

## 5. Point the site at it

Add to `.env.local` for local work, and to the build environment on the host:

```
NEXT_PUBLIC_SHEET_ENDPOINT=https://script.google.com/macros/s/AKfy…/exec
NEXT_PUBLIC_SHEET_TOKEN=kiosk-2026
```

Both are `NEXT_PUBLIC_`, so they are compiled into the JavaScript and are
visible to anyone who reads the page source. That is unavoidable for a static
site posting directly, and it is why the token is a bot filter rather than
security. See the note below.

---

## How the request is shaped, and why

The site posts JSON with `Content-Type: text/plain;charset=utf-8`. That looks
wrong and is deliberate: it keeps the request inside the CORS "simple request"
rules, so the browser never sends a preflight `OPTIONS`. Apps Script cannot
answer a preflight, so a normal `application/json` post fails before it ever
reaches the script. `parseBody()` in the script reads `e.postData.contents` and
parses it as JSON.

## What the token does and does not do

`SECRET` ships inside the site's JavaScript. Anyone who views source can read
it. It stops automated scanners posting junk into the sheet; it does not stop a
person who has read the source. If the sheet ever fills with spam, rotate the
value in both places. The honeypot field catches the rest: a hidden input no
human can see, so anything that arrives with it filled is discarded.

## Columns

`Received, Name, Phone, Email, Scope of work, Message, Form, Page, Referrer,
UTM source, UTM medium, UTM campaign, UTM term, UTM content, Language, Screen,
User agent`

`Form` distinguishes submissions when more than one form feeds the same sheet.
Phone numbers are written with a leading apostrophe, otherwise Sheets reads
`+968…` as a formula and shows an error.

Adding a column is safe: add it to `COLUMNS` and to the `values` array in
`appendLead`, in the same position. Existing rows keep their shape.

## If the sheet stops filling

In order of how often it is the cause:

1. The script was edited and saved but not redeployed as a **new version**.
2. The deployment URL changed. A new deployment gets a new URL; the site is
   still posting to the old one.
3. Access was reset to **Only myself**, so the post is answered with a sign-in
   page.
4. The token on the site and in the script no longer match.

Open the deployment URL in a browser first. That single check separates a dead
endpoint from a site that is not calling it.
