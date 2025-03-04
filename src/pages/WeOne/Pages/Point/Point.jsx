import React, { useEffect } from 'react';
import Layout from '../../Components/Layout';
import { Button, Card, CardBody, Image, Badge } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { ControllerIcon, PlanetColorIcon, TrophyColorIcon, ListMoneyColorIcon, LeftArrowIcon, GiftIcon } from '../../../../component/Icons'
import { Link } from 'react-router-dom';
import { useTransfer } from '../../Components/TransferContext';

function Point() {

    const navigate = useNavigate();
    const { userPoints, isLoadingPoints, fetchUserPoints } = useTransfer();

    useEffect(() => {
        fetchUserPoints();
    }, [])

    return (
        <Layout>
            <div className="relative w-full">
                <div className="w-full h-3/4">
                    <Button
                        isIconOnly
                        variant="light"
                        className="absolute top-4 left-4 z-20 bg-white rounded-full shadow-lg"
                        onPress={() => navigate(-1)}
                    >
                        <LeftArrowIcon width={16} />
                    </Button>
                    <Image
                        alt="Image"
                        src="/img/background-2.jpeg"
                        className="w-full h-full object-cover rounded-b-3xl rounded-t-none"
                    />
                </div>
                <section className="absolute top-24 left-1/2 transform -translate-x-1/2 w-11/12 z-20 space-y-2">
                    <Card radius="lg" shadow="none" className="bg-[#fcf9e3] shadow-sm p-2 rounded-xl">
                        <div className="grid grid-cols-1 items-center">
                            <div>
                                <p className="text-xl font-semibold">
                                    คะแนน <span className="text-blue-600 font-bold">{userPoints.total_points}</span>
                                </p>
                                <p className="text-md text-gray-500">
                                    โอนคะแนนง่ายๆ เพิ่มพลังบวกให้ทุกคน
                                </p>
                            </div>
                        </div>
                        <div className="border-t-2 border-dashed border-gray-300 my-2"></div>
                        <div className="mt-2">
                            <Button className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold text-lg"
                                fullWidth onPress={() => navigate('/WeOne-Transfer')}>
                                โอนเลย
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            หากการโอนคะแนนของคุณไม่ได้เปิดใช้งานทุกวัน คะแนนของคุณจะถูกหักโดยอัตโนมัติโดยระบบ โปรดเปิดใช้งานการโอนคะแนนทุกวัน
                        </p>
                    </Card>
                    <p className='text-xl font-bold py-2'>เมนูอื่นๆ</p>
                    <section className="grid grid-cols-3 gap-4 mt-6">

                        <Card isPressable shadow='none' className="flex flex-col items-center p-4 bg-[#e4f2ff] rounded-xl shadow-sm">
                            <div className="relative flex items-center justify-center bg-white p-2 rounded-lg ">
                                <span className="text-2xl"><ControllerIcon width={40} height={40} /></span>
                            </div>
                            <span className="text-md font-semibold mt-2">ท้าสู้</span>
                        </Card>

                        <Card isPressable shadow='none' className="flex flex-col items-center p-4 bg-orange-100 rounded-xl shadow-sm"
                            as={Link}
                            to="/WeOne-Ranking">
                            <div className="relative flex items-center justify-center bg-white p-2 rounded-lg">
                                <span className="text-2xl"><TrophyColorIcon width={40} height={40} /></span>
                            </div>
                            <span className="text-md font-semibold mt-2">อันดับ</span>
                        </Card>

                        <Card isPressable shadow='none' className="flex flex-col items-center p-4 bg-green-100 rounded-xl shadow-sm"
                            as={Link}
                            to="/WeOne-History">
                            <div className="relative flex items-center justify-center bg-white p-2 rounded-lg" >
                                <span className="text-2xl"><ListMoneyColorIcon width={40} height={40} /></span>
                            </div>
                            <span className="text-md font-semibold mt-2">ประวัติ</span>
                        </Card>

                        <Card isPressable shadow='none' className="flex flex-col items-center p-4 bg-purple-100 rounded-xl shadow-sm"
                            as={Link}
                            to="/WeOne-Reward">
                            <div className="relative flex items-center justify-center bg-white p-2 rounded-lg" >
                                <span className="text-2xl"><GiftIcon width={40} height={40} /></span>
                            </div>
                            <span className="text-md font-semibold mt-2">แลกรางวัล</span>
                        </Card>

                        {/* <Card isPressable shadow='none' className="flex flex-col items-center p-4 bg-purple-100 rounded-xl shadow-sm" onPress={() => navigate('/WeOne-Rules')}>
                            <div className="relative flex items-center justify-center bg-white p-2 rounded-lg">
                                <span className="text-2xl"><ControllerIcon width={40} height={36} /></span>
                            </div>
                            <span className="text-md font-semibold mt-2">กฎต่างๆ</span>
                        </Card> */}
                    </section>
                </section>
            </div>
        </Layout>
    );
}

export default Point;
