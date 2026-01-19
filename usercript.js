// ==UserScript==
// @name         YOUTUBE HOME PAGE MASQUER VIDEOS FAIBLE VUE
// @namespace    yt-hide-low-views-spa
// @version      1.0
// @description  Masque les vidéos < 5000 vues UNIQUEMENT sur la page d’accueil, compatible navigation SPA YouTube
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const MIN_VIEWS = 5000;
    let active = false;

    function isHome() {
        return location.pathname === '/';
    }

    function extractViews(text) {
        if (!text) return null;
        text = text.toLowerCase();
        if (!text.includes('vue')) return null;

        let multiplier = 1;
        if (text.includes('k')) multiplier = 1_000;
        if (text.includes('m')) multiplier = 1_000_000;

        const num = parseFloat(
            text
                .replace(/\u202f/g, '')
                .replace(/\s/g, '')
                .replace(',', '.')
                .replace(/[^\d.]/g, '')
        );

        return isNaN(num) ? null : num * multiplier;
    }

    function process(video) {
        if (!active) return;
        if (video.dataset.filtered) return;

        const spans = video.querySelectorAll('span');
        for (const span of spans) {
            const views = extractViews(span.textContent);
            if (views !== null) {
                if (views < MIN_VIEWS) {
                    video.style.display = 'none';
                }
                video.dataset.filtered = '1';
                return;
            }
        }
    }

    function scan() {
        if (!active) return;
        document
            .querySelectorAll('ytd-rich-item-renderer')
            .forEach(process);
    }

    function enable() {
        active = true;
        scan();
    }

    function disable() {
        active = false;
        document
            .querySelectorAll('ytd-rich-item-renderer[data-filtered]')
            .forEach(v => {
                v.style.display = '';
                delete v.dataset.filtered;
            });
    }

    function checkRoute() {
        if (isHome()) {
            enable();
        } else {
            disable();
        }
    }

    // Détection navigation SPA
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkRoute();
        }
    }).observe(document.body, { childList: true, subtree: true });

    new MutationObserver(scan).observe(document.body, {
        childList: true,
        subtree: true
    });

    checkRoute();
})();
