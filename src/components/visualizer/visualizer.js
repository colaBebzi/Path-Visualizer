import React, {Component } from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../../algorithms/dijkstra';
//import {initMap, breadthFirstSearch} from '../../algorithms/bfs';
import { AStar } from '../../algorithms/astar';
// import { astar } from '../../algorithms/astar2';
import flagsmith from 'flagsmith';
import { useFlags, useFlagsmith } from 'flagsmith/react';


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
      // darkMode: false,
    };
  }

  // toggleDarkMode = () => {
  //   this.setState(prevState => ({
  //     darkMode: !prevState.darkMode,
  //   }));
  // };

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
    // flagsmith.init({
    //   environmentID: 'FyA89scRGCQZqy7rAQaarB',
    // })
    // .finally(() => {

    //   const { flags } = flagsmith;
    //   console.log(flags)
    //   const darkModeValue = flags['dark_mode']?.enabled ?? false;
    //   console.log(darkModeValue)

    //   this.setState({
    //     darkMode: darkModeValue,
    //   });
    // });

    

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
    const astar = AStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log('nodesInShortestPathOrder', nodesInShortestPathOrder);
    console.log('astar', astar);
    this.animateVisitedAstar(astar[1])
      .then(() => this.animateAstar(astar[0], nodesInShortestPathOrder))
  }

  //visualizeBfs() {
  //  const {grid} = this.state;
  //  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  //  const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
  //  initMap(grid, startNode);
  //  // const visitedNodesInOrder = bs(grid, startNode);
  //  //const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
  //  breadthFirstSearch(grid, startNode, finishNode);
  //  // const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  //  // this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  //}

  // md:w-55 lg:w-90 
  // max-w-2xl 

  
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      // <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <div className="dark-mode">
        <div className="btns space-x-2 space-y-1 glass-effect">
          {/* <button className="btn-primary" onClick={this.toggleDarkMode}>
            {darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
          </button> */}
          <button className="btn-primary" onClick={() => this.visualizeDijkstra()} onChange={() => this.addSelected()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button className="btn-primary" onClick={() => this.visualizeAstar()} onChange={() => this.addSelected()}>
            A*
          </button>
          {/*<button className="btn-primary" onClick={() => this.visualizeBfs()} onChange={() => this.addSelected()}>*/}
          {/*  BFS*/}
          {/*</button>*/}
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
        {/* set size panel */}
        <div className="grid mb-10 mt-24">
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
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 15; row++) {
    const currentRow = [];
    for (let col = 0; col < 15; col++) {
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