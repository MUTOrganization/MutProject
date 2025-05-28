import { connectSocket, disconnectSocket } from "@/utils/socket";
import { createContext, useContext, useEffect, useState } from "react";


const SocketContext = createContext({
    /** @type {import('socket.io-client').Socket} */
    socket: null,
});

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = connectSocket();  
        setSocket(socketInstance);

        return () => {
            disconnectSocket();
        }
    }, []);

    return(
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
    
    
}

export const useSocketContext = () => useContext(SocketContext);
