import { useSocketContext } from "@/contexts/SocketContext";
import { useEffect } from "react";

export default function useSocket(eventName, callback){
    const { socket } = useSocketContext();
    console.log('render');
    useEffect(() => {
        console.log('asasasaasas');
        if (!socket || !eventName || typeof callback !== "function") {
            if (process.env.NODE_ENV === "development") {
                console.error(`Invalid socket parameters: `);
                console.log('socket', socket);
                console.log('eventName', eventName);
                console.log('callback', callback);
            }
            return;
        }
        if (process.env.NODE_ENV === "development") {
            console.log(`Socket listening: ${eventName}`);
        }
        socket.on(eventName, callback);
        return () => {
            if(socket){
                socket.off(eventName, callback);
            }
        }
    }, [socket, eventName, callback]);

}