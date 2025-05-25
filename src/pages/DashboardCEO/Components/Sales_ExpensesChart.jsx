import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import GroupProfitByMonth from '../GroupProfitByMonth'

function Sales_ExpensesChart({ commissionData, expensesData }) {
    const [series, setSeries] = useState([
        { name: 'ยอดขาย', data: [] },
        { name: 'ค่าคอมมิชชั่น', data: [] },
        { name: 'ค่าใช้จ่ายอื่น ๆ', data: [] }
    ])

    useEffect(() => {
        const { sales, commission, expenses } = GroupProfitByMonth.groupSaleByMonth(commissionData, expensesData)
        setSeries([
            { name: 'ยอดขาย', data: sales },
            { name: 'ค่าคอมมิชชั่น', data: commission },
            { name: 'ค่าใช้จ่ายอื่น ๆ', data: expenses }
        ])
    }, [commissionData, expensesData])

    const options = {
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 5,
                borderRadiusApplication: 'end'
            }
        },
        title: { text: 'Sales Chart', align: 'left' },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
        },
        yaxis: {
            title: {
                text: 'บาท'
            },
            labels: {
                formatter: val => val.toLocaleString()
            }
        },
        tooltip: {
            y: {
                formatter: val => `${val.toLocaleString()} บาท`
            }
        },
        fill: {
            opacity: 1
        },
        colors: ['#00BFFF', '#90EE90', '#FF6B6B']
    }

    return (
        <div>
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    )
}

export default Sales_ExpensesChart
