# Flier Studio

Monorepo: React design studio (`frontend/`) + Express API (`backend/`).

## Quick start

From the **repo root**:

```bash
npm run dev
```

API (Google sign-in):

```bash
npm run dev:api
```

Or run inside each package:

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

Open `http://localhost:5173`. Configure `.env` files from each package’s `.env.example`.

## Add your assets

```text
frontend/public/assets/
```

Example paths in code: `/assets/logo.png`, `/assets/hero.jpg`.

## Design with Cursor

1. Send a reference flier image (or describe the look).
2. Say the platform/size and the copy.
3. Cursor updates `frontend/src/design/tokens.js` + the flier under `frontend/src/fliers/`.
4. Refresh the browser and download.

See `frontend/DESIGN_PRINCIPLES.md` for composition, type, color, and prompting tips.

## Design samples (style library)

1. Drop a reference into `frontend/sample/inbox/`, **or** a whole folder of variations.
2. Ask Cursor to analyze it (follows `frontend/sample/ANALYZE.md`).
3. Cursor creates `frontend/src/samples/{id}/` with `PRINCIPLES.md`, demo fliers, and placeholders.
4. Open **Samples** in the studio — browse collections and templates.

## Auth

Google Sign-In is required to open the studio. See `backend/.env.example` and `frontend/.env.example`.

### Production (`https://www.flierstudio.com`)

The frontend does **not** need a public site URL env var for routing — it *is* the client. Brand copy like `flierstudio.design` is display-only and is not the deploy domain.

**Backend host env (required):**

| Variable | Value |
|---|---|
| `CLIENT_URL` | `https://www.flierstudio.com` (canonical). Optionally comma-add `https://flierstudio.com` until apex→www redirects are solid. |
| `GOOGLE_CLIENT_ID` | Same Web client ID as frontend |
| `MONGODB_URI` / `JWT_SECRET` / `ADMIN_EMAIL` | Production values |
| `NODE_ENV` | `production` (auth cookies use `Secure` + `SameSite=None`) |

**Frontend Vercel env (required):**

| Variable | Value |
|---|---|
| `VITE_API_URL` | Production API origin, e.g. `https://api.flierstudio.com` (no trailing slash) |
| `VITE_GOOGLE_CLIENT_ID` | Same Web client ID as backend |

Rebuild/redeploy the frontend after changing any `VITE_*` var (they are baked in at build time).

**Google Cloud OAuth (Web client):**

- Authorized JavaScript origins: `https://www.flierstudio.com` (and apex if used)
- Authorized redirect URIs: `https://www.flierstudio.com` (GIS button/token flow; add apex if used)
- Also keep local origins (`http://localhost:5173`) for development

**DNS / hosting:** Prefer one canonical origin. Redirect `https://flierstudio.com` → `https://www.flierstudio.com` at the host/CDN so CORS and Google only need the www origin long-term.
