import { FaRegCopy, FaRocket } from "react-icons/fa6";
import { profile } from "../data/profile";

/**
 * StatusBar component — footer with live-status text and toast notifications
 * for copy-to-clipboard feedback and general notices.
 *
 * @param {Object}  props
 * @param {boolean} props.copied  - Whether the email was recently copied.
 * @param {string}  props.notice  - Current notice text (empty when hidden).
 * @param {Object}  props.t       - Localised copy for the active language.
 */
export function StatusBar({ copied, notice, t }) {
  return (
    <footer className="status-bar" aria-label="Launchpad status">
      <span className="heart-dot" />
      <span>{t.statusLine}</span>
      <span className="divider" />
      <strong>{t.xpLabel} {profile.xp}</strong>
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
  );
}
