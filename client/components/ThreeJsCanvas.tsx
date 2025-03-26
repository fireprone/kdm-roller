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

let armorDiceArray = [];
let d10DiceArray = [];

let sendRolledResults = (result) => {};

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

  let timeoutIdForHidingDice;

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

  function hideDice() {
    armorDiceArray.forEach((dice: { mesh, body }) => {
      dice.mesh.visible = false;
    });
  }

  async function rollDice(username: string, diceToRoll, diceNotBeingRolled, rolls, timestamp, type: string) {
    clearTimeout(timeoutIdForHidingDice);

    const ongoingRolls: Promise<string>[] = [];
    console.log(username + ' rolled');

    for (let i = 0; i < diceToRoll.length; i++) {
      if (i < rolls.length) {
        diceToRoll[i].mesh.visible = true;
        world.addBody(diceToRoll[i].body);
        const resultPromise = diceToRoll[i].roll(rolls[i]);
        ongoingRolls.push(resultPromise);
      } else {
        diceToRoll[i].mesh.visible = false;
        world.removeBody(diceToRoll[i].body);
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

      sendRolledResults(currentRoll);

      timeoutIdForHidingDice = setTimeout(hideDice, 5000);
    });
  }

  function initialize() {

    const initArmorDiceArray = async () => {
      const array = [];

      for (var i = 0; i < MAX_DICE; i++) {
        const dice = new ArmorDice();

        await dice.load(1);

        dice.mesh.visible = false;

        scene.add(dice.mesh);
        array.push(dice);
      }

      return array;
    };

    const initD10Array = async () => {
      const array = [];

      for (var i = 0; i < MAX_DICE; i++) {
        const dice = new TenSidedDice(); 

        await dice.load(2);

        dice.mesh.visible = false;

        scene.add(dice.mesh);
        array.push(dice);
      }

      return array;
    };

    initArmorDiceArray().then((array) => {
      armorDiceArray = array;
    })

    initD10Array().then((array) => {
      d10DiceArray = array;
    });

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

    const localSocket = `ws://${location.hostname}:3001/api`;
    const hostedSocket = `wss://kdm-roller.onrender.com/api`;
    const websocket = new WebSocket(
      window.location.protocol === 'https:' ? hostedSocket : localSocket
    );

    const selfUsername = 'User#' + Math.floor(Math.random() * 100);

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
            setPlayerList(Object.keys(players.current));
          });
          break;
        case 'disconnect':
          const playerName = (message.data as disconnectData).username;
          console.debug(`${playerName} disconnected`);

          delete players.current[playerName];

          if (!focusedPlayer) {
            setFocusedPlayer(selfUsername);
          }

          setPlayerList(Object.keys(players.current));
          break;
        case 'roll':
          const { username, type, rolls, timestamp } = message.data as rollData;
          let diceToRoll;
          let diceNotBeingRolled;

          if (type === 'd10') {
            diceToRoll = d10DiceArray;
            diceNotBeingRolled = armorDiceArray;
          } else {
            diceToRoll = armorDiceArray;
            diceNotBeingRolled = d10DiceArray;
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

    sendRolledResults = (result) => {
      if (websocket.readyState === websocket.OPEN) {
        websocket.send(JSON.stringify({ action: 'rolled', data: result}));
      }
    }

    function render() {
      world.fixedStep();

      armorDiceArray.forEach((dice: { mesh, body }) => {
        if (dice.mesh) {
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
        }
      });

      d10DiceArray.forEach((dice: { mesh, body }) => {
        if (dice.mesh) {
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
        }
      });

      // cannonDebugger.update();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function createFloor() {
      const shadowMaterial = new THREE.ShadowMaterial();
      const floor: any = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        // @ts-ignore
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

      const pointLight = new THREE.PointLight(0xffffff, 50, 50);
      scene.add(pointLight);
    }
  }

  return <div id='threejs-canvas' ref={ref}></div>;
};

export default ThreeJsCanvas;
