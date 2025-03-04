import React, { useState } from "react";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import ScatterChart from "./scatterChart";

function MonetarySegment() {
  const [selectedRange, setSelectedRange] = useState("range1");

  return (
    <>
      <Card radius="sm" shadow="none">
        <CardBody>
          <div className="grid grid-flow-col justify-between items-center px-5 py-2 gap-10">
            <div>
              <h1 className="font-extrabold text-[#54c8b6]">MONETARY (ยอดซื้อสะสม)</h1>
              <p className="font-light text-sm">(Switch to AOV MONETARY)</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Tabs
                aria-label="Options"
                classNames={{
                  tabList: "flex w-full",
                  cursor: "w-full bg-[#54c8b6]",
                  tab: "w-full p-4",
                  tabContent:
                    "group-data-[selected=true]:text-white rounded-lg text-[#54c8b6] font-semibold",
                }}
                variant="bordered"
                onSelectionChange={(key) => setSelectedRange(key)}
              >
                <Tab key="range1" title="คนที่ 1 - 500" />
                <Tab key="range2" title="คนที่ 501 - 1,000" />
                <Tab key="range3" title="คนที่ 1,001 - 1,500" />
                <Tab key="range4" title="คนที่ 1,501 - 2,000" />
              </Tabs>
            </div>
          </div>
          <div>
            <ScatterChart orderRange={selectedRange} />
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default MonetarySegment;
