import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "./data/i18n";
import { links } from "./data/links";
import { profile } from "./data/profile";
import { Header } from "./components/Header";
import { SidePanel } from "./components/SidePanel";
import { LinkGrid } from "./components/LinkGrid";
import { ContactModal } from "./components/ContactModal";
import { StatusBar } from "./components/StatusBar";
import { LandingPage } from "./components/LandingPage";

/* ------------------------------------------------------------------ */
/*  Utility helpers (App-level state initialisation)                  */
/* ------------------------------------------------------------------ */

function safeGet(key, fallback = null) {
  try {
    return localStorage.getItem(key);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently ignore SecurityError in privacy mode or restricted environments
  }
}

function getInitialTheme() {
  const saved = safeGet("launchpad-theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* ------------------------------------------------------------------ */
/*  App — state owner + child-component orchestrator                  */
/* ------------------------------------------------------------------ */

export function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(
    safeGet("launchpad-language") || "zh",
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [page, setPage] = useState("landing");
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);
  const t = copy[language];

  /* ---- Side-effects ---- */

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    safeSet("launchpad-theme", theme);
  }, [theme]);

  useEffect(() => {
    safeSet("launchpad-language", language);
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

  // Clean up pending timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* ---- Derived data ---- */

  const filteredLinks = useMemo(() => {
    return links.filter(
      (item) => activeCategory === "all" || item.category === activeCategory,
    );
  }, [activeCategory]);

  /* ---- Event handlers ---- */

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Fallback for HTTP contexts, privacy mode, or mobile browsers
      try {
        const textarea = document.createElement("textarea");
        textarea.value = profile.email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        showNotice(t.organizing);
        return;
      }
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const showNotice = (message) => {
    setNotice(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(""), 1800);
  };

  const handleEnter = () => {
    setTransitioning(true);
    setTimeout(() => {
      setPage("launchpad");
      setTransitioning(false);
    }, 420);
  };

  const handleLinkClick = async (event, item) => {
    if (item.opensContactCard) {
      event.preventDefault();
      setContactOpen(true);
      return;
    }
    if (
      (item.status === "soon" && !item.allowPlaceholderLink) ||
      item.href?.startsWith("#")
    ) {
      event.preventDefault();
      showNotice(t.organizing);
      return;
    }
    if (!item.copyValue) return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(item.copyValue);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = item.copyValue;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        showNotice(t.organizing);
        return;
      }
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  /* ---- Render ---- */

  return (
    <div className={`page-transition${transitioning ? " page-transition--fade" : ""}`}>
      {page === "landing" ? (
        <LandingPage
          onEnter={handleEnter}
          theme={theme}
          language={language}
          t={t}
        />
      ) : (
        <main className="shell" id="top">
          <Header
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            t={t}
          />

          <section className="workspace">
            <SidePanel
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              t={t}
            />

            <LinkGrid
              filteredLinks={filteredLinks}
              language={language}
              t={t}
              onLinkClick={handleLinkClick}
            />
          </section>

          <StatusBar copied={copied} notice={notice} t={t} />

          <ContactModal
            open={contactOpen}
            onClose={() => setContactOpen(false)}
            copied={copied}
            onCopyEmail={copyEmail}
            t={t}
          />
        </main>
      )}
    </div>
  );
}
