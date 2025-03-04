import React, { useState, useEffect } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardHeader, CardBody, CardFooter, Spinner, Tooltip, Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import { URLS } from '../../../config';
import { InfomationIcon } from '../../../component/Icons'

function Box4({ isLoading, dateRange, selectedEmployee, selectedDepartment }) {

    const [isTotalShippingAfterCostLoading, setIsTotalShippingAfterCostLoading] = useState(false)
    const appContext = useAppContext();
    const currentUser = appContext.currentUser

    const [totalShippingAfterCostData, setTotalShippingAfterCostData] = useState([])

    const formatDateObject = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, "0");
        const day = String(dateObj.day).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';
        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (
            <>
                <sup style={{ fontSize: '0.6em' }}>฿</sup>{formattedNumber}
            </>
        );
    };

    const formatCurrencyNoDollars = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const formatCurrencyNoDollarsWithFixed = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const number = Number(amount);
        const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${formattedNumber}`;
    };

    const fetchTotalShippingCostData = async () => {

        const startDate = dateRange.start
        const endDate = dateRange.end

        setIsTotalShippingAfterCostLoading(true);
        try {
            const response = await fetchProtectedData.post(`${URLS.commission.Box4}`, {
                startDate: formatDateObject(startDate),
                endDate: formatDateObject(endDate),
                ownerId: currentUser.businessId,
                customerOwnerId: currentUser.businessId,
                username: currentUser.userName,
                role: currentUser.role,
                selectedUser: selectedEmployee,
                department: currentUser.department,
                selectedDepartment: selectedDepartment
            });
            setTotalShippingAfterCostData(response.data);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setIsTotalShippingAfterCostLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalShippingCostData();
    }, [dateRange, selectedEmployee]);

    const totalAfterLiftAmountAdmin = totalShippingAfterCostData.getTotalAfterLiftAmountAdmin || {};

    const totalSumAfterLiftAmountAdmin =
        (parseFloat(totalAfterLiftAmountAdmin.totalAmountAfterShippingCost) || 0) +
        (parseFloat(totalAfterLiftAmountAdmin.totalUpSaleAfterShippingCost) || 0) +
        (parseFloat(totalAfterLiftAmountAdmin.totalLiftAmountAfterShippingCost) || 0) +
        (parseFloat(totalAfterLiftAmountAdmin.totalLiftUpSaleAfterShippingCost) || 0);


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
                                    <Popover placement="button"
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
                                            <div className="text-right">
                                                <div className="grid grid-cols-2 gap-2 text-lg">
                                                    <span className="text-start whitespace-nowrap">ยอดแอดมินหลังหักค่าส่ง</span>
                                                    <span className="text-end">{formatCurrencyNoDollarsWithFixed(Math.abs(parseFloat(totalAfterLiftAmountAdmin.totalAmountAfterShippingCost) || 0))}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-lg">
                                                    <span className="text-start whitespace-nowrap">ยอดอัพเซลหลังหักค่าส่ง</span>
                                                    <span className="text-end">{formatCurrencyNoDollarsWithFixed(Math.abs(parseFloat(totalAfterLiftAmountAdmin.totalUpSaleAfterShippingCost) || 0))}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-lg">
                                                    <span className="text-start whitespace-nowrap">ยอดยกแอดมินหลังหักค่าส่ง</span>
                                                    <span className="text-end">{formatCurrencyNoDollarsWithFixed(Math.abs(parseFloat(totalAfterLiftAmountAdmin.totalLiftAmountAfterShippingCost) || 0))}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-lg">
                                                    <span className="text-start whitespace-nowrap">ยอดยกอัพเซลหลังหักค่าส่ง</span>
                                                    <span className="text-end">{formatCurrencyNoDollarsWithFixed(Math.abs(parseFloat(totalAfterLiftAmountAdmin.totalLiftUpSaleAfterShippingCost) || 0))}</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center">ยอดหลังหักค่าส่ง</div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                {/* ด้านซ้าย */}
                                <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-green-500">
                                            {/* <CountUp end={228360} duration={2} formattingFn={formatCurrency} /> */}
                                            {formatCurrency(totalSumAfterLiftAmountAdmin)}
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

export default Box4
