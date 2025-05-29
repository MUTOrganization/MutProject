import Agent from "./agent";
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
        /** @type {number} */
        this.agentId = data.agentId;
        /** @type {Agent} */
        this.agent = data.agent;
        /** @type {Array<User>} */
        this.roomMembers = data.roomMembers;
    }

}