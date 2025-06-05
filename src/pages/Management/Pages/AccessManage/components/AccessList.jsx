import { Button, Skeleton } from "@heroui/react";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import AddAccessModal from "./AddAccessModal";
import EditAccess from "./EditAccess";
import DelAccess from "./DelAccess";

function AccessList({ accessList, groupSelected, isFetchAccess, isLoading }) {

    const [addAccessModal, setAddAccessModal] = useState(false);
    const [editAccessModal, setEditAccessModal] = useState(false);
    const [editAccessItem, setEditAccessItem] = useState(null);
    const [delAccessModal, setDelAccessModal] = useState(false);
    const [delAccessItem, setDelAccessItem] = useState(null);

    //* ลบสิทธิ์
    const handleDeleteAccess = (access) => {
        setDelAccessItem(access);
        setDelAccessModal(true);
    }


    //* เปิดหน้าแก้ไขสิทธิ์
    const handleEditAccess = (access) => {
        setEditAccessItem(access);
        setEditAccessModal(true);
    }

    //* เปิดหน้าเพิ่มสิทธิ์
    const handleAddAccess = () => {
        setAddAccessModal(true);
    }

    return (
        <div className="flex-1 min-h-full max-h-full overflow-y-auto scrollbar-hide border border-gray-200 bg-white rounded-xl p-3 shadow-lg">
            <div className="mb-5 flex items-center justify-between sticky top-0 z-10  p-3  border-b ">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">รายการสิทธิ์</h2>
                <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="text-xs font-medium shadow-md hover:scale-105 transition-transform"
                    onPress={handleAddAccess}
                >
                    เพิ่มสิทธิ์
                </Button>
            </div>

            {/* หน้าเพิ่มสิทธิ์ */}
            {addAccessModal && (
                <AddAccessModal
                    isOpen={addAccessModal}
                    onClose={() => setAddAccessModal(false)}
                    groupSelected={groupSelected}
                    isFetchAccess={isFetchAccess}
                />
            )}

            {/* หน้าแก้ไขสิทธิ์ */}
            {editAccessModal && (
                <EditAccess
                    isOpen={editAccessModal}
                    onClose={() => setEditAccessModal(false)}
                    accessItem={editAccessItem}
                    isFetchAccess={isFetchAccess}
                    groupSelected={groupSelected}
                />
            )}

            {/* หน้าลบสิทธิ์ */}
            {delAccessModal && (
                <DelAccess
                    isOpen={delAccessModal}
                    onClose={() => setDelAccessModal(false)}
                    accessItem={delAccessItem}
                    isFetchAccess={isFetchAccess}
                />
            )}

            <div className="space-y-4">
                {accessList.length > 0 ? accessList.map((access) => (
                    <Skeleton key={access.accessId} isLoaded={!isLoading} className="rounded-xl">
                        <div className="p-4 rounded-xl border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-md text-gray-900">
                                        {access.accessName}
                                    </h3>
                                    <p className="text-xs max-w-[200px] text-gray-500 mt-1">
                                        {access.description}
                                    </p>
                                    <div className="mt-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                            {access.accessCode}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="sm" isIconOnly variant="light" color="primary" className="hover:bg-primary-50" onPress={() => handleEditAccess(access)}>
                                        <EditIcon className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" isIconOnly variant="light" color="danger" className="hover:bg-danger-50" onPress={() => handleDeleteAccess(access)}>
                                        <DeleteIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Skeleton>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">ไม่พบข้อมูลสิทธิ์</p>
                        <Button
                            size="sm"
                            color="primary"
                            variant="solid"
                            className="text-xs font-medium shadow-md hover:scale-105 transition-transform"
                            onPress={handleAddAccess}
                        >
                            เพิ่มสิทธิ์
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccessList;