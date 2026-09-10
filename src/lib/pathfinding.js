export const algorithms = {
  dijkstra: {
    name: "Dijkstra’s algorithm",
    short: "Dijkstra",
    tag: "The reliable explorer",
    description:
      "Explores outward in every direction, always choosing the closest unvisited node. A methodical search that guarantees the shortest path.",
    optimal: true,
    complexity: "O(V²)",
  },
  astar: {
    name: "A* search",
    short: "A*",
    tag: "A little intuition goes a long way",
    description:
      "Combines distance traveled with an estimate of the distance ahead. The Manhattan heuristic guides the search toward the finish.",
    optimal: true,
    complexity: "O(V²)",
  },
  bfs: {
    name: "Breadth-first search",
    short: "BFS",
    tag: "One layer at a time",
    description:
      "Visits every neighbor before moving to the next layer. On this unweighted grid, its first route to the finish is a shortest path.",
    optimal: true,
    complexity: "O(V + E)",
  },
  dfs: {
    name: "Depth-first search",
    short: "DFS",
    tag: "Take the road less traveled",
    description:
      "Follows one branch as far as it can, then backtracks. It finds a route, but that route might take the scenic way around.",
    optimal: false,
    complexity: "O(V + E)",
  },
};

export function search({ rows, cols, walls, start, finish, algorithm }) {
  const visited = [],
    previous = new Map(),
    distance = new Map([[start, 0]]);
  const frontier = [start],
    seen = new Set();
  const heuristic = (id) =>
    Math.abs(Math.floor(id / cols) - Math.floor(finish / cols)) +
    Math.abs((id % cols) - (finish % cols));
  let head = 0;
  while (algorithm === "bfs" ? head < frontier.length : frontier.length) {
    let bestIndex = 0;
    if (algorithm === "dijkstra" || algorithm === "astar") {
      const score = (id) =>
        distance.get(id) + (algorithm === "astar" ? heuristic(id) : 0);
      for (let i = 1; i < frontier.length; i++) {
        if (score(frontier[i]) < score(frontier[bestIndex])) bestIndex = i;
      }
    }
    const current =
      algorithm === "dfs"
        ? frontier.pop()
        : algorithm === "bfs"
          ? frontier[head++]
          : frontier.splice(bestIndex, 1)[0];
    if (seen.has(current)) continue;
    seen.add(current);
    visited.push(current);
    if (current === finish) {
      const path = [finish];
      while (path.at(-1) !== start) path.push(previous.get(path.at(-1)));
      return { visited, path: path.reverse() };
    }
    const row = Math.floor(current / cols),
      col = current % cols;
    const neighbors = [];
    if (col < cols - 1) neighbors.push(current + 1);
    if (row < rows - 1) neighbors.push(current + cols);
    if (col > 0) neighbors.push(current - 1);
    if (row > 0) neighbors.push(current - cols);
    for (const next of neighbors) {
      if (walls.has(next) || seen.has(next)) continue;
      const cost = distance.get(current) + 1;
      if (
        !distance.has(next) ||
        (cost < distance.get(next) && !["bfs", "dfs"].includes(algorithm))
      ) {
        distance.set(next, cost);
        previous.set(next, current);
        frontier.push(next);
      }
    }
  }
  return { visited, path: [] };
}

export function createMaze(
  rows,
  cols,
  start,
  finish,
  kind = "division",
  random = Math.random,
) {
  const walls = new Set();
  if (kind === "random") {
    for (let i = 0; i < rows * cols; i++) if (random() < 0.26) walls.add(i);
  } else {
    for (let col = 5, index = 0; col < cols - 3; col += 5, index++) {
      const gap = index % 2 === 0 ? rows - 4 : 3;
      for (let row = 1; row < rows - 1; row++)
        if (Math.abs(row - gap) > 1) walls.add(row * cols + col);
    }
  }
  if (kind === "random") {
    let row = Math.floor(start / cols),
      col = start % cols;
    const endRow = Math.floor(finish / cols),
      endCol = finish % cols;
    while (col !== endCol) {
      walls.delete(row * cols + col);
      col += Math.sign(endCol - col);
    }
    while (row !== endRow) {
      walls.delete(row * cols + col);
      row += Math.sign(endRow - row);
    }
  }
  walls.delete(start);
  walls.delete(finish);
  return walls;
}
