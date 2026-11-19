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

    window.addEventListener('hashchange', guardRoute);

    /* ---------- start ---------- */
    applySession(getSession());
    guardRoute();
})();
