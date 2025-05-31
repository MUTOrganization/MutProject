import api from "@/configs/api"
import { ChatMessage } from "@/models/chatMessage"

async function getChatMessages(chatRoomId, page = 1, limit = 30){
    const response = await api.get(`chatMessages/getMessages/${chatRoomId}`, {
        params: {
            page,
            limit
        }
    })
    return  response.data.map(e => new ChatMessage(e))
}

export default {
    getChatMessages
}