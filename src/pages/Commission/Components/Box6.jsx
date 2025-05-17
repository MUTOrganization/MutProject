import React, { useState } from 'react'
import { Card, CardBody, Spinner, Switch, Divider } from "@heroui/react";
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '@/utils/numberFormatter';

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
                                size='sm'
                                isSelected={isOrderChecked}
                                onChange={(e) => {
                                    setIsOrderChecked(e.target.checked);
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
                                            {isOrderChecked ? cFormatter(8000 ?? orderStatus.wait.count) : cFormatter(4 ??orderStatus.wait.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between'>
                                        <span>กำลังจัดส่ง</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(4000 ?? orderStatus.onDelivery.count) : cFormatter(2 ?? orderStatus.onDelivery.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between'>
                                        <span>รับสินค้าแล้ว</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(33000 ?? orderStatus.finished.count) : cFormatter(18 ?? orderStatus.finished.amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className='space-y-2 mt-2'>
                                    <div className='flex justify-between items-center'>
                                        {/* <Tooltip
                                            content={`รายละเอียดตีกลับ`}
                                            color='primary'
                                            className='text-white text-md'
                                            showArrow
                                        >
                                            <Link to='/Return-Order'>
                                                <Chip color='primary' variant='flat' size='lg' radius='md'>
                                                    ตีกลับ
                                                </Chip>
                                            </Link>
                                        </Tooltip> */}
                                        <span>ตีกลับ</span>
                                        <span>
                                            {isOrderChecked ? cFormatter(orderStatus.returned.count) : cFormatter(orderStatus.returned.amount)}
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
