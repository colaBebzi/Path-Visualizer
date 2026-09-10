import test from 'node:test';
import assert from 'node:assert/strict';
import { effectScope } from 'vue';
import { usePathfinder } from '../../src/composables/usePathfinder.js';

function createStudio(context) {
  const scope = effectScope();
  const studio = scope.run(() => usePathfinder());
  context.after(() => scope.stop());
  return { studio, scope };
}

test('moving endpoints removes walls without allowing endpoints to overlap', (context) => {
  const { studio } = createStudio(context);
  studio.paint(80, 'wall');
  studio.paint(80, 'start');
  assert.equal(studio.start.value, 80);
  assert.equal(studio.walls.value.has(80), false);
  studio.paint(studio.finish.value, 'start');
  assert.equal(studio.start.value, 80);
});

test('paused searches lock editing; reset cancels animation and restores the grid', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const { studio } = createStudio(context);
  studio.paint(80, 'wall');
  studio.play();
  studio.play();
  assert.equal(studio.status.value, 'paused');
  const count = studio.visited.value.size;
  studio.paint(81, 'wall');
  assert.equal(studio.walls.value.has(81), false);
  context.mock.timers.tick(1000);
  assert.equal(studio.visited.value.size, count);
  studio.step();
  assert.equal(studio.visited.value.size, count + 1);
  studio.play();
  studio.reset();
  context.mock.timers.tick(1000);
  assert.equal(studio.status.value, 'idle');
  assert.equal(studio.visited.value.size, 0);
  assert.equal(studio.walls.value.size, 0);
});

test('disposing the Vue scope cancels pending animation callbacks', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const { studio, scope } = createStudio(context);
  studio.play();
  const count = studio.visited.value.size;
  scope.stop();
  context.mock.timers.tick(1000);
  assert.equal(studio.visited.value.size, count);
});
