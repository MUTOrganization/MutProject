import React from "react";
import ReactApexChart from "react-apexcharts";

const RecencyChart = () => {
  const data = {
    series: [
      {
        name: "Total Orders",
        data: [550, 580, 500, 530, 560], // Mocked data
      },
    ],
    options: {
      annotations: {
        points: [
          {
            x: "Bananas",
            seriesIndex: 0,
            label: {
              borderColor: "#775DD0",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#775DD0",
              },
              text: "Bananas are good",
            },
          },
        ],
      },
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: "50%",
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
        
      },

      xaxis: {
        categories: [
          "0-45 วัน",
          "45-90 วัน",
          "90-150 วัน",
          "150-240 วัน",
          "240+ วัน",
        ],
        labels: {
          style: { fontSize: "12px", fontWeight: "thin", color: "#6c757d" }, // Grayish font
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${value}K`, // Format Y-axis in K
          style: { color: "#6c757d" }, // Grayish font
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${value}K`,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      colors: ["#54c8b6"], // Match image color
    },
  };

  return (
    <div>
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default RecencyChart;
