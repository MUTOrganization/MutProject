import React from "react";
import Chart from "react-apexcharts";
import { Spinner } from "@nextui-org/react";

const RadarChartMultipleSeries = ({ data = {}, vatRate, isLoading }) => {
  const categories = Object.keys(data);

  // Preparing series data safely to avoid potential undefined values
  const series = [
    {
      name: "ยอดขายแอดมิน",
      data: categories.map((day) => data[day]?.admin || 0),
    },
    {
      name: "ยอดอัพเซล",
      data: categories.map((day) => data[day]?.upsale || 0),
    },
    {
      name: "ค่าแอด",
      data: categories.map((day) => {
        const adsValue = parseFloat(data[day]?.ads) || 0;
        return vatRate ? adsValue * 1.07 : adsValue;
      }),
    },
  ];

  const options = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: categories, // Days of the week
    },
    yaxis: {
      show: false, // Hide range values (y-axis numbers)
    },
    stroke: {
      width: 2,
      curve: 'smooth', // Optional for smoother lines
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `฿${new Intl.NumberFormat().format(val)}`, // Currency format
      },
    },
    legend: {
      position: 'top', // Adjust legend positioning
    },
    grid: {
      show: true, // Ensure grid lines are visible
      borderColor: "#e0e0e0", // Subtle grid lines color
    },
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      {isLoading ? (
        <Spinner color="primary" className="h-[300px]" />
      ) : (
        <Chart options={options} series={series} type="radar" height={300} />
      )}
    </div>
  );
};

export default RadarChartMultipleSeries;
