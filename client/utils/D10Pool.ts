import { TenSidedDice } from '../dice';
import { MAX_DICE } from './Constants';

const D10Pool = (() => {
    const pool = [];

    const initialize = async (scene) => {
      for (var i = 0; i < MAX_DICE; i++) {
        const dice = new TenSidedDice(); 

        await dice.load(2);

        dice.mesh.visible = false;

        scene.add(dice.mesh);
        pool.push(dice);
      }
    };

    const get = () => {
        return pool;
    }

    return { initialize, get };
})();

export default D10Pool;