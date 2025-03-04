import React, { useEffect, useState } from 'react';
import { Input, Checkbox, Button, User } from '@nextui-org/react';
import { useTransfer } from '../../../Components/TransferContext';
import { SmilelyColorIcon } from '../../../../../component/Icons'
import UserProfileAvatar from '../../../../../component/UserProfileAvatar';

function UserList({ onConfirmSelection }) {
    const { selectedUsers, setSelectedUsers, users, isLoading, fetchUsers } = useTransfer();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectUser = (username) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(username)
                ? prevSelected.filter((u) => u !== username)
                : [...prevSelected, username]
        );
    };

    const handleConfirm = () => {
        onConfirmSelection(selectedUsers);
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="space-y-4">
                <div className="flex flex-row space-x-2">
                    <Input
                        clearable
                        underlined
                        placeholder="ค้นหาด้วยชื่อผู้ใช้..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <Button
                        className="text-blue-500 font-semibold justify-self-end"
                        variant="light"
                        onPress={handleConfirm}
                    >
                        ยืนยัน
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">ผู้ใช้ ({filteredUsers.length})</p>
                        <p className="text-gray-500 text-sm">เลือกแล้ว {selectedUsers.length}</p>
                    </div>

                    <div className="flex flex-col h-[calc(100vh-200px)] overflow-hidden w-full overflow-x-hidden">
                        <section className="flex-grow space-y-4 overflow-y-auto pb-16 scrollbar-hide">

                            {filteredUsers.map((user) => (
                                <div
                                    key={user.username}
                                    className={`flex justify-between items-center border-b pb-2 cursor-pointer px-2 w-full ${selectedUsers.includes(user.username) ? '' : ''}`}
                                    onPress={() => handleSelectUser(user.username)}
                                >
                                    <div className="flex items-center space-x-4 w-full overflow-hidden">
                                        <UserProfileAvatar
                                            name={user.username}
                                            imageURL={user.displayImgUrl}
                                            className="text-sm flex-shrink-0"
                                        />
                                        <div className="flex-grow overflow-hidden">
                                            <p className="font-semibold truncate">
                                                {user.nickName ? user.nickName : user.username}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">{user.depName}</p>
                                        </div>
                                    </div>
                                    <Checkbox
                                        isSelected={selectedUsers.includes(user.username)}
                                        onChange={(e) => e.stopPropagation()}
                                        color="primary"
                                        className="flex-shrink-0"
                                    />
                                </div>
                            ))}

                            {filteredUsers.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <SmilelyColorIcon className="mb-4" width={32} height={32} />
                                    <p className="text-gray-500">ไม่พบผู้ใช้</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserList;
