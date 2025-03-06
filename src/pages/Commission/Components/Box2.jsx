import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Tooltip, Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { URLS } from '../../../config';
import { InfomationIcon } from '../../../component/Icons'
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function Box2({ isLoading }) {
    const { commData } = useCommissionContext();

    return (
        <div>
            <Card shadow="none" radius="sm">
                <CardBody>
                    {isLoading ? (
                        <div className='flex justify-center h-full'>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                <div className="absolute top-0 right-1">
                                    <Popover placement="left-start"
                                        offset={10}
                                        motionProps={{
                                            variants: {
                                                enter: {
                                                    y: 0,
                                                    opacity: 1,
                                                    duration: 0.1,
                                                    transition: {
                                                        opacity: {
                                                            duration: 0.15,
                                                        },
                                                    },
                                                },
                                                exit: {
                                                    y: "10%",
                                                    opacity: 0,
                                                    duration: 0,
                                                    transition: {
                                                        opacity: {
                                                            duration: 0.1,
                                                        },
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <PopoverTrigger>
                                            <Button isIconOnly size="sm" variant='light' color='primary'><InfomationIcon size={24} /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className='text-start text-nowrap'>ออเดอร์อัพเซล</span>
                                                    <span className='text-end '>{cFormatter(commData.upsaleOrderCount)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className='text-start text-nowrap'>ลูกค้าใหม่</span>
                                                    <span className='text-end'>{cFormatter(commData.newCustomerOrderCount)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className='text-start text-nowrap'>ลูกค้าเก่า</span>
                                                    <span className='text-end'>{cFormatter(commData.oldCustomerOrderCount)}</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center">ออเดอร์</div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                {/* ด้านซ้าย */}
                                <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-green-600">
                                            {/* <CountUp end={152} duration={2} formattingFn={formatCurrencyNoDollars} /> */}
                                            {cFormatter(commData.orderCount)}
                                        </span>
                                    </div>
                                </div>

                                {/* ด้านขวา */}
                            </CardBody>
                            
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default Box2
