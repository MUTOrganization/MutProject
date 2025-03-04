import React, { useState } from 'react';
import { Card, CardBody, Spinner, Popover, PopoverTrigger, PopoverContent, Button, Switch } from '@nextui-org/react';
import { InfomationIcon } from '../../../component/Icons'
import { useCommissionContext } from '../CommissionContext';
import { cFormatter } from '../../../../utils/numberFormatter';


function commissionBox({ isLoading, onOpenModalClick }) {
    const {commData} = useCommissionContext()

    const [isShowIncentive, setIsShowIncentive] = useState(false)
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
                                <div className='absolute top-0 left-0'>
                                    <Button className='' size='sm' radius='full' color='primary' variant='flat'
                                        onPress={() => {
                                            onOpenModalClick()
                                        }}
                                    >
                                        <span>ดูข้อมูลเพิ่มเติม</span>
                                    </Button>
                                </div>
                                <div className="absolute top-0 right-1 flex items-center gap-3">
                                    <Switch size='sm' isSelected={isShowIncentive} onValueChange={() => {
                                        setIsShowIncentive(!isShowIncentive)
                                    }}>
                                    </Switch>
                                    <Popover placement="left-start"
                                        offset={10}
                                    >
                                        <PopoverTrigger>
                                            <Button isIconOnly size="sm" variant='light' color='primary'><InfomationIcon size={24} /></Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ยอดเงินเข้า</span>
                                                    <span className="text-end">{cFormatter(commData?.adminPaidIncome + commData?.upsalePaidIncome, 2)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ยอดยก</span>
                                                    <span className="text-end">{cFormatter(commData?.adminLiftIncome + commData?.upsaleLiftIncome, 2)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ค่าส่งสุทธิ</span>
                                                    <span className="text-end">{cFormatter(commData?.totalDelivery, 2)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ค่าปรับ</span>
                                                    <span className="text-end">{cFormatter(commData?.finedAmount, 2)}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-lg">
                                                    <span className="text-start text-nowrap">ยอดเงินสุทธิ</span>
                                                    <span className="text-end">{cFormatter(commData?.netIncome, 2)}</span>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex justify-center items-center">
                                    <div className="font-bold p-2 text-2xl text-center">{isShowIncentive ? 'ค่าอินเซนทีฟ' : 'ค่าคอมมิชชัน'}</div>
                                </div>
                            </div>
                            <CardBody className="flex sm:flex-col md:grid md:grid-row gap-4 p-1">
                                <div className="flex justify-center items-center w-full h-full overflow-hidden">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-green-600">
                                            <sup style={{ fontSize: '0.6em' }}>฿</sup>{cFormatter(isShowIncentive ? commData.incentive : commData.commission,2)}
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

export default commissionBox