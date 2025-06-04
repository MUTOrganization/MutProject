import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useDashboardSalesContext } from '../DashboardSalesContext';

function DashboardSalesTotalChart() {
    
    const { commissionData } = useDashboardSalesContext()

    const commissionDatas = () => {
        
    }

    const [series, setSeries] = useState({

        series: [
            {
                name: 'Q1 Budget',
                group: 'budget',
                color: '#80c7fd',
                data: [44000, 55000, 41000, 67000, 22000, 43000],
            },
            {
                name: 'Q1 Actual',
                group: 'actual',
                color: '#008FFB',
                data: [48000, 50000, 40000, 65000, 25000, 40000],
            },
        ],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            dataLabels: {
                formatter: (val) => {
                    return val / 1000 + 'K'
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false
                }
            },
            xaxis: {
                categories: [
                    'มกราคม',
                    'กุมภาพันธ์',
                    'มีนาคม',
                    'เมษายน',
                    'พฤษภาคม',
                    'มิถุนายน',
                    'กรกฎาคม',
                    'สิงหาคม',
                    'กันยายน',
                    'ตุลาคม',
                    'พฤศจิกายน',
                    'ธันวาคม'
                ]
            },
            fill: {
                opacity: 1
            },
            yaxis: {
                labels: {
                    formatter: (val) => {
                        return val / 1000 + 'K'
                    }
                }
            },
            legend: {
                position: 'bottom',
                clusterGroupedSeriesOrientation: "vertical"
            }
        },


    });
    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm'>
            <div id="chart">
                <ReactApexChart options={series.options} series={series.series} type="bar" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default DashboardSalesTotalChart
