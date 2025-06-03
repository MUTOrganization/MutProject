import api from "@/configs/api"
import { ChatMessage } from "@/models/chatMessage"

async function getChatMessages(chatRoomId, page = 1, limit = 30){
    const response = await api.get(`chatMessages/getMessages/${chatRoomId}`, {
        params: {
            page,
            limit
        }
    })
    /** @type {ChatMessage[]} */
    const data = response.data.data.map(e => new ChatMessage(e))
    return {
        data,
        pagination: {
            total: response.data.pagination.total,
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            count: response.data.pagination.count
        }
    }
}

export default {
    getChatMessages
}