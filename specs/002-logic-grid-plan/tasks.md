# tasks.md (Phase 2 scaffold)

This file will be populated by `/speckit.tasks` in a future step. For now, it contains a high-level task list to implement the thin-slice MVP.

1. Backend scaffold
   - Initialize Node.js project under `backend/` with express and jest
   - Implement engine module `backend/src/engine/engine.js` with API surface: `loadPuzzle`, `applyMarking`, `propagate`, `validate`, `undo`
   - Implement REST endpoints for puzzle import, list, get, state get/save, and mark
   - Add simple file-based persistence under `data/puzzles` and `data/states`

2. Sample puzzle
   - Add `data/sample-puzzles/sample1.json` with a small 3x3 puzzle and one clue that triggers a propagation

3. Frontend SPA
   - Static HTML/CSS/JS under `frontend/` served by backend
   - UI: puzzle list/import, grid display, marking controls (confirm/eliminate/undo), save/load

4. Tests
   - Unit tests for `engine` module: marking, propagation, conflict detection, undo
   - Integration test: server endpoints for import/load/mark/save

5. README/Quickstart
   - Ensure quickstart.md explains how to run locally and demonstrates thin-slice flow

6. PR and review
   - Create PR for implementation branch, include tests and run instructions

*** End of tasks.md
