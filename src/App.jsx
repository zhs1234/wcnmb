import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBlog,
  FaBookmark,
  FaCode,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaHeart,
  FaMoon,
  FaRegCopy,
  FaRocket,
  FaRoute,
  FaStar,
  FaSun,
  FaTerminal,
  FaToolbox,
  FaUser,
} from "react-icons/fa6";
import { TbDeviceGamepad2, TbLayoutDashboard, TbNotes, TbWorldCode } from "react-icons/tb";
import { copy } from "./data/i18n";
import { links } from "./data/links";
import { profile } from "./data/profile";

const categoryIcons = {
  all: TbDeviceGamepad2,
  projects: FaTerminal,
  blog: FaBlog,
  tools: FaToolbox,
  social: FaHeart,
  contact: FaEnvelope,
  learning: FaRoute,
};

const iconMap = {
  blog: FaBlog,
  bookmark: FaBookmark,
  code: FaCode,
  contact: FaUser,
  email: FaEnvelope,
  github: FaGithub,
  notes: TbNotes,
  route: FaRoute,
  spark: FaStar,
  terminal: FaTerminal,
  toolbox: FaToolbox,
  world: TbWorldCode,
};

const categoryIds = ["all", "projects", "blog", "tools", "learning", "social", "contact"];

const categoryTones = {
  projects: "tone-coral",
  blog: "tone-sun",
  tools: "tone-mint",
  social: "tone-dark",
  contact: "tone-lavender",
  learning: "tone-paper",
};

function getInitialTheme() {
  const saved = localStorage.getItem("launchpad-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function LinkStatus({ status, t }) {
  if (!status) return null;
  return <span className={`link-status ${status}`}>{t[status] || status}</span>;
}

export function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(localStorage.getItem("launchpad-language") || "zh");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("launchpad-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("launchpad-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key === "Escape") {
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      return activeCategory === "all" || item.category === activeCategory;
    });
  }, [activeCategory]);

  const featuredLinks = filteredLinks.filter((item) => item.featured);
  const moreLinks = filteredLinks.filter((item) => !item.featured);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  };

  const handleLinkClick = async (event, item) => {
    if (item.opensContactCard) {
      event.preventDefault();
      setContactOpen(true);
      return;
    }
    if ((item.status === "soon" && !item.allowPlaceholderLink) || item.href.startsWith("#")) {
      event.preventDefault();
      showNotice(t.organizing);
      return;
    }
    if (!item.copyValue) return;
    event.preventDefault();
    await copyEmail();
  };

  const renderExternalProps = (href) => {
    if (!href.startsWith("http")) return {};
    return { target: "_blank", rel: "noreferrer" };
  };

  return (
    <main className="shell" id="top">
      <header className="topbar" aria-label="Site header">
        <a className="brand" href="#top" aria-label="Developer launchpad home">
          <span className="avatar" aria-hidden="true">
            <TbLayoutDashboard />
          </span>
          <span>
            <span className="brand-title">
              <span>//</span> {profile.brand}
            </span>
            <span className="brand-tagline">{t.tagline}</span>
          </span>
        </a>

        <div className="top-actions">
          <button
            className="pill-button"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle color theme"
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
            <span>{theme === "light" ? t.modeLight : t.modeDark}</span>
            <span className="switch-dot" />
          </button>
          <button
            className="pill-button language-button"
            type="button"
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            aria-label="Toggle language"
          >
            <FaGlobe />
            <span>{language === "zh" ? "中" : "EN"}</span>
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="side-panel" aria-label="Launchpad categories">
          <nav className="category-list">
            {categoryIds.map((categoryId) => {
              const Icon = categoryIcons[categoryId];
              const isActive = activeCategory === categoryId;
              return (
                <button
                  className={`category-item ${isActive ? "active" : ""}`}
                  key={categoryId}
                  type="button"
                  onClick={() => setActiveCategory(categoryId)}
                  aria-pressed={isActive}
                >
                  <Icon />
                  <span>{t.categories[categoryId]}</span>
                </button>
              );
            })}
          </nav>

          <div className="side-status">
            <div className="tiny-scene contact-summary">
              <div className="mini-contact-row">
                <span>{t.siteLabel}</span>
                <strong>{profile.website}</strong>
              </div>
              <div className="mini-contact-row">
                <span>{t.qqLabel}</span>
                <strong>{profile.qq}</strong>
              </div>
              <div className="mini-contact-row">
                <span>{t.emailLabel}</span>
                <strong>{profile.email}</strong>
              </div>
              <div className="mini-contact-row">
                <span>{t.githubLabel}</span>
                <strong>{profile.githubText}</strong>
              </div>
            </div>
            <div className="system-card">
              <span className="pulse" />
              <p>{t.system}</p>
              <strong>{t.systemOk}</strong>
            </div>
          </div>
        </aside>

        <section className="content-area" aria-label="Personal navigation links">
          <div className="intro-strip">
            <div>
              <span className="eyebrow">~/home</span>
              <h1>{t.intro}</h1>
              <p>{t.introLine}</p>
            </div>
            <div className="quick-command" aria-label="Current focus">
              <span>&gt; focus</span>
              <strong>{profile.focus}</strong>
            </div>
          </div>

          {featuredLinks.length > 0 && (
            <section className="link-section" aria-labelledby="featured-title">
              <div className="section-heading">
                <h2 id="featured-title">{t.featured}</h2>
                <span>{featuredLinks.length}</span>
              </div>
              <div className="card-grid">
                {featuredLinks.map((item, index) => {
                  const Icon = iconMap[item.icon] || FaArrowRight;
                  const actionOnly = item.opensContactCard || (item.status === "soon" && !item.allowPlaceholderLink) || item.href.startsWith("#");
                  const CardElement = actionOnly ? "button" : "a";
                  return (
                    <CardElement
                      className={`link-card ${categoryTones[item.category] || "tone-paper"}`}
                      href={actionOnly ? undefined : item.href}
                      key={item.id}
                      type={actionOnly ? "button" : undefined}
                      onClick={(event) => handleLinkClick(event, item)}
                      style={{ "--delay": `${index * 70}ms` }}
                      {...(!actionOnly ? renderExternalProps(item.href) : {})}
                    >
                      <span className="slash">//</span>
                      <Icon className="card-icon" />
                      <span className="card-category">{t.categories[item.category]}</span>
                      <h3>{item.title[language]}</h3>
                      <p>{item.desc[language]}</p>
                      <span className="card-meta">
                        <LinkStatus status={item.status} t={t} />
                      </span>
                      <span className="card-action">
                        {item.action?.[language] || t.open} <FaArrowRight />
                      </span>
                    </CardElement>
                  );
                })}
              </div>
            </section>
          )}

          {moreLinks.length > 0 && (
            <section className="link-section more-section" aria-labelledby="more-title">
              <div className="section-heading">
                <h2 id="more-title">{t.moreLinks}</h2>
                <span>{moreLinks.length}</span>
              </div>
              <div className="compact-grid">
                {moreLinks.map((item) => {
                  const Icon = iconMap[item.icon] || FaArrowRight;
                  const actionOnly = item.opensContactCard || (item.status === "soon" && !item.allowPlaceholderLink) || item.href.startsWith("#");
                  const LinkElement = actionOnly ? "button" : "a";
                  return (
                    <LinkElement
                      className="compact-link"
                      href={actionOnly ? undefined : item.href}
                      key={item.id}
                      type={actionOnly ? "button" : undefined}
                      onClick={(event) => handleLinkClick(event, item)}
                      {...(!actionOnly ? renderExternalProps(item.href) : {})}
                    >
                      <span className="compact-icon">
                        <Icon />
                      </span>
                      <span className="compact-copy">
                        <strong>{item.title[language]}</strong>
                        <span>{item.desc[language]}</span>
                      </span>
                      <LinkStatus status={item.status} t={t} />
                      <FaArrowRight className="compact-arrow" />
                    </LinkElement>
                  );
                })}
              </div>
            </section>
          )}

          {filteredLinks.length === 0 && (
            <div className="empty-state">
              <strong>{t.noResults}</strong>
            </div>
          )}
        </section>
      </section>

      <footer className="status-bar" aria-label="Launchpad status">
        <span className="heart-dot" />
        <span>{t.statusLine}</span>
        <span className="divider" />
        <strong>XP {profile.xp}</strong>
        <span className="divider" />
        <span>{t.statusLabel}</span>
        <strong className="badge">{t.focused}</strong>
        <span className={`toast ${copied ? "show" : ""}`}>
          <FaRegCopy /> {t.copied}
        </span>
        <span className={`toast notice-toast ${notice ? "show" : ""}`}>
          <FaRocket /> {notice}
        </span>
      </footer>

      {contactOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setContactOpen(false)}>
          <section
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setContactOpen(false)} aria-label={t.close}>
              <FaXmark />
            </button>
            <span className="modal-kicker">// contact</span>
            <h2 id="contact-title">{t.contactTitle}</h2>
            <p>{t.contactSubtitle}</p>

            <div className="contact-detail">
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>
            <div className="contact-detail">
              <span>GitHub</span>
              <strong>github.com/zhs1234</strong>
            </div>

            <div className="contact-actions">
              <button type="button" onClick={copyEmail}>
                <FaRegCopy /> {t.copyEmail}
              </button>
              <a href={`mailto:${profile.email}`}>
                <FaEnvelope /> {t.sendEmail}
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <FaGithub /> {t.viewGithub}
              </a>
            </div>
            <div className={`modal-copy-feedback ${copied ? "show" : ""}`}>
              <FaRegCopy /> {t.copied}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
