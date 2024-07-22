import datos from './result.json';
import {SHIP_HEIGHT, SHIP_WIDTH} from "./constants";

function encontrarGrupoJugador(player) {
    if (player.x === undefined || player.y === undefined) {
        console.error("El jugador debe tener coordenadas x e y definidas");
        return null;
    }
    const absPlayerX = player.x + SHIP_WIDTH / 2;
    const absPlayerY = player.y + SHIP_HEIGHT / 2 + 20;

    const x = Math.floor(player.x);
    const y = Math.floor(player.y);

    for (const item of datos) {
        if (item.llave === absPlayerY) {
            const contenido = item.contenido;
            if (contenido.includes(absPlayerX)) {
                return item.grupo;
            }
        }
    }

    return null;
}

export default function obtenerGrupoJugador(player) {
    const grupo = encontrarGrupoJugador(player);
    if (grupo !== null) {
        console.log(`El jugador está en el grupo ${grupo}`);
        return grupo;
    } else {
        console.log("El jugador no está en ningún grupo definido");
        return null;
    }
}