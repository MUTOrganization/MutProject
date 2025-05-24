import api from "@/configs/api";

const URL = 'commission'

async function getCommission(agentId, username, startDate, endDate) {
    const url = `sales/getCommission`
    const res = await api.post(url, {
        agentId,
        username,
        startDate,
        endDate
    })
    return res.data
}

export default {
    getCommission
}
