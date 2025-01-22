import React from 'react';

const colors = ['red', 'blue', 'green', 'purple', 'black', 'white'];

const Players = ({ playerList, focusedPlayer, setFocusedPlayer }) => {
  return (
    <div id='player-list'>
      {playerList.map((player: string, index: number) => {
        return (
          <div
            key={`${player}-icon`}
            className={`user-avatar ${
              player === focusedPlayer ? 'focused' : ''
            }`}
            style={{ borderColor: colors[index] }}
            onClick={() => setFocusedPlayer(player)}
          ></div>
        );
      })}
    </div>
  );
};

export default Players;
