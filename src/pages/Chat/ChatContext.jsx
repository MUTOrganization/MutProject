import { toastError } from "@/component/Alert";
import { useAppContext } from "@/contexts/AppContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { ChatRoom } from "@/models/chatRoom";
import User from "@/models/user";
import chatService from "@/services/chatroomService";
import { joinRoom, leaveRoom } from "@/services/socketHandler.js/general";
import userService from "@/services/userService";
import { useState, useEffect, createContext, useContext } from "react";

const ChatContext = createContext({
    /** @type {Array<ChatRoom>} */
    chatRooms: [],
    isChatRoomsLoading: false,
    /** @type {Array<User>} */
    userList: [],
    isUserListLoading: false,
    /** @type {ChatRoom} */
    currentChatRoom: null,
    setCurrentChatRoom: () => {},
})

export default function ChatContextProvider({ children }) {
    const { currentUser } = useAppContext()
    const { socket } = useSocketContext()
    /** @type {Array<ChatRoom>} */
    const [chatRooms, setChatRooms] = useState([]);
    const [isChatRoomsLoading, setIsChatRoomsLoading] = useState(false);
    /** @type {Array<User>} */
    const [userList, setUserList] = useState([])
    const [isUserListLoading, setIsUserListLoading] = useState(false)

    /** @type {[ChatRoom]} */
    const [currentChatRoom, setCurrentChatRoom] = useState(null)

    function fetchUserList(){
        setIsUserListLoading(true)
        userService.getAllUser(currentUser.agent.agentId).then((data) => {
            setUserList(data.filter(user => user.username !== currentUser.username))
        }).catch((err) => {
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้งานได้')
        }).finally(() => {
            setIsUserListLoading(false)
        })
    }

    function fetchChatRooms(){
        setIsChatRoomsLoading(true)
        chatService.getChatRooms().then((data) => {
            setChatRooms(data)
            data.forEach(room => {
                joinRoom(socket, `chatRoomId-${room.chatRoomId}`)
            })
        }).catch((err) => {
            console.error(err)
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลห้องแชทได้')
        })
        .finally(() => setIsChatRoomsLoading(false))
        
    }

    useEffect(() => {
        if(!socket) return;
        fetchUserList();
        fetchChatRooms();

        return () => {
            chatRooms.forEach(room => {
                leaveRoom(socket, `chatRoomId-${room.chatRoomId}`)
            })
        }
    }, [currentUser, socket])

    const value = {
        chatRooms,
        setIsChatRoomsLoading,
        isChatRoomsLoading,
        userList,
        isUserListLoading,
        currentChatRoom,
        setCurrentChatRoom,
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
