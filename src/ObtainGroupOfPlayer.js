import datos from './result.json';
import {SHIP_HEIGHT, SHIP_WIDTH} from "./constants";

function findGroupPlayer(player) {
    if (player.x === undefined || player.y === undefined) {
        console.error("The player must have x and y coordinates defined");
        return null;
    }
    const absPlayerX = player.x + SHIP_WIDTH / 2;
    const absPlayerY = player.y + SHIP_HEIGHT / 2 + 20;
    

    for (const item of datos) {
        if (item.llave === absPlayerY) {
            const content = item.contenido;
            if (content.includes(absPlayerX)) {
                return item.grupo;
            }
        }
    }

    return null;
}

export default function obtainGroupOfPlayer(player) {
    const group = findGroupPlayer(player);
    if (group !== null) {
        console.log(`The player is in the group ${group}`);
        return group;
    } else {
        console.log("The player is NOT group defined");
        return null;
    }
}