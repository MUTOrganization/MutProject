import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const ScatterChart = ({ orderRange }) => {
  const allOrders = {
    range1: [
      [5, 10000], [12, 25000], [18, 15000], [25, 20000], [30, 18000],
      [38, 30000], [40, 35000], [48, 27000], [50, 33000], [55, 28000]
    ],
    range2: [
      [10, 40000], [20, 42000], [30, 38000], [35, 45000], [40, 46000],
      [45, 49000], [50, 50000], [55, 53000], [60, 52000], [65, 51000]
    ],
    range3: [
      [15, 60000], [25, 63000], [35, 62000], [45, 64000], [55, 67000],
      [65, 70000], [70, 73000], [75, 75000], [80, 77000], [85, 78000]
    ],
    range4: [
      [20, 80000], [30, 85000], [40, 87000], [50, 90000], [60, 91000],
      [70, 93000], [75, 95000], [80, 98000], [90, 100000], [100, 105000]
    ]
  };

  const [chartData, setChartData] = useState(allOrders[orderRange]);

  useEffect(() => {
    setChartData(allOrders[orderRange]);
  }, [orderRange]);

  const [state] = useState({
    series: [{ name: "Customer Orders", data: chartData }],
    options: {
      chart: {
        height: 400,
        type: "scatter",
        zoom: { enabled: true, type: "xy" }
      },
      xaxis: {
        tickAmount: 10,
        min: 0,
        max: 100,
        title: {
          text: "RECENCY (จำนวนที่สั่งซื้อล่าสุด)",
          style: { color: "#54c8b6", fontSize: "14px", fontWeight: "bold" } 
        }
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: 110000,
        title: {
          text: "ORDER AMOUNT (ยอดเงิน ฿)",
          style: { fontSize: "14px", fontWeight: "bold" }
        },
        labels: {
          formatter: (value) => `${(value / 1000).toFixed(0)}K` 
        }
      },
      grid: {
        row: {
          colors: ["#b2dfdb", "#80cbc4", "#4db6ac", "#26a69a"],
          opacity: 0.2
        },
        column: {
          colors: ["#b2dfdb", "#80cbc4", "#4db6ac", "#26a69a"],
          opacity: 0.2
        }
      },
      markers: {
        size: 6,
        colors: ["#004D40"]
      },
      legend: { position: "top" }
    }
  });

  return (
    <div>
      <ReactApexChart options={state.options} series={[{ name: "Customer Orders", data: chartData }]} type="scatter" height={400} />
    </div>
  );
};

export default ScatterChart;
