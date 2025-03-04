import { Progress, Select, SelectItem, Spinner, Tooltip } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import fetchProtectedData from '../../../../utils/fetchData';
import { URLS } from '../../../config';
import { formatNumber } from '../../../component/FormatNumber';
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import RankColor from '../ConstantData';
import ModalRankInfo from '../Modals/ModalRankInfo';
import ManagerAward from './ManagerAward';
import ConstantData from '../ConstantData';

function Box2({ currentAwardData, selectYear, getConditions, getMedals, currentUser , isLoading }) {
    const currentMonth = new Date().getMonth() + 1;
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const [selectData, setSelectData] = useState([])
    const [conditionFirstTier, setConditionFirstTier] = useState([])
    const [relatedData, setRelatedData] = useState([]);
    const [openModalInfo, setOpenModalInfo] = useState(false)
    const rankColor = ConstantData.RankColor();

    useEffect(() => {
        setConditionFirstTier(getConditions.map(item => item.condition))
    }, [selectYear, getConditions])
    
    return (
        <div className='bg-white rounded-md shadow-sm p-6 px-8 flex flex-row justify-start items-start h-full space-x-8'>
            {!currentAwardData || currentAwardData.length === 0 ? (
                <div className='text-slate-500 text-center w-full'>ไม่พบข้อมูล</div>
            ) : currentAwardData.type === 'no condition' ? (
                <div className='text-slate-500 text-center w-full'>ยังไม่มีข้อมูล</div>
            ) : currentAwardData.type === 'OwnUser' ? (
                <ManagerAward currentAwardData={currentAwardData} conditionFirstTier={conditionFirstTier} />
            ) : (
                <>
                    {isLoading ? (<div className='flex justify-center items-center w-full'><Spinner /></div>) : (
                        <>
                    <div className="flex flex-col items-start w-full border-r-2 border-slate-100 overflow-y-auto h-[600px] pr-4 scrollbar-hide">
                        {months.map((monthName, monthIndex) => {
                            const awardData = currentAwardData.monthlyAwards?.find(item => item.month === monthIndex + 1);
                            return (
                                <div key={monthIndex} onClick={() => setSelectData(awardData)} className='mt-4 relative w-10/12'>
                                    <div className={`cursor-pointer hover:bg-slate-100 flex items-center py-4 px-4 rounded-md w-full border-1 border-slate-200 shadow-sm ${awardData && awardData.month >= currentMonth  ? 'bg-slate-50' : 'bg-slate-50'}`}>
                                        <div className={`rounded-full md:w-8 lg:w-8 h-7 z-50 flex items-center justify-center text-white text-sm ${awardData && awardData?.month == currentMonth  ? 'bg-blue-500' : awardData?.month < currentMonth ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                            {monthIndex + 1}
                                        </div>
                                        <div className={`flex flex-col md:flex-col lg:flex-row ms-4 justify-between w-full text-slate-500`}>
                                            <div>
                                                <span>{monthName}</span>
                                                <div className=''>
                                                    {awardData ? `ยอดขาย  ${formatNumber(awardData.totalSale)}` : 'ไม่มียอดขาย'}
                                                </div>
                                            </div>
                                            <div className='flex items-center'>
                                                <span className='px-2 rounded-md text-sm ' style={{
                                                    backgroundColor: rankColor[awardData?.award?.name]?.bc || "#fecaca",
                                                    color: rankColor[awardData?.award?.name]?.textColor || "#ef4444",
                                                }}>
                                                    {awardData && awardData?.award ? awardData?.award?.name : "ไม่มีรางวัล"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {monthIndex < months.length - 1 && (
                                        <div className={`absolute left-7 w-1 ${monthIndex === 0 ? 'h-28 lg:top-7 md:top-10' : 'md:h-36 lg:h-32 top-0'} bg-slate-200`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className='flex flex-col items-start space-y-4 mt-4 w-10/12'>
                        <span className='text-xl font-bold text-slate-500'>ความคืบหน้า</span>
                        <div className='flex flex-row justify-between w-full pb-3'>
                            <div className='space-x-3'>
                                <span className=''>เดือน :</span>
                                <span className='text-md'>
                                    {selectData && selectData.month ? months[selectData.month - 1] : 'เลือกเดือน'}
                                </span>
                            </div>
                            <span>ยอดขาย {selectData && formatNumber(selectData.totalSale)} บาท</span>
                        </div>
                        {getMedals
                            .filter(item => item.name === "Silver" || item.name === "Gold")
                            .map((item, index) => {
                                const condition = getConditions.find(outCondition =>
                                    outCondition.condition.some(inCondition =>
                                        inCondition.condition?.some(c => c.medalId === item.id)
                                    )
                                )?.condition.filter(inCondition =>
                                    inCondition.condition?.some(c => c.medalId === item.id)
                                );

                                const maxValue = condition ? condition.reduce((sum, cond) => sum + (cond.amount || 0), 0) : 0;

                                return (
                                    <div key={index} className='flex flex-col space-y-4 w-full'>
                                        <div className='flex flex-col justify-center items-start w-full space-y-2 mb-2'>
                                            <div className='flex justify-between items-center space-x-3 w-full pb-1'>
                                                <div className='space-x-2'>
                                                    <span>{item.name}</span>
                                                    <span className={`text-sm py-0.5 px-2 rounded-md ${condition && condition[0].amount < selectData?.totalSale ? 'text-green-500 bg-green-100' : 'text-red-400 bg-red-100'}`}>{condition && condition[0].amount < selectData?.totalSale ? 'สำเร็จ' : 'ไม่สำเร็จ'}</span>
                                                </div>
                                                <span className='text-sm text-slate-500'>
                                                    ยอดขาย :  {condition ? `${selectData?.totalSale > condition[0].amount ? `${formatNumber(condition[0].amount)}` : `${formatNumber(selectData?.totalSale)}`} / ${formatNumber(condition[0].amount)}` : 'ยังไม่มีเงื่อนไข'}
                                                </span>
                                            </div>
                                            <Progress
                                                className="w-full"
                                                color="warning"
                                                maxValue={maxValue}
                                                size="sm"
                                                value={selectData?.totalSale}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        <div className='border-b-2 border-slate-100 w-full py-2'></div>
                        <div className='w-full pt-4'>
                            <div className='flex flex-row justify-between items-center w-full'>
                                <span className='text-xl w-full font-bold text-slate-500'>ภาพรวม</span>
                            </div>
                            <div className='mt-4 flex flex-col space-y-4 w-full'>
                                {(() => {
                                    const tierCounts = conditionFirstTier[0]?.reduce((acc, condition) => {
                                        const count = currentAwardData?.monthlyAwards?.filter(item => item.totalSale >= condition.amount).length;
                                        const medal = getMedals.find(m => m.id === condition.condition[0]?.medalId);
                                        const OutMedalName = getMedals.filter(item => item.name !== 'Silver' && item.name !== 'Gold' && item.name !== 'test').map(item => item.name)
                                        acc[condition.tier] = {
                                            count,
                                            name: medal ? medal.name : `Tier ${condition.tier}`,
                                            outName: OutMedalName
                                        };
                                        return acc;
                                    }, {});
                                    return (
                                        <div className='w-full flex flex-col space-y-4'>
                                            {tierCounts &&
                                                Object.entries(tierCounts).map(([tier, data]) => (
                                                    <>
                                                        <div key={tier} className='flex flex-col space-y-2'>
                                                            <div className='flex flex-row justify-between items-center'>
                                                                <div className=''>
                                                                    <span>{data.name}</span>
                                                                </div>
                                                                <span className='pe-2'>{data.count} เดือน</span>
                                                            </div>
                                                            <div className='flex flex-row space-x-1'>
                                                                {Array.from({ length: months.length }).map((_, index) => (
                                                                    <div key={index}
                                                                        className={`h-2 w-full ${index === 0 && 'rounded-l-md'} ${index === 11 && 'rounded-r-md'} ${index < data.count ? 'bg-yellow-400' : 'bg-slate-200'
                                                                            }`}
                                                                    >
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {tier === '0' && data.outName[0] && (
                                                            <div className='flex justify-center space-x-3 items-center py-1 bg-slate-100 rounded-full'>
                                                                <span className='text-slate-600'>{data.outName[0]}</span>
                                                                <FaArrowRight />
                                                                <span className='text-slate-500'>ต้องการ Silver  <span className='text-green-500'>{data.count} / 12</span> เดือน </span>
                                                            </div>
                                                        )}
                                                        {tier === '1' && data.outName[1] && (
                                                            <div className='flex justify-center space-x-3 items-center py-1 bg-slate-100 rounded-full'>
                                                                <span className='text-[#10b981]'>{data.outName[1]}</span>
                                                                <FaArrowRight />
                                                                <span className='text-slate-500'>ต้องการ Gold  <span className='text-green-500'>{data.count} / 12</span> เดือน </span>
                                                            </div>
                                                        )}
                                                    </>
                                                ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {openModalInfo && (
                <ModalRankInfo
                    isOpen={openModalInfo}
                    onClose={() => setOpenModalInfo(false)}
                    currentAwardData={currentAwardData}
                    conditionFirstTier={conditionFirstTier}
                    getMedals={getMedals}
                    />
                )}
            </>
            )}
        </div>
    )
}

export default Box2
