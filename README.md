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

## Project structure

```text
src/
  algorithms/             Pure search and maze-generation functions
  assets/styles/          Shared base styles, tokens, and page layout
  components/
    help/                 Guide dialog and focus handling
    layout/               Header, introduction, and footer
    pathfinder/           Controls, grid, results, and algorithm details
  composables/            Grid state, search animation, and shortcuts
  constants/              Grid defaults, algorithm descriptions, and tools
  views/                  Page composition and component event wiring
  App.vue                 Application entry component
  main.js                 Vue bootstrap and global styles
tests/
  unit/                   Algorithms and composable lifecycle tests
  browser/                Playwright interaction and layout regressions
```

### Working on the app

Start in `src/views/PathfinderView.vue` to see how the page fits together.
It owns the guide's visibility and connects the controls, grid, results, and
algorithm details through explicit props, named models, and events.

- `usePathfinder` owns editable grid state and enforces endpoint and editing rules.
- `useSearchAnimation` owns search results, playback, timing, and cancellation.
  Its timer is disposed with the Vue scope.
- `useKeyboardShortcuts` installs and removes application shortcuts.
- `PathfinderGrid.vue` owns pointer interaction and keyboard focus. It emits
  paint requests rather than mutating props, and derives each cell's label and
  classes in one place.
- Search and maze functions have no Vue or DOM dependency. Algorithm display
  metadata lives separately in `constants/algorithms.js`.

Components use Composition API with `<script setup>`, PascalCase filenames,
and scoped styles colocated with their templates. Only shared styles and page
layout are global. Local state is enough for this single-page application;
there is no router or global store to maintain.

### Formatting and linting

```sh
npm run format        # Format source, tests, and configuration
npm run format:check  # Check formatting without changing files
npm run lint          # ESLint and Vue recommended rules
npm run lint:fix      # Apply safe automatic lint fixes
```

Prettier uses two spaces, single quotes, semicolons, and a 100-character line
width. EditorConfig declares matching indentation and UTF-8/LF files.
Generated output, dependencies, reports, and IDE files are excluded.

## Deployment

Netlify builds use Node.js 22 and publish `dist/`, as configured in
`netlify.toml`. The `.nvmrc` file also selects Node.js 22 for local version
managers. Push these files to the deployed branch to apply them on the next
Netlify build.

The production build is static and uses relative asset paths for subdirectory
hosting. Typography loads from Google Fonts with local sans-serif fallbacks.
No account, backend, or feature-flag service is required.
