import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { ArmorDice } from './dice';

const MAX_DICE = 5;

const scene = new THREE.Scene();
const world = new CANNON.World({
  allowSleep: true,
  gravity: new CANNON.Vec3(0, 0, -50),
});
world.defaultContactMaterial.restitution = 0.5;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

let players = {};

createFloor();
createWall(new THREE.Vector2(-5, 0), new THREE.Vector3(0, 1, 0)); // West
createWall(new THREE.Vector2(0, 5), new THREE.Vector3(1, 0, 0)); // North
createWall(new THREE.Vector2(5, 0), new THREE.Vector3(0, -1, 0)); // East
createWall(new THREE.Vector2(0, -5), new THREE.Vector3(-1, 0, 0)); // South
createLight();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);
requestAnimationFrame(render);

const isDiscord = location.host.includes('discord');
const wsProtocol = isDiscord ? 'wss' : 'ws';
const websocket = new WebSocket(`${wsProtocol}://${location.host}/api`);

const selfUsername = 'User#' + Math.floor(Math.random() * 100);

websocket.onopen = () => {
  websocket.send(JSON.stringify({ action: 'join', data: selfUsername }));
};

websocket.onmessage = (e) => {
  const message = JSON.parse(e.data);
  switch (message.action) {
    case 'connect':
      console.debug(message.data);
      // Grab all player names from response
      const serverPlayers = message.data;

      // Find any new players that aren't already initialized
      const newPlayers = serverPlayers.filter((serverPlayer) => {
        return !Object.keys(players).includes(serverPlayer);
      });

      // Initialize remaining players
      newPlayers.forEach((playerName) => {
        const diceArray = [];

        // Ensure collision group is not already assigned to another player
        let playerCollisionGroup;
        let count = 1;
        for (const name in players) {
          const newCollisionGroup = count * 2;

          if (players[name].collisionGroup !== newCollisionGroup) {
            playerCollisionGroup = newCollisionGroup;
            break;
          }

          count++;
        }

        const initDiceArray = async (array) => {
          for (var i = 0; i < MAX_DICE; i++) {
            const dice = new ArmorDice();
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

        players = {
          ...players,
          [playerName]: { dice: [], collisionGroup: playerCollisionGroup },
        };

        initDiceArray(diceArray).then((array) => {
          players[playerName].dice = array;
        });
      });
      break;
    case 'disconnect':
      const playerName = message.data.username;
      console.debug(`${playerName} disconnected`);

      const playerDicePool = players[playerName].dice;

      for (let i = 0; i < playerDicePool.length; i++) {
        playerDicePool[i].mesh.material.dispose();
        playerDicePool[i].mesh.geometry.dispose();

        scene.remove(playerDicePool[i].mesh);
        world.removeBody(playerDicePool[i].body);
      }

      delete players[playerName];
      break;
    case 'roll':
      const { username, rolls } = message.data;
      const playerDice = players[username].dice;

      for (let i = 0; i < playerDice.length; i++) {
        if (i < rolls.length) {
          playerDice[i].mesh.visible = true;
          world.addBody(playerDice[i].body);
          playerDice[i].roll(rolls[i]);
        } else {
          playerDice[i].mesh.visible = false;
          world.removeBody(playerDice[i].body);
        }
      }
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

  for (const name in players) {
    players[name].dice.forEach((dice) => {
      if (dice.mesh) {
        dice.mesh.position.copy(dice.body.position);
        dice.mesh.quaternion.copy(dice.body.quaternion);
      }
    });
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function createFloor() {
  // Three.js (visible) object
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0xaa00000 })
  );
  floor.receiveShadow = true;
  floor.position.z = -5;
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

function createWall(position, axis) {
  const wallShadow = new THREE.MeshStandardMaterial({ color: 0x777777 });

  const wallMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), wallShadow);
  wallMesh.receiveShadow = true;
  wallMesh.position.x = position.x;
  wallMesh.position.y = position.y;

  wallMesh.quaternion.setFromAxisAngle(axis, Math.PI / 2);
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

function createLight() {
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa);
  scene.add(hemisphereLight);

  const pointLight = new THREE.PointLight(0xffffff, 50, 10);
  scene.add(pointLight);
}
