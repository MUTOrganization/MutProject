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

export default groupProfitByMonth
