// src/WebSocketContext.js
import React, { createContext, useEffect, useRef, useState } from 'react';
export function WShostURL() {
    var host = window.location.hostname;
    var url = 'ws://' + host + ':8080/play';
    console.log("WebSocket host URL Calculada: " + url);
    return url;
  }
  
export function RESThostURL() {
    var host = window.location.hostname;
    var protocol = window.location.protocol;
    var url = protocol + '//' + host + ':8080';
    console.log("REST host URL Calculada: " + url);
    return url;
  }


export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [players, setPlayers] = useState({});
    const [serverResponse, setServerResponse] = useState(null);

    

    useEffect(() => {
        const ws = new WebSocket(WShostURL());

        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
                    if (data.type === "TASK_AVAILABLE") {
                        // Si es una respuesta relacionada con tareas, actualizamos serverResponse
                        setServerResponse(data);
                        // console.log('Received task response:', data);
                    } else {
                        // Si es una actualización de jugadores, actualizamos players
                        setPlayers(data);
                        console.log('Received player update:', data);
                    }
                } else {
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
        <WebSocketContext.Provider value={{ players, serverResponse, sendAction }}>
            {children}
        </WebSocketContext.Provider>
    );
};