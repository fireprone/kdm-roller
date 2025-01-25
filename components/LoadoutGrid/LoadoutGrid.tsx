import './LoadoutGrid.css';
import Cell from '../Cell/Cell';
// import { AnimateSharedLayout } from 'motion/react';
import React from 'react';

const LoadoutGrid = ({
  cells,
  gridArray,
  activeIndex,
  tapStart,
  dragStart,
  dragActive,
  dragEnd,
  clickListener,
  dragConstraints,
}) => {
  return (
    // <AnimateSharedLayout>
      <div id='loadout-grid'>
        {cells.map((cell, i) => (
          <Cell
            index={i}
            activeIndex={activeIndex}
            key={`cell-${i}`}
            onTapStart={tapStart}
            clickListener={clickListener}
            dragStart={dragStart}
            dragActive={dragActive}
            dragEnd={dragEnd}
            ref={cell}
            dragConstraints={dragConstraints}
            cardName={gridArray[i]}
          />
        ))}
      </div>
    // </AnimateSharedLayout>
  );
};

export default LoadoutGrid;
