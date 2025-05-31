import { useAppContext } from "@/contexts/AppContext";
import { ChatMessage } from "@/models/chatMessage";
import SystemMessageItem from "./SystemMessageItem";
import UserMessageItem from "./UserMessageItem";
import { useCallback, useEffect, useState } from "react";
import { useChatContext } from "../../ChatContext";
import { toastError } from "@/component/Alert";
import useSocket from "@/component/hooks/useSocket";

/**
 * 
 * @param {{
 *  messages: ChatMessage[]
 *  setMessages: () => void
 * }} param0 
 * @returns 
 */
export default function ChatMessageBox({messages, setMessages = () => {}}) {
    const { currentUser } = useAppContext()
    
    
    return (
        <div className="w-full flex flex-col-reverse justify-end items-center">
            {messages.map((message) => {
                const isCurrentUser = message.senderUsername === currentUser.username

                if(message.source === 'system'){
                    return <SystemMessageItem key={message.id} message={message} />
                }
                return <UserMessageItem key={message.id} message={message} isCurrentUser={isCurrentUser} />
                
            })}
        </div>
    )

}