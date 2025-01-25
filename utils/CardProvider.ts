import cardInfo from '../data/cardInfo';
import startingGearBack from '../img/starting-gear.png';

const CardProvider = (() => {
  const getCard = async (cardName) => {
    let cardObj = {};

    console.log(cardName);

    if (!cardName) {
      cardObj.image = '';
    } else {
      cardName = cardName.toUpperCase();
      if (!cardInfo.hasOwnProperty(cardName)) {
        console.error('Could not find card name for ' + cardName);
        cardObj.image = '';
      } else {
        cardObj.image = cardInfo[cardName].Image;
      }
    } 

    return cardObj;
  };

  return { getCard };
})();

export default CardProvider;
