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

window.addEventListener('keydown', async (event) => {
  const numberOfDice = Number(event.key);
  console.debug(numberOfDice);
  if (isNaN(numberOfDice) || numberOfDice < 1 || numberOfDice > MAX_DICE) {
    return;
  }

  for (let i = 0; i < diceArray.length; i++) {
    if (i < numberOfDice) {
      diceArray[i].mesh.visible = true;
      world.addBody(diceArray[i].body);
      diceArray[i].roll();
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

function createNumberedDice() {
  const geometry = new THREE.OctahedronGeometry(1, 0, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.x += 1;
  mesh.rotation.y += 1;

  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: createOctahedronBody(),
  });
  body.position.copy(mesh.position);
  body.quaternion.copy(mesh.quaternion);
  world.addBody(body);

  return { mesh, body };
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

function createOctahedronBody() {
  const vertices = [
    new CANNON.Vec3(1, 0, 0),
    new CANNON.Vec3(0, 0, -1),
    new CANNON.Vec3(0, 1, 0),
    new CANNON.Vec3(0, 0, 1),
    new CANNON.Vec3(-1, 0, 0),
    new CANNON.Vec3(0, -1, 0),
  ];

  return new CANNON.ConvexPolyhedron({
    vertices,
    faces: [
      [0, 4, 3],
      [2, 4, 3],
      [2, 5, 3],
      [0, 3, 5],
      [0, 1, 4],
      [4, 2, 1],
      [1, 5, 2],
      [0, 5, 1],
    ],
  });
}
