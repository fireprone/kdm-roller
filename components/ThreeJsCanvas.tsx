import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { ArmorDice, TenSidedDice } from '../dice';
import {
  connectData,
  disconnectData,
  Message,
  rollData,
} from '../types/Message';
import { priorRoll } from '../types/Roll';
import CannonDebugger from 'cannon-es-debugger';

const ThreeJsCanvas = ({
  scene,
  world,
  setPlayerList,
  focusedPlayer,
  setFocusedPlayer,
  setPriorRolls,
}) => {
  const MAX_DICE = 5;
  const ref = useRef(null);
  const players = useRef({});

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!focusedPlayer) {
      return;
    }

    for (const name in players.current) {
      const playerDicePool = players.current[name].dice;

      for (let i = 0; i < playerDicePool.length; i++) {
        playerDicePool[i].mesh.material.opacity =
          name === focusedPlayer ? 1 : 0.2;
        playerDicePool[i].mesh.material.transparent =
          name === focusedPlayer ? false : true;
      }
    }
  }, [focusedPlayer]);

  async function rollDice(username: string, playerDice, rolls, timestamp) {
    const ongoingRolls: Promise<string>[] = [];

    console.log(username + ' rolled');

    for (let i = 0; i < playerDice.length; i++) {
      if (i < rolls.length) {
        playerDice[i].mesh.visible = true;
        world.addBody(playerDice[i].body);
        const resultPromise = playerDice[i].roll(rolls[i]);
        ongoingRolls.push(resultPromise);
      } else {
        playerDice[i].mesh.visible = false;
        world.removeBody(playerDice[i].body);
      }
    }

    Promise.all(ongoingRolls).then((diceRolls) => {
      const currentRoll = {
        username,
        timestamp: new Date(timestamp).toLocaleTimeString(),
        faces: diceRolls,
      };

      console.log('rolled -- ' + currentRoll.faces)

      setPriorRolls((prev: priorRoll[]) => [...prev, currentRoll]);
    });
  }

  function initialize() {
    const camera: any = new THREE.PerspectiveCamera(
      75,
      ref.current.offsetWidth / ref.current.offsetHeight,
      0.1,
      100
    );
    
    // const cannonDebugger = new CannonDebugger(scene, world);

    camera.rotation.x = -Math.PI / 2;
    camera.position.y = 5;

    createFloor();
    createWall(new THREE.Vector3(0, 0, -5), new THREE.Vector3(0, 1, 0), 0); // North
    createWall(new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 1, 0), Math.PI / 2); // West
    createWall(new THREE.Vector3(5, 0, 0), new THREE.Vector3(0, -1, 0), Math.PI / 2); // East
    createWall(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 1, 0), Math.PI); // South
    createLights();

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);

    window.addEventListener('resize', () => {
      renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight);
    });

    ref.current.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    const isDiscord = location.host.includes('discord');
    const wsProtocol = isDiscord ? 'wss' : 'ws';
    const websocket = new WebSocket(
      `${wsProtocol}://${location.host}${isDiscord ? '/.proxy' : ''}/api`
    );

    let selfUsername;
    if (isDiscord) {
      selfUsername = '';
    }

    selfUsername = 'User#' + Math.floor(Math.random() * 100);

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ action: 'join', data: selfUsername }));
    };

    websocket.onmessage = (e) => {
      const message: Message = JSON.parse(e.data);
      switch (message.action) {
        case 'connect':
          // Grab all player names from response
          const serverPlayers = message.data as connectData;

          // Find any new players that aren't already initialized
          const newPlayers = serverPlayers.filter((serverPlayer) => {
            return !Object.keys(players.current).includes(serverPlayer);
          });

          // Initialize remaining players
          newPlayers.forEach((playerName) => {
            const diceArray = [];

            // Ensure collision group is not already assigned to another player
            let playerCollisionGroup;
            let count = 1;
            for (const name in players.current) {
              const newCollisionGroup = count * 2;

              if (players.current[name].collisionGroup !== newCollisionGroup) {
                playerCollisionGroup = newCollisionGroup;
                break;
              }

              count++;
            }

            const initDiceArray = async (array) => {
              for (var i = 0; i < MAX_DICE; i++) {
                let dice; 

                //TODO: Let user choose which dice to roll
                // if (i < 2) {
                  dice = new TenSidedDice();
                // } else {
                  // dice = new ArmorDice();
                // }

                await dice.load(playerCollisionGroup);

                dice.mesh.visible = false;
                if (playerName !== selfUsername) {
                  dice.mesh.material.opacity = 0.2;
                  dice.mesh.material.transparent = true;
                }

                scene.add(dice.mesh);
                array.push(dice);
              }

              return array;
            };

            players.current = {
              ...players.current,
              [playerName]: { dice: [], collisionGroup: playerCollisionGroup },
            };

            setPlayerList(Object.keys(players.current));

            initDiceArray(diceArray).then((array) => {
              players.current[playerName].dice = array;
            });
          });
          break;
        case 'disconnect':
          const playerName = (message.data as disconnectData).username;
          console.debug(`${playerName} disconnected`);

          const playerDicePool = players.current[playerName].dice;

          for (let i = 0; i < playerDicePool.length; i++) {
            playerDicePool[i].mesh.material.dispose();
            playerDicePool[i].mesh.geometry.dispose();

            scene.remove(playerDicePool[i].mesh);
            world.removeBody(playerDicePool[i].body);
          }

          delete players.current[playerName];

          if (!focusedPlayer) {
            setFocusedPlayer(selfUsername);
          }

          setPlayerList(Object.keys(players.current));
          break;
        case 'roll':
          const { username, rolls, timestamp } = message.data as rollData;
          const playerDice = players.current[username].dice;

          rollDice(username, playerDice, rolls, timestamp);

          break;
        default:
          console.error(`action (${message.action}) not recognized`);
      }
    };

    window.addEventListener('keydown', async (event) => {
      const numberOfDice = Number(event.key);
      console.debug(numberOfDice);
      if (isNaN(numberOfDice) || numberOfDice < 1 || numberOfDice > MAX_DICE) {
        return;
      }

      if (websocket.readyState === websocket.OPEN) {
        websocket.send(JSON.stringify({ action: 'roll', data: numberOfDice }));
      }
    });

    function render() {
      world.fixedStep();

      for (const name in players.current) {
        players.current[name].dice.forEach((dice) => {
          if (dice.mesh) {
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
          }
        });
      }

      // cannonDebugger.update();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function createFloor() {
      const shadowMaterial = new THREE.ShadowMaterial();
      const floor: any = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        shadowMaterial
      );
      floor.receiveShadow = true;

      floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
      floor.position.x = 0;
      floor.position.y = -5;
      scene.add(floor);

      // Cannon-es (physical) object
      const floorBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        collisionFilterGroup: 1,
      });
      floorBody.position.copy(floor.position);
      floorBody.quaternion.copy(floor.quaternion);
      world.addBody(floorBody);
    }

    function createWall(position, axis, rotation) {
      const wallMaterial = new THREE.ShadowMaterial();

      const wallMesh: any = new THREE.Mesh(
        new THREE.PlaneGeometry(15, 15),
        // @ts-ignore
        wallMaterial
      );
      wallMesh.receiveShadow = true;
      wallMesh.position.x = position.x;
      wallMesh.position.y = position.y;
      wallMesh.position.z = position.z;

      wallMesh.quaternion.setFromAxisAngle(axis, rotation);
      scene.add(wallMesh);

      // Cannon-es (physical) object
      const wallBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        collisionFilterGroup: 1,
      });
      wallBody.position.copy(wallMesh.position);
      wallBody.quaternion.copy(wallMesh.quaternion);
      world.addBody(wallBody);
    }

    function createLights() {
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      scene.add(directionalLight);
    }
  }

  return <div id='threejs-canvas' ref={ref}></div>;
};

export default ThreeJsCanvas;
