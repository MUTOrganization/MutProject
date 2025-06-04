import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

function DashboardSalesCustomerIncomeChart() {

    const [series, setSeries] = useState({

        series: [
            {
                name: "High - 2013",
                data: [28, 29, 33, 36, 32, 32, 33, 36, 32, 32, 33, 36]
            },
            {
                name: "Low - 2013",
                data: [12, 11, 14, 18, 17, 13, 13, 12, 11, 14, 18, 17]
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.5
                },
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#77B6EA', '#545454'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Average High & Low Temperature',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
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
                ],
                title: {
                    text: 'Month'
                }
            },
            yaxis: {
                title: {
                    text: 'Temperature'
                },
                min: 5,
                max: 40
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },


    });

    return (
        <div className='w-full bg-white rounded-lg p-4 shadow-sm'>
            <div id="chart">
                <ReactApexChart options={series.options} series={series.series} type="line" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default DashboardSalesCustomerIncomeChart
