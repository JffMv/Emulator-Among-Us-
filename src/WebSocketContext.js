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
                const data = JSON.parse(event.data);
                if (data.type === 'playerUpdate') {
                    setPlayers(data.players);
                    console.log('Received player update:', data.players);
                } else {
                    console.log('Received message:', data);
                }
            } catch (error) {
                // El mensaje no es JSON, manejarlo como texto plano
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
