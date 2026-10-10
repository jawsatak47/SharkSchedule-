/* =====================================================================
   SITE SETTINGS  (config.js)
   ---------------------------------------------------------------------
   This file holds the page title, your links, the time zone, the
   category list and the status labels. You change it rarely.
   Your actual events live in events.js.

   RULES FOR EDITING (it's a JavaScript file, so punctuation matters):
   - Keep every value inside "double quotes".
   - Keep the comma at the end of each line.
   - If a link is left as "" (empty), it is simply not shown on the page.
   ===================================================================== */

window.SITE_CONFIG = {

  /* ---- Page text ---------------------------------------------------- */
  siteTitle: "Jawsatak | Events & Classes",
  tagline: "Art. Music. Education. Live Experiences.",
  intro:
    "Explore upcoming live art events, CanvasWars competitions, art classes and workshops, " +
    "music performances, and community happenings. Find something that fits, then book a spot, " +
    "grab tickets, or get in touch.",
  owner: "Jawsatak",
  shareText: "Upcoming events, classes, live art and music from Jawsatak.",

  /* ---- Time zone ---------------------------------------------------- */
  /* Every event time on the page is read in this time zone.
     Medford, Oregon = "America/Los_Angeles" (Pacific Time, daylight saving handled automatically).
     A single event can override it with its own "timeZone" field in events.js. */
  timeZone: "America/Los_Angeles",

  /* 0 = calendar weeks start on Sunday, 1 = Monday */
  weekStartsOn: 0,

  /* ---- Public web address ------------------------------------------- */
  /* Fill this in once the site is live (example: "https://events.yourdomain.com/").
     It is used for the copy-link box, share button, calendar downloads and search engines.
     Leave "" and the page uses whatever address it is opened from. */
  siteUrl: "",

  /* ---- Your links (PLACEHOLDERS: replace the empty "" with real URLs) -- */
  /* Any link with an empty url is hidden. Add or remove lines as you like. */
  links: [
    { label: "Website",   url: "" },   // PLACEHOLDER: e.g. "https://yourwebsite.com"
    { label: "Instagram", url: "" },   // PLACEHOLDER
    { label: "YouTube",   url: "" },   // PLACEHOLDER
    { label: "Spotify",   url: "" }    // PLACEHOLDER
  ],

  /* ---- Contact section ---------------------------------------------- */
  contact: {
    email: "",     // PLACEHOLDER: your email. Topic buttons open a pre-written email to this address.
    formUrl: "",   // OPTIONAL: a contact-form or DM link. Used for topic buttons if email is empty.
    topics: [
      { label: "Ask about classes",           subject: "Question about classes" },
      { label: "Live painting & commissions", subject: "Live painting / commission inquiry" },
      { label: "Music bookings",              subject: "Music booking inquiry" },
      { label: "Event information",           subject: "Event information request" },
      { label: "Collaborate",                 subject: "Collaboration idea" }
    ]
  },

  /* ---- Categories ---------------------------------------------------- */
  /* key   = the word you type in events.js ("category": "music")
     label = what visitors see on the filter buttons
     color = accent color for that category */
  categories: [
    { key: "canvaswars",  label: "CanvasWars",                  color: "#ff4d6d" },
    { key: "live-art",    label: "Live Painting & Art",         color: "#ffb703" },
    { key: "classes",     label: "Classes & Workshops",         color: "#4cc9f0" },
    { key: "music",       label: "Music",                       color: "#b794ff" },
    { key: "exhibitions", label: "Exhibitions & Art Walks",     color: "#3ddc97" },
    { key: "community",   label: "Community & Special Events",  color: "#ff8a3d" }
  ],

  /* ---- Statuses ------------------------------------------------------ */
  /* key        = the word you type in events.js ("status": "sold-out")
     label      = badge shown on the event
     buttonText = default button label for that status.
                  The button only appears when the event has a buttonUrl.
                  An event's own "buttonText" always wins over this default. */
  statuses: {
    "upcoming":          { label: "Upcoming",          buttonText: "Learn More" },
    "registration-open": { label: "Registration Open", buttonText: "Book a Spot" },
    "limited-spots":     { label: "Limited Spots",     buttonText: "Reserve Your Spot" },
    "sold-out":          { label: "Sold Out",          buttonText: "Join Waitlist" },
    "fully-booked":      { label: "Fully Booked",      buttonText: "Join Waitlist" },
    "postponed":         { label: "Postponed",         buttonText: "More Info" },
    "canceled":          { label: "Canceled",          buttonText: "More Info" },
    "completed":         { label: "Completed",         buttonText: "View Recap" }
  }
};
