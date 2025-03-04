import React, { useState } from 'react'
import { FaArrowRight, FaGift } from 'react-icons/fa';
import ModalShowAllAwards from '../Modals/ModalShowAllAwards';

function Box4({ getAwards , currentAwardData }) {
  const [isopenModal, setIsOpenModal] = useState(false)

  return (
    <div onClick={() => setIsOpenModal(true)} className='bg-white rounded-md shadow-sm p-4 max-h-screen flex flex-row justify-between space-x-4 items-center py-4 cursor-pointer'>
      <div className='flex flex-row space-x-4 items-center'>
        <div className='bg-blue-100 rounded-md p-3'>
          <FaGift className='text-blue-500 text-3xl' />
        </div>
        <span className='text-lg text-slate-600'>ดูรางวัลทั้งหมด</span>
      </div>
      <FaArrowRight />

      {isopenModal && (
        <ModalShowAllAwards
          isOpen={isopenModal}
          awardsData={getAwards}
          currentAwardData={currentAwardData}
          onClose={() => setIsOpenModal(false)}
        />
      )}
    </div>
  )
}

export default Box4
