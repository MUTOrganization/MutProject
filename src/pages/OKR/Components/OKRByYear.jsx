import React, { useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'

function OKRByYear() {
    const options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '%'
            },
            offsetY: -10,
            style: {
                fontSize: '12px',
                colors: ['#304758']
            }
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        markers: {
            size: 5,
            hover: {
                size: 7
            }
        },
        title: {
            text: 'ความคืบหน้าตามเป้าหมายรายปี',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    let grade = 'F';
                    if (value >= 80) grade = 'A';
                    else if (value >= 70) grade = 'B';
                    else if (value >= 60) grade = 'C';
                    else if (value >= 50) grade = 'D';
                    return value + '% (เกรด ' + grade + ')';
                }
            }
        }
    };

    const series = [{
        name: "ความคืบหน้า",
        data: [0, 55, 56, 85 , 56, 90, 48, 50, 45, 89, 100, 0]
    }];

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="line"
                height={450}
            />
        </div>
    )
}

export default OKRByYear
