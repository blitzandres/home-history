# Home History

A time-capsule web app for a physical home. Past and present residents leave photos and stories; future people living there open the same home file via a shareable link.

**MVP:** no address verification, no IP checks, no authentication.

**Project page:** https://andresblitz.com/projects/home-history/

**Author:** [Andrés Blitz](https://andresblitz.com/) · [@andresblitz](https://x.com/andresblitz)

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- SQLite via `better-sqlite3` (`data/home-history.db`)
- Uploaded images under `public/uploads/<slug>/`

## Run locally

```bash
cd home-history
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production-style:

```bash
npm run build
npm start
```

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page — pitch + create/open home by address |
| `/h/<slug>` | Home timeline + add-entry form |
| `POST /api/homes` | Create or open home (`{ "address": "..." }`) |
| `GET /api/homes/<slug>` | Fetch home + entries |
| `POST /api/homes/<slug>/entries` | Multipart form: `story`, `yearStart`, `yearEnd`, `photos` |

Slug example: `142 Maple Street, Portland` → `/h/142-maple-street-portland`.

## Persistence

- Database: `data/home-history.db` (created on first request)
- Images: `public/uploads/` (served statically by Next.js)

Keep the `data/` and `public/uploads/` directories if you want homes to survive restarts and deploys.

## TODO (future)

- [ ] Address / residency verification (proof someone lives or lived there)
- [ ] Optional auth / identity for editors
- [ ] Moderation, reporting, and abuse controls
- [ ] Soft privacy (hide exact address on public share pages)

See [DEMO.md](./DEMO.md) for a short walkthrough of the happy path.
