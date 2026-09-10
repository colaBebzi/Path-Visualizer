import { ref } from 'vue';
import { createMaze } from '../algorithms/maze.js';
import { GRID_ROWS, GRID_COLUMNS, DEFAULT_START, DEFAULT_FINISH } from '../constants/grid.js';
import { useSearchAnimation } from './useSearchAnimation.js';

export function usePathfinder() {
  const rows = GRID_ROWS;
  const cols = GRID_COLUMNS;
  const start = ref(DEFAULT_START);
  const finish = ref(DEFAULT_FINISH);
  const walls = ref(new Set());
  const algorithm = ref('dijkstra');
  const tool = ref('wall');
  const speed = ref(65);
  const preset = ref('division');
  const animation = useSearchAnimation({ rows, cols, walls, start, finish, algorithm, speed });
  const { locked, status, clearSearch } = animation;

  function reset() {
    clearSearch();
    walls.value = new Set();
    start.value = DEFAULT_START;
    finish.value = DEFAULT_FINISH;
  }

  function generate() {
    clearSearch();
    walls.value = createMaze(rows, cols, start.value, finish.value, preset.value);
  }

  function paint(id, selected = tool.value) {
    if (locked.value) return;
    if (status.value !== 'idle') clearSearch();
    if (selected === 'start' && id !== finish.value) {
      walls.value.delete(id);
      start.value = id;
    } else if (selected === 'finish' && id !== start.value) {
      walls.value.delete(id);
      finish.value = id;
    } else if (id !== start.value && id !== finish.value) {
      if (selected === 'wall') walls.value.add(id);
      if (selected === 'erase') walls.value.delete(id);
    }
  }

  return {
    rows,
    cols,
    start,
    finish,
    walls,
    algorithm,
    tool,
    speed,
    preset,
    ...animation,
    reset,
    generate,
    paint,
  };
}
