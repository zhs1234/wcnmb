import { useEffect, useRef } from "react";
import { FaEnvelope, FaGithub, FaRegCopy, FaXmark } from "react-icons/fa6";
import { profile } from "../data/profile";

/**
 * ContactModal component — dialog overlay showing contact details with
 * copy-to-clipboard, mailto, and GitHub links.
 *
 * Implements a simple focus trap: locks body scroll while open, and
 * cycles Tab / Shift+Tab within the modal boundary.
 *
 * @param {Object}   props
 * @param {boolean}  props.open       - Whether the modal is visible.
 * @param {Function} props.onClose    - Callback to close the modal.
 * @param {boolean}  props.copied     - Whether the email was recently copied.
 * @param {Function} props.onCopyEmail - Async callback that copies the email.
 * @param {Object}   props.t          - Localised copy for the active language.
 */
export function ContactModal({ open, onClose, copied, onCopyEmail, t }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Lock background scroll when modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const modalEl = modalRef.current;
    if (!modalEl) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const focusable = modalEl.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    modalEl.addEventListener("keydown", handleKeyDown);
    return () => modalEl.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label={t.close}
        >
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
          <strong>{profile.githubText}</strong>
        </div>

        <div className="contact-actions">
          <button type="button" onClick={onCopyEmail}>
            <FaRegCopy /> {t.copyEmail}
          </button>
          <a href={`mailto:${profile.email}`}>
            <FaEnvelope /> {t.sendEmail}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer noopener">
            <FaGithub /> {t.viewGithub}
          </a>
        </div>
        <div className={`modal-copy-feedback ${copied ? "show" : ""}`}>
          <FaRegCopy /> {t.copied}
        </div>
      </section>
    </div>
  );
}
