import { Image } from '@nextui-org/react'
import React, { useState } from 'react'
import fetchProtectedData from '../../../../utils/fetchData'
import { URLS } from '../../../config'

function Box3({ medals, currentAwardData }) {
    
    // const getAward = fetchProtectedData.get(`${URLS.award.getAwardById}/${currentAwardData?.earnAward?.}`)
    return (    
        <div className='space-y-4'>
            <div className='bg-white rounded-md shadow-sm p-6 text-center flex flex-col items-center justify-center space-y-4'>
                {/* <h2 className='text-xl'>Rank</h2> */}
                <div className='flex flex-col items-center space-y-4'>
                    <div className='rounded-full'>
                        <Image
                            alt="NextUI hero Image"
                            src={currentAwardData?.earnAward?.medalImage}
                            width={160}
                        />
                    </div>
                </div>
                <span className='text-lg font-bold text-slate-500'>แรงค์ปัจจุบัน :  {currentAwardData?.earnAward?.medalName || 'ยังไม่มีแรงค์'}</span>
            </div>

            <div className='bg-white rounded-md shadow-sm p-6 text-center flex flex-col items-center justify-center space-y-4'>
                <h2 className='text-xl'>รางวัลที่ได้รับ</h2>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='rounded-full'>
                        <Image
                            alt="NextUI hero Image"
                            src={currentAwardData?.earnAward?.medalImage}
                            width={160}
                        />
                    </div>
                </div>
                <span className='text-lg font-bold text-slate-500'>{currentAwardData?.earnAward?.awardTitle || 'ยังไม่มีรางวัลที่ได้รับ'}</span>
                <span>{currentAwardData?.earnAward?.awardDesc}</span>
            </div>

        </div>
    )
}

export default Box3
