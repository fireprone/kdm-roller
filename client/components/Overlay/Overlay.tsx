import './Overlay.css';
import React, { useState } from 'react';
import LoadoutCard from '../LoadoutCard/LoadoutCard';
import TermsList from '../TermsList/TermsList';
import { motion } from 'motion/react';

const Overlay = ({ focusedCard, setFocusedCard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
      <div id='card-preview'>
        <motion.div
          id='flip-card'
          className={isFlipped ? 'is-flipped' : ''}
          onTap={() => setIsFlipped(!isFlipped)}
          initial={{ marginTop: 0 }}
          animate={{ marginTop: '2rem' }}
        >
          <LoadoutCard
            whileTap={{ scale: 1.1 }}
            name={focusedCard.name}
            classes='card-front'
          />
          <LoadoutCard
            whileTap={{ scale: 1.1 }}
            name={focusedCard.Origin}
            classes='card-back'
          />
        </motion.div>
        {focusedCard.Terms && focusedCard.Terms.length ? (
          <TermsList terms={focusedCard.Terms} />
        ) : (
          ''
        )}
      </div>
      <motion.div
        id='overlay-bg'
        onTap={() => {
          setFocusedCard({ name: '', origin: '' });
        }}
      ></motion.div>
    </motion.div>
  );
};

export default Overlay;
