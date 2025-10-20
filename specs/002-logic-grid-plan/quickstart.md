# Quickstart — Logic Grid Puzzle MVP (local)

Prerequisites

- Node.js 18+ installed
- Git

Setup

1. Clone the repo and switch to the plan branch:

```bash
git clone https://github.com/Ruadhri/logic-grid-puzzle-nidc-workshop.git
cd logic-grid-puzzle-nidc-workshop
git checkout 002-logic-grid-plan
```

2. Install backend dependencies and run the dev server:

```bash
cd backend
npm install
npm run dev
```

3. Open the SPA in your browser at http://localhost:3000 (the backend serves the frontend)

Thin-slice demo

- Load the sample puzzle from `data/sample-puzzles/sample1.json` using the app's "Import" flow.
- Open the grid, mark a cell as Confirmed, observe a symmetric propagation (e.g., corresponding row/column cells marked Eliminated), save state, then reload to verify persistence.

File layout

- `backend/` — Node.js + Express server, constraint engine module under `backend/src/engine/`.
- `frontend/` — static SPA files served by the backend.
- `data/puzzles/` — puzzle definition JSON files.
- `data/states/` — saved puzzle state JSON files.

Testing

- Run unit tests for the logic engine (Jest):

```bash
cd backend
npm test
```

Notes

- This setup intentionally uses JSON files for persistence for the MVP. For later phases, consider migrating to SQLite for transactional safety.

*** End of quickstart.md
