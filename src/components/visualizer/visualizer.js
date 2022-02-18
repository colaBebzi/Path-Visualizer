import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../../algorithms/dijkstra';
import {bfs, bs, initMap, breadthFirstSearch} from '../../algorithms/bfs';
import { AStar } from '../../algorithms/astar';
// import { astar } from '../../algorithms/astar2';

import './visualizer.css';

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;

var handler = 0;

export default class Visualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  setHandler(h) {
    handler = h;
    console.log(handler);
  }

  update() {
    START_NODE_ROW = 10;
    START_NODE_COL = 15;
    FINISH_NODE_ROW = 10;
    FINISH_NODE_COL = 35;
    this.componentDidMount();
    console.log('update');
  }

  addSelected() {
    // byt klass till på btn till selected
    this.setState({selectedClass: true})
    
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  // updateGrid(g) {
  //   const grid = getUpdatedGrid(g);
  //   this.setState({grid});
  // }

  handleMouseDown(row, col) {
    var newGrid = null;
    
    if (handler === 0) {
      newGrid = setNewStartNode(this.state.grid, row, col);
      this.componentDidMount();
      // this.updateGrid(newGrid);
    }
    if (handler === 1) {
      newGrid = setNewFinishNode(this.state.grid, row, col);
      // this.updateGrid(newGrid);
      this.componentDidMount();
    }
    if (handler === 2) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }

  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    var newGrid = null;
    if (handler === 0) {
      newGrid = setNewStartNode(this.state.grid, row, col);
      // this.updateGrid(newGrid);
      this.componentDidMount();
    }
    if (handler === 1) {
      newGrid = setNewFinishNode(this.state.grid, row, col);
      // this.updateGrid(newGrid);
      this.componentDidMount();
    }
    if (handler === 2) {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
    
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  resetAnimation() {
    const {grid} = this.state;
    
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        setTimeout(() => {
          document.getElementById(`node-${grid[i][j].row}-${grid[i][j].col}`).className =
            'node';
        }, i * j);

      }
    }

    this.componentDidMount();
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    console.log(visitedNodesInOrder)
    console.log(nodesInShortestPathOrder)

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateAstar(visitedNodesInReverse, nodesInShortestPathOrder) {
    console.log('visitedNodesInReverse', visitedNodesInReverse)

    // for (let i = 0; i < openList.length; i++) {
    //   setTimeout(() => {
    //     const node = openList[i];
    //     document.getElementById(`node-${node.row}-${node.col}`).className =
    //       'node node-visited';
    //   }, 10 * i);
    // }

    for (let i = 0; i <= visitedNodesInReverse.length; i++) {
      if (i === visitedNodesInReverse.length) {
        console.log('yo');
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 40 * i);
        return;
      }

      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 40 * i);
    }
  }

  async animateVisitedAstar(list) {
    var inx = 0;
    for (let i = 0; i < list.length; i++) {
      setTimeout(() => {
        const node = list[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-visited';
      }, 10 * i);
      inx = i;

      if (inx === list.length - 1) {
        console.log('ani visited');
        return true;
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAstar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // const a = astar(grid, startNode, finishNode);
    // console.log('a2',  a);
    // this.animateVisitedAstar(astar[1])
    const astar = AStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedAstar(astar[1])
      .then(() => this.animateAstar(astar[0], nodesInShortestPathOrder))
  //     this.animateAstar(astar[0], nodesInShortestPathOrder)
  }

  visualizeBfs() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    initMap(grid, startNode);
    // const visitedNodesInOrder = bs(grid, startNode);
    const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
    // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    // this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="btns">
          <button className="btn-primary" onClick={() => this.visualizeDijkstra()} onChange={() => this.addSelected()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button className="btn-primary" onClick={() => this.visualizeAstar()} onChange={() => this.addSelected()}>
            A*
          </button>
          <button className="btn-primary" onClick={() => this.visualizeBfs()} onChange={() => this.addSelected()}>
            BFS
          </button>
          <button className="btn-primary" onClick={() => this.setHandler(0)}>
            Set Start Node
          </button>
          <button className="btn-primary" onClick={() => this.setHandler(1)}>
            Set Finish Node
          </button>
          <button className="btn-primary" onClick={() => this.setHandler(2)}>
            Set Walls
          </button>
          <button className="btn-primary" onClick={() => this.resetAnimation()}>
            Update
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// const getUpdatedGrid = (gr) => {
//   const grid = [];
//   for (let row = 0; row < 20; row++) {
//     const currentRow = [];
//     for (let col = 0; col < 50; col++) {
//       currentRow.push(createNode(col, row));
//     }
//     grid.push(currentRow);
//   }
//   return grid;
// };

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const setNewStartNode = (grid, row, col) => {
  START_NODE_ROW = row;
  START_NODE_COL = col;
  console.log('s_row',START_NODE_ROW, 's_col', START_NODE_COL);

  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
  };
  // console.log('new grid', newGrid)
  newGrid[row][col] = newNode;
  return newGrid;
}

const setNewFinishNode = (grid, row, col) => {
  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;
  console.log('f_row',FINISH_NODE_ROW, 'f_col', FINISH_NODE_COL);

  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
  };
  newGrid[row][col] = newNode;
  // console.log('new grid', newGrid)
  return newGrid;
}

const getNewGridWithWallToggled = (grid, row, col) => {
  
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};


function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // console.log('CONTENT push', { ...this.content });
    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }

    // console.log('CONTENT pop', { ...this.content });
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      } else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1;
      var parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length;
    var element = this.content[n];
    var elemScore = this.scoreFunction(element);
    // console.log('BUBBLE UP', element);

    while (true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1;
      var child1N = child2N - 1;
      // This is used to store the new position of the element, if any.
      var swap = null;
      var child1Score;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);
        console.log('child1Score', child1Score);
        console.log('elemScore', elemScore)

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N];
        var child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  // console.log('arr', ...arr, 'index', index);
  if (index > -1) {
    arr.splice(index, 1);
  }
  // console.log('arr after', ...arr);
  return arr;
}

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
          return true;
      }
  }

  return false;
}

function isFinalNode(current, end) {

  if(current.col == end.col && current.row == end.row) return true;
  else return false;
}

export function astar(grid, start, end) {
  
  // var gg = new BinaryHeap;

  // gg.prototype.pop()

  // console.log('BinaryHeap', BinaryHeap);
  // return search(grid, start, end);

  function init(grid) {
    console.log('INIT GRID', grid);
      for(var x = 0, xl = grid.length; x < xl; x++) {
          for(var y = 0, yl = grid[x].length; y < yl; y++) {
              var node = grid[x][y];
              grid[x][y].f = 0;
              grid[x][y].g = 0;
              grid[x][y].h = 0;
              grid[x][y].cost = 1;
              grid[x][y].isVisited = false;
              // node.closed = false;
              grid[x][y].previousNode = null;
          }
      }
  }
  function heap () {
      return new BinaryHeap(function(node) {
          return node.f;
      });
  };

  // function search (grid, start, end) {
      init(grid);
      // var heuristic = manhattan(start, end);
      // diagonal = !!diagonal;

      console.log('END', end);

      var openHeap = heap();
      // var openHeap = [];
      var closedList = [];
      
      openHeap.push(start);
      console.log('openHeap', openHeap)
      // console.log('openHeap...', { ...openHeap })

      while(openHeap.size() > 0) {
        // while(openHeap.length > 0) {

          // var lowInd = 0;
          // for (let i = 0; i < openHeap.length; i++) {
          //     if (openHeap[i].f < openHeap[lowInd].f) {
          //         lowInd = i;
          //     }
          // }
          // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
          // var currentNode = openHeap[lowInd];
          
          var currentNode = openHeap.content[0];
          // console.log('CURRENT NODE', currentNode);
          // End case -- result has been found, return the traced path.

          if(isFinalNode(currentNode, end)) {
              var curr = currentNode;
              var ret = [];
              
              while(curr.previousNode) {
                  ret.push(curr);
                  curr = curr.previousNode;
              }
              console.log('RETURN', ret.reverse());
              return [ openHeap, ret.reverse()];
          }

          // Normal case -- move currentNode from open to closed, process each of its neighbors.
          // openHeap = removeItemOnce([...openHeap], currentNode);
          closedList.push(currentNode);
          currentNode.isVisited = true;
          currentNode = openHeap.pop();
          // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
          var neighbors = Neighbors(grid, currentNode);
          // console.log('neighbors', neighbors)
          for(let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            
            if(neighbor.isVisited || neighbor.isWall) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }
            
            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            var gScore = currentNode.g + neighbor.cost;
            var beenVisited = neighbor.isVisited;
            var gNeighbor = neighbor.g;
            
            // if (beenVisited) {
            //   console.log('neighbor beenVisited!!', neighbor)
            //    continue; 
            // }
            if(!beenVisited || gScore < neighbor.g) {
              // console.log('VISITED')
              // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
              neighbor.isVisited = true;
              neighbor.previousNode = currentNode;
              neighbor.h = neighbor.h || manhattan(neighbor, end);
              neighbor.g = gScore;
              // console.log(`${gScore} < ${neighbor.g}`);
              neighbor.f = neighbor.g + neighbor.h;

              if (!beenVisited) {
                  // Pushing to heap will put it in proper place based on the 'f' value.
                  openHeap.push(neighbor);
                  console.log('openHeap...', { ...openHeap })
                  // console.log('push to heap', openHeap)
              }
              else {
                  // Already seen the node, but since it has been rescored we need to reorder it in the heap
                  openHeap.rescoreElement(neighbor);
              }
            } 
        }
    }
      // No result was found - empty array signifies failure to find path.
    return [];

  // };

  function manhattan(start, end) {
      // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
      
      var d1 = Math.abs (end.col - start.col);
      var d2 = Math.abs (end.row - end.col);
      // console.log('d1 + d2', d1 + d2);
      return d1 + d2;
  };

  function Neighbors(grid, node) {
      var ret = [];
      var x = node.col;
      var y = node.row;

      // West
      if(grid[x-1] && grid[x-1][y]) {
          ret.push(grid[x-1][y]);
      }
      // East
      if(grid[x+1] && grid[x+1][y]) {
          ret.push(grid[x+1][y]);
      }
      // South
      if(grid[x] && grid[x][y-1]) {
          ret.push(grid[x][y-1]);
      }
      // North
      if(grid[x] && grid[x][y+1]) {
        ret.push(grid[x][y+1]);
      }

      return ret;
  };

  
};