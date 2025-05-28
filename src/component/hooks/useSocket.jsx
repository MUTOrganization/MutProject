import { useSocketContext } from "@/contexts/SocketContext";
import { useEffect } from "react";

export default function useSocket(event, callback){
    const { socket } = useSocketContext();

    useEffect(() => {
        if (!socket || !event || typeof callback !== "function") {
            if (process.env.NODE_ENV === "development") {
                console.error(`Invalid socket parameters: ${event} ${callback}`);
            }
            return;
        }
        if (process.env.NODE_ENV === "development") {
            console.log(`Socket listening: ${event}`);
        }
        socket.on(event, callback);
        return () => {
            if(socket){
                socket.off(event, callback);
            }
        }
    }, [socket, event, callback]);

}