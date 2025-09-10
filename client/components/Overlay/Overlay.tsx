import './Overlay.css';
import React, { useContext } from 'react';
import LoadoutCard from '../LoadoutCard/LoadoutCard';
import { motion } from 'motion/react';
import cardInfo from '../../data/cardInfo';
import { CraftContext } from '../../utils/CraftContext';

const Overlay = ({ setIsOverlayOpen, overlayIndex, setGridArray, craftableList }) => {
  const { isCraftMode, setResourcesList } = useContext(CraftContext);

  const cards = isCraftMode ? craftableList.map((card) => card.name) : Object.keys(cardInfo);

  return (
    <motion.div
      id='Overlay'
      initial={{ opacity: 0, marginTop: 0 }}
      animate={{ opacity: 1, marginTop: 0 }}
      exit={{ opacity: 0, marginTop: 0 }}
      transition={{
        opacity: { type: 'tween', duration: 0.3 },
        marginTop: { type: 'tween', duration: 0.3 },
      }}
    >
      <div id='overlay-list'>
        {cards.map((card, index) => {
          return (
            <div key={index} className='overlay-content'>
              <LoadoutCard
                onTapStart={() => {
                  setGridArray((previous) => {
                    const newArray = [...previous];
                    newArray[overlayIndex] = card.toLocaleLowerCase();
                    return newArray;
                  });

                  setResourcesList((current) => {
                    const updated = [...current];
                    updated[overlayIndex] = (craftableList[index].resources.split('+'))
                    return updated;
                  });

                  setIsOverlayOpen(false);
                }} 
                name={card.toLocaleLowerCase()}
              />
              {isCraftMode && (
                <ul>
                    {craftableList[index].resources?.split('+').map((resource, index) => {
                      return <li key={index}>{resource}</li>;
                    })}
                </ul>
              )}
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
