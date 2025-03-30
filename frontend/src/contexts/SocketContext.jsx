import React, { createContext, useEffect, useRef, useContext, useState } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext";

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
    const socket = useRef(null);
    
    return (
        <SocketContext.Provider value={{socket}}>
            { children }
        </SocketContext.Provider>
    )
}

export default SocketContext; 