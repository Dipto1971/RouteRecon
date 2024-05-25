import React, { useState, useEffect } from 'react';
import Node from './Node/Node';
import { getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import dijkstra from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [movingStartNode, setMovingStartNode] = useState(false);
  const [movingFinishNode, setMovingFinishNode] = useState(false);

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  const handleMouseDown = (row, col) => {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      setMovingStartNode(true);
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      setMovingFinishNode(true);
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    if (movingStartNode) {
      const newGrid = getGridWithMovedStartNode(grid, row, col);
      setGrid(newGrid);
    } else if (movingFinishNode) {
      const newGrid = getGridWithMovedFinishNode(grid, row, col);
      setGrid(newGrid);
    } else {
      const newGrid = getNewGridWithWallToggled(grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMovingStartNode(false);
    setMovingFinishNode(false);
    setMouseIsPressed(false);
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  return (
    <>
      <button onClick={visualizeDijkstra} className='buttons'>
        Find Route
      </button>
      <button onClick={() => window.location.reload()} className='buttons'>
        Clear Board
      </button>
      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall, weight } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  weight={weight}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

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

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    weight: Math.floor(Math.random() * 10) + 1, // Assign a random weight between 1 and 10
    previousNode: null,
  };
};

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

const getGridWithMovedStartNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const currentNode = newGrid[row][col];
  const prevStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
  prevStartNode.isStart = false;
  currentNode.isStart = true;
  START_NODE_ROW = row;
  START_NODE_COL = col;
  return newGrid;
};

const getGridWithMovedFinishNode = (grid, row, col) => {
  const newGrid = grid.slice();
  const currentNode = newGrid[row][col];
  const prevFinishNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
  prevFinishNode.isFinish = false;
  currentNode.isFinish = true;
  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;
  return newGrid;
};

export default PathfindingVisualizer;
