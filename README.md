# Agapay Website

**Agapay: Reading today, writing a better tomorrow**

## Project Overview
This website was developed by BSIS 3rd year students of the Technological University of the Philippines – Manila (TUP-Manila) as part of their Web Development course. It is the official web platform of **Agapay**, a non-profit civic organization that brings English reading and writing support to underprivileged Filipino children through volunteer teaching, book and supply drives, and donation campaigns, guided by the Filipino value of *Bayanihan*.

## Purpose
To connect volunteers, donors, mentors, partner schools and organizations in one place: to inform the public about Agapay's work, recruit volunteers, collect and track donations, let students and schools send help requests, and give Agapay's administrators one workspace to manage it all.

## Team Members & Roles
- **Mycha Izlia B. Ogania** – Frontend Developer
- **Hailey Micaela O. Lumanglas** – Frontend Developer
- **Ariyhanna Venice A. Macawile** – Quality Assurance
- **Ian R. Diaz** – Content Writer & Researcher
- **Elijah Clark I. Refuncion** – Project Manager

Submitted to: Prof. Mary Joy Viñas

## Tools Used
- HTML5, CSS3, JavaScript (vanilla, no frameworks)
- Browser `localStorage` (shared community data) and `sessionStorage` (login session)
- Visual Studio Code with the Live Server extension (local testing on port 5501)
- Git & GitHub (version control, team collaboration)
- GitHub Pages, published with GitHub Actions (deployment)

## Site Structure
The public site is a single-page website: every page is a section of `index.html`, shown through `#` links (for example `index.html#about`). The admin workspace is a separate page, `admin.html`.

```
Agapay_Website/
├── index.html      – all public pages (Home, About Us, Volunteer, Mentorship, Awareness, Donations, Account)
├── admin.html      – Admin Module (Overview, Volunteers, Donations, Partners, Content, Reports)
├── style.css       – styles for the public site
├── admin.css       – styles for the admin workspace
├── script.js       – navigation, login/logout, route protection
├── shared.js       – shared data layer + dynamic content (campaigns, posts, forms, donations)
├── admin.js        – admin workspace logic
└── assets/         – logo, banners, event/campaign photos, team photos
```

| Section | What it does |
|---|---|
| Home (`#home`) | Hero, featured volunteer events, active donation drives, FAQs |
| About Us (`#about`) | Mission, vision, objectives, company history, impact numbers, sponsors |
| Volunteer (`#volunteer-opportunities`) | Volunteer opportunities, who can volunteer, benefits, event registration form |
| Mentorship (`#mentorship`) | Mentor profiles, Become a Mentor application, Help Request form |
| Awareness | News & Updates, Blog / Articles, Success Stories, Educational Resources, Campaigns |
| Donations (`#donation`) | Fundraising campaigns with progress bars, Story / Update / Donors tabs, Donate Now (GCash, Maya, bank transfer + reference number) |
| Account | Sign Up, Log In, My Profile (Personal Info, My Donations, My Volunteerism, Password & Security) |
| Admin Module (`admin.html`) | Manage volunteers/mentors, verify donations, manage partners, publish content, reports |

## Design Concept
- **Color scheme:** light and dark blue (`#315B91` primary, `#24487A` dark, `#EAF4FF` background) with white cards
- **Typography:** sans-serif for headings and body text for readability; italic Poltawski Nowy for the Agapay wordmark
- **Layout:** consistent spacing, card-based sections, and a mobile-friendly layout (responsive breakpoints in `style.css` and `admin.css`)
- **Accessibility:** semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`), labelled form fields, and alt text on every image

## JavaScript Features
- Single-page navigation and protected routes (admin pages only open for administrators)
- Form handling across the 18 forms of the site (sign up, volunteer registration, mentor application, help request, donations and more): required fields, email / phone / password input types and minimum lengths, plus JavaScript checks and an error message on the log-in form
- Donation flow with campaign progress bars and donor lists
- Admin changes (publishing content, verifying donations, accepting mentors, adding partners) appear on the public pages through a shared data store that both sides read and write

## Try It
Open the live site and use the demo accounts shown on the Log In page. *Demo accounts are for presentation only.*

| Role | Email | Password |
|---|---|---|
| Member | `juan@email.com` | `Juan12345` |
| Member | `maria.santos@email.com` | `Maria12345` |
| Administrator | `admin@agapay.org` | `Admin12345` |

## Run Locally
1. Clone the repository: `git clone https://github.com/elijahclrk/Web-Dev-Lab-Github.git`
2. Open the `Agapay_Website` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Deployment
- GitHub Repository: [https://github.com/elijahclrk/Web-Dev-Lab-Github](https://github.com/elijahclrk/Web-Dev-Lab-Github)
- Live Site: [https://elijahclrk.github.io/Web-Dev-Lab-Github/](https://elijahclrk.github.io/Web-Dev-Lab-Github/)

The workflow in `.github/workflows/pages.yml` publishes the `Agapay_Website` folder to GitHub Pages every time code is pushed to `main`. (In the repository: **Settings → Pages → Source: GitHub Actions**.)

## Documentation
The printed and digital documentation (updated project plan, screenshots, summary of challenges, evaluation rubric) is submitted together with this repository. The team's Git workflow guide is in [GIT_GUIDE.md](GIT_GUIDE.md).

## Lessons Learned
- Collaborating in Git: frequent pulls before pushes, clear commit messages, and resolving merge conflicts together
- Deploying a static site through GitHub Pages, including that its server is **case-sensitive**: `Agapay Logo.png` and `agapay logo.png` are different files there, even though both work on Windows
- Keeping the admin side and the public side in sync by reading and writing one shared data store
- Practicing responsive design and semantic HTML

## Timeline
| Phase | Task | Date |
|-------|------|------|
| Proposal | Proposal presentation | Sept 21, 2026 |
| Design | High-fidelity prototyping | Sept 22 – 28, 2026 |
| Development | Frontend, backend logic, data integration | Sept 29 – Nov 2, 2026 |
| Testing | Functional and non-functional testing | Nov 3 – 11, 2026 |
| Finalization | Bug fixing and system finalization | Nov 12 – 20, 2026 |
| Deployment | GitHub Pages setup and launch | Nov 21 – 23, 2026 |
| Submission | Final presentation and documentation | Nov 23, 2026 |

The comparison of this plan against the actual progress is in the project documentation.

## Known Limitations
- Data (donations, posts, applications, mentors, partners) is kept in the browser's `localStorage`; no external database is connected. Changes made in the admin workspace are visible in the same browser, not across different devices.
- Login is a front-end demonstration with fixed demo accounts; it is not a real authentication system.