import { toastError } from "@/component/Alert";
import { useAppContext } from "@/contexts/AppContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { ChatRoom } from "@/models/chatRoom";
import User from "@/models/user";
import { joinRoom, leaveRoom } from "@/services/socketHandler.js/general";
import userService from "@/services/userService";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { getRoomName } from "./utils";
import { RoomInvite } from "@/models/roomInvite";
import chatroomService from "@/services/chatroomService";

const ChatContext = createContext({
    /** @type {Array<ChatRoom>} */
    chatRooms: [],
    setChatRooms: () => {},
    isChatRoomsLoading: false,
    fetchChatRooms: () => {},
    /** @type {(room: ChatRoom) => void} */
    insertChatRoom: () => {},
    /** @type {Array<User>} */
    userList: [],
    isUserListLoading: false,
    /** @type {Map<String, User>} */
    userMap: new Map(),
    /** @type {ChatRoom} */
    currentChatRoom: null,
    setCurrentChatRoom: () => {},
    /** @type {{[key: string]: Date}} */
    chatRoomLastReads: {},
    setChatRoomLastReads: () => {},
    /** @type {{[key: string]: boolean}} */
    roomsReadStatus: {},
    /** @type {RoomInvite[]} */
    roomInvites: [],
    setRoomInvites: () => {},
    isRoomInvitesLoading: false,
})


export default function ChatContextProvider({ children }) {
    const { currentUser } = useAppContext() // ข้อมูลผู้ใช้งานปัจจุบัน
    const { socket } = useSocketContext() // socketInstance
    /** @type {[ChatRoom[]]} */
    const [chatRooms, setChatRooms] = useState([]); // รายการห้องแชท
    const [isChatRoomsLoading, setIsChatRoomsLoading] = useState(false); // สถานะการดึงข้อมูลห้องแชท
    
    /** @type {[User[]]} */
    const [userList, setUserList] = useState([]) // รายการผู้ใช้งาน
    const userMap = useMemo(() => { // ค่าที่เป็น Map ของผู้ใช้งาน
        return new Map(userList.map(user => [user.username, user]))
    },[userList])
    const [isUserListLoading, setIsUserListLoading] = useState(false) // สถานะการดึงข้อมูลผู้ใช้งาน

    /** @type {[RoomInvite[]]} */
    const [roomInvites, setRoomInvites] = useState([])
    const [isRoomInvitesLoading, setIsRoomInvitesLoading] = useState(false) // สถานะการดึงข้อมูลการเชิญเข้าร่วมห้องแชท

    /** @type {[ChatRoom]} */
    const [currentChatRoom, setCurrentChatRoom] = useState(null) // ห้องแชทปัจจุบัน

    const [chatRoomLastReads, setChatRoomLastReads] = useState(() => { // ข้อมูลการอ่านข้อความของห้องแชท
        const _chatRoomLastReadsRaw = localStorage.getItem(`chatRoom-last-read-time`)
        const _chatRoomLastReads = _chatRoomLastReadsRaw ? JSON.parse(_chatRoomLastReadsRaw) : {}
        Object.keys(_chatRoomLastReads).forEach(key => {
            _chatRoomLastReads[key] = new Date(_chatRoomLastReads[key])
        })
        return _chatRoomLastReads
    });

    const roomsReadStatus = useMemo(() => {
        const _roomsReadStatus = {};
        chatRooms.forEach(room => {
            const lastReadTime = chatRoomLastReads[room.chatRoomId];
            const lastMessage = room.lastMessage;
            if(!lastMessage) return;

            const lastMessageDate = new Date(lastMessage.createdDate);
            if(!lastReadTime || lastMessageDate > lastReadTime){
                _roomsReadStatus[room.chatRoomId] = true;
            }
        })
        return _roomsReadStatus
    }, [chatRooms, chatRoomLastReads])
    

    function fetchUserList(){
        setIsUserListLoading(true)
        userService.getAllUser(currentUser.agent.agentId).then((data) => {
            setUserList(data)
        }).catch((err) => {
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้')
        }).finally(() => {
            setIsUserListLoading(false)
        })
    }

    async function fetchChatRooms(){
        try{
            setIsChatRoomsLoading(true)
            const data = await chatroomService.getChatRoomsMe();
            const data2 = data.map(room => ({
                ...room,
                name: room.isPrivate ? room.roomMembers.find(member => member.username !== currentUser.username).name : room.name
            }))
            setChatRooms(data2);
            data2.forEach(room => {
                joinRoom(socket, getRoomName.chatroom(room.chatRoomId))
            })
            return data2
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลห้องแชทได้')
        }finally{
            setIsChatRoomsLoading(false)
        }
    }

    function insertChatRoom(room){
        const newRoom = new ChatRoom(room)
        if(newRoom.isPrivate){
            newRoom.name = newRoom.roomMembers.find(member => member.username !== currentUser.username).name
        }
        setChatRooms(prev => [newRoom, ...prev])
        joinRoom(socket, getRoomName.chatroom(newRoom.chatRoomId))
    }

    async function fetchRoomInvites(){
        try{
            setIsRoomInvitesLoading(true)
            const data = await chatroomService.getRoomInvitesMe();
            setRoomInvites(data)
        }catch(err){
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการเชิญเข้าร่วมห้องแชทได้')
        }finally{
            setIsRoomInvitesLoading(false)
        }
    }

    useEffect(() => {
        if(!socket) return;
        joinRoom(socket, getRoomName.user(currentUser.username))
        
        fetchUserList();
        fetchChatRooms();
        fetchRoomInvites();
        return () => {
            leaveRoom(socket, getRoomName.user(currentUser.username))
            chatRooms.forEach(room => {
                leaveRoom(socket, getRoomName.chatroom(room.chatRoomId))
            })
        }
    }, [currentUser, socket])

    const value = {
        chatRooms,
        setChatRooms,
        setIsChatRoomsLoading,
        isChatRoomsLoading,
        fetchChatRooms,
        insertChatRoom,
        userList,
        isUserListLoading,
        userMap,
        currentChatRoom,
        setCurrentChatRoom,
        chatRoomLastReads,
        setChatRoomLastReads,
        roomsReadStatus,
        roomInvites,
        setRoomInvites,
        isRoomInvitesLoading,
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export function useChatContext(){
    const context = useContext(ChatContext)
    if(!context) throw new Error('useChatContext must be used within a ChatContextProvider')
    return context
}
