import api from "@/configs/api"
import { ChatRoom } from "@/models/chatRoom"
import { RoomInvite } from "@/models/roomInvite"

async function getChatRoomsMe(){
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
    if(response.data === null || response.data === undefined){
        return null
    }
    return new ChatRoom(response.data)
}

async function createPrivateChatRoom(agentId, username1, username2){
    const response = await api.post(`chatrooms/createPrivate`, {
        agentId: agentId,
        member1: username1,
        member2: username2
    })
    return new ChatRoom(response.data)
}

async function createGroupChatRoom(agentId, name, description, file, members){
    const formData = new FormData()
    formData.append('agentId', agentId)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('members', JSON.stringify(members.map(e => ({username: e.username, isAdmin: e.type === 'admin'}))))
    if(file){
        formData.append('file', file)
    }
    const response = await api.post(`chatrooms/createGroup`, formData)
    return new ChatRoom(response.data)
}

async function getRoomInvitesMe(){
    const response = await api.get('chatrooms/invites/me')
    /** @type {RoomInvite[]} */
    const data = response.data.map(e => new RoomInvite(e))
    return data
}

async function acceptRoomInvite(chatroomId){
    const response = await api.post(`chatrooms/invites/accept/${chatroomId}`)
    const data = new ChatRoom(response.data)
    return data
}

async function rejectRoomInvite(chatroomId){
    await api.post(`chatrooms/invites/reject/${chatroomId}`)
}
export default {
    getChatRoomsMe,
    getPrivateChatRoom,
    createPrivateChatRoom,
    createGroupChatRoom,
    getRoomInvitesMe,
    acceptRoomInvite,
    rejectRoomInvite
}