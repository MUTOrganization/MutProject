import User from "./user";

export class ChatMessage {
    constructor(data) {
        /** @type {String} */
        this.id = data.id ? `${data.source}-${data.id}` : data.userMessageId ? `user-${data.userMessageId}` : data.systemMessageId ? `system-${data.systemMessageId}` : null
        /** @type {Number} */
        this.roomId = data.roomId
        /** @type {User} */
        this.sender = data.sender
        /** @type {String} */
        this.senderUsername = data.senderUsername
        /** @type {String} */
        this.text = data.text
        /** @type {MessageFile[]} */
        this.files = data.files
        /** @type {'join' | 'leave' | 'invite'} */
        this.type = data.type
        /** @type {'user' | 'system'} */
        this.source = data.source
        /** @type {Date} */
        this.createdDate = data.createdDate ? new Date(data.createdDate) : null
        /** @type {Date} */
        this.updatedDate = data.updatedDate ? new Date(data.updatedDate) : null
        /** @type {Boolean} */
        this.isPending = data.isPending ?? false
        /** @type {Boolean} */
        this.isFilePending = data.isFilePending ?? false
    }

    static fromUserMessage(data){
        return new ChatMessage({
            id: data.userMessageId,
            roomId: data.roomId,
            sender: data.sender,
            senderUsername: data.senderUsername,
            text: data.text,
            files: data.files,
            type: '',
            createdDate: data.createdDate,
            updatedDate: data.updatedDate,
            source: 'user'
        })
    }

    static fromSystemMessage(data){
        return new ChatMessage({
            id: data.systemMessageId,
            roomId: data.roomId,
            sender: null,
            senderUsername: null,
            text: data.text,
            files: null,
            type: data.type,
            createdDate: data.createdDate,
            updatedDate: data.updatedDate,
            source: 'system'
        })
    }
}

export class MessageFile {
    constructor(data) {
        /** @type {String} */
        this.fileName = data.file_name
        /** @type {String} */
        this.fileType = data.file_type
        /** @type {String} */
        this.fileUrl = data.file_url
        /** @type {Number} */
        this.fileSizeBytes = data.file_size_byte
    }
}