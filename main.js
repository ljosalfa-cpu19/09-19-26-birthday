/* =========================================================================
   MIDNIGHT ROSE — main.js
   Shared across every page: particles, transitions, nav, music, easter egg.
   ========================================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 720;

  /* ---------------------------------------------------------------------
     PARTICLE LAYER — falling hearts + tiny gold stars
     --------------------------------------------------------------------- */
  function initParticles() {
    if (prefersReducedMotion) return;

    let layer = document.getElementById("particle-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "particle-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
    }

    const heartSymbols = ["♡", "❤", "♥"];
    const starSymbols = ["✦", "✧", "·", "˚"];
    const heartColors = ["var(--dusty-rose)", "var(--champagne)", "var(--ivory)"];

    const maxHearts = isMobile ? 7 : 14;
    const maxStars = isMobile ? 10 : 20;

    function spawnHeart() {
      const el = document.createElement("span");
      el.className = "particle-heart";
      el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
      const size = 12 + Math.random() * 18;
      el.style.fontSize = size + "px";
      const duration = 9 + Math.random() * 8;
      el.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      el.style.setProperty("--spin", (Math.random() * 80 - 40) + "deg");
      el.style.setProperty("--peak-opacity", (0.5 + Math.random() * 0.4).toFixed(2));
      el.style.animation = `fall ${duration}s linear forwards`;
      layer.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000 + 200);
    }

    function spawnStar() {
      const el = document.createElement("span");
      el.className = "particle-star";
      el.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.top = Math.random() * 100 + "vh";
      el.style.position = "fixed";
      const duration = 2.5 + Math.random() * 3;
      el.style.animation = `twinkle ${duration}s ease-in-out infinite`;
      layer.appendChild(el);
      // stars persist; remove eventually to keep DOM light
      setTimeout(() => el.remove(), 14000);
    }

    // seed a few stars immediately for ambience
    for (let i = 0; i < maxStars; i++) {
      setTimeout(spawnStar, i * 300);
    }

    let heartCount = 0;
    const heartInterval = setInterval(() => {
      if (document.hidden) return;
      spawnHeart();
      heartCount++;
    }, isMobile ? 1400 : 850);

    const starInterval = setInterval(() => {
      if (document.hidden) return;
      spawnStar();
    }, isMobile ? 1600 : 900);

    window.addEventListener("beforeunload", () => {
      clearInterval(heartInterval);
      clearInterval(starInterval);
    });
  }

  /* Public helper: a short burst of hearts, used on lock success / envelope open */
  window.MidnightRose = window.MidnightRose || {};
  window.MidnightRose.burstHearts = function (count = 18) {
    if (prefersReducedMotion) return;
    let layer = document.getElementById("particle-layer");
    if (!layer) return;
    const heartSymbols = ["♡", "❤", "♥"];
    const heartColors = ["var(--dusty-rose)", "var(--champagne)", "var(--ivory)"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement("span");
        el.className = "particle-heart";
        el.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        el.style.left = 30 + Math.random() * 40 + "vw";
        el.style.top = "40vh";
        el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        el.style.fontSize = 14 + Math.random() * 16 + "px";
        el.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
        el.style.setProperty("--spin", (Math.random() * 120 - 60) + "deg");
        el.style.setProperty("--peak-opacity", "0.9");
        el.style.animation = "fall 3.2s ease-out forwards";
        layer.appendChild(el);
        setTimeout(() => el.remove(), 3400);
      }, i * 40);
    }
  };

  /* ---------------------------------------------------------------------
     PAGE TRANSITIONS
     A small overlay fades in before navigating to a new page, and fades
     out again once the new page has loaded (via body.page-enter classes).
     --------------------------------------------------------------------- */
  function initTransitions() {
    let veil = document.getElementById("transition-veil");
    if (!veil) {
      veil = document.createElement("div");
      veil.id = "transition-veil";
      veil.setAttribute("aria-hidden", "true");
      document.body.appendChild(veil);
    }

    // Fade the incoming page in
    document.body.classList.add("page-enter");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.add("page-enter-active");
      });
    });

    // Intercept internal link clicks for a smoother outward transition
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-transition]");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || link.target === "_blank") return;
      e.preventDefault();
      veil.classList.add("active");
      window.MidnightRose.burstHearts(10);
      setTimeout(() => {
        window.location.href = href;
      }, prefersReducedMotion ? 0 : 450);
    });
  }

  /* ---------------------------------------------------------------------
     NAVIGATION — highlight current page + mobile hamburger
     --------------------------------------------------------------------- */
  function initNav() {
    const current = document.body.dataset.page;
    document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
      if (a.dataset.page === current) a.classList.add("active");
    });

    const hamburger = document.querySelector(".hamburger");
    const mobileNav = document.querySelector(".mobile-nav");
    const closeBtn = document.querySelector(".mobile-nav-close");
    if (hamburger && mobileNav) {
      hamburger.addEventListener("click", () => {
        mobileNav.classList.add("open");
        mobileNav.querySelector("a")?.focus();
      });
      closeBtn?.addEventListener("click", () => mobileNav.classList.remove("open"));
      mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => mobileNav.classList.remove("open"));
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") mobileNav.classList.remove("open");
      });
    }
  }

  /* ---------------------------------------------------------------------
     MUSIC TOGGLE — silent by default, remembered across pages
     --------------------------------------------------------------------- */
  function initMusic() {
    const btn = document.getElementById("music-toggle");
    if (!btn) return;
    const audio = document.getElementById("bg-music");
    const key = "midnightRoseMusicPlaying";
    let playing = sessionStorage.getItem(key) === "true";

    function reflect() {
      btn.dataset.playing = playing ? "true" : "false";
      btn.textContent = playing ? "♪" : "♪̸";
      btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    }
    reflect();

    if (playing && audio) {
      audio.play().catch(() => { playing = false; reflect(); });
    }

    btn.addEventListener("click", () => {
      playing = !playing;
      sessionStorage.setItem(key, playing);
      if (audio) {
        if (playing) audio.play().catch(() => {});
        else audio.pause();
      }
      reflect();
    });
  }

  /* ---------------------------------------------------------------------
     EASTER EGG — a small hidden heart, easy to miss, reveals a message
     --------------------------------------------------------------------- */
  function initEasterEgg() {
    const heart = document.querySelector(".hidden-heart");
    const overlay = document.querySelector(".easter-egg-overlay");
    if (!heart || !overlay) return;
    heart.addEventListener("click", () => {
      overlay.classList.add("open");
      window.MidnightRose.burstHearts(16);
    });
    overlay.addEventListener("click", () => overlay.classList.remove("open"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") overlay.classList.remove("open");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    initTransitions();
    initNav();
    initMusic();
    initEasterEgg();
  });
})();
