# research.md

## Decisions (Phase 0)

1. Decision: Runtime — Node.js 18 (LTS)
   - Rationale: Widely available on developer machines, mature ecosystem, small runtime overhead, and excellent tooling for writing a lightweight HTTP backend. Many developers already have or can easily install Node.js. Node provides the simplest path to implement a small HTTP API and file-system persistence without extra tooling.
   - Alternatives considered:
     - Fastify: faster startup and better performance at scale; slightly different API shape. Rejected for MVP to favor broad familiarity.
     - Python + FastAPI: good option, but would add language diversity; Node chosen for ecosystem uniformity with browser JS front-end.

2. Decision: HTTP framework — Express (minimal, stable)
   - Rationale: Minimal surface area, ubiquitous examples, small learning curve. Express keeps dependencies minimal and is well-known.
   - Alternatives: Fastify (better perf), Koa (modern middleware). Chosen Express for simplicity and ecosystem familiarity.

3. Decision: Frontend — vanilla HTML/CSS/JavaScript served as a simple SPA from the backend (no heavy frameworks)
   - Rationale: Keeps stack minimal, avoids build tooling as a hard dependency, and satisfies the requirement to prefer vanilla UI. The backend will serve static files from a `frontend/` folder. If a small dev server is desired, we can add Vite later as an optional dev-only enhancement.
   - Alternatives: React + Vite (more productive for complex UI), Electron (desktop). Rejected for MVP to keep dependencies small.

4. Decision: Constraint engine placement — modular library inside the backend
   - Rationale: Keeps logic separate from UI and allows engine to be extracted/reused later. Implement engine as a pure JS module with a small public API: `loadPuzzle(def)`, `applyMarking(state, marking)`, `propagate(state)`, `validate(state)`, `undo(state)`.

5. Decision: Persistence — plain JSON files in a `data/` directory for puzzles and state; reserve migration to SQLite later
   - Rationale: Easiest to implement cross-platform, no DB dependency, files are human-readable and easy to inspect. For MVP, persist puzzle definitions and per-puzzle state as JSON files. Document format in `README`/`quickstart.md`.
   - Alternatives: SQLite file (single-file DB) — better transactional safety and easier migration later. Will consider in future phases.

6. Decision: Testing — Jest for unit tests (logic engine) and simple integration tests
   - Rationale: Jest is widely used in the Node ecosystem and supports easy mocking and snapshot testing. Enforce TDD per the constitution: write unit tests for the logic engine first.

7. Decision: API shape — small REST API (JSON) for puzzle import, load, mark, save
   - Rationale: REST is simple and straightforward for a local backend and matches the plan to keep interfaces small and testable. We'll produce an OpenAPI minimal contract for the basic endpoints used by the SPA.

8. Decision: UX thin-slice — focus on a single flow: import sample puzzle -> open grid -> mark cell -> observe propagation (symmetry) -> save state -> reload and verify persistence.
   - Rationale: Demonstrates the core value and satisfies MVP acceptance criteria.

## Risks and Mitigations

- Risk: File-based persistence may cause race conditions if concurrent modifications occur. Mitigation: MVP is single-user local; document this limitation and add file locks or migrate to SQLite in Phase 2 if needed.
- Risk: UI complexity for large puzzles. Mitigation: enforce recommended practical limits in the UI (8x8) and document performance expectations.

## Next steps

- Implement a small backend scaffold with Express and the modular logic engine.
- Add unit tests for the engine: happy-path marking + one propagation rule and conflict detection.
- Create a minimal SPA that calls the REST endpoints and demonstrates the thin-slice flow.


*** End of research.md
