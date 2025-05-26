import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "@/services/authService";
import { SESSION_STORAGE_KEYS } from "@/configs/sessionStorageKeys";
import Agent from "@/models/agent";
import User from "@/models/user";
import { ACCESS } from "@/configs/accessids";

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
    console.log(currentUser);

    useEffect(() => {
        setIsUserLoading(true);
        authService.getUserData().then((data) => {
            const _userAccessMap = new Map(data.access?.map(e => [e, true]))
            if(haveOne(_userAccessMap, ACCESS.General_superadmin)) data.baseRole = 'SUPER_ADMIN';
            else if(haveOne(_userAccessMap, ACCESS.General_admin)) data.baseRole = 'ADMIN';
            else if(haveOne(_userAccessMap, ACCESS.General_executive)) data.baseRole = 'EXECUTIVE';
            else if(haveOne(_userAccessMap, ACCESS.General_manager)) data.baseRole = 'MANAGER';
            else if(haveOne(_userAccessMap, ACCESS.General_staff)) data.baseRole = 'STAFF';
            setCurrentUser(new User(data));
            const agent = data.agent;
            setSelectedAgent(new Agent(agent));
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
            setCurrentUser(new User(data.userData));
            const agent = data.userData.agent;
            setSelectedAgent(new Agent(agent));
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
        try {
            await authService.logout();
            setCurrentUser(null);
            Object.values(SESSION_STORAGE_KEYS).forEach(value => {
                sessionStorage.removeItem(value);
            });
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
