import React from "react";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import MonetaryChart from "./monetaryChart";
import RecencyChart from "./recencyChart";
import FequencyChart from "./frequencyChart";
function AnalysisSegment() {
  return (
    <Card radius="sm" shadow="none">
      <CardBody>
        <div className="p-4 gap-10">
          <div className="mb-5">
            <h1 className="font-extrabold text-xl">RFM Analysis</h1>
          </div>

          <div className=" grid grid-cols-3 justify-center items-center px-5 py-2 gap-10">
            <section className="flex flex-col gap-5">
              <div className="flex flex-row gap-3 items-center">
                <h1 className="font-extrabold">RECENCY</h1>
                <p className=" font-light text-sm">
                  (สั่งซื้อล่าสุด (วัน))
                </p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <RecencyChart />
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-5">
              <div className="flex flex-row gap-3 items-center">
                <h1 className="font-extrabold">FREQUENCY</h1>
                <p className=" font-light text-sm">
                  (สั่งซื้อครั้งที่)
                </p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <FequencyChart />
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-5">
              <div className="flex flex-row gap-3 items-center">
                <h1 className="font-extrabold">MONETARY</h1>
                <p className=" font-light text-sm">(ยอดขายสะสม)</p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <MonetaryChart />
                </div>
              </div>
            </section>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AnalysisSegment;
