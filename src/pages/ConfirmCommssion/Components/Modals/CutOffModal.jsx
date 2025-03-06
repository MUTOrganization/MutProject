import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import { URLS } from '../../../../config';
import fetchProtectedData from '../../../../../utils/fetchData';
import { formatDateObject, formatDateThai } from '../../../../component/DateUtiils';
import { toast } from 'sonner';
import { DatePicker } from '@nextui-org/react';

function CutOffModal({ isOpen, onClose, currentUser, selectAgent, getCutCommssionDate, action, setIsActionEdit, dateRange, setCutOffDate, cutoffDate }) {

    const isSameMonth = () => {
        if (dateRange?.start) {
            const selectedDate = new Date(cutoffDate);
            return (
                selectedDate.getFullYear() === dateRange.start.year &&
                selectedDate.getMonth() === dateRange.start.month - 1
            );
        }
        return false;
    };

    useEffect(() => {
        if (isOpen && dateRange?.start) {
            const baseDate = new Date(dateRange.start.year, dateRange.start.month - 1);
            const nextMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 3);
            const defaultDate = nextMonth.toISOString().split('T')[0];
            setCutOffDate(defaultDate);
        }
    }, [isOpen, dateRange, setCutOffDate]);

    const handleSetCutOffDate = async () => {
        const url = `${URLS.commission.confirmCommission}/setCutOffDateCommission`
        try {
            const res = await fetchProtectedData.post(url, {
                username: currentUser.userName,
                businessId: selectAgent,
                cutoff_date: `${cutoffDate}`,
                monthSet: `${dateRange.start.year}-${dateRange.start.month}`
            })
            console.log('SetDate Success ', res.data)
            setIsActionEdit(true)
        } catch (error) {
            console.log('Cannot Insert : ', error)
        } finally {
            toast.success("กำหนดวันตัดรอบเรียบร้อย", { position: 'top-right' })
        }
    }
    const handleEditCutOffDate = async () => {
        const url = `${URLS.commission.confirmCommission}/edit-cutoff-commission`
        try {
            const res = await fetchProtectedData.post(url, {
                id: getCutCommssionDate[0].id,
                cutOffDate: `${cutoffDate}`,
                monthSet: `${dateRange.start.year}-${dateRange.start.month}`,
                update_By: currentUser.userName
            })
            console.log('SetDate Success ', res.data)
            setIsActionEdit(true)
        } catch (error) {
            console.log('Cannot Edit : ', error)
        } finally {
            toast.success("แก้ไขวันตัดรอบเรียบร้อย", { position: 'top-right' })
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>

                <ModalHeader>
                    <div>
                        <span className='text-slate-500'>{action === 'add' ? 'กำหนดวันตัดรอบ' : 'เปลี่ยนวันตัดรอบ'}</span>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className='flex flex-col gap-2 text-xs w-full'>
                        <span className='text-slate-500'>เลือกวันที่</span>
                        <input
                            type='date'
                            value={cutoffDate}
                            className="input input-sm input-bordered text-slate-600 w-full h-10 hover:cursor-pointer"
                            onChange={(e) => {
                                setCutOffDate(e.target.value);
                            }}
                        />
                    </div>
                    {isSameMonth() && (
                        <span className="text-red-500 text-sm mt-2">
                            คำเตือน: วันที่ตัดรอบอยู่ในเดือนเดียวกัน กรุณาตรวจสอบอีกครั้ง
                        </span>
                    )}
                    <hr />

                </ModalBody>

                <ModalFooter className=''>
                    <button className='px-6 py-1 rounded-md text-white bg-red-500  text-sm hover:bg-red-400' onClick={onClose}>ยกเลิก</button>
                    {getCutCommssionDate.length === 0 ?
                        (<>
                            <button disabled={isSameMonth()} className={`px-6 py-1 rounded-md text-white bg-green-500  text-sm hover:bg-green-400`} onClick={() => { onClose(); handleSetCutOffDate(); }}>บันทึก</button>
                        </>) :
                        (<>
                            <button disabled={isSameMonth()} className={`px-6 py-1 rounded-md text-white bg-green-500  text-sm hover:bg-green-400`} onClick={() => { onClose(); handleEditCutOffDate(); }}>ยืนยันการเปลี่ยน</button>
                        </>)}
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}

export default CutOffModal
