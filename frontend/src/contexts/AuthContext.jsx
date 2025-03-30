import { createContext, useReducer, useEffect } from "react";

const AuthContext = createContext(null);

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGOUT":
            return {
                user: null
            }

        case "LOGIN":
            return {
                user: action.payload
            }

        default:
            return state;
    }
}

const initialState = {
    user: null
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (user) {
            dispatch({type: "LOGIN", payload: JSON.parse(user)});
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext; 