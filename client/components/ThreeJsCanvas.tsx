import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Socket from '../utils/Socket';
import D10Pool from '../utils/D10Pool';
import ArmorDicePool from '../utils/ArmorDicePool';
import World from '../utils/World';

const ThreeJsCanvas = ({
  scene,
  // setPlayerList,
  focusedPlayer,
  // setFocusedPlayer,
  setPriorRolls,
}) => {
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

  function initialize() {
    ArmorDicePool.initialize(scene);    
    
    D10Pool.initialize(scene);

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

    const selfUsername = 'User#' + Math.floor(Math.random() * 100);

    Socket.initialize(selfUsername, setPriorRolls);

    function render() {
      World.get().fixedStep();

      ArmorDicePool.get().forEach((dice: { mesh, body }) => {
        if (dice.mesh) {
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
        }
      });

      D10Pool.get().forEach((dice: { mesh, body }) => {
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
      World.get().addBody(floorBody);
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
      World.get().addBody(wallBody);
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
