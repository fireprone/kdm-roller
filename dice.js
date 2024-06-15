import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const world = new CANNON.World({
  allowSleep: true,
  gravity: new CANNON.Vec3(0, 0, -50),
});
world.defaultContactMaterial.restitution = 0.3;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

// const dice = createNumberedDice();
let dice = null;
createFloor();
createWall(new THREE.Vector2(-5, 0), new THREE.Vector3(0, 1, 0)); // West
createWall(new THREE.Vector2(0, 5), new THREE.Vector3(1, 0, 0)); // North
createWall(new THREE.Vector2(5, 0), new THREE.Vector3(0, -1, 0)); // East
createWall(new THREE.Vector2(0, -5), new THREE.Vector3(-1, 0, 0)); // South
createLight();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
loader.load('./models/armor-dice.glb', function (gltf) {
  dice = createArmorDice(gltf.scene.children[0]);

  dice.body.addEventListener('sleep', (e) => {
    const eps = 0.2;
    let isZero = (angle) => Math.abs(angle) < eps;
    let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
    let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

    const euler = new CANNON.Vec3();
    dice.body.quaternion.toEuler(euler);
    console.dir(euler);

    //TODO: Fix labels!
    if (
      (isZero(euler.y) && isZero(euler.x)) ||
      (isPiOrMinusPi(euler.y) && isPiOrMinusPi(euler.x))
    ) {
      console.log('landed on WAIST'); // -- good
      return;
    }

    if (isZero(euler.y)) {
      if (isHalfPi(euler.x)) {
        console.log('landed on BODY 1'); // -- double-check
      } else if (isMinusHalfPi(euler.x)) {
        console.log('landed on ARMS'); // --
      } else if (isPiOrMinusPi(euler.x)) {
        console.log('landed on FOOT'); // --
      } else {
        console.log('weird...');
      }

      // if (isZero(euler.x) && isZero(euler.y)) {
      // console.log('landed on WAIST');
      // } else if (isZero(euler.x) && isZero(euler.z)) {
      //   console.log('landed on BODY');
      // } else if (isZero(euler.y) && isZero(euler.z)) {
      //   console.log('landed on ARM');
    } else if (isHalfPi(euler.y)) {
      // showRollResults(2);

      console.log('landed on HEAD'); // -- good
      // showRollResults(5);
    } else if (isMinusHalfPi(euler.y)) {
      console.log('landed on BODY 2'); // --
    } else {
      // landed on edge => wait to fall on side and fire the event again
      // dice.body.allowSleep = true;
      console.log('weird pt 2.');
    }
  });
});

renderer.render(scene, camera);
requestAnimationFrame(render);

window.addEventListener('keydown', () => {
  if (!dice) {
    return;
  }

  dice.body.position = new CANNON.Vec3(5, 0, 0);

  dice.body.velocity.setZero();
  dice.body.angularVelocity.setZero();

  dice.mesh.rotation.set(
    2 * Math.PI * Math.random(),
    0,
    2 * Math.PI * Math.random()
  );
  dice.body.quaternion.copy(dice.mesh.quaternion);

  const force = 3 + 5 * Math.random();
  dice.body.applyImpulse(new CANNON.Vec3(-force, force, 0));
});

function render() {
  world.fixedStep();

  if (dice) {
    dice.mesh.position.copy(dice.body.position);
    dice.mesh.quaternion.copy(dice.body.quaternion);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function createArmorDice(mesh) {
  scene.add(mesh);

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
  });
  body.position.copy(mesh.position);
  body.quaternion.copy(mesh.quaternion);
  world.addBody(body);

  return { mesh, body };
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
