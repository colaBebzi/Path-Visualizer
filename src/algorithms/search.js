/** Return visited nodes and a route without mutating the input grid. */
export function search({ rows, cols, walls, start, finish, algorithm }) {
  const visited = [];
  const previous = new Map();
  const distance = new Map([[start, 0]]);
  const seen = new Set();
  const frontier = [start];
  const prioritizesDistance = algorithm === 'dijkstra' || algorithm === 'astar';
  const score = (id) =>
    distance.get(id) + (algorithm === 'astar' ? manhattanDistance(id, finish, cols) : 0);
  let queueHead = 0;

  while (algorithm === 'bfs' ? queueHead < frontier.length : frontier.length > 0) {
    let current;
    if (algorithm === 'bfs') {
      current = frontier[queueHead++];
    } else if (algorithm === 'dfs') {
      current = frontier.pop();
    } else {
      current = takeLowestScore(frontier, score);
    }

    if (seen.has(current)) {
      continue;
    }
    seen.add(current);
    visited.push(current);

    if (current === finish) {
      return { visited, path: reconstructPath(previous, start, finish) };
    }

    for (const next of getNeighbors(current, rows, cols)) {
      if (walls.has(next) || seen.has(next)) {
        continue;
      }
      const cost = distance.get(current) + 1;
      const isNewNode = !distance.has(next);
      const isShorterRoute = prioritizesDistance && cost < distance.get(next);
      if (isNewNode || isShorterRoute) {
        distance.set(next, cost);
        previous.set(next, current);
        frontier.push(next);
      }
    }
  }

  return { visited, path: [] };
}

function getNeighbors(id, rows, cols) {
  const row = Math.floor(id / cols);
  const col = id % cols;
  const neighbors = [];
  // Stable ordering keeps visualizations reproducible between runs.
  if (col < cols - 1) neighbors.push(id + 1);
  if (row < rows - 1) neighbors.push(id + cols);
  if (col > 0) neighbors.push(id - 1);
  if (row > 0) neighbors.push(id - cols);
  return neighbors;
}

function manhattanDistance(from, to, cols) {
  const vertical = Math.abs(Math.floor(from / cols) - Math.floor(to / cols));
  const horizontal = Math.abs((from % cols) - (to % cols));
  return vertical + horizontal;
}

function takeLowestScore(frontier, score) {
  let bestIndex = 0;
  for (let index = 1; index < frontier.length; index++) {
    if (score(frontier[index]) < score(frontier[bestIndex])) {
      bestIndex = index;
    }
  }
  return frontier.splice(bestIndex, 1)[0];
}

function reconstructPath(previous, start, finish) {
  const path = [finish];
  while (path.at(-1) !== start) {
    path.push(previous.get(path.at(-1)));
  }
  return path.reverse();
}
