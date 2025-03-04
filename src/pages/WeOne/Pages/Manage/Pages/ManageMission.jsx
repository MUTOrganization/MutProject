import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Badge } from "@nextui-org/react";


function ManageMission() {


  return (
    <div className="flex flex-col h-screen overflow-hidden w-full px-3">
      {/* Scrollable Section */}
      <section className="flex-grow space-y-3 overflow-y-auto scrollbar-hide w-full">
        <Card
          radius="lg"
          shadow="none"
          isPressable
          as={Link}
          to={"/WeOne-Manage-SetMission"}
          className="bg-[#e4f2ff] p-1 shadow-sm w-full"
        >
          <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            {/* Content */}
            <div>
              <h2 className="text-lg font-bold">สร้างกิจกรรม</h2>
              <p className="text-sm text-gray-600">
                เพิ่มกิจกรรมให้พนักงานของคุณ
              </p>
            </div>
          </CardBody>
        </Card>
        <Card
          radius="lg"
          shadow="none"
          isPressable
          className="bg-[#e4f2ff] p-1 shadow-sm w-full"
          as={Link}
          to={"/WeOne-Manage-CheckMission"}
        >
          <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            {/* Content */}
            <div>
              <h2 className="text-lg font-bold">ตรวจสอบกิจกรรม</h2>
              <p className="text-sm text-gray-600">
                ตรวจสอบกิจกรรมเมื่อพนักงานทำกิจกรรมสำเร็จ
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

export default ManageMission;
