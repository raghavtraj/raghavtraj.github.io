/* ══════════════════════════════════════════════════════════
   Save the Date — shared behaviour for both invitations.

   Nothing in here is page-specific. Every page declares its
   own event with data-* attributes on an element carrying
   [data-event]; this file reads them.

       data-title       what the guest sees in their calendar
       data-start       "YYYY-MM-DDTHH:MM" at the venue
       data-end         "YYYY-MM-DDTHH:MM" at the venue
       data-tz          UTC offset of the venue, e.g. "+05:30"
       data-location    address text for the calendar entry
       data-map         Google Maps URL for the "View Venue" link
       data-countdown   "true" on the event the timer counts to
   ══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var DEFAULT_TZ = "+05:30"; // India Standard Time

  /* ── the gate ──────────────────────────────────────────── */

  var gate = document.getElementById("gate");
  var openBtn = document.getElementById("openInvitation");

  if (gate && openBtn) {
    openBtn.addEventListener("click", function () {
      gate.classList.add("is-open");
      document.body.classList.remove("is-locked");
      window.setTimeout(function () {
        gate.setAttribute("hidden", "");
      }, 900);
    });
  } else {
    document.body.classList.remove("is-locked");
  }

  /* ── reveal on scroll ──────────────────────────────────── */

  var revealables = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── falling petals ────────────────────────────────────── */

  var petalLayer = document.getElementById("petals");
  var wantsCalm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (petalLayer && !wantsCalm) {
    var count = window.innerWidth < 640 ? 14 : 26;

    for (var i = 0; i < count; i++) {
      var petal = document.createElement("span");
      var size = 7 + Math.random() * 9;

      petal.className = "petal";
      petal.style.left = (Math.random() * 100).toFixed(2) + "%";
      petal.style.width = size.toFixed(1) + "px";
      petal.style.height = (size * 0.85).toFixed(1) + "px";
      petal.style.opacity = (0.28 + Math.random() * 0.4).toFixed(2);
      petal.style.animationDuration = (11 + Math.random() * 14).toFixed(1) + "s";
      petal.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
      petal.style.setProperty("--drift", (Math.random() * 18 - 9).toFixed(1) + "vw");

      petalLayer.appendChild(petal);
    }
  }

  /* ── events declared on the page ───────────────────────── */

  /** Reads one [data-event] element into a plain object. */
  function readEvent(el) {
    var tz = el.dataset.tz || DEFAULT_TZ;
    return {
      title: el.dataset.title || document.title,
      start: new Date(el.dataset.start + ":00" + tz),
      end: new Date((el.dataset.end || el.dataset.start) + ":00" + tz),
      location: el.dataset.location || "",
      map: el.dataset.map || "",
      isCountdown: el.dataset.countdown === "true",
      el: el
    };
  }

  var events = Array.prototype.map.call(
    document.querySelectorAll("[data-event]"),
    readEvent
  ).filter(function (e) { return !isNaN(e.start.getTime()); });

  /* Point each card's "View Venue" link at its own map URL. */
  events.forEach(function (event) {
    var link = event.el.querySelector("[data-map-link]");
    if (link && event.map) { link.setAttribute("href", event.map); }
  });

  /* ── countdown ─────────────────────────────────────────── */

  var grid = document.getElementById("countdownGrid");
  var doneNote = document.getElementById("countdownDone");
  var target = events.filter(function (e) { return e.isCountdown; })[0] || events[0];

  if (grid && target) {
    var slots = {
      days:  grid.querySelector("[data-days]"),
      hours: grid.querySelector("[data-hours]"),
      mins:  grid.querySelector("[data-mins]"),
      secs:  grid.querySelector("[data-secs]")
    };

    var pad = function (n) { return String(n).padStart(2, "0"); };

    var tick = function () {
      var remaining = target.start.getTime() - Date.now();

      if (remaining <= 0) {
        Object.keys(slots).forEach(function (k) {
          if (slots[k]) { slots[k].textContent = "00"; }
        });
        if (doneNote) { doneNote.hidden = false; }
        window.clearInterval(timer);
        return;
      }

      var secs = Math.floor(remaining / 1000);
      if (slots.days)  { slots.days.textContent  = pad(Math.floor(secs / 86400)); }
      if (slots.hours) { slots.hours.textContent = pad(Math.floor(secs / 3600) % 24); }
      if (slots.mins)  { slots.mins.textContent  = pad(Math.floor(secs / 60) % 60); }
      if (slots.secs)  { slots.secs.textContent  = pad(secs % 60); }
    };

    tick();
    var timer = window.setInterval(tick, 1000);
  }

  /* ── add to calendar ───────────────────────────────────── */

  /** "20261121T040000Z" — the UTC stamp both Google and .ics want. */
  function stamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  }

  function googleUrl(event) {
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: stamp(event.start) + "/" + stamp(event.end),
      location: event.location,
      details: "We can't wait to celebrate with you."
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  /** Escapes the characters iCalendar treats as syntax. */
  function icsEscape(text) {
    return String(text).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  }

  function icsBlob(event) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Save the Date//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + stamp(event.start) + "-" + Math.random().toString(36).slice(2) + "@savethedate",
      "DTSTAMP:" + stamp(new Date()),
      "DTSTART:" + stamp(event.start),
      "DTEND:" + stamp(event.end),
      "SUMMARY:" + icsEscape(event.title),
      "LOCATION:" + icsEscape(event.location),
      "DESCRIPTION:" + icsEscape("We can't wait to celebrate with you."),
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  }

  var actions = document.getElementById("calendarActions");

  if (actions && events.length) {
    events.forEach(function (event) {
      var label = events.length > 1 ? event.title.split("—").pop().trim() : "";

      var google = document.createElement("a");
      google.className = "btn";
      google.href = googleUrl(event);
      google.target = "_blank";
      google.rel = "noopener";
      google.textContent = label ? "Google · " + label : "Google Calendar";
      actions.appendChild(google);

      var download = document.createElement("button");
      download.className = "btn btn--ghost";
      download.type = "button";
      download.textContent = label ? "Apple / Outlook · " + label : "Apple / Outlook";
      download.addEventListener("click", function () {
        var url = URL.createObjectURL(icsBlob(event));
        var a = document.createElement("a");
        a.href = url;
        a.download = event.title.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") + ".ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
      actions.appendChild(download);
    });
  }
})();
