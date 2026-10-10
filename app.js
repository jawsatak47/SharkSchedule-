/* =====================================================================
   app.js  -  builds the public schedule from config.js + events.js.
   You normally never need to edit this file.
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG;
  var byId = function (id) { return document.getElementById(id); };
  var HOUR = 3600000;
  var DAY = 86400000;

  if (!CFG) {
    byId('upcomingList').innerHTML =
      '<p class="empty">The schedule could not load because <code>config.js</code> is missing.</p>';
    return;
  }

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function str(v) { return v == null ? '' : String(v).trim(); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slug(s) {
    return str(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }
  function normKey(s) { return str(s).toLowerCase().replace(/[\s_]+/g, '-'); }

  /* Only allow safe link types. Blocks javascript:, data:, etc. */
  function safeUrl(u) {
    u = str(u);
    if (!u) return '';
    if (/^www\./i.test(u)) return 'https://' + u;
    if (/^(https?:\/\/|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.\-]*:/i.test(u)) return '';
    return u; /* relative path such as "details.html" */
  }
  function isHttp(u) { return /^https?:\/\//i.test(u); }

  function validTZ(tz) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return tz; } catch (e) { return null; }
  }

  var TZ = validTZ(str(CFG.timeZone)) || 'America/Los_Angeles';
  var WEEK_START = CFG.weekStartsOn === 1 ? 1 : 0;
  var CATS = Array.isArray(CFG.categories) ? CFG.categories : [];
  var STATUS = CFG.statuses || {};

  function catOf(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].key === key) return CATS[i];
    return { key: key, label: key, color: '#aaa9a1' };
  }
  function statusInfo(key) {
    return STATUS[key] || STATUS.upcoming || { label: 'Upcoming', buttonText: 'Learn More' };
  }

  /* ------------------------------------------------------------------
     Date + time handling
     Dates are plain "YYYY-MM-DD" and times plain "HH:MM" in the event's
     time zone. We turn them into exact UTC instants with Intl so daylight
     saving is always right and nothing depends on the visitor's own zone.
     ------------------------------------------------------------------ */
  function parseYMD(s) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str(s));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var t = new Date(Date.UTC(y, mo - 1, d));
    if (t.getUTCFullYear() !== y || t.getUTCMonth() !== mo - 1 || t.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d };
  }

  /* Accepts "18:30", "6:30 PM", "6pm", "6 PM" */
  function parseHM(s) {
    var m = /^(\d{1,2})(?::(\d{2}))?\s*([ap])?\.?m?\.?$/i.exec(str(s));
    if (!m) return null;
    var h = +m[1], mi = m[2] ? +m[2] : 0, ap = m[3] ? m[3].toLowerCase() : '';
    if (mi > 59) return null;
    if (ap) {
      if (h < 1 || h > 12) return null;
      if (ap === 'p' && h < 12) h += 12;
      if (ap === 'a' && h === 12) h = 0;
    } else if (h > 23) return null;
    return { h: h, mi: mi };
  }

  function dayNum(o) { return Math.round(Date.UTC(o.y, o.m - 1, o.d) / DAY); }
  function fromDayNum(n) { var d = new Date(n * DAY); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() }; }
  function addDays(o, n) { return fromDayNum(dayNum(o) + n); }
  function ymdStr(o) { return o.y + '-' + pad(o.m) + '-' + pad(o.d); }

  var dtfCache = {};
  function dtf(tz) {
    if (!dtfCache[tz]) {
      dtfCache[tz] = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      });
    }
    return dtfCache[tz];
  }
  function tzOffsetMs(ts, tz) {
    var p = {};
    dtf(tz).formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
    var h = +p.hour; if (h === 24) h = 0;
    var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, h, +p.minute, +p.second);
    return asUTC - Math.floor(ts / 1000) * 1000;
  }
  /* wall-clock time in a zone -> exact UTC milliseconds */
  function zonedToUtc(ymd, hm, tz) {
    var guess = Date.UTC(ymd.y, ymd.m - 1, ymd.d, hm.h, hm.mi, 0);
    var off = tzOffsetMs(guess, tz);
    var t = guess - off;
    var off2 = tzOffsetMs(t, tz);
    if (off2 !== off) t = guess - off2;
    return t;
  }
  function todayInZone(tz) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month, d: +p.day };
  }
  function tzAbbr(ms, tz) {
    var name = '';
    new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
      .formatToParts(new Date(ms)).forEach(function (x) { if (x.type === 'timeZoneName') name = x.value; });
    return name;
  }
  function isoWithOffset(ms, tz) {
    var off = tzOffsetMs(ms, tz);
    var local = new Date(ms + off);
    var sign = off < 0 ? '-' : '+', a = Math.abs(off) / 60000;
    return local.getUTCFullYear() + '-' + pad(local.getUTCMonth() + 1) + '-' + pad(local.getUTCDate()) + 'T' +
      pad(local.getUTCHours()) + ':' + pad(local.getUTCMinutes()) + ':' + pad(local.getUTCSeconds()) +
      sign + pad(Math.floor(a / 60)) + ':' + pad(a % 60);
  }

  function fmtDate(o, opts) {
    var o2 = Object.assign({ timeZone: 'UTC' }, opts);
    return new Intl.DateTimeFormat('en-US', o2).format(new Date(Date.UTC(o.y, o.m - 1, o.d)));
  }
  function fmtTime(hm, withSuffix) {
    var h12 = hm.h % 12 || 12;
    return h12 + ':' + pad(hm.mi) + (withSuffix === false ? '' : (hm.h < 12 ? ' AM' : ' PM'));
  }

  /* ------------------------------------------------------------------
     Read + normalize events
     ------------------------------------------------------------------ */
  var PREVIEW = false;
  function loadRaw() {
    try {
      var qs = new URLSearchParams(location.search);
      if (qs.get('preview') === 'draft') {
        var d = JSON.parse(localStorage.getItem('jawsatak.events.draft.v1'));
        if (d && Array.isArray(d.events)) { PREVIEW = true; return d.events; }
      }
    } catch (e) { /* storage unavailable: fall through to the published list */ }
    return Array.isArray(window.EVENTS) ? window.EVENTS : [];
  }

  function normalizeAll(rawList) {
    var seen = {};
    var out = [];
    rawList.forEach(function (raw, i) {
      if (!raw || typeof raw !== 'object') return;
      if (raw.showOnWebsite === false || str(raw.showOnWebsite).toLowerCase() === 'false') return;

      var title = str(raw.title);
      var s = parseYMD(raw.date);
      if (!title || !s) {
        if (window.console) console.warn('Skipped event #' + (i + 1) + ': it needs a "title" and a "date" like "2027-03-14".', raw);
        return;
      }
      var tz = validTZ(str(raw.timeZone)) || TZ;
      var e = parseYMD(raw.endDate);
      if (!e || dayNum(e) < dayNum(s)) e = s;

      var st = parseHM(raw.startTime);
      var et = st ? parseHM(raw.endTime) : null;
      var startMs = zonedToUtc(s, st || { h: 0, mi: 0 }, tz);
      var endOfLastDay = zonedToUtc(addDays(e, 1), { h: 0, mi: 0 }, tz);
      var endMs, lastMs;
      if (st) {
        if (et) {
          endMs = zonedToUtc(e, et, tz);
          if (endMs <= startMs) {
            endMs = (dayNum(e) === dayNum(s)) ? zonedToUtc(addDays(e, 1), et, tz) : startMs + 2 * HOUR;
          }
          lastMs = endMs;
        } else {
          endMs = startMs + 2 * HOUR;       /* calendar default length when no end time is given */
          lastMs = endOfLastDay - 1;        /* but it stays "upcoming" until the day is over */
        }
      } else {
        endMs = endOfLastDay;               /* all-day */
        lastMs = endOfLastDay - 1;
      }

      var catKey = normKey(raw.category);
      var found = null;
      CATS.forEach(function (c) { if (c.key === catKey || str(c.label).toLowerCase() === str(raw.category).toLowerCase()) found = c; });
      if (!found) {
        found = CATS.filter(function (c) { return c.key === 'community'; })[0] || CATS[CATS.length - 1] || { key: 'community' };
        if (window.console && raw.category) console.warn('Unknown category "' + raw.category + '" on "' + title + '". Showing it under ' + found.key + '.');
      }

      var status = normKey(raw.status) || 'upcoming';
      if (!STATUS[status]) {
        if (window.console) console.warn('Unknown status "' + raw.status + '" on "' + title + '". Using "upcoming".');
        status = 'upcoming';
      }

      var id = slug(raw.id) || slug(title + '-' + raw.date) || ('event-' + (i + 1));
      var base = id, n = 2;
      while (seen[id]) id = base + '-' + (n++);
      seen[id] = true;

      out.push({
        id: id, title: title, category: found.key, brand: str(raw.brand),
        date: ymdStr(s), s: s, e: e, sDay: dayNum(s), eDay: dayNum(e), multi: dayNum(e) > dayNum(s),
        st: st, et: et, hasStart: !!st, hasEnd: !!et, tz: tz,
        startMs: startMs, endMs: endMs, lastMs: lastMs,
        venue: str(raw.venue), address: str(raw.address), city: str(raw.city),
        description: str(raw.description), image: safeUrl(raw.image), imageAlt: str(raw.imageAlt),
        price: str(raw.price), status: status,
        buttonText: str(raw.buttonText), buttonUrl: safeUrl(raw.buttonUrl),
        secondaryButtonText: str(raw.secondaryButtonText), secondaryButtonUrl: safeUrl(raw.secondaryButtonUrl),
        recapUrl: safeUrl(raw.recapUrl),
        featured: raw.featured === true, sample: raw.sample === true,
        isPast: false
      });
    });
    return out;
  }

  var EVENTS = normalizeAll(loadRaw());
  var NOW = Date.now();

  function refreshPast() {
    NOW = Date.now();
    EVENTS.forEach(function (ev) { ev.isPast = ev.status === 'completed' || ev.lastMs < NOW; });
  }
  function byStart(a, b) { return (a.startMs - b.startMs) || (a.title < b.title ? -1 : 1); }
  function byStartDesc(a, b) { return -byStart(a, b); }

  /* ------------------------------------------------------------------
     Status, buttons
     ------------------------------------------------------------------ */
  /* A "Registration Open" / "Limited Spots" badge is only honest if there is a
     working link to register. With no link, it shows as plain "Upcoming". */
  function effStatus(ev) {
    if (ev.isPast) return 'completed';
    if ((ev.status === 'registration-open' || ev.status === 'limited-spots') && !ev.buttonUrl) return 'upcoming';
    return ev.status;
  }

  function primary(ev) {
    var recapText = statusInfo('completed').buttonText || 'View Recap';
    if (ev.isPast) {
      if (ev.recapUrl) return { url: ev.recapUrl, text: recapText };
      if (ev.status === 'completed' && ev.buttonUrl) return { url: ev.buttonUrl, text: ev.buttonText || recapText };
      return null;
    }
    if (!ev.buttonUrl) return null;
    return { url: ev.buttonUrl, text: ev.buttonText || statusInfo(effStatus(ev)).buttonText || 'Learn More' };
  }
  function secondary(ev) {
    if (!ev.secondaryButtonUrl) return null;
    return { url: ev.secondaryButtonUrl, text: ev.secondaryButtonText || 'More Info' };
  }
  function canAddToCal(ev) {
    return !ev.isPast && ev.status !== 'canceled' && ev.status !== 'postponed';
  }

  function btnHTML(url, text, cls) {
    var ext = isHttp(url);
    return '<a class="btn ' + cls + '" href="' + esc(url) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
      esc(text) + (ext ? '<span class="sr-only"> (opens in a new tab)</span>' : '') + '</a>';
  }

  function actionsHTML(ev) {
    var out = [], p = primary(ev), s = secondary(ev);
    if (p) out.push(btnHTML(p.url, p.text, 'btn--primary'));
    if (s) out.push(btnHTML(s.url, s.text, 'btn--outline'));
    if (canAddToCal(ev)) out.push('<button type="button" class="btn btn--ghost" data-ics="' + esc(ev.id) + '">Add to Calendar</button>');
    return out.length ? '<div class="event__actions">' + out.join('') + '</div>' : '';
  }

  /* ------------------------------------------------------------------
     Pieces of text shown on cards
     ------------------------------------------------------------------ */
  function dateText(ev) {
    var a = { weekday: 'short', month: 'short', day: 'numeric' };
    if (!ev.multi) return fmtDate(ev.s, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    return fmtDate(ev.s, a) + ' \u2013 ' + fmtDate(ev.e, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
  function timeText(ev) {
    if (!ev.hasStart) return '';
    var z = tzAbbr(ev.startMs, ev.tz);
    var a = fmtTime(ev.st), out;
    if (ev.multi) {
      out = 'Starts ' + a + (ev.hasEnd ? ' \u00b7 Ends ' + fmtTime(ev.et) : '');
    } else if (ev.hasEnd) {
      var b = fmtTime(ev.et);
      var sameSuffix = a.slice(-2) === b.slice(-2);
      out = (sameSuffix ? fmtTime(ev.st, false) : a) + ' \u2013 ' + b;
    } else {
      out = a;
    }
    return out + (z ? ' ' + z : '');
  }
  function mapUrl(ev) {
    var q = [ev.venue, ev.address, ev.city].filter(Boolean).join(', ');
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  }
  function whereHTML(ev) {
    var rest = [ev.address, ev.city].filter(Boolean).join(', ');
    if (!ev.venue && !rest) return '';
    var showMap = !!(ev.address || (ev.venue && ev.city));
    return '<p class="event__where">' +
      (ev.venue ? '<span class="venue">' + esc(ev.venue) + '</span>' + (rest ? ' \u2014 ' : '') : '') +
      (rest ? '<span>' + esc(rest) + '</span>' : '') +
      (showMap ? '<a href="' + esc(mapUrl(ev)) + '" target="_blank" rel="noopener noreferrer">Map<span class="sr-only"> for ' + esc(ev.title) + ' (opens in a new tab)</span></a>' : '') +
      '</p>';
  }
  function whenHTML(ev) {
    var t = timeText(ev);
    return '<p class="event__when"><time datetime="' + esc(ev.date) + '">' + esc(dateText(ev)) + '</time>' +
      (t ? '<span class="sep" aria-hidden="true">\u00b7</span><span>' + esc(t) + '</span>' : '') + '</p>';
  }
  function metaHTML(ev) {
    var cat = catOf(ev.category), st = effStatus(ev), parts = [];
    parts.push('<span class="tag">' + esc(cat.label) + '</span>');
    if (ev.brand && ev.brand.toLowerCase() !== str(cat.label).toLowerCase()) parts.push('<span class="brand">' + esc(ev.brand) + '</span>');
    if (st !== 'upcoming') parts.push('<span class="status status--' + esc(st) + '">' + esc(statusInfo(st).label) + '</span>');
    if (ev.sample) parts.push('<span class="sample-badge">Sample</span>');
    return '<p class="event__meta">' + parts.join('') + '</p>';
  }
  function descHTML(ev) {
    return ev.description ? '<p class="event__desc">' + esc(ev.description).replace(/\r?\n/g, '<br>') + '</p>' : '';
  }
  function priceHTML(ev) {
    return ev.price ? '<p class="event__price"><span class="label">Price</span>' + esc(ev.price) + '</p>' : '';
  }

  function cardHTML(ev) {
    var cat = catOf(ev.category);
    var cls = 'event' + (ev.isPast ? ' event--past' : '') + (ev.status === 'canceled' ? ' event--canceled' : '') + (ev.image ? ' event--img' : '');
    return '<article class="' + cls + '" id="ev-' + esc(ev.id) + '" style="--cat:' + esc(cat.color) + '"' + (ev.image ? ' data-has-img' : '') + '>' +
      '<div class="event__date" aria-hidden="true"><span class="mo">' + esc(fmtDate(ev.s, { month: 'short' })) + '</span>' +
      '<span class="day">' + ev.s.d + '</span><span class="dow">' + esc(fmtDate(ev.s, { weekday: 'short' })) + '</span></div>' +
      '<div class="event__body">' + metaHTML(ev) +
      '<h3 class="event__title">' + esc(ev.title) + '</h3>' +
      whenHTML(ev) + whereHTML(ev) + priceHTML(ev) + descHTML(ev) + actionsHTML(ev) + '</div>' +
      (ev.image ? '<figure class="event__img"><img src="' + esc(ev.image) + '" alt="' + esc(ev.imageAlt || 'Poster for ' + ev.title) + '" loading="lazy"></figure>' : '') +
      '</article>';
  }

  function relativeLabel(ev) {
    if (NOW >= ev.startMs && NOW <= ev.lastMs) return 'Happening now';
    var diff = ev.sDay - dayNum(todayInZone(ev.tz));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1 && diff <= 60) return 'In ' + diff + ' days';
    return '';
  }

  /* ------------------------------------------------------------------
     State + URL (?cat=music&view=calendar so category links can be shared)
     ------------------------------------------------------------------ */
  var state = { cat: 'all', view: 'list', showPast: false, cal: null, day: null };

  (function readURL() {
    try {
      var qs = new URLSearchParams(location.search);
      var c = qs.get('cat');
      if (c && CATS.some(function (x) { return x.key === c; })) state.cat = c;
      if (qs.get('view') === 'calendar') state.view = 'calendar';
    } catch (e) { /* ignore */ }
  })();

  function syncURL() {
    try {
      var qs = new URLSearchParams(location.search);
      if (state.cat === 'all') qs.delete('cat'); else qs.set('cat', state.cat);
      if (state.view === 'list') qs.delete('view'); else qs.set('view', state.view);
      var q = qs.toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
    } catch (e) { /* file:// or sandboxed: skip */ }
  }
  function matches(ev) { return state.cat === 'all' || ev.category === state.cat; }

  function pageUrl() {
    var u = str(CFG.siteUrl);
    return u || (location.href.split('#')[0].split('?')[0]);
  }

  /* ------------------------------------------------------------------
     Rendering: header bits
     ------------------------------------------------------------------ */
  function renderHeader() {
    if (CFG.tagline) byId('tagline').textContent = CFG.tagline;
    if (CFG.intro) byId('intro').textContent = CFG.intro;

    var links = (CFG.links || []).map(function (l) { return { label: str(l.label), url: safeUrl(l.url) }; })
      .filter(function (l) { return l.label && l.url; });
    var ul = byId('socialLinks');
    if (links.length) {
      ul.innerHTML = links.map(function (l) {
        return '<li><a href="' + esc(l.url) + '"' + (isHttp(l.url) ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(l.label) + '</a></li>';
      }).join('');
      ul.hidden = false;
    }

    var url = pageUrl();
    byId('pageUrl').value = url;
    byId('emailShare').href = 'mailto:?subject=' + encodeURIComponent(CFG.siteTitle || document.title) +
      '&body=' + encodeURIComponent((CFG.shareText || '') + ' ' + url);
    if (navigator.share) byId('shareBtn').hidden = false;

    byId('tzNote').textContent = 'All times are shown in ' + TZ.replace(/_/g, ' ') + ' unless an event says otherwise.';
    byId('copyright').textContent = '\u00a9 ' + new Date().getFullYear() + ' ' + (CFG.owner || '');

    if (str(CFG.siteUrl)) {
      var canon = document.createElement('link');
      canon.rel = 'canonical'; canon.href = str(CFG.siteUrl);
      document.head.appendChild(canon);
      var og = document.createElement('meta');
      og.setAttribute('property', 'og:url'); og.content = str(CFG.siteUrl);
      document.head.appendChild(og);
    }
  }

  function renderContact() {
    var c = CFG.contact || {};
    var email = str(c.email), form = safeUrl(c.formUrl);
    var html = '';
    if (email || form) {
      html += '<ul class="topics">' + (c.topics || []).map(function (t) {
        var href = email ? 'mailto:' + email + '?subject=' + encodeURIComponent(t.subject || t.label) : form;
        var ext = !email && isHttp(href);
        return '<li><a class="btn btn--outline" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(t.label) + '</a></li>';
      }).join('') + '</ul>';
    }
    if (email) html += '<p class="contact__email">Or email <a href="mailto:' + esc(email) + '">' + esc(email) + '</a></p>';
    var links = (CFG.links || []).map(function (l) { return { label: str(l.label), url: safeUrl(l.url) }; })
      .filter(function (l) { return l.label && l.url; });
    if (links.length) {
      html += '<ul class="contact__links">' + links.map(function (l) {
        return '<li><a href="' + esc(l.url) + '"' + (isHttp(l.url) ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(l.label) + '</a></li>';
      }).join('') + '</ul>';
    }
    if (!email && !form && !links.length) {
      html = '<p class="setup-hint">Contact details have not been added yet. Add your email and social links in <code>config.js</code> and they will appear here.</p>';
    }
    byId('contactBody').innerHTML = html;
  }

  /* ------------------------------------------------------------------
     Filters
     ------------------------------------------------------------------ */
  function buildChips() {
    var all = [{ key: 'all', label: 'All Events', color: '#c6ff3d' }].concat(CATS);
    byId('chips').innerHTML = all.map(function (c) {
      return '<button type="button" class="fbtn" data-cat="' + esc(c.key) + '" style="--cat:' + esc(c.color) + '" aria-pressed="false">' +
        esc(c.label) + '<span class="n" data-n="' + esc(c.key) + '"></span></button>';
    }).join('');
  }
  function updateChips() {
    var counts = { all: 0 };
    EVENTS.forEach(function (ev) {
      if (ev.isPast) return;
      counts.all++; counts[ev.category] = (counts[ev.category] || 0) + 1;
    });
    Array.prototype.forEach.call(byId('chips').querySelectorAll('.fbtn'), function (b) {
      var k = b.getAttribute('data-cat');
      b.setAttribute('aria-pressed', state.cat === k ? 'true' : 'false');
      var n = b.querySelector('.n');
      n.textContent = counts[k] ? '(' + counts[k] + ')' : '';
    });
  }

  /* ------------------------------------------------------------------
     Featured event
     ------------------------------------------------------------------ */
  function pickFeatured() {
    var ok = EVENTS.filter(function (e) { return !e.isPast && e.status !== 'canceled' && e.status !== 'postponed'; }).sort(byStart);
    for (var i = 0; i < ok.length; i++) if (ok[i].featured) return ok[i];
    return ok[0] || null;
  }
  function renderFeatured() {
    var box = byId('featured');
    var ev = pickFeatured();
    if (!ev) { box.hidden = true; box.innerHTML = ''; return; }
    var cat = catOf(ev.category), rel = relativeLabel(ev);
    var media = ev.image
      ? '<figure class="featured__media" data-has-img><img src="' + esc(ev.image) + '" alt="' + esc(ev.imageAlt || 'Poster for ' + ev.title) + '"></figure>'
      : '<div class="featured__media featured__stamp" aria-hidden="true"><span class="mo">' + esc(fmtDate(ev.s, { month: 'short' })) +
        '</span><span class="day">' + ev.s.d + '</span><span class="dow">' + esc(fmtDate(ev.s, { weekday: 'long' })) + '</span></div>';
    box.style.setProperty('--cat', cat.color);
    box.innerHTML =
      '<div class="featured__grid"><div class="featured__body">' +
      '<p class="featured__label" id="featuredLabel"><span>Next up</span>' + (rel ? '<span class="featured__rel">' + esc(rel) + '</span>' : '') + '</p>' +
      metaHTML(ev) +
      '<h2 class="featured__title">' + esc(ev.title) + '</h2>' +
      whenHTML(ev) + whereHTML(ev) + priceHTML(ev) + descHTML(ev) + actionsHTML(ev) +
      '</div>' + media + '</div>';
    box.hidden = false;
  }

  /* ------------------------------------------------------------------
     List view
     ------------------------------------------------------------------ */
  function monthLabel(o) { return fmtDate({ y: o.y, m: o.m, d: 1 }, { month: 'long', year: 'numeric' }); }

  function emptyHTML() {
    if (!EVENTS.length) {
      return '<p class="empty">No events are scheduled right now. Check back soon, or get in touch using the contact section below.</p>';
    }
    var label = state.cat === 'all' ? 'events' : catOf(state.cat).label + ' events';
    return '<div class="empty"><p style="margin:0">No upcoming ' + esc(label) + ' on the schedule yet. Check back soon.</p>' +
      (state.cat !== 'all' ? '<button type="button" class="btn btn--outline" data-showall>Show all events</button>' : '') + '</div>';
  }

  function renderList() {
    var up = EVENTS.filter(function (e) { return !e.isPast && matches(e); }).sort(byStart);
    var html = '';
    if (!up.length) {
      html = emptyHTML();
    } else {
      var groups = [], last = '';
      up.forEach(function (ev) {
        var k = ev.s.y + '-' + pad(ev.s.m);
        if (k !== last) { groups.push({ label: monthLabel(ev.s), items: [] }); last = k; }
        groups[groups.length - 1].items.push(ev);
      });
      html = groups.map(function (g) {
        return '<section class="month" aria-label="' + esc(g.label) + '"><h3 class="month__h">' + esc(g.label) + '</h3>' + g.items.map(cardHTML).join('') + '</section>';
      }).join('');
    }
    byId('upcomingList').innerHTML = html;
    byId('resultsStatus').textContent = up.length + (up.length === 1 ? ' upcoming event shown' : ' upcoming events shown');

    /* past events archive */
    var pastAll = EVENTS.filter(function (e) { return e.isPast; });
    var past = pastAll.filter(matches).sort(byStartDesc);
    var sec = byId('pastSection'), btn = byId('togglePast'), list = byId('pastList');
    sec.hidden = pastAll.length === 0;
    btn.textContent = (state.showPast ? 'Hide' : 'Show') + ' past events (' + past.length + ')';
    btn.setAttribute('aria-expanded', state.showPast ? 'true' : 'false');
    list.hidden = !state.showPast;
    list.innerHTML = state.showPast
      ? (past.length ? past.map(cardHTML).join('') : '<p class="empty">No past events in this category.</p>')
      : '';
  }

  /* ------------------------------------------------------------------
     Calendar view
     ------------------------------------------------------------------ */
  function initCalMonth() {
    var up = EVENTS.filter(function (e) { return !e.isPast; }).sort(byStart)[0];
    var t = todayInZone(TZ);
    state.cal = up ? { y: up.s.y, m: up.s.m } : { y: t.y, m: t.m };
    var nowMonth = { y: t.y, m: t.m };
    if (up && dayNum({ y: up.s.y, m: up.s.m, d: 1 }) < dayNum({ y: nowMonth.y, m: nowMonth.m, d: 1 })) state.cal = nowMonth;
  }

  function renderCalendar() {
    if (!state.cal) initCalMonth();
    var y = state.cal.y, m = state.cal.m;
    var firstDay = dayNum({ y: y, m: m, d: 1 });
    var dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var lastDay = firstDay + dim - 1;
    var lead = (new Date(firstDay * DAY).getUTCDay() - WEEK_START + 7) % 7;
    var today = dayNum(todayInZone(TZ));

    var byDay = {};
    EVENTS.filter(matches).forEach(function (ev) {
      var a = ev.sDay, b = Math.min(ev.eDay, ev.sDay + 62);
      for (var k = a; k <= b; k++) { (byDay[k] = byDay[k] || []).push(ev); }
    });
    Object.keys(byDay).forEach(function (k) { byDay[k].sort(byStart); });

    var head = '';
    for (var i = 0; i < 7; i++) {
      var idx = (WEEK_START + i) % 7; /* Jan 1 2023 was a Sunday */
      var d = { y: 2023, m: 1, d: 1 + idx };
      head += '<th scope="col"><abbr title="' + esc(fmtDate(d, { weekday: 'long' })) + '">' + esc(fmtDate(d, { weekday: 'short' })) + '</abbr></th>';
    }

    var cells = '', total = Math.ceil((lead + dim) / 7) * 7;
    for (var c = 0; c < total; c++) {
      if (c % 7 === 0) cells += '<tr>';
      var n = c - lead + 1;
      if (n < 1 || n > dim) {
        cells += '<td class="cal-pad"></td>';
      } else {
        var dn = firstDay + n - 1, list = byDay[dn] || [], key = ymdStr(fromDayNum(dn));
        var cls = dn === today ? ' cal-today' : '';
        if (list.length) {
          var chips = list.slice(0, 2).map(function (ev) {
            return '<span class="chip' + (ev.isPast ? ' chip--past' : '') + '" style="--cat:' + esc(catOf(ev.category).color) + '"><span class="chip__t">' + esc(ev.title) + '</span></span>';
          }).join('');
          if (list.length > 2) chips += '<span class="chip chip--more"><span class="chip__t">+' + (list.length - 2) + ' more</span></span>';
          cells += '<td><button type="button" class="cal-day' + cls + '" data-date="' + key + '" aria-pressed="' + (state.day === key ? 'true' : 'false') +
            '" aria-label="' + esc(fmtDate(fromDayNum(dn), { weekday: 'long', month: 'long', day: 'numeric' })) + ': ' + list.length + (list.length === 1 ? ' event' : ' events') + '">' +
            '<span class="cal-num">' + n + '</span><span class="cal-chips">' + chips + '</span></button></td>';
        } else {
          cells += '<td><div class="cal-day' + cls + '"><span class="cal-num">' + n + '</span></div></td>';
        }
      }
      if (c % 7 === 6) cells += '</tr>';
    }

    var shown, sub;
    if (state.day && byDay[dayNum(parseYMD(state.day))] && dayNum(parseYMD(state.day)) >= firstDay && dayNum(parseYMD(state.day)) <= lastDay) {
      shown = byDay[dayNum(parseYMD(state.day))];
      sub = '<span>Events on ' + esc(fmtDate(parseYMD(state.day), { weekday: 'long', month: 'long', day: 'numeric' })) + '</span>' +
        '<button type="button" class="btn btn--outline btn--sm" data-clearday>Show whole month</button>';
    } else {
      state.day = null;
      var seen = {};
      shown = [];
      for (var k = firstDay; k <= lastDay; k++) (byDay[k] || []).forEach(function (ev) { if (!seen[ev.id]) { seen[ev.id] = 1; shown.push(ev); } });
      shown.sort(byStart);
      sub = '<span>All events in ' + esc(monthLabel({ y: y, m: m })) + '</span>';
    }

    byId('calView').innerHTML =
      '<div class="cal__head"><h3 class="cal__title" id="calTitle">' + esc(monthLabel({ y: y, m: m })) + '</h3>' +
      '<div class="cal__nav"><button type="button" class="btn btn--outline btn--sm" data-calnav="-1" aria-label="Previous month">\u2190 Prev</button>' +
      '<button type="button" class="btn btn--outline btn--sm" data-calnav="0">Today</button>' +
      '<button type="button" class="btn btn--outline btn--sm" data-calnav="1" aria-label="Next month">Next \u2192</button></div></div>' +
      '<table class="cal" aria-labelledby="calTitle"><thead><tr>' + head + '</tr></thead><tbody>' + cells + '</tbody></table>' +
      '<div class="cal__sub">' + sub + '</div>' +
      (shown.length ? shown.map(cardHTML).join('') : '<p class="empty">Nothing scheduled this month' + (state.cat === 'all' ? '' : ' in this category') + '.</p>');

    byId('resultsStatus').textContent = monthLabel({ y: y, m: m }) + ': ' + shown.length + (shown.length === 1 ? ' event' : ' events');
  }

  /* ------------------------------------------------------------------
     Master render
     ------------------------------------------------------------------ */
  function render() {
    refreshPast();
    updateChips();
    renderFeatured();
    var isList = state.view === 'list';
    byId('listView').hidden = !isList;
    byId('calView').hidden = isList;
    Array.prototype.forEach.call(document.querySelectorAll('.vbtn'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-view') === state.view ? 'true' : 'false');
    });
    if (isList) renderList(); else renderCalendar();
    byId('sampleBanner').hidden = !EVENTS.some(function (e) { return e.sample; });
    byId('previewBanner').hidden = !PREVIEW;
    syncURL();
  }

  /* ------------------------------------------------------------------
     Calendar download (.ics)
     Times are written as exact UTC moments, so every calendar app shows
     the correct local time no matter where the visitor is.
     ------------------------------------------------------------------ */
  function icsEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  function foldLine(line) {
    var enc = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
    var out = '', cur = '', bytes = 0;
    Array.from(line).forEach(function (ch) {
      var b = enc ? enc.encode(ch).length : 1;
      if (bytes + b > 75) { out += cur + '\r\n'; cur = ' '; bytes = 1; }
      cur += ch; bytes += b;
    });
    return out + cur;
  }
  function utcStamp(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function dateOnly(o) { return o.y + pad(o.m) + pad(o.d); }

  function buildICS(ev) {
    var loc = [ev.venue, ev.address, ev.city].filter(Boolean).join(', ');
    var p = primary(ev);
    var descParts = [];
    if (ev.sample) descParts.push('SAMPLE EVENT - not a real event.');
    if (ev.description) descParts.push(ev.description);
    if (ev.price) descParts.push('Price: ' + ev.price);
    if (p && isHttp(p.url)) descParts.push(p.text + ': ' + p.url);
    descParts.push('Schedule: ' + pageUrl());
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jawsatak//Events & Classes//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + ev.id + '-' + ev.date + '@jawsatak-events',
      'DTSTAMP:' + utcStamp(Date.now())
    ];
    if (ev.hasStart) {
      lines.push('DTSTART:' + utcStamp(ev.startMs), 'DTEND:' + utcStamp(ev.endMs));
    } else {
      lines.push('DTSTART;VALUE=DATE:' + dateOnly(ev.s), 'DTEND;VALUE=DATE:' + dateOnly(addDays(ev.e, 1)));
    }
    lines.push('SUMMARY:' + icsEscape(ev.title));
    if (loc) lines.push('LOCATION:' + icsEscape(loc));
    lines.push('DESCRIPTION:' + icsEscape(descParts.join('\n')));
    lines.push('URL:' + ((p && isHttp(p.url)) ? p.url : pageUrl()));
    lines.push('STATUS:' + (ev.status === 'canceled' ? 'CANCELLED' : 'CONFIRMED'));
    lines.push('END:VEVENT', 'END:VCALENDAR');
    return lines.map(foldLine).join('\r\n') + '\r\n';
  }

  function downloadICS(id) {
    var ev = EVENTS.filter(function (e) { return e.id === id; })[0];
    if (!ev) return;
    var blob = new Blob([buildICS(ev)], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (slug(ev.title) || 'event') + '.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ------------------------------------------------------------------
     Search-engine data (JSON-LD). Sample events are never included.
     ------------------------------------------------------------------ */
  function injectJSONLD() {
    var items = EVENTS.filter(function (e) { return !e.sample && !e.isPast; }).sort(byStart).map(function (ev) {
      var o = {
        '@context': 'https://schema.org', '@type': 'Event', name: ev.title,
        startDate: ev.hasStart ? isoWithOffset(ev.startMs, ev.tz) : ev.date,
        endDate: (ev.hasStart && ev.hasEnd) ? isoWithOffset(ev.endMs, ev.tz) : ymdStr(ev.e),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: ev.status === 'canceled' ? 'https://schema.org/EventCancelled' :
          ev.status === 'postponed' ? 'https://schema.org/EventPostponed' : 'https://schema.org/EventScheduled',
        url: pageUrl() + '#ev-' + ev.id
      };
      if (ev.description) o.description = ev.description;
      var place = [ev.address, ev.city].filter(Boolean).join(', ');
      if (ev.venue || place) o.location = { '@type': 'Place', name: ev.venue || place, address: place || ev.venue };
      if (ev.image) { try { o.image = new URL(ev.image, location.href).href; } catch (e) { /* skip */ } }
      return o;
    });
    var old = document.getElementById('ld-events');
    if (old) old.remove();
    if (!items.length) return;
    var s = document.createElement('script');
    s.type = 'application/ld+json'; s.id = 'ld-events';
    s.textContent = JSON.stringify(items);
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------
     Sharing
     ------------------------------------------------------------------ */
  function say(msg) {
    var el = byId('shareMsg');
    el.textContent = msg;
    setTimeout(function () { if (el.textContent === msg) el.textContent = ''; }, 2500);
  }
  function copyLink() {
    var input = byId('pageUrl'), url = input.value;
    function fallback() {
      input.focus(); input.select();
      try { say(document.execCommand('copy') ? 'Link copied' : 'Press Ctrl/Cmd+C to copy'); }
      catch (e) { say('Press Ctrl/Cmd+C to copy'); }
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () { say('Link copied'); }, fallback);
    } else { fallback(); }
  }

  /* ------------------------------------------------------------------
     Events (click handling)
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button, a') : null;
    if (!t) return;

    if (t.hasAttribute('data-ics')) { downloadICS(t.getAttribute('data-ics')); return; }
    if (t.hasAttribute('data-cat')) { state.cat = t.getAttribute('data-cat'); state.day = null; render(); return; }
    if (t.hasAttribute('data-showall')) { state.cat = 'all'; render(); return; }
    if (t.hasAttribute('data-view')) { state.view = t.getAttribute('data-view'); render(); return; }
    if (t.hasAttribute('data-date')) { state.day = t.getAttribute('data-date'); renderCalendar(); var s = document.querySelector('.cal__sub'); if (s) s.scrollIntoView({ block: 'nearest' }); return; }
    if (t.hasAttribute('data-clearday')) { state.day = null; renderCalendar(); return; }
    if (t.hasAttribute('data-calnav')) {
      var step = +t.getAttribute('data-calnav');
      if (step === 0) { var td = todayInZone(TZ); state.cal = { y: td.y, m: td.m }; }
      else {
        var nm = state.cal.m + step, ny = state.cal.y;
        if (nm < 1) { nm = 12; ny--; } else if (nm > 12) { nm = 1; ny++; }
        state.cal = { y: ny, m: nm };
      }
      state.day = null; renderCalendar(); return;
    }
    if (t.id === 'togglePast') { state.showPast = !state.showPast; renderList(); return; }
    if (t.id === 'copyLink') { copyLink(); return; }
    if (t.id === 'shareBtn') {
      navigator.share({ title: CFG.siteTitle || document.title, text: CFG.shareText || '', url: pageUrl() }).catch(function () { /* cancelled */ });
    }
  });

  /* A poster that fails to load is removed so there is never a broken image. */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var fig = img.closest('figure');
    var box = img.closest('[data-has-img]');
    var grid = img.closest('.featured__grid');
    if (fig) fig.remove();
    if (box) box.classList.add('img-failed');
    if (grid) grid.classList.add('img-failed');
  }, true);

  /* ------------------------------------------------------------------
     Start
     ------------------------------------------------------------------ */
  renderHeader();
  renderContact();
  buildChips();
  refreshPast();
  render();
  injectJSONLD();

  if (location.hash && /^#ev-/.test(location.hash)) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  /* Test hooks (harmless in production) */
  window.__JAWS__ = {
    zonedToUtc: zonedToUtc, parseYMD: parseYMD, parseHM: parseHM, normalizeAll: normalizeAll,
    buildICS: buildICS, events: function () { return EVENTS; }, state: state, safeUrl: safeUrl, TZ: TZ
  };
})();
