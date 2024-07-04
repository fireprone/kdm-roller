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

const username = 'User#' + Math.floor(Math.random() * 100);

websocket.onopen = () => {
  websocket.send(JSON.stringify({ action: 'join', data: username }));
};

websocket.onmessage = (e) => {
  const message = JSON.parse(e.data);
  switch (message.action) {
    case 'connect':
      console.debug('a player connected');
      // Grab all player names from response
      const serverPlayers = message.data;

      // Find any new players that aren't already initialized
      const newPlayers = serverPlayers.filter((serverPlayer) => {
        return !Object.keys(players).includes(serverPlayer);
      });

      // Initialize remaining players
      newPlayers.forEach((playerName) => {
        const diceArray = [];

        const initDiceArray = async (array) => {
          for (var i = 0; i < MAX_DICE; i++) {
            const dice = new ArmorDice();
            await dice.load();

            dice.mesh.visible = false;

            scene.add(dice.mesh);
            array.push(dice);
          }

          return array;
        };

        initDiceArray(diceArray).then((array) => {
          players = { ...players, [playerName]: { dice: array } };
        });

        players = { ...players, [playerName]: { dice: [] } };
      });
      break;
    case 'disconnect':
      //TODO: Clean up 'players' object and remove dice when someone leaves
      console.debug('another player disconnected');
      break;
    case 'roll':
      //TODO: Remove collision between dice that belong to other players
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
