import { useMemo, useState } from "react";
import { CommissionData } from "./CommissionData";
import { cFormatter, nFormatter } from "../../../../../utils/numberFormatter";
import { Checkbox, Spinner, Switch } from "@nextui-org/react";
import ReactApexChart from "react-apexcharts";
import lodash from 'lodash'
/**
 * 
 * @param {{
*    data: [CommissionData],
*    isLoading: Boolean,
*    selectedYear: Number
* }} param0 
* @returns 
*/
export default function SaleOrderChart({data, isLoading, selectedYear}){
    const [isOrderchecked, setIsOrderChecked] = useState(false);
    const [isOrderExpandedChecked, setIsOrderExpandedChecked] = useState(false);
    const [sales, incomes, 
        orderCount, upsaleOrderCount,
        adminPaidOrderCounts, adminUnpaidOrderCounts,
        upsalePaidOrderCounts, upsaleUnpaidOrderCounts
    ] = useMemo(() => {
        return data.reduce((prev, curr) => {
            prev[0].push(curr.adminPaidIncome + curr.upsalePaidIncome + curr.adminNextLiftIncome + curr.upsaleNextLiftIncome);
            prev[1].push(curr.adminUnpaid + curr.upsaleUnpaid);
            prev[2].push(curr.orderCount);
            prev[3].push(curr.upsaleOrderCount);
            prev[4].push(curr.adminPaidOrderCount + curr.adminPaidNextMonthOrderCount);
            prev[5].push(curr.adminUnpaidOrderCount);
            prev[6].push(curr.upsaleOrderCount + curr.upsalePaidNextMonthOrderCount);
            prev[7].push(curr.upsaleUnpaidOrderCount);
            return prev;
        },Array(8).fill().map(() => []))
    },[data])

    const months = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ษ', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย','ต.ค','พ.ย','ธ.ค']
    const gcolors = ['#569ff1','#cdcdcd'];

    const [max, min] = useMemo(() => {
      const _max = lodash.max(sales.map((e,i) => e + incomes[i]));
      const _min = lodash.min([...sales])
      return [_max, _min]
    },[sales, incomes])
    
    const salesSeries = [{
        name: 'ยอดเงินเข้า',
        type: 'column',
        data: sales,
        color: gcolors[0]
      }, {
        name: 'ยอดที่ยังไม่ชำระ',
        type: 'column',
        data: incomes,
        color: gcolors[1]
    }]
    /**
     * @type {import("apexcharts").ApexOptions}
     */
    const salesOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            zoom: {
              enabled: false,
            }
        },
        title: {
            text: 'ยอดขาย',
            align: 'left',
            offsetX: 30,
            style: {
                fontSize:  '20px',
                fontWeight:  'bold',
                fontFamily:  'font-family: "Noto Sans Thai", sans-serif',
            },
        },
        stroke: {
          width: [0,0]
        },
        xaxis: {
          type: 'category',
          categories: months,
          // labels: {
          //   formatter: (value) => (selectedYear == new Date().getFullYear() && value === months[data.length - 1]) ? `${value} (ปัจจุบัน)` : value
          // }
        },
        yaxis: {
            labels: {
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
            },
            // tickAmount: 8,
            // max: max,
            // min: min
        },
        annotations: {
          points: []
        },
        dataLabels: {
          enabled: false,
          distributed: false,
          offsetY: -5,
          style: {
            fontSize: '0.7em',
            colors: [gcolors[0], gcolors[1]]
            
          },
          formatter: (value) => value === 0 ? '' : typeof value !== 'undefined' ? nFormatter(value,1) : value
        },
        plotOptions: {
          bar: {
            columnWidth: '60%',
            dataLabels: {
                total: {
                    enabled: true,
                    formatter: (value) => value === 0 ? '' :  `รวม ${nFormatter(value,1)}` ,
                    offsetY: -20
                }
            }
          }
        },
        tooltip:{
            shared: true,
            intersect: false,
            y:[{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            },{
                formatter: (value) => typeof value !== 'undefined' ? cFormatter(value,2) + ' บาท' : value
            }]
        }
    }
    
    const orderCountSeries = [{
      name: 'ออเดอร์',
      type: 'column',
      data: orderCount,
      color: '#F1C40F'
    },{
      name: 'ออเดอร์ที่ยังไม่ชำระเงิน',
      type: 'column',
      data: adminUnpaidOrderCounts.map((e,i) => e + upsaleUnpaidOrderCounts[i]),
      color: '#35ca5a'
    }];
  
    /**
     * @type {Apex}
     */
    const orderCountExpandedSeries = [
    {
      name: 'ออเดอร์ที่ชำระเงินแล้ว',
      data: adminPaidOrderCounts,
      color: '#F1C40F',
      group: 'admin',
      type: 'column'
    },{
      name: 'ออเดอร์ที่ยังไม่ชำระเงิน',
      data: adminUnpaidOrderCounts,
      color: '#fa5504',
      group: 'admin',
      type: 'column'
    },{
      name: 'ออเดอร์อัพเซลที่ชำระเงินแล้ว',
      data: upsalePaidOrderCounts,
      color: '#35ca5a',
      group: 'upsale',
      type: 'column'
    },{
      name: 'ออเดอร์อัพเซลที่ยังไม่ชำระเงิน',
      data: upsaleUnpaidOrderCounts,
      color: '#0b6c1e',
      group: 'upsale',
      type: 'column'
    },];
    /**
     * @type {import("apexcharts").ApexOptions}
     */
    const orderCountOptions = {
      chart: {
        stacked: true,
        zoom: {
          enabled: false,
        }
      },
      title: {
          text: 'จำนวนออเดอร์',
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
      stroke: {
          width: [0,0,0,0]
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: !isOrderExpandedChecked ? ['#e69d02', '#008a2e'] : ['#e69d02', '#912400', '#008a2e','#003308']
        },
        offsetY: -5,
        formatter: (value) => value === 0 ? '' : nFormatter(value, 1) 
      },
      plotOptions: {
        bar: {
            dataLabels: {
                total: {
                    enabled: true
                },
            }
        }
      },
      yaxis: {
          labels:{
              formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
          },
          tickAmount: 10,
      },
      xaxis: {
          type: 'category',
          categories: months,
          // labels: {
          //   formatter: (value) => (selectedYear == new Date().getFullYear() && value === months[data.length - 1]) ? `${value} (ปัจจุบัน)` : value
          // }
      },
      tooltip:{
          shared: true,
          intersect: false,
          enabledOnSeries: undefined,
          y:[{
              formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
          },{
            formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
          },{
            formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
          },{
            formatter: (value) => typeof value !== 'undefined' ? cFormatter(value) : value
          },
        ]
      }
    };
      return(
          <div className="relative">
            {
              isLoading &&
              <div className="absolute size-full top-0 left-0  flex justify-center items-center"><Spinner /></div>
            }
            <div className="absolute top-1 left-48">
              <Switch
                aria-label='switch to order chart'
                className="z-10"
                size="sm"
                isSelected={isOrderchecked}
                onChange={() => setIsOrderChecked(p => !p)}
                >
                </Switch>
            </div>
            <ReactApexChart key={'commChart'} 
            options={isOrderchecked ? orderCountOptions : salesOptions} 
            series={isOrderchecked ? orderCountSeries : salesSeries} />
          </div>
    )
}