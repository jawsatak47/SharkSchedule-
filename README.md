# Jawsatak | Events & Classes

A free, shareable events and classes page. Plain HTML, CSS and JavaScript. No build step, no accounts, no monthly cost.

```
index.html     the public page (this is the link you share)
styles.css     the look
app.js         builds the schedule from your data (you never edit this)
config.js      page text, links, time zone, categories, status labels
events.js      YOUR EVENTS (the file you edit most)
admin.html     optional form editor (see "The editor" below)
robots.txt     tells search engines they may index the site
assets/        put posters, photos and a favicon here
```

**Try it right now:** double-click `index.html`. It works straight from your computer.
The events you see are **sample data** (each has a yellow SAMPLE badge). A notice at the top of the page disappears automatically once no sample events remain.

---

## 1. Add, edit, hide, or delete an event

Open `events.js` in any text editor (on GitHub you can click the file, then the pencil icon).

**Add:** copy one whole `{ ... },` block, paste it below another, change the details. Order doesn't matter, because the page sorts by date.

```js
{
  "id": "canvaswars-spring-2027",
  "title": "CanvasWars: Spring Showdown",
  "category": "canvaswars",
  "brand": "QuarkForce",
  "date": "2027-03-14",
  "startTime": "18:00",
  "endTime": "21:00",
  "venue": "Venue Name",
  "address": "123 Main St",
  "city": "Medford, OR",
  "description": "One or two sentences.",
  "price": "Free",
  "status": "registration-open",
  "buttonUrl": "https://link-to-register",
  "featured": false
},
```

**Edit:** change the text between the quotes.
**Hide without deleting:** add the line `"showOnWebsite": false,`.
**Delete:** remove the whole `{ ... },` block.
**Past events:** nothing to do. Once an event is over it moves into the "Show past events" archive by itself.

The punctuation rules are written at the top of `events.js`. The most common mistake is a missing comma. If the page ever goes blank after an edit, that's almost always why, and you can open the browser console (F12) to see which line.

### All fields

| Field | Notes |
|---|---|
| `title`, `date` | The only required ones. Date is `"YYYY-MM-DD"`. |
| `category` | `canvaswars`, `live-art`, `classes`, `music`, `exhibitions`, `community` |
| `brand` | Optional label (QuarkForce, QuarkUniversity, JawsAtak47...) |
| `endDate` | Multi-day events only |
| `startTime`, `endTime` | `"18:30"` or `"6:30 PM"`. Leave both out for all-day events. |
| `venue`, `address`, `city` | Any can be left out. A Map link appears when there's enough to search. |
| `description`, `price`, `image`, `imageAlt` | Optional. Image example: `"assets/poster.jpg"` |
| `status` | `upcoming`, `registration-open`, `limited-spots`, `sold-out`, `fully-booked`, `postponed`, `canceled`, `completed` |
| `buttonText`, `buttonUrl` | Main button. **No URL = no button.** `"#contact"` jumps to the contact section. |
| `secondaryButtonText`, `secondaryButtonUrl` | Optional second button (needs a URL). |
| `recapUrl` | Optional "View Recap" link shown after the event. |
| `featured` | `true` pins it as the big "Next up" event (if still upcoming). Otherwise the soonest event is featured automatically. |
| `showOnWebsite` | `false` hides it. |
| `sample` | `true` shows a SAMPLE badge. Remove it from real events. |
| `timeZone` | Optional per-event override, e.g. `"America/New_York"`. |

Anything left out is simply not shown. There are no empty fields and no dead buttons.

---

## 2. How the main features work

**Time zone.** Everything is read in `America/Los_Angeles` (Pacific, with daylight saving handled automatically) unless you change `timeZone` in `config.js` or on one event. The page shows the zone (PST/PDT) next to times. A visitor in New York still sees "6:00 PM PDT", not a silently shifted time.

**Status and buttons.** Each status has a default button label in `config.js` (Registration Open: "Book a Spot", Limited Spots: "Reserve Your Spot", Sold Out: "Join Waitlist", Completed: "View Recap"). An event's own `buttonText` overrides it. The button only exists if you gave a `buttonUrl`. For a sold-out event, point `buttonUrl` at your waitlist. To keep the page honest, an event marked *Registration Open* or *Limited Spots* with **no link** is displayed as plain "Upcoming".

**Category filters.** The buttons filter instantly with no reload, and show how many upcoming events each category has. The address updates (`?cat=music`), so you can send or print a link to just one category, for example a QR code for your music shows. Add `&view=calendar` to open the calendar.

**Calendar view.** A monthly grid. Tap a day to see that day's events; "Show whole month" returns to the full month. The filters apply here too. The list view is the default and the best one to share.

**Add to Calendar.** Each upcoming event has a button that downloads an `.ics` file for Apple Calendar, Google Calendar, Outlook and others. Times are written as exact moments (UTC), so they land correctly in the visitor's own calendar. Events with no start time become all-day entries. Events with a start but no end time default to 2 hours in the download. Canceled, postponed and past events don't offer the button.

**Multi-day events.** Set `date` and `endDate`. With no times it shows as an all-day run (good for mural weeks and exhibitions). If you do set times on a multi-day event, they mean "starts at ... on the first day, ends at ... on the last day".

**Sharing.** The header has the page link, a Copy link button, a Share button (shown on phones and browsers that support it) and an Email button. The page has a title, description and social-preview tags. For a large image preview when the link is texted or posted, follow the comment in `index.html` to add an `og:image`. Search engines can index it; sample events are never included in the search-engine data.

**QR codes and flyers.** Once the site is live, make a QR code of the page address with any free QR generator (Chrome's address bar also has "Create QR code" in its share menu). The page also prints cleanly in black and white for flyers.

---

## 3. Put it online with GitHub Pages (free)

1. Create a free account at github.com and click **New repository**. Name it (for example `events`), set it to **Public**, and create it.
2. On the repository page click **Add file, then Upload files**. Drag in everything from this folder (`index.html`, `styles.css`, `app.js`, `config.js`, `events.js`, `admin.html`, `robots.txt`, and the `assets` folder contents). Click **Commit changes**.
3. Go to **Settings, then Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**, and Save.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/events/`.
5. Open `config.js` and set `siteUrl` to that address. This makes the copy link, calendar files and search engines use the right link.

**Updating later:** open `events.js` on GitHub, click the pencil, make changes, click **Commit changes**. It goes live in about a minute. Or use the editor (below) to produce a new file to upload.

## 4. Use your own domain later

1. In the repo, **Settings, then Pages, then Custom domain**: enter your domain (for example `events.yourdomain.com`) and Save. GitHub adds a `CNAME` file for you.
2. At your domain registrar, add DNS records:
   - **Subdomain** (`events.yourdomain.com`): a `CNAME` record pointing to `YOUR-USERNAME.github.io`.
   - **Root domain** (`yourdomain.com`): four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** in the Pages settings.
4. Update `siteUrl` in `config.js` to the new address. If you want, also add a `sitemap.xml` listing it and add a line `Sitemap: https://yourdomain.com/sitemap.xml` to `robots.txt`.

---

## 5. The editor (`admin.html`)

Open `admin.html` (on your computer, or at `/admin.html` on your site). It gives you a form to add, edit, duplicate, hide, show, delete, feature, and set statuses on events, with checks for missing titles, bad dates and unsafe links.

**What it does and does not do, honestly:**

- Your edits are saved as a **draft in your browser only** (localStorage). Nothing is sent anywhere.
- It **cannot change the live website**. A free static site has no server to save into. To publish, click **Download events.js** and replace the file in your site (GitHub: open the file, or Add file, then Upload files, then Commit).
- The page always tells you if your draft differs from the published file ("Unpublished changes").
- The draft stays on that browser and device. Clearing site data, a private window, or another device won't have it. Download after real changes, and keep the downloaded file as your backup. **Import a saved events.js** loads a file this editor made on another device.
- **Preview my draft** opens the public page showing your draft (with a yellow notice) so you can check it before publishing. This works best from the live site or a local server; some browsers don't share browser storage between `file://` pages.
- Anyone who knows the address can open `admin.html`, but they can't publish anything. They would need access to your GitHub. It's marked `noindex` so search engines skip it. If you'd rather not have it online at all, just don't upload it and keep it on your computer.
- Downloaded files replace the long instruction comment at the top of `events.js` with a short one, and are formatted as plain JSON-style entries. They're still hand-editable. A hand-edited file with comments can't be re-imported, but it doesn't need to be: the editor already reads whatever `events.js` is next to it.
- **If you want one-click publishing** (edit in a form and it goes live), that needs a backend: for example a small service like a headless CMS, a GitHub login flow (Decap CMS), or a spreadsheet-driven setup. It adds accounts and setup, and I'd only recommend it if hand-editing `events.js` or the download/upload routine becomes a chore.

---

## 6. Checking your work

- Run the page, click each filter, and switch to Calendar view.
- Click **Add to Calendar** on one event and open the file to confirm the time.
- Open the page on your phone.
- If you add a poster, upload it to `assets/` and use the exact file name (`"assets/poster.jpg"`; names are case-sensitive on GitHub Pages). A missing poster is dropped quietly rather than showing a broken image.
