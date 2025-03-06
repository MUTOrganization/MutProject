import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Spinner } from "@nextui-org/react";

function StackedBarChart({ data, isLoading }) {
  const [chartData, setChartData] = useState({ series: [], options: {} });

  useEffect(() => {
    // Extract unique saleChannelNames (pages) and sort them
    const pages = [...new Set(data.map((item) => item.saleChannelName))].sort(
      (a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")); // Remove non-numeric characters and convert to number
        const numB = parseInt(b.replace(/\D/g, "")); // Remove non-numeric characters and convert to number
        return numA - numB; // Sort in ascending order
      }
    );

    const newCustomerSeries = {
      name: "ลูกค้าใหม่",
      data: pages.map((page) => {
        const entry = data.find((item) => item.saleChannelName === page);
        return entry ? entry.SalesNew : 0;
      }),
    };

    const oldCustomerSeries = {
      name: "ลูกค้าเก่า",
      data: pages.map((page) => {
        const entry = data.find((item) => item.saleChannelName === page);
        return entry ? entry.SalesOld : 0;
      }),
    };

    const upsaleSeries = {
      name: "อัพเซลล์",
      data: pages.map((page) => {
        const entry = data.find((item) => item.saleChannelName === page);
        return entry ? entry.upsale : 0;
      }),
    };

    // Set up chart data
    setChartData({
      series: [newCustomerSeries, oldCustomerSeries, upsaleSeries],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            dataLabels: {
              total: {
                enabled: true, // Enable total value on top
                formatter: function (val) {
                  return formatCurrency(val); // Use custom formatter
                },
                style: {
                  fontSize: "12px",
                  fontWeight: 200,
                  color: "#000", // Black color for total values
                },
                offsetY: -10, // Adjust position if needed
              },
            },
          },
        },
        xaxis: {
          categories: pages,
          title: {
            text: "เพจที่ทีมแอดดูแล",
          },
        },
        yaxis: {
          title: {
            text: "ยอดขาย (ลูกค้าใหม่/ลูกค้าเก่า/อัพเซลล์)",
          },
          labels: {
            formatter: function (val) {
              return formatCurrency(val); // Format y-axis labels
            },
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val) {
              return formatCurrency(val); // Format tooltip values
            },
          },
        },
      },
    });
  }, [data]);

  // Helper function to format currency with 'K' and 'M' suffixes
  const formatCurrency = (val) => {
    if (val >= 1_000_000) {
      return `฿${(val / 1_000_000).toFixed(1)}M`; // Format as 'M' for millions
    } else if (val >= 1_000) {
      return `฿${(val / 1_000).toFixed(1)}K`; // Format as 'K' for thousands
    }
    return `฿${new Intl.NumberFormat().format(val)}`; // Regular format for values below 1000
  };

  return (
<div className="stacked-bar-chart">
  {isLoading ? (
    <Spinner color="primary" className="flex justify-center items-center h-[300px]" />
  ) : chartData.series && chartData.series.length > 0 ? (
    <Chart options={chartData.options} series={chartData.series} type="bar" height="300" />
  ) : (
    <div className="flex justify-center items-center h-[300px]">
      ไม่มีข้อมูล
    </div>
  )}
</div>

  );
}

export default StackedBarChart;
