--- START OF FILE project-journal.md ---

🚀 ANKYY BRAND — DEVELOPMENT LOG

**Project:** Ankyy.com (Headquarters)
**Status:** 🟢 LIVE (Production)
**Last Major Action:** The "Great Split" Architecture Change.

---

### ENTRY: The Great Split (Migration to Empire Architecture)
**Date:** Friday, December 12, 2025
**Goal:** Separate the risky "MusicBox" tool from the main "Ankyy" brand to ensure long-term stability and SEO safety.

**Actions Taken:**
1.  **Codebase Surgery:**
    *   Cloned the original codebase into `Ankyy_Brand`.
    *   **Backend:** Removed `yt-dlp`, `ffmpeg`, and `queue` systems. Kept Blog Schema, Admin Logic, and MongoDB connection.
    *   **Frontend:** Removed internal MusicBox routes. Updated `ToolsGrid` to link externally to `musicbox.life`.
2.  **Infrastructure:**
    *   Wiped the old DigitalOcean folder.
    *   Cloned the new clean `ankyy-brand` repository.
    *   Configured Nginx to handle the clean path paths.
3.  **Outcome:**
    *   `ankyy.com` is now a pure Brand/Blog site.
    *   It is lightweight (no heavy processing).
    *   It is safe from potential IP bans related to YouTube downloading.

**Current System State:**
*   **Blog:** Fully functional (Reading + Writing via Admin).
*   **Admin:** Live at `/admin`, currently showing local stats only.
*   **MusicBox Link:** Redirects correctly to the new external domain.

**Next Steps:**
1.  **Connect God Mode:** Update the Admin Panel to fetch real-time data from the remote `musicbox.life` server.

---

### ENTRY: Operation "Apex Predator" (SEO, Speed & The Iron Fortress)
**Date:** Friday, December 12, 2025
**Goal:** Transform Ankyy.com into an industry-grade publishing empire with 100/100 performance, automated SEO, and a military-grade Admin Panel.

**Actions Taken:**

1.  **Architecture Standardization:**
    *   Renamed server directory from `Ankyy_Brand` to `/var/www/ankyy.com` to eliminate confusion.
    *   Configured Nginx with `try_files` to fix the "Refresh 404" error on the Blog route.

2.  **Performance Engineering (The "Perfect 100"):**
    *   **Frontend:** Implemented `React.lazy` and `Suspense` (Code Splitting) to separate the heavy 3D Homepage from the lightweight Blog.
    *   **Server:** Enabled Nginx **Gzip Compression** (Level 6) and aggressive Browser Caching (1 Year) for assets.
    *   **Result:** Drastic reduction in load times and mobile data usage.

3.  **Automated SEO Engine:**
    *   **Meta Tags:** Integrated `react-helmet-async` for dynamic Title/Description injection per article.
    *   **Sitemap:** Built a Node.js engine that auto-generates `sitemap.xml` from the MongoDB database.
    *   **Routing:** Configured Nginx with `location = /sitemap.xml` to bypass React and serve raw XML directly to Googlebot.

4.  **The "Iron Fortress" (Security Upgrade):**
    *   **Auth System:** Installed `bcrypt` and `JWT`. Implemented the "First-Born Protocol" (Limits the system to exactly 1 Founder account).
    *   **Role Management:** Created logic for Founder vs. Writer access levels.
    *   **Nginx Defense:** Implemented the `^~` Priority Shield to prevent Regex conflicts that were causing 404 errors on Admin assets.

5.  **Admin Panel 2.0 ("The Studio"):**
    *   **UI Overhaul:** Deployed a Split-Screen WYSIWYG Editor with real-time metadata controls (Slug, Tags, Excerpt).
    *   **Publishing Workflow:** Added Draft/Public toggle status.
    *   **Image Handling:** Created the `getImageUrl` helper to automatically route image requests to the Live Server, fixing broken images on Localhost.

**Technical Challenges Solved:**
*   **The "Nginx Regex Trap":** Admin CSS/JS files were returning 404s because the global `.css` caching rule was overriding the `/admin` alias. Solved by adding the `^~` modifier.
*   **The "Relative Path" Trap:** Admin API calls were failing in production. Solved by hardcoding `https://ankyy.com` as the API base.
*   **The "Permission Cycle":** `npm run build` as root was locking out Nginx. Fixed via `chown www-data` and permission resets.

**Current System State:**
*   **Blog:** 🟢 Live & Indexable.
*   **Admin:** 🟢 Secured (Founder Mode Active).
*   **Performance:** 🟢 Optimized (Lazy Loaded + Gzipped).

**Next Steps:**
1.  **Connect "God Mode":** Establish the secure socket link between this Admin Panel and the remote `musicbox.life` server to monitor downloads.
2.  **Monetization:** Begin implementation of Ad slots on the remote tools.

--- END OF FILE ---