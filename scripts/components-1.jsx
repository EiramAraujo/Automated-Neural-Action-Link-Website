// Resume app component. Single component, three themes via CSS vars.
// All sections live in one continuously-scrolling page.

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Themes — CSS-variable bundles. Mounted on the root via inline style.
// ─────────────────────────────────────────────────────────────
const THEMES = {
  editorial: {
    name: "Editorial",
    vars: {
      "--bg":          "#f5f1ea",
      "--bg-alt":      "#ece6db",
      "--ink":         "#1d1a16",
      "--ink-soft":    "#4a443c",
      "--ink-muted":   "#7a7268",
      "--rule":        "rgba(29,26,22,0.12)",
      "--rule-strong": "rgba(29,26,22,0.22)",
      "--accent":      "oklch(0.62 0.13 38)",
      "--accent-ink":  "#fff",
      "--card":        "#ffffff",
      "--shadow":      "0 1px 0 rgba(29,26,22,0.04), 0 8px 30px -12px rgba(29,26,22,0.18)",
      "--font-display":"'Fraunces', Georgia, 'Times New Roman', serif",
      "--font-body":   "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      "--font-mono":   "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      "--display-weight": "450",
      "--display-tracking": "-0.02em",
    },
  },
  engineering: {
    name: "Engineering",
    vars: {
      "--bg":          "#f6f7f5",
      "--bg-alt":      "#eceee8",
      "--ink":         "#161916",
      "--ink-soft":    "#3b3f3b",
      "--ink-muted":   "#71766f",
      "--rule":        "rgba(22,25,22,0.10)",
      "--rule-strong": "rgba(22,25,22,0.22)",
      "--accent":      "oklch(0.78 0.17 130)",
      "--accent-ink":  "#0c0e0c",
      "--card":        "#ffffff",
      "--shadow":      "0 1px 0 rgba(0,0,0,0.04), 0 6px 24px -12px rgba(0,0,0,0.18)",
      "--font-display":"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      "--font-body":   "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      "--font-mono":   "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      "--display-weight": "500",
      "--display-tracking": "-0.01em",
    },
  },
  dark: {
    name: "Dark",
    vars: {
      "--bg":          "#0e1014",
      "--bg-alt":      "#15181f",
      "--ink":         "#eef0f3",
      "--ink-soft":    "#bfc3cc",
      "--ink-muted":   "#7d8290",
      "--rule":        "rgba(255,255,255,0.08)",
      "--rule-strong": "rgba(255,255,255,0.18)",
      "--accent":      "oklch(0.74 0.13 230)",
      "--accent-ink":  "#0a0c10",
      "--card":        "#15181f",
      "--shadow":      "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 40px rgba(0,0,0,0.4)",
      "--font-display":"'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      "--font-body":   "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      "--font-mono":   "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      "--display-weight": "600",
      "--display-tracking": "-0.035em",
    },
  },
};

window.THEMES = THEMES;

// ─────────────────────────────────────────────────────────────
// Reveal hook — IntersectionObserver-based fade/translate-in.
// Respects prefers-reduced-motion and the `motion` tweak.
// ─────────────────────────────────────────────────────────────
function useReveal(motion) {
  const ref = useRef(null);
  const [shown, setShown] = useState(motion === "off");
  useEffect(() => {
    if (motion === "off") { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [motion]);
  return [ref, shown];
}

function Reveal({ children, delay = 0, motion, as: As = "div", style, className }) {
  const [ref, shown] = useReveal(motion);
  const t = motion === "off" ? "none" : `opacity .7s ${delay}ms cubic-bezier(.2,.7,.2,1), transform .7s ${delay}ms cubic-bezier(.2,.7,.2,1)`;
  return (
    <As ref={ref} className={className} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(14px)",
      transition: t,
      willChange: "opacity, transform",
    }}>{children}</As>
  );
}

// ─────────────────────────────────────────────────────────────
// Tiny presentational primitives
// ─────────────────────────────────────────────────────────────
// Eyebrow — small mono label above section titles. With `num`,
// renders a numbered marker: 01 ──── ABOUT
function Eyebrow({ children, style, num }) {
  if (num != null) {
    return (
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        ...style,
      }}>
        <span aria-hidden="true" style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--accent)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.02em",
        }}>{String(num).padStart(2, "0")}</span>
        <span aria-hidden="true" style={{
          flexShrink: 0,
          width: 36, height: 1,
          background: "var(--rule-strong)",
        }} />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-soft)",
        }}>{children}</span>
      </div>
    );
  }
  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--ink-muted)",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      ...style,
    }}>{children}</div>
  );
}

function SectionHeader({ eyebrow, title, lede, motion, num }) {
  return (
    <header style={{ marginBottom: 36, maxWidth: 720 }}>
      {(eyebrow || num != null) && (
        <Reveal motion={motion}>
          <Eyebrow num={num} style={{ marginBottom: 18 }}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal motion={motion} as="h2" style={{
        margin: "0 0 12px 0",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--display-weight)",
        letterSpacing: "var(--display-tracking)",
        fontSize: "clamp(28px, 4vw, 44px)",
        lineHeight: 1.05,
        color: "var(--ink)",
      }}>{title}</Reveal>
      {lede && <Reveal motion={motion} delay={80} as="p" style={{
        margin: 0, color: "var(--ink-soft)", maxWidth: 580,
        fontSize: 16, lineHeight: 1.6,
      }}>{lede}</Reveal>}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — full-bleed dark, animated abstract code/data flow.
// Background is a layered canvas (network of nodes + traveling
// data packets + drifting code fragments) over a gradient mesh
// and faint grid, with a vignette to keep text readable.
// ─────────────────────────────────────────────────────────────
function HeroBackground({ motion, accent = "#7cb6ff" }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animOff = motion === "off" || reduced;

    let W = 0, H = 0, raf = 0, t0 = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Convert hex accent to "r,g,b" for rgba()
    const hex = accent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rgb = `${r},${g},${b}`;

    // Network nodes — drift slowly, connect when close.
    const targetCount = Math.min(90, Math.max(34, Math.floor((W * H) / 22000)));
    const nodes = Array.from({ length: targetCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.3 + 0.5,
    }));

    // Data packets travel along edges.
    const packets = [];

    // Drifting code/firmware/SQL fragments — abstract "data flow".
    const CODE_LINES = [
      "const ship = (work) => work.refine().deploy()",
      "git rebase -i origin/main",
      "docker compose up -d --build",
      "kubectl rollout status deploy/api",
      "SELECT id, name FROM users WHERE active = 1",
      "await fetch('/api/v2/health')",
      "0x7B 0x40 0x10 0x4E 0x8C 0xA3 0xF2 0x9C",
      "[INFO] 142 modules · 0 errors · 1.84s",
      "if (errors.length === 0) return ok()",
      "function scale(n) { return n * Math.SQRT2 }",
      "@Override public void run() { pipeline.tick(); }",
      "export default class Pipeline extends EventEmitter",
      "LPUART_Transmit(handle, buf, len, 0xFFFF)",
      "git push origin feat/motion-primitives",
      "npm run build && npm test -- --ci",
      "curl -X POST https://api/deploy --data @ship.json",
      "ssh deploy@prod-01 'systemctl restart worker'",
      "POST /v1/commits  201 Created  · 38ms",
      "// ship · document · scale",
    ];
    const codeDrifts = Array.from({ length: 10 }, (_, i) => ({
      text: CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)],
      x: Math.random() * W,
      y: (i / 10) * H + Math.random() * 40,
      vy: -(Math.random() * 0.18 + 0.08),
      opacity: Math.random() * 0.10 + 0.14, // bumped from 0.05–0.15 → 0.14–0.24
    }));

    const LINK_DIST_SQ = 22000; // px²; max distance² to draw an edge
    const SPAWN_PROB   = 0.05;  // per-frame chance a new packet spawns

    const drawFrame = (now) => {
      const dt = Math.min(40, now - t0); t0 = now;
      const f = animOff ? 0 : dt / 16.67; // unit = 1 frame @60fps

      ctx.clearRect(0, 0, W, H);

      // --- Drifting code fragments (behind network) ---
      ctx.font = "12px 'JetBrains Mono', ui-monospace, Menlo, monospace";
      for (const c of codeDrifts) {
        c.y += c.vy * f;
        if (c.y < -20) {
          c.y = H + 20;
          c.x = Math.random() * W;
          c.text = CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)];
          c.opacity = Math.random() * 0.10 + 0.14;
        }
        ctx.fillStyle = `rgba(${rgb},${c.opacity})`;
        ctx.fillText(c.text, c.x, c.y);
      }

      // --- Update node positions ---
      for (const p of nodes) {
        p.x += p.vx * f;
        p.y += p.vy * f;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }

      // --- Edges (proximity links) ---
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const bN = nodes[j];
          const dx = a.x - bN.x, dy = a.y - bN.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ) {
            const alpha = (1 - d2 / LINK_DIST_SQ) * 0.38;
            ctx.strokeStyle = `rgba(${rgb},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bN.x, bN.y);
            ctx.stroke();
          }
        }
      }

      // --- Nodes ---
      for (const p of nodes) {
        ctx.fillStyle = "rgba(238,240,243,0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Spawn packets along close pairs ---
      if (!animOff && Math.random() < SPAWN_PROB && packets.length < 18) {
        const aN = nodes[Math.floor(Math.random() * nodes.length)];
        let best = null, bestD = Infinity;
        for (const p of nodes) {
          if (p === aN) continue;
          const dx = aN.x - p.x, dy = aN.y - p.y;
          const d = dx * dx + dy * dy;
          if (d < bestD && d < LINK_DIST_SQ) { bestD = d; best = p; }
        }
        if (best) packets.push({ a: aN, b: best, t: 0, speed: 0.012 + Math.random() * 0.02 });
      }

      // --- Packets ---
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i];
        k.t += k.speed * f;
        if (k.t >= 1) { packets.splice(i, 1); continue; }
        const x = k.a.x + (k.b.x - k.a.x) * k.t;
        const y = k.a.y + (k.b.y - k.a.y) * k.t;
        // soft halo
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 14);
        grd.addColorStop(0, `rgba(${rgb},0.55)`);
        grd.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = `rgba(${rgb},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!animOff) raf = requestAnimationFrame(drawFrame);
    };

    if (animOff) {
      // one static frame so the bg isn't empty
      drawFrame(performance.now());
    } else {
      raf = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [motion, accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block",
      }}
    />
  );
}

// Legacy single-svg variant kept around in case some external
// link still references it; not rendered by the new Hero.
function HeroAnimation({ themeKey, motion }) {
  // Dev-themed hero accents — code, commits, terminals — themed per variant
  // so layout stays stable but personality differs.
  const animOff = motion === "off";

  if (themeKey === "engineering") {
    // A faux terminal: prompt + typing line + status output. Monospace, gridded.
    return (
      <svg viewBox="0 0 320 320" width="100%" height="100%" aria-hidden="true"
           style={{ display: "block" }}>
        <defs>
          <pattern id="grid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="320" height="320" fill="url(#grid)" />
        {/* terminal window */}
        <g>
          <rect x="28" y="56" width="264" height="208" fill="var(--bg)" stroke="var(--rule-strong)" strokeWidth="1" />
          <rect x="28" y="56" width="264" height="20" fill="var(--bg-alt)" stroke="var(--rule-strong)" strokeWidth="1" />
          <circle cx="40" cy="66" r="3" fill="var(--rule-strong)" />
          <circle cx="52" cy="66" r="3" fill="var(--rule-strong)" />
          <circle cx="64" cy="66" r="3" fill="var(--accent)" />
          <text x="160" y="70" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9"
                fill="var(--ink-muted)" letterSpacing="1">~/portfolio — zsh</text>
        </g>
        {/* terminal contents */}
        <g fontFamily="var(--font-mono)" fontSize="11">
          <text x="40" y="100" fill="var(--ink-muted)">$</text>
          <text x="54" y="100" fill="var(--ink)">git log --oneline -3</text>
          <text x="40" y="118" fill="var(--accent)">a3f29c1</text>
          <text x="92" y="118" fill="var(--ink-soft)">ship: redesign system v2</text>
          <text x="40" y="134" fill="var(--accent)">7b104e8</text>
          <text x="92" y="134" fill="var(--ink-soft)">feat: motion primitives</text>
          <text x="40" y="150" fill="var(--accent)">0c91d22</text>
          <text x="92" y="150" fill="var(--ink-soft)">chore: tokens audit</text>

          <text x="40" y="180" fill="var(--ink-muted)">$</text>
          <text x="54" y="180" fill="var(--ink)">npm run build</text>
          <text x="40" y="198" fill="var(--ink-soft)">▸ compiling… </text>
          <text x="40" y="214" fill="var(--ink-soft)">▸ 142 modules · 0 errors</text>
          <text x="40" y="230" fill="var(--accent)">✓ built in 1.84s</text>

          <text x="40" y="252" fill="var(--ink-muted)">$</text>
          <g style={{ animation: animOff ? "none" : "eaType 4s steps(1) infinite" }}>
            <text x="54" y="252" fill="var(--ink)">deploy --prod</text>
          </g>
          <rect x="148" y="244" width="6" height="11" fill="var(--accent)"
                style={{ animation: animOff ? "none" : "eaBlink 1s steps(1) infinite" }} />
        </g>
      </svg>
    );
  }
  if (themeKey === "dark") {
    // Git commit graph: branching nodes connected with curves; one pulses.
    const nodes = [
      { x: 60,  y: 80,  c: "main" },
      { x: 110, y: 80,  c: "main" },
      { x: 160, y: 80,  c: "main" },
      { x: 210, y: 80,  c: "main" },
      { x: 260, y: 80,  c: "main" },
      { x: 130, y: 140, c: "feat" },
      { x: 180, y: 140, c: "feat" },
      { x: 230, y: 140, c: "feat" },
      { x: 200, y: 200, c: "fix"  },
      { x: 250, y: 200, c: "fix"  },
    ];
    return (
      <svg viewBox="0 0 320 320" width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="320" fill="url(#halo)" />
        {/* branch lines */}
        <g fill="none" strokeWidth="1.25">
          <path d="M40 80 L 280 80" stroke="var(--rule-strong)" />
          <path d="M110 80 C 120 110, 120 130, 130 140 L 230 140" stroke="var(--rule)" />
          <path d="M180 140 C 190 170, 190 185, 200 200 L 250 200" stroke="var(--rule)" />
        </g>
        {/* labels */}
        <g fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-muted)">
          <text x="40" y="72">main</text>
          <text x="40" y="144">feat/anim</text>
          <text x="40" y="204">fix/a11y</text>
        </g>
        {/* nodes */}
        <g>
          {nodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="5" fill="var(--bg)" stroke="var(--rule-strong)" strokeWidth="1.25" />
              {i === 4 && (
                <circle cx={n.x} cy={n.y} r="5" fill="none" stroke="var(--accent)" strokeWidth="1.5"
                        style={{
                          animation: animOff ? "none" : "eaRing 2.2s ease-out infinite",
                        }} />
              )}
              {i === 4 && <circle cx={n.x} cy={n.y} r="3" fill="var(--accent)" />}
            </g>
          ))}
        </g>
        {/* HEAD pointer */}
        <g fontFamily="var(--font-mono)" fontSize="9">
          <text x="246" y="68" fill="var(--accent)">HEAD →</text>
          <text x="246" y="100" fill="var(--ink-muted)">a3f29c1</text>
        </g>
      </svg>
    );
  }
  // editorial — a hand-set code snippet with drawn underline + bracket flourish
  return (
    <svg viewBox="0 0 320 320" width="100%" height="100%" aria-hidden="true" style={{ display: "block" }}>
      {/* faint orbit, kept from prior identity */}
      <g style={{ transformOrigin: "160px 160px", animation: animOff ? "none" : "eaSpin 80s linear infinite" }}>
        <circle cx="160" cy="160" r="118" fill="none" stroke="var(--rule)" strokeWidth="0.75" />
      </g>
      {/* oversized brace */}
      <text x="44" y="200" fontFamily="var(--font-display, serif)" fontStyle="italic"
            fontSize="180" fill="var(--accent)" opacity="0.18">{'{'}</text>
      {/* code lines, set as if quoted in print */}
      <g fontFamily="var(--font-mono)" fontSize="11">
        <text x="92" y="118" fill="var(--ink-muted)">01</text>
        <text x="120" y="118" fill="var(--ink-soft)">const</text>
        <text x="158" y="118" fill="var(--ink)">craft</text>
        <text x="194" y="118" fill="var(--ink-soft)">=</text>
        <text x="206" y="118" fill="var(--accent)">(work) =&gt;</text>

        <text x="92" y="138" fill="var(--ink-muted)">02</text>
        <text x="120" y="138" fill="var(--ink-soft)">  work</text>
        <text x="156" y="138" fill="var(--ink)">.refine</text>
        <text x="196" y="138" fill="var(--ink-soft)">()</text>

        <text x="92" y="158" fill="var(--ink-muted)">03</text>
        <text x="120" y="158" fill="var(--ink-soft)">      .</text>
        <text x="138" y="158" fill="var(--ink)">ship</text>
        <text x="166" y="158" fill="var(--ink-soft)">();</text>

        <text x="92" y="186" fill="var(--ink-muted)">04</text>
        <text x="120" y="186" fill="var(--ink)">craft</text>
        <text x="156" y="186" fill="var(--ink-soft)">(</text>
        <text x="164" y="186" fill="var(--accent)" fontStyle="italic">'today'</text>
        <text x="208" y="186" fill="var(--ink-soft)">);</text>
      </g>
      {/* hand-drawn underline beneath the call */}
      <path d="M120 198 C 150 192, 200 192, 232 200" fill="none"
            stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
            style={{
              strokeDasharray: 200, strokeDashoffset: animOff ? 0 : 200,
              animation: animOff ? "none" : "eaDraw 2.4s 0.6s cubic-bezier(.2,.7,.2,1) forwards",
            }} />
      {/* caret */}
      <rect x="240" y="178" width="6" height="11" fill="var(--accent)"
            style={{ animation: animOff ? "none" : "eaBlink 1.1s steps(1) infinite" }} />
    </svg>
  );
}

function Hero({ t, themeKey, motion, lang, setLang, accent }) {
  // Use the live accent (from Tweaks) if available, otherwise the dark default.
  const accentColor = accent || "#7cb6ff";

  return (
    <section id="top" className="ea-hero" style={{
      position: "relative",
      minHeight: "min(92vh, 920px)",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      // No hard border — the gradient blends directly into Quick Facts.
      // Bottom stop matches --bg so the hero bleeds into Quick Facts.
      background: `
        radial-gradient(1100px 600px at 78% 18%, ${accentColor}1a, transparent 65%),
        radial-gradient(900px 700px at 8% 88%, ${accentColor}10, transparent 60%),
        linear-gradient(180deg, #06080c 0%, #0a0d12 55%, #0c0f15 85%, #0e1014 100%)
      `,
    }}>
      {/* Faint dotted/grid lattice */}
      <div aria-hidden="true" className="ea-hero-grid" />

      {/* Animated network + drifting code */}
      <HeroBackground motion={motion} accent={accentColor} />

      {/* Vignette to push focus to the headline */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 80% 65% at 50% 55%, transparent 0%, rgba(8,10,14,0.40) 70%, rgba(8,10,14,0.72) 100%)",
      }} />

      {/* Content */}
      <div className="ea-row" style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        paddingTop: "clamp(110px, 16vw, 180px)",
        paddingBottom: "clamp(80px, 12vw, 140px)",
      }}>
        <div style={{ maxWidth: 980 }}>
          {/* Eyebrow status chip */}
          <Reveal motion={motion} delay={40}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "6px 14px 6px 10px",
              borderRadius: 99,
              border: `1px solid ${accentColor}40`,
              background: `${accentColor}10`,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "#cfd6e2",
              letterSpacing: "0.04em",
              marginBottom: 28,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}>
              <span aria-hidden="true" style={{
                width: 8, height: 8, borderRadius: 99,
                // Warm secondary accent — signals "available now", distinct from the cool blue used for the work.
                background: "var(--accent-warm, #f5a25d)",
                boxShadow: "0 0 14px var(--accent-warm, #f5a25d)",
                animation: motion === "off" ? "none" : "eaPulse 2.2s ease-out infinite",
              }} />
              {t.role_title} · {t.hero_eyebrow_status || "Open to roles"}
            </div>
          </Reveal>

          {/* Headline */}
          <Reveal motion={motion} delay={120}>
            <h1 className="ea-hero-h1" style={{
              fontFamily: "var(--font-display)",
              fontWeight: "var(--display-weight)",
              letterSpacing: "var(--display-tracking)",
              fontSize: "clamp(44px, 8.4vw, 108px)",
              lineHeight: 0.98,
              margin: "0 0 28px 0",
              color: "#f6f8fb",
              textWrap: "balance",
            }}>
              {t.hero_h1_a}
              <span style={{
                position: "relative",
                color: accentColor,
                whiteSpace: "nowrap",
                textShadow: `0 0 28px ${accentColor}55`,
              }}>
                {t.hero_h1_b}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 14"
                  preserveAspectRatio="none"
                  style={{
                    position: "absolute",
                    left: 0, right: 0, bottom: "-0.18em",
                    width: "100%", height: "0.32em",
                    overflow: "visible",
                  }}
                >
                  <path
                    d="M2 9 C 40 2, 90 12, 130 6 S 200 2, 218 8"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 260,
                      strokeDashoffset: motion === "off" ? 0 : 260,
                      animation: motion === "off"
                        ? "none"
                        : "eaDraw 1.6s 0.7s cubic-bezier(.2,.7,.2,1) forwards",
                      filter: `drop-shadow(0 0 6px ${accentColor}aa)`,
                    }}
                  />
                </svg>
              </span>
              {t.hero_h1_c}
            </h1>
          </Reveal>

          {/* Lede */}
          <Reveal motion={motion} delay={200}>
            <p style={{
              maxWidth: 640,
              color: "#bfc7d4",
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.6,
              margin: "0 0 36px 0",
              textWrap: "pretty",
            }}>{t.hero_lede}</p>
          </Reveal>

          {/* CTAs */}
          <Reveal motion={motion} delay={280}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="#work"
                className="ea-btn"
                style={{
                  background: "#f6f8fb",
                  color: "#0a0c10",
                  boxShadow: `0 8px 32px -10px ${accentColor}88, 0 1px 0 rgba(255,255,255,0.08) inset`,
                }}
              >{t.hero_cta_work} <Arrow /></a>
              <a
                href="#contact"
                className="ea-btn"
                style={{
                  background: "transparent",
                  color: "#e6ebf2",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >{t.hero_cta_contact || (lang === "es" ? "Contacto" : lang === "de" ? "Kontakt" : "Get in touch")}</a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll hint */}
      <div aria-hidden="true" style={{
        position: "absolute",
        left: "50%", bottom: 28,
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
        color: "rgba(238,240,243,0.45)",
        zIndex: 2,
      }}>
        <span>scroll</span>
        <span style={{
          width: 1, height: 36,
          background: `linear-gradient(to bottom, ${accentColor}, transparent)`,
          animation: motion === "off" ? "none" : "eaScrollHint 2.2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Quick facts strip — 3 short stats under the hero
// ─────────────────────────────────────────────────────────────
function QuickFacts({ t, motion }) {
  const facts = [
    { v: "3+", k: t.qf_years },
    { v: "2",  k: t.qf_countries },
    { v: "Backend / Embedded systems", k: t.qf_focus },
  ];
  return (
    <section style={{ borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 0,
      }}>
        {facts.map((f, i) => (
          <Reveal key={i} motion={motion} delay={i * 60}>
            <div style={{
              padding: "28px 22px",
              borderLeft: i === 0 ? "none" : "1px solid var(--rule)",
              minHeight: 120,
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: "var(--display-weight)",
                fontSize: f.small ? "clamp(14px, 1.6vw, 18px)" : "clamp(28px, 3.4vw, 42px)",
                letterSpacing: "var(--display-tracking)",
                lineHeight: 1.05,
                color: "var(--ink)",
                marginBottom: 8,
                fontVariantNumeric: "tabular-nums",
              }}>{f.v}</div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
                lineHeight: 1.4,
              }}>{f.k}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────
function About({ t, motion }) {
  return (
    <section id="about" style={{ padding: "clamp(60px, 8vw, 110px) 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.5fr)", gap: "clamp(24px, 6vw, 80px)" }} className="ea-about-grid">
          <div>
            <Reveal motion={motion}>
              <Eyebrow num={1} style={{ marginBottom: 18 }}>{t.about_h}</Eyebrow>
            </Reveal>
            <Reveal motion={motion} delay={60} style={{
              marginTop: 8,
              aspectRatio: "4 / 5",
              maxWidth: 360,
              width: "100%",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid var(--rule)",
              background: "var(--bg-alt)",
              boxShadow: "var(--shadow)",
            }}>
              <img
                src="assets/my-photo.png"
                alt="Eiram Araujo"
                loading="lazy"
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "saturate(0.95)",
                }}
              />
            </Reveal>
          </div>
          <div>
            <Reveal motion={motion} as="p" style={aboutP}>{t.about_p1}</Reveal>
            <Reveal motion={motion} delay={80} as="p" style={aboutP}>{t.about_p2}</Reveal>
            <Reveal motion={motion} delay={160} as="p" style={{ ...aboutP, marginBottom: 0 }}>{t.about_p3}</Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
const aboutP = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(17px, 1.6vw, 21px)",
  lineHeight: 1.55,
  color: "var(--ink)",
  margin: "0 0 20px 0",
  textWrap: "pretty",
};

window.HeroBlock = Hero;
window.QuickFacts = QuickFacts;
window.About = About;
window.SectionHeader = SectionHeader;
window.Reveal = Reveal;
window.Eyebrow = Eyebrow;
window.Arrow = Arrow;
window.useReveal = useReveal;
