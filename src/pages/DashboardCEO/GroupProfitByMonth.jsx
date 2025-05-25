const groupProfitByMonth = (commissionData = [], expensesData = []) => {
    const monthlyProfit = Array(12).fill(0)

    commissionData.forEach(user => {
        user.data.forEach(entry => {
            const monthIndex = new Date(entry.date).getMonth()
            const income = Number(entry.adminIncome || 0)
            const commission = Number(entry.commission || 0)
            monthlyProfit[monthIndex] += income - commission
        })
    })

    expensesData.forEach(entry => {
        const monthIndex = new Date(entry.expensesDate).getMonth()
        monthlyProfit[monthIndex] -= Number(entry.totalAmount || 0)
    })

    return monthlyProfit.map(val => Number(val.toFixed(2)))
}

const groupSaleByMonth = (commissionData = [], expensesData = []) => {
    const sales = Array(12).fill(0)
    const commission = Array(12).fill(0)
    const expenses = Array(12).fill(0)

    // รวมยอดขายและค่าคอมมิชชั่นจาก commissionData
    commissionData.forEach(user => {
        user.data.forEach(entry => {
            const monthIndex = new Date(entry.date).getMonth()
            sales[monthIndex] += Number(entry.adminIncome || 0)
            commission[monthIndex] += Number(entry.commission || 0)
        })
    })

    // รวมค่าใช้จ่ายจาก expensesData
    expensesData.forEach(entry => {
        const monthIndex = new Date(entry.expensesDate).getMonth()
        expenses[monthIndex] += Number(entry.totalAmount || 0)
    })

    return {
        sales: sales.map(val => Number(val.toFixed(2))),
        commission: commission.map(val => Number(val.toFixed(2))),
        expenses: expenses.map(val => Number(val.toFixed(2)))
    }
}

const groupExpensesByType = (expensesData = []) => {
    const map = {}

    expensesData.forEach(item => {
        const typeName = item.expensesType?.typeName || 'ไม่ทราบประเภท'
        const amount = Number(item.totalAmount || 0)

        if (map[typeName]) {
            map[typeName] += amount
        } else {
            map[typeName] = amount
        }
    })

    return {
        labels: Object.keys(map),
        series: Object.values(map)
    }
}


export default {
    groupProfitByMonth,
    groupSaleByMonth,
    groupExpensesByType
}
