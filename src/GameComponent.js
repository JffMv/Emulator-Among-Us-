// src/GameComponent.js
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import shipImg from './assets/ship.png';
import playerSprite from './assets/player.png';
import React from 'react';

import {
    PLAYER_SPRITE_HEIGHT,
    PLAYER_SPRITE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_START_X,
    PLAYER_START_Y,
} from './constants';
import { movePlayer } from './movement';
import { animateMovement } from './animation';

let globalProps = {};
const player = {};
let socket;
let pressedKeys = [];

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        socket = io('localhost:3000');
        this.load.image('ship', shipImg);
        this.load.spritesheet('player', playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
    }

    create() {
        const ship = this.add.image(0, 0, 'ship');
        player.sprite = this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player');
        player.sprite.displayHeight = PLAYER_HEIGHT;
        player.sprite.displayWidth = PLAYER_WIDTH;

        player.nameText = this.add.text(PLAYER_START_X, PLAYER_START_Y - 30, globalProps.playerName, {
            fontFamily: 'MiFuente',
            fontSize: '30px',
            fill: '#000000'
        });

        player.nameText.setOrigin(0.5,0.5);
        player.nameText.setDepth(1);


        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 24,
            reapeat: -1,
        });

        this.input.keyboard.on('keydown', (e) => {
            if (!pressedKeys.includes(e.code)) {
                pressedKeys.push(e.code);
            }
        });
        this.input.keyboard.on('keyup', (e) => {
            pressedKeys = pressedKeys.filter((key) => key !== e.code);
        });
        this.update = this.update.bind(this);

    }

    update() {
        this.scene.scene.cameras.main.centerOn(player.sprite.x, player.sprite.y);
        const playerMoved = movePlayer(pressedKeys, player.sprite);
        if (playerMoved) {
            socket.emit('move', { x: player.sprite.x, y: player.sprite.y });
            player.movedLastFrame = true;
        } else {
            if (player.movedLastFrame) {
                socket.emit('moveEnd');
            }
            player.movedLastFrame = false;
        }
        animateMovement(pressedKeys, player.sprite);
        player.nameText.setPosition(player.sprite.x, player.sprite.y - 30);

    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 400,
    height: 350,
    scene: MyGame,
};

class GameComponent extends React.Component {
    componentDidMount() {
        globalProps = this.props;
        new Phaser.Game(config);
    }
    render() {
        return <div id="phaser-example"></div>;
    }

}

export default GameComponent;
