# Pathfinder

An interactive pathfinding playground, rebuilt with Vue 3 and Vite. Draw walls, move the endpoints, and watch an algorithm find its way across the grid.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. `npm start` is also available.

## Explore

- Four algorithms: Dijkstra, A*, breadth-first search, and depth-first search.
- Draw and erase walls with mouse or touch; drag the start and finish markers.
- Generate a switchback maze or randomized terrain with a guaranteed route.
- Play, pause, resume, and step through the search; adjust speed while it runs.
- See visited nodes, route length, and algorithm computation time (excluding animation).
- Clear the search while keeping your world, or reset the entire grid.
- Responsive layout, keyboard editing, and reduced-motion support.

Use W for walls, E to erase, S to place the start, and F to place the finish. Space plays or pauses when focus is outside a control. Tab into the grid, navigate with arrow keys, and paint with Enter or Space.

All movement is orthogonal and costs one step. Dijkstra, A*, and BFS guarantee a shortest route; DFS does not. A* uses Manhattan distance. Dijkstra and A* use a linear minimum scan of the frontier (O(V^2) on this bounded-degree grid); BFS and DFS are O(V + E).

## Commands

```sh
npm test          # Algorithm and maze correctness
npm run test:e2e # Browser interaction tests
npm run build   # Production output in dist/
npm run preview # Serve the production build locally
```

Browser tests use Microsoft Edge by default. Set PLAYWRIGHT_CHANNEL=chrome for installed Chrome, or PLAYWRIGHT_CHANNEL=chromium and run `npx playwright install chromium` for Playwright's browser.

## Structure

Netlify builds use Node.js 22 and publish `dist/`, as configured in
`netlify.toml`. The `.nvmrc` file also selects Node.js 22 for local version
managers. These settings replace the legacy Create React App deployment
configuration. Push these files to the deployed branch to apply them on the
next Netlify build.

- `src/App.vue` � playground controls, grid, and animation lifecycle.
- `src/style.css` � visual system and responsive layouts.
- `src/lib/pathfinding.js` � framework-independent search and maze generation.
- `tests/` � Node tests and Playwright browser checks.

The production build is static and uses relative asset paths for subdirectory hosting. Typography loads from Google Fonts with local sans-serif fallbacks. No account, backend, or feature-flag service is required.
