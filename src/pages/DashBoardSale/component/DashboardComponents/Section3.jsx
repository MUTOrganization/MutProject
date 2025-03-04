import React from "react";
import { Card, Spinner } from "@nextui-org/react";
import { RankIcon } from "../../../../component/Icons";
function Section3({ dataOrderStat, isLoading }) {
  // Step 1: Sort the products by totalPrice in descending order
  const sortedData = [...dataOrderStat].sort(
    (a, b) => b.totalPrice - a.totalPrice
  );

  // Extract top 3 products and the remaining products
  const topProducts = sortedData.slice(0, 3);
  const remainingProducts = sortedData.slice(3);

  // Styling configuration for top 3 cards
  const colors = [
    { bg: "bg-yellow-50", text: "text-yellow-500", badge: "bg-yellow-400" },
    { bg: "bg-gray-50", text: "text-gray-500", badge: "bg-gray-400" },
    { bg: "bg-red-50", text: "text-red-400", badge: "bg-red-400" },
  ];

  return (
    <Card className="p-6 mt-4" shadow="none" radius="sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="flex justify-center space-x-4 text-2xl font-bold  items-center">
          <span>อันดับสินค้า</span>{" "}
          <span>
            <RankIcon />
          </span>
        </h2>
      </div>

      {/* Top 3 Product Cards Layout */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        {topProducts.map((product, index) => (
          <div key={product.category} className="flex-1">
            <Card className={`shadow-md ${colors[index].bg}`}>
              <div className="flex flex-col items-center p-6">
                <div
                  className={`px-4 py-1 rounded-md text-white ${colors[index].badge} font-medium mb-2`}
                >
                  อันดับที่ {index + 1}
                </div>
                {isLoading ? (
                  <Spinner
                    color="primary"
                    className="content flex flex-col justify-center items-center h-full"
                  />
                ) : (
                  <>
                    {" "}
                    <h3 className="text-2xl font-bold">
                      {product.description}
                    </h3>
                    <p className="mt-2 text-lg">ยอดขาย</p>
                    <p className={`text-3xl font-bold ${colors[index].text}`}>
                      {product.totalPrice.toLocaleString()} ฿
                    </p>
                  </>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {isLoading ? (
        <Spinner
          color="primary"
          className="content flex flex-col justify-center items-center h-full"
        />
      ) : (
        <div className="grid grid-cols-3  max-h-32 overflow-y-auto scrollbar-thin scrollbar-hide gap-2">
          {remainingProducts.map((remaining, i) => (
            <Card
              key={remaining.category}
              className="flex justify-between items-center w-full px-4 py-2 bg-slate-100 rounded-md shadow-md mb-2"
            >
              <span className="font-medium text-sm">
                อันดับที่ {i + 4} {remaining.description}
              </span>
              <span className="text-sm">
                {remaining.totalPrice.toLocaleString()} ฿
              </span>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}

export default Section3;
