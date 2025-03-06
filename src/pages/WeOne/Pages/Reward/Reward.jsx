import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import { Button, Card, CardBody, CardFooter, Image, Chip } from '@nextui-org/react';
import { LeftArrowIcon } from '../../../../component/Icons';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import { DeleteIcon, StopUsing } from '../../../../component/Icons'
import fetchProtectedData from '../../../../../utils/fetchData';
import { useAppContext } from '../../../../contexts/AppContext';
import { toastSuccess, toastError, toastWarning } from '../../../../component/Alert';
import { URLS } from '../../../../config';

function Reward() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure(false);
    const { isOpen: cartOpen, onOpen: openCart, onOpenChange: onCartOpenChange } = useDisclosure(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const currentData = useAppContext();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.weOne.getReward}`, {
                params: {
                    business_id: currentData.currentUser.businessId,
                    status: 1
                }
            });
            setData(response.data);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmitRedeem = async () => {
        setIsLoading(true);

        const redeemData = cartItems.map((item) => ({
            username: currentData.currentUser.userName,
            reward_id: item.reward_id,
            quantity: item.quantity,
        }));

        if (redeemData.length === 0) {
            toastError("ไม่มีรายการในตะกร้า!");
            onCartOpenChange(false);
            setIsLoading(false);
            return;
        }

        try {
            await fetchProtectedData.post(
                `${URLS.weOne.redeemReward}`,
                redeemData
            );
            fetchData();
            setCartItems([]);
            onCartOpenChange(false);
            toastSuccess("แลกรางวัลสำเร็จ!");
        } catch (error) {
            console.error("Error redeeming rewards:", error);
            toastWarning("คะแนนของคุณไม่เพียงพอ!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (item) => {
        setSelectedItem(item);
        onOpen();
    };

    const handleCloseModal = () => {
        onOpenChange(false);
        setSelectedItem(null);
    };

    const handleAddToCart = (item) => {
        setCartItems((prev) => {
            const existingItemIndex = prev.findIndex((cartItem) => cartItem.reward_id === item.reward_id);

            if (existingItemIndex !== -1) {
                const updatedItems = [...prev];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                return [...prev, { ...item, quantity: 1 }];
            }
        });

        setData((prevData) =>
            prevData.map((dataItem) =>
                dataItem.reward_id === item.reward_id
                    ? { ...dataItem, quantity: dataItem.quantity - 1 }
                    : dataItem
            )
        );

        onOpenChange(false);
    };

    const handleRemoveFromCart = (index) => {
        setCartItems((prev) => {
            const updatedItems = [...prev];
            const removedItem = updatedItems[index];

            setData((prevData) =>
                prevData.map((dataItem) =>
                    dataItem.reward_id === removedItem.reward_id
                        ? { ...dataItem, quantity: dataItem.quantity + 1 }
                        : dataItem
                )
            );

            if (removedItem.quantity > 1) {
                updatedItems[index].quantity -= 1;
            } else {
                updatedItems.splice(index, 1);
            }

            return updatedItems;
        });
    };

    return (
        <Layout>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Button isIconOnly variant="light" className="flex-shrink-0" onPress={() => navigate(-1)}>
                        <LeftArrowIcon width={16} />
                    </Button>
                    <h2 className="text-xl font-bold flex-grow text-center">แลกรางวัล</h2>
                    <Button color='primary' variant='flat' onPress={openCart}>
                        ตะกร้า {cartItems.length}
                    </Button>
                </div>
            </div>

            <section className="px-4">
                <div className="h-[calc(100vh-80px)] pb-24 overflow-y-auto scrollbar-hide">
                    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        {data.map((item, index) => (
                            <Card
                                key={index}
                                isPressable={item.quantity > 0}
                                isDisabled={item.quantity <= 0}
                                className={`shadow-md relative ${item.quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onPress={() => handleCardClick(item)}
                            >
                                <CardBody className="p-0 relative overflow-visible">
                                    <Image
                                        alt={item.title_reward}
                                        className="w-full object-cover h-[140px]"
                                        radius="lg"
                                        shadow="sm"
                                        src={item.image_url}
                                        width="100%"
                                    />
                                    <div className="absolute top-1 left-1 z-10">
                                        <Chip color='success' size='sm' className='text-white'>
                                            จำนวน {item.quantity}
                                        </Chip>
                                    </div>
                                </CardBody>
                                <CardFooter className="text-sm justify-between">
                                    <p className="font-bold text-xs">{item.title_reward}</p>
                                    <Chip
                                        color="success"
                                        variant="flat"
                                        size="sm"
                                        className="text-sm"
                                    >
                                        คะแนน {item.points}
                                    </Chip>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            </section>

            {/* Modal สำหรับดูรายละเอียด */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 mx-auto">รายละเอียดรางวัล</ModalHeader>
                    <ModalBody>
                        {selectedItem && (
                            <div className="text-center">
                                <Image
                                    src={selectedItem.image_url}
                                    alt={selectedItem.title}
                                    className="mx-auto rounded-lg mb-4"
                                    width="100%"
                                    height="auto"
                                />
                                <p className="text-lg font-semibold">{selectedItem.title}</p>
                                <p className="text-md text-gray-600 mt-2">{selectedItem.description || 'No Description'}</p>
                                <Chip color="success" variant="flat" size="md" className="text-md mt-2">
                                    {selectedItem.points}
                                </Chip>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={handleCloseModal}>
                            ยกเลิก
                        </Button>
                        <Button color="success" className='text-white' onPress={() => handleAddToCart(selectedItem)}>
                            เพิ่มลงตะกร้า
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal สำหรับดูรายการในตะกร้า */}
            <Modal isOpen={cartOpen} onOpenChange={onCartOpenChange}>
                <ModalContent>
                    <ModalHeader>รายการในตะกร้า</ModalHeader>
                    <ModalBody>
                        {cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2">
                                        <Image
                                            src={item.image_url}
                                            alt={item.title_reward}
                                            className="w-16 h-16 rounded-lg"
                                            objectFit="cover"
                                        />
                                        <div className="flex-grow px-4 space-y-1">
                                            <p className="font-bold text-base">{item.title_reward}</p>
                                            <div className="flex items-center space-x-2">
                                                <Chip className="text-sm" color="success" variant="flat" size="sm">
                                                    คะแนน {item.points}
                                                </Chip>
                                                <Chip className="text-sm" color="success" variant="flat" size="sm">
                                                    จำนวน {item.quantity}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                color="danger"
                                                onPress={() => handleRemoveFromCart(index)}
                                            >
                                                <StopUsing />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center">ไม่มีสินค้าในตะกร้า</p>
                        )}
                    </ModalBody>
                    {cartItems.length > 0 && (
                        <div className="px-6 pb-4">
                            <div className="flex justify-between font-semibold text-md">
                                <span>รวม</span>
                                <span>
                                    {cartItems
                                        .map((item) => {
                                            const points = typeof item.points === "number"
                                                ? item.points
                                                : parseInt(item.points.replace(/[^0-9]/g, ""));
                                            return points * item.quantity;
                                        })
                                        .reduce((sum, current) => sum + current, 0)} คะแนน
                                </span>
                            </div>
                        </div>
                    )}
                    <ModalFooter>
                        <Button color="success" className="text-white" onPress={handleSubmitRedeem}>
                            ยืนยัน
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Layout>
    );
}

export default Reward;
