import React from 'react';

interface Player {
  dice: Array<String>;
  collisionGroup: Number;
}

const Players = ({ playerList }) => {
  return (
    <div id='player-list'>
      {playerList.map((player) => {
        return <div key={`${player}-icon`} className='user-avatar'></div>;
      })}
    </div>
  );
};

export default Players;
