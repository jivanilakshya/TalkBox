import React, { createContext, useReducer } from "react";

const FriendContext = createContext(null);

const friendReducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return {
                friends: [...state.friends, action.payload]
            }

        case "FETCH":
            return {
                friends: action.payload
            }
        
        default:
            return state;
    }
}

const initialState = {
    friends: []
}

export const FriendContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(friendReducer, initialState);

    const { friends } = state;

    return (
        <FriendContext.Provider value={{friends, dispatch}}>
            { children }
        </FriendContext.Provider>
    )
}

export default FriendContext; 