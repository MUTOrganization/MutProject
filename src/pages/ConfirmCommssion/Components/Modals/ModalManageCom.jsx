import React from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { formatNumberInput } from '../../../../component/FormatNumber'
import fetchProtectedData from '../../../../../utils/fetchData'
import { URLS } from '../../../../config'
import { toast } from 'sonner'
import { calculate } from '../../../../component/Calculate'

function ModalManageCom({ isOpen, onClose, data, cal, formatNumber, calculateCom, currentUser, dateRange, getCutCommssionDate, validateUser, confirmCommssionData,
    setIsActionEdit, selectAgent, isCutoffDateReached }) {
    
    const calculatePercentage = () => {
        if (data && data.data.netIncome !== 0) {
            return Math.round((data.data.commission / data.data.netIncome) * 100);
        }
        return 0;
    };
    
    const percent = calculatePercentage();
    const pluseValue = 'font-bold underline underline-offset-4 text-blue-500'
    const headerValue = 'font-bold text-blue-500'

    const InsertData = async () => {
        const url = `${URLS.commission.confirmCommission}/insertMonthlyCommssion`
        try {
            const res = await fetchProtectedData.post(url, {
                username: data.username,
                depName: data.depName,
                commission: data.data.commission,
                incentive: data.data.incentive,
                percentage: percent,
                create_By: currentUser.userName,
                businessId: selectAgent,
                monthIndex: `${dateRange.start.year}-${String(dateRange.start.month).padStart(2, '0')}`,
                yearIndex: `${dateRange.start.year}`,
                status: 1
            })
            console.log('Respone Data : ', res.data)
            setIsActionEdit(true)
            toast.success('ยืนยันสำเร็จ', { position: 'top-right' });
        } catch (error) {
            console.log('Insert Fail : ', error)
        }
    }

    const isCurrentMonth = () => {
        const selectedDate = new Date(dateRange.start);
        const selectedMonth = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}`;
        return selectedMonth
    };

    const deleteData = async () => {
        const url = `${URLS.commission.confirmCommission}/editMonthlyCommssion`
        try {
            const ids = confirmCommssionData.find(e => e.username === data.username && e.monthIndex === `${dateRange.start.year}-${String(dateRange.start.month).padStart(2, '0')}`)?.id
            const res = await fetchProtectedData.post(url, {
                id: ids,
            })
            console.log('Respone Data : ', res.data)
            setIsActionEdit(true)
            toast.success('ลบข้อมูลสำเร็จ', { position: 'top-right' });

        } catch (error) {
            console.log('Delete Fail : ', error)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onClose} size='xl' className='relative' scrollBehavior='inside'>
                <ModalContent className=''>
                    <ModalHeader>
                        <div>
                            <span className='text-slate-400'>{data.username.toUpperCase()}</span>
                        </div>
                    </ModalHeader>

                    <ModalBody className=''>
                        <div className='px-2 space-y-3'>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>เงินเข้าแอดมิน</span>
                                <span>{formatNumber(calculate("+", data.data.adminPaidIncome, data.data.upsalePaidIncome))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>เงินเข้าอัพเซล</span>
                                <span>{formatNumber(calculate("+", data.data.adminLiftIncome, data.data.upsaleLiftIncome))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดเงินเข้า</span>
                                <span className={`${pluseValue}`}>{formatNumber(calculate("+", data.data.adminPaidIncome, data.data.upsalePaidIncome))}</span>
                            </div>

                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกแอดมิน</span>
                                <span>{formatNumber(data.data.adminLiftIncome)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกอัพเซล</span>
                                <span>{formatNumber(data.data.upsaleLiftIncome)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดยก</span>
                                <span className={`${pluseValue}`}>{formatNumber(calculate("+", data.data.adminLiftIncome, data.data.upsaleLiftIncome))}</span>
                            </div>
                            {/*  */}
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกไปเดือนหน้า</span>
                                <span>{formatNumber(calculate("+", data.data.adminNextLiftIncome, data.data.upsaleNextLiftIncome, data.data.adminUnpaid, data.data.upsaleUnpaid))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>เงินเข้าแล้ว</span>
                                <span className={`${pluseValue}`} >{formatNumber(calculate("+", data.data.adminNextLiftIncome, data.data.upsaleNextLiftIncome))}</span>
                            </div>
                            {/* <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดยกไปเดือนหน้า</span>
                                <span className={`${pluseValue}`}>{formatNumber(data.iftingBalanceNextMonth)}</span>
                            </div> */}
                            {/*  */}
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ค่าส่งแอดมินไปเดือนหน้า</span>
                                <span>{formatNumber(data.adminNextLiftDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ค่าส่งอัพเซลไปเดือนหน้า</span>
                                <span>{formatNumber(data.upsaleNextLiftDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดยกค่าส่งไปเดือนหน้า</span>
                                <span className={`${pluseValue}`}>{formatNumber(calculate("+", data.data.adminNextLiftDelivery, data.data.upsaleNextLiftDelivery))}</span>
                            </div>
                            {/*  */}
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดค่าส่งแอดมิน</span>
                                <span>{formatNumber(data.data.adminDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดค่าส่งอัพเซล</span>
                                <span>{formatNumber(data.data.upsaleDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ค่าส่งสุทธิ</span>
                                <span className={`${pluseValue}`}>{formatNumber(calculate("+", data.data.adminDelivery, data.data.upsaleDelivery))}</span>
                            </div>

                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกค่าส่งแอดมิน</span>
                                <span>{formatNumber(data.data.adminLiftDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกค่าส่งอัพเซล</span>
                                <span>{formatNumber(data.data.upsaleLiftDelivery)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดยกค่าส่ง</span>
                                <span className={`${pluseValue}`}>{formatNumber(calculate("+", data.data.adminLiftDelivery, data.data.upsaleLiftDelivery))}</span>
                            </div>

                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดเงินเข้า</span>
                                <span>{formatNumber(calculate("+", data.data.adminPaidIncome, data.data.upsalePaidIncome))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยก</span>
                                <span>{formatNumber(calculate("+", data.data.adminLiftIncome, data.data.upsaleLiftIncome))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดเงินเข้าสุทธิ</span>
                                <span className={`${pluseValue}`}>{formatNumber(
                                    calculate("+",
                                        calculate("+", data.data.adminPaidIncome, data.data.adminLiftIncome || 0),
                                        calculate("+", data.data.upsalePaidIncome, data.data.upsaleLiftIncome || 0)
                                    )
                                )}</span>
                            </div>

                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ค่าส่งสุทธิ</span>
                                <span>{formatNumber(calculate("+", data.data.adminDelivery, data.data.upsaleDelivery))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดยกค่าส่ง</span>
                                <span>{formatNumber(calculate("+", data.data.adminLiftDelivery, data.data.upsaleLiftDelivery))}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดค่าส่งสุทธิ</span>
                                <span className={`${pluseValue}`}>{formatNumber(
                                    calculate("+",
                                        calculate("+", data.data.adminDelivery, data.data.upsaleDelivery),
                                        calculate("+", data.data.adminLiftDelivery, data.data.upsaleLiftDelivery)
                                    )
                                )}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ค่าปรับ</span>
                                <span className={`${pluseValue}`}>{formatNumber(data.data.finedAmount)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดเงินเข้าสุทธิ</span>
                                <span className={`text-slate-600`}>{formatNumber(
                                    calculate("+",
                                        calculate("+", data.data.adminPaidIncome, data.data.adminLiftIncome || 0),
                                        calculate("+", data.data.upsalePaidIncome, data.data.upsaleLiftIncome || 0)
                                    )
                                )}</span>                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className='text-slate-600'>ยอดค่าส่งสุทธิ</span>
                                <span className='text-slate-600'>{formatNumber(
                                    calculate("+",
                                        calculate("+", data.data.adminDelivery, data.data.upsaleDelivery),
                                        calculate("+", data.data.adminLiftDelivery, data.data.upsaleLiftDelivery)
                                    )
                                )}</span>                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>ยอดเงินสุทธิ</span>
                                <span className={`${pluseValue}`}>{formatNumber(data.data.netIncome)}</span>
                            </div>
                            <div className='flex flex-row text-sm justify-between'>
                                <span className={`${headerValue}`}>Incentive</span>
                                <span className={`${pluseValue}`}>{formatNumber(data.data.incentive)}</span>
                            </div>
                        </div>
                        <div className='flex flex-row text-sm sticky bottom-0 justify-between bg-green-100 py-2.5 px-2 text-green-500 rounded-md mt-1'>
                            <span>ค่าคอม ({percent} %)</span>
                            <span className='font-bold'>{formatNumber(data.data.commission)}</span>
                        </div>
                        <hr />
                    </ModalBody>

                    <ModalFooter className='my-2 sticky bottom-0'>
                        {!isCutoffDateReached() && (
                            <span className='text-red-500 bg-red-100 lg:text-sm md:text-sm text-xs lg:px-4 md:px-4 px-3 rounded-full flex items-center'>ยังไม่สามารถยืนยันค่าคอมได้ จนกว่าจะถึงวันที่ตัดรอบ</span>
                        )}

                        {validateUser(data.username) ?
                            (<>
                                <button disabled={!isCutoffDateReached()} className={`px-7 py-1 rounded-md text-white text-sm ${!isCutoffDateReached() ? 'bg-slate-200' : 'bg-red-500'}`} onClick={() => { onClose(); deleteData(); }}>ยกเลิกการยืนยัน</button>

                            </>) :
                            (<>
                                <button disabled={!isCutoffDateReached()} className={`px-7 py-1 rounded-md text-white text-sm ${!isCutoffDateReached() ? 'bg-slate-200' : 'bg-green-500'}`} onClick={() => { onClose(); InsertData(); }}>ยืนยัน</button>
                            </>)}
                    </ModalFooter>

                </ModalContent>

            </Modal >
        </>
    )
}

export default ModalManageCom
