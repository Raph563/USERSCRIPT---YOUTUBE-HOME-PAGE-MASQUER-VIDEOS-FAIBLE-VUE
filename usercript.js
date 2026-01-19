// ==UserScript==
// @name         YouTube CleanFeed – Smart filter for low-popularity videos & live streams (FR/EN/ES/DE)
// @namespace    yt-hide-low-popularity
// @version      3.0.0
// @description  Smartly filters low-popularity videos and live streams on YouTube. Works on Home and Watch pages, fully SPA-compatible. Contextual buttons, multi-language support, clean toast notifications, and optimized performance.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {
  "use strict";

  /* ================= CONFIG ================= */
  const CONFIG = {
    minViews: 5000, // seuil vidéos (vues)
    minLiveViewers: 5000, // seuil lives (spectateurs/viewers)
    language: "auto", // auto | fr | en | de | es
  };

  /* ================= I18N ================= */
  const I18N = {
    fr: {
      btnShow: "Afficher les vidéos peu populaires",
      btnHide: "Masquer les vidéos peu populaires",
      menuToggleHome: "Toggle filtre accueil (vidéos peu populaires)",
      menuToggleWatch: "Toggle filtre /watch (recommandations peu populaires)",
      menuToggleLives: "Toggle filtre lives peu populaires",
      toastHomeOn: "Filtre accueil : activé",
      toastHomeOff: "Filtre accueil : désactivé",
      toastWatchOn: "Filtre /watch : activé",
      toastWatchOff: "Filtre /watch : désactivé",
      toastLivesOn: "Filtre lives : activé",
      toastLivesOff: "Filtre lives : désactivé",
    },
    en: {
      btnShow: "Show unpopular videos",
      btnHide: "Hide unpopular videos",
      menuToggleHome: "Toggle Home filter (unpopular videos)",
      menuToggleWatch: "Toggle Watch filter (unpopular recommendations)",
      menuToggleLives: "Toggle unpopular live streams filter",
      toastHomeOn: "Home filter: ON",
      toastHomeOff: "Home filter: OFF",
      toastWatchOn: "Watch filter: ON",
      toastWatchOff: "Watch filter: OFF",
      toastLivesOn: "Live filter: ON",
      toastLivesOff: "Live filter: OFF",
    },
    de: {
      btnShow: "Unbeliebte Videos anzeigen",
      btnHide: "Unbeliebte Videos ausblenden",
      menuToggleHome: "Startseitenfilter umschalten (unbeliebte Videos)",
      menuToggleWatch: "Watch-Filter umschalten (unbeliebte Empfehlungen)",
      menuToggleLives: "Livestream-Filter umschalten (unbeliebt)",
      toastHomeOn: "Startseitenfilter: EIN",
      toastHomeOff: "Startseitenfilter: AUS",
      toastWatchOn: "Watch-Filter: EIN",
      toastWatchOff: "Watch-Filter: AUS",
      toastLivesOn: "Livestream-Filter: EIN",
      toastLivesOff: "Livestream-Filter: AUS",
    },
    es: {
      btnShow: "Mostrar videos poco populares",
      btnHide: "Ocultar videos poco populares",
      menuToggleHome: "Alternar filtro de inicio (videos poco populares)",
      menuToggleWatch: "Alternar filtro de /watch (recomendaciones poco populares)",
      menuToggleLives: "Alternar filtro de directos poco populares",
      toastHomeOn: "Filtro de inicio: ACTIVADO",
      toastHomeOff: "Filtro de inicio: DESACTIVADO",
      toastWatchOn: "Filtro de /watch: ACTIVADO",
      toastWatchOff: "Filtro de /watch: DESACTIVADO",
      toastLivesOn: "Filtro de directos: ACTIVADO",
      toastLivesOff: "Filtro de directos: DESACTIVADO",
    },
  };

  const WORDS = {
    fr: { views: ["vue"], live: ["spectateur"] },
    en: { views: ["view"], live: ["viewer"] },
    de: { views: ["aufruf"], live: ["zuschauer"] },
    es: { views: ["vista", "visualiz"], live: ["espectador"] },
  };

  /* ================= STORAGE / STATE ================= */
  const STORE = {
    home: "yt_lowviews_home_enabled",
    watch: "yt_lowviews_watch_enabled",
    lives: "yt_lowlive_enabled",
  };

  let homeEnabled = GM_getValue(STORE.home, false);
  let watchEnabled = GM_getValue(STORE.watch, true);
  let livesEnabled = GM_getValue(STORE.lives, true);

  let observerHome = null;
  let observerWatch = null;

  const BTN_HOME = "yt-lowviews-btn-home";
  const BTN_WATCH = "yt-lowviews-btn-watch";
  const TOAST_ID = "yt-lowviews-toast";

  /* ================= LANGUAGE ================= */
  function detectLang() {
    if (CONFIG.language !== "auto") return CONFIG.language;
    const l = (document.documentElement.getAttribute("lang") || navigator.language || "en").toLowerCase();
    if (l.startsWith("fr")) return "fr";
    if (l.startsWith("de")) return "de";
    if (l.startsWith("es")) return "es";
    return "en";
  }
  const LANG = (() => {
    const l = detectLang();
    return I18N[l] ? l : "en";
  })();

  /* ================= ROUTE HELPERS ================= */
  function isHome() { return location.pathname === "/"; }
  function isWatch() { return location.pathname === "/watch"; }

  /* ================= TOAST (MENU ONLY) ================= */
  function showToast(message) {
    // Afficher uniquement quand on utilise les menus Tampermonkey (appelé seulement depuis ces callbacks)
    if (!message) return;

    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = TOAST_ID;
      toast.style.cssText = `
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 2147483647;
        max-width: min(360px, calc(100vw - 32px));
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(20,20,20,0.92);
        color: #fff;
        font-size: 13px;
        line-height: 1.3;
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        backdrop-filter: blur(8px);
        transform: translateY(8px);
        opacity: 0;
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: none;
      `;
      document.documentElement.appendChild(toast);
    }

    toast.textContent = message;

    // reset animation
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    // force reflow
    void toast.offsetHeight;

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
    }, 2000);
  }

  /* ================= PARSING ================= */
  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[\u00a0\u202f\u2007]/g, " ")
      .trim();
  }

  function hasAnyKeyword(t, list) {
    for (const w of list) {
      if (t.includes(w)) return true;
    }
    return false;
  }

  function parseCount(text, type) {
    if (!text) return null;
    const t = normalize(text);

    const dict = WORDS[LANG] || WORDS.en;
    const keys = dict[type] || [];
    if (!hasAnyKeyword(t, keys)) return null;

    let mult = 1;
    if (t.includes("k")) mult = 1e3;
    if (t.includes("m")) mult = 1e6;
    if (t.includes("b")) mult = 1e9;

    const num = parseFloat(t.replace(/[^\d.,]/g, "").replace(",", "."));
    if (Number.isNaN(num)) return null;

    return Math.round(num * mult);
  }

  /* ================= METHODS: DIFFERENT MASKING PER PAGE =================
     - HOME: masque via style.display (rapide et réversible)
     - WATCH: masque via attribut + display (et évite de retraiter)
  ======================================================================= */

  /* ---------- HOME FILTER ---------- */
  function processHomeItem(item) {
    if (!homeEnabled) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.lowpopDone === "1") return;

    // Méthode HOME: on marque done dès qu'on a lu un compteur (vues ou spectateurs)
    // et on cache si sous le seuil. (Méthode proche du script que tu as fourni.)
    const spans = item.querySelectorAll("span");
    for (const span of spans) {
      const live = parseCount(span.textContent, "live");
      if (live != null) {
        item.dataset.lowpopDone = "1";
        if (livesEnabled && live < CONFIG.minLiveViewers) {
          item.style.display = "none";
          item.dataset.lowpopHidden = "1";
        }
        return;
      }

      const views = parseCount(span.textContent, "views");
      if (views != null) {
        item.dataset.lowpopDone = "1";
        if (views < CONFIG.minViews) {
          item.style.display = "none";
          item.dataset.lowpopHidden = "1";
        }
        return;
      }
    }
    // si rien trouvé, ne marque pas done (lazy load des textes)
  }

  function scanHome(root) {
    if (!homeEnabled) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("ytd-rich-item-renderer").forEach(processHomeItem);
    if (root && root.matches && root.matches("ytd-rich-item-renderer")) processHomeItem(root);
  }

  function startHome() {
    const feed = document.querySelector("ytd-rich-grid-renderer");
    if (!feed) return;

    scanHome(feed);

    if (observerHome) return;
    observerHome = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n && n.nodeType === 1) {
            scanHome(n);
          }
        }
      }
    });
    observerHome.observe(feed, { childList: true, subtree: true });
  }

  function stopHome() {
    observerHome?.disconnect();
    observerHome = null;

    document.querySelectorAll("ytd-rich-item-renderer[data-lowpop-hidden='1']").forEach((v) => {
      v.style.display = "";
      v.removeAttribute("data-lowpop-hidden");
      v.removeAttribute("data-lowpop-done");
    });
  }

  /* ---------- WATCH FILTER ---------- */
  function processWatchCard(card) {
    if (!watchEnabled) return;
    if (!card || card.nodeType !== 1) return;
    if (card.dataset.lowpopDone === "1") return;

    // Méthode WATCH: on ne marque done que quand on a trouvé un compteur,
    // et on cache via display + dataset (proche de notre script watch optimisé).
    const spans = card.querySelectorAll("span.yt-content-metadata-view-model__metadata-text");
    for (const span of spans) {
      const live = parseCount(span.textContent, "live");
      if (live != null) {
        card.dataset.lowpopDone = "1";
        if (livesEnabled && live < CONFIG.minLiveViewers) {
          card.style.display = "none";
          card.dataset.lowpopHidden = "1";
        }
        return;
      }

      const views = parseCount(span.textContent, "views");
      if (views != null) {
        card.dataset.lowpopDone = "1";
        if (views < CONFIG.minViews) {
          card.style.display = "none";
          card.dataset.lowpopHidden = "1";
        }
        return;
      }
    }
    // pas de compteur trouvé => on attend une mutation
  }

  function scanWatch(root) {
    if (!watchEnabled) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("div.yt-lockup-view-model").forEach(processWatchCard);
    if (root && root.matches && root.matches("div.yt-lockup-view-model")) processWatchCard(root);
  }

  function startWatch() {
    const related = document.querySelector("#related");
    if (!related) return;

    scanWatch(related);

    if (observerWatch) return;
    observerWatch = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n && n.nodeType === 1) {
            scanWatch(n);
          }
        }
      }
    });
    observerWatch.observe(related, { childList: true, subtree: true });
  }

  function stopWatch() {
    observerWatch?.disconnect();
    observerWatch = null;

    document.querySelectorAll("div.yt-lockup-view-model[data-lowpop-hidden='1']").forEach((c) => {
      c.style.display = "";
      c.removeAttribute("data-lowpop-hidden");
      c.removeAttribute("data-lowpop-done");
    });
  }

  /* ================= UI BUTTONS (NO TOAST HERE) ================= */
  function updatePageButton(btn, enabled) {
    // Texte = action à faire (inversé correctement)
    btn.textContent = enabled ? I18N[LANG].btnShow : I18N[LANG].btnHide;
    btn.style.opacity = enabled ? "1" : "0.82";
  }

  function ensureHomeButton() {
    if (!isHome()) return;

    const existing = document.getElementById(BTN_HOME);
    if (existing) {
      updatePageButton(existing, homeEnabled);
      return;
    }

    const btn = document.createElement("button");
    btn.id = BTN_HOME;
    btn.type = "button";
    btn.style.cssText = `
      position: fixed;
      right: 12px;
      bottom: 56px;
      z-index: 9999;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0,0,0,.7);
      color: #fff;
      border: 1px solid rgba(255,255,255,.2);
      cursor: pointer;
      font-size: 12px;
    `;

    btn.addEventListener("click", () => {
      homeEnabled = !homeEnabled;
      GM_setValue(STORE.home, homeEnabled);
      if (homeEnabled) startHome();
      else stopHome();
      updatePageButton(btn, homeEnabled);
    });

    updatePageButton(btn, homeEnabled);
    document.body.appendChild(btn);
  }

  function ensureWatchButton() {
    if (!isWatch()) return;

    const existing = document.getElementById(BTN_WATCH);
    if (existing) {
      updatePageButton(existing, watchEnabled);
      return;
    }

    const btn = document.createElement("button");
    btn.id = BTN_WATCH;
    btn.type = "button";
    btn.style.cssText = `
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 9999;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0,0,0,.7);
      color: #fff;
      border: 1px solid rgba(255,255,255,.2);
      cursor: pointer;
      font-size: 12px;
    `;

    btn.addEventListener("click", () => {
      watchEnabled = !watchEnabled;
      GM_setValue(STORE.watch, watchEnabled);
      if (watchEnabled) startWatch();
      else stopWatch();
      updatePageButton(btn, watchEnabled);
    });

    updatePageButton(btn, watchEnabled);
    document.body.appendChild(btn);
  }

  function removeButtonsForRoute() {
    if (!isHome()) document.getElementById(BTN_HOME)?.remove();
    if (!isWatch()) document.getElementById(BTN_WATCH)?.remove();
  }

  /* ================= ROUTER SPA ================= */
  function route() {
    // Stop everything first to avoid duplicate observers after navigation
    stopHome();
    stopWatch();

    removeButtonsForRoute();

    if (isHome()) {
      ensureHomeButton();
      if (homeEnabled) startHome();
    }

    if (isWatch()) {
      ensureWatchButton();
      if (watchEnabled) startWatch();
    }
  }

  /* ================= MENU (WITH TOAST ONLY HERE) ================= */
  function refreshAfterMenuChange() {
    // Re-apply on current route
    route();
  }

  GM_registerMenuCommand(I18N[LANG].menuToggleHome, () => {
    homeEnabled = !homeEnabled;
    GM_setValue(STORE.home, homeEnabled);
    showToast(homeEnabled ? I18N[LANG].toastHomeOn : I18N[LANG].toastHomeOff);
    refreshAfterMenuChange();
  });

  GM_registerMenuCommand(I18N[LANG].menuToggleWatch, () => {
    watchEnabled = !watchEnabled;
    GM_setValue(STORE.watch, watchEnabled);
    showToast(watchEnabled ? I18N[LANG].toastWatchOn : I18N[LANG].toastWatchOff);
    refreshAfterMenuChange();
  });

  GM_registerMenuCommand(I18N[LANG].menuToggleLives, () => {
    livesEnabled = !livesEnabled;
    GM_setValue(STORE.lives, livesEnabled);
    showToast(livesEnabled ? I18N[LANG].toastLivesOn : I18N[LANG].toastLivesOff);
    refreshAfterMenuChange();
  });

  /* ================= BOOT ================= */
  window.addEventListener("yt-navigate-finish", route, true);

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", route, { once: true });
  } else {
    route();
  }
})();
