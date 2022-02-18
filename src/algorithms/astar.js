// g(x): The total cost to the node
// h(x): The estimated time to reach finish from current node (heuristic, Manhattan distance)
// f(x): g(x) + h(x). The lower the better
function initMap(grid) {
    // console.log('grid', grid);
    for(var x = 0; x < grid.length; x++) {
        for(var y = 0; y < grid[x].length; y++) {
          grid[x][y].f = 0;
          grid[x][y].g = 0;
          grid[x][y].h = 0;
          grid[x][y].debug = "";
          grid[x][y].previousNode = null;
        }  
      }
}

function isFinalNode(current, end) {

    if(current.col == end.col && current.row == end.row) return true;
    else return false;
}

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

function isEmpty(obj) {
    for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }

function Heuristic(pos0_x, pos0_y, pos1_x, pos1_y) {
    // Manhattan distance
    var d1 = Math.abs (pos1_x - pos0_x);
    var d2 = Math.abs (pos1_y - pos0_y);
    return d1 + d2;
};

function Neighbors(grid, node) {
    var ret = [];
    var y = node.col;
    var x = node.row;

    // console.log('nn-n', node);
    // console.log(x, y);
    // console.log('gg?', grid[x][y])

    if(grid[x-1] && grid[x-1][y]) {
      ret.push(grid[x-1][y]);
    }
    if(grid[x+1] && grid[x+1][y]) {
      ret.push(grid[x+1][y]);
    }
    if(grid[x][y-1] && grid[x][y-1]) {
      ret.push(grid[x][y-1]);
    }
    if(grid[x][y+1] && grid[x][y+1]) {
      ret.push(grid[x][y+1]);
    }

  //   // West
  // if(grid[x-1] && grid[x-1][y]) {
  //   ret.push(grid[x-1][y]);
  // }
  // // East
  // if(grid[x+1] && grid[x+1][y]) {
  //     ret.push(grid[x+1][y]);
  // }
  // // South
  // if(grid[x] && grid[x][y-1]) {
  //     ret.push(grid[x][y-1]);
  // }
  // // North
  // if(grid[x] && grid[x][y+1]) {
  //   ret.push(grid[x][y+1]);
  // }

    return ret;
}

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
        // console.log('child1Score', child1Score);
        // console.log('elemScore', elemScore)

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

function heap () {
  return new BinaryHeap(function(node) {
      return node.f;
  });
};

// search
export function AStar(grid, start, end) {
    initMap(grid);
    // heuristic = heuristic || manhattan
    // var openList = [];
    var closedList = [];
    // openList.push(start);

    var openHeap = heap();
    openHeap.push(start);

    // while (openList.length > 0) {
      while (openHeap.size() > 0) {
        // Grabb the lowest f(x) to process next
        // var lowInd = 0;
        // for (let i = 0; i < openList.length; i++) {
        //     if (openList[i].f < openList[lowInd].f) {
        //         lowInd = i;
        //     }
        // }

        var currentNode = openHeap.pop();
        // var currentNode = openList.pop();

        // var currentNode = openList[lowInd];
        // Done, return to traced path
        if (isFinalNode(currentNode, end)) {
            var curr = currentNode;
            var ret = [];

            while (curr.previousNode) {
                ret.push(curr);
                curr = curr.previousNode;
            }

            console.log('A* DONE', ret.reverse());
            // console.log('openList', openList);
            console.log('openHeap', openHeap.content.reverse());
            console.log('closedList', closedList);
            return [ret.reverse(), closedList];
            return [ret.reverse(), openHeap.content.reverse()];
        }

        // Continue, move currentNode from open to closed
        // process each of its neighbours
        currentNode.isVisited = true;
        closedList.push(currentNode);
        // openList = removeItemOnce([...openList], currentNode);
        // openList.pop();
        // closedList.push(currentNode);
        // currentNode = openHeap.pop();
        
        var neighbors = Neighbors(grid, currentNode);
        for (let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (neighbor.isVisited || neighbor.isWall) {
                // skip to next
                // console.log('skip thid one', neighbor)
                continue;
            }

            // g score
            var gScore = currentNode.g + 1; // distance to neighbor
            var beenVisited = neighbor.isVisited;
            var gScoreIsBest = false;

            // if(!containsObject(neighbor, openList)) {
            if(!beenVisited || gScore < neighbor.g) {
                // probably the best
                gScoreIsBest = true;
                neighbor.h = Heuristic(neighbor.col, neighbor.row, end.col, end.row);
                // openList.push(neighbor);
                // console.log('openList NEW PUSH', openList);
            }

            if (gScore < neighbor.g) { gScoreIsBest = true; }

            if (gScoreIsBest) {
                // found a so far optimal path to this node
                // store info on it
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                // console.log('neighbor wit best score', neighbor);
            }
            
            if (!beenVisited) {
              openHeap.push(neighbor);
            }
            else {
                openHeap.rescoreElement(neighbor);
            }
            
        }
    }

    return [];
}