import api from "@/configs/api";

export async function getAgent() {
    const res = await api.get('/agents')
    return res.data
}

export default {
    getAgent
}

