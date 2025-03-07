import React from 'react'
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';

function SalesBox({ isLoading }) {
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
                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center">ยอดขาย</div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-green-600">
                                            <sup style={{ fontSize: '0.6em' }}>฿</sup>
                                            {cFormatter(45000 || commData?.adminIncome + commData?.upsaleIncome, 2)}
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

export default SalesBox
