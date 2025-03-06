import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody, Badge } from "@nextui-org/react";

function ManageReward() {
  return (
    <div className="flex flex-col h-screen overflow-hidden w-full px-3">
      {/* Scrollable Section */}
      <section className="flex-grow space-y-3 overflow-y-auto scrollbar-hide w-full">
        <Card
          radius="lg"
          shadow="none"
          isPressable
          className="bg-[#e4f2ff] p-1 shadow-sm w-full"
          as={Link}
          to={"/WeOne-Manage-SetReward"}
        >
          <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            {/* Content */}
            <div>
              <h2 className="text-lg font-bold">จัดการคลังของรางวัล</h2>
              <p className="text-sm text-gray-600">
                จัดการคลังของรางวัลที่ให้พนักงาน
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
          to={"/WeOne-Manage-ManageReward"}
        >
          <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
            {/* Content */}
            <div>
              <h2 className="text-lg font-bold">จัดการขอเเลกของรางวัล</h2>
              <p className="text-sm text-gray-600">
                ตรวจสอบเเละยืนยันคำขอของพนักงาน
              </p>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  )
}

export default ManageReward