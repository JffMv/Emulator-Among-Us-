// src/WebSocketContext.js
import React, { createContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [players, setPlayers] = useState({});

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/play');

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                // Parseamos el string JSON recibido
                const data = JSON.parse(event.data);

                // Verificamos si el objeto parseado es directamente el objeto de jugadores
                if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
                    // Si es así, actualizamos los jugadores directamente
                    setPlayers(data);
                    console.log('Received player update:', data);
                } else {
                    // Si no, manejamos como un mensaje genérico
                    console.log('Received message:', data);
                }
            } catch (error) {
                console.error('Error processing message:', error);
                console.log('Received non-JSON message:', event.data);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        socketRef.current = ws;

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const sendAction = (action) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending action:', action);
            socketRef.current.send(JSON.stringify(action));
        } else {
            console.error('WebSocket is not open or ready');
        }
    };

    return (
        <WebSocketContext.Provider value={{ players, sendAction }}>
            {children}
        </WebSocketContext.Provider>
    );
};
