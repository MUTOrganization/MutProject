import React, { useState } from 'react';
import Layout from '../../Components/Layout';
import { Avatar, Button, Card, CardBody, Chip, useDisclosure } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../contexts/AppContext';
import { AlertQuestion } from '../../../../component/Alert';
import { useTransfer } from '../../Components/TransferContext';
import { Link } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const currentData = useAppContext();
    const { logout } = useAppContext();
    const logoutModal = useDisclosure();

    const { userPoints, isLoadingPoints, fetchUserPoints } = useTransfer();

    const currentUser = currentData.currentUser

    const handleLogoutConfirm = () => {
        logout();
        logoutModal.onClose();
    };

    const stats = [
        { label: "คะแนนทั้งหมด", value: userPoints.total_points, color: "text-blue-500" },
        { label: "ได้รับคะแนน", value: userPoints.total_received_points, color: "text-green-600" },
        { label: "อันดับของฉัน", value: userPoints.rank, color: "text-yellow-500" },
    ];

    return (
        <Layout>
            <div className="p-6 space-y-6 bg-gradient-to-b from-blue-50 to-white pb-24">
                {/* Header Section */}
                <section className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <Avatar
                            src={currentUser.displayImgUrl}
                            size="lg"
                            color="primary"
                            className="ring-4 ring-blue-300"
                        />
                    </div>
                    <h1 className="text-2xl font-bold">{currentUser.userName}</h1>
                    <h1 className="">ชื่อ {currentUser.nickname ? currentUser.nickname : currentUser.name}</h1>
                    <p className="text-gray-600">แผนก <Chip color='primary' variant='flat'>{currentUser.department}</Chip></p>
                    <p className="text-gray-700 text-sm">ตำแหน่ง <Chip color='primary' variant='flat'>{currentUser.role}</Chip></p>
                </section>

                <div className="border-t-2 border-dashed border-gray-300 my-2"></div>

                {/* Stats Section */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">สถิติ</h2>
                    <Link to={"/WeOne-History"}>
                        <Card radius="lg" shadow="none" fullWidth className="bg-[#e4f2ff] shadow-sm p-6">
                            <div className="grid grid-cols-3 gap-4 text-center w-full">
                                {stats.map((stat, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Link>
                </section>

                {/* Coins Section */}
                <section className="space-y-4">
                    <Card radius="lg" shadow="none" fullWidth  className="bg-[#fcf9e3] shadow-sm">
                        <CardBody>
                            <div className="grid grid-cols-2 items-center">
                                <div>
                                    <p className="text-xl font-semibold">
                                        คะแนน <span className="text-blue-600 font-bold">{userPoints.total_points}</span>
                                    </p>
                                    <p className="text-md text-gray-500">
                                        โอนคะแนนง่ายๆ เพิ่มพลังบวกให้ทุกคน
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Button
                                        className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold text-lg"
                                        fullWidth
                                        onPress={() => navigate("/WeOne-Transfer")}
                                    >
                                        โอนเลย
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </section>

                <div className="border-t-2 border-dashed border-gray-300 my-2"></div>

                {/* Footer Section */}
                <section className="text-center text-sm text-gray-400">
                    {/* <p>เข้าร่วมเมื่อ: 01/01/2023</p> */}
                    <p>© 2024 Hopeful</p>
                </section>
                <section className='text-center'>
                    <Button color='secondary' variant='flat' onPress={logoutModal.onOpen}>
                        ออกจากระบบ
                    </Button>
                </section>
            </div>
            <AlertQuestion
                isOpen={logoutModal.isOpen}
                onClose={logoutModal.onClose}
                onConfirm={handleLogoutConfirm}
                title="ยืนยันการออกจากระบบ"
                content="คุณต้องการออกจากระบบหรือไม่?"
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                color="warning"
                icon="question"
            />
        </Layout>
    );
}

export default Profile;
