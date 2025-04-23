import * as CANNON from 'cannon-es';

const World = (() => {
    let world;

    const initialize = () => {
        world = new CANNON.World({
            allowSleep: true,
            gravity: new CANNON.Vec3(0, -50, 0),
        });
        world.defaultContactMaterial.restitution = 0.5;
    }

    const get = () => {
        return world;
    }

    return { initialize, get }
})();

export default World;