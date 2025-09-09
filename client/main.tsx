import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ThreeJsCanvas from './components/ThreeJsCanvas';
import RollHistory from './components/RollHistory';
// import Players from './components/Players';
import * as THREE from 'three';
// import * as CANNON from 'cannon-es';
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
  const [isCraftMode, setIsCraftMode] = useState(false);

  useEffect(() => {
    if (isCraftMode) {
      document.body.style.backgroundColor = '#320';
    } else {
      document.body.style.backgroundColor = '#222';
    }
  }, [isCraftMode]);

  return (
    <>
      {/* <Players {...{ playerList, focusedPlayer, setFocusedPlayer }} /> */}
      <LoadoutSection 
        isShowingCardsTray={false}
        isShowingDiceTray={false}
        isCraftMode={isCraftMode}
        setIsCraftMode={setIsCraftMode}
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
