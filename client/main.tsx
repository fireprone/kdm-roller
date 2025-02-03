import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ThreeJsCanvas from './components/ThreeJsCanvas';
import RollHistory from './components/RollHistory';
import Players from './components/Players';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import LoadoutSection from './components/LoadoutSection/LoadoutSection';
import DiceChooser from './components/DiceChooser/DiceChooser';

const scene = new THREE.Scene();
const world = new CANNON.World({
  allowSleep: true,
  gravity: new CANNON.Vec3(0, -50, 0),
});
world.defaultContactMaterial.restitution = 0.5;

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [playerList, setPlayerList] = useState([]);
  const [focusedPlayer, setFocusedPlayer] = useState('');
  const [priorRolls, setPriorRolls] = useState([]);

  return (
    <>
      {/* <Players {...{ playerList, focusedPlayer, setFocusedPlayer }} /> */}
     <LoadoutSection 
     isShowingCardsTray={false}
     isShowingDiceTray={false}
     /> 

      <ThreeJsCanvas
        {...{
          scene,
          world,
          setPlayerList,
          focusedPlayer,
          setFocusedPlayer,
          setPriorRolls,
        }}
      />
      <DiceChooser />
      <RollHistory {...{ priorRolls }} />
    </>
  );
};

root.render(<App />);
