export const algorithms = {
  dijkstra: {
    name: 'Dijkstra’s algorithm',
    short: 'Dijkstra',
    tag: 'The reliable explorer',
    description:
      'Explores outward in every direction, always choosing the closest unvisited node. A methodical search that guarantees the shortest path.',
    optimal: true,
    complexity: 'O(V²)',
  },
  astar: {
    name: 'A* search',
    short: 'A*',
    tag: 'A little intuition goes a long way',
    description:
      'Combines distance traveled with an estimate of the distance ahead. The Manhattan heuristic guides the search toward the finish.',
    optimal: true,
    complexity: 'O(V²)',
  },
  bfs: {
    name: 'Breadth-first search',
    short: 'BFS',
    tag: 'One layer at a time',
    description:
      'Visits every neighbor before moving to the next layer. On this unweighted grid, its first route to the finish is a shortest path.',
    optimal: true,
    complexity: 'O(V + E)',
  },
  dfs: {
    name: 'Depth-first search',
    short: 'DFS',
    tag: 'Take the road less traveled',
    description:
      'Follows one branch as far as it can, then backtracks. It finds a route, but that route might take the scenic way around.',
    optimal: false,
    complexity: 'O(V + E)',
  },
};
