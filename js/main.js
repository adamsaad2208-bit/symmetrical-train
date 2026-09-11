(function () {
  "use strict";

  var footerYear = document.getElementById("footer-year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     Header: solid background after scrolling past the hero fold
  --------------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var scrollThreshold = 80;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  document.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------------------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------------
     Reveal-on-scroll
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------------
     Hero — l'arrivée au scroll
     A tall (420vh) pinned section whose video's currentTime is driven by
     scroll progress, so the 24s arrival film scrubs in lockstep with the
     reader's scroll instead of autoplaying on a timer.
  --------------------------------------------------------------------- */
  var heroSection = document.querySelector(".hero");
  var heroVideo = document.getElementById("hero-video");
  var heroFallback = document.getElementById("hero-fallback");
  var heroCopy = document.getElementById("hero-copy");
  var heroScrollCue = document.getElementById("hero-scroll-cue");

  var videoReady = false;
  var videoDuration = 24; // matches the requested 24s arrival film

  function markVideoReady() {
    if (videoReady) return;
    if (heroVideo.duration && isFinite(heroVideo.duration)) {
      videoDuration = heroVideo.duration;
    }
    videoReady = true;
    heroVideo.classList.add("is-ready");
    heroFallback.style.opacity = "0";
  }

  heroVideo.addEventListener("loadedmetadata", markVideoReady);
  heroVideo.addEventListener("canplay", markVideoReady);
  heroVideo.addEventListener("error", function () {
    // No video source available yet — the Ken Burns fallback image stays visible.
    videoReady = false;
  });

  var ticking = false;

  function renderHeroProgress() {
    ticking = false;
    var rect = heroSection.getBoundingClientRect();
    var scrollableHeight = heroSection.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    var scrolled = -rect.top;
    var progress = scrolled / scrollableHeight;
    progress = Math.max(0, Math.min(1, progress));

    if (videoReady && !isNaN(videoDuration)) {
      var t = progress * videoDuration;
      if (Math.abs(heroVideo.currentTime - t) > 0.03) {
        try { heroVideo.currentTime = t; } catch (e) {}
      }
    }

    // Fade the overlay copy out over the first ~14% of scroll, back in at the very top.
    var copyFade = 1 - Math.min(1, progress / 0.14);
    heroCopy.style.opacity = String(copyFade);
    heroCopy.style.pointerEvents = copyFade < 0.05 ? "none" : "auto";

    var cueFade = 1 - Math.min(1, progress / 0.05);
    heroScrollCue.style.opacity = String(cueFade);
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(renderHeroProgress);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  renderHeroProgress();

  /* ---------------------------------------------------------------------
     Booking form — client-side confirmation
     (No backend is wired up yet; this gives a real UX for capturing
     reservation requests while that integration is connected.)
  --------------------------------------------------------------------- */
  var bookingForm = document.getElementById("booking-form");
  var formSuccess = document.getElementById("form-success");
  var arriveeInput = document.getElementById("arrivee");
  var departInput = document.getElementById("depart");

  var today = new Date().toISOString().split("T")[0];
  arriveeInput.setAttribute("min", today);
  departInput.setAttribute("min", today);

  arriveeInput.addEventListener("change", function () {
    if (arriveeInput.value) {
      var next = new Date(arriveeInput.value);
      next.setDate(next.getDate() + 1);
      var minDepart = next.toISOString().split("T")[0];
      departInput.setAttribute("min", minDepart);
      if (departInput.value && departInput.value < minDepart) {
        departInput.value = minDepart;
      }
    }
  });

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    bookingForm.hidden = true;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
