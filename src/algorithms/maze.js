/** Build walls while keeping endpoints open and a route available. */
export function createMaze(rows, cols, start, finish, kind = 'division', random = Math.random) {
  const walls = new Set();
  if (kind === 'random') {
    addRandomWalls(walls, rows, cols, random);
    carveRoute(walls, start, finish, cols);
  } else {
    addSwitchbackWalls(walls, rows, cols);
  }
  walls.delete(start);
  walls.delete(finish);
  return walls;
}

function addRandomWalls(walls, rows, cols, random) {
  const density = 0.26;
  for (let id = 0; id < rows * cols; id++) {
    if (random() < density) {
      walls.add(id);
    }
  }
}

function addSwitchbackWalls(walls, rows, cols) {
  const spacing = 5;
  let wallIndex = 0;
  for (let col = spacing; col < cols - 3; col += spacing) {
    const gapRow = wallIndex % 2 === 0 ? rows - 4 : 3;
    for (let row = 1; row < rows - 1; row++) {
      if (Math.abs(row - gapRow) > 1) {
        walls.add(row * cols + col);
      }
    }
    wallIndex++;
  }
}

function carveRoute(walls, start, finish, cols) {
  let row = Math.floor(start / cols);
  let col = start % cols;
  const endRow = Math.floor(finish / cols);
  const endCol = finish % cols;
  while (col !== endCol) {
    walls.delete(row * cols + col);
    col += Math.sign(endCol - col);
  }
  while (row !== endRow) {
    walls.delete(row * cols + col);
    row += Math.sign(endRow - row);
  }
}
