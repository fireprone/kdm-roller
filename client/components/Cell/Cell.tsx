//TODO: On motion end, remove 'translate-3d' attr

import './Cell.css';
import React, { forwardRef } from 'react';
import LoadoutCard from '../LoadoutCard/LoadoutCard';
import { motion } from 'motion/react';

const Cell = forwardRef(
  (
    {
      index,
      dragStart,
      dragActive,
      dragEnd,
      activeIndex,
      onTapStart,
      clickListener,
      dragConstraints,
      cardName,
    },
    ref
  ) => {
    return (
      <div
        id={index}
        ref={ref}
        className='loadout-space'
        style={activeIndex === index ? { zIndex: 2 } : { zIndex: 1 }}
      >
        {cardName ? (
          <motion.div
            className='cardDrag'
            drag
            onDragStart={dragStart}
            onDrag={dragActive}
            onDragEnd={dragEnd}
            dragElastic={0}
            dragConstraints={dragConstraints}
            layout
          >
            <LoadoutCard
              whileTap={{ scale: 1.2 }}
              onTapStart={onTapStart}
              name={cardName}
              clickListener={clickListener}
            />
          </motion.div>
        ) : (
          <div className='card' />
        )}
      </div>
    );
  }
);

export default Cell;
