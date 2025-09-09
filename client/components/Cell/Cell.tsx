//TODO: On motion end, remove 'translate-3d' attr

import './Cell.css';
import React, { forwardRef, useEffect, useState } from 'react';
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
      isCraftMode,
    },
    ref
  ) => {

    const [isNewlyCrafted, setIsNewlyCrafted] = useState(false);

    useEffect(() => {
      if (cardName && isCraftMode) {
        setIsNewlyCrafted(true);
      }
    }, [cardName]);

    useEffect(() => {
      if (!isCraftMode) {
        setIsNewlyCrafted(false);
      }
    }, [isCraftMode])

    return (
      <div
        id={index}
        ref={ref}
        className='loadout-space'
        style={{
          zIndex: activeIndex === index ? 2 : 1,
          padding: isNewlyCrafted ? '1rem' : 0,
          background: isNewlyCrafted ? 'purple' : '#333',
        }}
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
