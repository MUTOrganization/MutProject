import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import GroupProfitByMonth from '../GroupProfitByMonth'


function ProfitChart({ commissionData, expensesData }) {

    const [series, setSeries] = useState([{
        name: 'กำไรสุทธิ',
        data: Array(12).fill(0)
    }])

    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'straight' },
        colors: ['#800080'],
        title: { text: 'Profit Chart', align: 'left' },
        xaxis: {
            categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
        },
        yaxis: {
            labels: {
                formatter: val => val.toLocaleString()
            },
            title: { text: 'บาท' },
            min: 0
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            }
        }
    })

    useEffect(() => {
        const profitData = GroupProfitByMonth.groupProfitByMonth(commissionData, expensesData)

        setSeries([{
            name: 'กำไรสุทธิ',
            data: profitData
        }])
    }, [commissionData, expensesData])

    return (
        <div>
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
    )
}

export default ProfitChart
