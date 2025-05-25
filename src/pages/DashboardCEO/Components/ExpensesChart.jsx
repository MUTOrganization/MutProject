import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import GroupProfitByMonth from '../GroupProfitByMonth'

function ExpensesChart({ expensesData }) {
    const { labels, series } = useMemo(() => GroupProfitByMonth.groupExpensesByType(expensesData), [expensesData])

    const options = {
        chart: { type: 'donut' },
        labels,
        legend: {
            position: 'right',
            fontSize: '14px'
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%'
                }
            }
        },
        tooltip: {
            y: {
                formatter: val => `${val.toLocaleString()} บาท`
            }
        },
        dataLabels: {
            formatter: val => `${val.toFixed(1)}%`
        },
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: { width: 300 },
                    legend: { position: 'bottom' }
                }
            }
        ]
    }

    return (
        <div>
            <ReactApexChart options={options} series={series} type="donut" height={380} />
        </div>
    )
}

export default ExpensesChart
