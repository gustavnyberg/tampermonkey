// ==UserScript==
// @name         LinkedIn | Invite to follow Company Page
// @namespace    https://github.com/gustavnyberg/tampermonkey
// @version      1.0.0
// @description  Adds select all invite connections to follow a LinkedIn company page
// @author       Gustav Nyberg
// @match        https://www.linkedin.com/company/*/admin/dashboard/
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @updateURL    https://raw.githubusercontent.com/gustavnyberg/tampermonkey/main/UserScripts/LinkedIn/invite-to-follow-company-page.user.js
// @downloadURL  https://raw.githubusercontent.com/gustavnyberg/tampermonkey/main/UserScripts/LinkedIn/invite-to-follow-company-page.user.js
// ==/UserScript==


(function () {
    'use strict';

    class LinkedInInviter {
        async runSelectAll() {
            const available = this.getAvailableCredits();
            if (!available) {
                this.log("No available credits. Stopping.");
                return;
            }

            let invited = 0;
            let attempts = 0;
            const maxAttempts = 30;

            while (invited < available && attempts < maxAttempts) {
                const container = this.getResultsContainer();
                if (!container) {
                    this.log("Results container not found yet. Waiting...");
                    await this.wait(500);
                    attempts++;
                    continue;
                }

                const checkboxes = this.findInviteCheckboxes(container);
                const remaining = available - invited;

                if (checkboxes.length > 0) {
                    for (const cb of checkboxes.slice(0, remaining)) cb.click();
                    invited += Math.min(remaining, checkboxes.length);
                    this.log(`Selected ${invited}/${available}`);
                    attempts++;
                    await this.wait(1200);
                    continue;
                }

                // If no checkboxes, scroll and click "Show more" if it appears
                await this.scrollToBottom(container);

                const showMore = this.findShowMoreButton(container);
                if (showMore) {
                    this.log("Clicking 'Show more results'...");
                    showMore.click();
                    await this.wait(1200);
                } else {
                    this.log("No more results to load.");
                    break;
                }

                attempts++;
            }

            this.log(`Done. Total invited: ${invited}`);
        }

        addButtons() {
            if (document.getElementById('SelectAllBtn')) return;

            const creditsSpan = this.findCreditsElement();
            if (!creditsSpan) return;

            const parent = creditsSpan.closest('div');
            if (!parent) return;

            parent.appendChild(this.createButton("Select All", () => this.runSelectAll()));
            this.log("Buttons added.");
        }

        /* --- DOM helpers --- */

        getResultsContainer() {
            return document.getElementById('invitee-picker-results-container');
        }

        findInviteCheckboxes(scope) {
            return [...scope.querySelectorAll('input[type="checkbox"]')]
                .filter(cb => !cb.checked && !cb.disabled && cb.offsetParent !== null);
        }

        findCreditsElement() {
            return [...document.querySelectorAll('span')]
                .find(el => /credit/i.test(el.textContent));
        }

        getAvailableCredits() {
            const el = this.findCreditsElement();
            if (!el) return null;
            const match = el.textContent.match(/(\d+)\s*\/\s*(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        }

        findShowMoreButton(container) {
            return [...container.parentElement.querySelectorAll('button span.artdeco-button__text')]
                .find(el => el.textContent.trim().toLowerCase() === 'show more results')
                ?.closest('button');
        }

        async scrollToBottom(container) {
            container.scrollTop = container.scrollHeight;
            await this.wait(600);
        }

        /* --- Utilities --- */

        createButton(label, onClick) {
            const btn = document.createElement('button');
            btn.id = label.replace(/\s+/g, '') + "Btn";
            btn.innerText = label;
            Object.assign(btn.style, {
                padding: '6px 12px',
                fontWeight: 'bold',
                backgroundColor: '#0073b1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            });
            btn.addEventListener('click', onClick);
            return btn;
        }

        wait(ms) { return new Promise(r => setTimeout(r, ms)); }
        log(msg) { console.log(`[LinkedIn Inviter] ${msg}`); }
    }

    /* --- Bootstrap --- */

    const inviter = new LinkedInInviter();

    const observer = new MutationObserver(() => inviter.addButtons());
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => inviter.addButtons(), 3000);
})();