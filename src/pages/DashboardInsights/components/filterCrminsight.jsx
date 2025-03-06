import React from "react";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";

function FilterCrminsight() {
  return (
    <>
      <Card radius="sm" shadow="none">
        <CardBody>
          <div className=" grid grid-cols-3 justify-center items-center px-5 py-2 gap-10">
            <section className="flex flex-col gap-5">
              <div>
                <h1 className="font-extrabold">RECENCY</h1>
                <p className=" font-light text-sm">สั่งซื้อล่าสุด (วัน)</p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <Select
                    variant="bordered"
                    size="sm"
                    className="max-w-full"
                    label="RECENCY"
                    defaultSelectedKeys={"all"}
                  >
                    <SelectItem key={"all"}>{"ทั้งหมด"}</SelectItem>
                  </Select>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-5">
              <div>
                <h1 className="font-extrabold">FREQUENCY</h1>
                <p className=" font-light text-sm">สั่งซื้อครั้งที่</p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <Select
                    variant="bordered"
                    size="sm"
                    className="max-w-full"
                    label="FREQUENCY"
                    defaultSelectedKeys={"all"}
                  >
                    <SelectItem key={"all"}>{"ทั้งหมด"}</SelectItem>
                  </Select>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-5">
              <div>
                <h1 className="font-extrabold">MONETARY</h1>
                <p className=" font-light text-sm">ยอดขายสะสม</p>
              </div>
              <div className="flex">
                <div className="w-full flex flex-col gap-4">
                  <Select
                    variant="bordered"
                    size="sm"
                    className="max-w-full"
                    label="MONETARY"
                    defaultSelectedKeys={"all"}
                  >
                    <SelectItem key={"all"}>{"ทั้งหมด"}</SelectItem>
                  </Select>
                </div>
              </div>
            </section>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default FilterCrminsight;
