import React, { useState } from 'react';
import { priorRoll } from '../types/Roll';
import armImage from '../icons/small-arms.png';
import bodyImage from '../icons/small-body.png';
import headImage from '../icons/head.png';
import legImage from '../icons/small-legs.png';
import waistImage from '../icons/small-waist.png';

const RollHistory = ({ priorRolls }) => {
  const [isShowing, setIsShowing] = useState(false);

  const faceMap = {
    ARM: armImage,
    'BODY 1': bodyImage,
    'BODY 2': bodyImage,
    HEAD: headImage,
    LEG: legImage,
    WAIST: waistImage,
  };

  return (
    <>
      {isShowing && (
        <div id='history-list'>
          {priorRolls.map((roll: priorRoll, i: number) => {
            return (
              <div key={i}>
                {i !== 0 && <hr />}
                {`${roll.username} -- ${roll.timestamp}`}
                <br />
                {roll.faces.map((face, i) => {
                  {
                    console.log(`${face} -- ${faceMap[face]}`);
                  }
                  return <img key={i} src={faceMap[face]} alt={face} />;
                })}
              </div>
            );
          })}
        </div>
      )}
      <button id='history-button' onClick={() => setIsShowing(!isShowing)}>
        {isShowing ? 'vvv' : '§§§'}
      </button>
    </>
  );
};

export default RollHistory;
