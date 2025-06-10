import api from "@/configs/api";


const route = 'settings/'


async function getCommissionSettingByMonth(roleId, prob, date) {
    const url = route + 'commissionSettingByMonth'
    const res = await api.get(url,{
        params:{
            roleId: parseInt(roleId),
            prob: prob == 1 ? true : false,
            date: date
        }
    })
    return res.data;
}

async function getCommissionSetting(roleId, prob) {
    const url = route + 'commissionSetting'
    const res = await api.get(url,{
        params:{
            roleId: parseInt(roleId),
            prob: prob == 1 ? true : false
        }
    })
    return res.data;
}

async function addCommissionSetting(roldId, prob, tier_list) {
    const url = route + 'commissionSetting'
    const payload = {
        roleId: roldId,
        prob: prob,
        tier_list: tier_list
    }
    const res = await api.post(url, payload)
    return res.data;
}


async function updateCommissionSetting(roldId, prob, tier_list) {
    const url = route + 'commissionSetting'
    const res = await api.put(url, {
        roleId: roldId,
        prob: prob,
        tier_list: tier_list
    })
    return res.data;
}



export default {
    getCommissionSetting,
    addCommissionSetting,
    updateCommissionSetting,
    getCommissionSettingByMonth
}