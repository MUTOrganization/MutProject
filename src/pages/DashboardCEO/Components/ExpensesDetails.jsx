import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
dayjs.locale('th');

function ExpensesDetails({ expensesType, expensesData, selectExpensesTypeFromChart }) {
  const { series, categories } = useMemo(() => {
    
    // เตรียมชื่อประเภทจาก typeId
    const typeMap = {};
    expensesType.forEach(type => {
      typeMap[type.expensesTypeId] = type.typeName;
    });

    // เตรียมโครง data
    const result = {};
    expensesType.forEach(type => {
      result[type.typeName] = Array(12).fill(0);
    });

    expensesData.forEach(item => {
      const typeName = typeMap[item.expensesTypeId] || 'ไม่ทราบประเภท';
      const monthIndex = dayjs(item.expensesDate).month(); // 0 = ม.ค., 11 = ธ.ค.
      result[typeName][monthIndex] += item.totalAmount;
    });

    const series = Object.entries(result).map(([typeName, data]) => ({
      name: typeName,
      data
    }));

    const categories = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    return { series, categories };
  }, [expensesData, expensesType]);

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedType = series[config.seriesIndex]?.name;
          if (selectExpensesTypeFromChart && selectedType) {
            selectExpensesTypeFromChart(selectedType);
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    title: {
      text: 'ประเภทค่าใช้จ่ายรายเดือน',
      align: 'left'
    },
    xaxis: {
      categories,
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={400} />
    </div>
  );
}

export default ExpensesDetails;
