import React from 'react'
import { formatCurrencyNoDollarsWithFixed } from '../utils/currencyUtils'
import { Card } from '@nextui-org/react'

function TotalAmountCard({ data, dateMode }) {
    
    const getComparisonColor = (currentValue, lastValue) => {
        const current = parseFloat(currentValue) || 0
        const last = parseFloat(lastValue) || 0

        if (current > last) return 'text-green-600'
        if (current < last) return 'text-red-600'
        return 'text-gray-500'
    }

    const getDifference = (currentValue, lastValue, isPercentage = false) => {
        const current = parseFloat(currentValue) || 0
        const last = parseFloat(lastValue) || 0
        const difference = current - last

        if (isPercentage && last === 0) {
            return {
                formattedDifference: 'N/A',
                color: getComparisonColor(current, last),
                arrow: current > last ? '▲' : current < last ? '▼' : '',
            }
        }

        return {
            formattedDifference: isPercentage
                ? `${((difference / last) * 100).toFixed(2)}%`
                : formatCurrencyNoDollarsWithFixed(Math.abs(difference)),
            color: getComparisonColor(current, last),
            arrow: current > last ? '▲' : current < last ? '▼' : '',
        }
    }

    const totalAmountCurrent = data?.currentMonthAgentRanking?.totalAmount ?? 0
    const totalAmountLast = data?.lastMonthAgentRanking?.totalAmount ?? 0

    const currencyDiff = getDifference(totalAmountCurrent, totalAmountLast, false)
    const percentDiff = getDifference(totalAmountCurrent, totalAmountLast, true)

    let comparisonText = ''
    switch (dateMode) {
        case 'วัน':
            comparisonText = 'เทียบกับวันก่อน'
            break
        case 'ช่วงวัน':
            comparisonText = 'เทียบกับช่วงวันก่อน'
            break
        case 'ปี':
            comparisonText = 'เทียบกับปีก่อน'
            break
        default:
            comparisonText = 'เทียบกับเดือนที่แล้ว'
            break
    }

    return (
        <Card
            shadow="none"
            radius="sm"
            className="w-full max-w-md sm:max-w-2xl lg:max-w-none mx-auto p-4 sm:p-6 md:p-6 bg-white"
        >
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 text-center">
                    ยอดสั่งซื้อ {formatCurrencyNoDollarsWithFixed(totalAmountCurrent)} บาท
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center text-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <p
                        className={`text-xl sm:text-2xl md:text-2xl font-semibold ${currencyDiff.color}`}
                    >
                        {currencyDiff.arrow} {currencyDiff.formattedDifference}
                        {percentDiff.formattedDifference !== 'N/A' && (
                            <> ({percentDiff.formattedDifference})</>
                        )}
                    </p>
                    <span className="text-base sm:text-lg text-gray-600">
                        {comparisonText}
                    </span>
                </div>
            </div>
        </Card>
    )
}

export default TotalAmountCard
