import React from "react";
import {
  Card,
  CardBody,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import GraphSale from "./graphSale";
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  const number = Number(amount);
  const formattedNumber = number
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `฿${formattedNumber}`;
};

const formatCurrencyNoDollars = (amount) => {
  if (amount === undefined || amount === null) return "N/A";

  const number = Number(amount);
  const formattedNumber = number
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${formattedNumber}`;
};
function groupAndRankChannels(data) {
  const groupedData = data.reduce((acc, curr) => {
    const { channel, sales, newcus, oldcus } = curr;
    const salesValue = parseFloat(sales) || 0;
    const newCusValue = parseInt(newcus) || 0;
    const oldcusValue = parseInt(oldcus) || 0;

    if (!acc[channel]) {
      acc[channel] = {
        totalSales: 0,
        orders: 0,
        newInquiries: 0,
      };
    }

    acc[channel].totalSales += salesValue;
    acc[channel].orders += newCusValue + oldcusValue;

    return acc;
  }, {});

  // Convert to array and sort by totalSales in descending order
  return Object.entries(groupedData)
    .map(([name, stats]) => ({
      name,
      ...stats,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);
}

function Section2({ data, dataSale, startDate, endDate, isLoading }) {
  const rankedChannels = groupAndRankChannels(data);

  return (
    <div className="section-2-container mt-4 space-x-0 xl:space-x-3 flex xl:flex-row md:flex-col flex-col xl:space-y-0 space-y-4 h-5/6">
      <div className="w-full relative h-inherit">
        <GraphSale
          dataSale={dataSale}
          startDate={startDate}
          endDate={endDate}
          isLoading={isLoading}
        />
      </div>
      <div className="w-full">
        <Card className="rounded-md">
          <CardBody>
            <div className="py-4">
              <div>
                <span className="flex flex-row justify-center">PLATFORM</span>
              </div>
              <Table
                aria-label="Platform Sales Data"
                selectionMode="none"
                className="max-h-[315px] overflow-y-auto p-2 scrollbar-hide"
                isHeaderSticky
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>ช่องทางการขาย</TableColumn>
                  <TableColumn>ยอดขายรวม</TableColumn>
                  <TableColumn>ออเดอร์รวม</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={"ยังไม่มีข้อมูล"}
                  loadingState={isLoading ? "loading" : undefined}
                  loadingContent={
                    <Spinner
                      color="primary"
                      className="content flex flex-col justify-center items-center h-full"
                    />
                  }
                >
                  {rankedChannels.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Tooltip
                          content={<div className="text-sm">{item.name}</div>}
                          placement="top"
                        >
                          <span className="hover:cursor-pointer">
                            {index + 1}. {item.name}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          content={<div className="text-sm">{item.name}</div>}
                          placement="top"
                        >
                          <span className="hover:cursor-pointer">
                            {formatCurrency(item.totalSales.toFixed(2))}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          content={<div className="text-sm">{item.name}</div>}
                          placement="top"
                        >
                          <span className="hover:cursor-pointer">
                            {formatCurrencyNoDollars(item.orders)}
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Section2;
