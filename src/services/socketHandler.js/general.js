export function joinRoom(socket, roomId){
    if(!socket) throw new Error('Socket is not connected');
    socket.emit('socket:join:room', roomId);
}

export function leaveRoom(socket, roomId){
    if(!socket) throw new Error('Socket is not connected');
    console.log('asdasdasd');
    socket.emit('socket:leave:room', roomId);
}