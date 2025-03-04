import { useState, useEffect } from 'react';
import fetchProtectedData from './../../../../utils/fetchData';
import { URLS } from '@/config';

const useOverViewSettingData = () => {
    const [settingData, setSettingData] = useState([]);
    const [isLoadingSetting, setIsLoadingSetting] = useState(false);

    const fetchData = async () => {
        setIsLoadingSetting(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.overView.getOverviewConfigData}`);
            setSettingData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setIsLoadingSetting(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { settingData, isLoadingSetting };
};

export default useOverViewSettingData;
