import React from "react";
import Chart from "react-apexcharts";
import {
    Card,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    CardBody,
} from "@nextui-org/react";

const RFMSegment = () => {

    const data = [
        { label: "Champions", value: 500000, revenue: 2500000, color: "#5E3DB3" },
        { label: "Loyalty", value: 500000, revenue: 2000000, color: "#9C27B0" },
        { label: "Potential", value: 500000, revenue: 1800000, color: "#D81B60" },
        { label: "Can't Lose", value: 500000, revenue: 2200000, color: "#E53935" },
        { label: "At Risk", value: 900000, revenue: 3000000, color: "#FB8C00" },
        { label: "Attention", value: 600000, revenue: 2100000, color: "#FFC107" },
        { label: "Promising", value: 300000, revenue: 1200000, color: "#26C6DA" },
        { label: "Sleep", value: 500000, revenue: 1700000, color: "#66BB6A" },
        { label: "New Customer", value: 400000, revenue: 1500000, color: "#8BC34A" },
        { label: "Hibernating", value: 500000, revenue: 1600000, color: "#9E9E9E" },
    ];
    const maxCustomers = Math.max(...data.map((d) => d.value));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card radius="sm" shadow="none">
                <CardBody className="space-y-4">
                    <span className="font-semibold text-lg">RFM Segment</span>
                    <Table removeWrapper aria-label="RFM Segment Data">
                        <TableHeader>
                            <TableColumn>กลุ่มลูกค้า</TableColumn>
                            <TableColumn>ยอดขายทั้งหมด</TableColumn>
                            <TableColumn>จำนวนลูกค้าในกลุ่ม</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell>
                                        {row.revenue.toLocaleString("th-TH", { style: "currency", currency: "THB" })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center w-full">
                                            <div className="h-4 rounded-full w-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 ease-in-out"
                                                    style={{
                                                        width: `${(row.value / maxCustomers) * 100}%`,
                                                        backgroundColor: row.color
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-sm font-medium text-gray-700">
                                                {(row.value / 1000).toLocaleString()}K
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Card radius="sm" shadow="none" className="flex justify-center items-center">
                <CardBody className="flex flex-col items-start space-y-6 w-full">
                    <div className="flex flex-col items-start space-y-2">
                        <span className="font-semibold text-lg">
                            Monetary {""}
                            <span className="text-sm text-gray-500">(ยอดขายตามกลุ่ม)</span>
                        </span>
                    </div>

                    <div className="flex justify-center w-full">
                        <Chart
                            options={{
                                chart: { type: "donut" },
                                labels: data.map((d) => {
                                    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
                                    const percentage = ((d.value / totalValue) * 100).toFixed(1);
                                    return `${d.label} (${percentage}%)`;
                                }),
                                colors: data.map((d) => d.color),
                                dataLabels: {
                                    enabled: true,
                                    formatter: (val) => `${val.toFixed(1)}%`,
                                    style: { fontSize: "14px", fontWeight: "bold" }
                                },
                                plotOptions: {
                                    pie: {
                                        donut: {
                                            size: "55%",
                                            labels: { show: true, total: { show: false } }
                                        },
                                    },
                                },
                                legend: { show: false },
                            }}
                            series={data.map((d) => d.value)}
                            type="donut"
                            width="350"
                            height="350"
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default RFMSegment;
