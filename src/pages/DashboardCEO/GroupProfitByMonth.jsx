import { formatNumber } from "@/component/FormatNumber"
import { ArrowDown, ArrowUp } from "lucide-react"

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

export const Summary = (commissionData = [], expensesData = []) => {
    // Commission
    const totalSales = commissionData.reduce((sum, item) => {
        return sum + item.data.reduce((acc, d) => acc + (d?.adminIncome || 0), 0)
    }, 0)

    const totalCommission = commissionData.reduce((sum, item) => {
        return sum + item.data.reduce((acc, d) => acc + (d?.commission || 0), 0)
    }, 0)

    const orderCount = commissionData.reduce((sum, item) => sum + item.data.reduce((acc, item) => acc + item?.orderCount, 0), 0)

    // Expenses
    const totalExpenses = expensesData.reduce((sum, item) => {
        return sum + (item.totalAmount || 0)
    }, 0)

    const netExpense = Math.abs(totalCommission + totalExpenses)
    const profit = Math.abs(totalSales - netExpense)

    const commissionPercent = netExpense > 0 ? (totalCommission / netExpense) * 100 : 0
    const expensesPercent = netExpense > 0 ? (totalExpenses / netExpense) * 100 : 0

    return {
        sales: formatNumber(totalSales),
        commission: formatNumber(totalCommission),
        expenses: formatNumber(totalExpenses),
        netExpense: formatNumber(netExpense),
        profit: formatNumber(profit),
        orderCount: orderCount,
        percent: {
            commission: commissionPercent.toFixed(2),
            expenses: expensesPercent.toFixed(2)
        }
    }
}

export const getPrevPercentSales = (prevData, currentData) => {

    const getIncome = (data) =>
        data.reduce((acc, item) => {
            return acc + item.data.reduce((sum, d) => sum + (d?.adminIncome || 0), 0)
        }, 0)

    const prev = getIncome(prevData)
    const current = getIncome(currentData)

    if (prev === 0) {
        return <span className="text-slate-400">0.00%</span>
    }

    const percent = ((current - prev) / prev) * 100
    const formatted = percent.toFixed(2)
    const isPositive = percent > 0

    return (
        <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{(isPositive ? '+' : '') + formatted}%</span>
        </span>
    )
}

export const getPrevPercentNetExpenses = (prevCommission = [], currenCommission = [], prevExpenses = [], currentExpenses = []) => {
    const prevCom = prevCommission.reduce((sum, item) => sum + (item.commission || 0), 0)
}

export const getPrevPercentProfit = (
    prevCommissionData = [],
    currentCommissionData = [],
    prevExpensesData = [],
    currentExpensesData = []
) => {
    // Prev
    const prevCommission = prevCommissionData.reduce((sum, item) =>
        sum + item.data.reduce((acc, d) => acc + (d?.commission || 0), 0), 0)
    const prevExpenses = prevExpensesData.reduce((sum, item) =>
        sum + (item.totalAmount || 0), 0)
    const prevSales = prevCommissionData.reduce((sum, item) =>
        sum + item.data.reduce((acc, d) => acc + (d?.adminIncome || 0), 0), 0)
    const prevProfit = prevSales - (prevCommission + prevExpenses)

    // Current
    const currentCommission = currentCommissionData.reduce((sum, item) =>
        sum + item.data.reduce((acc, d) => acc + (d?.commission || 0), 0), 0)
    const currentExpenses = currentExpensesData.reduce((sum, item) =>
        sum + (item.totalAmount || 0), 0)
    const currentSales = currentCommissionData.reduce((sum, item) =>
        sum + item.data.reduce((acc, d) => acc + (d?.adminIncome || 0), 0), 0)
    const currentProfit = currentSales - (currentCommission + currentExpenses)

    // Percent Compare
    if (prevProfit === 0) return { percent: '0.00%', icon: null, color: 'gray' }

    const percent = ((currentProfit - prevProfit) / Math.abs(prevProfit)) * 100
    let percentNetExpenses
    if ((prevExpenses + prevCommission) === 0) {
        percentNetExpenses = '0.00%'
    } else {
        percentNetExpenses = (((currentExpenses + currentCommission) - (prevExpenses + prevCommission)) / (prevExpenses + prevCommission) * 100).toFixed(2) + '%'
    }
    const isUp = percent > 0

    const isPercentExpensesUp = percentNetExpenses > 0
    const isPercentExpensesZero = percentNetExpenses === '0.00%'

    return {
        ProfitValue: {
            percent: `${percent.toFixed(2)}%`,
            icon: isUp ? '▲' : '▼',
            color: isUp ? 'text-green-500' : 'text-red-500',
        },
        percentNetExpenses: {
            percent: percentNetExpenses,
            icon: isPercentExpensesZero ? '' : isPercentExpensesUp ? '▲' : '▼',
            color: isPercentExpensesZero ? 'text-slate-400' : (isPercentExpensesUp ? 'text-green-500' : 'text-red-500'),
        }

    }
}

export default {
    groupProfitByMonth,
    groupSaleByMonth,
    groupExpensesByType,
    getPrevPercentSales,
    Summary,
    getPrevPercentProfit,
    getPrevPercentNetExpenses
}
