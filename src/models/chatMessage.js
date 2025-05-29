import User from "./user";

export class ChatMessage {
    constructor(data) {
        /** @type {Number} */
        this.id = data.userMessageId ?? data.systemMessageId;
        /** @type {Number} */
        this.roomId = data.roomId
        /** @type {User} */
        this.sender = data.sender
        this.text = data.text
        /** @type {MessageFile[]} */
        this.files = data.files
        /** @type {'join' | 'leave' | 'invite'} */
        this.type = data.type
        /** @type {Boolean} */
        this.isSystemMessage = data.systemMessageId ? true : false
        /** @type {Date} */
        this.createdDate = data.createdDate ? new Date(data.createdDate) : null
        /** @type {Date} */
        this.updatedDate = data.updatedDate ? new Date(data.updatedDate) : null
    }
}

class MessageFile {
    constructor(data) {
        /** @type {String} */
        this.fileName = data.file_name
        /** @type {String} */
        this.fileType = data.file_type
        /** @type {String} */
        this.fileUrl = data.file_url
        /** @type {Number} */
        this.fileSizeBytes = data.file_size_bytes
    }
}