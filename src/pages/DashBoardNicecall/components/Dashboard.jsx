import React, { useState, useMemo } from "react";
import { Card, CardBody } from "@nextui-org/react";
import {
  BathThaiIcon,
  ItemsIcon,
  FreeIcon,
  NotFreeIcon,
  BoxIcon,
  CommissionIcon,
} from "@/component/Icons";
import ChartSummary from "./SectionDashboard/ChartSummary";
import {
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Button,
  Chip,
} from "@nextui-org/react";
import {
  calculateTotals,
  compareSales,
  groupAndCalculate,
  useChartData
} from "../utils/calculateNC";
import { formatNumber, formatCurrency } from "@/component/FormatNumber";
function Dashboard({ currentMonth, lastMonth }) {
  const [showSalesChart, setShowSalesChart] = useState(
    new Set(["จำนวนยอดขาย"])
  );
  const [selectedCategory, setSelectedCategory] = useState("สินค้าขาย");

  const selectedValueShowChart = useMemo(
    () => Array.from(showSalesChart).join(", ").replace(/_/g, ""),
    [showSalesChart]
  );

  const totalscurrentMonth = calculateTotals(currentMonth);
  const totalslastMonth = calculateTotals(lastMonth);

  const groupedData = groupAndCalculate(currentMonth);
  
  const chartData =useChartData(currentMonth)


  

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card shadow="sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">ยอดขายรวม</div>
            <BathThaiIcon />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {formatNumber(totalscurrentMonth.totalPriceSold)}
            </div>
            <p className="text-xs text-muted-foreground">
              {compareSales(
                totalscurrentMonth.totalPriceSold,
                totalslastMonth.totalPriceSold
              )}{" "}
              %
            </p>
          </div>
        </Card>
        <Card shadow="sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">
              จำนวนสินค้าขายรวม
            </div>
            <BoxIcon />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(totalscurrentMonth.totalQtySold)}
            </div>
            <p className="text-xs text-muted-foreground">
              {compareSales(
                totalscurrentMonth.totalQtySold,
                totalslastMonth.totalQtySold
              )}{" "}
              %
            </p>
          </div>
        </Card>
        <Card shadow="sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">
              จำนวนสินค้าแถมรวม
            </div>
            <FreeIcon />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(totalscurrentMonth.totalQtyFree)}
            </div>
            <p className="text-xs text-muted-foreground">
              {compareSales(
                totalscurrentMonth.totalQtyFree,
                totalslastMonth.totalQtyFree
              )}{" "}
              %
            </p>
          </div>
        </Card>
        <Card shadow="sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center justify-between gap-5">
              <div className="tracking-tight text-sm font-medium">
                ค่าคอมมิชชั่น
              </div>
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                className="tracking-tight text-sm font-medium"
              >
                หักภาษี ณ ที่จ่าย 3 %
              </Chip>
            </div>

            <CommissionIcon />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {formatCurrency(totalscurrentMonth.totalFinalCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              {compareSales(
                totalscurrentMonth.totalFinalCommission,
                totalslastMonth.totalFinalCommission
              )}{" "}
              %
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="text-card-foreground col-span-4">
          <div className="flex  justify-between p-6">
            <div className="font-semibold leading-none tracking-tight text-2xl">
              ภาพรวมสินค้าขาย
            </div>
            <div className="font-semibold leading-none tracking-tight">
              {" "}
              <Dropdown>
                <DropdownTrigger>
                  <Button className="capitalize" variant="bordered">
                    {selectedValueShowChart}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="เลือกมุมมอง"
                  selectedKeys={showSalesChart}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={setShowSalesChart}
                >
                  <DropdownItem
                    startContent={<BathThaiIcon />}
                    key="จำนวนยอดขาย"
                    description="รูปการแสดงผลจำนวนยอดขาย"
                  >
                    จำนวนยอดขาย
                  </DropdownItem>
                  <DropdownItem
                    startContent={<ItemsIcon />}
                    key="จำนวนรายการ"
                    description="รูปการแสดงผลจำนวนรายการ"
                  >
                    จำนวนรายการ
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="p-6 pt-0">
            <ChartSummary showSales={showSalesChart} chartData={chartData}/>
          </div>
        </Card>

        <Card className="text-card-foreground col-span-3">
          <div className="flex justify-between p-6">
            <div className="flex flex-col space-y-2">
              <div className="font-semibold leading-none tracking-tight text-2xl">
                รายการสินค้าทั้งหมด
              </div>
              <div className="text-sm text-muted-foreground">
                มีจำนวน{" "}
                {Object.keys(groupedData[selectedCategory] || {}).length} รายการ
              </div>
            </div>
            <div className="font-semibold leading-none tracking-tight">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="capitalize"
                    variant="bordered"
                    startContent={
                      selectedCategory === "สินค้าขาย" ? (
                        <NotFreeIcon />
                      ) : (
                        <FreeIcon />
                      )
                    }
                  >
                    {selectedCategory}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="เลือกมุมมอง"
                  selectedKeys={new Set([selectedCategory])}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={(key) =>
                    setSelectedCategory(Array.from(key)[0])
                  }
                >
                  <DropdownItem
                    startContent={<NotFreeIcon />}
                    key="สินค้าขาย"
                    description="สินค้าที่ขายได้"
                  >
                    สินค้าขาย
                  </DropdownItem>
                  <DropdownItem
                    startContent={<FreeIcon />}
                    key="สินค้าแถม"
                    description="สินค้าที่แถมฟรี"
                  >
                    สินค้าแถม
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="p-6 pt-0 max-h-96 overflow-y-auto space-y-3">
            {groupedData[selectedCategory] &&
            Object.keys(groupedData[selectedCategory]).length > 0 ? (
              Object.keys(groupedData[selectedCategory]).map((product) => {
                const { totalQty, totalPrice } =
                  groupedData[selectedCategory][product];
                return (
                  <div key={product} className="space-y-4 hover:cursor-default">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="flex flex-col space-y-1 text-md font-medium">
                          <div>{product}</div>
                          <div className="text-sm font-light">
                            จำนวน {totalQty} กล่อง
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto font-medium">
                        {totalPrice === "FREE"
                          ? "FREE"
                          : `฿${totalPrice.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground">
                ไม่มีข้อมูลในหมวดหมู่ "{selectedCategory}"
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
