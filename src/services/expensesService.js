import api from "@/configs/api";

async function addExpensesType(action, agentId, typeName) {
    const url = 'otherExpenses/manageExpenses';
    const res = await api.post(url, {
        action,
        agentId,
        typeName
    })
    return res.data
}

async function getExpensesType(agentId) {
    const url = 'otherExpenses/getTypeExpenses';
    const res = await api.get(url, {
        params: {
            agentId
        }
    })
    return res.data
}

export default { addExpensesType, getExpensesType }