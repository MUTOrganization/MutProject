import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

export function GalleryImages({ data }) {
  return (
    // container นี้จะทำหน้าที่เป็น scrollable area ถ้าจำนวนการ์ดเยอะเกินความสูงของหน้า

    <div className="grid grid-cols-1 gap-4 p-2 h-[700px] overflow-y-auto">
      {data?.map((item, idx) => (
        <Card key={idx} className="rounded-lg max-h-[600px] min-h-[350px]">
          <CardHeader className="flex flex-col gap-1 px-4 pt-4 pb-0">
            <h2 className="text-lg font-semibold">{item.customer_name}</h2>
            <h2 className="text-lg font-semibold">{item.product}</h2>
            <div className="grid grid-cols-2">
              <p className="text-sm text-gray-500">{item.company}</p>
              <p className="text-sm text-gray-500">
                รหัสตัวเเทน: {item.agent_code}
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-4 py-2">
            <div className="flex flex-col gap-2 font-prompt text-sm md:text-md">
              <div className="grid md:grid-cols-2 md:gap-10 gap-2">
                <div className="flex space-x-5">
                  <h className=" font-bold">ชื่อลูกค้า</h>
                  <p className="text-gray-500">{item.customer_name}</p>
                </div>
                <div className="flex space-x-5">
                  <h className="font-bold ">เบอร์โทร</h>
                  <p className="text-gray-500">{item.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <h className="font-bold ">จังหวัด</h>
                <p className="text-gray-500">{item.customer_province}</p>
              </div>
              <div className="flex gap-2">
                <h className="font-bold ">ที่อยู่</h>
                <p className="text-gray-500">{item.customer_location}</p>
              </div>
              <div>
                <strong>อาการก่อนทาน:</strong> {item.before_food}
              </div>
              <div>
                <strong>อาการหลังทาน:</strong> {item.after_food}
              </div>

              <div>
                <strong>ข้อมูลเพิ่มเติม:</strong> {item.description}
              </div>
            </div>
          </CardBody>

          <CardFooter className="flex flex-col items-end text-xs text-gray-500 px-4 pb-4 pt-0">
            <span>ส่งเมื่อ: {new Date(item.created_at).toLocaleString()}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
