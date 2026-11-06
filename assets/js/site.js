/* =========================================================
   NexaTrips & Travels — site script
   ---------------------------------------------------------
   EDIT THIS BLOCK. Everything contact-related lives here.
   See README.md for the full checklist.
   ========================================================= */

const CONFIG = {
  // WhatsApp number in international format: digits only,
  // no "+", no spaces, no leading zeros. Example: "639171234567"
  whatsapp: "+6422 034 2424",

  // Where enquiries should be emailed.
  email: "hello@nexatripsandtravels.com",

  // Email-delivery endpoint. Leave as "" to send form enquiries
  // straight to WhatsApp instead. To receive them by email, set this to
  //   "https://formsubmit.co/ajax/your-real-email@example.com"
  // and confirm the activation email FormSubmit sends you once.
  formEndpoint: ""
};

(function () {
  "use strict";

  var WA_TEXT = "Hi NexaTrips! I'd like help planning a trip.";

  /* ---------------- Config application ---------------- */

  function waHref(text) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text || WA_TEXT);
  }

  function applyConfig() {
    document.querySelectorAll("[data-wa]").forEach(function (link) {
      // Keep each link's own prefilled message if it has one.
      var text = WA_TEXT;
      try {
        text = new URL(link.href).searchParams.get("text") || WA_TEXT;
      } catch (error) {
        text = WA_TEXT;
      }
      link.href = waHref(text);
    });

    var emailLink = document.getElementById("emailLink");
    if (emailLink) {
      emailLink.href = "mailto:" + CONFIG.email;
      emailLink.textContent = CONFIG.email;
    }

    var form = document.getElementById("contactForm");
    if (form && CONFIG.formEndpoint) form.setAttribute("action", CONFIG.formEndpoint);

    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ---------------- Header + mobile nav ---------------- */

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 24);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });
  }

  /* ---------------- Scroll reveal ---------------- */

  var revealItems = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 3, 2) * 90 + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------------- Contact form ---------------- */

  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  function setStatus(message, type) {
    if (!status) return;
    status.innerHTML = message;
    status.className = "form-status is-visible " + (type === "error" ? "is-error" : "is-success");
  }

  function clearStatus() {
    if (!status) return;
    status.className = "form-status";
    status.textContent = "";
  }

  function fieldValue(name) {
    var el = form.elements[name];
    return el && el.value ? el.value.trim() : "";
  }

  function validationMessage(field) {
    if (field.name === "name" && !field.value.trim()) return "Please add your name.";
    if (field.name === "email") {
      if (!field.value.trim()) return "Please add an email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) return "That email address doesn't look right.";
    }
    if (field.name === "message" && !field.value.trim()) return "Please tell us a little about the trip.";
    return "";
  }

  function validate() {
    var required = ["name", "email", "message"];
    var firstInvalid = null;

    required.forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      var message = validationMessage(field);

      if (message) {
        field.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = { field: field, message: message };
      } else {
        field.removeAttribute("aria-invalid");
      }
    });

    return firstInvalid;
  }

  function buildWhatsAppMessage() {
    var lines = ["Hi NexaTrips! I'd like help planning a trip.", ""];
    var pairs = [
      ["Name", fieldValue("name")],
      ["Email", fieldValue("email")],
      ["WhatsApp", fieldValue("phone")],
      ["Destination", fieldValue("destination")],
      ["Dates", fieldValue("dates")],
      ["Travellers", fieldValue("travellers")],
      ["Budget", fieldValue("budget")],
      ["Notes", fieldValue("message")]
    ];

    pairs.forEach(function (pair) {
      if (pair[1]) lines.push(pair[0] + ": " + pair[1]);
    });

    return lines.join("\n");
  }

  function openWhatsApp(text) {
    window.open(waHref(text), "_blank", "noopener");
  }

  if (form) {
    ["name", "email", "message"].forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true" && !validationMessage(field)) {
          field.removeAttribute("aria-invalid");
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearStatus();

      var problem = validate();
      if (problem) {
        problem.field.focus();
        setStatus(problem.message, "error");
        return;
      }

      // No email backend configured yet: hand the enquiry to WhatsApp.
      if (!CONFIG.formEndpoint) {
        openWhatsApp(buildWhatsAppMessage());
        setStatus(
          "Opening WhatsApp with your details filled in — just tap send there. " +
          "Prefer email? Write to <a href=\"mailto:" + CONFIG.email + "\">" + CONFIG.email + "</a>.",
          "success"
        );
        return;
      }

      var payload = new FormData(form);
      payload.append("_replyto", payload.get("email"));
      var label = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Sending…";
      }

      fetch(CONFIG.formEndpoint, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed with " + response.status);
          return response.json().catch(function () { return {}; });
        })
        .then(function () {
          form.reset();
          setStatus(
            "Thanks — your enquiry is on its way. We usually reply within a few hours. " +
            "In a hurry? Message us on WhatsApp instead.",
            "success"
          );
        })
        .catch(function () {
          setStatus(
            "That didn't send — you can try again, or message us on WhatsApp and we'll pick it up there.",
            "error"
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = label;
          }
        });
    });
  }

  /* ---------------- WhatsApp widget ---------------- */

  var fab = document.getElementById("waFab");
  var panel = document.getElementById("waPanel");
  var closeBtn = document.getElementById("waClose");
  var waForm = document.getElementById("waForm");
  var waMessage = document.getElementById("waMessage");

  function setPanel(open) {
    if (!panel || !fab) return;
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && waMessage) {
      window.setTimeout(function () { waMessage.focus(); }, 120);
    }
  }

  if (fab && panel) {
    fab.addEventListener("click", function () {
      setPanel(panel.hidden);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setPanel(false);
        fab.focus();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        setPanel(false);
        fab.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (panel.hidden) return;
      if (panel.contains(event.target) || fab.contains(event.target)) return;
      setPanel(false);
    });
  }

  if (waForm) {
    waForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var typed = waMessage ? waMessage.value.trim() : "";
      openWhatsApp(typed ? "Hi NexaTrips! " + typed : WA_TEXT);
      setPanel(false);
      if (waMessage) waMessage.value = "";
    });
  }

  /* ---------------- Boot ---------------- */
  applyConfig();
})();
