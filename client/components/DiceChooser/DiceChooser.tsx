import React, {useState} from 'react';
import './DiceChooser.css';

const DiceChooser = () => {
  const [numberOfDice, setNumberOfDice] = useState(2);

  return (
    <div id='dice-chooser'>
        <input type='textbox' maxLength='1' value={numberOfDice} 
          onChange={(e) => {
            setNumberOfDice(Number(e.key));
          }}
          onKeyDown={(e) => {
            if (isNaN(Number(e.key))) {
              return;
            }
            setNumberOfDice(Number(e.key));
          }}></input>
        <button onClick={() => window.rollDiceCallback('armor', numberOfDice)}>Armor Dice</button>
        <button onClick={() => window.rollDiceCallback('d10', numberOfDice)}>d10</button>
    </div>
  );
};

export default DiceChooser;
