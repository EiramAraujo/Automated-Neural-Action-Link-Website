// Resume nav + app shell — wraps all sections, owns lang/tweak state.
// Renders inside a single root container; inner is responsive (one column
// of full-width sections); outer is themed via CSS variables.

const { useState: uS3, useEffect: uE3, useRef: uR3 } = React;

function Nav({ t, lang, setLang, themeKey, motion }) {
  const [scrolled, setScrolled] = uS3(false);
  uE3(() => {
    const el = document.scrollingElement || document.documentElement;
    const onScroll = () => setScrolled((el.scrollTop || window.scrollY || 0) > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 30,
      backdropFilter: "saturate(140%) blur(14px)",
      WebkitBackdropFilter: "saturate(140%) blur(14px)",
      background: scrolled
        ? "color-mix(in oklab, var(--bg) 88%, transparent)"
        : "color-mix(in oklab, var(--bg) 70%, transparent)",
      borderBottom: scrolled ? "1px solid var(--rule)" : "1px solid transparent",
      transition: "background .25s, border-color .25s",
    }}>
      <div className="ea-row" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 0", gap: 16,
      }}>
        <a href="#top" className="ea-brand" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          textDecoration: "none", color: "var(--ink)",
        }}>
          {/* Mark: angular-bracketed monogram, mono-styled to read "developer" */}
          <span aria-hidden="true" className="ea-brand-mark" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 26, padding: "0 6px",
            borderRadius: 6,
            border: "1px solid var(--rule-strong)",
            background: "color-mix(in oklab, var(--ink) 8%, transparent)",
            fontFamily: "var(--font-mono)",
            fontSize: 12, fontWeight: 600,
            letterSpacing: "0.02em",
            color: "var(--ink)",
            lineHeight: 1,
          }}>
            <span style={{ color: "var(--ink-muted)" }}>&lt;</span>
            <span>EA</span>
            <span style={{ color: "var(--ink-muted)" }}>/&gt;</span>
          </span>
          {/* Wordmark: cross-fades to the Japanese reading on hover */}
          <span className="ea-brand-wordmark" style={{
            position: "relative",
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontWeight: "var(--display-weight)",
            fontSize: 15, letterSpacing: "var(--display-tracking)",
            lineHeight: 1.2,
          }}>
            <span className="ea-brand-latin">Eiram Araujo</span>
            <span className="ea-brand-jp" aria-hidden="true">エイラム アラウホ</span>
          </span>
        </a>
        <div className="ea-nav-links" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <NavLink href="#about">{t.nav_about}</NavLink>
          <NavLink href="#work">{t.nav_work}</NavLink>
          <NavLink href="#projects">{t.nav_projects}</NavLink>
          <NavLink href="#voices">{t.nav_voices}</NavLink>
          <NavLink href="#contact">{t.nav_contact}</NavLink>
          <LangSwitch lang={lang} setLang={setLang} />
        </div>
        <div className="ea-nav-mobile" style={{ display: "none" }}>
          <LangSwitch lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <a href={href} style={{
      textDecoration: "none", color: "var(--ink-soft)",
      fontFamily: "var(--font-body)", fontSize: 14,
      transition: "color .18s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"}
    onMouseLeave={(e) => e.currentTarget.style.color = "var(--ink-soft)"}
    >{children}</a>
  );
}

function LangSwitch({ lang, setLang }) {
  const langs = [["en", "EN"], ["es", "ES"], ["de", "DE"]];
  return (
    <div role="group" aria-label="Language" style={{
      display: "inline-flex",
      border: "1px solid var(--rule-strong)",
      borderRadius: 99,
      padding: 2, gap: 0,
      fontFamily: "var(--font-mono)", fontSize: 11,
      letterSpacing: "0.06em",
    }}>
      {langs.map(([k, label]) => {
        const active = lang === k;
        return (
          <button key={k} onClick={() => setLang(k)} aria-pressed={active}
            style={{
              padding: "5px 10px", borderRadius: 99,
              border: "none", cursor: "pointer",
              background: active ? "var(--ink)" : "transparent",
              color: active ? "var(--bg)" : "var(--ink-soft)",
              transition: "background .18s, color .18s",
              fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit",
            }}>{label}</button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App shell — renders one full resume site under a chosen theme.
// `useTweaks` is optional: only the canvas-level instance uses it.
// Per-artboard renders just take a fixed `themeKey` prop.
// ─────────────────────────────────────────────────────────────
function ResumeApp({ themeKey: themeProp, lang: langProp, setLang: setLangProp, motion: motionProp, accent, scoped, withTweaks }) {
  // Top-level controlled state (when withTweaks=true), else use props.
  const [internalLang, setInternalLang] = uS3(langProp || "en");
  const lang = withTweaks ? internalLang : (langProp || "en");
  const setLang = withTweaks ? setInternalLang : (setLangProp || (() => {}));

  const t = (window.I18N[lang] || window.I18N.en);
  const themeKey = themeProp || "editorial";
  const theme = window.THEMES[themeKey];
  const motion = motionProp || "on";

  // Override accent on theme if the user has tweaked it.
  const themeVars = { ...theme.vars };
  if (accent) themeVars["--accent"] = accent;

  // Reflect lang on <html> for inner; if scoped, set lang on root container.
  uE3(() => {
    if (!scoped && typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang, scoped]);

  return (
    <div className="ea-root" lang={lang} style={{
      ...themeVars,
      background: "var(--bg)",
      color: "var(--ink)",
      fontFamily: "var(--font-body)",
      minHeight: "100%",
      minWidth: 0,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>
      <a href="#main" className="ea-skip">{t.skip_link}</a>
      <Nav t={t} lang={lang} setLang={setLang} themeKey={themeKey} motion={motion} />
      <main id="main">
        <window.HeroBlock t={t} themeKey={themeKey} motion={motion} lang={lang} setLang={setLang} accent={accent} />
        <window.QuickFacts t={t} motion={motion} />
        <window.About t={t} motion={motion} />
        <window.Work t={t} motion={motion} lang={lang} themeKey={themeKey} />
        <window.SkillsBlock t={t} motion={motion} themeKey={themeKey} lang={lang} />
        <window.Projects t={t} motion={motion} themeKey={themeKey} />
        <window.Voices t={t} motion={motion} themeKey={themeKey} />
        <window.Contact t={t} motion={motion} themeKey={themeKey} />
      </main>
      <window.Footer t={t} lang={lang} setLang={setLang} />
    </div>
  );
}

window.ResumeApp = ResumeApp;
window.Nav = Nav;
