import React, { createContext, useState } from "react";

const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
    const [chat, setChat] = useState(null);
    const [render, setRender] = useState(true);

    const chatDiv = React.useRef(null);

    const showChat = () => {
        setRender(false);
    }

    const hideChat = () => {
        setRender(true);
    }

    return (
        <ChatContext.Provider value={{ chat, setChat, chatDiv, render, showChat, hideChat }}>
            { children }
        </ChatContext.Provider>
    )
}

export default ChatContext; 