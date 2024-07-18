// src/GameComponent.js
import Phaser from 'phaser';
import React, { useContext, useEffect, useRef } from 'react';
import { WebSocketContext } from './WebSocketContext';
import shipImg from './assets/ship.png';
import playerSprite from './assets/player.png';

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
import {movementOtherPlayers} from "./movementOtherPlayers";


const GameComponent = ({ playerName, playerId }) => {
    const gameRef = useRef(null);
    const { players, sendAction } = useContext(WebSocketContext);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-example',
            width: 400,
            height: 350,
            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };
        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (gameRef.current && gameRef.current.scene.scenes[0]) {
            gameRef.current.scene.scenes[0].players = players;
        }
    }, [players]);

    function preload() {
        this.load.image('ship', shipImg);
        this.load.spritesheet('player', playerSprite, {
            frameWidth: PLAYER_SPRITE_WIDTH,
            frameHeight: PLAYER_SPRITE_HEIGHT,
        });
    }

    function create() {
        const ship = this.add.image(0, 0, 'ship');
        this.player = {
            sprite: this.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player'),
            nameText: this.add.text(PLAYER_START_X, PLAYER_START_Y - 30, playerName, {
                fontFamily: 'MiFuente',
                fontSize: '20px',
                fill: '#ffffff'
            })
        };
        this.player.sprite.displayHeight = PLAYER_HEIGHT;
        this.player.sprite.displayWidth = PLAYER_WIDTH;
        this.player.nameText.setOrigin(0.5, 0.5);
        this.player.nameText.setDepth(1);

        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 24,
            repeat: -1,
        });

        this.pressedKeys = [];
        this.input.keyboard.on('keydown', (e) => {
            if (!this.pressedKeys.includes(e.code)) {
                this.pressedKeys.push(e.code);
            }
        });
        this.input.keyboard.on('keyup', (e) => {
            this.pressedKeys = this.pressedKeys.filter((key) => key !== e.code);
        });

        this.otherPlayers = {};
        this.players = players;
    }

    function update() {
        this.cameras.main.centerOn(this.player.sprite.x, this.player.sprite.y);
        const playerMoved = movePlayer(this.pressedKeys, this.player.sprite);
        if (playerMoved) {
            console.log('Player moved:', {
                id: playerId,
                name: playerName,
                x: this.player.sprite.x,
                y: this.player.sprite.y,
                key: this.pressedKeys[0]
            });
            sendAction({
                id: playerId,
                name: playerName,
                x: this.player.sprite.x,
                y: this.player.sprite.y,
                key: this.pressedKeys[0]
            });
            this.player.movedLastFrame = true;
        } else {
            if (this.player.movedLastFrame) {
                console.log('Player stopped:', {
                    id: playerId,
                    name: playerName,
                    moveEnd: true
                });
                sendAction({ id: playerId, name: playerName, moveEnd: true });
            }
            this.player.movedLastFrame = false;
        }
        animateMovement(this.pressedKeys, this.player.sprite);
        this.player.nameText.setPosition(this.player.sprite.x, this.player.sprite.y - 30);


        // Crear un conjunto de IDs de jugadores activos
        const activePlayerIds = new Set(Object.keys(this.players));


        // Actualizar otros jugadores
        Object.entries(this.players).forEach(([id, playerData]) => {

            if (playerData.playerId !== playerId) {
                if (!this.otherPlayers[id]) {
                    console.log(playerData, ' holaaaaaaa el id de otherplayer is ', this.otherPlayers[id])

                    const newPlayer = {
                        sprite: this.add.sprite(playerData.x, playerData.y, 'player'),
                        nameText: this.add.text(playerData.x, playerData.y - 30, playerData.name, {
                            fontFamily: 'Arial',
                            fontSize: '20px',
                            fill: '#ffffff'
                        })
                    };
                    newPlayer.sprite.displayHeight = PLAYER_HEIGHT;
                    newPlayer.sprite.displayWidth = PLAYER_WIDTH;
                    newPlayer.nameText.setOrigin(0.5, 0.5);
                    this.otherPlayers[id] = newPlayer;
                    console.log(newPlayer, "aca estosyyyyyyyyyyyy");

                } else {
                    // Girar el sprite según la dirección
                    if (playerData.key === 'ArrowLeft') {
                        this.otherPlayers[id].sprite.setFlipX(true);
                    } else if (playerData.key === 'ArrowRight') {
                        this.otherPlayers[id].sprite.setFlipX(false);
                    }

                    this.otherPlayers[id].sprite.setPosition(playerData.x, playerData.y);
                    this.otherPlayers[id].nameText.setPosition(playerData.x, playerData.y - 30);

                    // Usar animateMovement para los otros jugadores
                    const playerKeys = playerData.key ? [playerData.key] : [];

                    animateMovement(playerKeys, this.otherPlayers[id].sprite);

                }
            }
        });
        Object.keys(this.otherPlayers).forEach(id => {
            if (!activePlayerIds.has(id)) {
                this.otherPlayers[id].sprite.destroy();
                this.otherPlayers[id].nameText.destroy();
                delete this.otherPlayers[id];
            }
        });
    }

    return <div id="phaser-example"></div>;
};

export default GameComponent;