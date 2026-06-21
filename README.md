# Home Catalogue — Cloudflare Pages + D1 + R2

This branch adds Cloudflare Pages Functions (serverless) to provide:
- Username/password auth + Google OAuth
- D1 schema for users, items, locations, types
- R2-backed image upload and image serving
- Minimal frontend pages for login and public catalogue list

Important environment variables / bindings (set these in Pages dashboard or wrangler.toml):

Bindings (Pages):
- DB (D1 database binding)
- R2_IMAGES (R2 binding)

Environment variables:
- JWT_SECRET (random string for signing session tokens)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- COOKIE_NAME (optional, default: hc_session)

Notes:
- You must create a D1 database and bind it to the Pages project as "DB".
- You must create an R2 bucket and bind it as "R2_IMAGES".
- For Google OAuth, create OAuth credentials and set the client ID/secret; set the redirect URI to https://<your-pages-domain>/.netlify/functions/api/auth/google/callback (or the Pages Functions URL) — see README for exact URL pattern.

Migrations are included at migrations/init.sql. On first run the functions attempt to create tables if missing.

See README.md for setup and deployment steps.
