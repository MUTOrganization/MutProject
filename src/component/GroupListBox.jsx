import { Button, Skeleton, Spinner } from "@heroui/react";
import { ChevronsRight, DeleteIcon } from "lucide-react";
import React from "react";

function GroupListBox({ children, title = '', HeaderRightContent, selectedItem, onSelectItem = () => {}, isLoading, emptyText = 'ไม่พบข้อมูล' }) {

    const handleClick = (key) => {
        onSelectItem(key)
    }

    function isMyItem(element) {
        return element.type.name === GroupListItem.name;
    }

    const enhancedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            if (!isMyItem(child)) {
            throw new Error(
                    `<GroupListItem> only accepts <GroupListItem> as its children. Found: ${child.type?.name || child.type}`
                )
            }
          return React.cloneElement(child, {
            onClick: () => handleClick(child.key),
            isSelected: selectedItem && selectedItem === child.key
          })
        }
        return child
    })

    
    return (
        <div className="size-full overflow-y-auto scrollbar-hide border border-gray-200 bg-white rounded-xl p-3 shadow-lg transition-all duration-200">
            <div className="mb-5 flex items-center justify-between sticky top-0 z-10 bg-white p-3 rounded-xl border-b border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
                {HeaderRightContent && (
                <div className="">
                    {HeaderRightContent}
                </div>
            )}
            </div>
            
            {/* รายการหมวดหมู่สิทธิ์ */}
            <div className="space-y-4">
                {!isLoading ? 
                enhancedChildren.length > 0 ? (
                    enhancedChildren
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">{emptyText}</p>
                    </div>
                )
                :
                <div className="w-full flex flex-col gap-2 pt-10">
                    <Spinner/>
                    
                </div>
            
                }
                
            </div>
        </div>
    )

}

function GroupListItem({ children, onClick, isSelected }) {
    return (
        <div
            onClick={onClick}
            className={` 
            p-4 rounded-xl cursor-pointer border 
            transition-all duration-200 group
            flex items-center justify-between
            ${isSelected
                ? " border-blue-400 border-2 shadow-lg scale-[1.02]"
                : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
            }
            `}
            style={{
                boxShadow: isSelected
                    ? "0 4px 16px 0 rgba(34,211,238,0.10)"
                    : undefined
            }}
        >
            <div className="flex flex-col w-full">
                {children}
            </div>
            <div className={`flex flex-col items-end gap-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {isSelected && (
                    <ChevronsRight className="w-7 h-7 text-blue-700" />
                )}
            </div>
        </div>
    )
}

export { GroupListBox, GroupListItem }