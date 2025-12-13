code
Markdown
--- START OF FILE project-vision.md ---

⭐ ANKYY — BRAND & COMMAND CENTER VISION ⭐

Document Purpose: Strategic blueprint for Ankyy.com. This is the "Headquarters" of the digital empire. It serves as the public face (Brand), the voice (Blog), and the brain (Admin Panel) for all isolated tools like MusicBox.

---

### 🎨 0. THE "ANKYY AESTHETICS" PROTOCOL (Strict Design Mandate)
**Note to AI Developers:** Any UI/UX code generated for this project must strictly adhere to these standards. **Do not produce generic designs.**

*   **Vibe:** "Cinematic Minimalist" & "Controlled Power." Think Apple meets a Hacker Terminal.
*   **Typography:** Strict usage of `Inter` (UI) and `Space Mono` (Data/Code).
*   **Palette:**
    *   Backgrounds: Pure White (`#FFFFFF`) or Deepest Black (`#050505`).
    *   Accents: Electric Teal (`#00F5C4`) or Emerald Green (`#10B981`) for success states.
    *   Text: High Contrast (No washed-out grays).
*   **Interaction:**
    *   Buttons must have hover states (Scale/Shadow).
    *   Transitions must use `Framer Motion` (Smooth, physics-based).
    *   **No Default Scrollbars:** Use the custom "thin" CSS scrollbar.
*   **Layout:** "Industry Level." Generous whitespace, split-screen editors, glassmorphism overlays, and dashboard-style density for data.

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
*   **Framework:** React 18 (CRA).
*   **Performance:** Code Splitting (`React.lazy`), Gzip Compression.
*   **SEO:** `react-helmet-async` (Dynamic Meta Tags), JSON-LD schemas.
*   **Networking:** Relative API paths (Production hardcoded).

**Admin Panel ("The Studio"):**
*   **Framework:** React 18 (Separate Build).
*   **Editor:** `react-quill-new` (Rich Text + Images).
*   **Visuals:** `recharts` (Analytics), `lucide-react` (Icons).
*   **Security:** JWT Decoding, Protected Routes.

**Backend (The Fortress):**
*   **Runtime:** Node.js + Express.
*   **Database:** MongoDB (Atlas).
*   **Auth:** "Iron Fortress" Protocol (Bcrypt + JWT). 1/1 Founder Slot.
*   **Storage:** Local `uploads/` folder (Mapped via Nginx).

**Infrastructure:**
*   **Server:** DigitalOcean Droplet (Ubuntu 24.04).
*   **Reverse Proxy:** Nginx (Highly Customized: Priority Shields `^~`, Caching).
*   **Process Manager:** PM2.

---

### 3. Architecture & Folder Structure

The project follows a Monorepo structure containing the Brand Site, Admin Panel, and API.

```text
/var/www/ankyy.com/
├── admin/                 # The "God Mode" Dashboard
│   ├── src/App.js         # The "Studio" Logic
│   └── build/             # Production Assets
├── backend/               # The API Node.js Server
│   ├── uploads/           # Blog images (Served via Nginx Alias)
│   ├── .env               # Secrets (Mongo URI, JWT_SECRET)
│   └── server.js          # Core Logic (Auth, Blog, Sitemap)
├── frontend/              # The Public Website
│   ├── src/pages/         # BlogFeed, Article (Image URL Fixers included)
│   └── build/             # Production Assets
├── docs/                  # Documentation
│   ├── project-journal.md
│   └── project-vision.md
└── nginx-production.conf  # Backup of active Server Config
4. Feature Roadmap
Phase 1: Foundation (Completed)

"Cinematic" Homepage Design.

Blog Engine (CMS + Frontend Feed).

Separation of concerns (MusicBox removed).
Phase 2: Security & SEO (Completed)

Iron Fortress: Secure Login, Founder-Only Access, Signup Lock.

Automated SEO: Dynamic Sitemap generator + Meta Tag injection.

Performance: 100/100 Optimization (Gzip + Caching).

Admin 2.0: Split-screen "Studio" Editor with Publish Toggles.
Phase 3: The "God Mode" Connection (Next Priority)

Socket Link: Establish secure WebSocket between Ankyy Admin and musicbox.life.

Live Monitoring: View real-time CPU/Download stats from the remote server.

Remote Kill Switch: Ability to ban IPs or delete files on MusicBox from Ankyy Admin.
Phase 4: Expansion & Monetization

Newsletter: Integrate email capture on Blog.

Ad Integration: Prepare MusicBox.life for ad slots.

TeerBook: Finance Tool (Subdomain).

DocuFlow: SaaS Tool (Subdomain).
5. Deployment Strategy
Primary Method: "Reverse Sync" (Server -> Local -> GitHub).
Why: We often tweak Nginx or Configs directly on the server.
Build Process:
Always rebuild both Admin and Frontend after git pull.
Use pm2 restart ankyy-api for backend changes.
Domain Mapping:
ankyy.com -> Frontend Build.
ankyy.com/admin -> Admin Build.
ankyy.com/api -> Node.js Backend.
ankyy.com/uploads -> Backend Images (Nginx Alias).