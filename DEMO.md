# Home History — demo flows

## 1. Landing → open a home

1. Start the app (`npm run dev`) and open `http://localhost:3000`.
2. Read the pitch; enter a street address (e.g. `18 Cedar Lane, Seattle`).
3. Click **Open this home**.
4. You land on `/h/18-cedar-lane-seattle` with an empty timeline and a shareable link.

## 2. Add a photo + story

1. On the home page, click **Add a memory**.
2. Optional: set year `2018` (and end year if you like).
3. Write a short note, e.g. “First summer — we painted the porch blue.”
4. Attach one or more photos; click **Save to this home**.
5. The timeline shows the entry in chronological order with the image(s).

## 3. Reopen after restart

1. Stop the dev server, start it again.
2. Visit the same `/h/...` URL (or re-enter the same address on the landing page).
3. The home, story, and photos are still there — backed by SQLite + `public/uploads`.

## 4. Share

Use **Copy link** on the home page and open that URL in another tab/window to view the same timeline without creating anything new.
