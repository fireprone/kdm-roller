import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let armorDiceMesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x55555 })
);

loader.load('./models/armor-dice.glb', function (gltf) {
  armorDiceMesh = gltf.scene.children[0];
  console.log('loaded');
});

export function ArmorDice() {
  this.mesh = null;
  this.body = null;
  this.load = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('timed');
        if (armorDiceMesh != null) {
          this.mesh = armorDiceMesh;
          this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
            sleepTimeLimit: 0.1,
          });
          this.body.position.copy(this.mesh.position);
          this.body.quaternion.copy(this.mesh.quaternion);
          this.body.addEventListener('sleep', printTopFaceOfDice);

          resolve();
        } else {
          reject('mesh failed to load');
        }
      }, 1000);
    });

  function getTopFaceofDice(euler) {
    const eps = 0.1;
    let isZero = (angle) => Math.abs(angle) < eps;
    let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
    let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
    let isPiOrMinusPi = (angle) =>
      Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

    if (isZero(euler.y)) {
      if (isHalfPi(euler.x)) {
        return 'BODY 1';
      } else if (isMinusHalfPi(euler.x)) {
        return 'BODY 2';
      } else if (isPiOrMinusPi(euler.x)) {
        return 'LEG';
      } else if (isZero(euler.x)) {
        return 'WAIST';
      }
    } else if (isHalfPi(euler.y)) {
      if (isHalfPi(euler.z)) {
        return 'BODY 1';
      } else if (isZero(euler.z)) {
        return 'HEAD';
      }
    } else if (isMinusHalfPi(euler.y)) {
      if (isZero(euler.z)) {
        return 'ARM';
      }
    } else if (isPiOrMinusPi(euler.y)) {
      if (isPiOrMinusPi(euler.x)) {
        return 'WAIST';
      } else if (isMinusHalfPi(euler.x)) {
        return 'BODY 1';
      } else if (isHalfPi(euler.x)) {
        return 'BODY 2';
      } else if (isZero(euler.x)) {
        return 'LEG';
      }
    }

    return null;
  }

  function printTopFaceOfDice() {
    this.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    this.body.quaternion.toEuler(euler);

    const topFace = getTopFaceofDice(euler);
    if (topFace == null) {
      this.body.allowSleep = true;
      return;
    }
    console.log('landed on ' + topFace);
  }
}
