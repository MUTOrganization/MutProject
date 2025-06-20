import { Button, Skeleton } from "@heroui/react";
import { ChevronsRight, DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import AddGroupModal from "./AddGroupModal";
import DelGroupModal from "./DelGroupModal";

function GroupList({ groupList, groupSelected, setGroupSelected, isLoading, isFetchGroup }) {

    const [createModal, setCreateModal] = useState(false);
    const [delGroupModal, setDelGroupModal] = useState(false);
    const [delGroupItem, setDelGroupItem] = useState(null);

    //* เปิดหน้าเพิ่มหมวดหมู่สิทธิ์
    const handleCreateGroup = () => {
        setCreateModal(true);
    }

    //* เปิดหน้าลบหมวดหมู่สิทธิ์
    const handleDelGroup = (group) => {
        setDelGroupModal(true);
        setDelGroupItem(group);
    }

    //* เลือกหมวดหมู่สิทธิ์
    const handleSelectGroup = (group) => {
        setGroupSelected(group);
    }

    return (
        <div className="max-md:w-full h-[500px] w-[320px] overflow-y-auto scrollbar-hide border border-gray-200 bg-white rounded-xl p-3 shadow-lg transition-all duration-200">
            <div className="mb-5 flex items-center justify-between sticky top-0 z-10 bg-white p-3 rounded-xl border-b border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">หมวดหมู่สิทธิ์</h2>
                <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="text-xs font-medium shadow-md hover:scale-105 transition-transform"
                    onPress={handleCreateGroup}
                >
                    เพิ่มหมวดหมู่
                </Button>
            </div>

            {/* หน้าเพิ่มหมวดหมู่สิทธิ์ */}
            {createModal && (
                <AddGroupModal
                    isOpen={createModal}
                    onClose={() => setCreateModal(false)}
                    isFetchGroup={isFetchGroup}
                />
            )}

            {/* หน้าลบหมวดหมู่สิทธิ์ */}
            {delGroupModal && (
                <DelGroupModal
                    isOpen={delGroupModal}
                    onClose={() => setDelGroupModal(false)}
                    groupItem={delGroupItem}
                    isFetchGroup={isFetchGroup}
                />
            )}

            {/* รายการหมวดหมู่สิทธิ์ */}
            <div className="space-y-4">
                {groupList.length > 0 && !isLoading ? groupList.map((group) => {
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
                                <h3 className={`font-semibold text-md ${isSelected ? "text-teal-700" : "text-gray-900"} group-hover:text-primary-600`}>
                                    {group.groupName}
                                </h3>
                                <p className={`text-xs ${isSelected ? "text-teal-600" : "text-gray-500"} mt-1`}>
                                    {group.description}
                                </p>
                            </div>
                            <div className={`flex flex-col items-end gap-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                <div className="flex gap-1">
                                    {/* <Button size="sm" isIconOnly variant="light" color="primary" className="hover:bg-primary-50">
                                    <EditIcon className="w-4 h-4" />
                                </Button> */}
                                    <Button size="sm" isIconOnly variant="light" color="danger" className="hover:bg-danger-50" onPress={() => handleDelGroup(group)}>
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                {isSelected && (
                                    <ChevronsRight className="w-7 h-7 text-blue-700" />
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">ไม่พบข้อมูลหมวดหมู่สิทธิ์</p>
                        <Button size="sm" color="primary" variant="solid" className="text-xs font-medium shadow-md hover:scale-105 transition-transform">
                            เพิ่มหมวดหมู่
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GroupList;