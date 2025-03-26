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
      setOverlayIndex,
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
            dragElastic={1}
            dragSnapToOrigin
            dragConstraints={dragConstraints}
            whileTap={{ scale: 1.2 }}
            style={activeIndex === index ? { zIndex: 2 } : { zIndex: 1 }}
            layout
          >
            <LoadoutCard
              onTapStart={onTapStart}
              onTap={() => {
                setOverlayIndex(index);
                clickListener && clickListener(true);
              }}
              name={cardName}
            />
          </motion.div>
        ) : (
          <div className='card' onClick={() => {
            setOverlayIndex(index);
            clickListener && clickListener(true);
          }} />
        )}
      </div>
    );
  }
);

export default Cell;
