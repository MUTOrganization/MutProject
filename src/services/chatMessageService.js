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

async function downloadFile(fileName, downloadName){
    if(!fileName) throw new Error('File name is required')
    const response = await api.get('chatMessages/downloadFile/' + fileName, {
        responseType: 'blob'
    })
    const blob = await response.data;
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = downloadName ?? fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export default {
    getChatMessages,
    downloadFile
}