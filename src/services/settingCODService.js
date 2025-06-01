import api from "@/configs/api";

const route = 'settings/'

/**
* @param {Number} agentId
* 
*/

export async function updateSettingCOD(agentId , day , time , createBy , startDate) {
    const url = route + 'updateCodCutOffSettings'
    const payload = {
        businessId : agentId,
        day,
        time,
        createBy,
        startDate
    }
    const res = await api.post(url,payload)
    return res.data;
}