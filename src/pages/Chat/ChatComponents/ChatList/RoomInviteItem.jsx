import { RoomInvite } from "@/models/roomInvite";
import UserProfileAvatar from "@/component/UserProfileAvatar";
import dayjs from "dayjs";
import { Button } from "@heroui/react";

/**
 * 
 * @param {{
 *  invite: RoomInvite,
 *  onAccept: (invite: RoomInvite) => void,
 *  onReject: (invite: RoomInvite) => void
 * }} param0 
 * @returns 
 */
export default function RoomInviteItem({ invite, onAccept = () => {}, onReject = () => {} }) {
    return(
        <div key={invite.room.chatRoomId} 
            className={`w-full flex flex-col rounded-lg py-4 px-2 transition-all duration-200 relative
                cursor-pointer hover:bg-primary-50`}
            
        >
            <div className="flex flex-row items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-500">
                    <UserProfileAvatar imageURL={invite.room.imageUrl} name={invite.room.name} />
                </div>
                <div className="flex flex-col">
                    <div className="text-sm ">{invite.inviter.name} เชิญคุณเข้าร่วมกลุ่ม <span className="font-bold">{invite.room.name}</span></div>
                    <div className="flex justify-between items-center w-60 overflow-hidden">
                        <div className="flex-1 overflow-hidden">
                                    <div className="text-xs text-slate-500 max-w-full overflow-hidden flex flex-row items-center">
                                        <span className="font-bold me-2 text-nowrap">สถานะ: {invite.isAdmin ? 'ผู้ดูแล' : 'สมาชิกทั่วไป'}</span>
                                    </div>
                        </div>
                        <div className="ms-2 text-xs text-slate-500 text-nowrap">
                            {dayjs(invite.createdDate).locale('th').fromNow()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-end">
                <Button variant="light" color="success" size="sm" onPress={() => onAccept(invite)}>เข้ากลุ่ม</Button>
                <Button variant="light" color="danger" size="sm" onPress={() => onReject(invite)}>ปฏิเสธ</Button>
            </div>
            <div className="absolute top-2 right-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
            </div>
        </div>
    )
}