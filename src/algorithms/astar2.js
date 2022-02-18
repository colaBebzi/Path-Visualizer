
function BinaryHeap(scoreFunction) {
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    console.log('CONTENT push', this.content);
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

    console.log('CONTENT pop', this.content);
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

function isFinalNode(current, end) {

  if(current.col == end.col && current.row == end.row) return true;
  else return false;
}

export function astar(grid, start, end) {
  return search(grid, start, end);

  function init(grid) {
    console.log('INIT GRID');
      for(var x = 0, xl = grid.length; x < xl; x++) {
          for(var y = 0, yl = grid[x].length; y < yl; y++) {
              var node = grid[x][y];
              node.f = 0;
              node.g = 0;
              node.h = 0;
              node.cost = 1;
              node.isVisited = false;
              // node.closed = false;
              node.previousNode = null;
          }
      }
  }
  function heap () {
      return new BinaryHeap(function(node) {
          return node.f;
      });
  };

  function search (grid, start, end) {
      init(grid);
      var heuristic = manhattan;
      // diagonal = !!diagonal;

      var openHeap = heap();
      
      openHeap.push(start);
      console.log('openHeap PUSH', openHeap)
      
      while(openHeap.size() > 0) {

          // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
          var currentNode = openHeap.pop();
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
          currentNode.isVisited = true;

          // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
          var neighbors = Neighbors(grid, currentNode);
          // console.log('neighbors', neighbors);

          for(var i = 0, il = neighbors.length; i < il; i++) {
              var neighbor = neighbors[i];

              if(neighbor.isVisited || neighbor.isWall) {
                  // Not a valid node to process, skip to next neighbor.
                  continue;
              }

              // The g score is the shortest distance from start to current node.
              // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
              var gScore = currentNode.g + neighbor.cost;
              var beenVisited = neighbor.isVisited;

              if(!beenVisited || gScore < neighbor.g) {

                  // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                  neighbor.isVisited = true;
                  neighbor.previousNode = currentNode;
                  neighbor.h = neighbor.h || heuristic(neighbor, end);
                  neighbor.g = gScore;
                  neighbor.f = neighbor.g + neighbor.h;

                  if (!beenVisited) {
                      // Pushing to heap will put it in proper place based on the 'f' value.
                      openHeap.push(neighbor);
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
      return [openHeap];
  };

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

      // // West
      // if(grid[x-1] && grid[x-1][y]) {
      //     ret.push(grid[x-1][y]);
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
      //     ret.push(grid[x][y+1]);
      // }

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

      return ret;
  };

  
};