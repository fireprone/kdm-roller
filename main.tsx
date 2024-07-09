import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ThreeJsCanvas from './components/ThreeJsCanvas';
import Players from './components/Players';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const scene = new THREE.Scene();
const world = new CANNON.World({
  allowSleep: true,
  gravity: new CANNON.Vec3(0, 0, -50),
});
world.defaultContactMaterial.restitution = 0.5;

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [playerList, setPlayerList] = useState([]);

  return (
    <>
      <Players {...{ playerList }} />
      <ThreeJsCanvas {...{ scene, world, playerList, setPlayerList }} />
    </>
  );
};

root.render(<App />);
