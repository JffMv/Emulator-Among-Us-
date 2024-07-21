import { PLAYER_SPEED, SHIP_HEIGHT, SHIP_WIDTH } from './constants';
import { mapTask } from './mapTask';

const isWithinMovementTasks = (x, y) => {
    return !mapTask[y] ? true : !mapTask[y].includes(x);
};

export const playerTask = (player) => {
    let playerTask = false;
    const absPlayerX = player.x + SHIP_WIDTH / 2;
    const absPlayerY = player.y + SHIP_HEIGHT / 2 + 20;
    if (
        isWithinMovementTasks(absPlayerX, absPlayerY - PLAYER_SPEED) || isWithinMovementTasks(absPlayerX, absPlayerY + PLAYER_SPEED)
        || isWithinMovementTasks(absPlayerX - PLAYER_SPEED, absPlayerY) || isWithinMovementTasks(absPlayerX + PLAYER_SPEED, absPlayerY)
    ) {
        playerTask = true;
    }
    return playerTask;
};
