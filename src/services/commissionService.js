import api from "@/configs/api";

const URL = 'commission'

async function getCommission(agentId, username, startDate, endDate , cc) {
    const url = `sales/getCommission`
    const res = await api.post(url, {
        agentId,
        username,
        startDate,
        endDate,
        cc
    })
    return res.data
}

export default {
    getCommission
}
