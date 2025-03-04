import React from 'react'
import RankColor from '../ConstantData'
import { formatNumber } from '@/component/FormatNumber'
import ConstantData from '../ConstantData'

function ManagerAward({ currentAwardData, conditionFirstTier }) {
  const rankColor = ConstantData.RankColor()

  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  return (
    <div className='flex flex-col space-y-4 w-full'>
      <span className='text-xl font-bold text-slate-500 mb-4'>ข้อมูลผู้ใช้ในสังกัด</span>
      <div className='flex flex-col space-y-4'>
        {currentAwardData.ownUsers?.map((user, index) => (
          <div key={index} className='flex flex-col space-y-2 rounded-md'>
            <div className='flex justify-between items-center bg-slate-100 p-4 rounded-md cursor-pointer hover:bg-slate-200 transition-colors' onClick={() => {
              const elem = document.getElementById(`details-${index}`);
              elem.style.maxHeight = elem.style.maxHeight === '0px' ? '1000px' : '0px';
              elem.style.opacity = elem.style.maxHeight === '0px' ? '0' : '1';
            }}>
              <div className='space-x-2'>
                <span className='text-slate-500'>{user.username}</span>
                <span className='text-sm px-4 py-0.5 rounded-full' style={{ backgroundColor: rankColor[user.award?.medalName]?.bc, color: rankColor[user.award?.medalName]?.textColor }}>{user.award?.medalName}</span>
              </div>
              <div className='flex flex-row items-center space-x-4'>
                <span className='text-slate-600'><span className='text-sm'>ยอดขายรวม</span> : {formatNumber(user.monthlyAwards?.reduce((acc, data) => acc + data.totalSale, 0))}</span>
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div id={`details-${index}`} style={{
              maxHeight: '0px',
              opacity: 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out'
            }} className="bg-white py-2 rounded-md">
              <div className="space-y-2">
                {user.monthlyAwards?.map((monthData, mIndex) => (
                  <div key={mIndex} className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-md space-y-2">
                    <span className="text-slate-600">เดือน {months[monthData.month - 1]}</span>
                    <span className="text-slate-700"><span className='text-sm'>ยอดขาย</span> : {formatNumber(monthData.totalSale)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          // <div key={index} className='flex flex-col space-y-2 rounded-md'>
          //   <div className='flex justify-between items-center'>
          //     <div className='space-x-2'>
          //       <span className='text-slate-500'>{user.username}</span>
          //       <span className='text-sm px-4 py-0.5 rounded-full' style={{ backgroundColor: rankColor[user.award?.medalName]?.bc, color: rankColor[user.award?.medalName]?.textColor }}>{user.award?.medalName}</span>
          //     </div>
          //     <span>ยอดขายรวม :  {formatNumber(user.monthlyAwards?.reduce((acc, data) => acc + data.totalSale, 0))}</span>
          //   </div>
          // </div>
        ))}
      </div>

      <div className=' py-4'>
        <hr className='' />
      </div>

      <div>
        <div className="mt-4">
          <span className="text-lg font-semibold text-slate-500">สรุปจำนวนรางวัลแต่ละระดับ</span>
          <div className="mt-2 space-y-2">
            {conditionFirstTier[0]?.map((tierData, index) => {
              const countUsers = currentAwardData.ownUsers?.filter(user =>
                user.award?.medalId === tierData.condition[0].medalId
              ).length;

              return (
                <div key={index} className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-md">
                  <span className="text-slate-600">
                    Tier {tierData.tier}
                    <span className="text-sm text-slate-400 ml-2">
                      (Medal ID: {tierData.condition[0].medalId})
                    </span>
                  </span>
                  <span className="font-medium text-slate-700">
                    {countUsers} คน
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagerAward
