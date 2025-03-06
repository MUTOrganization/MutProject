import React from "react";
import { Card, CardBody, Spinner } from "@nextui-org/react";

function Section1({ dataSale, isLoading }) {
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A";

    const number = Number(amount);
    const formattedNumber = number
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${formattedNumber}`;
  };

  const totalSales = dataSale.reduce(
    (sum, sale) => sum + parseFloat(sale.sales || 0),
    0
  );
  const newCustomerSales = dataSale.reduce(
    (sum, sale) => sum + parseFloat(sale.SalesNew || 0),
    0
  );
  const oldCustomerSales = dataSale.reduce(
    (sum, sale) => sum + parseFloat(sale.SalesOld || 0),
    0
  );
  const totalOrder = dataSale.reduce(
    (sum, sale) =>
      sum + parseFloat(sale.newcus || 0) + parseFloat(sale.oldcus || 0),
    0
  );
  const totalInbox = dataSale.reduce(
    (sum, sale) => sum + parseFloat(sale.newInbox || 0),
    0
  );

  return (
    <div className="section-container">
      {/* Section 1 */}
      <div className="section-1 space-y-3">
        <div className="section-1 row-1 flex flex-col md:flex-row md:space-y-0 md:space-x-4 xl:flex-row xl:space-x-4 space-y-4 xl:space-y-0">
          <div className="w-full ">
            <Card className="rounded-md">
              <CardBody>
                <div className="flex flex-col items-center p-2 space-y-4">
                  <span className="text-blue-400">TOTAL SALES</span>
                  {isLoading ? (
                    <Spinner
                      color="primary"
                      className="content flex flex-col justify-center items-center h-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold">{`฿${formatCurrency(totalSales)}`}</span>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="w-full">
            <Card className="rounded-md">
              <CardBody>
                <div className="flex flex-col items-center p-2 space-y-4">
                  <span className="text-blue-400">TOTAL ORDER</span>
                  {isLoading ? (
                    <Spinner
                      color="primary"
                      className="content flex flex-col justify-center items-center h-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {formatCurrency(totalOrder)}
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="section-2 row-2">
          <Card className="rounded-md">
            <CardBody>
              <div className="flex flex-col items-center p-2 space-y-4">
                <span className="text-blue-400">TOTAL NEW INBOX</span>
                {isLoading ? (
                  <Spinner
                    color="primary"
                    className="content flex flex-col justify-center items-center h-full"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {formatCurrency(totalInbox)}
                  </span>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Section1;
