import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Chip,
  Progress,
} from "@nextui-org/react";
import { formatCurrency } from "@/component/FormatNumber";

function BookingConfirmModal({
  isOpen,
  onOpenChange,
  selectedConfirm,
  formatDateThai,
  onConfirmBooking,
  onSlipFileChange,
  totalAmount,
  goalAmount,
  used,
  code,
}) {
  // คำนวณ % สำหรับ progress
  const percentage = Math.min((totalAmount / goalAmount) * 100, 100);
  // ถ้ายอดขาย >= goalAmount แปลว่ามีสิทธิ์ใช้คูปอง
  const eligibleForCoupon = totalAmount >= goalAmount;

  const [itemImage, setItemImage] = useState(null);
  // เริ่มต้นตัวเลือกเป็น "money" (จ่ายเงิน) โดยค่า default
  const [paymentOption, setPaymentOption] = useState("money");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImage(file);
      onSlipFileChange(file);
    }
  };

  // ฟังก์ชันกด "ยืนยันการจอง"
  const handleConfirm = () => {
    const useCoupon = paymentOption === "coupon";
    const usedCouponCode = code;
    onConfirmBooking(useCoupon, usedCouponCode);
    setItemImage(null);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
      <ModalContent>
        <ModalHeader>📋 ตรวจสอบรายละเอียดการจอง</ModalHeader>
        <ModalBody className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: รายละเอียดการจอง */}
            <div>
              <h3 className="text-lg font-semibold mb-3">👤 ข้อมูลผู้จอง</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>ชื่อ:</strong> {selectedConfirm?.name}
                </p>
                <p>
                  <strong>เบอร์โทร:</strong> {selectedConfirm?.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedConfirm?.email}
                </p>
                <p>
                  <strong>บริษัท:</strong> {selectedConfirm?.company || "-"}
                </p>
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">
                📅 ข้อมูลการจอง
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>วันที่จอง:</strong>{" "}
                  {formatDateThai(selectedConfirm?.date)}
                </p>
                <p>
                  <strong>เวลาที่เข้า:</strong> {selectedConfirm?.time} น.
                </p>
                <p>
                  <strong>Content:</strong>{" "}
                  {selectedConfirm?.contentType || "-"}
                </p>
              </div>
              <h3 className="text-lg font-semibold mt-4">🏢 ห้องที่จอง</h3>
              <ul className="list-disc pl-5 text-sm">
                {selectedConfirm?.rooms.length > 0 ? (
                  selectedConfirm.rooms.map((room, index) => (
                    <li key={index} className="text-green-600 font-medium">
                      {room}
                    </li>
                  ))
                ) : (
                  <p className="text-red-500">ไม่ได้เลือกห้อง</p>
                )}
              </ul>

              {/* Progress Bar แสดงยอดขาย */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  ยอดขายสะสมของเดือน
                </h3>
                <Progress
                  size="sm"
                  value={percentage}
                  color="success"
                  className="w-full"
                  isDisabled={!eligibleForCoupon}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(totalAmount)} / {formatCurrency(goalAmount)}{" "}
                  บาท
                </p>
              </div>

              {/* ตัวเลือกการชำระเงิน */}
              <div className="w-full mt-4">
                <div className="flex flex-col items-start gap-4">
                  <Checkbox
                    aria-label="money"
                    isSelected={paymentOption === "money"}
                    onChange={() => setPaymentOption("money")}
                    size="sm"
                  >
                    จ่ายเงิน
                  </Checkbox>
                  <Checkbox
                    aria-label="coupon"
                    isSelected={paymentOption === "coupon"}
                    onChange={() => setPaymentOption("coupon")}
                    isDisabled={!eligibleForCoupon}
                    size="sm"
                  >
                    {`ใช้สิทธิ์ Premium Aclog Content Service *ฟรี*`}
                  </Checkbox>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-10">
                <h3 className="text-lg font-semibold">💰 ราคาที่ต้องชำระ</h3>
                <p className="text-sm">
                  <strong>
                    {paymentOption === "coupon" ? "0 บาท" : "300 บาท"}
                  </strong>
                </p>
              </div>
            </div>

            {/* Right Column: ค่าใช้จ่ายและการชำระเงิน */}
            <div>
              {paymentOption === "money" && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mt-4">💳 ชำระเงิน </h3>
                    <Chip color="primary">ไม่สามารถออกบกำกับภาษีได้</Chip>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src="./img/bank_content.jpg"
                      alt="QR Code สำหรับชำระเงิน"
                      className="border p-2 h-96"
                    />

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700">
                        แนบสลิปการชำระเงิน
                      </label>
                      <div className="border-2 border-dashed border-gray-400 p-4 flex flex-col items-center justify-center min-h-[200px]">
                        {itemImage ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(itemImage)}
                              alt="preview"
                              className="max-w-full max-h-[200px] object-contain rounded cursor-pointer"
                              onClick={() =>
                                document
                                  .getElementById("itemImageUpload")
                                  .click()
                              }
                            />
                          </div>
                        ) : (
                          <label
                            htmlFor="itemImageUpload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            📷 คลิกเพื่อเพิ่มรูปภาพ
                            <p>**จำเป็นต้องมีรูปภาพ**</p>
                          </label>
                        )}
                        <input
                          id="itemImageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {paymentOption === "coupon" && (
                <p className="text-sm text-green-600 mt-4">
                  คุณเลือกใช้คูปอง ลดค่าชำระแล้ว
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onPress={handleConfirm} className="bg-success text-white">
            ยืนยันการจอง
          </Button>
          <Button
            variant="like"
            onPress={onOpenChange}
            className="hover:text-white hover:bg-danger"
          >
            ยกเลิก
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default BookingConfirmModal;
