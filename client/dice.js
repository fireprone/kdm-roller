import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
let armorDiceMesh = null;

loader.load('./models/armor-dice.glb', function (gltf) {
  armorDiceMesh = gltf.scene.children[0];
  window.dispatchEvent(new Event('loadedArmorDiceMesh'));
});

export function ArmorDice() {
  const getTopFaceofDice = (euler) => {
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
  };

  const printTopFaceOfDice = () => {
    this.body.allowSleep = false;

    const euler = new CANNON.Vec3();
    this.body.quaternion.toEuler(euler);

    const topFace = getTopFaceofDice(euler);
    if (topFace == null) {
      this.body.allowSleep = true;
      return;
    }
    console.log('landed on ' + topFace);
  };

  this.mesh = null;
  this.body = null;
  this.load = () =>
    new Promise((resolve) => {
      const initializeMeshAndBody = () => {
        window.removeEventListener(
          'loadedArmorDiceMesh',
          initializeMeshAndBody
        );

        this.mesh = armorDiceMesh.clone();
        this.body = new CANNON.Body({
          mass: 1,
          shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
          sleepTimeLimit: 0.1,
        });
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);
        this.body.addEventListener('sleep', printTopFaceOfDice);

        resolve();
      };

      if (armorDiceMesh != null) {
        initializeMeshAndBody();
      } else {
        window.addEventListener('loadedArmorDiceMesh', initializeMeshAndBody);
      }
    });
  this.roll = () => {
    this.body.allowSleep = true;
    this.body.position = new CANNON.Vec3(5, 0, 0);

    this.body.velocity.setZero();
    this.body.angularVelocity.setZero();

    this.mesh.rotation.set(
      2 * Math.PI * Math.random(),
      0,
      2 * Math.PI * Math.random()
    );
    this.body.quaternion.copy(this.mesh.quaternion);

    const force = 3 + 5 * Math.random();
    this.body.applyImpulse(new CANNON.Vec3(-force, force, 0));
  };
}
