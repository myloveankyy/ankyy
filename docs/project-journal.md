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

--- END OF FILE ---