import UserProfileAvatar from "@/component/UserProfileAvatar";
import { ChatMessage } from "@/models/chatMessage";
import { formatRelativeTime } from "@/utils/dateUtils";

/**
 * 
 * @param {{
 *  message: ChatMessage
 *  isCurrentUser: boolean
 * }} param0 
 * @returns 
 */
export default function UserMessageItem({message, isCurrentUser}) {
    const displayText = formatRelativeTime(message.createdDate)

    return (
        <div className={`w-full flex flex-col justify-center space-y-1 mt-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <span className={`text-xs text-gray-500 ${isCurrentUser ? 'me-12' : 'ms-12'}`}>{displayText}</span>
            <div className={`flex items-center ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`${isCurrentUser ? 'ms-1' : 'me-1'}`}>
                    <UserProfileAvatar size="md" name={message.sender?.username} imageURL={message.sender?.displayImgUrl} />
                </div>
                <pre className={`whitespace-pre-wrap font-sans border-1 p-2 px-3 text-sm rounded-2xl max-w-[400px] ${isCurrentUser ? 'bg-primary-400 text-white ms-1' : 'bg-gray-200 me-1'}`}>
                    {message.text}
                </pre>
                <div className={`text-[10px] text-gray-500`}>{ message.isPending && 'กำลังส่ง...' }</div>
            </div>
        </div>
    )

}