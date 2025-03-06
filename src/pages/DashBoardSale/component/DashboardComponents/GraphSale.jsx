import React from "react";
import Chart from "react-apexcharts";
import { Card, CardBody,Spinner } from "@nextui-org/react";
import { formatDayOnly ,formatMonthThai } from "../../../../component/DateUtiils";
// Helper function to group data by day, month, or quarter
const groupSalesByDateRange = (data, range) => {
  const groupedData = data.reduce((acc, sale) => {
    const date = new Date(sale.date);

    let key;
    if (range === "day") {
      key = date.getDate().toString();
    } else if (range === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; 

    } else if (range === "quarter") {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      key = `ไตรมาสที่ ${quarter}`;
    }

    if (!acc[key]) {
      acc[key] = { new: 0, old: 0 };
    }

    acc[key].new += parseFloat(sale.SalesNew || 0);
    acc[key].old += parseFloat(sale.SalesOld || 0);
    return acc;
  }, {});

  // จัดเรียง key ตามวันที่หรือเวลาอย่างถูกต้อง
  const sortedKeys = Object.keys(groupedData).sort((a, b) => {
    if (range === "month") {
      // แปลง "YYYY-MM" เป็น Date object เพื่อจัดเรียง
      return new Date(a + "-01") - new Date(b + "-01");
    }
    return new Date(a) - new Date(b); // เรียงสำหรับ day และ quarter
  });

  return { groupedData, sortedKeys };
};
function getSalesRange(diffDays) {
  let range = "day"; // ค่าเริ่มต้นเป็นรายวัน

  if (diffDays > 90) {
    range = "quarter"; // มากกว่า 90 วัน -> แสดงเป็นไตรมาส
  } else if (diffDays > 30) {
    range = "month"; // มากกว่า 30 วัน -> แสดงเป็นรายเดือน
  } 

  return range;
}

// ฟังก์ชันหลักสำหรับคืนค่ายอดขายตามช่วงเวลา

function getSalesByRange(startDate, endDate) {
  const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวัน
  const range = getSalesRange(diffDays); // ตรวจสอบช่วงเวลา

  const start = new Date(startDate);


  const thaiYear = start.getFullYear() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.

  switch (range) {
    case "day":
      return `ยอดขายรายวันของเดือน${start.toLocaleString('th-TH', { month: 'long' })} ${thaiYear}`;
    case "month":
      return `ยอดขายรายเดือนของปี ${thaiYear}`;
    case "quarter":
      return `ยอดขายรายไตรมาสของปี ${thaiYear}`;
    default:
      return "ช่วงเวลาที่ไม่ถูกต้อง";
  }
}

// Sales Chart Component
function GraphSale({ dataSale ,startDate, endDate,isLoading}) {
  // ตรวจสอบจำนวนวันของข้อมูล
  const firstDate = new Date(dataSale[0]?.date);
  const lastDate = new Date(dataSale[dataSale.length - 1]?.date);
  const diffDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

  let range = "day"; // ค่าเริ่มต้นเป็นรายวัน
  if (diffDays > 90) {
    range = "quarter"; // มากกว่า 90 วัน -> แสดงเป็นไตรมาส
  } else if (diffDays > 30) {
    range = "month"; // มากกว่า 30 วัน -> แสดงเป็นรายเดือน
  }
  const formatCurrency = (val) => {
    if (val >= 1_000_000) {
      return `฿${(val / 1_000_000).toFixed(1)}M`; // Format as 'M' for millions
    } else if (val >= 1_000) {
      return `฿${(val / 1_000).toFixed(1)}K`; // Format as 'K' for thousands
    }
    return `฿${new Intl.NumberFormat().format(val)}`; // Regular format for values below 1000
  };

  // เรียกใช้งานฟังก์ชันกรุ๊ปข้อมูลตามช่วงเวลา
  const { groupedData, sortedKeys } = groupSalesByDateRange(dataSale, range);

  const newCustomerSales = sortedKeys.map((key) => groupedData[key].new);
  const oldCustomerSales = sortedKeys.map((key) => groupedData[key].old);

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
     
      },
    },
    stroke: {
      show: false,
      width: 2,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: sortedKeys.map((key) =>
        range === "month" ? formatMonthThai(key) : key 
      ),
      title: {
        text: range === "day" ? "วันที่" : range === "month" ? "เดือน" : "ไตรมาส",
      },
    },
    yaxis: {
      title: {
        text: "ยอดขาย (THB)",
      },
      labels: {
        formatter: function (val) {
          return `฿${new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(val)}`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const total = series.reduce(
          (sum, currSeries) => sum + currSeries[dataPointIndex],
          0
        );

        const seriesDetails = series
          .map((s, i) => {
            const seriesName = w.globals.seriesNames[i];
            const value = series[i][dataPointIndex];
            const color = i === 0 ? "blue" : "green";

            return `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span>${seriesName}: ฿${new Intl.NumberFormat().format(value)}</span>
              </div>`;
          })
          .join("");

        return `
          <div style="padding: 8px;">
            <strong>ยอดขายรวม: ฿${new Intl.NumberFormat().format(total)}</strong>
            <hr style="margin: 4px 0;" />
            ${seriesDetails}
          </div>`;
      },
    },
  };

  const series = [
    {
      name: "ลูกค้าใหม่",
      data: newCustomerSales,
    },
    {
      name: "ลูกค้าเก่า",
      data: oldCustomerSales,
    },
  ];

  
  return (
    <div className="w-full relative h-inherit">
      <Card className="rounded-md h-full">
        <CardBody>
          <div className="py-1">
            <div className="flex flex-row justify-center mb-5">
              <span className="text-lg">{getSalesByRange(startDate, endDate)}</span>
            </div> 
            {isLoading ?  <Spinner color="primary" className="content flex flex-col justify-center items-center h-[315px]"/>:<div className="content flex flex-col justify-center h-full">
              <Chart
                options={chartOptions}
                series={series}
                type="bar"
                height={300}
              />
            </div>}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default GraphSale;
