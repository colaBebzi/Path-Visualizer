import test from "node:test";
import assert from "node:assert/strict";
import { search, createMaze } from "../src/lib/pathfinding.js";

for (const algorithm of ["dijkstra", "astar", "bfs", "dfs"]) {
  test(`${algorithm} finds a connected route around walls`, () => {
    const walls = new Set([2, 7, 12, 17]);
    const result = search({
      rows: 5,
      cols: 5,
      start: 0,
      finish: 4,
      walls,
      algorithm,
    });
    assert.equal(result.path[0], 0);
    assert.equal(result.path.at(-1), 4);
    for (let i = 1; i < result.path.length; i++) {
      const a = result.path[i - 1],
        b = result.path[i];
      assert.equal(
        Math.abs(Math.floor(a / 5) - Math.floor(b / 5)) +
          Math.abs((a % 5) - (b % 5)),
        1,
      );
      assert.ok(!walls.has(b));
    }
    if (algorithm !== "dfs") assert.equal(result.path.length - 1, 12);
  });
  test(`${algorithm} reports an unreachable finish`, () => {
    const result = search({
      rows: 3,
      cols: 3,
      start: 0,
      finish: 8,
      walls: new Set([1, 3]),
      algorithm,
    });
    assert.deepEqual(result.path, []);
    assert.deepEqual(result.visited, [0]);
  });
  test(`${algorithm} supports repeated runs and coincident endpoints`, () => {
    const options = {
      rows: 3,
      cols: 3,
      start: 0,
      finish: 8,
      walls: new Set(),
      algorithm,
    };
    assert.deepEqual(search(options), search(options));
    assert.deepEqual(search({ ...options, finish: 0 }).path, [0]);
  });
}
for (const kind of ["division", "random"]) {
  test(`${kind} maze keeps endpoints open and has a route`, () => {
    const rows = 21,
      cols = 39,
      start = 398,
      finish = 420;
    const walls = createMaze(rows, cols, start, finish, kind, () => 0.1);
    assert.ok(walls.size > 0);
    assert.ok(!walls.has(start) && !walls.has(finish));
    assert.ok(
      search({ rows, cols, start, finish, walls, algorithm: "bfs" }).path
        .length > 0,
    );
  });
}
