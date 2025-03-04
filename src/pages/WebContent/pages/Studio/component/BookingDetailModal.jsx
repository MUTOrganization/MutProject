import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { ACCESS } from "@/configs/access";
import { useAppContext } from "@/contexts/AppContext";
function BookingDetailModal({
  isOpen,
  onOpenChange,
  selectedEvent,
  getStatusLabel,
  formatDateThai,
}) {
  const currentData = useAppContext();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent className="bg-white rounded-lg shadow-lg">
        <ModalHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 p-4 rounded-t-lg shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl font-bold">
              {selectedEvent?.title || "รายละเอียดการจอง"}
            </h2>
          </div>
        </ModalHeader>
        {currentData.accessCheck.haveAny([
          ACCESS.admin_content.admin_content,
        ]) && (
          <ModalBody className="p-6">
            <div className="space-y-6">
              {/* 1) ข้อมูลผู้จอง */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ข้อมูลผู้จอง</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>ชื่อ:</strong> {selectedEvent?.name || "-"}
                  </p>
                  <p>
                    <strong>เบอร์โทร:</strong> {selectedEvent?.phone || "-"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedEvent?.email || "-"}
                  </p>
                  <p>
                    <strong>บริษัท:</strong> {selectedEvent?.company || "-"}
                  </p>
                </div>
              </div>

              {/* 2) ข้อมูลการจอง */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ข้อมูลการจอง</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>วันที่จอง:</strong>{" "}
                    {selectedEvent?.start
                      ? formatDateThai(selectedEvent.start)
                      : "-"}
                  </p>
                  <p>
                    <strong>เวลาที่เข้า:</strong>{" "}
                    {selectedEvent?.time ? selectedEvent.time : "-"} น.
                  </p>
                  <p>
                    <strong>Content:</strong>{" "}
                    {selectedEvent?.contentType || "-"}
                  </p>
                </div>
              </div>

              {/* 3) ห้องที่จอง */}
              <div>
                <h3 className="text-lg font-semibold mb-3">ห้องที่จอง</h3>
                {selectedEvent?.rooms && selectedEvent.rooms.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedEvent.rooms.map((room, idx) => (
                      <li key={idx} className="text-green-600 font-medium">
                        {room}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-500 text-sm">ไม่มีข้อมูลห้องที่จอง</p>
                )}
              </div>

              {/* แสดงสถานะด้วย Chip */}
              <div>
                <span className="font-medium text-gray-700">สถานะ:</span>
                <span
                  className={`ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedEvent?.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : selectedEvent?.status === "confirm" ||
                          selectedEvent?.status === "confirmed"
                        ? "bg-green-200 text-green-800"
                        : selectedEvent?.status === "cancel" ||
                            selectedEvent?.status === "cancelled"
                          ? "bg-red-200 text-red-800"
                          : ""
                  }`}
                >
                  {selectedEvent ? getStatusLabel(selectedEvent.status) : "-"}
                </span>
              </div>
            </div>
          </ModalBody>
        )}
        <ModalFooter className="bg-gray-50 p-4 rounded-b-lg flex justify-end border-t border-gray-200">
          <Button color="danger" onPress={onOpenChange}>
            ปิด
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default BookingDetailModal;
