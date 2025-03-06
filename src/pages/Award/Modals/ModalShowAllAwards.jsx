import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal'
import React from 'react'
import RankColor from '../ConstantData'
import ConstantData from '../ConstantData'

function ModalShowAllAwards({ isOpen, onClose, awardsData, currentAwardData }) {
  const rankColor = ConstantData.RankColor()
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='5xl'>
      <ModalContent>
        <ModalHeader>รางวัลทั้งหมด</ModalHeader>
        <ModalBody>
          {awardsData && awardsData.length > 0 ? (<>
            <div className='grid grid-cols-3 gap-4 p-4'>
              {awardsData.map((item, index) => (
                <>
                  <div key={index} className='bg-slate-100 rounded-md p-3 shadow-sm'>
                    <div className='flex flex-row justify-between items-center py-1'>
                      <span
                        className='px-3 rounded-md' style={{
                          backgroundColor: rankColor[item.medalName]?.bc || "#ffff",
                          color: rankColor[item.medalName]?.textColor || "#64748b",
                        }}
                      >
                        {item.medalName}
                      </span>
                      {currentAwardData?.earnAward?.medalName === item.medalName && (
                        <span className='px-3 py-0.5 text-sm text-blue-500 bg-blue-100 rounded-md'>รางวัลที่คุณได้</span>
                      )}
                    </div>
                    <div className='bg-white w-full rounded-md p-4 mt-2 border-1 border-slate-200 flex flex-col space-y-1'>
                      <span className='text-slate-700'>{item.awardTitle}</span>
                      <hr />
                      <span className='text-slate-500 text-sm'>{item.awardDesc}</span>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </>) : (
            <>
              <div className='flex justify-center items-center mb-8'>
                <span className='text-lg text-slate-400 font-bold'>ยังไม่มีข้อมูล</span>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ModalShowAllAwards
