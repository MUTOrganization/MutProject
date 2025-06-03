import { Edit, ImageIcon } from "lucide-react";
import FileInput from "./FileInput";
import { useEffect, useState } from "react";
const sizeMap = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-52 h-52',
}

const iconSizeMap = {
    xs: 20,
    sm: 36,
    md: 52,
    lg: 72,
    xl: 128,
}

const editIconSizeMap = {
    xs: {
        icon: 8,
        padding: 'p-1',
    },
    sm: {
        icon: 12,
        padding: 'p-1',
    },
    md: {
        icon: 18,
        padding: 'p-2',
    },
    lg: {
        icon: 24,
        padding: 'p-2',
    },
    xl: {
        icon: 36,
        padding: 'p-3',
    },
}

export default function ImageInput({ size = 'md', onChange = () => {}, oldImageUrl = null, isDisabled = false }) {
    const [previewUrl, setPreviewUrl] = useState(oldImageUrl);
    // const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        // setSelectedFile(file);

        // สร้าง URL ชั่วคราวสำหรับ preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // ส่งไปเรียกใช้งานฟังก์ชัน onChange ที่ต้องการ
        onChange(file);
    }

    useEffect(() => {
        return () => {
            if(previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        }
    }, [previewUrl])

    
    return(
        <div className={`${sizeMap[size]} rounded-full`}>
            <FileInput accept="image/*" onChange={handleFileChange} isDisabled={isDisabled}>
                <div className={`w-full h-full rounded-full bg-gray-200 flex items-center justify-center relative ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <ImageIcon size={iconSizeMap[size]} />
                    )}
                    
                    <div className={`${size === 'xs' && 'hidden'} absolute bottom-0 right-0 z-20 bg-white border border-gray-300 rounded-full ${editIconSizeMap[size].padding}`}>
                        <Edit size={editIconSizeMap[size].icon} />
                    </div>   

                    <div className="absolute top-0 left-0 size-full z-10 flex items-center justify-center bg-black/40 rounded-full 
                    transition-all duration-300 opacity-0 hover:opacity-100">
                        <div className="text-white text-sm">กดเพื่อเปลี่ยนรูปภาพ</div>
                    </div>
                    
                </div>
            </FileInput>
        </div>
    )
}