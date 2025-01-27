import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const isDiscord = location.host.includes('discord');
let armorDiceMesh = null;
let tenSidedDiceMesh = null;
let numberOfDiceRolling = 0;

loader.load(
  `.${isDiscord ? '/.proxy' : ''}/models/armor-dice.glb`,
  function (gltf) {
    armorDiceMesh = gltf.scene.children[0];
    window.dispatchEvent(new Event('loadedArmorDiceMesh'));
  }
);

loader.load(
  `.${isDiscord ? '/.proxy' : ''}/models/d10.glb`,
  function (gltf) {
    tenSidedDiceMesh = gltf.scene.children[0];
    window.dispatchEvent(new Event('loadedTenSidedDiceMesh'));
  }
);

export function ArmorDice() {
  const calculateTopFace = (euler) => {
    const eps = 0.1;
    let isZero = (angle) => Math.abs(angle) < eps;
    let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
    let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

  if (isZero(euler.z)) {
    if (isZero(euler.x)) {
        return 'BODY 1';
    } else if (isHalfPi(euler.x)) {
        return 'LEG';
    } else if (isMinusHalfPi(euler.x)) {
        return 'WAIST';
    } else if (isPiOrMinusPi(euler.x)) {
        return 'BODY 2';
    }
  } else if (isHalfPi(euler.z)) {
      return 'ARM';
  } else if (isMinusHalfPi(euler.z)) {
      return 'HEAD';
  } 

    return null;
  };

  const getFaceValue = () => {
    this.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    this.body.quaternion.toEuler(euler);

    const faceValue = calculateTopFace(euler);
    if (faceValue == null) {
      this.body.allowSleep = true;
      return;
    }

    return faceValue;
  };

  this.mesh = null;
  this.body = null;
  this.load = (playerCollisionGroup) =>
    new Promise((resolve) => {
      const initializeMeshAndBody = () => {
        window.removeEventListener(
          'loadedArmorDiceMesh',
          initializeMeshAndBody
        );

        this.mesh = armorDiceMesh.clone();
        this.mesh.traverse((node) => {
          if (node.isMesh) {
            node.material = node.material.clone();
          }
        });

        this.body = new CANNON.Body({
          mass: 1,
          shape: new CANNON.Box(new CANNON.Vec3(0.55, 0.55, 0.55)),
          sleepTimeLimit: 0.1,
          collisionFilterGroup: playerCollisionGroup,
          collisionFilterMask: 1 /* floor & walls */ | playerCollisionGroup,
        });
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);

        resolve();
      };

      if (armorDiceMesh != null) {
        initializeMeshAndBody();
      } else {
        window.addEventListener('loadedArmorDiceMesh', initializeMeshAndBody);
      }
    });
  this.roll = ({ rotation, force }) => {
    return new Promise((resolve) => {
      numberOfDiceRolling++;
      this.body.allowSleep = true;
      this.body.position = new CANNON.Vec3(5, 0, 0);

      this.body.velocity.setZero();
      this.body.angularVelocity.setZero();

      this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      this.body.quaternion.copy(this.mesh.quaternion);

      this.body.applyImpulse(new CANNON.Vec3(-force, force, 0));
      // this.body.addEventListener('sleep', () => printTopFaceOfDice(resolve));

      const onSleep = () => {
        this.body.removeEventListener('sleep', onSleep);
        const faceValue = getFaceValue();
        resolve(faceValue);
      }
      this.body.addEventListener('sleep', onSleep);
    });
  };
}

export function TenSidedDice() {
  const calculateTopFace = (euler) => {
    const eps = 0.15;

    let isZero = (angle) => Math.abs(angle) < eps;
    let isPiOverFive = (angle) => Math.abs(angle - Math.PI / 5) < eps;
    let isMinusPiOverFive = (angle) => Math.abs(Math.PI / 5 + angle) < eps;
    let isPiOverTen = (angle) => Math.abs(angle - Math.PI / 10) < eps;
    let isMinusPiOverTen = (angle) => Math.abs(Math.PI / 10 + angle) < eps;
    let isThreePiOverTen = (angle) => Math.abs(angle - 3 * Math.PI / 10) < eps;
    let isMinusThreePiOverTen = (angle) => Math.abs(3 * Math.PI / 10 + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

    if (isMinusThreePiOverTen(euler.z)) {
      if (isZero(euler.x)) {
        return 1;
      }
    }
    if (isThreePiOverTen(euler.z)) {
      if (isPiOrMinusPi(euler.x)) {
        return 8;
      }
    }
    if (isPiOverFive(euler.z)) {
      if (euler.x < 0) {
        return 3;
      }
      if (euler.x > 0) {
        return 5;
      }
    }
    if (isMinusPiOverFive(euler.z)) {
      if (euler.x < 0) {
        return 4;
      }
      if (euler.x > 0) {
        return 6;
      }
    }
    if (isPiOverTen(euler.z)) {
      if (euler.x > 0) {
        return 2;
      }
      if (euler.x < 0) {
        return 10;
      }
    }
    if (isMinusPiOverTen(euler.z)) {
      if (euler.x < 0) {
        return 7;
      }
      if (euler.x > 0) {
        return 9;
      }
    }

    return null;
  };

  const getFaceValue = () => {
    this.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    this.body.quaternion.toEuler(euler);

    const faceValue = calculateTopFace(euler);
    if (faceValue == null) {
      this.body.allowSleep = true;
      return;
    }

    return faceValue;
  };

  this.mesh = null;
  this.body = null;
  this.load = (playerCollisionGroup) =>
    new Promise((resolve) => {
      const initializeMeshAndBody = () => {
        window.removeEventListener(
          'loadedTenSidedDiceMesh',
          initializeMeshAndBody
        );

        this.mesh = tenSidedDiceMesh.clone();
        this.mesh.traverse((node) => {
          if (node.isMesh) {
            node.material = node.material.clone();
          }
        });

        const vertices = [
          new CANNON.Vec3(0, 1, 0),
          new CANNON.Vec3(0, -1, 0),
        ];

        for (let i = 0; i < 10; ++i) {
          const b = (i * Math.PI * 2) / 10;
          vertices.push(new CANNON.Vec3(
            -Math.cos(b),
            0.105 * (i % 2 ? 1 : -1),
            -Math.sin(b),
          ));
        }
        const faces = [
          [3, 2, 0],
          [4, 3, 0],
          [5, 4, 0],
          [6, 5, 0],
          [7, 6, 0],
          [8, 7, 0],
          [9, 8, 0],
          [10, 9, 0],
          [11, 10, 0],
          [2, 11, 0],
          [2, 3, 1],
          [3, 4, 1],
          [4, 5, 1],
          [5, 6, 1],
          [6, 7, 1],
          [7, 8, 1],
          [8, 9, 1],
          [9, 10, 1],
          [10, 11, 1],
          [11, 2, 1],
        ];

        const shape = new CANNON.ConvexPolyhedron({
          vertices,
          faces,
        });

        this.body = new CANNON.Body({
          mass: 1, 
          shape,
          sleepTimeLimit: 0.1,
          collisionFilterGroup: playerCollisionGroup,
          collisionFilterMask: 1 /* floor & walls */ | playerCollisionGroup,
        });
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);

        resolve();
      };

      if (tenSidedDiceMesh != null) {
        initializeMeshAndBody();
      } else {
        window.addEventListener('loadedTenSidedDiceMesh', initializeMeshAndBody);
      }
    });
  this.roll = ({ rotation, force }) => {
    return new Promise((resolve) => {
      numberOfDiceRolling++;
      this.body.allowSleep = true;
      this.body.position = new CANNON.Vec3(0, 0, -5);

      this.body.velocity.setZero();
      this.body.angularVelocity.setZero();

      this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      this.body.quaternion.copy(this.mesh.quaternion);

      this.body.applyImpulse(new CANNON.Vec3(0, -force, 0));

      const onSleep = () => {
        const faceValue = getFaceValue();
        resolve(faceValue);
      }
      this.body.removeEventListener('sleep', onSleep);
      this.body.addEventListener('sleep', onSleep);
    });
  };
}
