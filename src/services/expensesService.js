import api from "@/configs/api";

async function addExpenses() {
    const url = 'expenses/addExpenses';
    const res = await api.post(url, {
        expenses
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

export default { addExpenses, getExpensesType }