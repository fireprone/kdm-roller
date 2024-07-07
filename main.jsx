import React from 'react';
import { createRoot } from 'react-dom/client';
import ThreeJsCanvas from './components/ThreeJsCanvas';
import Players from './components/Players';

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById('app'));
root.render(
  <div>
    <Players />
    <ThreeJsCanvas title={'test'} />
  </div>
);
