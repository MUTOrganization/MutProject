import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { URLS } from "../config";
import fetchProtectedData from "../../utils/fetchData";
import { toastError } from "../component/Alert";
import authService from "@/services/authService";

const AppContext = createContext({});

export default function AppContextProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [loadAgent, setLoadingAgent] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    async function fetchUserData() {
        try {
            setIsLoading(true);
            const data = await authService.getUserData();
            setCurrentUser(data.userData);
            const agent = data.userData;
            setSelectedAgent({
                id: agent.businessId,
                name: agent.businessName,
                code: agent.businessCode,
            });
        } catch (err) {
            console.error("fetchUserData error:", err);
            if (err.status === 401) {
                return;
            }
            toastError("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    }
    console.log(currentUser);
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
        sessionStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        try {
            await axios.post(URLS.LOGOUT, {}, { withCredentials: true });
            return true;
        } catch (err) {
            console.error("logout error:", err);
            return false;
        }
    }

    async function fetchAgent() {
        try {
            setLoadingAgent(true);
            // const response = await fetchProtectedData.get(URLS.agent.getAll, {
            //     params: { type: ["H", "A"] },
            // });
            // setAgents(response.data);
        } catch (err) {
            console.error("fetchAgent error:", err);
        } finally {
            setLoadingAgent(false);
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

    const userAccess = currentUser?.access;
    const accessCheck = {
        haveOne: (acc) => haveOne(userAccess, acc),
        haveAny: (acc) => haveAny(userAccess, acc),
        haveAll: (acc) => haveAll(userAccess, acc),
    };

    useEffect(() => {
        try{
            fetchUserData()
        }catch(err){
            console.error("fetchUserData error:", err);
        }
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.businessId == "1") {
            fetchAgent();
        }
    }, [currentUser]);

    const value = {
        currentUser,
        setCurrentUser,
        isUserLoading: isLoading,
        login,
        logout,
        agent: {
            agentList: agents,
            selectedAgent,
            setSelectedAgent,
            loadAgent,
            setSelectedAgentFromId,
        },
        accessCheck,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function haveOne(userAccess, access) {
    if (!userAccess || !access) return false;
    return userAccess.includes(access);
}

function haveAll(userAccess, access) {
    if (!Array.isArray(userAccess) || !access) return false;
    return access.length === 0 || access.every((e) => userAccess.includes(e));
}

function haveAny(userAccess, access) {
    if (!Array.isArray(userAccess) || !access) return false;
    return access.length === 0 || userAccess.some((e) => access.includes(e));
}

export const useAppContext = () => useContext(AppContext);
