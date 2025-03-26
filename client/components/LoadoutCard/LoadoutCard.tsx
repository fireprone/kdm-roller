import './LoadoutCard.css';
import React, { useEffect, useState } from 'react';
import CardProvider from '../../utils/CardProvider';
import { motion } from 'motion/react';

const LoadoutCard = ({
  onTapStart,
  onTap,
  name,
  classes,
}) => {
  const [cardInfo, setCardInfo] = useState({ image: '', origin: '' });

  useEffect(() => {
    CardProvider.getCard(name).then((card) => setCardInfo(card));
  }, [name]);

  const style = {
    backgroundImage: `url(${cardInfo.image})`,
  };

  return (
    <motion.div
      onTapStart={onTapStart}
      onTap={onTap}
      className={name + ' card' + (classes ? ` ${classes}` : '')}
      style={style}
    ></motion.div>
  );
};

export default LoadoutCard;
