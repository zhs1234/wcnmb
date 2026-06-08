import { FaGlobe, FaMoon, FaSun } from "react-icons/fa6";
import { TbLayoutDashboard } from "react-icons/tb";
import { profile } from "../data/profile";

/**
 * Header component — brand identity + theme/language toggle controls.
 *
 * @param {Object} props
 * @param {"light"|"dark"} props.theme     - Current colour theme.
 * @param {Function} props.setTheme        - Theme state setter.
 * @param {"zh"|"en"} props.language       - Current UI language.
 * @param {Function} props.setLanguage     - Language state setter.
 * @param {Object}   props.t              - Localised copy for the active language.
 */
export function Header({ theme, setTheme, language, setLanguage, t }) {
  return (
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
  );
}
