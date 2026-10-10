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
    "id": "paiantbrush-fundamentals",
    "title": "Paint Brush Fundamentals: be comfortable with any paintbrush",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "10-21-2026",
    "startTime": "1:30",
    "endTime": "4:30",
    "venue": "Scrappy Crafts",
    "address": "Phornix Oregon",
    "city": "Phoenix, OR",
    "description": "a three-hour hands-on class on getting comfortable using paint brushes for you artworks!",
    "price": "$5",
    "status": "spots available",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

   {
    "id": "lettering-fundamentals-Hc1",
    "title": "Letter Fundamentals: basic hand lettering fundementals & understanding script",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "10-22-2026",
    "startTime": "1:30",
    "endTime": "4:30",
    "venue": "TimelessTreasuresHub",
    "address": "4041 CraterLake ave Medford Oregon",
    "city": "Medford, OR",
    "description": "a three-hour hands-on class on getting comfortable with hand lettering!",
    "price": "$5",
    "status": "spots available",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

      {
    "id": "lettering-fundamentals-Pc1",
    "title": "Letter Fundamentals: Painting basic lettering strokes & understanding script",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "10-23-2026",
    "startTime": "1:30",
    "endTime": "4:30",
    "venue": "TimelessTreasuresHub",
    "address": "4041 CraterLake ave Medford Oregon",
    "city": "Medford, OR",
    "description": "a three-hour hands-on class on getting comfortable with painting letters!",
    "price": "$5",
    "status": "spots available",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

  {
    "id": "mural install week",
    "title": "Mural Install Week (Sample)",
    "category": "live-art",
    "brand": "JawsAtak",
    "date": "10-26-2026",
    "endDate": "10-30-2026",
    "venue": "Bartlette-Middleford Medford Oregon",
    "city": "Medford, OR",
    "description": "multi-day mural install. No start or end time is set, so it shows as an all-day, multi-day event. Stop by while the work is in progress.",
    "price": "Free",
    "status": "upcoming",
    "buttonText": "Follow Progress",
    "buttonUrl": "",
    "sample": true
  },

  {
    "id": "TTH WindowWars Christmas Edition",
    "title": "Live Painting at Timeless treasures Hub",
    "category": "live-art",
    "brand": "CanvasWars, TTH",
    "date": "11-06-2026",
    "startTime": "11:00am",
    "endTime": "4:00pm",
    "venue": "STimeles Treasures Hub",
    "address": "4041 CraterLake Ave medford",
    "city": "Medford, OR",
    "description": "SAMPLE: Watch a piece come together live during the art walk. Replace with your real appearance.",
    "price": "$5",
    "status": "upcoming",
    "buttonText": "Attend Event",
    "buttonUrl": "#contact",
    "sample": true
  },

  {
 "id": "lettering-fundamentals-Hc2",
    "title": "Letter Fundamentals follow up class 2: basic hand lettering fundementals & understanding script",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "10-22-2026",
    "startTime": "1:30",
    "endTime": "4:30",
    "venue": "TimelessTreasuresHub",
    "address": "4041 CraterLake ave Medford Oregon",
    "city": "Medford, OR",
    "description": "a three-hour hands-on class on getting comfortable with hand lettering!",
    "price": "$5",
    "status": "spots available",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

  {
    "id": "lettering-fundamentals-Pc2",
    "title": "Letter Fundamentals followup class 2: painting basic lettering strokes & understanding script",
    "category": "classes",
    "brand": "QuarkUniversity",
    "date": "10-23-2026",
    "startTime": "1:30",
    "endTime": "4:30",
    "venue": "TimelessTreasuresHub",
    "address": "4041 CraterLake ave Medford Oregon",
    "city": "Medford, OR",
    "description": "a three-hour hands-on class on getting comfortable with painting letters!",
    "price": "$5",
    "status": "spots available",
    "buttonUrl": "#contact",
    "featured": false,
    "showOnWebsite": true,
    "sample": true
  },

  {
    "id": "mural at tth",
    "title": "new mural at TTH",
    "category": "workshop, exhibitions",
    "brand": "JawsAtak",
    "date": "2026",
    "startTime": "18:00",
    "endTime": "21:00",
    "venue": "TTH Gallery",
    "address": "4041 CraterLkae ave",
    "city": "Medford, OR",
    "description": "new mural in progress.",
    "price": "Free",
    "status": "upcoming",
    "sample": true
  },

  {
    "id": "xxx",
    "title": "xxx",
    "category": "community",
    "date": "2026",
    "startTime": "10:00",
    "endTime": "16:00",
    "venue": "Community Hall",
    "city": "Medford, OR",
    "description": "xxx",
    "status": "upcoming",
    "buttonUrl": "#contact",
    "sample": true
  },

  {
    "id": "art-lecture",
    "title": "JawsAtakart lecture",
    "category": "speaking",
    "brand": "JawsAtak",
    "date": "2026",
    "startTime": "21:00",
    "endTime": "23:30",
    "venue": "Lecture Hall",
    "address": "SOU",
    "city": "Medford, OR",
    "description": "Conversation about art, from graffiti to full time",
    "price": "donations accepted",
    "status": "upcoming",
    "buttonText": "Tickets",
    "buttonUrl": "#",
    "sample": true
  },

  {
    "id": "CW January",
    "title": "CanvasWars: the Golden yr.",
    "category": "canvaswars",
    "brand": "CanvasWars",
    "date": "2027",
    "startTime": "18:00",
    "endTime": "21:00",
    "venue": "TTH",
    "city": "Medford, OR",
    "description": "start the yrar of right!.",
    "status": "upcomming",
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
