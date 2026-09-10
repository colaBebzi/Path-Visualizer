import { ref, computed, onScopeDispose } from 'vue';
import { search } from '../algorithms/search.js';

export function useSearchAnimation({ rows, cols, walls, start, finish, algorithm, speed }) {
  const visited = ref(new Set());
  const path = ref(new Set());
  const status = ref('idle');
  const elapsed = ref(0);
  const locked = computed(() => ['running', 'paused'].includes(status.value));
  let timer;
  let result;
  let cursor = 0;
  const totalSteps = ref(0);
  const progress = computed(() =>
    totalSteps.value
      ? Math.round(((visited.value.size + path.value.size) / totalSteps.value) * 100)
      : 0,
  );

  function clearSearch() {
    clearTimeout(timer);
    result = null;
    cursor = 0;
    totalSteps.value = 0;
    visited.value = new Set();
    path.value = new Set();
    status.value = 'idle';
    elapsed.value = 0;
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
      status.value = result.path.length ? 'done' : 'unreachable';
  }

  function tick() {
    if (status.value !== 'running') return;
    const batch = cursor < result.visited.length ? Math.max(1, Math.floor(speed.value / 12)) : 1;
    for (let i = 0; i < batch && status.value === 'running'; i++) advance();
    if (status.value === 'running') timer = setTimeout(tick, 105 - speed.value);
  }

  function play() {
    if (status.value === 'running') {
      clearTimeout(timer);
      status.value = 'paused';
      return;
    }
    if (status.value !== 'paused') prepare();
    status.value = 'running';
    tick();
  }

  function step() {
    clearTimeout(timer);
    if (!locked.value) prepare();
    status.value = 'paused';
    advance();
  }

  onScopeDispose(() => clearTimeout(timer));
  return { visited, path, status, elapsed, locked, progress, clearSearch, play, step };
}
