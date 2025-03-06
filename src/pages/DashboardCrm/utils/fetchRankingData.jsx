import { useState, useEffect } from 'react';
import { URLS } from '@/config';
import fetchProtectedData from '../../../../utils/fetchData';

export default function useRankingData({ startDate, endDate, ownerId, customOwnerId, dateMode }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.post(URLS.dashboardCrm.getRanking, {
                startDate,
                endDate,
                ownerId,
                customOwnerId,
                dateMode,
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching ranking data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, [startDate, endDate, ownerId, customOwnerId, dateMode]);

    return { data, isLoading, fetchData };
}
