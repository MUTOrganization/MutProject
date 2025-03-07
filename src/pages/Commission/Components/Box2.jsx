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
                                            {cFormatter(24 ?? commData.orderCount)}
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
