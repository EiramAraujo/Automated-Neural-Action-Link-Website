/* ==========================================================================
   main.js
   - Nav (mobile hamburger + close on link click)
   - Scroll progress tape
   - IntersectionObserver reveals
   - Lazy WebM videos (play when in view, pause when out)
   - YouTube facade (thumbnail click → iframe swap)
   - Copy email button
   - Footer year
   ========================================================================== */

(function () {
  "use strict";

  const supportsIO = "IntersectionObserver" in window;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav ---------- */
  function initNav() {
    const nav = document.querySelector(".nav");
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!nav || !toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });

    // close on any inner link click (mobile)
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const fill = document.querySelector(".scroll-tape__fill");
    if (!fill) return;
    let ticking = false;
    function update() {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      const pct = height > 0 ? (scrolled / height) * 100 : 0;
      fill.style.width = pct + "%";
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    const targets = [
      ".section__head",
      ".feature",
      ".proof__card",
      ".flow__node",
      ".device",
      ".yt",
      ".clip",
      ".about__portrait",
      ".about__body",
      ".contact-card"
    ];
    const nodes = document.querySelectorAll(targets.join(","));
    nodes.forEach((n, i) => {
      n.classList.add("reveal");
      n.style.setProperty("--reveal-delay", (i % 4) * 80 + "ms");
    });

    if (!supportsIO || reducedMotion) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- Lazy videos ---------- */
  function initLazyVideos() {
    const videos = document.querySelectorAll("video.lazy-video");
    if (!videos.length) return;

    if (reducedMotion) {
      // leave the posters in place; videos stay hidden via CSS
      return;
    }

    const load = (v) => {
      if (v.dataset.loaded === "1") return;
      const src = v.dataset.src;
      if (!src) return;
      const source = document.createElement("source");
      source.src = src;
      source.type = "video/webm";
      v.appendChild(source);
      v.load();
      v.dataset.loaded = "1";
    };

    if (!supportsIO) {
      videos.forEach(load);
      videos.forEach((v) => v.play().catch(() => {}));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            load(v);
            const p = v.play();
            if (p && typeof p.catch === "function") p.catch(() => {});
          } else {
            if (!v.paused) v.pause();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px 10% 0px" }
    );
    videos.forEach((v) => io.observe(v));
  }

  /* ---------- YouTube facade ---------- */
  function initYouTube() {
    document.querySelectorAll(".yt-facade").forEach((fac) => {
      const activate = () => {
        const id = fac.dataset.ytId;
        const title = fac.dataset.ytTitle || "YouTube video";
        if (!id) return;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("title", title);
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
        // replace facade content
        fac.innerHTML = "";
        fac.appendChild(iframe);
        fac.style.cursor = "default";
      };

      fac.addEventListener("click", activate);
      fac.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  /* ---------- Copy email ---------- */
  function initCopyEmail() {
    const btn = document.getElementById("copyEmail");
    if (!btn) return;
    const label = btn.querySelector("[data-i18n]");

    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy || "";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // fallback
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
      } catch (_) { /* silent */ }

      const originalKey = label ? label.getAttribute("data-i18n") : null;
      const doneText = window.ANAL_i18n ? window.ANAL_i18n.t("contact.copyDone") : "Copied ✓";
      if (label) {
        label.removeAttribute("data-i18n");
        label.textContent = doneText;
      }
      btn.classList.add("is-done");

      setTimeout(() => {
        if (label && originalKey) {
          label.setAttribute("data-i18n", originalKey);
          if (window.ANAL_i18n) {
            label.textContent = window.ANAL_i18n.t(originalKey);
          }
        }
        btn.classList.remove("is-done");
      }, 1800);
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initScrollProgress();
    initReveals();
    initLazyVideos();
    initYouTube();
    initCopyEmail();
    initYear();
  });
})();
