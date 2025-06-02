import { useRef } from "react";

/**
 * 
 * @param {{
 *  children: React.ReactNode,
 *  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *  accept: string,
 *  selectionMode: 'single' | 'multiple',
 * }} param0 
 * @returns 
 */
export default function FileInput({ children, onChange = () => {}, accept = "*", selectionMode = 'single' }) {
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current?.click();
    }
    const handleChange = (e) => {
        console.log(e.target.files);
        onChange(e);
    }

    return(
        <div className="size-full" onClick={handleClick}>
            {children}
            <input type="file" ref={fileInputRef} onChange={handleChange} accept={accept} className="hidden" multiple={selectionMode === 'multiple'} />
        </div>
    )
}