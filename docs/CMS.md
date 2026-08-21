# The panel

**https://www.kioskoman.com/studio**

Sign in with `info@kioskoman.com`. The password was handed over separately;
change it from the Supabase dashboard under Authentication → Users.

---

## What it edits

| Tab | Feeds |
|---|---|
| **Films** | the reel on `/films`, and every thumbnail also joins the feed band on the home page |
| **Services** | the "What we do" accordion on the home page **and** every section of `/services` |
| **Blog** | the cards on `/insights` |
| **Contact details** | the menu, the closing block, every WhatsApp button and the inquiry form |

Two things follow from that table and are worth saying plainly:

- Adding a **film** puts its thumbnail on the landing page by itself. The feed
  band leads with the films and fills the rest of its rows from the standing
  image library, skipping anything already shown.
- Adding a **service** adds it to both the home page and `/services`. They read
  one list, so they cannot drift apart.

## How a change reaches the site

The site is built to be served as static files, so there is no rebuild in the
loop. Each page ships with its content compiled in and, on load, asks the
database for the live rows and swaps them in. A visitor sees the page complete
on the first frame, then the current content a moment later.

That has one consequence to know about: **a change is live the moment you
save**, but a visitor who already has the page open keeps what they loaded
until they reload.

If the database is unreachable, every page falls back to the content compiled
into the build. The site never renders an empty section.

## Order, drafts and deletes

- The **↑ ↓** buttons reorder. Order is saved with everything else, so press
  Save afterwards.
- **Show on the site** unticked keeps a row in the panel and out of the site.
  Use it for a film that is not public yet.
- **Delete** is permanent. There is no bin.
- If a table is emptied completely the site falls back to its compiled
  defaults rather than showing nothing, which is the behaviour you want if a
  delete goes wrong.

## Images

Each image field takes an upload or a path. Uploads go to Supabase Storage and
come back as a permanent URL. A path like `/k/feed/zunairah.jpg` refers to an
image already shipped with the site.

Uploads are capped at 10 MB and limited to JPEG, PNG, WebP and AVIF. Nothing
resizes them, so put a sensibly sized image in: about 1200px on the long edge
is plenty.

---

## Under it

- Supabase project `tefxdyhmmrmgcywqzbqu`, tables `cms_films`, `cms_services`,
  `cms_posts`, `cms_settings`, `cms_editors`, bucket `cms`.
- Anyone may **read** published rows. Only a row in `cms_editors` may
  **write**, enforced in the database by row level security, not by the panel.
  Deleting the panel would not open the door.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are compiled
  into the site and are meant to be public. The anon key grants exactly what
  the policies above allow and nothing more.
- `/studio` is excluded from `robots.txt` and carries `noindex`.

### Adding another editor

Create the user in the Supabase dashboard, then add them:

```sql
insert into public.cms_editors (user_id, email, name)
select id, email, 'Their name' from auth.users where email = 'them@kioskoman.com';
```

### A trap worth knowing

A user created by hand in SQL cannot sign in until these columns are empty
strings rather than NULL. GoTrue reads them as Go strings and a NULL makes the
whole sign-in query fail with the unhelpful "Database error querying schema":

```sql
update auth.users set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, '')
where email = '…';
```

Creating the user through the dashboard instead avoids this entirely.
