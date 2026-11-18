/* ==========================================================
   Agapay - login & role handling (demo only)

   - Accounts are hard-coded below: 2 user accounts + 1 admin.
   - The login form compares what was typed against ACCOUNTS.
   - A successful login is kept in sessionStorage and <body> gets
     the class "is-user" or "is-admin". style.css uses that class to
     show/hide the menu items, the profile page and the admin page.
   - Admin and user are separate: the admin never sees "My Profile",
     and a user never sees (or can open) the Admin page.

   NOTE: this all runs in the browser, so it is NOT real security.
   It is only for the class demo.
   ========================================================== */
(function () {
    'use strict';

    var SESSION_KEY = 'agapaySession';

    var ACCOUNTS = [
        { role: 'user',  email: 'juan@email.com',         password: 'Juan12345',
          firstName: 'Juan',  lastName: 'Dela Cruz', city: 'Antipolo' },
        { role: 'user',  email: 'maria.santos@email.com', password: 'Maria12345',
          firstName: 'Maria', lastName: 'Santos',    city: 'Quezon City' },
        { role: 'admin', email: 'admin@agapay.org',       password: 'Admin12345',
          firstName: 'Admin', lastName: '',           city: '' }
    ];

    /* ---------- session helpers ---------- */
    function findByEmail(email) {
        email = String(email || '').trim().toLowerCase();
        for (var i = 0; i < ACCOUNTS.length; i++) {
            if (ACCOUNTS[i].email === email) { return ACCOUNTS[i]; }
        }
        return null;
    }

    function getSession() {
        try {
            var saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
            var account = saved && findByEmail(saved.email);
            return account && account.role === saved.role ? account : null;
        } catch (e) { return null; }
    }

    function saveSession(account) {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email, role: account.role }));
        } catch (e) { /* storage blocked: login just will not persist */ }
    }

    function clearSession() {
        try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    }

    function landingPage(account) {
        return account.role === 'admin' ? '#admin' : '#home';
    }

    /* ---------- page state ---------- */
    function fillProfile(account) {
        var fullName = (account.firstName + ' ' + account.lastName).trim();
        var initials = (account.firstName.charAt(0) + account.lastName.charAt(0)).toUpperCase();
        var name = document.getElementById('profile-name');
        var email = document.getElementById('profile-email');
        var badge = document.getElementById('profile-initials');
        if (name)  { name.textContent = fullName; }
        if (email) { email.textContent = account.email; }
        if (badge) { badge.textContent = initials; }

        var fields = document.querySelectorAll('[data-profile]');
        for (var i = 0; i < fields.length; i++) {
            var value = account[fields[i].getAttribute('data-profile')];
            if (value) { fields[i].value = value; }
        }
    }

    function applySession(account) {
        var isAdmin = !!account && account.role === 'admin';
        var isUser  = !!account && account.role === 'user';

        document.body.classList.toggle('is-admin', isAdmin);
        document.body.classList.toggle('is-user', isUser);

        if (isUser) { fillProfile(account); }

        /* Load the admin workspace only for the admin; unload it on logout */
        var frame = document.querySelector('.admin-frame');
        if (frame) {
            if (isAdmin) {
                if (frame.getAttribute('src') !== frame.getAttribute('data-src')) {
                    frame.setAttribute('src', frame.getAttribute('data-src'));
                }
            } else if (frame.getAttribute('src')) {
                frame.setAttribute('src', 'about:blank');
            }
        }
    }

    /* Keep each role on the pages that belong to it */
    function guardRoute() {
        var hash = window.location.hash;
        var account = getSession();

        if (!account && (hash === '#admin' || hash === '#profile')) {
            window.location.hash = '#login';
        } else if (account && account.role === 'user' && hash === '#admin') {
            window.location.hash = '#home';
        } else if (account && account.role === 'admin' && hash === '#profile') {
            window.location.hash = '#admin';
        } else if (account && (hash === '#login' || hash === '#signup')) {
            window.location.hash = landingPage(account);
        }
    }

    /* ---------- events ---------- */
    var form = document.getElementById('login-form');
    if (form) {
        var emailInput = document.getElementById('login-email');
        var passwordInput = document.getElementById('login-password');
        var errorBox = document.getElementById('login-error');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var account = findByEmail(emailInput.value);

            if (account && account.password === passwordInput.value) {
                saveSession(account);
                applySession(account);
                form.reset();
                errorBox.hidden = true;
                window.location.hash = landingPage(account);
            } else {
                errorBox.hidden = false;
                passwordInput.value = '';
                passwordInput.focus();
            }
        });

        form.addEventListener('input', function () { errorBox.hidden = true; });
    }

    /* Every "Log Out" link carries the data-logout attribute */
    document.addEventListener('click', function (event) {
        if (event.target.closest && event.target.closest('[data-logout]')) {
            clearSession();
            applySession(null);
        }
    });

    /* ==========================================================
       Website content from the admin page (admin.html > Website content)
       The admin saves story text, image and status in localStorage.
       Here we read it and update the public pages:
       - cards that already exist (data-content-key) get the new text/image,
         or are hidden when the admin sets them to Draft
       - other published items get a new card on the News page
         (Success story type goes to the Success Stories page)
       ========================================================== */
    var CONTENT_KEY = 'agapayContent';

    function loadContent() {
        try { return JSON.parse(localStorage.getItem(CONTENT_KEY)) || {}; } catch (e) { return {}; }
    }

    function buildCard(key, record) {
        var pageId = record.type === 'Success story' ? 'success-stories' : 'news';
        var grid = document.querySelector('#' + pageId + ' .awareness-grid');
        if (!grid) { return; }

        var card = document.createElement('article');
        card.className = 'awareness-card';
        card.setAttribute('data-content-key', key);
        card.setAttribute('data-generated', '');

        if (record.image) {
            var wrap = document.createElement('div');
            wrap.className = 'awareness-img-wrap';
            var img = document.createElement('img');
            img.className = 'awareness-img';
            img.src = record.image;
            img.alt = record.title || '';
            var badge = document.createElement('span');
            badge.className = 'awareness-badge';
            badge.textContent = record.type || 'News';
            wrap.appendChild(img);
            wrap.appendChild(badge);
            card.appendChild(wrap);
        }

        var body = document.createElement('div');
        body.className = 'awareness-body-content';
        var date = document.createElement('p');
        date.className = 'awareness-date';
        var published = record.published && record.published !== 'Draft' ? record.published
            : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        date.textContent = (record.image ? '' : (record.type || 'News') + ' \u00b7 ') + published;
        var title = document.createElement('h3');
        title.className = 'awareness-card-title';
        title.textContent = record.title || '';
        var text = document.createElement('p');
        text.className = 'awareness-excerpt';
        text.textContent = record.story || '';
        var link = document.createElement('a');
        link.className = 'awareness-link';
        link.href = '#';
        link.textContent = 'Read more \u2192';
        body.appendChild(date);
        body.appendChild(title);
        body.appendChild(text);
        body.appendChild(link);
        card.appendChild(body);

        grid.insertBefore(card, grid.firstElementChild);
    }

    function applyContent() {
        var store = loadContent();

        /* 1. Put every card back to what the HTML says */
        var cards = document.querySelectorAll('[data-content-key]');
        Array.prototype.forEach.call(cards, function (card) {
            if (card.hasAttribute('data-generated')) { card.parentNode.removeChild(card); return; }
            card.style.display = '';
            var excerpt = card.querySelector('.awareness-excerpt');
            var image = card.querySelector('.awareness-img');
            if (excerpt && excerpt.hasAttribute('data-original')) { excerpt.textContent = excerpt.getAttribute('data-original'); }
            if (image && image.hasAttribute('data-original')) { image.src = image.getAttribute('data-original'); }
        });

        /* 2. Apply what the admin saved */
        Object.keys(store).forEach(function (key) {
            var record = store[key];
            if (!record) { return; }
            var isDraft = record.status === 'Draft';
            var card = document.querySelector('[data-content-key="' + key + '"]');

            if (card) {
                if (isDraft) { card.style.display = 'none'; return; }
                var excerpt = card.querySelector('.awareness-excerpt');
                var image = card.querySelector('.awareness-img');
                if (record.story && excerpt) {
                    if (!excerpt.hasAttribute('data-original')) { excerpt.setAttribute('data-original', excerpt.textContent); }
                    excerpt.textContent = record.story;
                }
                if (record.image && image) {
                    if (!image.hasAttribute('data-original')) { image.setAttribute('data-original', image.getAttribute('src')); }
                    image.src = record.image;
                }
            } else if (!isDraft && (record.story || record.image)) {
                buildCard(key, record);
            }
        });
    }

    /* The admin page is in an iframe of this page, so a save there fires "storage" here */
    window.addEventListener('storage', function (event) {
        if (event.key === CONTENT_KEY || event.key === null) { applyContent(); }
    });

    window.addEventListener('hashchange', guardRoute);

    /* ---------- start ---------- */
    applySession(getSession());
    applyContent();
    guardRoute();
})();