// Resume parts 2 — Work, Projects, Voices, Skills+Certs, Contact, Footer.

const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

// ─────────────────────────────────────────────────────────────
// Date format helper
// ─────────────────────────────────────────────────────────────
function fmtMY(iso, lang) {
  if (!iso) return "";
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, 1));
  const locale = lang === "es" ? "es-ES" : lang === "de" ? "de-DE" : "en-US";
  return d.toLocaleDateString(locale, { month: "short", year: "numeric", timeZone: "UTC" });
}

// ─────────────────────────────────────────────────────────────
// Work — timeline
// ─────────────────────────────────────────────────────────────
function Work({ t, motion, lang, themeKey }) {
  const items = window.RESUME.experience;
  return (
    <section id="work" style={{ padding: "clamp(60px, 8vw, 110px) 0", background: "var(--bg-alt)", borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row">
        <window.SectionHeader motion={motion} eyebrow={t.work_e} title={t.work_h} />
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((job, i) => (
            <window.Reveal key={job.id} motion={motion} delay={i * 80} as="li" style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px, 200px) 1fr",
              gap: "clamp(20px, 4vw, 56px)",
              padding: "28px 0",
              borderTop: i === 0 ? "1px solid var(--rule)" : "none",
              borderBottom: "1px solid var(--rule)",
            }} className="ea-job">
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: "var(--ink-muted)", letterSpacing: "0.04em",
                paddingTop: 4,
              }}>
                <div>{fmtMY(job.start, lang)}</div>
                <div>↓</div>
                <div>{job.end ? fmtMY(job.end, lang) : t.work_present}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
                  <h3 style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--display-weight)",
                    letterSpacing: "var(--display-tracking)",
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    lineHeight: 1.15,
                    color: "var(--ink)",
                  }}>{t[job.role_key]}</h3>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "var(--ink-muted)", letterSpacing: "0.04em",
                  }}>{job.location}</div>
                </div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 16,
                  color: "var(--accent)", fontWeight: 500, marginBottom: 14,
                }}>{job.company}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px 0" }}>
                  {job.bullets_keys.map((k) => (
                    <li key={k} style={{
                      position: "relative", paddingLeft: 20, marginBottom: 8,
                      color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6,
                    }}>
                      <span aria-hidden="true" style={{
                        position: "absolute", left: 0, top: "0.7em",
                        width: 10, height: 1, background: "var(--rule-strong)",
                      }} />
                      {t[k]}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {job.stack.map((s) => <Pill key={s} themeKey={themeKey}>{s}</Pill>)}
                </div>
              </div>
            </window.Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pill({ children, themeKey }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: themeKey === "engineering" ? 4 : 99,
      border: "1px solid var(--rule-strong)",
      fontFamily: themeKey === "engineering" ? "var(--font-mono)" : "var(--font-body)",
      fontSize: 12, color: "var(--ink-soft)",
      letterSpacing: themeKey === "engineering" ? "0.02em" : 0,
      background: "transparent",
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Projects — image placeholder grid
// ─────────────────────────────────────────────────────────────
function ProjectCard({ p, t, motion, themeKey, idx }) {
  const stripeColors = themeKey === "dark"
    ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.08)"]
    : ["rgba(29,26,22,0.04)", "rgba(29,26,22,0.08)"];
  const placeholderBg = `repeating-linear-gradient(135deg, ${stripeColors[0]} 0 12px, ${stripeColors[1]} 12px 24px)`;
  return (
    <window.Reveal motion={motion} delay={idx * 70} as="article" style={{
      background: "var(--card)",
      border: "1px solid var(--rule)",
      borderRadius: themeKey === "engineering" ? 6 : 14,
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "transform .3s, box-shadow .3s, border-color .3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = motion === "off" ? "none" : "translateY(-3px)";
      e.currentTarget.style.boxShadow = "var(--shadow)";
      e.currentTarget.style.borderColor = "var(--rule-strong)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "var(--rule)";
    }}>
      <div style={{
        aspectRatio: "16 / 10",
        background: p.image ? "var(--bg-alt)" : placeholderBg,
        position: "relative",
        borderBottom: "1px solid var(--rule)",
        overflow: "hidden",
      }}>
        {p.image ? (
          <img
            src={p.image}
            alt={t[p.title_key]}
            loading="lazy"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--ink-muted)", letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>
            [ {t.proj_image_placeholder} · {p.id} ]
          </div>
        )}
        <div style={{
          position: "absolute", top: 12, right: 12,
          fontFamily: "var(--font-mono)", fontSize: 11,
          padding: "3px 8px", borderRadius: 99,
          background: "var(--bg)", border: "1px solid var(--rule)",
          color: "var(--ink-muted)",
        }}>{p.year}</div>
      </div>
      <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          margin: "0 0 8px 0",
          fontFamily: "var(--font-display)",
          fontWeight: "var(--display-weight)",
          letterSpacing: "var(--display-tracking)",
          fontSize: 22, lineHeight: 1.2, color: "var(--ink)",
        }}>{t[p.title_key]}</h3>
        <p style={{
          margin: "0 0 16px 0", color: "var(--ink-soft)",
          fontSize: 14.5, lineHeight: 1.55, flex: 1,
        }}>{t[p.desc_key]}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.stack.map((s) => <Pill key={s} themeKey={themeKey}>{s}</Pill>)}
        </div>
      </div>
    </window.Reveal>
  );
}

function Projects({ t, motion, themeKey }) {
  const ps = window.RESUME.projects;
  return (
    <section id="projects" style={{ padding: "clamp(60px, 8vw, 110px) 0", background: "var(--bg-alt)", borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row">
        <window.SectionHeader motion={motion} eyebrow={t.proj_e} title={t.proj_h} lede={t.proj_lede} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {ps.map((p, i) => <ProjectCard key={p.id} p={p} t={t} motion={motion} themeKey={themeKey} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Voices (testimonials)
// ─────────────────────────────────────────────────────────────
function Voices({ t, motion, themeKey }) {
  const ts = window.RESUME.testimonials;
  return (
    <section id="voices" style={{ padding: "clamp(60px, 8vw, 110px) 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row">
        <window.SectionHeader motion={motion} eyebrow={t.voices_e} title={t.voices_h} lede={t.voices_lede} />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}>
          {ts.map((q, i) => (
            <window.Reveal key={q.id} motion={motion} delay={i * 80} as="figure" style={{
              margin: 0, padding: 24,
              background: "var(--card)",
              border: "1px solid var(--rule)",
              borderRadius: themeKey === "engineering" ? 6 : 14,
              display: "flex", flexDirection: "column", gap: 18,
            }}>
              <div aria-hidden="true" style={{
                fontFamily: "var(--font-display)",
                fontSize: 48, lineHeight: 0.6,
                color: "var(--accent)",
                fontStyle: themeKey === "editorial" ? "italic" : "normal",
              }}>“</div>
              <blockquote style={{
                margin: 0, fontFamily: "var(--font-body)",
                fontSize: 16, lineHeight: 1.55, color: "var(--ink)",
                textWrap: "pretty",
              }}>{t[q.quote_key]}</blockquote>
              <figcaption style={{
                marginTop: "auto",
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--ink-muted)", letterSpacing: "0.04em",
                lineHeight: 1.5,
              }}>
                <div style={{ color: "var(--ink-soft)", fontWeight: 500 }}>{q.author}</div>
                <div>{t[q.relation_key]} · {q.company}</div>
              </figcaption>
            </window.Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Skills + Education + Certs + Spoken — three-column dense block
// ─────────────────────────────────────────────────────────────
function SkillsBlock({ t, motion, themeKey, lang }) {
  const sk = window.RESUME.skills;
  const edus = window.RESUME.education;
  const certs = window.RESUME.certifications;
  const spoken = window.RESUME.spoken;

  return (
    <section id="skills" style={{ padding: "clamp(60px, 8vw, 110px) 0", borderBottom: "1px solid var(--rule)" }}>
      <div className="ea-row">
        <div className="ea-skill-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "clamp(28px, 4vw, 56px)",
        }}>
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>{t.skills_h}</Eyebrow>
            <SkillGroup label={t.skills_langs} items={sk.languages} themeKey={themeKey} motion={motion} />
            <SkillGroup label={t.skills_frameworks} items={sk.frameworks} themeKey={themeKey} motion={motion} />
            <SkillGroup label={t.skills_practice} items={sk.practice} themeKey={themeKey} motion={motion} />
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>{t.education_h}</Eyebrow>
            {edus.map((ed) => (
              <div key={ed.id} style={{ marginBottom: 22 }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  letterSpacing: "0.04em", color: "var(--ink-muted)",
                  marginBottom: 4,
                }}>{fmtMY(ed.start, lang)} – {fmtMY(ed.end, lang)} · {ed.location}</div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "var(--display-weight)",
                  letterSpacing: "var(--display-tracking)",
                  fontSize: 18, color: "var(--ink)", lineHeight: 1.25,
                  marginBottom: 2,
                }}>{t[ed.degree_key]}</div>
                <div style={{ fontSize: 14.5, color: "var(--ink-soft)" }}>{ed.school}</div>
              </div>
            ))}
          </div>
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>{t.certs_h}</Eyebrow>
            <ul className="ea-cert-list" style={{
              listStyle: "none", padding: 0, margin: "0 0 28px 0",
              maxHeight: 240, overflowY: "auto", paddingRight: 8,
              scrollbarWidth: "thin",
              scrollbarColor: "var(--rule-strong) transparent",
            }}>
              {certs.map((c) => (
                <li key={c.id} style={{
                  display: "flex", justifyContent: "space-between",
                  gap: 12, padding: "10px 0", borderTop: "1px solid var(--rule)",
                }}>
                  <div>
                    <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.35 }}>{c.title}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.04em" }}>{c.issuer}</div>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "var(--ink-muted)", letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}>{c.year}</div>
                </li>
              ))}
            </ul>
            <Eyebrow style={{ marginBottom: 12 }}>{t.spoken_h}</Eyebrow>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {spoken.map((s) => (
                <li key={s.code} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "8px 0",
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "var(--display-weight)",
                    fontSize: 16, color: "var(--ink)",
                  }}>{s.code === "es" ? "Spanish" : s.code === "en" ? "English" : s.code === "de" ? "German" : "Japanese"}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.04em" }}>{s.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillGroup({ label, items, themeKey, motion }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--ink-muted)", letterSpacing: "0.04em",
        marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((s) => <Pill key={s} themeKey={themeKey}>{s}</Pill>)}
      </div>
    </div>
  );
}

function Eyebrow({ children, style }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: 11, letterSpacing: "0.16em",
      textTransform: "uppercase", color: "var(--ink-muted)",
      display: "inline-flex", alignItems: "center", gap: 8,
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact + Footer
// ─────────────────────────────────────────────────────────────
function Contact({ t, motion, themeKey }) {
  const r = window.RESUME;
  return (
    <section id="contact" style={{ padding: "clamp(60px, 8vw, 110px) 0", background: "var(--bg-alt)" }}>
      <div className="ea-row">
        <div style={{ maxWidth: 720 }}>
          <window.Reveal motion={motion} as="h2" style={{
            margin: "0 0 18px 0",
            fontFamily: "var(--font-display)",
            fontWeight: "var(--display-weight)",
            letterSpacing: "var(--display-tracking)",
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02, color: "var(--ink)",
          }}>{t.contact_h}</window.Reveal>
          <window.Reveal motion={motion} delay={80} as="p" style={{
            margin: "0 0 32px 0", fontSize: 18,
            lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: 580,
          }}>{t.contact_lede}</window.Reveal>
          <window.Reveal motion={motion} delay={160}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
              <a href={`mailto:${r.email}`} className="ea-btn ea-btn-primary">{t.contact_email} <Arrow2 /></a>
              <a href={r.links.linkedin} target="_blank" rel="noreferrer" className="ea-btn ea-btn-ghost">LinkedIn</a>
              <a href={r.links.github} target="_blank" rel="noreferrer" className="ea-btn ea-btn-ghost">GitHub</a>
            </div>
          </window.Reveal>
          <window.Reveal motion={motion} delay={240}>
            <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", rowGap: 8, columnGap: 20, fontFamily: "var(--font-mono)", fontSize: 12 }}>
              <dt style={{ color: "var(--ink-muted)", letterSpacing: "0.04em" }}>email</dt>
              <dd style={{ margin: 0, color: "var(--ink)" }}>{r.email}</dd>
              <dt style={{ color: "var(--ink-muted)", letterSpacing: "0.04em" }}>location</dt>
              <dd style={{ margin: 0, color: "var(--ink)" }}>{r.location}</dd>
            </dl>
          </window.Reveal>
        </div>
      </div>
    </section>
  );
}

function Arrow2() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Footer({ t, lang, setLang }) {
  return (
    <footer style={{
      padding: "28px 0", borderTop: "1px solid var(--rule)",
      background: "var(--bg)",
    }}>
      <div className="ea-row" style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", gap: 16, flexWrap: "wrap",
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--ink-muted)", letterSpacing: "0.04em",
      }}>
        <div>© {t.footer_year} · {t.footer_built}</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href={window.RESUME.links.linkedin} target="_blank" rel="noreferrer" style={footLink}>LinkedIn</a>
          <a href={window.RESUME.links.github} target="_blank" rel="noreferrer" style={footLink}>GitHub</a>
          <a href={`mailto:${window.RESUME.email}`} style={footLink}>Email</a>
        </div>
      </div>
    </footer>
  );
}
const footLink = { color: "var(--ink-soft)", textDecoration: "none" };

window.Work = Work;
window.Projects = Projects;
window.Voices = Voices;
window.SkillsBlock = SkillsBlock;
window.Contact = Contact;
window.Footer = Footer;
