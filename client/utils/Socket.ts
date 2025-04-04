import { MAX_DICE } from './Constants';
import ArmorDicePool from './ArmorDicePool';
import D10Pool from './D10Pool';
import { priorRoll } from '../types/Roll';
import {
  connectData,
  disconnectData,
  Message,
  rollData,
} from '../types/Message';
import World from './World';

const Socket = (() => {
    let websocket: WebSocket;
    let timeoutIdForHidingDice;

    async function rollDice(username: string, diceToRoll, diceNotBeingRolled, rolls, timestamp, type: string) {
        clearTimeout(timeoutIdForHidingDice);

        const ongoingRolls: Promise<string>[] = [];
        console.log(username + ' rolled');

        for (let i = 0; i < diceToRoll.length; i++) {
            if (i < rolls.length) {
                diceToRoll[i].mesh.visible = true;
                World.get().addBody(diceToRoll[i].body);
                const resultPromise = diceToRoll[i].roll(rolls[i]);
                ongoingRolls.push(resultPromise);
            } else {
                diceToRoll[i].mesh.visible = false;
                World.get().removeBody(diceToRoll[i].body);
            }

            diceNotBeingRolled[i].mesh.visible = false;
        }

        Promise.all(ongoingRolls).then((diceRolls) => {
            const currentRoll = {
                username,
                timestamp: new Date(timestamp).toLocaleTimeString(),
                faces: diceRolls,
            };

            console.log('rolled -- ' + currentRoll.faces);

            Socket.sendRolledResults(currentRoll);

            timeoutIdForHidingDice = setTimeout(ArmorDicePool.hideAll, 5000);
        });
    }

    const initialize = (selfUsername: string, setPriorRolls) => {
      const localSocket = `ws://${location.hostname}:3001/api`;
      const hostedSocket = `wss://kdm-roller.onrender.com/api`;
      websocket = new WebSocket(
        window.location.protocol === 'https:' ? hostedSocket : localSocket
      );

      websocket.onopen = () => {
        websocket.send(JSON.stringify({ action: 'join', data: selfUsername }));
      };

      websocket.onclose = () => {
        setTimeout(() => {
          //attempt to reconnect
          initialize(selfUsername, setPriorRolls);
        }, 5000);
      };

      websocket.onmessage = (e) => {
        const message: Message = JSON.parse(e.data);
        switch (message.action) {
          case 'connect':
            // Grab all player names from response
            // const serverPlayers = message.data as connectData;

            // Find any new players that aren't already initialized
            // const newPlayers = serverPlayers.filter((serverPlayer) => {
            //   return !Object.keys(players.current).includes(serverPlayer);
            // });

            // Initialize remaining players
            // newPlayers.forEach((playerName) => {
            //   setPlayerList(Object.keys(players.current));
            // });
            break;
          case 'disconnect':
            const playerName = (message.data as disconnectData).username;
            console.debug(`${playerName} disconnected`);

            // delete players.current[playerName];

            // if (!focusedPlayer) {
            //   setFocusedPlayer(selfUsername);
            // }

            // setPlayerList(Object.keys(players.current));
            break;
          case 'roll':
            const { username, type, rolls, timestamp } = message.data as rollData;
            let diceToRoll;
            let diceNotBeingRolled;

            if (type === 'd10') {
              diceToRoll = D10Pool.get();
              diceNotBeingRolled = ArmorDicePool.get();
            } else {
              diceToRoll = ArmorDicePool.get();
              diceNotBeingRolled = D10Pool.get();
            }

            rollDice(username, diceToRoll, diceNotBeingRolled, rolls, timestamp, type);
            break;
          case 'rolled':
            setPriorRolls((prev: priorRoll[]) => [...prev, message.data]);
            break;
          default:
            console.error(`action (${message.action}) not recognized`);
        }
      };

      window.rollDiceCallback = (type: string, numberOfDice: number) => {
        if (isNaN(numberOfDice) || numberOfDice < 1 || numberOfDice > MAX_DICE) {
          return;
        }

        if (websocket.readyState === websocket.OPEN) {
          websocket.send(JSON.stringify({ action: 'roll', data: { type, numberOfDice }}));
        }
      };
    };

    const sendRolledResults = (result) => {
        if (websocket.readyState === websocket.OPEN) {
            websocket.send(JSON.stringify({ action: 'rolled', data: result}));
        }
    }

    return { initialize, sendRolledResults };
})();

export default Socket;