import { ChatRoom } from "./chatRoom"
import User from "./user"

export class RoomInvite {
    constructor(data){
        this.roomInviteId = data.roomInviteId
        this.roomId = data.roomId
        /** @type {ChatRoom} */
        this.room = new ChatRoom(data.room)
        /** @type {Boolean} */
        this.isAdmin = data.isAdmin
        /** @type {String} */
        this.inviterUsername = data.inviterUsername
        /** @type {User} */
        this.inviter = data.inviter ? new User(data.inviter) : null
        /** @type {String} */
        this.inviteeUsername = data.inviteeUsername
        /** @type {User} */
        this.invitee = data.invitee ? new User(data.invitee) : null
        /** @type {'pending' | 'accepted' | 'rejected'} */
        this.status = data.status
        /** @type {Date} */
        this.createdDate = new Date(data.createdDate)
        /** @type {Date} */
        this.updatedDate = new Date(data.updatedDate)
    }
    

}