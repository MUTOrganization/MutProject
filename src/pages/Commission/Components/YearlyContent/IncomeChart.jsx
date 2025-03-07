import { useMemo, useState } from "react";
import { CommissionData } from "./CommissionData";
import ReactApexChart from "react-apexcharts";
import { Checkbox, Spinner, Switch } from "@nextui-org/react";
import { cFormatter, nFormatter } from "../../../../../utils/numberFormatter";

/**
 * 
 * @param {{
*    data: [CommissionData],
*    isLoading: Boolean,
*    selectedYear: Number
* }} param0 
* @returns 
*/
export default function IncomeChart({data, isLoading, selectedYear}){
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDelivery, setIsDelivery] = useState(false);
    
    const gcolors = ['#2ECC71','#186A3B','#F1C40F','#A04000']
    const gcolorsDeli = ['#E74C3C','#7B241C','#8E44AD','#4A235A']

    const months = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ษ', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย','ต.ค','พ.ย','ธ.ค']

    const [adminIncomes, upsaleIncomes, adminLiftIncomes, upsaleLiftIncomes,
        adminDelivery, upsaleDelivery, adminLiftDelivery, upsaleLiftDelivery,
        totalIncomes, totalLiftIncome,
        totalDelivery, totalLiftDelivery 
    ] = useMemo(() => {
        return data.reduce((prev, curr) => {
            prev[0].push(curr.adminPaidIncome);
            prev[1].push(curr.upsalePaidIncome);
            prev[2].push(curr.adminLiftIncome);
            prev[3].push(curr.upsaleLiftIncome);
            prev[4].push(curr.adminDelivery);
            prev[5].push(curr.upsaleDelivery);
            prev[6].push(curr.adminLiftDelivery);
            prev[7].push(curr.upsaleLiftDelivery);
            prev[8].push(curr.adminPaidIncome + curr.upsalePaidIncome);
            prev[9].push(curr.adminLiftIncome + curr.upsaleLiftIncome);
            prev[10].push(curr.adminDelivery + curr.upsaleDelivery);
            prev[11].push(curr.adminLiftDelivery + curr.upsaleLiftDelivery);
            return prev;
        },Array(12).fill().map(() => []))
    },[data])
    const incomeSeries = [
        {
            name: 'ยอดเงินเข้า',
            data: [5000000, 2000000, 6000000, 1000000, 4000000, 2000000, 5000000, 6000000, 2000000, 5000000, 5000000, 6000000] ?? totalIncomes,
            color: gcolors[0]
        }, {
            name: 'ยอดยก',
            data: [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000, 1200000] ?? totalLiftIncome,
            color: gcolors[2]
        }
    ]

    /**
     * @type {import("apexcharts").ApexOptions}
     */
    const options = {
        chart: {
            type: 'bar',
            stacked: true,  
            zoom: {
                enabled: false,
            }
        },
        title: {
            text: 'ยอดเงินเข้า',
            align: 'left',
            offsetX: 30,
            offsetY: 0,
            floating: false,
            style: {
                fontSize:  '20px',
                fontWeight:  'bold',
                fontFamily:  'font-family: "Noto Sans Thai", sans-serif',
                color:  '#263238'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: months.filter((e,i) => !(selectedYear === new Date().getFullYear() && i > data.length - 1)),
            type: 'category',
            // labels: {
            //     formatter: (value) => (selectedYear == new Date().getFullYear() && value === months[data.length - 1]) ? `${value} (ปัจจุบัน)` : value
            // }
        },
        yaxis: {
            labels: {
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
            },
            tickAmount: 7
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                        },
                        
                        formatter: (value) => value === 0 ? '' : typeof value !== 'undefined' ? nFormatter(value,1) : value
                    }
                }
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            y:[{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            },{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            },{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            },{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            }],
        }, 
        responsive: [
            {
                breakpoint: 600,
                options: {
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                total: {
                                    enabled: false,
                                    style: {
                                        fontSize: '5px',
                                        fontWeight: 600
                                    },
                                    formatter: (value) => value === 0 ? '' : typeof value !== 'undefined' ? nFormatter(value,1) : value
                                }
                            }
                        }
                    },

                }
            },
            
        ]
    };
    return(
        <div className="relative">
          {
            isLoading &&
            <div className="absolute size-full top-0 left-0  flex justify-center items-center"><Spinner /></div>
          }
          
          <ReactApexChart key={'Income chart'} 
            options={options} 
            series={incomeSeries} type="bar" />
        </div>
    )
}