import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { formatDateThai } from "@/component/DateUtiils";
import NotificationSettingModal from "./NotificationSettingModal";
import SaleTargetModal from "./SaleTargetModal"; // ← import component ใหม่
import fetchProtectedData from "../../../../../../utils/fetchData";
import { toastError, toastSuccess } from "@/component/Alert";
import { URLS } from "@/config";


function ManagementSection({ onBack, bookings, businessId, fetch }) {
  const [localBookings, setLocalBookings] = useState(bookings);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  // state สำหรับควบคุมแท็บสถานะ
  const [activeTab, setActiveTab] = useState("pending");
  // ตัวเลือกแท็บ
  const tabs = [
    { label: "รอการตรวจสอบ", value: "pending" },
    { label: "อนุมัติแล้ว", value: "confirmed" },
    { label: "ยกเลิกแล้ว", value: "cancelled" },
    { label: "ทั้งหมด", value: "all" },
  ];

  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Modal ตั้งค่าการแจ้งเตือน
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  // ** เพิ่ม state สำหรับ Modal ตั้งยอดขาย **
  const [isSaleTargetModalOpen, setIsSaleTargetModalOpen] = useState(false);

  // ฟังก์ชันอนุมัติ
  const handleApprove = async (bookingId) => {
    try {
      const payload = {
        booking_id: bookingId,
        status: "confirmed",
      };
      const response = await fetchProtectedData.put(
        URLS.WebContent.updateBooking,
        payload
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to approve booking");
      }
      fetch();
      toastSuccess("อนุมัติ booking เรียบร้อย");
    } catch (error) {
      console.error(error);
      toastError("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // ฟังก์ชันยกเลิก
  const handleCancel = async (bookingId) => {
    try {
      const payload = {
        booking_id: bookingId,
        status: "cancelled",
      };
      const response = await fetchProtectedData.put(
        URLS.WebContent.updateBooking,
        payload
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to cancel booking");
      }
      fetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const response = await fetchProtectedData.delete(`
        ${URLS.WebContent.deleteBooking}?booking_id=${bookingId}`);
      if (!response || response.status !== 200) {
        throw new Error("Failed to cancel booking");
      }
      fetch();
    } catch (error) {
      console.error(error);
    }
  };

  // ดูสลิป
  const handleViewSlip = (slipUrl) => {
    if (!slipUrl) return;
    setSelectedSlip(slipUrl);
    setIsSlipModalOpen(true);
  };

  // ฟิลเตอร์ Booking ตามแท็บ
  const filteredBookings = localBookings.filter((item) => {
    if (activeTab === "all") return true;
    return item.status === activeTab;
  });

  return (
    <div className="h-full flex flex-col bg-gray-100 p-6 rounded-lg shadow">
      {/* ส่วนหัว */}
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <span className="text-xl font-semibold">ส่วนการจัดการ</span>
        <div className="flex gap-2">
          <Button
            color="success"
            size="sm"
            onPress={() => setIsNotifyModalOpen(true)}
          >
            ตั้งค่าการแจ้งเตือน
          </Button>
          {/* ปุ่มตั้งยอดขาย */}
          <Button
            color="primary"
            size="sm"
            onPress={() => setIsSaleTargetModalOpen(true)}
          >
            ตั้งยอดขาย
          </Button>
        </div>
      </div>

      {/* แท็บสถานะ */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            size="sm"
            color={activeTab === tab.value ? "primary" : "default"}
            onPress={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* รายการ booking */}
      <div className="h-[650px] flex-grow overflow-y-auto space-y-4">
        {filteredBookings && filteredBookings.length > 0 ? (
          filteredBookings.map((item) => (
            <Card key={item.id} variant="shadow">
              <CardBody>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    บริษัท: {item.company || "-"}
                  </h3>
                  <span
                    className={
                      "px-2 py-1 rounded-full text-xs font-bold " +
                      (item.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : item.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : item.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-gray-300 text-gray-800")
                    }
                  >
                    {item.status === "pending"
                      ? "รอการตรวจสอบ"
                      : item.status === "confirmed"
                        ? "อนุมัติแล้ว"
                        : item.status === "cancelled"
                          ? "ยกเลิกแล้ว"
                          : item.status}
                  </span>
                </div>
                <h3 className="font-semibold text-md mb-2">ข้อมูลผู้จอง</h3>
                <div className="text-sm ml-2 space-y-1">
                  <p>ชื่อ: {item.name || "-"}</p>
                  <p>เบอร์โทร: {item.phone || "-"}</p>
                  <p>Email: {item.email || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <h3 className="font-semibold text-md mb-2">ข้อมูลการจอง</h3>
                    <div className="ml-2 text-xs">
                      <p>
                        วันที่จอง:{" "}
                        {item.start ? formatDateThai(item.start) : "-"}
                      </p>
                      <p>เวลาที่เข้า: {item.time || "-"} น.</p>
                      <p>Content: {item.contentType || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-md mb-2">ห้องที่จอง</h3>
                    {item.rooms && item.rooms.length > 0 ? (
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        {item.rooms.map((room, idx) => (
                          <li key={idx} className="text-green-600 font-medium">
                            {room}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-500 text-sm">
                        ไม่มีข้อมูลห้องที่จอง
                      </p>
                    )}
                  </div>
                </div>
              </CardBody>

              <CardFooter className="flex justify-end gap-2 py-0 mb-3">
                {/* ปุ่มดูสลิป (ถ้ามีสลิป) */}
                {item.slip && (
                  <Button
                    color="primary"
                    size="sm"
                    onPress={() => handleViewSlip(item.slip)}
                  >
                    ดูสลิป
                  </Button>
                )}

                {/* ถ้าสถานะเป็น pending => แสดงปุ่มอนุมัติ / ไม่อนุมัติ */}
                {item.status === "pending" && (
                  <>
                    <Button
                      color="success"
                      size="sm"
                      onPress={() => handleApprove(item.id)}
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleCancel(item.id)}
                    >
                      ไม่อนุมัติ
                    </Button>
                  </>
                )}

                {/* ถ้าสถานะเป็น cancelled => แสดงปุ่ม “อนุมัติใหม่” */}
                {item.status === "cancelled" && (
                  <>
                    <Button
                      color="success"
                      size="sm"
                      onPress={() => handleApprove(item.id)}
                    >
                      อนุมัติใหม่
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => handleDelete(item.id)}
                    >
                      ลบการจอง
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500">ไม่มีข้อมูลการจอง</div>
        )}
      </div>

      <div className="flex-shrink-0 mt-4">
        <Button onPress={onBack} className="w-full bg-black text-white">
          กลับไปยังฟอร์มการจอง
        </Button>
      </div>

      {/* Modal ดูสลิป */}
      <Modal
        isOpen={isSlipModalOpen}
        onOpenChange={setIsSlipModalOpen}
        size="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>สลิปการชำระเงิน</ModalHeader>
          <ModalBody>
            {selectedSlip ? (
              <img
                src={selectedSlip}
                alt="Slip"
                className="max-w-full max-h-[400px] object-contain mx-auto"
              />
            ) : (
              <p className="text-center">ไม่มีสลิป</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsSlipModalOpen(false)}>
              ปิด
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal ตั้งค่าการแจ้งเตือน */}
      <NotificationSettingModal
        isOpen={isNotifyModalOpen}
        onOpenChange={setIsNotifyModalOpen}
        businessId={businessId}
      />

      {/* Modal ตั้งยอดขาย (SaleTargetModal) */}
      <SaleTargetModal
        isOpen={isSaleTargetModalOpen}
        onOpenChange={setIsSaleTargetModalOpen}
        businessId={businessId}
      />
    </div>
  );
}

export default ManagementSection;
