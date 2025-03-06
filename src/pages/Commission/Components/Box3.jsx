import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Tooltip, Popover, PopoverTrigger, PopoverContent, Button, Switch, cn } from '@nextui-org/react';
import { URLS } from '../../../config';
import { InfomationIcon } from '../../../component/Icons'
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function Box3({ isLoading }) {
    const [isAfterCost, setIsAfterCost] = useState(false);
    const {commData} = useCommissionContext();
    const totalIncome = commData?.adminIncome + commData?.upsaleIncome;
    const totalDelivery = commData?.adminDelivery + commData?.upsaleDelivery + commData?.adminNextLiftDelivery + commData?.upsaleNextLiftDelivery;
    return (
        <div>
            <Card shadow="none" radius="sm">
                <CardBody>
                    {isLoading ? (
                        <div className="flex justify-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                {/* Switch และปุ่ม Info */}
                                <div className="absolute top-0 right-1 flex items-center gap-2">
                                    <Switch
                                        isSelected={isAfterCost}
                                        onChange={(e) => setIsAfterCost(e.target.checked)}
                                        classNames={{
                                            wrapper: "p-0 h-4 overflow-visible",
                                            thumb: cn(
                                                "w-6 h-6 border-2 shadow-lg",
                                                "group-data-[hover=true]:border-primary",
                                                "group-data-[selected=true]:ml-6",
                                                "group-data-[pressed=true]:w-7",
                                                "group-data-[selected]:group-data-[pressed]:ml-4"
                                            ),
                                        }}
                                    />
                                    <Popover placement="bottom" offset={10}>
                                        <PopoverTrigger>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="primary"
                                            >
                                                <InfomationIcon size={24} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="text-right">
                                                {!isAfterCost ? (
                                                    <>
                                                        <div className="text-right">
                                                            <div className="grid grid-cols-2 gap-2 text-lg">
                                                                <span className="text-start whitespace-nowrap">ยอดแอดมินหลังหักค่าส่ง</span>
                                                                <span className="text-end">{cFormatter(commData.adminIncome - (commData.adminDelivery + commData.adminNextLiftDelivery), 2)}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-lg">
                                                                <span className="text-start whitespace-nowrap">ยอดอัพเซลหลังหักค่าส่ง</span>
                                                                <span className="text-end">{cFormatter(commData.upsaleIncome - (commData.upsaleDelivery + commData.upsaleNextLiftDelivery), 2)}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="text-right">
                                                            <div className="grid grid-cols-2 gap-4 text-lg">
                                                                <span className="text-start text-nowrap">ค่าส่งแอดมิน</span>
                                                                <span className="text-end">{cFormatter(commData.adminDelivery + commData.adminNextLiftDelivery, 2)}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 text-lg">
                                                                <span className="text-start text-nowrap">ค่าส่งอัพเซล</span>
                                                                <span className="text-end">{cFormatter(commData.upsaleDelivery + commData.upsaleNextLiftDelivery, 2)}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* เนื้อหาหลัก */}
                                {!isAfterCost ? (
                                    <div className="flex justify-center items-center">
                                        <div className="font-bold p-2 text-2xl text-center mt-9 sm:mt-0">
                                            ยอดหลังหักค่าส่ง
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <div className="font-bold p-2 text-2xl text-center mt-9 sm:mt-0">
                                            ค่าส่ง
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* แสดง CardBody ตามสถานะของ Switch */}
                            {!isAfterCost ? (
                                <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                    <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                        <div className="text-center">
                                            <span className="text-4xl font-bold text-green-600">
                                                <sup style={{ fontSize: '0.6em' }}>฿</sup>
                                                {cFormatter(totalIncome - totalDelivery, 2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            ) : (
                                <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                    <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                        <div className="text-center">
                                            <span className="text-4xl font-bold text-green-600">
                                                <sup style={{ fontSize: '0.6em' }}>฿</sup>
                                                {cFormatter((totalDelivery), 2)}
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Box3
