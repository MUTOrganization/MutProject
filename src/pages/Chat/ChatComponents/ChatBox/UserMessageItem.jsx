import { toastError } from "@/component/Alert";
import UserProfileAvatar from "@/component/UserProfileAvatar";
import { ChatMessage } from "@/models/chatMessage";
import chatMessageService from "@/services/chatMessageService";
import { formatRelativeTime } from "@/utils/dateUtils";
import { cFormatter } from "@/utils/numberFormatter";
import { Spinner } from "@heroui/react";
import { Download, FileIcon, FileText } from "lucide-react";
import { FaFilePdf } from "react-icons/fa";

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

    async function handleDownloadFile(file){
        try{
            if(file?.fileUrl){
                document.body.style.cursor = 'progress';
                await chatMessageService.downloadFile(file.fileUrl.split('/').pop(), file.fileName);
                document.body.style.cursor = 'default';
            }
        }catch(error){
            console.error(error)
            toastError('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์')
        }
    }

    return (
        <div className={`w-full flex flex-col justify-center space-y-1 mt-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <span className={`text-xs text-gray-500 ${isCurrentUser ? 'me-12' : 'ms-12'}`}>{displayText}</span>
            <div className={`flex items-center ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`${isCurrentUser ? 'ms-1' : 'me-1'}`}>
                    <UserProfileAvatar size="md" name={message.sender?.username} imageURL={message.sender?.displayImgUrl} />
                </div>
                <pre className={`${message.text.trim() === '' ? 'hidden' : ''} whitespace-pre-wrap font-sans border-1 p-2 px-3 text-sm rounded-2xl max-w-[400px] ${isCurrentUser ? 'bg-primary-400 text-white ms-1' : 'bg-gray-200 me-1'}`}>
                    {message.text}
                </pre>
                <div className={`${message.text.trim() === '' ? 'hidden' : ''} text-[10px] text-gray-500`}>{ message.isPending && 'กำลังส่ง...' }</div>
            </div>
            {
                (message.isPending && message.isFilePending) ?
                <div className={`flex justify-center items-center size-24 rounded-lg border-1 border-gray-300 bg-gray-200 ${isCurrentUser ? 'me-11' : 'ms-11'}`}>
                    <Spinner />
                </div>
                :
                (message.files && message.files.length > 0) &&
                <div className={`flex flex-wrap gap-2 ${isCurrentUser ? 'me-11 justify-end' : 'ms-11 justify-start'} max-w-[400px]`}>
                    {message.files.map(file => {
                        const fileType = file.fileType.split('/')[0]
                        const isImage = fileType === 'image'
                        const isPdf = fileType === 'application' && file.fileName.endsWith('.pdf')
                        const isText = fileType === 'text'
                        if(isImage){
                            return (
                                <div key={file.fileUrl} className={`w-full flex rounded-lg overflow-hidden ${isCurrentUser ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className="w-10 h-full flex items-center justify-center me-1" onClick={() => handleDownloadFile(file)}>
                                        <div className="w-full h-10 cursor-pointer text-gray-500 hover:text-gray-700 rounded-lg flex items-center justify-center transition-all duration-300"><Download size={24}/></div>
                                    </div>
                                    <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border-1 border-gray-300">
                                        <img src={file.fileUrl} alt={file.fileName} />
                                    </div>
                                    
                                </div>
                            )
                        }
                        
                        return (
                            <div key={file.fileUrl} className="w-24 h-34 p-1 flex flex-col rounded-lg overflow-hidden border-1 bg-gray-200 border-gray-300 cursor-pointer relative"
                                onClick={() => handleDownloadFile(file)}
                            >
                                <div className=" flex justify-center items-center bg-gray-100 rounded-lg p-1 py-2">
                                    {isPdf ? <FaFilePdf size={64}/> : isText ? <FileText size={48}/> : <FileIcon size={48}/>}
                                </div>
                                <div className="w-full text-center text-xs text-gray-500 mt-2 overflow-hidden text-ellipsis text-nowrap px-1">
                                    {file.fileName}
                                </div>
                                <div className="w-full text-center text-xs text-gray-500 mt-2 overflow-hidden text-ellipsis text-nowrap px-1">
                                    {cFormatter(file.fileSizeBytes / 1024 / 1024, 2)} MB
                                </div>
                                <div className="absolute top-0 right-0 size-full bg-black opacity-0 hover:opacity-2 transition-all duration-300">
                                    
                                </div>
                            </div>
                        )
                        
                    })}
                </div>
            }
            
        </div>
    )

}