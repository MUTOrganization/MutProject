import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "@/services/authService";

const AppContext = createContext({
    /** @type {import('@/models/user').default} */
    currentUser: null,
    isUserLoading: true,
    login: () => {},
    logout: () => {},
    agent: {
        /** @type {Array<import('@/models/agent').default>} */
        agentList: [],
        /** @type {import('@/models/agent').default} */
        selectedAgent: null,
        isAgentLoading: false,
        setSelectedAgentFromId: () => {},
    },
    accessCheck: {
        haveOne: () => false,
        haveAny: () => false,
        haveAll: () => false,
    },
});

export default function AppContextProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [isAgentLoading, setIsAgentLoading] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const userAccessMap = useMemo(() => {
        return currentUser ? new Map(currentUser.access?.map(e => [e, true])) : new Map();
    },[currentUser])

    useEffect(() => {
        setIsUserLoading(true);
        authService.getUserData().then((data) => {
            setCurrentUser(data);
            const agent = data;
            setSelectedAgent({
                id: agent.businessId,
                name: agent.businessName,
                code: agent.businessCode,
            });
        }).catch((err) => {
            console.error("fetchUserData error:", err);
        }).finally(() => {
            setIsUserLoading(false);
        });
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.businessId == "1") {
            fetchAgent();
        }
    }, [currentUser]);

    async function login(username, password) {
        try {
            const data = await authService.login(username, password)
            setCurrentUser(data.userData);
            const agent = data.userData;
            setSelectedAgent({
                id: agent.businessId,
                name: agent.businessName,
                code: agent.businessCode,
            });
            return "success";
        } catch (err) {
            console.error("login error:", err);
            if (err.response?.status === 401 || err.response?.status === 400) {
                return "invalid";
            }
            return "error";
        }
    }

    async function logout() {
        setCurrentUser(null);
        try {
            await authService.logout();
            return true;
        } catch (err) {
            console.error("logout error:", err);
            return false;
        }
    }

    async function fetchAgent() {
        try {
            setIsAgentLoading(true);
            // const response = await fetchProtectedData.get(URLS.agent.getAll, {
            //     params: { type: ["H", "A"] },
            // });
            // setAgents(response.data);
        } catch (err) {
            console.error("fetchAgent error:", err);
        } finally {
            setIsAgentLoading(false);
        }
    }

    function setSelectedAgentFromId(id) {
        const findAgent = agents.find((e) => e.id == id);
        if (findAgent) {
            setSelectedAgent({
                id: findAgent.id,
                name: findAgent.name,
                code: findAgent.code,
            });
        }
    }

    const accessCheck = {
        haveOne: (acc) => haveOne(userAccessMap, acc),
        haveAny: (acc) => haveAny(userAccessMap, acc),
        haveAll: (acc) => haveAll(userAccessMap, acc),
    };

    const value = {
        currentUser,
        isUserLoading,
        login,
        logout,
        agent: {
            agentList: agents,
            selectedAgent,
            isAgentLoading,
            setSelectedAgentFromId,
        },
        accessCheck,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function haveOne(userAccessMap, access) {
    if (!userAccessMap || !access) return false;
    return userAccessMap.has(access);
}

function haveAll(userAccessMap, access) {
    if (!userAccessMap || !access) return false;
    return access.length === 0 || access.every((e) => userAccessMap.has(e));
}

function haveAny(userAccessMap, access) {
    if (!userAccessMap || !access) return false;
    return access.length === 0 || access.some((e) => userAccessMap.has(e));
}

export const useAppContext = () => useContext(AppContext);
