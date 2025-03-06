import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Switch, Tooltip, Spinner } from "@nextui-org/react";

function AdsPieChart({ data, vatRate, isLoading }) {
  const [chartData, setChartData] = useState([]);
  const [isShowingAds, setIsShowingAds] = useState(true);

  const formattedValue = (value) =>
    value ? new Intl.NumberFormat().format(value) : "0";

  useEffect(() => {
    const values = isShowingAds
      ? data.map((item) => {
          const adsValue = parseFloat(item.ads) || 0;
          return vatRate ? adsValue * 1.07 : adsValue; // +7% VAT
        })
      : data.map((item) => parseFloat(item.admin) || 0);

    const teamNames = data.map((item) => item.teamAds);

    setChartData({
      series: values,
      options: {
        chart: {
          type: "pie",
        },
        labels: teamNames,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        tooltip: {
          y: {
            formatter: function (val) {
              return `฿${formattedValue(val)}`;
            },
          },
        },
      },
    });
  }, [data, isShowingAds, vatRate]);

  return (
    // ใช้ flex และกำหนด h-screen ให้เต็มหน้าจอ
    <div className="w-full flex flex-col p-4">
      {/* ส่วนบน สำหรับสวิตช์ Ads/ยอดขาย */}
      <div className="flex justify-end items-center space-x-2 mb-4">
        <span>Ads</span>
        <Tooltip
          showArrow={true}
          content={isShowingAds ? "กดเพื่อดูยอดขาย" : "กดเพื่อดูยอดแอด"}
          className="capitalize"
          offset={15}
        >
          <Switch
            checked={isShowingAds}
            onChange={() => setIsShowingAds(!isShowingAds)}
            size="sm"
          />
        </Tooltip>
        <span>ยอดขาย</span>
      </div>

      {/* ส่วนล่าง สำหรับ Chart (ขยายเต็มพื้นที่ที่เหลือ) */}
      <div className="flex-1 flex justify-center items-center">
        {chartData.series && chartData.series.length > 0 ? (
          <>
            {isLoading ? (
              <Spinner color="primary" className="flex justify-center items-center" />
            ) : (
              // ตั้ง height ของ chart ให้ยืดเต็มพื้นที่ container
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                height="100%"
                width="100%"
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center">
            ไม่มีข้อมูล
          </div>
        )}
      </div>
    </div>
  );
}

export default AdsPieChart;
