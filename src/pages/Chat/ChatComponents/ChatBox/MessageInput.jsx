import { useSocketContext } from "@/contexts/SocketContext";
import { Button, Textarea } from "@heroui/react";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import { useChatContext } from "../../ChatContext";

export default function MessageInput({onSendMessage = () => {}}) {
    const [text, setText] = useState('')
    const { socket } = useSocketContext()
    const { currentChatRoom } = useChatContext()

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // ไม่ให้ขึ้นบรรทัดใหม่
            handleSendMessage();
        }
    };

    function handleSendMessage(){
        if(text.trim() === '') return
        setText('')
        onSendMessage(text)
    }

    return(
        <div className='w-full mt-4 bg-gray-100 border-1 border-slate-200 p-2 rounded-lg flex items-end space-x-2'>
            <div className='mb-1'>
                <Button isIconOnly color='default' variant='light' className=''>
                    <FaPaperclip size={20}/>
                </Button>
            </div>
            <Textarea 
                aria-label='ข้อความ'
                className='w-full'
                classNames={{
                    inputWrapper: 'bg-white',
                    input: 'text-lg'
                }}  
                variant='bordered'
                placeholder='ข้อความ' 
                minRows={1}
                value={text}
                onValueChange={(e) => setText(e)}
                onKeyDown={handleKeyDown}
            />
                <div className='mb-1'>
                <Button color='primary' variant='solid' isDisabled={text.trim() === ''} onPress={handleSendMessage}>
                    <Send size={20} />
                </Button>
            </div>
        </div>
    )
}