/* ==========================================================
   Agapay - admin workspace (admin.html)
   1. Guard: only the admin account may stay on this page.
   2. The Overview date and greeting follow today's date and time.
   3. Click a row in Volunteers / Donations / Partners / Content
      to expand it and see more details (click again to close).
   Sample data only, nothing is saved.
   ========================================================== */
(function () {
    'use strict';

    /* ---------- 1. Guard ---------- */
    var isAdmin = false;
    try {
        isAdmin = JSON.parse(sessionStorage.getItem('agapaySession')).role === 'admin';
    } catch (e) { isAdmin = false; }

    if (!isAdmin) {
        document.documentElement.hidden = true;
        (window.top || window).location.replace('index.html#login');
        return;
    }

    /* ---------- Live date and greeting (Overview) ---------- */
    function updateToday() {
        var now = new Date();

        var dateEl = document.getElementById('today-date');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            }).toUpperCase();
        }

        var hour = now.getHours();
        var greeting = hour < 12 ? 'Good morning' : (hour < 18 ? 'Good afternoon' : 'Good evening');
        var title = document.getElementById('overview-title');
        if (title) { title.textContent = greeting + ', Admin'; }
    }
    updateToday();
    setInterval(updateToday, 60000); /* stays correct if the page is left open past midnight */

    /* ---------- 2. Expandable rows ---------- */
    var DETAILS = {
        volunteers: {
            'Maria Santos':  { 'Phone': '0917 000 0101', 'Interests': 'Tutoring' },
            'Miguel Reyes':  { 'Phone': '0917 000 0102', 'Interests': 'Book drives' },
            'Angela Cruz':   { 'Phone': '0917 000 0103', 'Interests': 'Reading sessions' },
            'Paolo Garcia':  { 'Phone': '0917 000 0104', 'Interests': 'Event logistics' },
            'Sofia Mendoza': { 'Phone': '0917 000 0105', 'Interests': 'Mentoring' }
        },
        donations: {
            'Miguel Reyes': { 'Note': 'Waiting for the GCash reference to be matched' },
            'Anonymous':    { 'Note': 'Donor chose to stay hidden; waiting for the Maya reference to be matched' },
            'Angela Cruz':  { 'Note': 'Verified against the bank deposit slip' },
            'Paolo Garcia': { 'Note': 'Verified through the GCash receipt' }
        },
        partners: {
            'Quezon City Public Library': { 'Agreement': 'Community reading corners in public libraries' },
            'Reading Partners PH':        { 'Agreement': 'Provides volunteer tutors for weekend sessions' },
            'Bayanihan Learning Center':  { 'Agreement': 'Lends learning spaces for Agapay programs' },
            'Books for Every Child':      { 'Agreement': 'Book donations (currently paused)' }
        },
        content: {
            'Bawat Bata, Bawat Kwento Reading Drive': { 'Summary': 'Announcement for the October reading drive.' },
            '150,000 Children Reached Nationwide':    { 'Summary': 'Milestone post about Agapay\u2019s nationwide reach.' },
            'Volunteer Orientation: Quezon City':     { 'Summary': 'Draft event post for new volunteers.' },
            'A New Reading Corner in Pasay':          { 'Summary': 'Success story about a new community reading corner.' }
        }
    };

    function toggleDetails(row, info) {
        var next = row.nextElementSibling;
        if (next && next.classList.contains('row-details')) {
            next.parentNode.removeChild(next);
            row.setAttribute('aria-expanded', 'false');
            return;
        }

        var detailRow = document.createElement('tr');
        detailRow.className = 'row-details';
        var cell = document.createElement('td');
        cell.colSpan = row.cells.length;

        var list = document.createElement('p');
        list.className = 'detail-list';
        Object.keys(info).forEach(function (label) {
            var item = document.createElement('span');
            var bold = document.createElement('b');
            bold.textContent = label + ': ';
            item.appendChild(bold);
            item.appendChild(document.createTextNode(info[label]));
            list.appendChild(item);
        });

        cell.appendChild(list);
        detailRow.appendChild(cell);
        row.parentNode.insertBefore(detailRow, row.nextSibling);
        row.setAttribute('aria-expanded', 'true');
    }

    Object.keys(DETAILS).forEach(function (sectionId) {
        var section = document.getElementById(sectionId);
        if (!section) { return; }

        var rows = section.querySelectorAll('tbody tr');
        Array.prototype.forEach.call(rows, function (row) {
            var strong = row.querySelector('strong');
            var info = strong && DETAILS[sectionId][strong.textContent];
            if (!info) { return; }

            row.classList.add('is-expandable');
            row.tabIndex = 0;
            row.title = 'Click to view more details';
            row.setAttribute('aria-expanded', 'false');

            row.addEventListener('click', function (event) {
                if (event.target.closest('select, input, a, button')) { return; }
                toggleDetails(row, info);
            });
            row.addEventListener('keydown', function (event) {
                if (event.target === row && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    toggleDetails(row, info);
                }
            });
        });
    });
})();