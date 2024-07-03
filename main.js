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

const diceArray = [];

const initDiceArray = async (array) => {
  for (var i = 0; i < MAX_DICE; i++) {
    const dice = new ArmorDice();
    await dice.load();

    dice.mesh.visible = false;

    scene.add(dice.mesh);
    array.push(dice);
  }
};
initDiceArray(diceArray);

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

websocket.onmessage = (e) => {
  const message = JSON.parse(e.data);
  switch (message.action) {
    //case 'connect':
    // break;
    case 'disconnect':
      console.log('another player disconnected');
      break;
    case 'roll':
      const rolls = message.data;
      for (let i = 0; i < diceArray.length; i++) {
        if (i < rolls.length) {
          diceArray[i].mesh.visible = true;
          world.addBody(diceArray[i].body);
          diceArray[i].roll(rolls[i]);
        } else {
          diceArray[i].mesh.visible = false;
          world.removeBody(diceArray[i].body);
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
    websocket.send(`${numberOfDice}`);
    return;
  }

  for (let i = 0; i < diceArray.length; i++) {
    if (i < numberOfDice) {
      diceArray[i].mesh.visible = true;
      world.addBody(diceArray[i].body);

      const rotation = {
        x: 2 * Math.PI * Math.random(),
        y: 0,
        z: 2 * Math.PI * Math.random(),
      };
      const force = 3 + 5 * Math.random();

      diceArray[i].roll({ rotation, force });
    } else {
      diceArray[i].mesh.visible = false;
      world.removeBody(diceArray[i].body);
    }
  }
});

function render() {
  world.fixedStep();

  diceArray.forEach((dice) => {
    if (dice.mesh) {
      dice.mesh.position.copy(dice.body.position);
      dice.mesh.quaternion.copy(dice.body.quaternion);
    }
  });

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
