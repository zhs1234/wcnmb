import { useEffect, useState } from "react";
import { profile } from "../data/profile";

/**
 * LandingPage — full-screen hero page shown before the launchpad.
 *
 * Props:
 *   onEnter  {Function}  — callback to switch to the launchpad view
 *   theme    {string}    — "light" | "dark"
 *   language {string}    — "zh" | "en"
 *   t        {object}    — i18n copy object for current language
 */
export function LandingPage({ onEnter, theme, language, t }) {
  const [typed, setTyped] = useState("");
  const tagline = t.tagline || "Code. Ship. Play. Repeat.";

  /* Typewriter effect for tagline */
  useEffect(() => {
    let index = 0;
    setTyped("");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setTyped(tagline);
      return;
    }

    const interval = setInterval(() => {
      index++;
      setTyped(tagline.slice(0, index));
      if (index >= tagline.length) {
        clearInterval(interval);
      }
    }, 72);

    return () => clearInterval(interval);
  }, [tagline]);

  return (
    <div className="landing-page">
      {/* Decorative floating code snippets */}
      <div className="landing-decor landing-decor--1" aria-hidden="true">
        {"<div />"}
      </div>
      <div className="landing-decor landing-decor--2" aria-hidden="true">
        {"fn() =>"}
      </div>
      <div className="landing-decor landing-decor--3" aria-hidden="true">
        {"{...props}"}
      </div>
      <div className="landing-decor landing-decor--4" aria-hidden="true">
        {"git push"}
      </div>
      <div className="landing-decor landing-decor--5" aria-hidden="true">
        {"async"}
      </div>

      {/* Ambient glow orbs */}
      <div className="landing-glow landing-glow--teal" aria-hidden="true" />
      <div className="landing-glow landing-glow--coral" aria-hidden="true" />

      <div className="landing-content">
        {/* Greeting line */}
        <p className="landing-greeting">
          {t.landingGreeting}
        </p>

        {/* Brand name */}
        <h1 className="landing-brand">
          <span className="landing-brand-prefix">{"// "}</span>
          {profile.brand}
        </h1>

        {/* Tagline with typewriter */}
        <p className="landing-tagline">
          <span className="landing-tagline-text">{typed}</span>
          <span className="landing-tagline-cursor" aria-hidden="true">|</span>
        </p>

        {/* Focus tags */}
        <div className="landing-focus">
          {profile.focus.split(" / ").map((tag) => (
            <span key={tag} className="landing-focus-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Enter button */}
        <button
          className="landing-enter-btn"
          onClick={onEnter}
          type="button"
        >
          <span className="landing-enter-prefix">{"> "}</span>
          {t.landingEnter}
        </button>

        {/* Footer text */}
        <p className="landing-footer-text">
          {t.statusLine}
        </p>
      </div>
    </div>
  );
}
