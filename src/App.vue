<script setup>
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import {
  Route,
  ArrowUpRight,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  WandSparkles,
  MousePointer2,
  BrickWall,
  Eraser,
  MapPin,
  Flag,
  ChevronDown,
  Info,
  X,
  Check,
  Keyboard,
  Sparkles,
} from "@lucide/vue";
import { algorithms, search, createMaze } from "./lib/pathfinding";

const rows = 21,
  cols = 39;
const start = ref(10 * cols + 8),
  finish = ref(10 * cols + 30);
const walls = ref(new Set()),
  visited = ref(new Set()),
  path = ref(new Set());
const algorithm = ref("dijkstra"),
  tool = ref("wall"),
  speed = ref(65),
  preset = ref("division");
const status = ref("idle"),
  elapsed = ref(0),
  help = ref(false),
  activeCell = ref(start.value);
const info = computed(() => algorithms[algorithm.value]);
let previousFocus;
watch(help, async (open) => {
  if (open) {
    previousFocus = document.activeElement;
    await nextTick();
    document.querySelector(".close-button")?.focus();
  } else previousFocus?.focus();
});
function trapFocus(event) {
  if (event.key !== "Tab") return;
  const buttons = event.currentTarget.querySelectorAll("button");
  const first = buttons[0],
    last = buttons[buttons.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
const locked = computed(() => ["running", "paused"].includes(status.value));
const statusText = computed(
  () =>
    ({
      idle: "Ready to explore",
      running: "Finding a way…",
      paused: "Exploration paused",
      done: "Path found",
      unreachable: "No path found",
    })[status.value],
);
const tools = [
  { id: "wall", label: "Draw walls", icon: BrickWall, key: "W" },
  { id: "erase", label: "Erase", icon: Eraser, key: "E" },
  { id: "start", label: "Start point", icon: MapPin, key: "S" },
  { id: "finish", label: "End point", icon: Flag, key: "F" },
];
let timer,
  result,
  cursor = 0,
  drawing = false,
  drawingTool;
const totalSteps = ref(0);
const progress = computed(() =>
  totalSteps.value
    ? Math.round(
        ((visited.value.size + path.value.size) / totalSteps.value) * 100,
      )
    : 0,
);

function clearSearch() {
  clearTimeout(timer);
  result = null;
  cursor = 0;
  totalSteps.value = 0;
  visited.value = new Set();
  path.value = new Set();
  status.value = "idle";
  elapsed.value = 0;
}
function reset() {
  clearSearch();
  walls.value = new Set();
  start.value = 10 * cols + 8;
  finish.value = 10 * cols + 30;
}
function generate() {
  clearSearch();
  walls.value = createMaze(rows, cols, start.value, finish.value, preset.value);
}
function prepare() {
  clearSearch();
  const began = performance.now();
  result = search({
    rows,
    cols,
    walls: walls.value,
    start: start.value,
    finish: finish.value,
    algorithm: algorithm.value,
  });
  totalSteps.value = result.visited.length + result.path.length;
  elapsed.value = Math.max(0.1, performance.now() - began);
}
function advance() {
  if (cursor < result.visited.length) visited.value.add(result.visited[cursor]);
  else if (cursor < result.visited.length + result.path.length)
    path.value.add(result.path[cursor - result.visited.length]);
  cursor++;
  if (cursor >= result.visited.length + result.path.length)
    status.value = result.path.length ? "done" : "unreachable";
}
function tick() {
  if (status.value !== "running") return;
  const batch =
    cursor < result.visited.length
      ? Math.max(1, Math.floor(speed.value / 12))
      : 1;
  for (let i = 0; i < batch && status.value === "running"; i++) advance();
  if (status.value === "running") timer = setTimeout(tick, 105 - speed.value);
}
function play() {
  if (status.value === "running") {
    clearTimeout(timer);
    status.value = "paused";
    return;
  }
  if (status.value !== "paused") prepare();
  status.value = "running";
  tick();
}
function step() {
  clearTimeout(timer);
  if (!locked.value) prepare();
  status.value = "paused";
  advance();
}
function paint(id, selected = tool.value) {
  if (locked.value) return;
  if (status.value !== "idle") clearSearch();
  if (selected === "start" && id !== finish.value) {
    walls.value.delete(id);
    start.value = id;
  } else if (selected === "finish" && id !== start.value) {
    walls.value.delete(id);
    finish.value = id;
  } else if (id !== start.value && id !== finish.value) {
    if (selected === "wall") walls.value.add(id);
    if (selected === "erase") walls.value.delete(id);
  }
}
function pointerDown(event, id) {
  if (locked.value || event.button !== 0) return;
  event.preventDefault();
  activeCell.value = id;
  drawing = true;
  drawingTool =
    id === start.value ? "start" : id === finish.value ? "finish" : tool.value;
  paint(id, drawingTool);
}
function pointerMove(event) {
  if (!drawing) return;
  const cell = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest("[data-cell]");
  if (cell) paint(Number(cell.dataset.cell), drawingTool);
}
function stopDrawing() {
  drawing = false;
}
function gridKey(event, id) {
  const delta = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: cols,
    ArrowUp: -cols,
  }[event.key];
  if (delta !== undefined) {
    event.preventDefault();
    activeCell.value = Math.max(0, Math.min(rows * cols - 1, id + delta));
    document.querySelector(`[data-cell="${activeCell.value}"]`)?.focus();
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
    paint(id);
  }
}
function shortcuts(event) {
  if (event.key === "Escape") help.value = false;
  if (
    help.value ||
    /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target.tagName) ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  )
    return;
  if (event.code === "Space") {
    event.preventDefault();
    play();
  }
  const selected = tools.find(
    (item) => item.key.toLowerCase() === event.key.toLowerCase(),
  );
  if (selected) tool.value = selected.id;
}
onMounted(() => {
  window.addEventListener("pointerup", stopDrawing);
  window.addEventListener("pointercancel", stopDrawing);
  window.addEventListener("pointermove", pointerMove);
  window.addEventListener("keydown", shortcuts);
});
onUnmounted(() => {
  clearTimeout(timer);
  window.removeEventListener("pointerup", stopDrawing);
  window.removeEventListener("pointercancel", stopDrawing);
  window.removeEventListener("pointermove", pointerMove);
  window.removeEventListener("keydown", shortcuts);
});
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <a class="brand" href="./" aria-label="Pathfinder home"
        ><span class="brand-mark"><Route :size="23" /></span>pathfinder<span
          class="brand-dot"
          >.</span
        ></a
      >
      <div class="header-middle">
        <span class="tiny-dot"></span> AN INTERACTIVE ALGORITHM PLAYGROUND
      </div>
      <button class="text-button" @click="help = true">
        How it works <ArrowUpRight :size="16" />
      </button>
    </header>

    <main>
      <section class="intro">
        <div>
          <div class="eyebrow"><span></span> THE BEAUTY IS IN THE JOURNEY</div>
          <h1>
            Every path starts<br class="mobile-break" />
            with <span>curiosity.</span>
          </h1>
          <p>
            Build a world. Pick an algorithm. Watch a little logic find its way.
          </p>
        </div>
        <div class="intro-note">
          <Sparkles :size="20" /><span
            >A little space for<br />big discoveries.</span
          ><svg viewBox="0 0 65 40" aria-hidden="true">
            <path d="M5 5Q50 0 44 31m-9-9 9 10 11-10" />
          </svg>
        </div>
      </section>

      <div class="studio">
        <aside class="controls">
          <div class="panel-title">
            <span>Make it your own</span
            ><span class="small-index">01 — 03</span>
          </div>
          <section class="control-section">
            <label class="section-label" for="algorithm"
              ><span class="step-number">01</span> Choose an algorithm</label
            >
            <div class="select-wrap">
              <select
                id="algorithm"
                v-model="algorithm"
                :disabled="locked"
                @change="clearSearch"
              >
                <option
                  v-for="(item, key) in algorithms"
                  :key="key"
                  :value="key"
                >
                  {{ item.name }}
                </option></select
              ><ChevronDown :size="15" />
            </div>
            <p class="control-hint">{{ info.tag }}</p>
            <div class="algorithm-tags">
              <span :class="{ amber: !info.optimal }"
                ><Check v-if="info.optimal" :size="12" /><Info
                  v-else
                  :size="12"
                />{{
                  info.optimal ? "Shortest path" : "Not always shortest"
                }}</span
              ><span>Unweighted grid</span>
            </div>
          </section>
          <section class="control-section">
            <div class="section-label">
              <span class="step-number">02</span> Shape your playground
            </div>
            <div class="drawing-tools">
              <button
                v-for="item in tools"
                :key="item.id"
                :class="['tool-button', { selected: tool === item.id }]"
                :disabled="locked"
                :aria-pressed="tool === item.id"
                @click="tool = item.id"
              >
                <component :is="item.icon" :size="17" /><span>{{
                  item.label
                }}</span
                ><kbd>{{ item.key }}</kbd>
              </button>
            </div>
            <div class="maze-control">
              <label class="sr-only" for="maze">Maze style</label
              ><select id="maze" v-model="preset" :disabled="locked">
                <option value="division">Switchback maze</option>
                <option value="random">Random terrain</option></select
              ><button
                :disabled="locked"
                title="Generate maze"
                aria-label="Generate maze"
                @click="generate"
              >
                <WandSparkles :size="17" />
              </button>
            </div>
          </section>
          <section class="control-section speed-section">
            <label class="section-label" for="speed"
              ><span class="step-number">03</span> Set the pace
              <span class="speed-value">{{
                speed < 35 ? "Slow" : speed < 75 ? "Medium" : "Fast"
              }}</span></label
            >
            <input
              id="speed"
              v-model.number="speed"
              type="range"
              min="1"
              max="100"
              :style="{ '--range-progress': `${speed}%` }"
            />
            <div class="range-labels">
              <span>Take it in</span><span>Let it fly</span>
            </div>
          </section>
          <div class="play-controls">
            <button class="primary-button" @click="play">
              <Pause
                v-if="status === 'running'"
                :size="16"
                fill="currentColor"
              /><Play v-else :size="16" fill="currentColor" />{{
                status === "running"
                  ? "Pause exploration"
                  : status === "paused"
                    ? "Resume exploration"
                    : "Visualize path"
              }}<kbd>␣</kbd>
            </button>
            <div class="secondary-controls">
              <button @click="step"><SkipForward :size="14" /> Step</button
              ><button @click="reset">
                <RotateCcw :size="14" /> Reset grid
              </button>
            </div>
          </div>
          <div class="sidebar-note">
            <MousePointer2 :size="17" />
            <p>
              Click & drag to draw walls.<br />Move the markers to explore more.
            </p>
          </div>
        </aside>

        <section class="workspace" aria-label="Pathfinding playground">
          <div class="workspace-header">
            <div class="workspace-title">
              <span
                class="live-dot"
                :class="{ pulsing: status === 'running' }"
              ></span>
              <h2>The playground</h2>
              <span class="grid-size">{{ cols }} × {{ rows }}</span>
            </div>
            <button class="text-button clear-button" @click="clearSearch">
              <Eraser :size="14" /> Clear path
            </button>
          </div>
          <div class="grid-legend">
            <span><i class="legend-start"></i>Start</span
            ><span><i class="legend-finish"></i>End</span
            ><span><i class="legend-wall"></i>Wall</span
            ><span><i class="legend-visited"></i>Visited</span
            ><span><i class="legend-path"></i>Path</span>
          </div>
          <div class="grid-scroll">
            <div
              class="board"
              role="grid"
              aria-label="Draw walls or move start and end points using the selected tool. Use arrow keys to navigate and Enter to paint."
              :aria-busy="status === 'running'"
              :style="{ '--cols': cols }"
            >
              <div v-for="row in rows" :key="row" role="row" class="board-row">
                <button
                  v-for="col in cols"
                  :key="col"
                  :data-cell="(row - 1) * cols + col - 1"
                  role="gridcell"
                  :tabindex="activeCell === (row - 1) * cols + col - 1 ? 0 : -1"
                  :aria-label="`Row ${row}, column ${col}${start === (row - 1) * cols + col - 1 ? ', start' : finish === (row - 1) * cols + col - 1 ? ', end' : walls.has((row - 1) * cols + col - 1) ? ', wall' : ', open'}`"
                  :class="[
                    'cell',
                    {
                      wall: walls.has((row - 1) * cols + col - 1),
                      visited: visited.has((row - 1) * cols + col - 1),
                      path: path.has((row - 1) * cols + col - 1),
                      start: start === (row - 1) * cols + col - 1,
                      finish: finish === (row - 1) * cols + col - 1,
                    },
                  ]"
                  @pointerdown="pointerDown($event, (row - 1) * cols + col - 1)"
                  @keydown="gridKey($event, (row - 1) * cols + col - 1)"
                >
                  <ArrowRight
                    v-if="start === (row - 1) * cols + col - 1"
                    :size="17"
                  /><Flag
                    v-if="finish === (row - 1) * cols + col - 1"
                    :size="14"
                    fill="currentColor"
                  />
                </button>
              </div>
            </div>
          </div>
          <div class="board-caption">
            <span
              ><MousePointer2 :size="13" />
              {{
                locked
                  ? "Watch the search unfold, or pause to step through."
                  : "Your canvas, your rules. Draw something interesting."
              }}</span
            ><span>4 directions · endless possibilities</span>
          </div>
          <div class="results" aria-live="polite">
            <div class="result-status">
              <span :class="['status-icon', { complete: status === 'done' }]"
                ><Check v-if="status === 'done'" :size="17" /><Route
                  v-else
                  :size="17"
              /></span>
              <div>
                <strong>{{ statusText }}</strong
                ><span>{{
                  status === "unreachable"
                    ? "Try removing a few walls."
                    : status === "done"
                      ? "A small journey, beautifully solved."
                      : "Let’s connect the dots."
                }}</span>
              </div>
            </div>
            <div class="stat">
              <span>Nodes visited</span
              ><strong
                >{{ visited.size
                }}<small>/ {{ rows * cols - walls.size }}</small></strong
              >
            </div>
            <div class="stat">
              <span>Path length</span
              ><strong
                >{{ status === "done" ? Math.max(0, path.size - 1) : "—"
                }}<small>steps</small></strong
              >
            </div>
            <div class="stat">
              <span>Compute time</span
              ><strong
                >{{ elapsed ? elapsed.toFixed(1) : "—"
                }}<small>ms</small></strong
              >
            </div>
          </div>
          <div class="progress-track">
            <div :style="{ width: `${progress}%` }"></div>
          </div>
        </section>
      </div>

      <section class="learning-strip">
        <div class="learning-heading">
          <span class="book-icon"><Info :size="20" /></span>
          <div>
            <span class="eyebrow">BEHIND THE ALGORITHM</span>
            <h3>{{ info.name }}</h3>
          </div>
        </div>
        <p>{{ info.description }}</p>
        <div class="complexity">
          <span>TIME COMPLEXITY</span><strong>{{ info.complexity }}</strong>
        </div>
        <button
          class="learn-button"
          @click="help = true"
          aria-label="Learn about pathfinding"
        >
          <ArrowUpRight :size="20" />
        </button>
      </section>
      <footer>
        <span>Made for the joy of figuring things out.</span
        ><span
          ><span class="tiny-dot"></span> A playground for curious minds
          <span class="footer-star">✳</span></span
        >
      </footer>
    </main>

    <div
      v-if="help"
      class="modal-backdrop"
      @click.self="help = false"
      @keydown.esc="help = false"
    >
      <section
        class="help-dialog"
        @keydown="trapFocus"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
      >
        <button
          class="close-button"
          aria-label="Close guide"
          autofocus
          @click="help = false"
        >
          <X :size="20" /></button
        ><span class="eyebrow">A QUICK FIELD GUIDE</span>
        <h2 id="help-title">Follow your curiosity.</h2>
        <p>
          Every square is a node. Every move costs one step. The challenge?
          Connect the green start to the coral finish.
        </p>
        <ol>
          <li>
            <strong>Build a little world.</strong> Draw walls, choose a maze, or
            drag the start and end markers. Walls are off limits to the search.
          </li>
          <li>
            <strong>Pick a perspective.</strong> Dijkstra and BFS explore
            outward. A* heads toward the goal. DFS dives into one branch at a
            time.
          </li>
          <li>
            <strong>Watch it unfold.</strong> Violet squares show explored
            nodes. The golden trail is the final route. Pause or step to look
            closer.
          </li>
        </ol>
        <div class="help-tip">
          <Keyboard :size="18" /><span
            ><kbd>Space</kbd> play / pause · <kbd>W</kbd> walls ·
            <kbd>E</kbd> erase<br /><kbd>S</kbd> start · <kbd>F</kbd> finish ·
            Arrow keys + Enter to edit the grid</span
          >
        </div>
        <button class="primary-button" @click="help = false">
          Let’s find a path <ArrowRight :size="17" />
        </button>
      </section>
    </div>
  </div>
</template>
