import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function ConfirmCaseModal({
  isOpen,
  onClose,
  formData,
  onConfirm,
  onOpenChangeConfirm,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChangeConfirm} isCentered>
      <ModalContent className="rounded-lg overflow-hidden">
        <ModalHeader className="bg-blue-500 text-white px-6 py-4">
          <h2 className="text-xl font-bold">ยืนยันการส่งเคสรีวิว</h2>
        </ModalHeader>
        <ModalBody className="p-6">
          <div className="flex flex-col gap-4">
            {/* หัวข้อแสดงชื่อและผลิตภัณฑ์ */}
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold">{formData.customerName}</h2>
              <p className="text-sm ">{formData.product}</p>
            </div>

            {/* ข้อมูลบริษัทและรหัสตัวแทน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">บริษัท:</p>
                <p className="text-gray-800">{formData.companyName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">รหัสตัวแทน:</p>
                <p className="text-gray-800">{formData.discountCode}</p>
              </div>
            </div>

            {/* ข้อมูลลูกค้า */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-600">ชื่อลูกค้า:</p>
                <p className="text-gray-800">{formData.customerName}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">เบอร์โทร:</p>
                <p className="text-gray-800">{formData.phone}</p>
              </div>
            </div>

            {/* ข้อมูลที่อยู่ */}
            <div className="text-sm">
              <p className="font-semibold text-gray-600">จังหวัด:</p>
              <p className="text-gray-800">{formData.province}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-600">ที่อยู่:</p>
              <p className="text-gray-800">{formData.address}</p>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="text-sm">
              <p className="font-semibold text-gray-600">อาการก่อนทาน:</p>
              <p className="text-gray-800">{formData.symptomBefore}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-600">อาการหลังทาน:</p>
              <p className="text-gray-800">{formData.symptomAfter}</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-600">ข้อมูลเพิ่มเติม:</p>
              <p className="text-gray-800">{formData.other}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-gray-100 p-4 flex justify-end gap-4">
          <Button color="danger" variant="flat" onPress={onClose}>
            ยกเลิก
          </Button>
          <Button color="primary" onPress={onConfirm}>
            ยืนยัน
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
