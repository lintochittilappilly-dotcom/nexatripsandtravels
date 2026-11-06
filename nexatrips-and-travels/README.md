# NexaTrips & Travels — website

A fast, static one-page site for **NexaTrips & Travels** (Facebook: [@NexaTripsAndTravels](https://www.facebook.com/NexaTripsAndTravels)).
No build step, no framework, no dependencies — just HTML, CSS and a little JavaScript. It hosts for free on GitHub Pages.

**Includes:** WhatsApp chat button (floating widget + buttons throughout), a contact/enquiry form,
destinations, services, how-it-works, FAQ and about sections. No flight search, no booking engine —
every enquiry goes to a conversation.

---

## 1. Before you publish — 3 things to change

Everything contact-related is in one place: the `CONFIG` block at the top of `assets/js/site.js`.

```js
const CONFIG = {
  whatsapp: "639000000000",                    // your number, digits only
  email: "hello@nexatripsandtravels.com",      // your real email
  formEndpoint: ""                             // see section 4
};
```

> ⚠️ The WhatsApp number and email above are **placeholders**. The site works without them,
> but messages won't reach you until they're replaced.

Because the page works without JavaScript too, the same WhatsApp number appears in a few
`href="https://wa.me/639000000000?text=..."` fallbacks. To update them everywhere at once:

```bash
# from the project folder — replace with your own number (digits only)
grep -rl 'wa.me/639000000000' . --exclude-dir=.git | xargs sed -i 's|wa.me/639000000000|wa.me/639171234567|g'

# and your real email
grep -rl 'hello@nexatripsandtravels.com' . --exclude-dir=.git | xargs sed -i 's|hello@nexatripsandtravels.com|you@yourdomain.com|g'
```

Then set the same values in `CONFIG` and you're done.

Also replace `YOUR-USERNAME` and the repo name in:

- `index.html` — `<link rel="canonical">`, `og:url`, `twitter` tags and the JSON-LD `url`
- `robots.txt` — the `Sitemap:` line
- `sitemap.xml` — the `<loc>` entry

---

## 2. Publish with GitHub Pages (recommended: Actions)

1. Create a new repository on GitHub, e.g. `nexatrips-and-travels` (public).
2. Push this folder to it:

   ```bash
   git init
   git add .
   git commit -m "NexaTrips & Travels website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nexatrips-and-travels.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/pages.yml` deploys automatically on every push to `main`.
   Watch it under the **Actions** tab; the live URL appears under Settings → Pages:
   `https://YOUR-USERNAME.github.io/nexatrips-and-travels/`

Pushing through the GitHub website works too — the same workflow runs.

### Alternative: deploy from a branch (no Actions)

Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder: `/ (root)`.
The `.nojekyll` file is already there, so nothing gets filtered.

### Custom domain

Settings → Pages → Custom domain, enter e.g. `nexatripsandtravels.com`, then add the
`A`/`CNAME` records GitHub shows you. Tick **Enforce HTTPS** once DNS settles. If you add a
custom domain, update the canonical/OG URLs and the sitemap to match.

---

## 3. Local preview

No install needed. From this folder:

```bash
python3 -m http.server 3002
# then open http://localhost:3002
```

(Or just double-click `index.html` — everything works from the filesystem too.)

---

## 4. Making the contact form send email

A static site has no server, so the form uses [FormSubmit](https://formsubmit.co) — free,
no account, no API keys exposed in the page.

1. In `assets/js/site.js`, set:

   ```js
   formEndpoint: "https://formsubmit.co/ajax/you@yourdomain.com"
   ```

   Also change the `action` attribute on the form in `index.html` to
   `https://formsubmit.co/you@yourdomain.com` (this is the no-JavaScript fallback).

2. Submit the form once on the live site. FormSubmit emails that address a confirmation
   link — click it to activate delivery.
3. From then on, every enquiry arrives as a formatted email with all the fields.

`_honey` is a spam honeypot and `_captcha` is disabled for a smoother experience; remove that
hidden input if you start seeing spam.

**Leave `formEndpoint: ""` and the form instead composes the enquiry and opens it in
WhatsApp** — useful if you'd rather keep everything in chat. Either way, nothing is booked or
charged from the site.

Want a different provider? Any form service with a POST endpoint works — just point
`formEndpoint` at it.

---

## 5. Editing content

| What | Where |
| --- | --- |
| Phone / email / form | `CONFIG` in `assets/js/site.js` |
| Brand name, tagline, hero copy | `index.html` (hero section) |
| Destinations | `index.html` → `#destinations` cards |
| Services, steps, FAQ, about | the matching sections in `index.html` |
| Colours, fonts, spacing | `:root` tokens at the top of `assets/css/styles.css` |
| Social links | contact card + footer in `index.html` |

The typefaces are Fraunces (headings) and Inter (body), loaded from Google Fonts.

## 6. Files

```
index.html              the site
404.html                not-found page
assets/css/styles.css   all styling
assets/js/site.js       config, form, WhatsApp widget, animations
assets/img/favicon.svg  logo mark
robots.txt, sitemap.xml search engine basics
.github/workflows/      GitHub Pages deploy
.nojekyll               stop Jekyll processing on Pages
```

## 7. Photography

Photos are hot-linked from [Unsplash](https://unsplash.com) (free to use under the
[Unsplash licence](https://unsplash.com/license)) so the repository stays light. For a
long-term site, download the ones you keep and store them in `assets/img/` — that removes the
dependency on Unsplash's servers and speeds up the page. Swap them for your own trip photos
any time; they're the best marketing you have.

## 8. A note on content

The destination descriptions, service copy and FAQ answers are written as sensible defaults
for a boutique travel planner. Reviews and testimonials were deliberately left out rather
than invented — add a real-praise section once you have client quotes you're happy to publish.
