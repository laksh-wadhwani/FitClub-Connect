import { createContext, useContext } from "react";

export const BackendContext = createContext();

export const BackendProvider = ({children}) => {
    const backendURL = process.env.BACKEND_URL || "https://fitclub-connect-production.up.railway.app";

    return(
        <BackendContext value={backendURL}>
            {children}
        </BackendContext>
    )
}

export const BackendURL = () => {
    return useContext(BackendContext)
}