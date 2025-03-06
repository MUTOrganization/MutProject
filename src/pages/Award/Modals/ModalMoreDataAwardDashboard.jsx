import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import RankColor from '../ConstantData';
import { formatNumber } from '@/component/FormatNumber';
import { color } from 'framer-motion';
import { Button } from '@nextui-org/button';
import ConstantData from '../ConstantData';

function ModalMoreDataAwardDashboard({ isOpen, onClose, selectedData }) {
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const rankColor = ConstantData.RankColor()
    console.log(selectedData)
    return (
        <Modal isOpen={isOpen} onClose={onClose} isKeyboardDismissDisabled size='xl'>
            <ModalContent className='px-2'>
                <ModalHeader className=''>
                    <div className='flex flex-col space-y-1 w-full'>
                        <span>ข้อมูลรายเดือน</span>
                        <span className='text-sm text-slate-500'>{selectedData.username} ({selectedData.type})</span>
                        {/* <span className='text-sm text-center w-3/12 rounded-full' style={{ backgroundColor : rankColor[selectedData.award?.medalName]?.bc }}>{selectedData.award?.medalName}</span> */}
                    </div>
                </ModalHeader>
                <ModalBody className=''>
                    {selectedData.type !== 'no condition' ? (
                    <div className='space-y-4'>
                        <div className='flex flex-row justify-between items-center py-2 px-4 rounded-md bg-slate-50'>
                            <span className='text-slate-500'>เหรียญที่ได้รับ</span>
                            <span className='px-4 py-0.5 rounded-md' style={{ backgroundColor: rankColor[selectedData.award?.medalName]?.bc || "#fecaca", color: rankColor[selectedData.award?.medalName]?.textColor || "#ef4444" }}>{selectedData.award?.medalName || 'ยังไม่ได้รับเหรียญ'}</span>
                        </div>
                        {selectedData?.monthlyAwards?.map((item, index) => (
                            <>
                                <div className='flex flex-row justify-between items-center border-b-1 border-slate-100'>
                                    <div className='flex flex-col justify-center'>
                                        <span className='text-sm text-slate-800'>{months[item.month - 1]}</span> 
                                        <span className='text-sm text-slate-500'>ยอดขาย : {formatNumber(item.totalSale)}</span>
                                    </div>
                                    <span className='text-sm px-4 py-0.5 rounded-full' style={{ backgroundColor: rankColor[item.award?.name]?.bc || "#fecaca", color: rankColor[item.award?.name]?.textColor || "#ef4444" }}>{item.award?.name || 'ไม่ได้รางวัล'}</span>
                                </div>
                            </>
                        ))}
                    </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center h-full'>No Data</div>
                    )}
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalMoreDataAwardDashboard
