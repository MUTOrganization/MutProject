import api from "@/configs/api"
import { ChatRoom } from "@/models/chatRoom"

async function getChatRooms(){
    const response = await api.get('chatrooms/getChatRooms/me')
    /** @type {Array<ChatRoom>} */
    const data = response.data.map(e => new ChatRoom(e))
    return data
}

async function getPrivateChatRoom(username1, username2){
    const response = await api.get(`chatrooms/getPrivateChatRoom`, {
        params: {
            username1,
            username2
        }
    })
    return new ChatRoom(response.data)
}

async function createPrivateChatRoom(agentId,username1, username2){
    const response = await api.post(`chatrooms/create`, {
        agentId: agentId,
        isPrivate: true,
        members: [
            {username: username1, isAdmin: false}, 
            {username: username2, isAdmin: false}
        ]
    })
    return new ChatRoom(response.data)
}

export default {
    getChatRooms,
    getPrivateChatRoom
}