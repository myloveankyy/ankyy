--- START OF FILE project-vision.md ---

⭐ ANKYY — BRAND & COMMAND CENTER VISION ⭐

Document Purpose: Strategic blueprint for Ankyy.com. This is the "Headquarters" of the digital empire. It serves as the public face (Brand), the voice (Blog), and the brain (Admin Panel) for all isolated tools like MusicBox.

1. Core Identity & Philosophy

**Role:** The Safe Harbor.
**Domain:** https://ankyy.com
**Primary Goal:** Build high-value SEO traffic, establish personal branding, and host the centralized control systems.

**Safety Strategy (The Shield):**
*   This domain MUST remain 100% "White Hat" (Safe for AdSense/Sponsors).
*   No risky tools (YouTube downloading) run directly on this domain.
*   Tools are linked externally to "Risk Domains" (e.g., musicbox.life).

**Design Philosophy:**
*   **Aesthetic:** "Cinematic Minimalist." High contrast, typography-driven, premium feel.
*   **User Experience:** Information first. Fast loading blogs, impressive portfolio transitions.

2. Technology Stack

**Frontend (Public Site):**
*   **Framework:** React 18 (CRA)
*   **Styling:** Tailwind CSS v3.0
*   **Routing:** React Router v6
*   **SEO:** React Helmet Async (Meta Tags), JSON-LD schemas.

**Admin Panel (God Mode):**
*   **Framework:** React 18 (Separate Build)
*   **Real-Time:** Socket.io Client (Listens to remote tools).
*   **CMS:** React-Quill-New (Rich Text Editing for Blog).

**Backend (The API):**
*   **Runtime:** Node.js + Express
*   **Database:** MongoDB (Stores Blog Posts, Admin Users, Portfolio Data).
*   **Images:** Multer (Local upload handling for blog assets).
*   **Security:** Helmet.js, CORS (Locked to specific domains).

**Infrastructure:**
*   **Server:** DigitalOcean Droplet (Ubuntu 24.04).
*   **Reverse Proxy:** Nginx (Handles SSL and routing for /admin vs /).
*   **Process Manager:** PM2.

3. Architecture & Folder Structure

The project follows a Monorepo structure containing the Brand Site, Admin Panel, and API.

Ankyy_Brand/
├── admin/                 # The "God Mode" Dashboard
│   ├── public/
│   └── src/               # React Code for Admin
├── backend/               # The API Node.js Server
│   ├── uploads/           # Blog images storage
│   ├── .env               # Secrets (Mongo URI, Port)
│   └── server.js          # Main Application Logic
├── frontend/              # The Public Website
│   ├── public/
│   └── src/               # React Code for Homepage/Blog
├── docs/                  # Documentation
│   ├── project-journal.md
│   └── project-vision.md
├── .gitignore             # Git Rules
└── README.md              # Master Manual

4. Feature Roadmap

**Phase 1: Foundation (Completed)**
*   [x] "Cinematic" Homepage Design.
*   [x] Blog Engine (CMS + Frontend Feed).
*   [x] Admin Panel (Local Stats).
*   [x] Separation of concerns (MusicBox removed).

**Phase 2: The "God Mode" Connection (Next Priority)**
*   [ ] **Remote Monitoring:** Connect Admin Panel to `musicbox.life` via Socket.io/API.
*   [ ] **Remote Control:** Ability to delete files on MusicBox server from Ankyy Admin.
*   [ ] **Unified Analytics:** View total traffic across all domains in one dashboard.

**Phase 3: Content & SEO**
*   [ ] Automated Sitemap generation.
*   [ ] "Tech Tips" and "Coding" blog content strategy.
*   [ ] Newsletter integration.

**Phase 4: Expansion**
*   [ ] Launch **TeerBook** (Finance Tool) under subdomain.
*   [ ] Launch **DocuFlow** (SaaS) under subdomain.

5. Deployment Strategy

*   **Method:** "Magic Deploy" Script (`./deploy.sh`).
*   **Workflow:** Local Dev -> Push to GitHub (`ankyy-brand`) -> Pull on Server -> Build -> Restart.
*   **Domain:** `ankyy.com` (Main), `ankyy.com/admin` (Dashboard).

--- END OF FILE ---