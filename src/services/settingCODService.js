import api from "@/configs/api";

const route = 'settings/'

/**
* @param {Number} agentId
* @param {Number} day
* @param {String} time
* @param {String} startDate
*/
async function updateSettingCOD(agentId , day , time  , startDate) {
    const url = route + 'updateCodCutOffSettings'
    const payload = {
        agentId : agentId,
        day : day,
        time : time,
        startDate : startDate
    }
    const res = await api.post(url,payload)
    return res.data;
}


async function getSettingCOD(agentId) {
    const url = route + 'getCodCutOffSettings'
    const res = await api.get(url + `/${agentId}`)
    return res.data;
}


export default {
    updateSettingCOD,
    getSettingCOD
}
