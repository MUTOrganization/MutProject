import React, { useState, useEffect } from 'react';
import {
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
    User,
} from '@nextui-org/react';
import Layout from '../../Components/Layout';
import { RightArrow, CoinColorIcon, LeftArrowIcon } from '../../../../component/Icons';
import { toastSuccess, AlertQuestion, toastWarning, toastError } from '../../../../component/Alert';
import UserList from './Components/UserList';
import Remark from './Components/Remark';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../../Components/TransferContext';
import fetchProtectedData from '../../../../../utils/fetchData';
import { useAppContext } from '../../../../contexts/AppContext';
import UserProfileAvatar from '../../../../component/UserProfileAvatar';
import { URLS } from '../../../../config';

function Transfer() {
    const {
        selectedUsers,
        setSelectedUsers,
        selectedRemark,
        setSelectedRemark,
        lastestTransfers,
        fetchLastestTransfers,
        userPoints,
        fetchUserPoints
    } = useTransfer();

    const [selectedAmount, setSelectedAmount] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const currentData = useAppContext();

    const userListModal = useDisclosure();
    const remarkModal = useDisclosure();
    const navigate = useNavigate();

    const handleButtonPress = (amount) => {
        setSelectedAmount((prevAmount) => (prevAmount === amount ? null : amount));
    };

    const handleUserSelection = (selected) => {
        setSelectedUsers(selected);
        userListModal.onClose();
    };

    const handleRemarkSelection = (remark) => {
        setSelectedRemark(remark);
        remarkModal.onClose();
    };

    const handleTransferClick = () => {
        if (selectedUsers.length === 0) {
            userListModal.onOpen();
        } else {
            setIsAlertOpen(true);
        }
    };

    useEffect(() => {
        setSelectedUsers([])
        setSelectedRemark('')
    }, [])

    useEffect(() => {
        fetchLastestTransfers();
        fetchUserPoints();
    }, [])

    const handleConfirm = async () => {
        try {
            const response = await fetchProtectedData.post(`${URLS.weOne.confirmTransfer}`, {
                sender_username: currentData.currentUser.userName,
                receiver_usernames: selectedUsers,
                points: parseInt(selectedAmount, 10),
                reason: selectedRemark,
            });

            if (response.status === 200) {
                toastSuccess('การโอนคะแนนสำเร็จ');
                setSelectedRemark('');
                setSelectedUsers([]);
                setSelectedAmount(null);
                setIsAlertOpen(false);
                fetchLastestTransfers();
                fetchUserPoints();
            }
        } catch (error) {
            // ตรวจสอบว่ามี response และสถานะเป็น 400
            if (error.response && error.response.status === 400) {
                console.log('Warning response:', error.response.data.message);
                toastWarning(error.response.data.message || 'คะแนนของคุณไม่เพียงพอ');
                setSelectedAmount(null)
                setSelectedRemark('');
                setSelectedUsers([]);
                setSelectedAmount(null);
                setIsAlertOpen(false);
            } else {
                console.error('Error transferring points:', error);
                toastError('ไม่สามารถทำการโอนได้ในขณะนี้');
                setSelectedAmount(null)
                setSelectedRemark('');
                setSelectedUsers([]);
                setSelectedAmount(null);
                setIsAlertOpen(false);
            }
        }
    };

    const handleCancel = () => {
        setIsAlertOpen(false);
    };

    return (
        <Layout>
            <div className="space-y-4 px-4 py-4 pb-24">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button isIconOnly variant="light" className="flex-shrink-0" onPress={() => navigate(-1)}>
                        <LeftArrowIcon width={16} />
                    </Button>
                    <h2 className="text-xl font-bold flex-grow text-center">โอนคะแนน</h2>
                    <span className="w-8"></span>
                </div>

                {/* Recent Transfers Section */}
                <section>
                    <h2 className="text-lg font-semibold mb-2">5 คนที่โอนให้ล่าสุด</h2>
                    <div className="flex overflow-hidden">
                        {lastestTransfers && lastestTransfers.length > 0 ? (
                            <section className="flex space-x-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
                                {lastestTransfers.map((transfer, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer p-1 rounded-lg ${selectedUsers.includes(transfer.receiver_username)
                                            ? 'border-blue-500 bg-blue-100 border-2'
                                            : ''
                                            }`}
                                        onClick={() => {
                                            setSelectedUsers((prevSelected) =>
                                                prevSelected.includes(transfer.receiver_username)
                                                    ? prevSelected.filter(
                                                        (user) => user !== transfer.receiver_username
                                                    )
                                                    : [...prevSelected, transfer.receiver_username]
                                            );
                                        }}
                                    >
                                        {transfer.displayImgUrl ? (
                                            <div className="flex flex-col items-center text-center">
                                                <UserProfileAvatar
                                                    name={transfer.receiver_username}
                                                    imageURL={transfer.displayImgUrl}
                                                    size="lg"
                                                    className="rounded-full"
                                                />
                                                <p className="text-sm text-black mt-1">
                                                    {transfer.receiver_username || 'ไม่มีแผนก'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {transfer.departmentName || 'ไม่มีแผนก'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center">
                                                <UserProfileAvatar
                                                    name={transfer.receiver_username}
                                                    imageURL={null}
                                                    size="lg"
                                                    className="rounded-full"
                                                />
                                                <p className="text-sm text-black mt-1">
                                                    {transfer.receiver_username || 'ไม่มีแผนก'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {transfer.departmentName || 'ไม่มีแผนก'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center mx-auto">
                                <p className="text-gray-500 p-2">ไม่พบข้อมูลการโอน</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="space-y-4">
                    {/* Select Users */}
                    <section>
                        <div className="flex justify-between items-center cursor-pointer" onClick={userListModal.onOpen}>
                            <div>
                                <p className="font-semibold">โอนให้</p>
                                <p className="text-sm text-gray-500">เลือกผู้ใช้เพื่อโอนคะแนน</p>
                            </div>
                            <div className="flex items-center space-x-4 text-blue-500 font-semibold">
                                <p>{selectedUsers.length} คน</p>
                                <RightArrow width={10} />
                            </div>
                        </div>
                    </section>
                    <Divider className="my-4" />

                    {/* Select Remark */}
                    <section>
                        <div className="flex justify-between items-center cursor-pointer" onClick={remarkModal.onOpen}>
                            <div>
                                <p className="font-semibold">หมายเหตุการโอน</p>
                                <p className="text-sm text-gray-500">เลือกหมายเหตุการโอน</p>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-500 font-semibold">
                                <p>{selectedRemark || 'ยังไม่ได้เลือกหมายเหตุ'}</p>
                                <RightArrow width={10} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Amount Section */}
                <section className="grid grid-cols-3 gap-2">
                    {[5, 10, 15, 20, 30, 40].map((amount) => (
                        <Button
                            key={amount}
                            className="text-lg font-semibold "
                            size="lg"
                            variant={selectedAmount === amount ? 'flat' : 'bordered'}
                            color={selectedAmount === amount ? 'primary' : 'default'}
                            onPress={() => handleButtonPress(amount)}
                        >
                            {amount}
                        </Button>
                    ))}
                </section>

                <Divider className="my-4" />
                {/* Total Amount Section */}
                <section>
                    <div className="flex flex-col rounded-lg space-y-2 mb-1">
                        <p className="text-md font-semibold">จำนวน</p>
                        <div className="flex items-center justify-between text-gray-600">
                            <span className="text-md">คะแนนของฉัน:</span>
                            <span className="text-md text-blue-500 font-semibold">{userPoints.total_points}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                            <span className="text-md">คะแนนที่โอนไปแล้วในวันนี้:</span>
                            <span className="text-md text-red-500 font-semibold">{userPoints.transferred_today}</span>
                        </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                        <CoinColorIcon />
                        <input
                            value={selectedAmount || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setSelectedAmount(value);
                                }
                            }}
                            placeholder="0"
                            className="text-blue-500 text-2xl font-bold border-0 border-b-2 focus:outline-none focus:ring-0 p-2"
                            size="lg"
                        />
                    </div>
                </section>

                {/* Confirm Button */}
                <section>
                    <Button className="w-full py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold" onPress={handleTransferClick}>
                        โอนเลย
                    </Button>
                </section>
                <AlertQuestion
                    isOpen={isAlertOpen}
                    onClose={handleCancel}
                    onConfirm={handleConfirm}
                    title="ยืนยันการโอนคะแนน"
                    content="คุณต้องการจะยืนยันการโอนคะแนนหรือไม่?"
                    confirmText="ตกลง"
                    cancelText="ยกเลิก"
                    icon="question"
                    color="success"
                />

                <Modal isOpen={userListModal.isOpen} onClose={userListModal.onClose} size='full'>
                    <ModalContent>
                        <ModalHeader>เลือกผู้ใช้</ModalHeader>
                        <ModalBody className='px-4'>
                            <UserList onConfirmSelection={handleUserSelection} />
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Modal isOpen={remarkModal.isOpen} onClose={remarkModal.onClose} size='full'>
                    <ModalContent>
                        <ModalHeader>เลือกหมายเหตุ</ModalHeader>
                        <ModalBody className='px-4'>
                            <Remark onConfirmSelection={handleRemarkSelection} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </Layout>
    );
}

export default Transfer;
