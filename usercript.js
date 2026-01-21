// ==UserScript==
// @name         YouTube CleanFeed – Shorts/News + Low-Popularity Filter (FR/EN/ES/DE) [Options + Modes] TEST last
// @author       Raph563
// @namespace    yt-cleanfeed-combined
// @version      6.3.0
// @description  Hide Shorts (Home/Search/Sidebar) + hide News on Home + optional block Shorts page + low-popularity filter (Home + Watch). Unified i18n, unified toasts, categorized Tampermonkey menu, SPA-compatible, Eco/Perf modes. Includes dock buttons with Collapse/Expand (Home + Watch), fullscreen auto-hide with delayed restore (10s perf / 30s eco), anti-flicker dock rendering, de-duped SPA nav on /watch. + Optional "Hide header when not hovered" on /watch (menu + dock button).
// @homepageURL  https://github.com/Raph563/-YouTube_CleanFeed_-_Remove_Low_Views_Videos
// @downloadURL https://raw.githubusercontent.com/Raph563/-YouTube_CleanFeed_-_Remove_Low_Views_Videos/main/usercript.js
// @updateURL   https://raw.githubusercontent.com/Raph563/-YouTube_CleanFeed_-_Remove_Low_Views_Videos/main/usercript.js
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(() => {
  "use strict";

  /* =========================================================
   * I18N
   * ========================================================= */
  const I18N = {
    fr: {
      sec_global: "Global",
      sec_home: "Accueil (Home)",
      sec_search: "Recherche",
      sec_watch: "Lecture (/watch)",
      sec_navui: "Navigation & Interface",
      sec_actions: "Actions",

      mode_label: "Mode",
      mode_perf: "Performance",
      mode_eco: "Économie",

      opt_shorts_home: "Masquer Shorts sur Accueil",
      opt_shorts_search: "Masquer Shorts dans la Recherche (étagère + résultats)",
      opt_news_home: "Masquer Actualités/News sur Accueil",
      opt_sidebar_shorts: "Masquer “Shorts” dans le menu latéral",
      opt_block_shorts_page: "Bloquer la page Shorts (rediriger vers Accueil)",

      opt_lowpop_home: "Filtrer vidéos peu populaires sur Accueil",
      opt_lowpop_watch: "Filtrer recommandations peu populaires sur /watch",

      opt_float_buttons: "Afficher le menu de boutons (Home + /watch)",
      opt_header_hover_watch: "Masquer le header hors survol (/watch)",

      act_apply: "↻ Appliquer maintenant",
      act_reset: "⟲ Réinitialiser tous les réglages",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Ranger",
      dock_expand: "Déplier",
      dock_shorts_show: "Afficher Shorts",
      dock_shorts_hide: "Masquer Shorts",
      dock_lowpop_home_show: "Afficher les vidéos peu populaires",
      dock_lowpop_home_hide: "Masquer les vidéos peu populaires",
      dock_lowpop_watch_show: "Afficher les recommandations peu populaires",
      dock_lowpop_watch_hide: "Masquer les recommandations peu populaires",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Allez en haut de la page",

      toast_updated: "Mise à jour",
      toast_reset: "Réglages réinitialisés",
      toast_mode_perf: "Mode : Performance",
      toast_mode_eco: "Mode : Économie de ressources",
      toast_btn_home_on: "Filtre accueil : activé (bouton)",
      toast_btn_home_off: "Filtre accueil : désactivé (bouton)",
      toast_btn_watch_on: "Filtre /watch : activé (bouton)",
      toast_btn_watch_off: "Filtre /watch : désactivé (bouton)",

      toast_header_on: "Header auto : activé (/watch)",
      toast_header_off: "Header auto : désactivé (/watch)",
    },

    en: {
      sec_global: "Global",
      sec_home: "Home",
      sec_search: "Search",
      sec_watch: "Watch (/watch)",
      sec_navui: "Navigation & UI",
      sec_actions: "Actions",

      mode_label: "Mode",
      mode_perf: "Performance",
      mode_eco: "Saver",

      opt_shorts_home: "Hide Shorts on Home",
      opt_shorts_search: "Hide Shorts in Search (shelf + results)",
      opt_news_home: "Hide News/Top stories on Home",
      opt_sidebar_shorts: 'Hide "Shorts" in sidebar',
      opt_block_shorts_page: "Block Shorts page (redirect to Home)",

      opt_lowpop_home: "Filter low-popularity videos on Home",
      opt_lowpop_watch: "Filter low-popularity recommendations on /watch",

      opt_float_buttons: "Show button dock (Home + /watch)",
      opt_header_hover_watch: "Hide header when not hovered (/watch)",

      act_apply: "↻ Apply now",
      act_reset: "⟲ Reset all settings",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Collapse",
      dock_expand: "Expand",
      dock_shorts_show: "Show Shorts",
      dock_shorts_hide: "Hide Shorts",
      dock_lowpop_home_show: "Show unpopular videos",
      dock_lowpop_home_hide: "Hide unpopular videos",
      dock_lowpop_watch_show: "Show unpopular recommendations",
      dock_lowpop_watch_hide: "Hide unpopular recommendations",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Go to the top of the page",

      toast_updated: "Updated",
      toast_reset: "Settings reset",
      toast_mode_perf: "Mode: Performance",
      toast_mode_eco: "Mode: Resource Saver",
      toast_btn_home_on: "Home filter: ON (button)",
      toast_btn_home_off: "Home filter: OFF (button)",
      toast_btn_watch_on: "Watch filter: ON (button)",
      toast_btn_watch_off: "Watch filter: OFF (button)",

      toast_header_on: "Header auto: ON (/watch)",
      toast_header_off: "Header auto: OFF (/watch)",
    },

    de: {
      sec_global: "Global",
      sec_home: "Startseite (Home)",
      sec_search: "Suche",
      sec_watch: "Wiedergabe (/watch)",
      sec_navui: "Navigation & UI",
      sec_actions: "Aktionen",

      mode_label: "Modus",
      mode_perf: "Leistung",
      mode_eco: "Sparen",

      opt_shorts_home: "Shorts auf Startseite ausblenden",
      opt_shorts_search: "Shorts in Suche ausblenden (Regal + Ergebnisse)",
      opt_news_home: "News/Top-Meldungen auf Startseite ausblenden",
      opt_sidebar_shorts: '"Shorts" in Seitenleiste ausblenden',
      opt_block_shorts_page: "Shorts-Seite blockieren (zur Startseite umleiten)",

      opt_lowpop_home: "Unbeliebte Videos auf Startseite filtern",
      opt_lowpop_watch: "Unbeliebte Empfehlungen auf /watch filtern",

      opt_float_buttons: "Button-Dock anzeigen (Home + /watch)",
      opt_header_hover_watch: "Header ausblenden, wenn nicht gehovert (/watch)",

      act_apply: "↻ Jetzt anwenden",
      act_reset: "⟲ Einstellungen zurücksetzen",

      status_on: "EIN",
      status_off: "AUS",

      dock_collapse: "Einklappen",
      dock_expand: "Ausklappen",
      dock_shorts_show: "Shorts anzeigen",
      dock_shorts_hide: "Shorts ausblenden",
      dock_lowpop_home_show: "Unbeliebte Videos anzeigen",
      dock_lowpop_home_hide: "Unbeliebte Videos ausblenden",
      dock_lowpop_watch_show: "Unbeliebte Empfehlungen anzeigen",
      dock_lowpop_watch_hide: "Unbeliebte Empfehlungen ausblenden",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Zur Seitenoberkante",

      toast_updated: "Aktualisiert",
      toast_reset: "Einstellungen zurückgesetzt",
      toast_mode_perf: "Modus: Leistung",
      toast_mode_eco: "Modus: Ressourcen sparen",
      toast_btn_home_on: "Startseitenfilter: EIN (Button)",
      toast_btn_home_off: "Startseitenfilter: AUS (Button)",
      toast_btn_watch_on: "Watch-Filter: EIN (Button)",
      toast_btn_watch_off: "Watch-Filter: AUS (Button)",

      toast_header_on: "Header auto: EIN (/watch)",
      toast_header_off: "Header auto: AUS (/watch)",
    },

    es: {
      sec_global: "Global",
      sec_home: "Inicio (Home)",
      sec_search: "Búsqueda",
      sec_watch: "Reproducción (/watch)",
      sec_navui: "Navegación e IU",
      sec_actions: "Acciones",

      mode_label: "Modo",
      mode_perf: "Rendimiento",
      mode_eco: "Ahorro",

      opt_shorts_home: "Ocultar Shorts en Inicio",
      opt_shorts_search: "Ocultar Shorts en Búsqueda (estante + resultados)",
      opt_news_home: "Ocultar Noticias en Inicio",
      opt_sidebar_shorts: 'Ocultar “Shorts” en el menú lateral',
      opt_block_shorts_page: "Bloquear página de Shorts (redirigir a Inicio)",

      opt_lowpop_home: "Filtrar videos poco populares en Inicio",
      opt_lowpop_watch: "Filtrar recomendaciones poco populares en /watch",

      opt_float_buttons: "Mostrar dock de botones (Home + /watch)",
      opt_header_hover_watch: "Ocultar header si no hay hover (/watch)",

      act_apply: "↻ Aplicar ahora",
      act_reset: "⟲ Restablecer ajustes",

      status_on: "ON",
      status_off: "OFF",

      dock_collapse: "Colapsar",
      dock_expand: "Expandir",
      dock_shorts_show: "Mostrar Shorts",
      dock_shorts_hide: "Ocultar Shorts",
      dock_lowpop_home_show: "Mostrar videos poco populares",
      dock_lowpop_home_hide: "Ocultar videos poco populares",
      dock_lowpop_watch_show: "Mostrar recomendaciones poco populares",
      dock_lowpop_watch_hide: "Ocultar recomendaciones poco populares",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Ir al inicio de la página",

      toast_updated: "Actualizado",
      toast_reset: "Ajustes restablecidos",
      toast_mode_perf: "Modo: Rendimiento",
      toast_mode_eco: "Modo: Ahorro de recursos",
      toast_btn_home_on: "Filtro de inicio: ACTIVADO (botón)",
      toast_btn_home_off: "Filtro de inicio: DESACTIVADO (botón)",
      toast_btn_watch_on: "Filtro de /watch: ACTIVADO (botón)",
      toast_btn_watch_off: "Filtro de /watch: DESACTIVADO (botón)",

      toast_header_on: "Header auto: ACTIVADO (/watch)",
      toast_header_off: "Header auto: DESACTIVADO (/watch)",
    },
  };


  function detectLang() {
    const raw = (document.documentElement.getAttribute("lang") || navigator.language || "en").toLowerCase();
    const short = raw.split("-")[0];
    return I18N[short] ? short : "en";
  }
  const LANG = detectLang();
  const T = I18N[LANG];

  /* =========================================================
   * SETTINGS (Unified)
   * ========================================================= */
  const KEY = {
    mode: "ytcf_mode", // "eco" | "perf"

    shortsHome: "ytcf_shorts_home",
    shortsSearch: "ytcf_shorts_search",
    newsHome: "ytcf_news_home",
    sidebarShorts: "ytcf_sidebar_shorts",
    blockShortsPage: "ytcf_block_shorts_page",

    lowpopHome: "ytcf_lowpop_home",
    lowpopWatch: "ytcf_lowpop_watch",

    floatButtons: "ytcf_float_buttons",
    uiCollapsed: "ytcf_ui_collapsed",
    uiCollapsedWatch: "ytcf_ui_collapsed_watch",

    // ✅ NEW (merged script #2)
    headerHoverWatch: "ytcf_header_hover_watch",
  };

  const DEFAULTS = {
    [KEY.mode]: "eco",

    [KEY.shortsHome]: true,
    [KEY.shortsSearch]: true,
    [KEY.newsHome]: true,
    [KEY.sidebarShorts]: true,
    [KEY.blockShortsPage]: false,

    [KEY.lowpopHome]: false,
    [KEY.lowpopWatch]: true,

    [KEY.floatButtons]: true,
    [KEY.uiCollapsed]: false,
    [KEY.uiCollapsedWatch]: false,

    // ✅ default OFF
    [KEY.headerHoverWatch]: false,
  };

  function getVal(k) {
    const v = GM_getValue(k);
    return (v === undefined) ? DEFAULTS[k] : v;
  }
  function setVal(k, v) { GM_setValue(k, v); }

  function getBool(k) { return !!getVal(k); }
  function setBool(k, v) { setVal(k, !!v); }

  function getMode() {
    const v = String(getVal(KEY.mode) || DEFAULTS[KEY.mode]);
    return (v === "perf") ? "perf" : "eco";
  }
  function setMode(m) {
    setVal(KEY.mode, (m === "perf") ? "perf" : "eco");
  }

  let uiCollapsed = !!getVal(KEY.uiCollapsed);
  function setUiCollapsed(v) {
    uiCollapsed = !!v;
    setBool(KEY.uiCollapsed, uiCollapsed);
  }

  let uiCollapsedWatch = !!getVal(KEY.uiCollapsedWatch);
  function setUiCollapsedWatch(v) {
    uiCollapsedWatch = !!v;
    setBool(KEY.uiCollapsedWatch, uiCollapsedWatch);
  }

  /* =========================================================
   * TOAST (Unified)
   * ========================================================= */
  const TOAST_ID = "ytcf-toast";
  const TOAST_THEME = {
    on:   { bg: "#0B1F16", border: "#1F6F4A", text: "#D8F6E8", accent: "#2DD4BF" },
    off:  { bg: "#220D0D", border: "#7F1D1D", text: "#FFE4E6", accent: "#FB7185" },
    info: { bg: "#0B1220", border: "#1E3A8A", text: "#E0E7FF", accent: "#60A5FA" },
  };

  function showToast(message, kind = "info") {
    if (!message) return;
    const theme = TOAST_THEME[kind] || TOAST_THEME.info;

    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement("div");
      toast.id = TOAST_ID;
      toast.style.cssText = `
        position: fixed;
        left: 16px;
        bottom: 16px;
        z-index: 2147483647;
        max-width: min(520px, calc(100vw - 32px));
        padding: 10px 12px;
        border-radius: 12px;
        font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        box-shadow: 0 10px 28px rgba(0,0,0,0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transform: translateY(8px);
        opacity: 0;
        transition: opacity 160ms ease, transform 160ms ease;
        pointer-events: none;
        display: flex;
        gap: 10px;
        align-items: flex-start;
      `;
      const bar = document.createElement("div");
      bar.id = `${TOAST_ID}-bar`;
      bar.style.cssText = `
        width: 4px;
        border-radius: 999px;
        flex: 0 0 4px;
        margin-top: 2px;
        height: 18px;
      `;
      const text = document.createElement("div");
      text.id = `${TOAST_ID}-text`;
      text.style.cssText = `flex: 1 1 auto; white-space: pre-wrap;`;
      toast.appendChild(bar);
      toast.appendChild(text);
      document.documentElement.appendChild(toast);
    }

    const bar = document.getElementById(`${TOAST_ID}-bar`);
    const text = document.getElementById(`${TOAST_ID}-text`);

    toast.style.background = theme.bg;
    toast.style.border = `1px solid ${theme.border}`;
    toast.style.color = theme.text;
    bar.style.background = theme.accent;
    text.textContent = message;

    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    void toast.offsetHeight;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
    }, 2000);
  }

  function statusLabel(on) {
    return `[${on ? T.status_on : T.status_off}]`;
  }

  /* =========================================================
   * ROUTE HELPERS (SPA)
   * ========================================================= */
  function isHome() {
    if (location.pathname !== "/") return false;
    return !!(document.querySelector('ytd-browse[page-subtype="home"]') || document.querySelector("ytd-rich-grid-renderer"));
  }
  function isSearch() {
    return location.pathname === "/results" || !!document.querySelector("ytd-search");
  }
  function isWatch() {
    return location.pathname === "/watch";
  }

  function homeContainer() {
    return (
      document.querySelector('ytd-browse[page-subtype="home"]') ||
      document.querySelector("ytd-rich-grid-renderer") ||
      document
    );
  }
  function searchContainer() {
    return document.querySelector("ytd-search") || document;
  }
  function watchContainer() {
    return document.querySelector("#related") || document;
  }

  /* =========================================================
   * BASIC HELPERS
   * ========================================================= */
  function normalizeBasic(s) {
    return (s || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u00a0\u202f\u2007]/g, " ");
  }
  function hide(el) { if (el) el.style.display = "none"; }

  /* =========================================================
   * Block Shorts Page (redirect)
   * ========================================================= */
  function maybeRedirectShortsPage() {
    if (!getBool(KEY.blockShortsPage)) return;

    const p = location.pathname;
    const isShortsPage =
      p === "/shorts" ||
      p.startsWith("/shorts/") ||
      p === "/feed/shorts" ||
      p.startsWith("/feed/shorts");

    if (isShortsPage) {
      history.replaceState(null, "", "/");
      window.dispatchEvent(new Event("popstate"));
    }
  }

  /* =========================================================
   * Hide Shorts shelves (Home/Search) + Shorts results in Search
   * ========================================================= */
  const SHORTS_LOCKUP_SELECTOR =
    "ytm-shorts-lockup-view-model," +
    "ytm-shorts-lockup-view-model-v2," +
    "ytm-shorts-lockup-view-model-v3," +
    "ytm-shorts-lockup-view-model-v4";

  const SECTION_CONTAINER_SELECTOR =
    "ytd-item-section-renderer," +
    "ytd-rich-section-renderer," +
    "ytd-shelf-renderer," +
    "grid-shelf-view-model," +
    "yt-grid-shelf-view-model";

  const SHORTS_TOKENS = ["shorts", "courts", "short"];

  function textLooksLikeShorts(text) {
    const tt = normalizeBasic(text);
    if (!tt) return false;
    return SHORTS_TOKENS.some(k => tt === normalizeBasic(k) || tt.includes(normalizeBasic(k)));
  }

  function hasManyShortsLinks(node) {
    return node.querySelectorAll('a[href^="/shorts/"], a[href*="/shorts/"]').length >= 3;
  }
  function hasNormalResults(node) {
    return !!node.querySelector("ytd-video-renderer, ytd-rich-item-renderer, ytd-playlist-renderer, ytd-channel-renderer");
  }

  function isPureShortsBlock(block) {
    if (!block) return false;
    const hasLockups = !!block.querySelector(SHORTS_LOCKUP_SELECTOR);
    const manyLinks = hasManyShortsLinks(block);
    if (!hasLockups && !manyLinks) return false;

    const titleEl =
      block.querySelector("yt-section-header-view-model") ||
      block.querySelector(".yt-shelf-header-layout__title") ||
      block.querySelector(".yt-shelf-header-layout__title-row") ||
      block.querySelector("h2, h3, #title, span#title");

    const titleText = titleEl ? (titleEl.textContent || "") : "";
    if (!textLooksLikeShorts(titleText)) return false;
    if (hasNormalResults(block)) return false;
    return true;
  }

  function hideShortsShelvesWithin(root, context /* 'home'|'search' */) {
    if (!root) return;

    root.querySelectorAll("ytd-reel-shelf-renderer").forEach(el => {
      hide(el.closest(SECTION_CONTAINER_SELECTOR) || el);
    });

    root.querySelectorAll(SHORTS_LOCKUP_SELECTOR).forEach(lockup => {
      const block = lockup.closest(SECTION_CONTAINER_SELECTOR);
      if (!block) return;
      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        hide(block);
      }
    });

    root.querySelectorAll("yt-section-header-view-model, .yt-shelf-header-layout__title, .yt-shelf-header-layout__title-row").forEach(h => {
      if (!textLooksLikeShorts(h.textContent || "")) return;
      const block = h.closest(SECTION_CONTAINER_SELECTOR);
      if (!block) return;

      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        const hasShortsContent = !!block.querySelector(SHORTS_LOCKUP_SELECTOR) || hasManyShortsLinks(block);
        if (hasShortsContent) hide(block);
      }
    });

    root.querySelectorAll(SECTION_CONTAINER_SELECTOR).forEach(block => {
      if (context === "search") {
        if (isPureShortsBlock(block)) hide(block);
      } else {
        const hasShortsContent = !!block.querySelector(SHORTS_LOCKUP_SELECTOR) || hasManyShortsLinks(block);
        const titleEl = block.querySelector(".yt-shelf-header-layout__title, yt-section-header-view-model, h2, h3, #title, span#title");
        const titleText = titleEl ? (titleEl.textContent || "") : "";
        if (hasShortsContent && textLooksLikeShorts(titleText)) hide(block);
      }
    });
  }

  function isShortsVideoRenderer(videoRenderer) {
    if (!videoRenderer) return false;
    if (videoRenderer.querySelector('a[href^="/shorts/"], a[href*="/shorts/"]')) return true;

    const badgeText =
      videoRenderer.querySelector("ytd-badge-supported-renderer")?.textContent ||
      videoRenderer.querySelector(".badge-style-type-simple")?.textContent ||
      videoRenderer.querySelector("span.ytd-thumbnail-overlay-time-status-renderer")?.textContent ||
      "";
    if (normalizeBasic(badgeText).includes("shorts")) return true;

    const metaText = videoRenderer.textContent || "";
    if (normalizeBasic(metaText).includes("#shorts")) return true;

    return false;
  }

  function hideShortsVideoResultsInSearch(searchRoot) {
    if (!searchRoot) return;
    const candidates = searchRoot.querySelectorAll(
      "ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer"
    );

    candidates.forEach(node => {
      const vr = node.matches("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer")
        ? node
        : node.querySelector("ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer");
      if (isShortsVideoRenderer(vr)) hide(node);
    });
  }

  /* =========================================================
   * Hide News shelf on Home
   * ========================================================= */
  const NEWS_TITLES = [
    "news", "top news", "breaking news",
    "actualites", "actualités", "actus",
    "nachrichten", "top-meldungen", "schlagzeilen",
    "noticias", "titulares", "últimas noticias", "ultimas noticias"
  ].map(normalizeBasic);

  function titleLooksLikeNews(title) {
    const tt = normalizeBasic(title);
    if (!tt) return false;
    return NEWS_TITLES.some(k => tt === k || tt.includes(k));
  }

  function hideNewsShelfOnHome(root) {
    if (!root) return;
    root.querySelectorAll("ytd-item-section-renderer, ytd-rich-section-renderer, ytd-shelf-renderer").forEach(section => {
      const titleEl = section.querySelector("#title") || section.querySelector("h2, h3") || section.querySelector("span#title");
      const titleText = titleEl?.textContent || "";
      if (titleLooksLikeNews(titleText)) hide(section);
    });
  }

  /* =========================================================
   * Hide Sidebar Shorts entry
   * ========================================================= */
  function isShortsLabelText(txt) {
    const s = normalizeBasic(txt);
    if (!s) return false;
    return s === "shorts" || s.includes("shorts") || s === "courts" || s.includes("courts");
  }

  function hideSidebarShortsEntry() {
    document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(item => {
      const title = item.querySelector("span.title")?.textContent || "";
      const tooltip = item.querySelector("tp-yt-paper-tooltip #tooltip")?.textContent || "";
      const aria = (item.getAttribute("aria-label") || "") + " " + (item.getAttribute("title") || "");
      if (isShortsLabelText(title) || isShortsLabelText(tooltip) || isShortsLabelText(aria)) hide(item);
    });

    document.querySelectorAll("ytd-guide-entry-renderer, ytd-guide-collapsible-entry-renderer").forEach(item => {
      const title =
        item.querySelector("#title")?.textContent ||
        item.querySelector(".title")?.textContent ||
        item.textContent ||
        "";
      const a = item.querySelector("a#endpoint, a[href]");
      const href = a?.getAttribute?.("href") || "";

      const aria =
        (a?.getAttribute?.("aria-label") || "") + " " +
        (a?.getAttribute?.("title") || "") + " " +
        (item.getAttribute("aria-label") || "") + " " +
        (item.getAttribute("title") || "");

      const looksLikeShorts = isShortsLabelText(title) || isShortsLabelText(aria) || href.includes("shorts");
      if (looksLikeShorts) hide(item);
    });
  }

  /* =========================================================
   * Low-popularity filter (Home + Watch)
   * ========================================================= */
  const CONFIG = { minViews: 5000 };

  const WORDS = {
    fr: { views: ["vue", "vues"], live: ["spectateur", "spectateurs"] },
    en: { views: ["view", "views"], live: ["viewer", "viewers"] },
    de: { views: ["aufruf", "aufrufe", "aufrufen"], live: ["zuschauer"] },
    es: { views: ["vista", "vistas", "visualiz", "visualización", "visualizaciones"], live: ["espectador", "espectadores"] },
  };

  const NO_VIEWS = {
    fr: ["aucune vue", "aucun vue", "0 vue", "0 vues"],
    en: ["no views", "0 views", "0 view"],
    de: ["keine aufrufe", "0 aufrufe", "0 aufruf"],
    es: ["sin visualizaciones", "sin vistas", "0 vistas", "0 visualizaciones", "0 vista", "0 visualización"],
  };

  function normalizeMetric(text) {
    return (text || "").toLowerCase().replace(/[\u00a0\u202f\u2007]/g, " ").trim();
  }
  function hasAnyKeyword(t, list) { for (const w of list) if (t.includes(w)) return true; return false; }
  function isNoViewsText(t) { const list = NO_VIEWS[LANG] || NO_VIEWS.en; for (const s of list) if (t.includes(s)) return true; return false; }

  function parseNumberWithSuffix(t) {
    let mult = 1;
    if (t.includes("k")) mult = 1e3;
    if (t.includes("m")) mult = 1e6;
    if (t.includes("b")) mult = 1e9;
    const num = parseFloat(t.replace(/[^\d.,]/g, "").replace(",", "."));
    if (Number.isNaN(num)) return null;
    return Math.round(num * mult);
  }

  function parseViewsOrLive(text) {
    if (!text) return null;
    const t = normalizeMetric(text);
    if (isNoViewsText(t)) return 0;

    const dict = WORDS[LANG] || WORDS.en;
    const keys = [...(dict.views || []), ...(dict.live || [])];
    if (!hasAnyKeyword(t, keys)) return null;

    return parseNumberWithSuffix(t);
  }

  function processHomeItem(item) {
    if (!getBool(KEY.lowpopHome)) return;
    if (!item || item.nodeType !== 1) return;
    if (item.dataset.ytcfLowpopDone === "1") return;

    const spans = item.querySelectorAll("span");
    for (const span of spans) {
      const count = parseViewsOrLive(span.textContent);
      if (count != null) {
        item.dataset.ytcfLowpopDone = "1";
        if (count < CONFIG.minViews) {
          item.style.display = "none";
          item.dataset.ytcfLowpopHidden = "1";
        }
        return;
      }
    }
  }

  function scanHomeLowpop(root) {
    if (!getBool(KEY.lowpopHome)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("ytd-rich-item-renderer").forEach(processHomeItem);
    if (root && root.matches && root.matches("ytd-rich-item-renderer")) processHomeItem(root);
  }

  function processWatchCard(card) {
    if (!getBool(KEY.lowpopWatch)) return;
    if (!card || card.nodeType !== 1) return;
    if (card.dataset.ytcfLowpopDone === "1") return;

    const spans = card.querySelectorAll("span.yt-content-metadata-view-model__metadata-text");
    for (const span of spans) {
      const count = parseViewsOrLive(span.textContent);
      if (count != null) {
        card.dataset.ytcfLowpopDone = "1";
        if (count < CONFIG.minViews) {
          card.style.display = "none";
          card.dataset.ytcfLowpopHidden = "1";
        }
        return;
      }
    }
  }

  function scanWatchLowpop(root) {
    if (!getBool(KEY.lowpopWatch)) return;
    const base = root && root.querySelectorAll ? root : document;
    base.querySelectorAll("div.yt-lockup-view-model").forEach(processWatchCard);
    if (root && root.matches && root.matches("div.yt-lockup-view-model")) processWatchCard(root);
  }

  function unhideLowpop() {
    document.querySelectorAll("ytd-rich-item-renderer[data-ytcf-lowpop-hidden='1'], ytd-rich-item-renderer[data-ytcfLowpopHidden='1']").forEach(v => {
      v.style.display = "";
      v.removeAttribute("data-ytcf-lowpop-hidden");
      v.removeAttribute("data-ytcfLowpopHidden");
      v.removeAttribute("data-ytcfLowpopDone");
    });
    document.querySelectorAll("div.yt-lockup-view-model[data-ytcfLowpopHidden='1'], div.yt-lockup-view-model[data-ytcf-lowpop-hidden='1']").forEach(c => {
      c.style.display = "";
      c.removeAttribute("data-ytcfLowpopHidden");
      c.removeAttribute("data-ytcf-lowpop-hidden");
      c.removeAttribute("data-ytcfLowpopDone");
    });
  }

  /* =========================================================
   * MODE SCHEDULING (Eco vs Perf)
   * ========================================================= */
  function scheduleIdle(fn, timeoutMs) {
    if (typeof requestIdleCallback === "function") return requestIdleCallback(fn, { timeout: timeoutMs || 500 });
    return setTimeout(() => fn({ timeRemaining: () => 0, didTimeout: true }), timeoutMs || 0);
  }
  function cancelIdle(id) {
    if (typeof cancelIdleCallback === "function") cancelIdleCallback(id);
    else clearTimeout(id);
  }

  let ecoQueue = [];
  let ecoIdleId = null;

  function ecoEnqueue(node, worker) {
    ecoQueue.push([node, worker]);
    if (ecoIdleId != null) return;

    ecoIdleId = scheduleIdle(() => {
      ecoIdleId = null;
      const batch = ecoQueue;
      ecoQueue = [];

      const max = 80;
      let count = 0;
      for (const [n, w] of batch) {
        w(n);
        count++;
        if (count >= max) break;
      }

      if (batch.length > max) {
        ecoQueue = batch.slice(max).concat(ecoQueue);
        ecoIdleId = scheduleIdle(() => {
          ecoIdleId = null;
          const b2 = ecoQueue;
          ecoQueue = [];
          for (const [n, w] of b2) w(n);
        }, 600);
      }
    }, 600);
  }

  function resetEcoQueue() {
    if (ecoIdleId != null) cancelIdle(ecoIdleId);
    ecoIdleId = null;
    ecoQueue = [];
  }

  /* =========================================================
   * HEADER AUTO-HIDE (watch only) — merged script #2
   * ========================================================= */
  const YT_HDR_STYLE_ID = "ytcf-hover-masthead-style";
  const YT_HDR_CLASS = "__ytcfHoverMasthead";
  const YT_HDR_SHOW_ZONE = 60;

  let headerHoverEnabled = false;
  let headerPinned = false;

  function ensureHeaderStyle() {
    if (document.getElementById(YT_HDR_STYLE_ID)) return;

    const css = `
      ytd-masthead.${YT_HDR_CLASS} {
        background: linear-gradient(
          to bottom,
          rgba(0,0,0,0.92) 0%,
          rgba(0,0,0,0.88) 60%,
          rgba(0,0,0,0.75) 85%,
          rgba(0,0,0,0.0) 100%
        ) !important;

        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);

        box-shadow:
          0 2px 8px rgba(0,0,0,0.6),
          0 12px 24px rgba(0,0,0,0.35) !important;
      }

      ytd-masthead.${YT_HDR_CLASS} #container,
      ytd-masthead.${YT_HDR_CLASS} #background,
      ytd-masthead.${YT_HDR_CLASS} .ytd-masthead {
        background: transparent !important;
      }
    `;

    const style = document.createElement("style");
    style.id = YT_HDR_STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  function headerEnable() {
    const header = document.querySelector("ytd-masthead");
    const app = document.querySelector("ytd-app");
    if (!header || !app) return;

    ensureHeaderStyle();

    header.classList.add(YT_HDR_CLASS);

    header.style.position = "fixed";
    header.style.top = "0";
    header.style.left = "0";
    header.style.right = "0";
    header.style.zIndex = "9999";
    header.style.transition = "transform 0.25s ease";
    header.style.transform = "translateY(-100%)";

    app.style.setProperty("--ytd-masthead-height", "0px");
    app.style.paddingTop = "0px";

    const pageManager = document.querySelector("ytd-page-manager");
    if (pageManager) pageManager.style.marginTop = "0px";

    headerHoverEnabled = true;
  }

  function headerDisable() {
    const header = document.querySelector("ytd-masthead");
    const app = document.querySelector("ytd-app");
    const pageManager = document.querySelector("ytd-page-manager");

    if (header) {
      header.classList.remove(YT_HDR_CLASS);
      header.style.position = "";
      header.style.top = "";
      header.style.left = "";
      header.style.right = "";
      header.style.zIndex = "";
      header.style.transition = "";
      header.style.transform = "";
    }

    if (app) {
      app.style.removeProperty("--ytd-masthead-height");
      app.style.paddingTop = "";
    }

    if (pageManager) {
      pageManager.style.marginTop = "";
    }

    headerHoverEnabled = false;
    headerPinned = false;
  }

  function applyHeaderHoverNow() {
    const want = isWatch() && getBool(KEY.headerHoverWatch);
    if (want) headerEnable();
    else headerDisable();
  }

  function getSearchInput() {
    return (
      document.querySelector("ytd-searchbox input#search") ||
      document.querySelector("ytd-searchbox input")
    );
  }

  function updateHeaderPinnedFromSearch() {
    if (!isWatch() || !headerHoverEnabled) {
      headerPinned = false;
      return;
    }
    const input = getSearchInput();
    if (!input) {
      headerPinned = false;
      return;
    }
    const hasText = !!input.value && input.value.trim().length > 0;
    const focused = (document.activeElement === input) || input.contains?.(document.activeElement);
    headerPinned = hasText && focused;
    if (headerPinned) {
      const header = document.querySelector("ytd-masthead");
      if (header) header.style.transform = "translateY(0)";
    }
  }

  // Mouse listener ONCE
  let headerMouseBound = false;
  function bindHeaderMouse() {
    if (headerMouseBound) return;
    headerMouseBound = true;

    document.addEventListener("mousemove", (e) => {
      if (!headerHoverEnabled) return;
      if (headerPinned) return;
      const header = document.querySelector("ytd-masthead");
      if (!header) return;

      header.style.transform = (e.clientY <= YT_HDR_SHOW_ZONE) ? "translateY(0)" : "translateY(-100%)";
    }, { passive: true });

    document.addEventListener("scroll", () => {
      if (!headerHoverEnabled || !headerPinned || !isWatch()) return;
      headerPinned = false;
    }, { passive: true });

    document.addEventListener("click", (e) => {
      if (!headerHoverEnabled || !headerPinned || !isWatch()) return;
      const input = getSearchInput();
      if (input && (e.target === input || input.contains?.(e.target))) return;
      headerPinned = false;
    }, true);

    document.addEventListener("input", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      updateHeaderPinnedFromSearch();
    }, true);

    document.addEventListener("focusin", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      updateHeaderPinnedFromSearch();
    }, true);

    document.addEventListener("focusout", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      headerPinned = false;
    }, true);
  }

   /* =========================================================
   * DOCK BUTTONS (optimized) + Fullscreen auto-hide + Anti-flicker
   * + NEW: "Go to top" button when dock is collapsed (⚙️ state)
   * ========================================================= */

  /* =========================================================
   * DOCK IDLE: dim then auto-collapse (eco/perf)
   * ========================================================= */
  let dockDimTimer = null;
  let dockCollapseTimer = null;

  function clearDockIdleTimers() {
    if (dockDimTimer) clearTimeout(dockDimTimer);
    if (dockCollapseTimer) clearTimeout(dockCollapseTimer);
    dockDimTimer = null;
    dockCollapseTimer = null;
  }

  function setDockDim(dock, dimmed) {
    if (!dock) return;
    const perf = (getMode() === "perf");
    dock.style.transition = perf ? "opacity 180ms ease" : "none";
    dock.style.opacity = dimmed ? "0.62" : "1";
  }

  function armDockIdle(dock, scope /* "home" | "watch" */) {
    if (!dock) return;

    if (scope === "home" && uiCollapsed) return;
    if (scope === "watch" && uiCollapsedWatch) return;

    const perf = (getMode() === "perf");
    const dimDelay = perf ? 5000 : 10000;
    const collapseDelay = perf ? 10000 : 15000;

    clearDockIdleTimers();
    setDockDim(dock, false);

    dockDimTimer = setTimeout(() => {
      if (!dock.isConnected) return;
      if (dock.matches(":hover")) return;
      setDockDim(dock, true);
    }, dimDelay);

    dockCollapseTimer = setTimeout(() => {
      if (!dock.isConnected) return;
      if (dock.matches(":hover")) return;

      if (scope === "home") setUiCollapsed(true);
      else setUiCollapsedWatch(true);

      setDockDim(dock, false);
      forceRenderDockNow();
      scheduleRun(true);
    }, collapseDelay);
  }

  function ensureDockIdleListeners(dock) {
    if (!dock || dock.dataset.ytcfIdleBound === "1") return;
    dock.dataset.ytcfIdleBound = "1";

    const wake = () => {
      clearDockIdleTimers();
      setDockDim(dock, false);

      if (isHome() && !uiCollapsed) armDockIdle(dock, "home");
      else if (isWatch() && !uiCollapsedWatch) armDockIdle(dock, "watch");
    };

    dock.addEventListener("mouseenter", wake, true);
    dock.addEventListener("mousemove", wake, true);
    dock.addEventListener("mousedown", wake, true);
    dock.addEventListener("focusin", wake, true);
    dock.addEventListener("touchstart", wake, { passive: true, capture: true });
  }

  /* =========================================================
   * AUTO-SHRINK “Déplier / Expand” button (eco/perf)
   * ========================================================= */
  let expandAutoTimer = null;
  let expandIsShrunk = false;

  function clearExpandAutoTimer() {
    if (expandAutoTimer) clearTimeout(expandAutoTimer);
    expandAutoTimer = null;
  }

  const DOCK_ID = "ytcf-dock";
  const BTN_SHORTS = "ytcf-btn-shorts";
  const BTN_HOME = "ytcf-btn-home";
  const BTN_WATCH = "ytcf-btn-watch";
  const BTN_COLLAPSE = "ytcf-btn-collapse";
  const BTN_EXPAND = "ytcf-btn-expand";
  const BTN_WATCH_COLLAPSE = "ytcf-btn-watch-collapse";
  const BTN_WATCH_EXPAND = "ytcf-btn-watch-expand";
  const BTN_HEADER = "ytcf-btn-header"; // ✅ header toggle on /watch

  // ✅ NEW: Go top (only when dock collapsed & user scrolled enough)
  const BTN_GO_TOP = "ytcf-btn-go-top";
  const GO_TOP_ICON = "⬆️";

  function applyExpandAutoShrink(btn) {
    if (!btn) return;

    const isExpand =
      btn.id === BTN_EXPAND ||
      btn.id === BTN_WATCH_EXPAND;

    if (!isExpand) return;
    if (btn.dataset.ytcfExpandShrinkInit === "1") return;
    btn.dataset.ytcfExpandShrinkInit = "1";

    const perf = (getMode() === "perf");
    const delay = perf ? 2000 : 5000;

    const SHRUNK_CHAR = "⚙️";
    const SHRUNK_W = "28px";

    if (perf) {
      btn.style.transition =
        "width 180ms ease, max-width 180ms ease, padding 180ms ease, opacity 180ms ease";
      btn.style.willChange = "width, max-width, padding, opacity";
    } else {
      btn.style.transition = "none";
    }

    const fullLabel = T.dock_expand;

    function shrinkNow() {
      if (!btn.isConnected) return;
      if (expandIsShrunk) return;

      btn.dataset.ytcfFullText = btn.dataset.ytcfFullText || btn.textContent;

      btn.textContent = SHRUNK_CHAR;
      btn.style.width = SHRUNK_W;
      btn.style.maxWidth = SHRUNK_W;
      btn.style.paddingLeft = "0";
      btn.style.paddingRight = "0";
      btn.style.opacity = "0.85";
      btn.title = fullLabel;
      btn.setAttribute("aria-label", fullLabel);

      expandIsShrunk = true;
    }

    function expandNow() {
      if (!btn.isConnected) return;
      if (!expandIsShrunk) return;

      const full = btn.dataset.ytcfFullText || fullLabel;

      btn.textContent = full;
      btn.style.width = "auto";
      btn.style.maxWidth = "unset";
      btn.style.paddingLeft = "12px";
      btn.style.paddingRight = "12px";
      btn.style.opacity = "1";
      btn.removeAttribute("aria-label");
      btn.title = "";

      expandIsShrunk = false;
    }

    function scheduleShrink() {
      clearExpandAutoTimer();
      expandAutoTimer = setTimeout(() => {
        shrinkNow();
      }, delay);
    }

    // start directly shrunk
    shrinkNow();
    scheduleShrink();

    btn.addEventListener("mouseenter", () => {
      clearExpandAutoTimer();
      expandNow();
    });

    btn.addEventListener("mouseleave", scheduleShrink);
    btn.addEventListener("focus", expandNow);
    btn.addEventListener("blur", scheduleShrink);
  }

  // ✅ NEW: show only when user really scrolled
  function shouldShowGoTop() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const threshold = Math.max(650, Math.floor((window.innerHeight || 800) * 1.4));
    return y >= threshold;
  }

  function applyGoTopHover(btn) {
    if (!btn) return;
    if (btn.dataset.ytcfGoTopInit === "1") return;
    btn.dataset.ytcfGoTopInit = "1";

    const fullLabel = T.dock_go_top || "Go to the top of the page";

    // default: icon only
    btn.textContent = GO_TOP_ICON;
    btn.style.width = "28px";
    btn.style.maxWidth = "28px";
    btn.style.paddingLeft = "0";
    btn.style.paddingRight = "0";
    btn.title = fullLabel;
    btn.setAttribute("aria-label", fullLabel);

    const showText = () => {
      if (!btn.isConnected) return;
      btn.textContent = fullLabel;
      btn.style.width = "auto";
      btn.style.maxWidth = "unset";
      btn.style.paddingLeft = "12px";
      btn.style.paddingRight = "12px";
      btn.title = "";
    };

    const showIcon = () => {
      if (!btn.isConnected) return;
      btn.textContent = GO_TOP_ICON;
      btn.style.width = "28px";
      btn.style.maxWidth = "28px";
      btn.style.paddingLeft = "0";
      btn.style.paddingRight = "0";
      btn.title = fullLabel;
    };

    btn.addEventListener("mouseenter", showText);
    btn.addEventListener("mouseleave", showIcon);
    btn.addEventListener("focus", showText);
    btn.addEventListener("blur", showIcon);
  }

  function goTopNow(clickedBtn) {
    // disappear immediately on use
    if (clickedBtn) clickedBtn.style.display = "none";

    const perf = (getMode() === "perf");
    if (perf) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }

    // ensure dock refreshes after scroll movement settles a bit
    setTimeout(() => {
      forceRenderDockNow();
      scheduleRun(true);
    }, perf ? 120 : 0);
  }

  // ✅ NEW: minimal scroll watcher to show/hide the button while collapsed (especially in ECO)
  let lastGoTopVisible = null;
  let scrollTicking = false;
  function onScrollMaybeUpdateDock() {
    if (!getBool(KEY.floatButtons)) return;

    // only relevant when the dock is collapsed (⚙️ shown)
    const collapsed = (uiCollapsed && isHome()) || (uiCollapsedWatch && isWatch());
    if (!collapsed) {
      lastGoTopVisible = null;
      return;
    }

    const vis = shouldShowGoTop();
    if (vis === lastGoTopVisible) return;
    lastGoTopVisible = vis;

    // rebuild dock so the button appears/disappears
    forceRenderDockNow();
  }

  function bindScrollForGoTopOnce() {
    if (bindScrollForGoTopOnce._done) return;
    bindScrollForGoTopOnce._done = true;

    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;

      const perf = (getMode() === "perf");
      if (perf) {
        requestAnimationFrame(() => {
          scrollTicking = false;
          onScrollMaybeUpdateDock();
        });
      } else {
        setTimeout(() => {
          scrollTicking = false;
          onScrollMaybeUpdateDock();
        }, 180);
      }
    }, { passive: true });
  }

  let fsRestoreTimer = null;

  // Anti-flicker state
  let lastDockKey = "";
  let dockIsHidden = false;
  let dockWasFullscreen = false;

  function isFullscreenNow() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function ensureDock() {
    let dock = document.getElementById(DOCK_ID);
    if (dock) return dock;

    dock = document.createElement("div");
    dock.id = DOCK_ID;
    dock.style.cssText = `
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-end;
      pointer-events: auto;
    `;
    document.documentElement.appendChild(dock);
    dockIsHidden = false;
    return dock;
  }

  function makeDockButton(id, text) {
    const btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.textContent = text;
    btn.style.cssText = `
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(0,0,0,.72);
      color: #fff;
      border: 1px solid rgba(255,255,255,.2);
      cursor: pointer;
      font-size: 12px;
      transform: translateZ(0);
    `;
    return btn;
  }

  function applyDockProfile(dock) {
    if (!dock) return;
    const perf = (getMode() === "perf");
    dock.dataset.ytcfAnim = perf ? "on" : "off";
  }

  function animateDockIn(dock) {
    if (!dock) return;
    if (dock.dataset.ytcfAnim !== "on") return;
    dock.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0px)" }
      ],
      { duration: 180, easing: "ease-out" }
    );
  }

  function hideDock(dock) {
    if (!dock) return;
    if (dockIsHidden) return;
    dockIsHidden = true;
    dock.style.pointerEvents = "none";
    dock.style.display = "none";
  }

  function showDock(dock, animate = false) {
    if (!dock) return;
    if (!dockIsHidden && dock.style.display === "flex") return;

    dockIsHidden = false;
    dock.style.display = "flex";
    dock.style.pointerEvents = "auto";
    if (animate) animateDockIn(dock);
  }

  function scheduleShowDockAfterExitFS(dock) {
    if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
    fsRestoreTimer = null;

    const delay = (getMode() === "eco") ? 30000 : 10000;
    dockWasFullscreen = true;

    fsRestoreTimer = setTimeout(() => {
      fsRestoreTimer = null;
      if (isFullscreenNow()) return;

      dockWasFullscreen = false;
      lastDockKey = "";
      scheduleRun(true);
    }, delay);
  }

  function forceRenderDockNow() {
    lastDockKey = "";
    dockWasFullscreen = false;
    if (document.body) renderDock();
  }

  function renderDock() {
    if (!document.body) return;

    // ensure scroll listener exists (for ECO mode especially)
    bindScrollForGoTopOnce();

    if (!getBool(KEY.floatButtons)) {
      document.getElementById(DOCK_ID)?.remove();
      lastDockKey = "";
      dockIsHidden = false;
      return;
    }

    const dock = ensureDock();
    applyDockProfile(dock);
    ensureDockIdleListeners(dock);

    const onHome = isHome();
    const onWatch = isWatch();
    const fs = isFullscreenNow();

    const stateKey = [
      "v4",
      getMode(),
      uiCollapsed ? "c1" : "c0",
      uiCollapsedWatch ? "cw1" : "cw0",
      fs ? "fs1" : "fs0",
      onHome ? "h1" : "h0",
      onWatch ? "w1" : "w0",
      getBool(KEY.shortsHome) ? "sh1" : "sh0",
      getBool(KEY.lowpopHome) ? "lh1" : "lh0",
      getBool(KEY.lowpopWatch) ? "lw1" : "lw0",
      getBool(KEY.headerHoverWatch) ? "hh1" : "hh0",
      // ✅ new visibility bit so dock updates correctly without full rerenders
      (shouldShowGoTop() ? "gt1" : "gt0"),
    ].join("|");

    if (fs) {
      dockWasFullscreen = true;
      clearDockIdleTimers();
      if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
      fsRestoreTimer = null;
      hideDock(dock);
      lastDockKey = stateKey;
      return;
    }

    if (dockWasFullscreen) {
      lastDockKey = stateKey;
      return;
    }

    if (stateKey === lastDockKey) return;
    lastDockKey = stateKey;

    showDock(dock, getMode() === "perf");

    // ===== HOME (global collapse/expand) =====
    if (onHome) {
      if (uiCollapsed) {
        clearDockIdleTimers();
        setDockDim(dock, false);

        const expand = makeDockButton(BTN_EXPAND, T.dock_expand);
        applyExpandAutoShrink(expand);

        expand.addEventListener("click", () => {
          setUiCollapsed(false);
          forceRenderDockNow();
          scheduleRun(true);
        });

        // ✅ NEW: go-top button above ⚙️ (only if scrolled enough)
        if (shouldShowGoTop()) {
          const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
          goTopBtn.style.background = "rgba(0,0,0,.62)";
          goTopBtn.style.border = "1px solid rgba(255,255,255,.18)";
          applyGoTopHover(goTopBtn);
          goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
          dock.replaceChildren(goTopBtn, expand);
        } else {
          dock.replaceChildren(expand);
        }
        return;
      }

      const collapse = makeDockButton(BTN_COLLAPSE, T.dock_collapse);
      collapse.style.background = "rgba(0,0,0,.55)";
      collapse.style.border = "1px solid rgba(255,255,255,.18)";
      collapse.addEventListener("click", () => {
        setUiCollapsed(true);
        forceRenderDockNow();
      });

      const shortsBtn = makeDockButton(BTN_SHORTS, "");
      const syncShortsLabel = () => {
        const enabled = getBool(KEY.shortsHome);
        shortsBtn.textContent = enabled ? T.dock_shorts_show : T.dock_shorts_hide;
        shortsBtn.style.opacity = enabled ? "1" : "0.82";
      };
      shortsBtn.addEventListener("click", () => {
        const next = !getBool(KEY.shortsHome);
        setBool(KEY.shortsHome, next);
        syncShortsLabel();

        scheduleRun(true);
        setTimeout(() => scheduleRun(true), 250);
        setTimeout(() => scheduleRun(true), 900);
        setTimeout(() => scheduleRun(true), 1800);

        registerMenu();
        forceRenderDockNow();
      });
      syncShortsLabel();

      const lowpopHomeBtn = makeDockButton(BTN_HOME, "");
      const syncLowpopHomeLabel = () => {
        const enabled = getBool(KEY.lowpopHome);
        lowpopHomeBtn.textContent = enabled ? T.dock_lowpop_home_show : T.dock_lowpop_home_hide;
        lowpopHomeBtn.style.opacity = enabled ? "1" : "0.82";
      };
      lowpopHomeBtn.addEventListener("click", () => {
        const next = !getBool(KEY.lowpopHome);
        setBool(KEY.lowpopHome, next);
        if (!next) unhideLowpop();
        syncLowpopHomeLabel();

        scheduleRun(true);
        showToast(next ? T.toast_btn_home_on : T.toast_btn_home_off, next ? "on" : "off");
        registerMenu();
        forceRenderDockNow();
      });
      syncLowpopHomeLabel();

      dock.replaceChildren(collapse, shortsBtn, lowpopHomeBtn);
      armDockIdle(dock, "home");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // ===== WATCH (local collapse/expand + header auto toggle) =====
    if (onWatch) {
      // When collapsed on watch => show only Expand (+ go-top above if needed)
      if (uiCollapsedWatch) {
        const expandW = makeDockButton(BTN_WATCH_EXPAND, T.dock_expand);
        applyExpandAutoShrink(expandW);
        expandW.addEventListener("click", () => {
          setUiCollapsedWatch(false);
          forceRenderDockNow();
          scheduleRun(true);
        });

        clearDockIdleTimers();
        setDockDim(dock, false);

        // ✅ NEW: go-top button above ⚙️ (only if scrolled enough)
        if (shouldShowGoTop()) {
          const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
          goTopBtn.style.background = "rgba(0,0,0,.62)";
          goTopBtn.style.border = "1px solid rgba(255,255,255,.18)";
          applyGoTopHover(goTopBtn);
          goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
          dock.replaceChildren(goTopBtn, expandW);
        } else {
          dock.replaceChildren(expandW);
        }
        return;
      }

      // Show "Ranger" + header toggle + lowpop toggle (watch)
      const collapseW = makeDockButton(BTN_WATCH_COLLAPSE, T.dock_collapse);
      collapseW.style.background = "rgba(0,0,0,.55)";
      collapseW.style.border = "1px solid rgba(255,255,255,.18)";
      collapseW.addEventListener("click", () => {
        setUiCollapsedWatch(true);
        forceRenderDockNow();
      });

      // Header hover toggle button (watch)
      const headerBtn = makeDockButton(BTN_HEADER, "");
      headerBtn.style.background = "rgba(0,0,0,.62)";
      headerBtn.style.border = "1px solid rgba(255,255,255,.18)";

      const syncHeaderLabel = () => {
        const enabled = getBool(KEY.headerHoverWatch);
        headerBtn.textContent = enabled ? T.dock_header_off : T.dock_header_on;
        headerBtn.style.opacity = enabled ? "1" : "0.82";
      };

      headerBtn.addEventListener("click", () => {
        const next = !getBool(KEY.headerHoverWatch);
        setBool(KEY.headerHoverWatch, next);
        syncHeaderLabel();

        bindHeaderMouse();
        applyHeaderHoverNow();

        scheduleRun(true);
        showToast(next ? T.toast_header_on : T.toast_header_off, next ? "on" : "off");
        registerMenu();
        forceRenderDockNow();
      });
      syncHeaderLabel();

      const lowpopWatchBtn = makeDockButton(BTN_WATCH, "");
      const syncLowpopWatchLabel = () => {
        const enabled = getBool(KEY.lowpopWatch);
        lowpopWatchBtn.textContent = enabled ? T.dock_lowpop_watch_show : T.dock_lowpop_watch_hide;
        lowpopWatchBtn.style.opacity = enabled ? "1" : "0.82";
      };
      lowpopWatchBtn.addEventListener("click", () => {
        const next = !getBool(KEY.lowpopWatch);
        setBool(KEY.lowpopWatch, next);
        if (!next) unhideLowpop();
        syncLowpopWatchLabel();

        scheduleRun(true);
        showToast(next ? T.toast_btn_watch_on : T.toast_btn_watch_off, next ? "on" : "off");
        registerMenu();
        forceRenderDockNow();
      });
      syncLowpopWatchLabel();

      dock.replaceChildren(collapseW, headerBtn, lowpopWatchBtn);
      armDockIdle(dock, "watch");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // other routes => empty dock
    dock.replaceChildren();
  }

  /* =========================================================
   * RUNNER (Unified) — multi-pass after navigation
   * ========================================================= */
  let scheduled = false;

  function scheduleRun(force = false) {
    if (scheduled && !force) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      run();
    }, force ? 0 : 90);
  }

  function runHome() {
    const home = homeContainer();
    if (!home) return;

    if (getBool(KEY.shortsHome)) hideShortsShelvesWithin(home, "home");
    if (getBool(KEY.newsHome)) hideNewsShelfOnHome(home);
    if (getBool(KEY.lowpopHome)) scanHomeLowpop(home);
  }

  function runSearch() {
    const search = searchContainer();
    if (!search) return;
    if (getBool(KEY.shortsSearch)) {
      hideShortsShelvesWithin(search, "search");
      hideShortsVideoResultsInSearch(search);
    }
  }

  function runWatch() {
    const watch = watchContainer();
    if (!watch) return;
    if (getBool(KEY.lowpopWatch)) scanWatchLowpop(watch);

    // ✅ apply header hover (watch only)
    bindHeaderMouse();
    applyHeaderHoverNow();
  }

  function runUI() {
    if (getBool(KEY.sidebarShorts)) hideSidebarShortsEntry();
  }

  function run() {
    maybeRedirectShortsPage();

    if (isHome()) {
      if (getMode() === "perf") runHome();
      else ecoEnqueue(homeContainer(), runHome);
    }

    if (isSearch()) {
      if (getMode() === "perf") runSearch();
      else ecoEnqueue(searchContainer(), runSearch);
    }

    if (isWatch()) {
      if (getMode() === "perf") runWatch();
      else ecoEnqueue(watchContainer(), runWatch);
    } else {
      // ✅ restore header defaults when leaving /watch
      if (headerHoverEnabled) headerDisable();
    }

    if (getMode() === "perf") runUI();
    else ecoEnqueue(document, runUI);

    if (document.body) {
      renderDock();
    }
  }

  /* =========================================================
   * OBSERVER (Perf) + Eco click nudge
   * ========================================================= */
  let mo = null;
  let ecoClickBound = false;

  function disconnectObserver() {
    if (!mo) return;
    try { mo.disconnect(); } catch (_) {}
    mo = null;
  }

  function shouldObserve() {
    if (getMode() !== "perf") return false;

    const needHome = isHome() && (getBool(KEY.shortsHome) || getBool(KEY.newsHome) || getBool(KEY.lowpopHome));
    const needSearch = isSearch() && getBool(KEY.shortsSearch);
    const needWatch = isWatch() && (getBool(KEY.lowpopWatch) || getBool(KEY.headerHoverWatch));
    const needUI = getBool(KEY.sidebarShorts);

    return needHome || needSearch || needWatch || needUI;
  }

  function connectObserver() {
    if (!shouldObserve()) {
      disconnectObserver();
      return;
    }
    if (mo) return;

    mo = new MutationObserver(() => scheduleRun(false));
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function bindEcoClickNudge() {
    if (ecoClickBound) return;
    ecoClickBound = true;

    document.addEventListener("click", (e) => {
      if (getMode() === "perf") return;
      const tEl = e.target;
      if (!tEl) return;
      const isSidebarArea = !!tEl.closest?.("ytd-guide-renderer, ytd-mini-guide-renderer, tp-yt-paper-listbox");
      if (isSidebarArea) setTimeout(() => scheduleRun(true), 80);
    }, true);
  }

  function applyMode() {
    resetEcoQueue();
    bindEcoClickNudge();
    if (getMode() === "perf") connectObserver();
    else disconnectObserver();

    lastDockKey = "";
    scheduleRun(true);
  }

  /* =========================================================
   * MENU (Categorized)
   * ========================================================= */
  let menuIds = [];

  function clearMenu() {
    for (const id of menuIds) {
      try { GM_unregisterMenuCommand(id); } catch (_) {}
    }
    menuIds = [];
  }

  function addHeader(text) {
    menuIds.push(GM_registerMenuCommand(`— ${text} —`, () => {}));
  }

  function addToggle(label, key, onChange) {
    const v = getBool(key);
    menuIds.push(GM_registerMenuCommand(`${statusLabel(v)} ${label}`, () => {
      setBool(key, !v);
      registerMenu();
      onChange?.(!v, v);
    }));
  }

  function registerMenu() {
    clearMenu();

    addHeader(T.sec_global);
    const m = getMode();
    const modeText = (m === "perf") ? T.mode_perf : T.mode_eco;
    menuIds.push(GM_registerMenuCommand(`${T.mode_label}: ${modeText}`, () => {
      const next = (getMode() === "perf") ? "eco" : "perf";
      setMode(next);
      showToast(next === "perf" ? T.toast_mode_perf : T.toast_mode_eco, "info");
      applyMode();
      registerMenu();
      scheduleRun(true);
    }));

    addHeader(T.sec_home);
    addToggle(T.opt_shorts_home, KEY.shortsHome, () => { showToast(T.toast_updated, "info"); forceRenderDockNow(); scheduleRun(true); });
    addToggle(T.opt_news_home, KEY.newsHome, () => { showToast(T.toast_updated, "info"); scheduleRun(true); });
    addToggle(T.opt_lowpop_home, KEY.lowpopHome, (nv) => {
      showToast(T.toast_updated, "info");
      if (!nv) unhideLowpop();
      forceRenderDockNow();
      scheduleRun(true);
    });

    addHeader(T.sec_search);
    addToggle(T.opt_shorts_search, KEY.shortsSearch, () => { showToast(T.toast_updated, "info"); scheduleRun(true); });

    addHeader(T.sec_watch);
    addToggle(T.opt_lowpop_watch, KEY.lowpopWatch, (nv) => {
      showToast(T.toast_updated, "info");
      if (!nv) unhideLowpop();
      forceRenderDockNow();
      scheduleRun(true);
    });

    addHeader(T.sec_navui);
    addToggle(T.opt_sidebar_shorts, KEY.sidebarShorts, () => { showToast(T.toast_updated, "info"); scheduleRun(true); });
    addToggle(T.opt_block_shorts_page, KEY.blockShortsPage, () => { showToast(T.toast_updated, "info"); maybeRedirectShortsPage(); });
    addToggle(T.opt_float_buttons, KEY.floatButtons, () => { showToast(T.toast_updated, "info"); forceRenderDockNow(); scheduleRun(true); });

    // ✅ NEW: header hover toggle (well-classed)
    addToggle(T.opt_header_hover_watch, KEY.headerHoverWatch, (nv) => {
      showToast(nv ? T.toast_header_on : T.toast_header_off, nv ? "on" : "off");
      bindHeaderMouse();
      applyHeaderHoverNow();
      forceRenderDockNow();
      scheduleRun(true);
    });

    addHeader(T.sec_actions);
    menuIds.push(GM_registerMenuCommand(T.act_apply, () => {
      showToast(T.toast_updated, "info");
      applyMode();
      scheduleRun(true);
    }));

    menuIds.push(GM_registerMenuCommand(T.act_reset, () => {
      for (const k of Object.values(KEY)) setVal(k, DEFAULTS[k]);

      setUiCollapsed(!!DEFAULTS[KEY.uiCollapsed]);
      setUiCollapsedWatch(!!DEFAULTS[KEY.uiCollapsedWatch]);

      showToast(T.toast_reset, "info");
      unhideLowpop();

      // reset header behavior
      headerDisable();

      document.getElementById(DOCK_ID)?.remove();
      lastDockKey = "";
      dockIsHidden = false;
      dockWasFullscreen = false;
      if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
      fsRestoreTimer = null;

      applyMode();
      registerMenu();
      scheduleRun(true);
    }));
  }

  /* =========================================================
   * SPA NAVIGATION — multi-pass + de-dupe
   * ========================================================= */
  let lastNavUrl = "";

  function onNavigate() {
    const url = location.href;
    if (url === lastNavUrl) return;
    lastNavUrl = url;

    maybeRedirectShortsPage();
    applyMode();
    registerMenu();

    // ✅ keep header in sync with route
    bindHeaderMouse();
    applyHeaderHoverNow();

    scheduleRun(true);
    setTimeout(() => scheduleRun(true), 250);
    setTimeout(() => scheduleRun(true), 900);
    setTimeout(() => scheduleRun(true), 1800);
  }

     /* =========================================================
   * BOOT
   * ========================================================= */
  function boot() {
    try {
      registerMenu();
      applyMode();
      onNavigate();

      // ensure dock exists early (and binds scroll listener via renderDock)
      scheduleRun(true);

      const onFsChange = () => {
        const dock = document.getElementById(DOCK_ID);
        if (!dock) return;

        if (isFullscreenNow()) {
          dockWasFullscreen = true;
          if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
          fsRestoreTimer = null;
          hideDock(dock);
        } else {
          scheduleShowDockAfterExitFS(dock);
        }
      };

      document.addEventListener("fullscreenchange", onFsChange);
      document.addEventListener("webkitfullscreenchange", onFsChange);

      window.addEventListener("yt-navigate-finish", onNavigate, true);
      window.addEventListener("popstate", onNavigate, true);
    } catch (e) {
      // si une erreur empêche tout, au moins on le voit dans la console
      console.error("[YTCF] boot error:", e);
    }
  }

  // ✅ IMPORTANT : appel réel du boot (sinon aucun menu / aucun bouton)
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
