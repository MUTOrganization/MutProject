import React, { useEffect, useState } from 'react'
import DefaultLayout from '../../layouts/default'
import { Image } from "@nextui-org/react";
import Box1 from './AwardComponents/Box1';
import Box2 from './AwardComponents/Box2';
import Box3 from './AwardComponents/Box3';
import Box4 from './AwardComponents/Box4';
import { URLS } from '../../config';
import fetchProtectedData from '../../../utils/fetchData';
import { useAppContext } from '../../contexts/AppContext';

function AwardBody() {
    // Other
    const { currentUser } = useAppContext()
    const [isloading, setIsLoading] = useState(false)
    // Fetch Data
    const [currentAwardData, setCurrentAwardData] = useState([])
    const [getMedals, setGetMedals] = useState([])
    const [getConditions, setGetConditions] = useState([])
    const [getAwards , setGetAwards] = useState([])
    // DateTime
    const thisYear = new Date().getFullYear()
    const firstYear = 2019;
    const [selectYear, setSelectYear] = useState(thisYear)
    
    const fetchAllData = async () => {
        setIsLoading(true)
        try {
            const [currentAwardData, getMedal, conditionAward , allAwards] = await Promise.all([
                fetchProtectedData.get(`${URLS.award.getCurrentAward}?year=${selectYear}`),
                fetchProtectedData.get(`${URLS.award.getMedals}?businessId=${currentUser.businessId}&year=${selectYear}`),
                fetchProtectedData.get(`${URLS.award.getConditions}?year=${selectYear}&baseRole=${currentUser.roleId}`),
                fetchProtectedData.get(`${URLS.award.getAwardsByRole}?year=${selectYear}&roleId=${currentUser.roleId}`)
            ])
            setCurrentAwardData(currentAwardData.data)
            setGetMedals(getMedal.data)
            setGetConditions(conditionAward.data)
            setGetAwards(allAwards.data)
            setIsLoading(false)
        } catch (error) {
            console.log('Error fetching awardData:', error);
        }finally{
        }
    }
    
    useEffect(() => {
        setCurrentAwardData([])
        setGetMedals([])
        setGetConditions([])
        setGetAwards([])
        fetchAllData()
    }, [selectYear])

    return (
        <div>
            <section title="Award">
                <div className='flex flex-col md:flex-col lg:flex-row space-x-0 md:space-x-4 lg:space-x-4'>
                    <div className='flex flex-col space-y-4 w-full'>
                        <div className='box1 w-full'>
                            <Box1 currentUser={currentUser} thisYear={thisYear} firstYear={firstYear} selectYear={selectYear} setSelectYear={setSelectYear} />
                        </div>
                        <div className='box1 w-full '>
                            <Box2 currentAwardData={currentAwardData} selectYear={selectYear} getConditions={getConditions} getMedals={getMedals} currentUser={currentUser} isLoading={isloading}/>
                        </div>
                    </div>
                    <div className='flex lg:flex-col md:flex-row space-y-4 w-full lg:w-5/12 lg:mt-0 md:mt-4 mt-4 md:w-6/12'>
                        <div className='box1 w-full'>
                            <Box3 medals={getMedals} currentAwardData={currentAwardData} />
                        </div>
                        <div className='box1 w-full'>
                            <Box4 getAwards={getAwards} currentAwardData={currentAwardData} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AwardBody
