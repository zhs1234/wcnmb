import {
  FaBlog,
  FaEnvelope,
  FaHeart,
  FaRoute,
  FaTerminal,
  FaToolbox,
} from "react-icons/fa6";
import { FiFolder } from "react-icons/fi";
import { TbDeviceGamepad2 } from "react-icons/tb";
import { profile } from "../data/profile";

/** Default icon for categories not explicitly mapped. */
const DefaultIcon = FiFolder;

/** Map of category id → icon component, used for the side-panel navigation. */
const categoryIcons = {
  all: TbDeviceGamepad2,
  projects: FaTerminal,
  blog: FaBlog,
  tools: FaToolbox,
  social: FaHeart,
  contact: FaEnvelope,
  learning: FaRoute,
};

/** Ordered list of category ids rendered in the navigation. */
const categoryIds = [
  "all",
  "projects",
  "blog",
  "tools",
  "learning",
  "social",
  "contact",
];

/**
 * SidePanel component — category navigation buttons + status sidebar.
 *
 * @param {Object}   props
 * @param {string}   props.activeCategory    - Currently selected category id.
 * @param {Function} props.setActiveCategory - Category state setter.
 * @param {Object}   props.t                 - Localised copy for the active language.
 */
export function SidePanel({ activeCategory, setActiveCategory, t }) {
  return (
    <aside className="side-panel" aria-label="Launchpad categories">
      <nav className="category-list">
        {categoryIds.map((categoryId) => {
          const Icon = categoryIcons[categoryId] || DefaultIcon;
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
  );
}
