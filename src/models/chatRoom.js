import Agent from "./agent";
import { ChatMessage } from "./chatMessage";
import User from "./user";

export class ChatRoom {
    constructor(data) {
        /** @type {number} */
        this.chatRoomId = data.chatRoomId;
        /** @type {string} */
        this.name = data.name;
        /** @type {string} */
        this.description = data.description;
        /** @type {string} */
        this.imageUrl = data.imageUrl;
        /** @type {boolean} */
        this.isPrivate = data.isPrivate;
        /** @type {boolean} */
        this.status = data.status;
        /** @type {Date} */
        this.createdDate = data.createdDate;
        /** @type {Date} */
        this.updatedDate = data.updatedDate;
        /** @type {number} */
        this.agentId = data.agentId;
        /** @type {Agent} */
        this.agent = data.agent;
        /** @type {Array<User>} */
        this.roomMembers = data.roomMembers;
        /** @type {ChatMessage} */
        this.lastMessage = data.lastMessage ? ChatMessage.fromUserMessage(data.lastMessage) : null;
    }

}