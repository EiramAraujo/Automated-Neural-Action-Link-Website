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
function Eyebrow({ children, style }) {
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

function SectionHeader({ eyebrow, title, lede, motion }) {
  return (
    <header style={{ marginBottom: 36, maxWidth: 720 }}>
      {eyebrow && <Eyebrow style={{ marginBottom: 14 }}>{eyebrow}</Eyebrow>}
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
// Hero — variant by theme
// ─────────────────────────────────────────────────────────────
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

function Hero({ t, themeKey, motion, lang, setLang }) {
  return (
    <section id="top" style={{
      paddingTop: "clamp(40px, 9vw, 110px)",
      paddingBottom: "clamp(40px, 8vw, 90px)",
      borderBottom: "1px solid var(--rule)",
    }}>
      <div className="ea-grid">
        <div className="ea-hero-text">
          <Reveal motion={motion} delay={80}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: "var(--display-weight)",
              letterSpacing: "var(--display-tracking)",
              fontSize: "clamp(40px, 7vw, 84px)",
              lineHeight: 1.02,
              margin: "22px 0 26px 0",
              color: "var(--ink)",
              textWrap: "balance",
            }}>
              {t.hero_h1_a}
              <em style={{
                fontStyle: themeKey === "editorial" ? "italic" : "normal",
                color: "var(--accent)",
                fontWeight: themeKey === "engineering" ? 600 : "inherit",
                textDecoration: themeKey === "engineering" ? "underline" : "none",
                textDecorationThickness: 2,
                textUnderlineOffset: 6,
              }}>{t.hero_h1_b}</em>
              {t.hero_h1_c}
            </h1>
          </Reveal>
          <Reveal motion={motion} delay={160}>
            <p style={{
              maxWidth: 580, color: "var(--ink-soft)",
              fontSize: 18, lineHeight: 1.55, margin: "0 0 32px 0",
            }}>{t.hero_lede}</p>
          </Reveal>
          <Reveal motion={motion} delay={240}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="#work" className="ea-btn ea-btn-primary">{t.hero_cta_work} <Arrow /></a>
            </div>
          </Reveal>
        </div>
        <div className="ea-hero-aside">
          <Reveal motion={motion} delay={120}>
            <div style={{
              aspectRatio: "1 / 1",
              borderRadius: themeKey === "editorial" ? "50%" : 16,
              border: "1px solid var(--rule)",
              background: "var(--bg-alt)",
              overflow: "hidden",
              position: "relative",
            }}>
              <HeroAnimation themeKey={themeKey} motion={motion} />
            </div>
          </Reveal>
        </div>
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
// Quick facts strip — 4 short stats under the hero
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
            <Eyebrow>{t.about_h}</Eyebrow>
            <Reveal motion={motion} delay={60} style={{
              marginTop: 24,
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
