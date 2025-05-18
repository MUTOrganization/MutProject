import { Button } from "@heroui/react";
import { ChevronRight, ChevronRightIcon, ChevronsRight, DeleteIcon, EditIcon } from "lucide-react";

function GroupList({ groupList, groupSelected, setGroupSelected }) {

    const handleSelectGroup = (group) => {
        setGroupSelected(group);
    }

    return (
        <div className="h-[500px] w-[320px] overflow-y-auto scrollbar-hide border border-gray-200 bg-white rounded-xl p-3 shadow-lg transition-all duration-200">
            <div className="mb-5 flex items-center justify-between sticky top-0 z-10 bg-white p-3 rounded-xl border-b border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">หมวดหมู่สิทธิ์</h2>
                <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="text-xs font-medium shadow-md hover:scale-105 transition-transform"
                >
                    เพิ่มหมวดหมู่
                </Button>
            </div>
            <div className="space-y-4">
                {groupList.map((group) => {
                    const isSelected = groupSelected && group.accessGroupId === groupSelected.accessGroupId;
                    return (
                        <div
                            key={group.accessGroupId}
                            onClick={() => handleSelectGroup(group)}
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
                            <div className="flex flex-col">
                                <h3 className={`font-semibold text-lg ${isSelected ? "text-teal-700" : "text-gray-900"} group-hover:text-primary-600`}>
                                    {group.groupName}
                                </h3>
                                <p className={`text-sm ${isSelected ? "text-teal-600" : "text-gray-500"} mt-1`}>
                                    {group.description}
                                </p>
                            </div>
                            <div className={`flex flex-col items-end gap-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                <div className="flex gap-1">
                                    <Button size="sm" isIconOnly variant="light" color="primary" className="hover:bg-primary-50">
                                        <EditIcon className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" isIconOnly variant="light" color="danger" className="hover:bg-danger-50">
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {isSelected && (
                                    <ChevronsRight className="w-7 h-7 text-blue-700" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default GroupList;