import React, { useState, useContext } from 'react';
import { priorRoll } from '../types/Roll';
import armImage from '../icons/small-arms.png';
import bodyImage from '../icons/small-body.png';
import headImage from '../icons/head.png';
import legImage from '../icons/small-legs.png';
import waistImage from '../icons/small-waist.png';
import { CraftContext } from '../utils/CraftContext';

const RollHistory = ({ priorRolls }) => {
  const [isShowing, setIsShowing] = useState(false);
  const { isCraftMode, resourcesList } = useContext(CraftContext);
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
        {isCraftMode ? (
          <ul>
            {resourcesList.flat().map((resource, index) => {
              return resource && <li key={index}>{resource}</li>
            })}
          </ul>
        ) : (
          <>
            {priorRolls.map((roll: priorRoll, i: number) => {
              return (
                <div key={i}>
                  <span id='username'>{roll.username}</span>
                  <span id='timestamp'>{roll.timestamp}</span>
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
            </>
          )}
          </div>
        )
      } 
      <button 
        id='history-button' 
        onClick={() => setIsShowing(!isShowing)}>
        {isShowing ? 'Hide' : (isCraftMode ? 'Total' : 'History')}
      </button>
    </>
  );
};

export default RollHistory;
