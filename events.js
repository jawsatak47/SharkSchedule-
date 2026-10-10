/* =====================================================================
   YOUR EVENTS  (events.js)
   ---------------------------------------------------------------------
   This is the one file you edit to change the schedule.
   Everything below is SAMPLE DATA so you can see how the page works.
   Delete the samples and add your confirmed events.

   HOW TO ADD AN EVENT
   1. Copy one whole { ... } block (from the opening { to the closing },).
   2. Paste it right below another block.
   3. Change the details. Order does not matter; the page sorts by date.

   PUNCTUATION RULES
   - Values go in "double quotes".  Dates and times too.
   - A comma after every line inside a block, and after each closing }
     (the last line in a block may skip the comma).
   - true / false are written without quotes.

   FIELDS   (only "title" and "date" are required)
     id                   Unique short name, no spaces: "canvaswars-spring-2027". Auto-made if left out.
     title                Event name.
     category             canvaswars | live-art | classes | music | exhibitions | community
     brand                Optional label such as "QuarkForce", "QuarkUniversity", "JawsAtak47".
     date                 "YYYY-MM-DD"  (example: "2027-03-14")
     endDate              Optional, for multi-day events. Leave out for one-day events.
     startTime            "18:30" (24-hour) or "6:30 PM". Leave out for all-day / date-only events.
     endTime              Optional, same format.
     venue, address, city Where it happens. Any can be left out.
     description          One or two sentences.
     image                Optional poster, e.g. "assets/poster-march.jpg" (upload it to the assets folder).
     imageAlt             Optional description of the poster for screen readers.
     price                Optional text: "Free", "$25", "$10 advance / $15 door".
     status               upcoming | registration-open | limited-spots | sold-out |
                          fully-booked | postponed | canceled | completed
     buttonText           Optional. Overrides the default button label for the status.
     buttonUrl            Where the main button goes. NO URL = NO BUTTON (nothing fake is ever shown).
                          Can be a web link, "mailto:you@example.com", or "#contact" (jumps to the contact section).
     secondaryButtonText  Optional second button label.
     secondaryButtonUrl   Optional second button link (both text and url needed).
     recapUrl             Optional link shown as "View Recap" after the event is over.
     featured             true = pin this as the big "Next Up" event (if it's still upcoming).
                          Leave false/omitted and the page features the soonest event automatically.
     showOnWebsite        false = hide without deleting. Omit or true = visible.
     sample               true = shows a SAMPLE badge. Remove this line from your real events.
     timeZone             Optional override, e.g. "America/New_York". Default is set in config.js.

   TO HIDE:  add   "showOnWebsite": false,
   TO DELETE: delete the whole { ... }, block.
   Past events move into the "past events" archive automatically.
   ===================================================================== */

window.EVENTS = [

  {
    "id": "sample-graffiti-fundamentals",
    "title": "Graffiti Fundamentals: Letter Structure (Sample)",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "2026-10-21",
    "startTime": "18:30",
    "endTime": "20:30",
    "venue": "Sample Studio",
    "address": "123 Example St",
    "city": "Medford, OR",
    "description": "SAMPLE: A two-hour hands-on class on building letters from the skeleton out. Replace this with your real class details.",
    "price": "$35 (sample price)",
    "status": "limited-spots",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

  {
    "id": "sample-mural-install-week",
    "title": "Mural Install Week (Sample)",
    "category": "live-art",
    "brand": "QuarkForce",
    "date": "2026-10-26",
    "endDate": "2026-10-30",
    "venue": "Sample Wall Site",
    "city": "Medford, OR",
    "description": "SAMPLE: A multi-day mural install. No start or end time is set, so it shows as an all-day, multi-day event. Stop by while the work is in progress.",
    "price": "Free",
    "status": "upcoming",
    "buttonText": "Follow Progress",
    "buttonUrl": "",
    "sample": true
  },

  {
    "id": "sample-art-walk-live-painting",
    "title": "Live Painting at the First Friday Art Walk (Sample)",
    "category": "live-art",
    "brand": "Jawsatak",
    "date": "2026-11-06",
    "startTime": "17:00",
    "endTime": "20:00",
    "venue": "Sample Gallery",
    "address": "456 Example Ave",
    "city": "Medford, OR",
    "description": "SAMPLE: Watch a piece come together live during the art walk. Replace with your real appearance.",
    "price": "Free",
    "status": "upcoming",
    "buttonText": "Attend Event",
    "buttonUrl": "#contact",
    "sample": true
  },

  {
    "id": "sample-postponed-workshop",
    "title": "Sample Weekend Workshop (Postponed)",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "2026-11-10",
    "startTime": "10:00",
    "endTime": "14:00",
    "venue": "Sample Studio",
    "city": "Medford, OR",
    "description": "SAMPLE: Shows how a postponed event looks. New date to be announced.",
    "status": "postponed",
    "sample": true
  },

  {
    "id": "sample-canvaswars-window-battle",
    "title": "CanvasWars: Window Painting Battle (Sample)",
    "category": "canvaswars",
    "brand": "QuarkForce",
    "date": "2026-11-14",
    "startTime": "18:00",
    "endTime": "21:00",
    "venue": "Sample Storefront Row",
    "address": "789 Example Blvd",
    "city": "Medford, OR",
    "description": "SAMPLE: Artists go head-to-head on storefront windows while the crowd votes. Replace with your real competition details.",
    "price": "Free to watch / $20 to compete (sample)",
    "status": "registration-open",
    "buttonText": "Register to Compete",
    "buttonUrl": "#contact",
    "secondaryButtonText": "Watch Info",
    "secondaryButtonUrl": "#contact",
    "sample": true
  },

  {
    "id": "sample-gallery-opening",
    "title": "Gallery Opening: Mural Studies (Sample)",
    "category": "exhibitions",
    "brand": "QuarkForce",
    "date": "2026-11-20",
    "startTime": "18:00",
    "endTime": "21:00",
    "venue": "Sample Gallery",
    "address": "456 Example Ave",
    "city": "Medford, OR",
    "description": "SAMPLE: Opening reception for a small exhibition of studies and sketches. This sample has no button URL, so no button is shown.",
    "price": "Free",
    "status": "upcoming",
    "sample": true
  },

  {
    "id": "sample-creative-market",
    "title": "Handmade Creative Market (Sample)",
    "category": "community",
    "date": "2026-11-28",
    "startTime": "10:00",
    "endTime": "16:00",
    "venue": "Sample Community Hall",
    "city": "Medford, OR",
    "description": "SAMPLE: Shows a sold-out event with a waitlist button (the default text for Sold Out is Join Waitlist).",
    "status": "sold-out",
    "buttonUrl": "#contact",
    "sample": true
  },

  {
    "id": "sample-jawsatak47-live-set",
    "title": "JawsAtak47 Live Set (Sample)",
    "category": "music",
    "brand": "JawsAtak47",
    "date": "2026-12-04",
    "startTime": "21:00",
    "endTime": "23:30",
    "venue": "Sample Music Hall",
    "address": "321 Example Way",
    "city": "Medford, OR",
    "description": "SAMPLE: A live hip-hop set. Replace with your real show and add a ticket link when you have one.",
    "price": "$10 at the door (sample price)",
    "status": "upcoming",
    "buttonText": "Get Tickets",
    "buttonUrl": "",
    "sample": true
  },

  {
    "id": "sample-past-canvaswars",
    "title": "CanvasWars: Season Opener (Sample)",
    "category": "canvaswars",
    "brand": "QuarkForce",
    "date": "2026-09-26",
    "startTime": "18:00",
    "endTime": "21:00",
    "venue": "Sample Storefront Row",
    "city": "Medford, OR",
    "description": "SAMPLE: A finished event. It appears in the past events archive.",
    "status": "completed",
    "sample": true
  },

  {
    "id": "sample-hidden-event",
    "title": "Sample Hidden Event (not shown on the website)",
    "category": "community",
    "date": "2026-12-12",
    "description": "SAMPLE: This one has showOnWebsite set to false, so visitors never see it.",
    "showOnWebsite": false,
    "sample": true
  }

];
