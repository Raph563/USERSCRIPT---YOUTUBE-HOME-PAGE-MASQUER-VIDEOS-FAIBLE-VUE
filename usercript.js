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
      mode_ultra: "Ultra Éco",

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

      dock_collapse: "Ranger ▼",
      dock_expand: "Paramètre ▲",
      dock_shorts_show: "Afficher Shorts",
      dock_shorts_hide: "Masquer Shorts",
      dock_lowpop_home_show: "Afficher les vidéos peu populaires",
      dock_lowpop_home_hide: "Masquer les vidéos peu populaires",
      dock_lowpop_watch_show: "Afficher les recommandations peu populaires",
      dock_lowpop_watch_hide: "Masquer les recommandations peu populaires",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header auto hide : ON",
      dock_header_state_off: "Header auto hide : OFF",
      dock_header_label: "Header auto hide",
      dock_header_action_on: "Toujours afficher le header",
      dock_header_action_off: "Activer le masquage auto",

      dock_shorts_state_on: "Filtre Shorts : ON",
      dock_shorts_state_off: "Filtre Shorts : OFF",
      dock_shorts_label: "Shorts masqués",
      dock_shorts_action_on: "Afficher les Shorts",
      dock_shorts_action_off: "Masquer les Shorts",
      dock_shorts_info: "Masque les étagères Shorts sur la page d’accueil.",

      dock_news_label: "News masquées",
      dock_news_action_on: "Afficher les News",
      dock_news_action_off: "Masquer les News",
      dock_news_info: "Masque la section Actualités/News sur la page d’accueil.",

      dock_shorts_search_label: "Shorts masqués (Recherche)",
      dock_shorts_search_action_on: "Afficher les Shorts (Recherche)",
      dock_shorts_search_action_off: "Masquer les Shorts (Recherche)",
      dock_shorts_search_info: "Supprime les étagères Shorts et les résultats Shorts dans la recherche.",

      dock_sidebar_shorts_label: "Shorts masqués (menu)",
      dock_sidebar_shorts_action_on: "Afficher “Shorts” (menu)",
      dock_sidebar_shorts_action_off: "Masquer “Shorts” (menu)",
      dock_sidebar_shorts_info: "Cache l’entrée Shorts dans le menu latéral.",

      dock_block_shorts_label: "Page Shorts bloquée",
      dock_block_shorts_action_on: "Débloquer la page Shorts",
      dock_block_shorts_action_off: "Bloquer la page Shorts",
      dock_block_shorts_info: "Redirige la page Shorts vers l’accueil.",

      dock_lowpop_home_state_on: "Filtre impopulaire (Accueil) : ON",
      dock_lowpop_home_state_off: "Filtre impopulaire (Accueil) : OFF",
      dock_lowpop_home_label: "Vidéos peu populaires (Accueil)",
      dock_lowpop_home_action_on: "Afficher les vidéos peu populaires",
      dock_lowpop_home_action_off: "Masquer les vidéos peu populaires",
      dock_lowpop_home_info: "Masque les vidéos sous le seuil de vues sur l’accueil.",

      dock_lowpop_watch_state_on: "Filtre impopulaire (/watch) : ON",
      dock_lowpop_watch_state_off: "Filtre impopulaire (/watch) : OFF",
      dock_lowpop_watch_label: "Vidéos peu populaires (/watch)",
      dock_lowpop_watch_action_on: "Afficher les recommandations peu populaires",
      dock_lowpop_watch_action_off: "Masquer les recommandations peu populaires",
      dock_lowpop_watch_info: "Masque les recommandations sous le seuil de vues sur /watch.",

      dock_header_info: "Active le masquage auto du header sur /watch, avec apparition au survol.",
      dock_float_buttons_label: "Dock affiché",
      dock_float_buttons_action_on: "Masquer le dock",
      dock_float_buttons_action_off: "Afficher le dock",
      dock_float_buttons_info: "Affiche ou masque le dock de boutons flottants.",
      dock_menu_home_label: "Fonctionnalités Accueil",
      dock_menu_home_title: "Fonctionnalités Accueil :",
      dock_menu_home_info: "Réglages spécifiques à l'accueil (Shorts, News, vidéos peu populaires).",
      dock_menu_watch_label: "Fonctionnalités Vidéo",
      dock_menu_watch_title: "Fonctionnalités Vidéo :",
      dock_menu_watch_info: "Réglages spécifiques à la page vidéo (/watch).",
      dock_menu_search_label: "Fonctionnalités Recherche",
      dock_menu_search_title: "Fonctionnalités Recherche :",
      dock_menu_search_info: "Options dédiées aux résultats et étagères de recherche.",
      dock_menu_sidebar_label: "Fonctionnalités Menu latéral",
      dock_menu_sidebar_title: "Fonctionnalités Menu latéral :",
      dock_menu_sidebar_info: "Paramètres dédiés à la barre latérale.",
      dock_menu_adv_label: "Avancé",
      dock_menu_adv_title: "Avancé :",
      dock_menu_adv_info: "Options avancées du dock (visibilité, etc.).",
      dock_menu_back: "Retour ◀️",

      dock_mode_state_perf: "Mode : Performance",
      dock_mode_state_eco: "Mode : Économie",
      dock_mode_label: "Mode éco",
      dock_mode_action_perf: "Passer en mode Économie",
      dock_mode_action_eco: "Passer en mode Performance",
      dock_mode_status_ultra: "Mode : Ultra Éco",
      dock_mode_status_eco: "Mode : Éco",
      dock_mode_status_perf: "Mode : Performance",
      dock_mode_change: "Changer mode",
      dock_mode_back: "Retour",
      dock_mode_select: "Sélectionner votre mode :",
      dock_mode_btn_ultra: "Ultra Éco",
      dock_mode_btn_eco: "Éco",
      dock_mode_btn_perf: "Performance",
      dock_mode_info_ultra: "Ultra Éco :\n- Désactive filtres impopulaires\n- Désactive auto-hide header\n- Animations minimales\n- Moins de scans automatiques",
      dock_mode_info_eco: "Éco :\n- Scans en idle\n- Animations réduites\n- Fonctions standard",
      dock_mode_info_perf: "Performance :\n- Observers en temps réel\n- Animations complètes\n- Toutes les fonctions",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Allez en haut de la page",

      toast_updated: "Mise à jour",
      toast_reset: "Réglages réinitialisés",
      toast_mode_perf: "Mode : Performance",
      toast_mode_eco: "Mode : Économie de ressources",
      toast_mode_ultra: "Mode : Ultra Éco",
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
      mode_ultra: "Ultra Saver",

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

      dock_collapse: "Collapse ▼",
      dock_expand: "Settings ▲",
      dock_shorts_show: "Show Shorts",
      dock_shorts_hide: "Hide Shorts",
      dock_lowpop_home_show: "Show unpopular videos",
      dock_lowpop_home_hide: "Hide unpopular videos",
      dock_lowpop_watch_show: "Show unpopular recommendations",
      dock_lowpop_watch_hide: "Hide unpopular recommendations",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header auto-hide: ON",
      dock_header_state_off: "Header auto-hide: OFF",
      dock_header_label: "Header auto-hide",
      dock_header_action_on: "Keep the header always visible",
      dock_header_action_off: "Enable auto-hide",

      dock_shorts_state_on: "Shorts filter: ON",
      dock_shorts_state_off: "Shorts filter: OFF",
      dock_shorts_label: "Shorts hidden",
      dock_shorts_action_on: "Show Shorts",
      dock_shorts_action_off: "Hide Shorts",
      dock_shorts_info: "Hides Shorts shelves on the Home feed.",

      dock_news_label: "News hidden",
      dock_news_action_on: "Show News",
      dock_news_action_off: "Hide News",
      dock_news_info: "Hides the News/Top stories section on Home.",

      dock_shorts_search_label: "Shorts hidden (Search)",
      dock_shorts_search_action_on: "Show Shorts (Search)",
      dock_shorts_search_action_off: "Hide Shorts (Search)",
      dock_shorts_search_info: "Removes Shorts shelves and Shorts results in Search.",

      dock_sidebar_shorts_label: "Shorts hidden (menu)",
      dock_sidebar_shorts_action_on: "Show Shorts (menu)",
      dock_sidebar_shorts_action_off: "Hide Shorts (menu)",
      dock_sidebar_shorts_info: "Hides the Shorts entry in the sidebar.",

      dock_block_shorts_label: "Shorts page blocked",
      dock_block_shorts_action_on: "Unblock Shorts page",
      dock_block_shorts_action_off: "Block Shorts page",
      dock_block_shorts_info: "Redirects the Shorts page back to Home.",

      dock_lowpop_home_state_on: "Low-pop filter (Home): ON",
      dock_lowpop_home_state_off: "Low-pop filter (Home): OFF",
      dock_lowpop_home_label: "Low-pop videos (Home)",
      dock_lowpop_home_action_on: "Show unpopular videos",
      dock_lowpop_home_action_off: "Hide unpopular videos",
      dock_lowpop_home_info: "Hides videos under the view threshold on Home.",

      dock_lowpop_watch_state_on: "Low-pop filter (/watch): ON",
      dock_lowpop_watch_state_off: "Low-pop filter (/watch): OFF",
      dock_lowpop_watch_label: "Low-pop recs (/watch)",
      dock_lowpop_watch_action_on: "Show unpopular recommendations",
      dock_lowpop_watch_action_off: "Hide unpopular recommendations",
      dock_lowpop_watch_info: "Hides recommendations under the view threshold on /watch.",

      dock_header_info: "Enables auto-hide for the header on /watch, with reveal on hover.",
      dock_float_buttons_label: "Dock visible",
      dock_float_buttons_action_on: "Hide the dock",
      dock_float_buttons_action_off: "Show the dock",
      dock_float_buttons_info: "Shows or hides the floating button dock.",
      dock_menu_home_label: "Home Features",
      dock_menu_home_title: "Home Features:",
      dock_menu_home_info: "Home-specific settings (Shorts, News, low-pop videos).",
      dock_menu_watch_label: "Video Features",
      dock_menu_watch_title: "Video Features:",
      dock_menu_watch_info: "Video page settings (/watch).",
      dock_menu_search_label: "Search Features",
      dock_menu_search_title: "Search Features:",
      dock_menu_search_info: "Search-specific filters and shelves.",
      dock_menu_sidebar_label: "Sidebar Features",
      dock_menu_sidebar_title: "Sidebar Features:",
      dock_menu_sidebar_info: "Sidebar entry visibility choices.",
      dock_menu_adv_label: "Advanced",
      dock_menu_adv_title: "Advanced:",
      dock_menu_adv_info: "Advanced dock options (visibility, etc.).",
      dock_menu_back: "Back ◀️",

      dock_mode_state_perf: "Mode: Performance",
      dock_mode_state_eco: "Mode: Saver",
      dock_mode_label: "Eco mode",
      dock_mode_action_perf: "Switch to Saver mode",
      dock_mode_action_eco: "Switch to Performance mode",
      dock_mode_status_ultra: "Mode: Ultra Saver",
      dock_mode_status_eco: "Mode: Saver",
      dock_mode_status_perf: "Mode: Performance",
      dock_mode_change: "Change mode",
      dock_mode_back: "Back",
      dock_mode_select: "Select your mode:",
      dock_mode_btn_ultra: "Ultra Saver",
      dock_mode_btn_eco: "Saver",
      dock_mode_btn_perf: "Performance",
      dock_mode_info_ultra: "Ultra Saver:\n- Disables low-pop filters\n- Disables header auto-hide\n- Minimal animations\n- Fewer automatic scans",
      dock_mode_info_eco: "Saver:\n- Idle-time scans\n- Reduced animations\n- Standard features",
      dock_mode_info_perf: "Performance:\n- Real-time observers\n- Full animations\n- All features",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Go to the top of the page",

      toast_updated: "Updated",
      toast_reset: "Settings reset",
      toast_mode_perf: "Mode: Performance",
      toast_mode_eco: "Mode: Resource Saver",
      toast_mode_ultra: "Mode: Ultra Saver",
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
      mode_ultra: "Ultra Sparen",

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

      dock_collapse: "Einklappen ▼",
      dock_expand: "Einstellungen ▲",
      dock_shorts_show: "Shorts anzeigen",
      dock_shorts_hide: "Shorts ausblenden",
      dock_lowpop_home_show: "Unbeliebte Videos anzeigen",
      dock_lowpop_home_hide: "Unbeliebte Videos ausblenden",
      dock_lowpop_watch_show: "Unbeliebte Empfehlungen anzeigen",
      dock_lowpop_watch_hide: "Unbeliebte Empfehlungen ausblenden",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Header Auto-Hide: EIN",
      dock_header_state_off: "Header Auto-Hide: AUS",
      dock_header_label: "Header Auto-Ausblenden",
      dock_header_action_on: "Header immer anzeigen",
      dock_header_action_off: "Auto-Ausblenden aktivieren",

      dock_shorts_state_on: "Shorts-Filter: EIN",
      dock_shorts_state_off: "Shorts-Filter: AUS",
      dock_shorts_label: "Shorts ausgeblendet",
      dock_shorts_action_on: "Shorts anzeigen",
      dock_shorts_action_off: "Shorts ausblenden",
      dock_shorts_info: "Blendet Shorts-Regale auf der Startseite aus.",

      dock_news_label: "News ausgeblendet",
      dock_news_action_on: "News anzeigen",
      dock_news_action_off: "News ausblenden",
      dock_news_info: "Blendet News/Top-Meldungen auf der Startseite aus.",

      dock_shorts_search_label: "Shorts ausgeblendet (Suche)",
      dock_shorts_search_action_on: "Shorts anzeigen (Suche)",
      dock_shorts_search_action_off: "Shorts ausblenden (Suche)",
      dock_shorts_search_info: "Entfernt Shorts-Regale und Shorts-Ergebnisse in der Suche.",

      dock_sidebar_shorts_label: "Shorts ausgeblendet (Menü)",
      dock_sidebar_shorts_action_on: "Shorts anzeigen (Menü)",
      dock_sidebar_shorts_action_off: "Shorts ausblenden (Menü)",
      dock_sidebar_shorts_info: "Blendet den Shorts-Eintrag in der Seitenleiste aus.",

      dock_block_shorts_label: "Shorts-Seite blockiert",
      dock_block_shorts_action_on: "Shorts-Seite freigeben",
      dock_block_shorts_action_off: "Shorts-Seite blockieren",
      dock_block_shorts_info: "Leitet die Shorts-Seite zur Startseite um.",

      dock_lowpop_home_state_on: "Unbeliebt-Filter (Home): EIN",
      dock_lowpop_home_state_off: "Unbeliebt-Filter (Home): AUS",
      dock_lowpop_home_label: "Unbeliebte Videos (Home)",
      dock_lowpop_home_action_on: "Unbeliebte Videos anzeigen",
      dock_lowpop_home_action_off: "Unbeliebte Videos ausblenden",
      dock_lowpop_home_info: "Blendet Videos unter dem Aufruf-Schwellenwert auf Home aus.",

      dock_lowpop_watch_state_on: "Unbeliebt-Filter (/watch): EIN",
      dock_lowpop_watch_state_off: "Unbeliebt-Filter (/watch): AUS",
      dock_lowpop_watch_label: "Unbeliebte Empfehlungen (/watch)",
      dock_lowpop_watch_action_on: "Unbeliebte Empfehlungen anzeigen",
      dock_lowpop_watch_action_off: "Unbeliebte Empfehlungen ausblenden",
      dock_lowpop_watch_info: "Blendet Empfehlungen unter dem Aufruf-Schwellenwert auf /watch aus.",

      dock_header_info: "Aktiviert Auto-Hide für den Header auf /watch, mit Anzeige bei Hover.",
      dock_float_buttons_label: "Dock sichtbar",
      dock_float_buttons_action_on: "Dock ausblenden",
      dock_float_buttons_action_off: "Dock anzeigen",
      dock_float_buttons_info: "Zeigt oder versteckt das schwebende Dock.",
      dock_menu_home_label: "Startseiten-Funktionen",
      dock_menu_home_title: "Startseiten-Funktionen:",
      dock_menu_home_info: "Startseiten-spezifische Einstellungen (Shorts, News, unbeliebte Videos).",
      dock_menu_watch_label: "Video-Funktionen",
      dock_menu_watch_title: "Video-Funktionen:",
      dock_menu_watch_info: "Einstellungen für die Videoseite (/watch).",
      dock_menu_search_label: "Suche-Funktionen",
      dock_menu_search_title: "Suche-Funktionen:",
      dock_menu_search_info: "Such-spezifische Optionen für Regale und Ergebnisse.",
      dock_menu_sidebar_label: "Seitenleisten-Funktionen",
      dock_menu_sidebar_title: "Seitenleisten-Funktionen:",
      dock_menu_sidebar_info: "Einstellungen für Einträge im Seitenmenü.",
      dock_menu_adv_label: "Erweitert",
      dock_menu_adv_title: "Erweitert:",
      dock_menu_adv_info: "Erweiterte Dock-Optionen (Sichtbarkeit, etc.).",
      dock_menu_back: "Zurück ◀️",

      dock_mode_state_perf: "Modus: Leistung",
      dock_mode_state_eco: "Modus: Sparen",
      dock_mode_label: "Sparmodus",
      dock_mode_action_perf: "In Sparmodus wechseln",
      dock_mode_action_eco: "In Leistungsmodus wechseln",
      dock_mode_status_ultra: "Modus: Ultra Sparen",
      dock_mode_status_eco: "Modus: Sparen",
      dock_mode_status_perf: "Modus: Leistung",
      dock_mode_change: "Modus ändern",
      dock_mode_back: "Zurück",
      dock_mode_select: "Modus auswählen:",
      dock_mode_btn_ultra: "Ultra Sparen",
      dock_mode_btn_eco: "Sparen",
      dock_mode_btn_perf: "Leistung",
      dock_mode_info_ultra: "Ultra Sparen:\n- Unbeliebt-Filter aus\n- Header Auto-Hide aus\n- Minimale Animationen\n- Weniger automatische Scans",
      dock_mode_info_eco: "Sparen:\n- Scans im Leerlauf\n- Reduzierte Animationen\n- Standardfunktionen",
      dock_mode_info_perf: "Leistung:\n- Echtzeit-Observer\n- Volle Animationen\n- Alle Funktionen",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Zur Seitenoberkante",

      toast_updated: "Aktualisiert",
      toast_reset: "Einstellungen zurückgesetzt",
      toast_mode_perf: "Modus: Leistung",
      toast_mode_eco: "Modus: Ressourcen sparen",
      toast_mode_ultra: "Modus: Ultra Sparen",
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
      mode_ultra: "Ultra Ahorro",

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

      dock_collapse: "Colapsar ▼",
      dock_expand: "Ajustes ▲",
      dock_shorts_show: "Mostrar Shorts",
      dock_shorts_hide: "Ocultar Shorts",
      dock_lowpop_home_show: "Mostrar videos poco populares",
      dock_lowpop_home_hide: "Ocultar videos poco populares",
      dock_lowpop_watch_show: "Mostrar recomendaciones poco populares",
      dock_lowpop_watch_hide: "Ocultar recomendaciones poco populares",

      dock_header_on: "Header auto",
      dock_header_off: "Header normal",
      dock_header_state_on: "Auto-ocultar header: ON",
      dock_header_state_off: "Auto-ocultar header: OFF",
      dock_header_label: "Auto-ocultar header",
      dock_header_action_on: "Mostrar header siempre",
      dock_header_action_off: "Activar auto-ocultado",

      dock_shorts_state_on: "Filtro Shorts: ON",
      dock_shorts_state_off: "Filtro Shorts: OFF",
      dock_shorts_label: "Shorts ocultos",
      dock_shorts_action_on: "Mostrar Shorts",
      dock_shorts_action_off: "Ocultar Shorts",
      dock_shorts_info: "Oculta los estantes de Shorts en la página de inicio.",

      dock_news_label: "Noticias ocultas",
      dock_news_action_on: "Mostrar Noticias",
      dock_news_action_off: "Ocultar Noticias",
      dock_news_info: "Oculta la sección de Noticias/Top stories en Inicio.",

      dock_shorts_search_label: "Shorts ocultos (Búsqueda)",
      dock_shorts_search_action_on: "Mostrar Shorts (Búsqueda)",
      dock_shorts_search_action_off: "Ocultar Shorts (Búsqueda)",
      dock_shorts_search_info: "Quita estantes de Shorts y resultados de Shorts en la búsqueda.",

      dock_sidebar_shorts_label: "Shorts ocultos (menú)",
      dock_sidebar_shorts_action_on: "Mostrar Shorts (menú)",
      dock_sidebar_shorts_action_off: "Ocultar Shorts (menú)",
      dock_sidebar_shorts_info: "Oculta la entrada de Shorts en el menú lateral.",

      dock_block_shorts_label: "Página Shorts bloqueada",
      dock_block_shorts_action_on: "Desbloquear página Shorts",
      dock_block_shorts_action_off: "Bloquear página Shorts",
      dock_block_shorts_info: "Redirige la página Shorts a Inicio.",

      dock_lowpop_home_state_on: "Filtro poco popular (Inicio): ON",
      dock_lowpop_home_state_off: "Filtro poco popular (Inicio): OFF",
      dock_lowpop_home_label: "Videos poco populares (Inicio)",
      dock_lowpop_home_action_on: "Mostrar videos poco populares",
      dock_lowpop_home_action_off: "Ocultar videos poco populares",
      dock_lowpop_home_info: "Oculta videos por debajo del umbral de vistas en Inicio.",

      dock_lowpop_watch_state_on: "Filtro poco popular (/watch): ON",
      dock_lowpop_watch_state_off: "Filtro poco popular (/watch): OFF",
      dock_lowpop_watch_label: "Recomendaciones poco populares (/watch)",
      dock_lowpop_watch_action_on: "Mostrar recomendaciones poco populares",
      dock_lowpop_watch_action_off: "Ocultar recomendaciones poco populares",
      dock_lowpop_watch_info: "Oculta recomendaciones por debajo del umbral de vistas en /watch.",

      dock_header_info: "Activa el auto-ocultado del header en /watch con aparición al pasar.",
      dock_float_buttons_label: "Dock visible",
      dock_float_buttons_action_on: "Ocultar el dock",
      dock_float_buttons_action_off: "Mostrar el dock",
      dock_float_buttons_info: "Muestra u oculta el dock de botones flotantes.",
      dock_menu_home_label: "Funciones de Inicio",
      dock_menu_home_title: "Funciones de Inicio:",
      dock_menu_home_info: "Ajustes específicos de Inicio (Shorts, Noticias, videos poco populares).",
      dock_menu_watch_label: "Funciones de Video",
      dock_menu_watch_title: "Funciones de Video:",
      dock_menu_watch_info: "Ajustes de la página de video (/watch).",
      dock_menu_search_label: "Funciones de Búsqueda",
      dock_menu_search_title: "Funciones de Búsqueda:",
      dock_menu_search_info: "Opciones centradas en resultados y estantes de búsqueda.",
      dock_menu_sidebar_label: "Funciones del Menú lateral",
      dock_menu_sidebar_title: "Funciones del Menú lateral:",
      dock_menu_sidebar_info: "Controles del acceso al menú lateral.",
      dock_menu_adv_label: "Avanzado",
      dock_menu_adv_title: "Avanzado:",
      dock_menu_adv_info: "Opciones avanzadas del dock (visibilidad, etc.).",
      dock_menu_back: "Volver ◀️",

      dock_mode_state_perf: "Modo: Rendimiento",
      dock_mode_state_eco: "Modo: Ahorro",
      dock_mode_label: "Modo ahorro",
      dock_mode_action_perf: "Cambiar a modo Ahorro",
      dock_mode_action_eco: "Cambiar a modo Rendimiento",
      dock_mode_status_ultra: "Modo: Ultra Ahorro",
      dock_mode_status_eco: "Modo: Ahorro",
      dock_mode_status_perf: "Modo: Rendimiento",
      dock_mode_change: "Cambiar modo",
      dock_mode_back: "Volver",
      dock_mode_select: "Selecciona tu modo:",
      dock_mode_btn_ultra: "Ultra Ahorro",
      dock_mode_btn_eco: "Ahorro",
      dock_mode_btn_perf: "Rendimiento",
      dock_mode_info_ultra: "Ultra Ahorro:\n- Desactiva filtros poco populares\n- Desactiva auto-ocultado del header\n- Animaciones mínimas\n- Menos escaneos automáticos",
      dock_mode_info_eco: "Ahorro:\n- Escaneos en idle\n- Animaciones reducidas\n- Funciones estándar",
      dock_mode_info_perf: "Rendimiento:\n- Observers en tiempo real\n- Animaciones completas\n- Todas las funciones",

      // ✅ CLÉ MANQUANTE AJOUTÉE
      dock_go_top: "Ir al inicio de la página",

      toast_updated: "Actualizado",
      toast_reset: "Ajustes restablecidos",
      toast_mode_perf: "Modo: Rendimiento",
      toast_mode_eco: "Modo: Ahorro de recursos",
      toast_mode_ultra: "Modo: Ultra Ahorro",
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
    mode: "ytcf_mode", // "eco" | "perf" | "ultra"

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
    if (v === "perf" || v === "ultra") return v;
    return "eco";
  }
  function setMode(m) {
    if (m === "perf" || m === "ultra") setVal(KEY.mode, m);
    else setVal(KEY.mode, "eco");
  }

  let savedUltraPrefs = null;
  function isUltraMode() {
    return getMode() === "ultra";
  }
  function enterUltraMode() {
    if (!savedUltraPrefs) {
      savedUltraPrefs = {
        lowpopHome: getBool(KEY.lowpopHome),
        lowpopWatch: getBool(KEY.lowpopWatch),
        headerHoverWatch: getBool(KEY.headerHoverWatch),
      };
    }
    setBool(KEY.lowpopHome, false);
    setBool(KEY.lowpopWatch, false);
    setBool(KEY.headerHoverWatch, false);
    headerDisable();
  }
  function exitUltraMode() {
    if (!savedUltraPrefs) return;
    setBool(KEY.lowpopHome, savedUltraPrefs.lowpopHome);
    setBool(KEY.lowpopWatch, savedUltraPrefs.lowpopWatch);
    setBool(KEY.headerHoverWatch, savedUltraPrefs.headerHoverWatch);
    savedUltraPrefs = null;
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
    perf: { bg: "#0B1220", border: "#2563EB", text: "#E0E7FF", accent: "#60A5FA" },
    eco:  { bg: "#0B1F16", border: "#16A34A", text: "#D8F6E8", accent: "#22C55E" },
    ultra:{ bg: "#1F1208", border: "#F97316", text: "#FFE9D1", accent: "#FDBA74" },
  };

  function ensureToast() {
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
    return { toast, bar, text };
  }

  function hideToast() {
    const toast = document.getElementById(TOAST_ID);
    if (!toast) return;
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }

  function showToast(message, kind = "info", durationMs = 2000) {
    if (!message) return;
    const theme = TOAST_THEME[kind] || TOAST_THEME.info;
    const { toast, bar, text } = ensureToast();

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
    if (durationMs > 0) {
      showToast._t = setTimeout(() => {
        hideToast();
      }, durationMs);
    }
  }

  function showStickyToast(message, kind = "info") {
    showToast(message, kind, 0);
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
  const YT_HDR_HIDE_DELAY = 1200;
  const YT_HDR_SEARCH_GRACE_MS = 1500;

  let headerHoverEnabled = false;
  let headerPinned = false;
  let headerHideTimer = null;
  let searchActiveUntil = 0;
  let searchSuggestObserver = null;
  let searchSuggestEl = null;
  let searchBoxEl = null;
  let searchInputEl = null;
  let headerPinRaf = 0;

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

  let headerEl = null;
  function getHeaderEl() {
    if (!headerEl || !headerEl.isConnected) {
      headerEl = document.querySelector("ytd-masthead");
    }
    return headerEl;
  }

  function headerEnable() {
    const header = getHeaderEl();
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
    bindSearchSuggestionsObserver();
  }

  function headerDisable() {
    const header = getHeaderEl();
    const app = document.querySelector("ytd-app");
    const pageManager = document.querySelector("ytd-page-manager");

    if (headerHideTimer) {
      clearTimeout(headerHideTimer);
      headerHideTimer = null;
    }
    if (headerPinRaf) {
      cancelAnimationFrame(headerPinRaf);
      headerPinRaf = 0;
    }
    searchActiveUntil = 0;
    unbindSearchSuggestionsObserver();
    headerPinned = false;

    if (header) {
      header.style.transform = "translateY(0)";
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
  }

  function applyHeaderHoverNow() {
    if (isUltraMode()) {
      if (headerHoverEnabled) headerDisable();
      return;
    }
    const want = isWatch() && getBool(KEY.headerHoverWatch);
    if (want) headerEnable();
    else headerDisable();
    updateHeaderPinnedFromSearch();
  }

  function getActiveElementDeep(root) {
    let active = root.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  function getSearchBox() {
    if (!searchBoxEl || !searchBoxEl.isConnected) {
      searchBoxEl = document.querySelector("ytd-searchbox");
    }
    return searchBoxEl;
  }

  function getSearchInput() {
    if (!searchInputEl || !searchInputEl.isConnected) {
      const box = getSearchBox();
      searchInputEl =
        box?.querySelector("input#search") ||
        box?.querySelector("input") ||
        document.querySelector("ytd-searchbox input#search") ||
        document.querySelector("ytd-searchbox input");
    }
    return searchInputEl;
  }

  function getSearchSuggestionsElement() {
    if (searchSuggestEl && searchSuggestEl.isConnected) return searchSuggestEl;
    const box = getSearchBox();
    searchSuggestEl =
      box?.shadowRoot?.querySelector("ytd-searchbox-suggestions") ||
      document.querySelector("ytd-searchbox-suggestions");
    return searchSuggestEl;
  }

  function isSearchSuggestionsOpen() {
    const el = getSearchSuggestionsElement();
    if (!el) return false;
    if (el.hasAttribute("hidden")) return false;
    if (el.getAttribute("aria-hidden") === "true") return false;
    if (el.style.display === "none" || el.style.visibility === "hidden") return false;
    const inlineStyle = (el.getAttribute("style") || "").toLowerCase();
    if (inlineStyle.includes("display: none") || inlineStyle.includes("visibility: hidden")) return false;
    if (el.hasAttribute("open")) return true;
    return true;
  }

  function bumpSearchActive() {
    searchActiveUntil = Date.now() + YT_HDR_SEARCH_GRACE_MS;
  }

  function isSearchActiveGrace() {
    return Date.now() < searchActiveUntil;
  }

  function getSearchBoxFocused(searchBox) {
    if (!searchBox) return false;
    if (searchBox.matches?.(":focus-within")) return true;
    const active = searchBox.shadowRoot?.activeElement;
    return !!(active && searchBox.contains(active));
  }

  function isSearchBoxActive() {
    const searchBox = getSearchBox();
    if (isSearchSuggestionsOpen()) return true;
    if (!searchBox) return isSearchActiveGrace();

    if (
      searchBox.hasAttribute("focused") ||
      searchBox.hasAttribute("has-focus") ||
      searchBox.hasAttribute("is-focused") ||
      searchBox.hasAttribute("active")
    ) {
      return true;
    }

    if (getSearchBoxFocused(searchBox)) return true;

    const input = getSearchInput();
    if (input && document.activeElement === input) return true;

    const active = getActiveElementDeep(document);
    if (active && (active === searchBox || searchBox.contains(active))) return true;
    if (input && (input === active || input.contains?.(active))) return true;

    return isSearchActiveGrace();
  }

  function isSearchInteractionActive() {
    const input = getSearchInput();
    if (input && (document.activeElement === input || input.contains?.(document.activeElement))) return true;
    return isSearchSuggestionsOpen();
  }

  function eventFromSearchUI(e) {
    const path = e.composedPath?.() || [];
    for (const node of path) {
      if (!node || node.nodeType !== 1) continue;
      const tag = node.tagName?.toLowerCase();
      if (tag === "ytd-searchbox" || tag === "ytd-searchbox-suggestions" || tag === "yt-searchbox") return true;
      if (node.id === "search") return true;
    }
    return false;
  }

  function bindSearchSuggestionsObserver() {
    const el = getSearchSuggestionsElement();
    if (!el) return;
    if (searchSuggestObserver && searchSuggestEl === el) return;

    if (searchSuggestObserver) {
      searchSuggestObserver.disconnect();
      searchSuggestObserver = null;
    }

    searchSuggestEl = el;
    searchSuggestObserver = new MutationObserver(() => {
      bumpSearchActive();
      scheduleHeaderPinUpdate();
    });
    searchSuggestObserver.observe(el, {
      attributes: true,
      attributeFilter: ["hidden", "open", "aria-hidden"],
    });
  }

  function unbindSearchSuggestionsObserver() {
    if (!searchSuggestObserver) return;
    searchSuggestObserver.disconnect();
    searchSuggestObserver = null;
    searchSuggestEl = null;
  }

  function updateHeaderPinnedFromSearch() {
    if (!isWatch() || !headerHoverEnabled) {
      headerPinned = false;
      return;
    }
    bindSearchSuggestionsObserver();
    headerPinned = isSearchBoxActive();
    if (headerPinned) {
      const header = getHeaderEl();
      if (header) header.style.transform = "translateY(0)";
    }
  }

  function scheduleHeaderPinUpdate() {
    if (headerPinRaf) return;
    headerPinRaf = requestAnimationFrame(() => {
      headerPinRaf = 0;
      updateHeaderPinnedFromSearch();
    });
  }

  // Mouse listener ONCE
  let headerMouseBound = false;
  let headerMouseTicking = false;
  let headerMouseY = 0;
  function bindHeaderMouse() {
    if (headerMouseBound) return;
    headerMouseBound = true;

    document.addEventListener("mousemove", (e) => {
      if (!headerHoverEnabled || headerPinned) return;
      headerMouseY = e.clientY;
      if (headerMouseTicking) return;
      headerMouseTicking = true;
      requestAnimationFrame(() => {
        headerMouseTicking = false;
        if (!headerHoverEnabled || headerPinned) return;
        const header = getHeaderEl();
        if (!header) return;

        if (headerMouseY <= YT_HDR_SHOW_ZONE) {
          if (headerHideTimer) clearTimeout(headerHideTimer);
          headerHideTimer = null;
          header.style.transform = "translateY(0)";
          return;
        }

        if (headerHideTimer) return;
        headerHideTimer = setTimeout(() => {
          headerHideTimer = null;
          if (!headerHoverEnabled || headerPinned) return;
          header.style.transform = "translateY(-100%)";
        }, YT_HDR_HIDE_DELAY);
      });
    }, { passive: true });

    document.addEventListener("scroll", () => {
      if (!headerHoverEnabled || !headerPinned || !isWatch()) return;
      if (isSearchSuggestionsOpen() || isSearchActiveGrace()) return;
      headerPinned = false;
    }, { passive: true });

    document.addEventListener("click", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      if (eventFromSearchUI(e)) {
        bumpSearchActive();
        bindSearchSuggestionsObserver();
        scheduleHeaderPinUpdate();
        return;
      }
      if (!headerPinned) return;
      headerPinned = false;
    }, true);

    document.addEventListener("input", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
    }, true);

    document.addEventListener("focusin", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
    }, true);

    document.addEventListener("focusout", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      const input = getSearchInput();
      if (!input || e.target !== input) return;
      if (isSearchSuggestionsOpen() || isSearchActiveGrace()) return;
      headerPinned = false;
    }, true);

    document.addEventListener("pointerdown", (e) => {
      if (!headerHoverEnabled || !isWatch()) return;
      if (!eventFromSearchUI(e)) return;
      bumpSearchActive();
      bindSearchSuggestionsObserver();
      scheduleHeaderPinUpdate();
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
    dock.addEventListener("mousedown", wake, true);
    dock.addEventListener("focusin", wake, true);
    dock.addEventListener("touchstart", wake, { passive: true, capture: true });
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
  const BTN_MODE_STATUS = "ytcf-btn-mode-status";
  const BTN_MODE_CHANGE = "ytcf-btn-mode-change";
  const BTN_MENU_HOME = "ytcf-btn-menu-home";
  const BTN_MENU_SEARCH = "ytcf-btn-menu-search";
  const BTN_MENU_SIDEBAR = "ytcf-btn-menu-sidebar";
  const BTN_MENU_WATCH = "ytcf-btn-menu-watch";
  const BTN_MENU_ADV = "ytcf-btn-menu-adv";
  const BTN_MENU_BACK = "ytcf-btn-menu-back";
  const BTN_MENU_TITLE = "ytcf-btn-menu-title";

  // ✅ NEW: Go top (only when dock collapsed & user scrolled enough)
  const BTN_GO_TOP = "ytcf-btn-go-top";
  const GO_TOP_ICON = "⬆️";

  // ✅ NEW: show only when user really scrolled
  function shouldShowGoTop() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const threshold = Math.max(650, Math.floor((window.innerHeight || 800) * 1.4));
    return y >= threshold;
  }

  function applyGearHover(btn) {
    if (!btn) return;
    if (btn.dataset.ytcfGearInit === "1") return;
    btn.dataset.ytcfGearInit = "1";

    const fullLabel = T.dock_expand;
    const showText = () => {
      if (!btn.isConnected) return;
      btn.textContent = fullLabel;
      btn.style.width = "auto";
      btn.style.maxWidth = "unset";
      btn.style.paddingLeft = "12px";
      btn.style.paddingRight = "12px";
      btn.title = "";
      btn.removeAttribute("aria-label");
    };

    const showIcon = () => {
      if (!btn.isConnected) return;
      btn.textContent = "⚙️";
      btn.style.width = "28px";
      btn.style.maxWidth = "28px";
      btn.style.paddingLeft = "0";
      btn.style.paddingRight = "0";
      btn.title = fullLabel;
      btn.setAttribute("aria-label", fullLabel);
    };

    showIcon();
    btn.addEventListener("mouseenter", showText);
    btn.addEventListener("mouseleave", showIcon);
    btn.addEventListener("focus", showText);
    btn.addEventListener("blur", showIcon);
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

  // ✅ minimal scroll watcher to show/hide the button (especially in ECO)
  let lastGoTopVisible = null;
  let scrollTicking = false;
  function onScrollMaybeUpdateDock() {
    if (!getBool(KEY.floatButtons)) return;

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
        const delay = isUltraMode() ? 320 : 180;
        setTimeout(() => {
          scrollTicking = false;
          onScrollMaybeUpdateDock();
        }, delay);
      }
    }, { passive: true });
  }

  let fsRestoreTimer = null;

  // Anti-flicker state
  let lastDockKey = "";
  let dockIsHidden = false;
  let dockWasFullscreen = false;
  let dockSubmenu = null; // "home" | "search" | "sidebar" | "watch" | "advanced" | null
  let modeChangeRevealUntil = 0;

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
      background: rgba(0,0,0,0.72);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      font-size: 12px;
      transform: translateZ(0);
    `;
    if (getMode() !== "perf") {
      btn.style.transform = "none";
    } else {
      btn.style.background = "linear-gradient(180deg, rgba(18,18,18,0.9), rgba(0,0,0,0.72))";
      btn.style.border = "1px solid rgba(255,255,255,0.28)";
      btn.style.boxShadow = "0 10px 22px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
      btn.style.backdropFilter = "blur(6px)";
      btn.style.webkitBackdropFilter = "blur(6px)";
      btn.style.transition = "transform 160ms ease, box-shadow 160ms ease, background 160ms ease";
    }
    return btn;
  }

  const MODE_COLORS = {
    ultra: {
      bg: "#E76F51",
      border: "#F4A08A",
      bgInactive: "#F0A891",
      borderInactive: "#F7C2B4",
      text: "#FFFFFF",
      kind: "ultra",
    },
    eco: {
      bg: "#2A9D8F",
      border: "#53B2A8",
      bgInactive: "#5FB8AD",
      borderInactive: "#8ED0C8",
      text: "#FFFFFF",
      kind: "eco",
    },
    perf: {
      bg: "#3A86FF",
      border: "#6CA6FF",
      bgInactive: "#6FA8FF",
      borderInactive: "#A6C7FF",
      text: "#FFFFFF",
      kind: "perf",
    },
  };

  function getModeStatusText() {
    const m = getMode();
    if (m === "ultra") return T.dock_mode_status_ultra;
    if (m === "perf") return T.dock_mode_status_perf;
    return T.dock_mode_status_eco;
  }

  function getModeInfoText(mode) {
    if (mode === "ultra") return T.dock_mode_info_ultra;
    if (mode === "perf") return T.dock_mode_info_perf;
    return T.dock_mode_info_eco;
  }

  function applyModeAndNotify(next) {
    setMode(next);
    if (next === "perf") showToast(T.toast_mode_perf, "info");
    else if (next === "ultra") showToast(T.toast_mode_ultra, "info");
    else showToast(T.toast_mode_eco, "info");
    applyMode();
    registerMenu();
    forceRenderDockNow();
  }

  const DOCK_STYLE_ID = "ytcf-dock-style";

  function ensureDockStyle() {
    if (document.getElementById(DOCK_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = DOCK_STYLE_ID;
    style.textContent = `
      @keyframes ytcf-eco-pulse {
        0% { box-shadow: 0 0 0 rgba(34,197,94,0); }
        50% { box-shadow: 0 0 12px rgba(34,197,94,0.35); }
        100% { box-shadow: 0 0 0 rgba(34,197,94,0); }
      }
      @keyframes ytcf-perf-pulse {
        0% { box-shadow: 0 0 0 rgba(59,130,246,0); }
        50% { box-shadow: 0 0 14px rgba(59,130,246,0.45); }
        100% { box-shadow: 0 0 0 rgba(59,130,246,0); }
      }
      @keyframes ytcf-ultra-pulse {
        0% { box-shadow: 0 0 0 rgba(231,111,81,0); }
        50% { box-shadow: 0 0 10px rgba(231,111,81,0.35); }
        100% { box-shadow: 0 0 0 rgba(231,111,81,0); }
      }
      .ytcf-mode-anim-eco { animation: ytcf-eco-pulse 2.8s ease-in-out infinite; }
      .ytcf-mode-anim-perf { animation: ytcf-perf-pulse 1.8s ease-in-out infinite; }
      .ytcf-mode-anim-ultra { animation: ytcf-ultra-pulse 3.4s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .ytcf-mode-anim-eco,
        .ytcf-mode-anim-perf,
        .ytcf-mode-anim-ultra { animation: none; }
      }
    `;
    document.documentElement.appendChild(style);
  }

  function getModeAnimationClass() {
    const mode = getMode();
    if (mode === "perf") return "ytcf-mode-anim-perf";
    if (mode === "ultra") return "ytcf-mode-anim-ultra";
    return "ytcf-mode-anim-eco";
  }

  function renderToggleState(container, label, isOn) {
    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    labelSpan.style.color = "#fff";
    labelSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    const sep = document.createTextNode(" : ");

    const stateSpan = document.createElement("span");
    stateSpan.textContent = isOn ? T.status_on : T.status_off;
    stateSpan.style.color = isOn ? "#22c55e" : "#ef4444";
    stateSpan.style.fontWeight = "700";
    stateSpan.style.textShadow = "0 1px 2px rgba(0,0,0,0.6)";

    container.replaceChildren(labelSpan, sep, stateSpan);
  }

  function makeToggleRow(options) {
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const actionBtn = makeDockButton(options.actionId, "");
    const stateBtn = makeDockButton(options.stateId, "");
    stateBtn.setAttribute("aria-disabled", "true");
    stateBtn.style.pointerEvents = "none";

    const infoBtn = makeInfoIcon(options.infoText);

    const perf = getMode() === "perf";
    const canHoverAction = !isUltraMode();

    actionBtn.style.whiteSpace = "nowrap";
    if (perf) {
      actionBtn.style.maxWidth = "0";
      actionBtn.style.paddingLeft = "0";
      actionBtn.style.paddingRight = "0";
      actionBtn.style.opacity = "0";
      actionBtn.style.transform = "translateX(6px)";
      actionBtn.style.marginRight = "-6px";
      actionBtn.style.overflow = "hidden";
      actionBtn.style.pointerEvents = "none";
      actionBtn.style.transition = "max-width 180ms ease, padding 180ms ease, opacity 180ms ease, transform 180ms ease";
    } else {
      actionBtn.style.display = "none";
      actionBtn.style.pointerEvents = "none";
    }

    const render = () => {
      renderToggleState(stateBtn, options.label, getBool(options.key));
      actionBtn.textContent = getBool(options.key) ? options.actionOn : options.actionOff;
    };

    actionBtn.addEventListener("click", () => {
      const next = !getBool(options.key);
      setBool(options.key, next);
      options.onToggle?.(next);
      render();
      registerMenu();
      forceRenderDockNow();
    });

    const showAction = () => {
      if (!canHoverAction) return;
      if (perf) {
        actionBtn.style.maxWidth = "260px";
        actionBtn.style.paddingLeft = "12px";
        actionBtn.style.paddingRight = "12px";
        actionBtn.style.opacity = "1";
        actionBtn.style.transform = "translateX(0)";
        actionBtn.style.marginRight = "0";
        actionBtn.style.pointerEvents = "auto";
      } else {
        actionBtn.style.display = "";
        actionBtn.style.pointerEvents = "auto";
      }
    };

    const hideAction = () => {
      if (perf) {
        actionBtn.style.maxWidth = "0";
        actionBtn.style.paddingLeft = "0";
        actionBtn.style.paddingRight = "0";
        actionBtn.style.opacity = "0";
        actionBtn.style.transform = "translateX(6px)";
        actionBtn.style.marginRight = "-6px";
        actionBtn.style.pointerEvents = "none";
      } else {
        actionBtn.style.display = "none";
        actionBtn.style.pointerEvents = "none";
      }
    };

    render();
    hideAction();

    if (canHoverAction) {
      wrap.addEventListener("mouseenter", showAction);
      wrap.addEventListener("mouseleave", hideAction);
      wrap.addEventListener("focusin", showAction);
      wrap.addEventListener("focusout", hideAction);
    }

    wrap.append(actionBtn, stateBtn, infoBtn);
    return wrap;
  }

  function makeMenuAccessButton(id, label, infoText, onClick, highlight = false) {
    const btn = makeDockButton(id, label);
    if (highlight) {
      btn.style.borderColor = "rgba(96,165,250,0.9)";
      btn.style.boxShadow = "0 0 18px rgba(59,130,246,0.45)";
      btn.style.background = "linear-gradient(180deg, rgba(59,130,246,0.2), rgba(0,0,0,0.8))";
      btn.style.color = "#f8fbff";
    }
    const show = () => showStickyToast(infoText, "info");
    const hide = () => hideToast();
    btn.addEventListener("mouseenter", show);
    btn.addEventListener("mouseleave", hide);
    btn.addEventListener("focus", show);
    btn.addEventListener("blur", hide);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  function makeInfoIcon(message, kind = "info") {
    const info = document.createElement("button");
    info.type = "button";
    info.textContent = "i";
    info.style.cssText = `
      width: 18px;
      height: 18px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.6);
      background: rgba(0,0,0,0.6);
      color: #ffffff;
      font-size: 11px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
    `;

    info.addEventListener("mouseenter", () => showStickyToast(message, kind));
    info.addEventListener("mouseleave", hideToast);
    info.addEventListener("focus", () => showStickyToast(message, kind));
    info.addEventListener("blur", hideToast);
    return info;
  }

  function makeModeStatusGroup() {
    ensureDockStyle();
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "row";
    wrap.style.gap = "6px";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "flex-end";

    const statusBtn = makeDockButton(BTN_MODE_STATUS, getModeStatusText());
    const color = MODE_COLORS[getMode()] || MODE_COLORS.eco;
    statusBtn.style.background = color.bg;
    statusBtn.style.border = `1px solid ${color.border}`;
    statusBtn.style.color = color.text;
    statusBtn.style.fontWeight = "700";
    statusBtn.classList.add(getModeAnimationClass());

    const changeBtn = makeDockButton(BTN_MODE_CHANGE, T.dock_mode_change);
    changeBtn.style.display = "none";
    changeBtn.addEventListener("click", () => {
      modeChangeRevealUntil = Date.now() + 500;
      const cur = getMode();
      const next = (cur === "ultra") ? "eco" : (cur === "eco" ? "perf" : "ultra");
      applyModeAndNotify(next);
    });

    const infoBtn = makeInfoIcon(getModeInfoText(getMode()));

    let hideTimer = null;
    const show = () => {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = null;
      changeBtn.style.display = "";
    };
    const scheduleHide = () => {
      if (hideTimer) clearTimeout(hideTimer);
      const delay = Math.max(0, modeChangeRevealUntil - Date.now());
      if (delay === 0) {
        if (!wrap.matches(":hover")) changeBtn.style.display = "none";
        return;
      }
      hideTimer = setTimeout(() => {
        if (!wrap.matches(":hover")) changeBtn.style.display = "none";
      }, delay);
    };

    if (Date.now() < modeChangeRevealUntil) show();

    wrap.addEventListener("mouseenter", show);
    wrap.addEventListener("mouseleave", scheduleHide);
    statusBtn.addEventListener("focus", show);
    changeBtn.addEventListener("focus", show);
    infoBtn.addEventListener("focus", show);
    statusBtn.addEventListener("blur", scheduleHide);
    changeBtn.addEventListener("blur", scheduleHide);
    infoBtn.addEventListener("blur", scheduleHide);

    wrap.append(changeBtn, statusBtn, infoBtn);
    return wrap;
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

function buildHomeRows() {
    return [
      makeToggleRow({
        actionId: "ytcf-btn-shorts-action",
        stateId: "ytcf-btn-shorts-state",
        key: KEY.shortsHome,
        label: T.dock_shorts_label,
        actionOn: T.dock_shorts_action_on,
        actionOff: T.dock_shorts_action_off,
        infoText: T.dock_shorts_info,
        onToggle: () => {
          scheduleRun(true);
          setTimeout(() => scheduleRun(true), 250);
          setTimeout(() => scheduleRun(true), 900);
          setTimeout(() => scheduleRun(true), 1800);
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-news-action",
        stateId: "ytcf-btn-news-state",
        key: KEY.newsHome,
        label: T.dock_news_label,
        actionOn: T.dock_news_action_on,
        actionOff: T.dock_news_action_off,
        infoText: T.dock_news_info,
        onToggle: () => { scheduleRun(true); },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-lowpop-home-action",
        stateId: "ytcf-btn-lowpop-home-state",
        key: KEY.lowpopHome,
        label: T.dock_lowpop_home_label,
        actionOn: T.dock_lowpop_home_action_on,
        actionOff: T.dock_lowpop_home_action_off,
        infoText: T.dock_lowpop_home_info,
        onToggle: (next) => {
          if (!next) unhideLowpop();
          scheduleRun(true);
          showToast(next ? T.toast_btn_home_on : T.toast_btn_home_off, next ? "on" : "off");
        },
      }),
    ];
}

function buildSearchRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-shorts-search-action",
      stateId: "ytcf-btn-shorts-search-state",
      key: KEY.shortsSearch,
      label: T.dock_shorts_search_label,
      actionOn: T.dock_shorts_search_action_on,
      actionOff: T.dock_shorts_search_action_off,
      infoText: T.dock_shorts_search_info,
      onToggle: () => { scheduleRun(true); },
    }),
  ];
}

function buildSidebarRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-sidebar-shorts-action",
      stateId: "ytcf-btn-sidebar-shorts-state",
      key: KEY.sidebarShorts,
      label: T.dock_sidebar_shorts_label,
      actionOn: T.dock_sidebar_shorts_action_on,
      actionOff: T.dock_sidebar_shorts_action_off,
      infoText: T.dock_sidebar_shorts_info,
      onToggle: () => { scheduleRun(true); },
    }),
  ];
}
function buildWatchRows() {
    return [
      makeToggleRow({
        actionId: "ytcf-btn-lowpop-watch-action",
        stateId: "ytcf-btn-lowpop-watch-state",
        key: KEY.lowpopWatch,
        label: T.dock_lowpop_watch_label,
        actionOn: T.dock_lowpop_watch_action_on,
        actionOff: T.dock_lowpop_watch_action_off,
        infoText: T.dock_lowpop_watch_info,
        onToggle: (next) => {
          if (!next) unhideLowpop();
          scheduleRun(true);
          showToast(next ? T.toast_btn_watch_on : T.toast_btn_watch_off, next ? "on" : "off");
        },
      }),
      makeToggleRow({
        actionId: "ytcf-btn-header-action",
        stateId: "ytcf-btn-header-state",
        key: KEY.headerHoverWatch,
        label: T.dock_header_label,
        actionOn: T.dock_header_action_on,
        actionOff: T.dock_header_action_off,
        infoText: T.dock_header_info,
        onToggle: (next) => {
          bindHeaderMouse();
          applyHeaderHoverNow();
          scheduleRun(true);
          showToast(next ? T.toast_header_on : T.toast_header_off, next ? "on" : "off");
        },
      }),
    ];
}

function buildAdvancedRows() {
  return [
    makeToggleRow({
      actionId: "ytcf-btn-block-shorts-action",
      stateId: "ytcf-btn-block-shorts-state",
      key: KEY.blockShortsPage,
      label: T.dock_block_shorts_label,
      actionOn: T.dock_block_shorts_action_on,
      actionOff: T.dock_block_shorts_action_off,
      infoText: T.dock_block_shorts_info,
      onToggle: () => { maybeRedirectShortsPage(); scheduleRun(true); },
    }),
    makeToggleRow({
      actionId: "ytcf-btn-float-buttons-action",
      stateId: "ytcf-btn-float-buttons-state",
      key: KEY.floatButtons,
      label: T.dock_float_buttons_label,
      actionOn: T.dock_float_buttons_action_on,
      actionOff: T.dock_float_buttons_action_off,
      infoText: T.dock_float_buttons_info,
      onToggle: () => { scheduleRun(true); },
    }),
  ];
}

function buildSubmenuButtons(highlightTarget) {
  return [
    makeMenuAccessButton(
      BTN_MENU_HOME,
      T.dock_menu_home_label,
      T.dock_menu_home_info,
      () => {
        dockSubmenu = "home";
        forceRenderDockNow();
      },
      highlightTarget === "home"
    ),
    makeMenuAccessButton(
      BTN_MENU_SEARCH,
      T.dock_menu_search_label,
      T.dock_menu_search_info,
      () => {
        dockSubmenu = "search";
        forceRenderDockNow();
      },
      highlightTarget === "search"
    ),
    makeMenuAccessButton(
      BTN_MENU_SIDEBAR,
      T.dock_menu_sidebar_label,
      T.dock_menu_sidebar_info,
      () => {
        dockSubmenu = "sidebar";
        forceRenderDockNow();
      },
      highlightTarget === "sidebar"
    ),
    makeMenuAccessButton(
      BTN_MENU_WATCH,
      T.dock_menu_watch_label,
      T.dock_menu_watch_info,
      () => {
        dockSubmenu = "watch";
        forceRenderDockNow();
      },
      highlightTarget === "watch"
    ),
    makeMenuAccessButton(
      BTN_MENU_ADV,
      T.dock_menu_adv_label,
      T.dock_menu_adv_info,
      () => {
        dockSubmenu = "advanced";
        forceRenderDockNow();
      }
    ),
  ];
}

  function scheduleShowDockAfterExitFS(dock) {
    if (fsRestoreTimer) clearTimeout(fsRestoreTimer);
    fsRestoreTimer = null;

    const delay = (getMode() === "ultra") ? 45000 : (getMode() === "eco" ? 30000 : 10000);
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

    const highlightTarget = isHome() ? "home" : (isSearch() ? "search" : (isWatch() ? "watch" : null));
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
      dockSubmenu ? `sm-${dockSubmenu}` : "sm0",
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

    if (dockSubmenu) {
      clearDockIdleTimers();
      setDockDim(dock, false);

      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }

      const backBtn = makeDockButton(BTN_MENU_BACK, T.dock_menu_back);
      backBtn.addEventListener("click", () => {
        dockSubmenu = null;
        forceRenderDockNow();
      });

      const submenuTitles = {
        home: T.dock_menu_home_title,
        search: T.dock_menu_search_title,
        sidebar: T.dock_menu_sidebar_title,
        watch: T.dock_menu_watch_title,
        advanced: T.dock_menu_adv_title,
      };
      const titleText = submenuTitles[dockSubmenu] || T.dock_menu_adv_title;
      const titleBtn = makeDockButton(BTN_MENU_TITLE, titleText);
      titleBtn.setAttribute("aria-disabled", "true");
      titleBtn.style.pointerEvents = "none";
      titleBtn.style.cursor = "default";
      titleBtn.style.background = "rgba(0,0,0,0.62)";
      titleBtn.style.color = "#ffffff";
      titleBtn.style.border = "1px solid rgba(255,255,255,0.18)";
      titleBtn.style.fontWeight = "700";
      titleBtn.style.opacity = "1";

      items.push(backBtn, titleBtn);
      const submenuRows = {
        home: buildHomeRows(),
        search: buildSearchRows(),
        sidebar: buildSidebarRows(),
        watch: buildWatchRows(),
        advanced: buildAdvancedRows(),
      };
      items.push(...(submenuRows[dockSubmenu] || []));

      dock.replaceChildren(...items);
      return;
    }

    // ===== HOME (global collapse/expand) =====
    if (onHome) {
      if (uiCollapsed) {
        clearDockIdleTimers();
        setDockDim(dock, false);

        const expand = makeDockButton(BTN_EXPAND, "");
        applyGearHover(expand);

        expand.addEventListener("click", () => {
          setUiCollapsed(false);
          forceRenderDockNow();
          scheduleRun(true);
        });

        // ✅ NEW: go-top button above ⚙️ (only if scrolled enough)
        if (shouldShowGoTop()) {
          const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
          applyGoTopHover(goTopBtn);
          goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
          dock.replaceChildren(goTopBtn, expand);
        } else {
          dock.replaceChildren(expand);
        }
        return;
      }

      const collapse = makeDockButton(BTN_COLLAPSE, T.dock_collapse);
      collapse.addEventListener("click", () => {
        setUiCollapsed(true);
        forceRenderDockNow();
      });

      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(collapse, modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "home");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // ===== WATCH (local collapse/expand + header auto toggle) =====
    if (onWatch) {
      // When collapsed on watch => show only Expand (+ go-top above if needed)
      if (uiCollapsedWatch) {
        const expandW = makeDockButton(BTN_WATCH_EXPAND, "");
        applyGearHover(expandW);
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
      collapseW.addEventListener("click", () => {
        setUiCollapsedWatch(true);
        forceRenderDockNow();
      });

      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(collapseW, modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "watch");
      if (getMode() === "perf") animateDockIn(dock);
      return;
    }

    // ===== SEARCH (main menu fallback) =====
    if (isSearch()) {
      const modeGroup = makeModeStatusGroup();
      const items = [];
      if (shouldShowGoTop()) {
        const goTopBtn = makeDockButton(BTN_GO_TOP, GO_TOP_ICON);
        applyGoTopHover(goTopBtn);
        goTopBtn.addEventListener("click", () => goTopNow(goTopBtn));
        items.push(goTopBtn);
      }
      items.push(modeGroup, ...buildSubmenuButtons(highlightTarget));
      dock.replaceChildren(...items);
      armDockIdle(dock, "home");
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
  let deferredRunTimer = null;

  function deferHeavyRun() {
    if (deferredRunTimer) clearTimeout(deferredRunTimer);
    const delay = isUltraMode() ? 600 : (getMode() === "eco" ? 400 : 250);
    deferredRunTimer = setTimeout(() => {
      deferredRunTimer = null;
      if (!isSearchInteractionActive()) scheduleRun(true);
    }, delay);
  }

  function scheduleRun(force = false) {
    if (scheduled && !force) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      run();
    }, force ? 0 : (isUltraMode() ? 220 : 90));
  }

  function runHome() {
    const home = homeContainer();
    if (!home) return;
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }

    if (getBool(KEY.shortsHome)) hideShortsShelvesWithin(home, "home");
    if (getBool(KEY.newsHome)) hideNewsShelfOnHome(home);
    if (!isUltraMode() && getBool(KEY.lowpopHome)) scanHomeLowpop(home);
  }

  function runSearch() {
    const search = searchContainer();
    if (!search) return;
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }
    if (getBool(KEY.shortsSearch)) {
      hideShortsShelvesWithin(search, "search");
      hideShortsVideoResultsInSearch(search);
    }
  }

  function runWatch() {
    const watch = watchContainer();
    if (!watch) return;
    const deferHeavy = isSearchInteractionActive();
    if (!isUltraMode() && getBool(KEY.lowpopWatch) && !deferHeavy) scanWatchLowpop(watch);
    if (deferHeavy) deferHeavyRun();

    // ✅ apply header hover (watch only)
    if (!isUltraMode()) {
      bindHeaderMouse();
      applyHeaderHoverNow();
    } else if (headerHoverEnabled) {
      headerDisable();
    }
  }

  function runUI() {
    if (isSearchInteractionActive()) {
      deferHeavyRun();
      return;
    }
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
    if (deferredRunTimer) {
      clearTimeout(deferredRunTimer);
      deferredRunTimer = null;
    }
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

    mo = new MutationObserver(() => {
      if (isSearchInteractionActive()) {
        deferHeavyRun();
        return;
      }
      scheduleRun(false);
    });
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
    if (isUltraMode()) enterUltraMode();
    else exitUltraMode();

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
    const modeText = (m === "perf") ? T.mode_perf : (m === "ultra" ? T.mode_ultra : T.mode_eco);
    menuIds.push(GM_registerMenuCommand(`${T.mode_label}: ${modeText}`, () => {
      const cur = getMode();
      const next = (cur === "ultra") ? "eco" : (cur === "eco" ? "perf" : "ultra");
      setMode(next);
      if (next === "perf") showToast(T.toast_mode_perf, "info");
      else if (next === "ultra") showToast(T.toast_mode_ultra, "info");
      else showToast(T.toast_mode_eco, "info");
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
      dockSubmenu = null;
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
    dockSubmenu = null;
    // ✅ keep header in sync with route
    bindHeaderMouse();
    applyHeaderHoverNow();

    scheduleRun(true);
    if (!isUltraMode()) {
      setTimeout(() => scheduleRun(true), 250);
      setTimeout(() => scheduleRun(true), 900);
      setTimeout(() => scheduleRun(true), 1800);
    }
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
