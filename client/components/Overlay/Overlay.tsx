import './Overlay.css';
import React from 'react';
import LoadoutCard from '../LoadoutCard/LoadoutCard';
import { motion } from 'motion/react';
import cardInfo from '../../data/cardInfo';

const Overlay = ({ setIsOverlayOpen, overlayIndex, setGridArray }) => {
  return (
    <motion.div
      id='Overlay'
      initial={{ opacity: 0, marginTop: 0 }}
      animate={{ opacity: 1, marginTop: '10vmin' }}
      exit={{ opacity: 0, marginTop: 0 }}
      transition={{
        opacity: { type: 'tween', duration: 0.3 },
        marginTop: { type: 'tween', duration: 0.3 },
      }}
    >
      <div id='overlay-list'>
        {Object.keys(cardInfo).map((card, index) => {
          return (
            <div key={index} className='overlay-content'>
              <LoadoutCard
                onTapStart={() => {
                  setGridArray((previous) => {
                    const newArray = [...previous];
                    newArray[overlayIndex] = card.toLocaleLowerCase();
                    return newArray;
                  });

                  setIsOverlayOpen(false);
                }} 
                name={card.toLocaleLowerCase()}
              />
            </div>
          );
        })}
      </div>
      <motion.div
        id='overlay-bg'
        onClick={() => {
          setGridArray((previous) => {
            const newArray = [...previous];
            newArray[overlayIndex] = null;

            return newArray;
          });
          setIsOverlayOpen(false);
        }}
      >
      </motion.div>
    </motion.div>
  );
};

export default Overlay;
