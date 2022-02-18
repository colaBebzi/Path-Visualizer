// BFS(Maze maze, Node start, Node end)
export function bfs(grid, startNode, finishNode)
{
    console.log('bfsbfs', startNode, finishNode);
    const unvisitedNodes = getAllNodes(grid);
    console.log('unvisitedNodes', unvisitedNodes);
  // Put the start node in the queue
  startNode.isVisited = true;
//   var queue(startNode);

  // While there is node to be handled in the queue
//   while (!queue.empty())
//   {
//     // Handle the node in the front of the lineand get unvisited neighbors
//     var curNode = queue.pop();

//     // Terminate if the goal is reached
//     if (curNode == end)
//       break;

//     // Take neighbors, set its parent, mark as visited, and add to the queue
//     var neighbors = curNode.GetUnvisitedNeighbors();
//     for (let i = 0; i < neighbors.size(); ++i)
//     {
//       neighbors[i].visite = true;
//       neighbors[i].parent = curNode;
//       queue.push(neighbors[i]);
//     }
//   }

  // Done ! At this point we just have to walk back from the end using the parent
  // If end does not have a parent, it means that it has not been found.
} 

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    console.log('get all nodes', nodes)
    return nodes;
  }

// Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  
//   export function BreadthFirstSearch (tree, rootNode, searchValue)
//   export function breadthFirstSearch(grid, start, finish) {
export function breadthFirstSearch(grid, startNode, finishNode) {
    const unvisitedNodes = getAllNodes(grid);
    console.log('unvisitedNodes', unvisitedNodes); 
	// make a queue array
	let queue = [];
	// populate it with the node that will be the root of your search
	queue.push(startNode);

    console.log('queue:', queue);

    let currentNode = queue[0][0];
    console.log("Current node is:" + currentNode);

	console.log("Sorry, no such node found :(");	
}









let visited;
let graphAdj;
let ROW = 19;
let COL = 49;

export function initMap(grid, startNode) {
   
}

export function bs(grid, startNode) {
 
    

}