import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ThreeJsCanvas from './components/ThreeJsCanvas';
import RollHistory from './components/RollHistory';
import Players from './components/Players';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import LoadoutSection from './components/LoadoutSection/LoadoutSection';
import DiceChooser from './components/DiceChooser/DiceChooser';
import World from './utils/World';

const scene = new THREE.Scene();
World.initialize();

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
