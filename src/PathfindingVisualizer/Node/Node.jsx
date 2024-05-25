// Node/Node.js
import React from 'react';
import './Node.css';

const Node = ({ col, isFinish, isStart, isWall, weight, onMouseDown, onMouseEnter, onMouseUp, row }) => {
  const extraClassName = isFinish
    ? 'node-finish'
    : isStart
    ? 'node-start'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(row, col);
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        onMouseEnter(row, col);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        onMouseUp();
      }}
    >
      {weight}
    </div>
  );
};

export default Node;
 