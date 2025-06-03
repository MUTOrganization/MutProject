import { Avatar, Button, Spinner } from "@heroui/react";
import { useChatContext } from "../../ChatContext";
import { ChevronsRight } from "lucide-react";
import { useMemo } from "react";
import { useAppContext } from "@/contexts/AppContext";
import UserProfileAvatar from "@/component/UserProfileAvatar";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import RoomInviteItem from "../ChatList/RoomInviteItem";
import chatroomService from "@/services/chatroomService";

export default function ChatHistoryTab({ onSelectChatRoom, searchText, onAcceptInvite, onRejectInvite }){
    const { currentUser } = useAppContext();
    const { chatRooms, isChatRoomsLoading, currentChatRoom, roomsReadStatus, roomInvites } = useChatContext();

    

    const filterdChatRooms = useMemo(() => {
        const sortedChatRooms = [...chatRooms].sort((a, b) => {
            const aLastDate = a.lastMessage?.createdDate ?? a.createdDate;
            const bLastDate = b.lastMessage?.createdDate ?? b.createdDate;
            if(!aLastDate && !bLastDate) return 0;
            if(!aLastDate) return 1;
            if(!bLastDate) return -1;
            return new Date(bLastDate) - new Date(aLastDate);
        })
        return sortedChatRooms
    }, [chatRooms])

    const displayChatRooms = useMemo(() => {
        if(searchText === '') return filterdChatRooms
        const fuse = new Fuse(filterdChatRooms, {
            keys: ['name'],
            threshold: 0.3,
        })
        const result = fuse.search(searchText)
        return result.map((item) => item.item)
    }, [filterdChatRooms, searchText])

    return(
        <div className=" w-full relative">
            {
                (chatRooms.length + roomInvites.length) === 0 && !isChatRoomsLoading ? (
                    <div>
                        ไม่มีประวัติการแชท
                    </div>
                )
                : (
                    <div className="w-full flex flex-col gap-2 overflow-y-auto max-h-[520px]">
                        {
                            roomInvites.map((invite) => {
                                return(
                                    <RoomInviteItem key={invite.roomId} invite={invite} onAccept={() => onAcceptInvite(invite)} onReject={() => onRejectInvite(invite)} />
                                )
                            })
                        }
                        {
                            displayChatRooms.map((room) => {
                                const isPrivate = room.isPrivate;
                                const user = isPrivate ? room.roomMembers.find(member => member.username !== currentUser.username) : null;
                                return(
                                    <div key={room.chatRoomId} 
                                        className={`w-full flex flex-row justify-between rounded-lg py-4 px-2 items-center transition-all duration-200 relative
                                            cursor-pointer ${currentChatRoom?.chatRoomId === room.chatRoomId ? 'bg-primary-100' : 'hover:bg-primary-50'}`}
                                        onClick={() => onSelectChatRoom(room)}
                                    >
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary-500">
                                                <UserProfileAvatar imageURL={isPrivate ? user.displayImgUrl : room.imageUrl} name={isPrivate ? user.name : room.name} />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-sm font-bold">{isPrivate ? user.name : room.name}</div>
                                                {room.lastMessage && (
                                                    <div className="flex justify-between items-center w-60 overflow-hidden">
                                                        <div className="flex-1 overflow-hidden">
                                                                    <div className="text-xs text-slate-500 max-w-full overflow-hidden flex flex-row items-center">
                                                                        <span className="font-bold me-2 text-nowrap">{room.lastMessage.senderUsername === currentUser.username ? 'คุณ' : room.lastMessage.sender.name}</span>
                                                                        <span className="text-xs text-slate-500 text-nowrap text-ellipsis flex-1 overflow-hidden">{room.lastMessage.text}</span>
                                                                    </div>
                                                        </div>
                                                        <div className="ms-2 text-xs text-slate-500 text-nowrap">
                                                            {dayjs(room.lastMessage?.createdDate).locale('th').fromNow()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                        {
                                            roomsReadStatus[room.chatRoomId] === true && (
                                                <div className=" absolute right-2 top-2">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )


            }
            {
                (isChatRoomsLoading) && (
                    <div className="w-full flex justify-center items-center py-8 absolute top-0 left-0">
                        <Spinner />
                    </div>
                )
            }
        </div>
    )
}