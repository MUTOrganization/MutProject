import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner , Switch , cn , Divider , Tooltip , Progress} from '@nextui-org/react';
import { URLS } from '../../../config';
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function Box5({ isLoading, dateRange, selectedEmployee }) {
    const {commData} = useCommissionContext();
    const [isOrderMoneyChecked, setIsOrderMoneyChecked] = useState(false);

    const sumOrderTypes = commData.paymentTypes.reduce((prev, curr) => {
        prev.income += curr.income;
        prev.paidIncome += curr.paidIncome;
        prev.orderCount += curr.orderCount;
        prev.paidOrderCount += curr.paidOrderCount;
        return prev;
    },{type: 'all', income: 0, paidIncome: 0, orderCount: 0, paidOrderCount: 0});

    const progressbarColors = ['bg-success','bg-primary','bg-secondary', 'bg-warning', 'bg-danger'];
    return (
        <div>
            <Card shadow="none" radius="sm">
                <CardBody>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-2'>
                        <div className='font-bold text-xl mb-4 lg:mb-0 xl:mb-0'>สถานะการชำระเงิน</div>
                        <div className='flex flex-row items-center gap-4'>
                            <span>ยอดขาย</span>
                            <Switch
                                isSelected={isOrderMoneyChecked}
                                onChange={(e) => setIsOrderMoneyChecked(e.target.checked)}
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
                    <CardBody>
                        {isLoading ? (
                            <div className='flex justify-center h-full'>
                                <Spinner />
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                <ProgressBar title={'ยอดรวม'} 
                                    value={!isOrderMoneyChecked ? sumOrderTypes.paidIncome : sumOrderTypes.paidOrderCount} 
                                    maxValue={!isOrderMoneyChecked ? sumOrderTypes.income : sumOrderTypes.orderCount} 
                                    isCurrency={!isOrderMoneyChecked}
                                    color={progressbarColors[0]}
                                />
                                {commData.paymentTypes.map((type, index) => {
                                    return(
                                        <ProgressBar key={type.type} title={type.type}
                                            value={!isOrderMoneyChecked ? type.paidIncome : type.paidOrderCount}
                                            maxValue={!isOrderMoneyChecked ? type.income : type.orderCount}
                                            isCurrency={!isOrderMoneyChecked}
                                            color={progressbarColors[index + 1]}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </CardBody>
                </CardBody>
            </Card>
        </div>
    )
}

export default Box5


function ProgressBar({title, value, maxValue, color = 'success', isCurrency = true}){
    const decimalPlaces = isCurrency ? 0 : 0;
    return(
        <div className='space-y-1'>
            <div className='flex justify-between '>
                <span>{title}</span>
                <span>
                    {cFormatter(value, decimalPlaces)} / {cFormatter(maxValue, decimalPlaces)}
                </span>
            </div>
            <Tooltip
                content={`รอชำระ ${cFormatter(maxValue - value, decimalPlaces)}`}
                color={color}
                className='text-white text-md'
                classNames={{
                    base: `before:${color}`,
                    content: `${color}`,
                }}
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
                <Progress aria-label="Loading..." 
                    value={value} maxValue={maxValue} 
                    // color={color} 
                    classNames={{
                        indicator: `${color}`
                    }}
                />
            </Tooltip>
        </div>
    )
}
