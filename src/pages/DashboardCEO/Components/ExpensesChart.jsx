import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import GroupProfitByMonth from '../GroupProfitByMonth'

function ExpensesChart({ expensesData, setSelectExpensesTypeFromChart, selectExpensesTypeFromChart }) {
    const { labels, series } = useMemo(() => GroupProfitByMonth.groupExpensesByType(expensesData), [expensesData])

    const options = {
        chart: {
            type: 'donut',
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    const selectedIndex = config.dataPointIndex
                    const selectedLabel = labels[selectedIndex]
                    if (selectedLabel === selectExpensesTypeFromChart) {
                        setSelectExpensesTypeFromChart(null)
                    } else {
                        setSelectExpensesTypeFromChart(selectedLabel)
                    }
                }
            }
        },
        labels,
        title: { text: 'Expenses PIE Chart', align: 'left' },
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
        ],
    }
    return (
        <>
            {expensesData?.length > 0 ? (
                <ReactApexChart options={options} series={series} type="donut" height={380} />
            ) : (
                <div className='flex flex-row justify-center items-center w-full h-full'>
                    <span className='text-slate-500'>ไม่มีข้อมูลค่าใช้จ่าย</span>
                </div>
            )}

        </>
    )
}

export default ExpensesChart
