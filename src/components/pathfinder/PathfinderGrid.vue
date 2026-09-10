<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Eraser, MousePointer2, ArrowRight, Flag } from '@lucide/vue';
const props = defineProps({
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  start: { type: Number, required: true },
  finish: { type: Number, required: true },
  walls: { type: Set, required: true },
  visited: { type: Set, required: true },
  path: { type: Set, required: true },
  tool: { type: String, required: true },
  locked: Boolean,
  status: { type: String, required: true },
});
const emit = defineEmits(['paint', 'clear-search']);
const board = ref(null);
const activeCell = ref(props.start);
let drawing = false;
let drawingTool;
const cells = computed(() =>
  Array.from({ length: props.rows }, (_, row) =>
    Array.from({ length: props.cols }, (_, col) => {
      const id = row * props.cols + col;
      const classes = {
        start: id === props.start,
        finish: id === props.finish,
        wall: props.walls.has(id),
        visited: props.visited.has(id),
        path: props.path.has(id),
      };
      let kind = 'open';
      if (classes.start) kind = 'start';
      else if (classes.finish) kind = 'end';
      else if (classes.wall) kind = 'wall';
      return { id, classes, label: `Row ${row + 1}, column ${col + 1}, ${kind}` };
    }),
  ),
);

function pointerDown(event, id) {
  if (props.locked || event.button !== 0) return;
  event.preventDefault();
  activeCell.value = id;
  drawing = true;
  drawingTool = id === props.start ? 'start' : id === props.finish ? 'finish' : props.tool;
  emit('paint', id, drawingTool);
}

function pointerMove(event) {
  if (!drawing) return;
  const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cell]');
  if (cell && board.value.contains(cell)) emit('paint', Number(cell.dataset.cell), drawingTool);
}

function stopDrawing() {
  drawing = false;
}

function gridKey(event, id) {
  const delta = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: props.cols,
    ArrowUp: -props.cols,
  }[event.key];
  if (delta !== undefined) {
    event.preventDefault();
    activeCell.value = Math.max(0, Math.min(props.rows * props.cols - 1, id + delta));
    board.value.querySelector(`[data-cell="${activeCell.value}"]`)?.focus();
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
    emit('paint', id);
  }
}

onMounted(() => {
  window.addEventListener('pointerup', stopDrawing);
  window.addEventListener('pointercancel', stopDrawing);
  window.addEventListener('pointermove', pointerMove);
});
onUnmounted(() => {
  window.removeEventListener('pointerup', stopDrawing);
  window.removeEventListener('pointercancel', stopDrawing);
  window.removeEventListener('pointermove', pointerMove);
});
</script>

<template>
  <div class="workspace-header">
    <div class="workspace-title">
      <span class="live-dot" :class="{ pulsing: status === 'running' }"></span>
      <h2>The playground</h2>
      <span class="grid-size">{{ cols }} × {{ rows }}</span>
    </div>
    <button class="text-button clear-button" @click="$emit('clear-search')">
      <Eraser :size="14" />
      Clear path
    </button>
  </div>
  <div class="grid-legend">
    <span>
      <i class="legend-start"></i>
      Start
    </span>
    <span>
      <i class="legend-finish"></i>
      End
    </span>
    <span>
      <i class="legend-wall"></i>
      Wall
    </span>
    <span>
      <i class="legend-visited"></i>
      Visited
    </span>
    <span>
      <i class="legend-path"></i>
      Path
    </span>
  </div>
  <div class="grid-scroll">
    <div
      ref="board"
      class="board"
      role="grid"
      aria-label="Draw walls or move start and end points using the selected tool. Use arrow keys to navigate and Enter to paint."
      :aria-busy="status === 'running'"
      :style="{ '--cols': cols }"
    >
      <div v-for="(row, rowIndex) in cells" :key="rowIndex" role="row" class="board-row">
        <button
          v-for="cell in row"
          :key="cell.id"
          :data-cell="cell.id"
          role="gridcell"
          :tabindex="activeCell === cell.id ? 0 : -1"
          :aria-label="cell.label"
          :class="['cell', cell.classes]"
          @pointerdown="pointerDown($event, cell.id)"
          @keydown="gridKey($event, cell.id)"
        >
          <ArrowRight v-if="cell.classes.start" :size="17" />
          <Flag v-if="cell.classes.finish" :size="14" fill="currentColor" />
        </button>
      </div>
    </div>
  </div>
  <div class="board-caption">
    <span>
      <MousePointer2 :size="13" />
      {{
        locked
          ? 'Watch the search unfold, or pause to step through.'
          : 'Your canvas, your rules. Draw something interesting.'
      }}
    </span>
    <span>4 directions · endless possibilities</span>
  </div>
</template>

<style scoped>
.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 12px;
}
.workspace-title {
  display: flex;
  align-items: center;
  gap: 9px;
}
.workspace-title h2 {
  font-size: 12px;
  font-weight: 600;
  margin: 0;
}
.live-dot {
  width: 6px;
  height: 6px;
  background: #8ea47b;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #8ea47b13;
}
.grid-size {
  color: #99998d;
  background: #f0f0e9;
  font-size: 9px;
  border-radius: 4px;
  padding: 4px 7px;
  margin-left: 3px;
  font-family: monospace;
}
.clear-button {
  font-size: 10px;
  color: #929084;
}
.grid-legend {
  display: flex;
  gap: 19px;
  margin: 6px 22px 17px;
}
.grid-legend > span {
  display: flex;
  gap: 6px;
  align-items: center;
  color: #939084;
  font-size: 9px;
}
.grid-legend i {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  display: block;
}
.legend-start {
  background: #8baf92;
}
.legend-finish {
  background: #da947b;
}
.legend-wall {
  background: #666d69;
}
.legend-visited {
  background: #c9b6e9;
}
.legend-path {
  background: #e9c96f;
}
.grid-scroll {
  padding: 0 22px;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: auto;
}
.board {
  width: 100%;
  border-left: 1px solid #e8e7df;
  border-top: 1px solid #e8e7df;
  touch-action: none;
  user-select: none;
  min-width: 520px;
}
.board-row {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
}
.cell {
  aspect-ratio: 1;
  min-width: 0;
  min-height: 0;
  padding: 0;
  border-right: 1px solid #e8e7df;
  border-bottom: 1px solid #e8e7df;
  background: #fafbf7;
  position: relative;
  border-radius: 0;
}
.cell:hover {
  background: #e4deef;
}
.cell.wall {
  background: #656e69;
  border-color: #5f6863;
  animation: pop 0.15s ease;
}
.cell.visited {
  background: #d7c9ec;
  border-color: #cbbbdf;
  animation: reveal 0.25s ease;
}
.cell.path {
  background: #f0d486;
  border-color: #dfc271;
  animation: pop 0.2s ease;
}
.cell.start,
.cell.finish {
  color: white;
  z-index: 1;
  box-shadow: 0 1px 5px #40573d20;
  border-radius: 4px;
  transform: scale(1.13);
}
.cell.start {
  background: #83a68a;
  border-color: #83a68a;
}
.cell.finish {
  background: #d58e79;
  border-color: #d58e79;
}
.cell svg {
  /* Markers must not increase the grid row's intrinsic height. */
  position: absolute;
  inset: 0;
  margin: auto;
  width: 80%;
  height: 80%;
  pointer-events: none;
  max-width: 17px;
  max-height: 17px;
}
.board-caption {
  display: flex;
  justify-content: space-between;
  margin: 13px 22px 21px;
  font-size: 9px;
  color: #a09d91;
  gap: 8px;
}
.board-caption > span:first-child {
  display: flex;
  align-items: center;
  gap: 6px;
}
.board-caption > span:last-child {
  font-size: 8px;
}
@media (min-width: 1500px) {
  .workspace-header {
    padding-top: 24px;
  }
}
@media (max-width: 1100px) {
  .grid-scroll {
    padding: 0 15px;
  }
  .workspace-header {
    padding-left: 15px;
    padding-right: 15px;
  }
  .grid-legend {
    margin-left: 15px;
  }
  .board-caption {
    margin-left: 15px;
    margin-right: 15px;
  }
  .board-caption > span:last-child {
    display: none;
  }
}
@media (max-width: 780px) {
  .workspace-header {
    padding-top: 19px;
  }
  .grid-scroll {
    padding: 0 15px;
  }
  .board {
    min-width: 540px;
  }
  .board-caption {
    margin-bottom: 17px;
  }
  .grid-scroll {
    padding-bottom: 5px;
  }
}
@media (max-width: 420px) {
  .grid-legend {
    gap: 15px;
  }
  .grid-size {
    display: none;
  }
}
</style>
