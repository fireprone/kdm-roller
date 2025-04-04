import { ArmorDice } from '../dice';
import { MAX_DICE } from './Constants';

const ArmorDicePool = (() => {
    const pool = [];

    const initialize = async (scene) => {
      for (var i = 0; i < MAX_DICE; i++) {
        const dice = new ArmorDice(); 

        await dice.load(1);

        dice.mesh.visible = false;

        scene.add(dice.mesh);
        pool.push(dice);
      }
    };

    const get = () => {
        return pool;
    }

    const hideAll = () => {
        pool.forEach((dice: { mesh, body }) => {
            dice.mesh.visible = false;
        });
    }

    return { 
        initialize, 
        get,
        hideAll
    };
})();

export default ArmorDicePool;