import { useSocketContext } from "@/contexts/SocketContext";
import { Button, Textarea } from "@heroui/react";
import { File, FileTerminal, FileText, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFilePdf, FaPaperclip } from "react-icons/fa";
import { useChatContext } from "../../ChatContext";
import { MessageFile } from "@/models/chatMessage";
import FileInput from "@/component/FileInput";
import { toastWarning } from "@/component/Alert";

export default function MessageInput({onSendMessage = () => {}}) {
    const [text, setText] = useState('')
    /** @type {[File[]]} */
    const [files, setFiles] = useState([])

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // ไม่ให้ขึ้นบรรทัดใหม่
            handleSendMessage();
        }
    };

    function handleSendMessage(){
        if(text.trim() === '' && files.length === 0) return
        setText('')
        files.forEach(f => {
            if(f.imageURL){
                URL.revokeObjectURL(f.imageURL)
            }
        })
        setFiles([])
        onSendMessage(text, files.length > 0 ? files : null)
    }

    function handleFileChange(e){
        if(files.length >= 10){
            toastWarning('สามารถส่งได้ไม่เกิน 10 ไฟล์')
            return
        }
        const maxSize = 10 * 1024 * 1024 // 10 MB
        let _files = Array.from(e.target.files)
        let haveInvalidTypeFiles = false;
        let haveExceedSizeFiles = false;
        _files = _files.filter((f) => {
            if(f.type === ''){
                haveInvalidTypeFiles = true;
                return false;
            }
            if(f.size > maxSize){
                haveExceedSizeFiles = true;
                return false;
            }
            return true;
        })
        let isExceedMaxFiles = files.length + _files.length > 10;
        if(haveInvalidTypeFiles){
            toastWarning('มีไฟล์ที่ประเภทไม่ถูกต้อง')
        }
        if(haveExceedSizeFiles){
            toastWarning('มีไฟล์ที่เกินขนาดที่กำหนด')
        }
        if(isExceedMaxFiles){
            toastWarning('สามารถส่งได้ไม่เกิน 10 ไฟล์')
        }

        _files = _files.slice(0, 10 - files.length) // ตัดไฟล์ให้เหลือใส่ได้ 10 ไฟล์
        _files.forEach(f => {
            const fileType = f.type.split('/')[0]
            const isImage = fileType === 'image'
            if(isImage){
                f.imageURL = URL.createObjectURL(f)
            }
        })
        if(_files.length > 0){
            setFiles(prev => [...prev, ..._files])
        }
    }

    useEffect(() => {
        return () => {
            files.forEach(f => {
                if(f.imageURL){
                    URL.revokeObjectURL(f.imageURL)
                }
            })
        }
    }, [])

    function handleRemoveFile(index){
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return(
        <div className="w-full flex flex-col bg-gray-100 border-slate-200 border-1 p-2 rounded-lg ">
            {
                files.length > 0 &&
                <div className="w-full flex gap-2 mb-4 flex-wrap">
                    {
                        files.map((file, index) => {
                            const fileType = file.type.split('/')[0]
                            const isImage = fileType === 'image'
                            const isPdf = fileType === 'application' && file.name.endsWith('.pdf')
                            const isText = fileType === 'text'

                            if(isImage){
                                return(
                                    <div key={index} className="w-40 h-16 p-2 bg-gray-200 rounded-lg relative flex space-x-2">
                                        <img src={file.imageURL} alt={file.name} className="w-20 rounded-lg bg-red-200 h-full object-cover text-xs" />
                                        <div className="size-full overflow-hidden flex items-center">
                                        <span className="text-xs text-gray-700 text-ellipsis">
                                            {file.name}  
                                        </span>
                                    </div>
                                        <div className="absolute top-0 right-0">
                                            <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-300 transition-all duration-300 cursor-pointer" 
                                            onClick={() => handleRemoveFile(index)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            return(
                                <div key={index} className="flex w-40 h-16 p-2 space-x-2 bg-gray-200 border-1 border-gray-300 rounded-lg relative">
                                    <div className="w-16 h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        {
                                            isPdf ? 
                                            <FaFilePdf size={28} className="" />
                                            :
                                            isText ?
                                            <FileText size={28} />
                                            :
                                            <File size={28} />
                                        }
                                    </div>
                                    <div className="size-full overflow-hidden flex items-center">
                                        <span className="text-xs text-gray-700 text-ellipsis">
                                            {file.name}  
                                        </span>
                                    </div>
                                    <div className="absolute top-0 right-0">
                                        <button className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-300 transition-all duration-300 cursor-pointer" 
                                        onClick={() => handleRemoveFile(index)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
            <div className='w-full flex items-end space-x-2'>
                <div className='mb-1 '>
                    <FileInput selectionMode="multiple" onChange={handleFileChange}>
                        <div className='size-9  hover:bg-gray-300 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer'>
                            <FaPaperclip size={20}/>
                        </div>
                    </FileInput>
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
                    <Button color='primary' variant='solid' isDisabled={text.trim() === '' && files.length === 0} onPress={handleSendMessage}>
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    )
}