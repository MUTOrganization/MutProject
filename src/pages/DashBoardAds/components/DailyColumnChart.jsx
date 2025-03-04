import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import { Spinner } from "@nextui-org/react";

function DailyColumnChart({ data, vatRate, isLoading }) {
  const applyVAT = (value) => (vatRate ? value * 1.07 : value);

  // Memoize the chart data calculation when data, vatRate, or isLoading changes
  const memoizedChartData = useMemo(() => {
    if (!data || data.length === 0) return {}; // Return empty if no data

    const dates = [...new Set(data.map((item) => item.date))].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Calculate the series data
    const percentageSeries = {
      name: "Ad Percentage",
      type: "line",
      data: dates.map((date) => {
        const totalSalesForDay = data
          .filter((item) => item.date === date)
          .reduce(
            (total, item) =>
              total +
              parseFloat(item.admin || 0) +
              parseFloat(item.upsale || 0),
            0
          );
        const totalAdsForDay = data
          .filter((item) => item.date === date)
          .reduce(
            (total, item) => total + applyVAT(parseFloat(item.ads || 0)),
            0
          );

        return totalSalesForDay > 0
          ? ((totalAdsForDay / totalSalesForDay) * 100).toFixed(2)
          : 0;
      }),
    };

    const percentAdsAdminSeries = {
      name: "Ad Percentage (Admin)",
      type: "line",
      data: dates.map((date) => {
        const totalAdminSalesForDay = data
          .filter((item) => item.date === date)
          .reduce((total, item) => total + parseFloat(item.admin || 0), 0);
        const totalAdsForDay = data
          .filter((item) => item.date === date)
          .reduce(
            (total, item) => total + applyVAT(parseFloat(item.ads || 0)),
            0
          );

        return totalAdminSalesForDay > 0
          ? ((totalAdsForDay / totalAdminSalesForDay) * 100).toFixed(2)
          : 0;
      }),
    };

    const percentAdsNewCustomerSeries = {
      name: "Ad Percentage (New Customer)",
      type: "line",
      data: dates.map((date) => {
        const totalNewSalesForDay = data
          .filter((item) => item.date === date)
          .reduce((total, item) => total + parseFloat(item.SalesNew || 0), 0);
        const totalAdsForDay = data
          .filter((item) => item.date === date)
          .reduce(
            (total, item) => total + applyVAT(parseFloat(item.ads || 0)),
            0
          );

        return totalNewSalesForDay > 0
          ? ((totalAdsForDay / totalNewSalesForDay) * 100).toFixed(2)
          : 0;
      }),
    };

    return {
      series: [
        percentageSeries,
        percentAdsAdminSeries,
        percentAdsNewCustomerSeries,
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          zoom: { enabled: true },
        },
        xaxis: {
          categories: dates,
          labels: {
            rotate: -45,
            style: { fontSize: "8px" },
          },
          title: { text: "Date" },
        },
        yaxis: {
          labels: { formatter: (val) => `${val}%` },
          title: { text: "Ad Percentage" },
        },
        tooltip: {
          shared: false,
          intersect: false,
          y: {
            formatter: function (val, { dataPointIndex, w }) {
              const date = w.globals.categoryLabels[dataPointIndex];
              const totalSalesForDay = data
                .filter((item) => item.date === date)
                .reduce(
                  (total, item) =>
                    total +
                    parseFloat(item.admin || 0) +
                    parseFloat(item.upsale || 0),
                  0
                );
              const totalAdsForDay = data
                .filter((item) => item.date === date)
                .reduce(
                  (total, item) => total + applyVAT(parseFloat(item.ads || 0)),
                  0
                );

              const totalSalesForDayAdmin = data
                .filter((item) => item.date === date)
                .reduce(
                  (total, item) => total + parseFloat(item.admin || 0),
                  0
                );

              const totalSalesForDayNew = data
                .filter((item) => item.date === date)
                .reduce(
                  (total, item) => total + parseFloat(item.SalesNew || 0),
                  0
                );

              const adPercentage =
                totalSalesForDay > 0
                  ? ((totalAdsForDay / totalSalesForDay) * 100).toFixed(2)
                  : 0;

              const adPercentageAdmin =
                totalSalesForDayAdmin > 0
                  ? ((totalAdsForDay / totalSalesForDayAdmin) * 100).toFixed(2)
                  : 0;

              const adPercentageNew =
                totalSalesForDayNew > 0
                  ? ((totalAdsForDay / totalSalesForDayNew) * 100).toFixed(2)
                  : 0;

              return `Date: ${date}<br/>
                Total Sales (รวมอัพเซลล์): ฿${new Intl.NumberFormat().format(totalSalesForDay)}<br/>
                Ads: ฿${new Intl.NumberFormat().format(totalAdsForDay)}<br/>
                <br/>Ad Percentage: ${adPercentage}%<br/>
                Ad Percentage (Admin): ${adPercentageAdmin}%<br/>
                Ad Percentage (New Customer): ${adPercentageNew}%<br/>`;
            },
          },
        },
        stroke: {
          width: 2,
          curve: "smooth",
        },
        markers: {
          size: Math.min(5, dates.length), // To avoid excessive markers
        },
        fill: {
          opacity: 1,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 300 },
              xaxis: { labels: { rotate: 0 } },
            },
          },
        ],
      },
    };
  }, [data, vatRate]);

  if (isLoading) return <Spinner color="primary" />;

  return (
    <div className="w-full h-full">
      {memoizedChartData.series ? (
        <Chart
          key={JSON.stringify(data)} // Reset component when data changes
          options={memoizedChartData.options}
          series={memoizedChartData.series}
          type="line"
          height="100%"
          width="100%"
        />
      ) : (
        <span className="flex justify-center">ไม่มีข้อมูล</span>
      )}
    </div>
  );
}

export default DailyColumnChart;
