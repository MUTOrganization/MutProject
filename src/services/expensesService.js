import api from "@/configs/api";

const TypeExpensesURL = 'otherExpenses/manageExpenses'
const ExpensesDetailsURL = 'otherExpenses'

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

// ExpensesDetails
async function getExpensesDetails(agentId, startDate, endDate) {
    const res = await api.get(`${ExpensesDetailsURL}/getExpensesDetails`, {
        params: {
            agentId,
            startDate,
            endDate
        }
    })
    return res.data
}

async function addExpensesDetails(remark, expensesDate, details, typeId) {
    const res = await api.post(`${ExpensesDetailsURL}/addExpensesDetails`, {
        remark,
        expensesDate,
        details,
        typeId
    })
    return res.data
}

async function deleteExpensesDetails(expensesId) {
    const res = await api.delete(`${ExpensesDetailsURL}/deleteExpenses`, {
        params: {
            expensesId
        }
    })
    return res.data
}

async function editExpensesDetail(expensesId, remark, expensesDate, details, typeId) {
    const res = await api.post(`${ExpensesDetailsURL}/editExpenses`, {
        expensesId,
        remark,
        expensesDate,
        details,
        typeId
    })
    return res.data
}


export default { addExpensesType, getExpensesType, ChangeExpensestypeStatus, editExpensesType, getExpensesDetails, addExpensesDetails, deleteExpensesDetails, editExpensesDetail }