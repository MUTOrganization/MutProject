import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Tooltip, Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { InfomationIcon } from '../../../component/Icons'

import { URLS } from '../../../config';
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function Box1({ isLoading }) {
    const {commData} = useCommissionContext()
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
                                    <Popover placement="bottom"
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
                                                    <span className="text-start text-nowrap">ยอดแอดมิน</span>
                                                    <span className="text-end">{cFormatter(commData.adminIncome, 2)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ยอดอัพเซล</span>
                                                    <span className="text-end">{cFormatter(commData.upsaleIncome, 2)}</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center">ยอดขาย</div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-green-600">
                                            <sup style={{ fontSize: '0.6em' }}>฿</sup>
                                            {cFormatter(commData?.adminIncome + commData?.upsaleIncome, 2)}
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

export default Box1
