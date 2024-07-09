import React from 'react';

interface Player {
  dice: Array<String>;
  collisionGroup: Number;
}

const Players = ({ playerList, focusedPlayer, setFocusedPlayer }) => {
  return (
    <div id='player-list'>
      {playerList.map((player) => {
        return (
          <div
            key={`${player}-icon`}
            className={`user-avatar ${
              player === focusedPlayer ? 'focused' : ''
            }`}
            onClick={() => setFocusedPlayer(player)}
          ></div>
        );
      })}
    </div>
  );
};

export default Players;
