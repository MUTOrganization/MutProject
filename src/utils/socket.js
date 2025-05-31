import { SOCKET_URL } from "@/config";
import { io } from "socket.io-client";

let socket;

export function connectSocket() {
    socket = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
    });
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
    }
}

export function getSocket() {
    return socket;
}
