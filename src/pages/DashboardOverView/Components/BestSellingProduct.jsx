import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react";
import {
    formatCurrencyNoDollars,
    formatCurrencyNoDollarsWithFixed,
} from "../utils/currencyUtils";

function BestSellingProduct({ data, isLoading, dateMode, isPercentage }) {

    const bestSellingCurrent = data?.bestSellingProductsCurrent || [];
    const bestSellingLast = data?.bestSellingProductsLast || [];

    const findLastItem = (description) =>
        bestSellingLast.find((item) => item.description === description);

    const getComparisonColor = (currentValue, lastValue) => {
        const current = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;
        if (current > last) return "text-green-600";
        if (current < last) return "text-red-600";
        return "text-gray-500";
    };

    const getDifference = (currentValue, lastValue, isPercentage = false) => {
        const current = parseFloat(currentValue) || 0;
        const last = parseFloat(lastValue) || 0;
        const difference = current - last;

        if (isPercentage && last === 0) {
            return {
                formattedDifference: "N/A",
                color: getComparisonColor(current, last),
                arrow: current > last ? "▲" : current < last ? "▼" : "",
            };
        }

        return {
            formattedDifference: isPercentage
                ? `${((difference / last) * 100).toFixed(2)}%`
                : formatCurrencyNoDollarsWithFixed(Math.abs(difference)),
            color: getComparisonColor(current, last),
            arrow: current > last ? "▲" : current < last ? "▼" : "",
        };
    };

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["10"]));
    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    const rowsPerPage =
        selectedValue === "ทั้งหมด"
            ? bestSellingCurrent.length
            : parseInt(selectedValue, 10) || 10;

    let comparisonText = "";
    switch (dateMode) {
        case "วัน":
            comparisonText = "เทียบกับวันก่อน";
            break;
        case "ช่วงวัน":
            comparisonText = "เทียบกับช่วงวันก่อน";
            break;
        case "ปี":
            comparisonText = "เทียบกับปีก่อน";
            break;
        default:
            comparisonText = "เทียบกับเดือนก่อน";
            break;
    }

    if (isLoading) {
        return (
            <div>
                <h2 className="text-xl font-bold mb-4">สินค้าขายดีที่สุด</h2>
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-6 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">สินค้าขายดีที่สุด</h2>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedValue === "ทั้งหมด" ? "ทั้งหมด" : `แสดง ${selectedValue} แถว`}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="จำนวนแถวที่แสดง"
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key="ทั้งหมด">ทั้งหมด</DropdownItem>
                        <DropdownItem key="5">5</DropdownItem>
                        <DropdownItem key="10">10</DropdownItem>
                        <DropdownItem key="15">15</DropdownItem>
                        <DropdownItem key="20">20</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <ScrollArea className="h-[450px] w-full">
                <Table removeWrapper>
                    <TableHeader>
                        <TableColumn className="text-sm">อันดับ</TableColumn>
                        <TableColumn className="text-sm">สินค้า</TableColumn>
                        <TableColumn className="text-sm">ยอดขาย (ปัจจุบัน)</TableColumn>
                        <TableColumn className="text-sm">{comparisonText}</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {bestSellingCurrent.slice(0, rowsPerPage).map((currentItem, index) => {
                            const lastItem = findLastItem(currentItem.description);
                            const { formattedDifference, color, arrow } = getDifference(
                                currentItem.totalAmount,
                                lastItem?.totalAmount ?? 0,
                                isPercentage
                            );
                            return (
                                <TableRow key={currentItem.description + index}>
                                    <TableCell className="text-md">{index + 1}</TableCell>
                                    <TableCell className="text-md">{currentItem.description}</TableCell>
                                    <TableCell className="text-md">
                                        {formatCurrencyNoDollars(currentItem.totalAmount)}
                                    </TableCell>
                                    <TableCell className={`text-md ${color}`}>
                                        {lastItem ? (
                                            <>
                                                {arrow} {formattedDifference}
                                            </>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default BestSellingProduct;
