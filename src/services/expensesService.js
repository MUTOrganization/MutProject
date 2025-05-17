import api from "@/configs/api";

const TypeExpensesURL = 'otherExpenses/manageExpenses'

// Expenses Type
async function addExpensesType(action, agentId, typeName) {
    const res = await api.post(TypeExpensesURL, {
        action,
        agentId,
        typeName
    })
    return res.data
}

async function ChangeExpensestypeStatus(action, expensesTypeId, status) {
    const res = await api.post(TypeExpensesURL, {
        action,
        expensesTypeId,
        status
    })
    return res.data
}

async function editExpensesType(action, expensesTypeId, typeName) {
    const res = await api.post(TypeExpensesURL, {
        action,
        expensesTypeId,
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


export default { addExpensesType, getExpensesType, ChangeExpensestypeStatus, editExpensesType }