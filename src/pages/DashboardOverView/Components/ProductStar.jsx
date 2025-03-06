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

function ProductStar({ data, isLoading }) {
    const productStarData = data?.productStar?.[0] || [];

    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["ทั้งหมด"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", "),
        [selectedKeys]
    );

    const rowsPerPage =
        selectedValue === "ทั้งหมด"
            ? productStarData.length
            : parseInt(selectedValue, 10) || 10;

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
        <div shadow="none" radius="sm" className="h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Product Star</h2>
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
                        <TableColumn className="text-sm">รหัสตัวแทน</TableColumn>
                        <TableColumn className="text-sm">ชื่อ</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {productStarData.slice(0, rowsPerPage).map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="text-md">{index + 1}</TableCell>
                                <TableCell className="text-md">{item.description}</TableCell>
                                <TableCell className="text-md">{item.agent_code || item.agentId}</TableCell>
                                <TableCell className="text-md">{item.nick_name || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default ProductStar;
