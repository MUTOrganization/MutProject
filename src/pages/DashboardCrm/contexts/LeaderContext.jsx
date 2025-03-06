import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";

const LeaderContext = createContext();

export const useLeaderContext = () => useContext(LeaderContext);

export const LeaderProvider = ({ children }) => {
    const [leaderData, setLeaderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const appContext = useAppContext();
    const currentUser = appContext?.currentUser;

    const fetchLeaderData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(
                `${URLS.dashboardCrm.getLeaderData}`,
                {
                    params: {
                        username: currentUser?.userName,
                    },
                }
            );
            setLeaderData(response.data);
        } catch (error) {
            console.error("Error fetching leader data", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser?.userName]);

    useEffect(() => {
        fetchLeaderData();
    }, [fetchLeaderData]);

    return (
        <LeaderContext.Provider value={{ leaderData, isLoading, fetchLeaderData }}>
            {children}
        </LeaderContext.Provider>
    );
};
