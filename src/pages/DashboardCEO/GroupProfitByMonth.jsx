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
    
    const netExpense = totalCommission + totalExpenses
    const profit = totalSales - netExpense

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

    // ตรวจสอบว่าไม่มี currentData → ไม่ต้องแสดง %
    if (currentData.length === 0) {
        return <span className="text-slate-400">0.00%</span>
    }

    const prev = getIncome(prevData)
    const current = getIncome(currentData)

    // ทั้ง prev และ current เป็น 0
    if (prev === 0 && current === 0) {
        return <span className="text-slate-400">0.00%</span>
    }

    // prev = 0 แต่ current > 0 → แสดง +100.00% แบบ custom
    if (prev === 0 && current > 0) {
        return (
            <span className="flex items-center space-x-1 text-green-500">
                <span>▲</span>
                <span>New</span>
            </span>
        )
    }

    // ปกติ
    const percent = ((current - prev) / prev) * 100
    const formatted = percent.toFixed(2)
    const isPositive = percent > 0

    return (
        <span className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'}
            <span>{(isPositive ? '+' : '') + formatted}%</span>
        </span>
    )
}



export const getPrevPercentProfit = (
    prevCommissionData = [],
    currentCommissionData = [],
    prevExpensesData = [],
    currentExpensesData = []
) => {
    // สรุปข้อมูลย้อนหลัง
    const prevCommission = prevCommissionData.reduce(
        (sum, item) => sum + item.data.reduce((acc, d) => acc + (d?.commission || 0), 0), 0)
    const prevExpenses = prevExpensesData.reduce(
        (sum, item) => sum + (item.totalAmount || 0), 0)
    const prevSales = prevCommissionData.reduce(
        (sum, item) => sum + item.data.reduce((acc, d) => acc + (d?.adminIncome || 0), 0), 0)
    const prevProfit = prevSales - (prevCommission + prevExpenses)

    // สรุปข้อมูลปัจจุบัน
    const currentCommission = currentCommissionData.reduce(
        (sum, item) => sum + item.data.reduce((acc, d) => acc + (d?.commission || 0), 0), 0)
    const currentExpenses = currentExpensesData.reduce(
        (sum, item) => sum + (item.totalAmount || 0), 0)
    const currentSales = currentCommissionData.reduce(
        (sum, item) => sum + item.data.reduce((acc, d) => acc + (d?.adminIncome || 0), 0), 0)
    const currentProfit = currentSales - (currentCommission + currentExpenses)

    // Helper: คำนวณ % + format สำหรับฝั่งกำไร
    const calculateProfitValue = (prev, current) => {
        if (prev === 0) {
            if (current === 0) {
                return { percent: '0.00%', icon: '', color: 'text-slate-400' }
            }
            const isUp = current > 0
            return {
                percent: 'New',
                icon: isUp ? '▲' : '▼',
                color: isUp ? 'text-green-400' : 'text-red-400'
            }
        }

        const percent = ((current - prev) / Math.abs(prev)) * 100
        const isUp = percent > 0
        return {
            percent: `${percent.toFixed(2)}%`,
            icon: isUp ? '▲' : '▼',
            color: isUp ? 'text-green-400' : 'text-red-400'
        }
    }

    // Helper: คำนวณ % + format สำหรับฝั่งค่าใช้จ่ายรวม
    const calculateNetExpensesValue = (prev, current) => {
        if (prev === 0) {
            if (current === 0) {
                return { percent: '0.00%', icon: '', color: 'text-slate-400' }
            }
            const isUp = current > 0
            return {
                percent: 'New',
                icon: isUp ? '▲' : '▼',
                color: isUp ? 'text-green-400' : 'text-red-400'
            }
        }

        const percent = ((current - prev) / Math.abs(prev)) * 100
        const isUp = percent > 0
        return {
            percent: `${percent.toFixed(2)}%`,
            icon: isUp ? '▲' : '▼',
            color: isUp ? 'text-green-400' : 'text-red-400'
        }
    }

    // คำนวณค่าจริง
    const profitValue = calculateProfitValue(prevProfit, currentProfit)
    const netExpensesValue = calculateNetExpensesValue(
        prevExpenses + prevCommission,
        currentExpenses + currentCommission
    )

    return {
        ProfitValue: profitValue,
        percentNetExpenses: netExpensesValue
    }
}


export default {
    groupProfitByMonth,
    groupSaleByMonth,
    groupExpensesByType,
    getPrevPercentSales,
    Summary,
    getPrevPercentProfit,
}
