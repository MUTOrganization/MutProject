import { useState, useEffect } from 'react';
import fetchProtectedData from './../../../../utils/fetchData';
import { URLS } from '@/config';

const useOverViewData = ({ startDate, endDate, dateMode }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(
                `${URLS.overView.getOverviewData}`,
                {
                    params: {
                        startDate,
                        endDate,
                        dateMode
                    },
                }
            );
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [startDate, endDate, dateMode]);

    return { data, isLoading, fetchData };
};

export default useOverViewData;
