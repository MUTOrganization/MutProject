import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Switch, cn, Divider, Tooltip, Chip, Button } from '@nextui-org/react';
import { URLS } from '../../../config';
import { Link } from 'react-router-dom';
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function Box6({ isLoading }) {
    const {commData} = useCommissionContext()

    const [isOrderChecked, setIsOrderChecked] = useState(false);


    const orderStatus = commData.orderStatus;

    return (
        <div>
            <Card shadow="none" radius="sm">
                <CardBody>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-2'>
                        <div className='font-bold text-xl mb-4 lg:mb-0 xl:mb-0'>สถานะออเดอร์</div>
                        <div className='flex flex-row items-center gap-4'>
                            <span>ยอดขาย</span>
                            <Switch
                                isSelected={isOrderChecked}
                                onChange={(e) => {
                                    setIsOrderChecked(e.target.checked);
                                }}
                                classNames={{
                                    wrapper: "p-0 h-4 overflow-visible",
                                    thumb: cn("w-6 h-6 border-2 shadow-lg",
                                        "group-data-[hover=true]:border-primary",
                                        // selected
                                        "group-data-[selected=true]:ml-6",
                                        // pressed
                                        "group-data-[pressed=true]:w-7",
                                        "group-data-[selected]:group-data-[pressed]:ml-4",
                                    ),
                                }}
                            />
                            <span>ออเดอร์</span>
                        </div>
                    </div>
                    <Divider className="my-1" />
                    {isLoading ? (
                        <div className='flex justify-center h-full'>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <CardBody>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span>รอจัดส่ง</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.wait.count) : cFormatter(orderStatus.wait.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between'>
                                        <span>กำลังจัดส่ง</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.onDelivery.count) : cFormatter(orderStatus.onDelivery.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between'>
                                        <span>รับสินค้าแล้ว</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.finished.count) : cFormatter(orderStatus.finished.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between items-center'>
                                        <Tooltip
                                            content={`รายละเอียดตีกลับ`}
                                            color='primary'
                                            className='text-white text-md'
                                            showArrow
                                            delay={0}
                                            closeDelay={0}
                                            motionProps={{
                                                variants: {
                                                    exit: {
                                                        opacity: 0,
                                                        transition: {
                                                            duration: 0.1,
                                                            ease: "easeIn",
                                                        }
                                                    },
                                                    enter: {
                                                        opacity: 1,
                                                        transition: {
                                                            duration: 0.15,
                                                            ease: "easeOut",
                                                        }
                                                    },
                                                },
                                            }}
                                        >
                                            <Link to='/Return-Order'>
                                                <Chip color='primary' variant='flat' size='lg' radius='md'>
                                                    ตีกลับ
                                                </Chip>
                                            </Link>
                                        </Tooltip>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.returned.count) : cFormatter(orderStatus.returned.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between'>
                                        <span>ตีกลับอัพเซล</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.upsaleReturned.count) : cFormatter(orderStatus.upsaleReturned.amount)}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Box6
