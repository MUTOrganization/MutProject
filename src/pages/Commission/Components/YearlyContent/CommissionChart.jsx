import ReactApexChart from "react-apexcharts";
import { cFormatter, nFormatter } from "@/utils/numberFormatter";
import { Spinner } from "@heroui/react";

/**
 * 
 * @param {{
*    data: [CommissionData],
*    isLoading: Boolean,
*    selectedYear: Number
* }} param0 
* @returns 
*/
export default function CommissionChart({data, isLoading, selectedYear}){

  const months = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ษ', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย','ต.ค','พ.ย','ธ.ค']
  const gcolors = ['#58D68D','#5DADE2'];
  const summSeries = [{
      name: 'คอมมิชชั่น',
      type: 'column',
      data: [4400, 2200, 6300, 1400, 4500, 2600, 5700, 6800, 2900, 5100, 5110, 6120] ?? data.map(e => e.commission),
      color: gcolors[0]
    }, {
      name: 'ยอดเงินเข้าสุทธิ',
      type: 'column',
      data: [840000, 420000, 1230000, 240000, 850000, 460000, 1170000, 1280000, 490000, 1010000, 1011000, 1212000] ?? data.map(e => e.netIncome),
      color: gcolors[1]
  }]
  /**
   * @type {import("apexcharts").ApexOptions}
   */
  const summOptions = {
      chart: {
          type: 'line',
          stacked: false,
          zoom: {
            enabled: false,
          }
      },
      title: {
          text: 'สรุปยอดรวม',
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
      yaxis: [
          {
              seriesName: 'คอมมิชชั่น',
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: gcolors[0]
              },
              labels: {
                style: {
                  colors: gcolors[0],
                  fontSize: '13px'
                },
                formatter: (value) => typeof value !== 'undefined' ? nFormatter(value) : value
              },
              title: {
                text: 'คอมมิชชั่น (บาท)',
                style: {
                  color: gcolors[0]
                }
              },
              tickAmount: 4
          },
          {
              seriesName: 'ยอดเงินเข้าสุทธิ',
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: gcolors[1]
              },
              labels: {
                style: {
                  colors: gcolors[1],
                  fontSize: '13px'
                },
                formatter: (value) => typeof value !== 'undefined' ? nFormatter(value) : value
              },
              title: {
                text: 'ยอดเงินเข้าสุทธิ (บาท)',
                style: {
                  color: gcolors[1]
                }
              },
              tickAmount: 8
          }
      ],
      annotations: {
        points: []
      },
      dataLabels: {
        enabled: true,
        distributed: false,
        offsetY: -5,
        style: {
          fontSize: '0.7em',
          colors: ['#1de06b', '#40b8f2']
          
        },
        formatter: (value) => value === 0 ? '' : typeof value !== 'undefined' ? nFormatter(value,1) : value
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
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

    return(
        <div className="relative">
          {
            isLoading &&
            <div className="absolute size-full top-0 left-0  flex justify-center items-center"><Spinner /></div>
          }
          <ReactApexChart key={'commChart'} 
          options={summOptions} 
          series={summSeries} />
        </div>
    )
}