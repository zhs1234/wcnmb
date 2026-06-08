import {
  FaArrowRight,
  FaBlog,
  FaBookmark,
  FaCode,
  FaEnvelope,
  FaGithub,
  FaRoute,
  FaStar,
  FaTerminal,
  FaToolbox,
  FaUser,
} from "react-icons/fa6";
import { TbNotes, TbWorldCode } from "react-icons/tb";
import { profile } from "../data/profile";

/** Map of link item icon key → React icon component. */
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

/** Map of category id → CSS tone class applied to link cards. */
const categoryTones = {
  projects: "tone-coral",
  blog: "tone-sun",
  tools: "tone-mint",
  social: "tone-dark",
  contact: "tone-lavender",
  learning: "tone-paper",
};

/**
 * Small presentational helper — renders a status badge when the link has one.
 *
 * @param {Object} props
 * @param {string} [props.status] - Status key such as "soon", "live", "new".
 * @param {Object} props.t        - Localised copy for the active language.
 */
function LinkStatus({ status, t }) {
  if (!status) return null;
  return <span className={`link-status ${status}`}>{t[status] || status}</span>;
}

/**
 * Returns anchor attributes for external URLs so they open in a new tab safely.
 *
 * @param {string} [href] - The link href.
 * @returns {Object} Props object (may be empty for internal links).
 */
function renderExternalProps(href) {
  if (!href?.startsWith("http")) return {};
  return { target: "_blank", rel: "noreferrer noopener" };
}

/**
 * LinkGrid component — the main content area with intro strip, featured cards,
 * compact "more" links, and an empty-state fallback.
 *
 * @param {Object}   props
 * @param {Array}    props.filteredLinks - Links already filtered by active category.
 * @param {string}   props.language      - Active language code ("zh"|"en").
 * @param {Object}   props.t             - Localised copy for the active language.
 * @param {Function} props.onLinkClick    - Event handler forwarded from App.
 */
export function LinkGrid({ filteredLinks, language, t, onLinkClick }) {
  const featuredLinks = filteredLinks.filter((item) => item.featured);
  const moreLinks = filteredLinks.filter((item) => !item.featured);

  return (
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
              const actionOnly =
                item.opensContactCard ||
                (item.status === "soon" && !item.allowPlaceholderLink) ||
                item.href?.startsWith("#");
              const CardElement = actionOnly ? "button" : "a";
              return (
                <CardElement
                  className={`link-card ${categoryTones[item.category] || "tone-paper"}`}
                  href={actionOnly ? undefined : item.href}
                  key={item.id}
                  type={actionOnly ? "button" : undefined}
                  onClick={(event) => onLinkClick(event, item)}
                  style={{ "--delay": `${index * 70}ms` }}
                  {...(!actionOnly ? renderExternalProps(item.href) : {})}
                >
                  <span className="slash">//</span>
                  <Icon className="card-icon" />
                  <span className="card-category">
                    {t.categories[item.category]}
                  </span>
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
        <section
          className="link-section more-section"
          aria-labelledby="more-title"
        >
          <div className="section-heading">
            <h2 id="more-title">{t.moreLinks}</h2>
            <span>{moreLinks.length}</span>
          </div>
          <div className="compact-grid">
            {moreLinks.map((item) => {
              const Icon = iconMap[item.icon] || FaArrowRight;
              const actionOnly =
                item.opensContactCard ||
                (item.status === "soon" && !item.allowPlaceholderLink) ||
                item.href?.startsWith("#");
              const LinkElement = actionOnly ? "button" : "a";
              return (
                <LinkElement
                  className="compact-link"
                  href={actionOnly ? undefined : item.href}
                  key={item.id}
                  type={actionOnly ? "button" : undefined}
                  onClick={(event) => onLinkClick(event, item)}
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
  );
}
