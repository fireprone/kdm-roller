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
import { CraftContext } from './utils/CraftContext';

const scene = new THREE.Scene();
World.initialize();

const root = createRoot(document.getElementById('app'));

const App = () => {
  const [playerList, setPlayerList] = useState([]);
  const [focusedPlayer, setFocusedPlayer] = useState('');
  const [priorRolls, setPriorRolls] = useState([]);

  const [isCraftMode, setIsCraftMode] = useState(false);
  const [resourcesList, setResourcesList] = useState([
    null, null, null, null, null, null, null, null, null,
  ]);

  useEffect(() => {
    if (isCraftMode) {
      document.body.style.backgroundColor = '#320';
    } else {
      document.body.style.backgroundColor = '#222';
    }
  }, [isCraftMode]);

  return (
      <CraftContext.Provider value={{ isCraftMode, setIsCraftMode, resourcesList, setResourcesList }}>
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
      </CraftContext.Provider>
  );
};

root.render(<App />);
