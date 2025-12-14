Here is the **Fully Updated `project-vision.md`**.

I have updated the Architecture to reflect the new modular structure and added a **Critical Directive** for future AI agents to ensure design consistency.

--- START OF FILE project-vision.md ---

⭐ ANKYY — BRAND & COMMAND CENTER VISION ⭐

**Document Purpose:** Strategic blueprint for Ankyy.com. This is the "Headquarters" of the digital empire. It serves as the public face (Brand), the voice (Blog), and the brain (Admin Panel) for all isolated tools like MusicBox.

---

### 🚨 CRITICAL AI DIRECTIVE: DESIGN STANDARDS
**To any AI working on this project:**
You are **FORBIDDEN** from generating generic, "Bootstrap-style", or "Standard Dashboard" designs.
*   **The Standard:** All UI must be **"Industry Level"** (Think Linear, Ghost CMS, Vercel).
*   **The Vibe:** "Liquid Prism" — Floating glass panels, ambient background lighting, blur effects (`backdrop-blur-xl`), and smooth `Framer Motion` transitions.
*   **The Rule:** If it looks like a template, **it is wrong.** It must be "Sexy," "Classic," and "High-Density."
*   **Typography:** Strict usage of `Inter` (UI) and `Merriweather` (Editor) or `JetBrains Mono` (Code). No default sans-serifs.

---

### 1. Core Identity & Philosophy

**Role:** The Safe Harbor & Command Center.
**Domain:** https://ankyy.com
**Primary Goal:** Build high-value SEO traffic, establish personal branding, and host the centralized control systems.

**Safety Strategy (The Shield):**
*   This domain MUST remain 100% "White Hat" (Safe for AdSense/Sponsors).
*   No risky tools (YouTube downloading) run directly on this domain.
*   Tools are linked externally to "Risk Domains" (e.g., musicbox.life).

---

### 2. Technology Stack

**Frontend (Public Site):**
*   **Framework:** React 18.
*   **Performance:** Code Splitting (`React.lazy`), Gzip Compression.
*   **SEO:** `react-helmet-async`, Auto-generated Sitemap, JSON-LD schemas.

**Admin Panel ("The Liquid Prism"):**
*   **Design System:** Glassmorphism, Floating Sidebar, Sticky Headers.
*   **Framework:** React 18 (Modular Architecture).
*   **Editor:** Custom `ReactQuill` wrapper (Ghost CMS style) with Real-time SEO Scoring.
*   **Visuals:** `recharts` (Analytics), `lucide-react` (Icons), `framer-motion` (Animations).

**Backend (The Fortress):**
*   **Runtime:** Node.js + Express.
*   **Database:** MongoDB (Atlas).
*   **Auth:** "Iron Fortress" Protocol (Bcrypt + JWT). 1/1 Founder Slot.
*   **Storage:** Local `uploads/` folder (Mapped via Nginx alias).

**Infrastructure:**
*   **Server:** DigitalOcean Droplet (Ubuntu 24.04).
*   **Reverse Proxy:** Nginx (Highly Customized: Priority Shields `^~`, Caching, Image Serving).
*   **Process Manager:** PM2.

---

### 3. Architecture & Folder Structure

The project follows a Monorepo structure containing the Brand Site, Admin Panel, and API.

```text
/var/www/ankyy.com/
├── admin/                 # THE "LIQUID PRISM" DASHBOARD
│   ├── src/
│   │   ├── components/    # Sidebar (Floating), StatCards
│   │   ├── context/       # AuthContext (Global Session)
│   │   ├── pages/         # Dashboard, Articles (SEO Editor), Team, Settings
│   │   ├── App.js         # Main Layout Controller
│   │   └── index.css      # Global Styles (Custom Scrollbars, Ghost UI)
│   └── build/             # Production Assets
├── backend/               # THE API SERVER
│   ├── uploads/           # Images (Served via Nginx Alias)
│   ├── .env               # Secrets (Mongo URI, JWT_SECRET)
│   └── server.js          # Core Logic (Auth, Blog, Slug Collision Logic)
├── frontend/              # THE PUBLIC SITE
│   ├── src/pages/         # BlogFeed, Article (Image URL Fixers included)
│   └── build/             # Production Assets
├── docs/                  # Documentation
│   ├── project-journal.md
│   └── project-vision.md
└── nginx-production.conf  # Backup of active Server Config
```

---

### 4. Feature Roadmap

**Phase 1: Foundation (Completed)**
*   "Cinematic" Homepage Design.
*   Blog Engine (CMS + Frontend Feed).
*   Separation of concerns (MusicBox removed).

**Phase 2: Security & SEO (Completed)**
*   Iron Fortress: Secure Login, Founder-Only Access.
*   Automated SEO: Dynamic Sitemap generator + Real-time Content Intelligence.
*   Admin 2.0: "Liquid Prism" UI Overhaul (Floating Sidebar, SEO Fortress Editor).

**Phase 3: The "God Mode" Connection (Next Priority)**
*   **Socket Link:** Establish secure WebSocket between Ankyy Admin and musicbox.life.
*   **Live Monitoring:** View real-time CPU/Download stats from the remote server on the Admin Dashboard.
*   **Remote Kill Switch:** Ability to ban IPs or delete files on MusicBox from Ankyy Admin.

**Phase 4: Expansion & Monetization**
*   **Newsletter:** Integrate email capture on Blog.
*   **Ad Integration:** Prepare MusicBox.life for ad slots.
*   **TeerBook:** Finance Tool (Subdomain).

---

### 5. Deployment Strategy

**Primary Method:** "Reverse Sync" (Server -> Local -> GitHub).
*Why:* We often tweak Nginx or Configs directly on the server to fix live issues.

**Build Process:**
1.  **Frontend/Admin:** `npm run build` (Generates static files).
2.  **Backend:** `pm2 restart ankyy-api` (Reloads Node.js logic).

**Domain Mapping:**
*   `ankyy.com` -> Frontend Build.
*   `ankyy.com/admin` -> Admin Build.
*   `ankyy.com/api` -> Node.js Backend.
*   `ankyy.com/uploads` -> Backend Images (Nginx Alias).

--- END OF FILE ---