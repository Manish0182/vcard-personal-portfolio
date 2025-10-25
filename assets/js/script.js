'use strict';

document.addEventListener('DOMContentLoaded', function () {

    const debug = true; // set false to reduce console noise

    const log = (...args) => { if (debug) console.log('[script.js]', ...args); };

    // safe query helper
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    // element toggle function
    const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle("active"); }

    /********** SIDEBAR **********/
    const sidebar = $('[data-sidebar]');
    const sidebarBtn = $('[data-sidebar-btn]');

    if (sidebarBtn && sidebar) {
        sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
        log('Sidebar toggle ready');
    } else {
        log('Sidebar elements not found:', { sidebar: !!sidebar, sidebarBtn: !!sidebarBtn });
    }

    /********** TESTIMONIALS MODAL **********/
    const testimonialsItem = $$('[data-testimonials-item]');
    const modalContainer = $('[data-modal-container]');
    const modalCloseBtn = $('[data-modal-close-btn]');
    const overlay = $('[data-overlay]');

    const modalImg = $('[data-modal-img]');
    const modalTitle = $('[data-modal-title]');
    const modalText = $('[data-modal-text]');

    const testimonialsModalFunc = function () {
        if (modalContainer && overlay) {
            modalContainer.classList.toggle("active");
            overlay.classList.toggle("active");
        }
    };

    if (testimonialsItem.length && modalContainer && modalCloseBtn && overlay) {
        testimonialsItem.forEach(item => {
            item.addEventListener('click', function () {
                try {
                    const avatar = this.querySelector("[data-testimonials-avatar]");
                    const title = this.querySelector("[data-testimonials-title]");
                    const text = this.querySelector("[data-testimonials-text]");

                    if (avatar && modalImg) { modalImg.src = avatar.src; modalImg.alt = avatar.alt || ''; }
                    if (title && modalTitle) modalTitle.innerHTML = title.innerHTML;
                    if (text && modalText) modalText.innerHTML = text.innerHTML;

                    testimonialsModalFunc();
                } catch (e) {
                    console.error('Error showing testimonial modal', e);
                }
            });
        });

        modalCloseBtn.addEventListener("click", testimonialsModalFunc);
        overlay.addEventListener("click", testimonialsModalFunc);
        log('Testimonials modal ready');
    } else {
        log('Testimonials modal elements not found or incomplete');
    }

    /********** CUSTOM SELECT & FILTER **********/
    const select = $('[data-select]');
    const selectItems = $$('[data-select-item]');
    // Note: in your HTML the attribute is data-selecct-value (typo with two c's) — keep it if present
    const selectValue = $('[data-selecct-value]') || $('[data-select-value]') || null;
    const filterBtn = $$('[data-filter-btn]');
    const filterItems = $$('[data-filter-item]');

    if (select) {
        select.addEventListener("click", function () { elementToggleFunc(this); });
    }

    const filterFunc = function (selectedValue) {
        if (!filterItems.length) return;
        selectedValue = (selectedValue || 'all').toLowerCase();
        filterItems.forEach(item => {
            const cat = (item.dataset.category || '').toLowerCase();
            if (selectedValue === 'all' || selectedValue === cat) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        log('filter applied:', selectedValue);
    };

    if (selectItems.length && selectValue) {
        selectItems.forEach(si => {
            si.addEventListener("click", function () {
                const selectedValue = this.innerText.trim();
                selectValue.innerText = selectedValue;
                elementToggleFunc(select);
                filterFunc(selectedValue.toLowerCase());
            });
        });
    } else {
        log('Select elements missing or selectValue missing');
    }

    if (filterBtn.length) {
        let lastClickedBtn = filterBtn[0];
        filterBtn.forEach(btn => {
            btn.addEventListener("click", function () {
                const selectedValue = this.innerText.trim();
                if (selectValue) selectValue.innerText = selectedValue;
                filterFunc(selectedValue.toLowerCase());

                if (lastClickedBtn) lastClickedBtn.classList.remove("active");
                this.classList.add("active");
                lastClickedBtn = this;
            });
        });
    }

    /********** CONTACT FORM **********/
    const form = $('[data-form]');
    const formInputs = $$('[data-form-input]');
    const formBtn = $('[data-form-btn]');

    if (form && formInputs.length && formBtn) {
        formInputs.forEach(inp => {
            inp.addEventListener('input', function () {
                if (form.checkValidity()) {
                    formBtn.removeAttribute('disabled');
                } else {
                    formBtn.setAttribute('disabled', '');
                }
            });
        });
        log('Contact form validation ready');
    } else {
        log('Contact form elements missing (fine if not using contact form)');
    }

    /********** PAGE NAVIGATION (FIXED) **********/
    const navigationLinks = $$('[data-nav-link]');
    const pages = $$('[data-page]');

    if (navigationLinks.length && pages.length) {

        navigationLinks.forEach(link => {
            link.addEventListener('click', function () {

                // remove 'active' from all nav buttons and pages
                navigationLinks.forEach(btn => btn.classList.remove('active'));
                pages.forEach(page => page.classList.remove('active'));

                // activate clicked nav
                this.classList.add('active');

                // map button text to data-page value
                const targetPage = this.textContent.trim().toLowerCase();

                // activate the matching page
                let found = false;
                pages.forEach(page => {
                    if (page.dataset.page === targetPage) {
                        page.classList.add('active');
                        found = true;
                    }
                });

                if (!found) {
                    console.warn('No page matched for nav link text:', targetPage);
                } else {
                    window.scrollTo(0, 0);
                }

            });
        });

        log('Page navigation ready');
    } else {
        log('Navigation or pages not found:', { navCount: navigationLinks.length, pageCount: pages.length });
    }

});
