import { ChatMessage } from "@/models/chatMessage";
import { formatRelativeTime } from "@/utils/dateUtils";

/**
 * 
 * @param {{
 *  message: ChatMessage
 * }} param0 
 * @returns 
 */
export default function SystemMessageItem({message}) {
    const displayText = formatRelativeTime(message.createdDate)
    
    return(
        <div className="w-full flex flex-col justify-center items-center space-y-1 mt-3">
            <span className="text-xs text-gray-500">{displayText}</span>
            <div className="bg-gray-200 border-1  p-1 px-3 text-xs rounded-full">
                {message.text}
            </div>
        </div>
    )
}