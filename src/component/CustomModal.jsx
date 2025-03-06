import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Checkbox,
  DateRangePicker,
  CheckboxGroup,
} from "@nextui-org/react";
import { ConfirmCancelButtons } from "./Buttons";

// CustomModal Component
export const CustomModal = ({
  isOpen,
  onOpenChange,
  title,
  bodyContent,
  confirmAction,
  confirmText = "Action",
  cancelText = "Close",
  buttonSize = "md",
}) => {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl">
              {title}
            </ModalHeader>
            <ModalBody>{bodyContent}</ModalBody>
            <ModalFooter>
              <ConfirmCancelButtons
                onConfirm={() => {
                  onClose();
                  confirmAction();
                }}
                onCancel={onClose}
                confirmText={confirmText}
                cancelText={cancelText}
                size={buttonSize}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export const FilterModal = ({
  isOpen,
  onOpenChange,
  title,
  selectedCheckboxes,
  handleCheckboxSelection,
  handleSave,
  confirmText,
  cancelText,
  buttonSize,
}) => {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl">
              {title}
            </ModalHeader>
            <ModalBody>
              
              <div>
                <div className="mb-4">
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                    defaultSelected
                      value="all"
                      isSelected={selectedCheckboxes.all} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("all")}
                    >
                      เลือกทั้งหมด
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="multiple"
                      isSelected={selectedCheckboxes.multiple} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("multiple")}
                    >
                      เลือกหลายตัวเลือก
                    </Checkbox>
                  </CheckboxGroup>
                </div>

                {/* ยอดทัก Section */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ยอดทัก</label>
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                    defaultSelected
                      value="new"
                      isSelected={selectedCheckboxes.new} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("new")}
                    >
                      ยอดทักใหม่
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="old"
                      isSelected={selectedCheckboxes.old} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("old")}
                    >
                      ยอดทักเก่า
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="total"
                      isSelected={selectedCheckboxes.total} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("total")}
                    >
                      ยอดทักรวม
                    </Checkbox>
                  </CheckboxGroup>
                </div>

                {/* ยอดขาย Section */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ยอดขาย</label>
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                    defaultSelected
                      value="newSales"
                      isSelected={selectedCheckboxes.newSales} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("newSales")}
                    >
                      ยอดขายลูกค้าใหม่
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="oldSales"
                      isSelected={selectedCheckboxes.oldSales} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("oldSales")}
                    >
                      ยอดขายลูกค้าเก่า
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="totalSales"
                      isSelected={selectedCheckboxes.totalSales} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("totalSales")}
                    >
                      ยอดขายรวม
                    </Checkbox>
                  </CheckboxGroup>
                </div>

                {/* ออเดอร์ Section */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ออเดอร์</label>
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                    defaultSelected
                      value="newOrder"
                      isSelected={selectedCheckboxes.newOrder} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("newOrder")}
                    >
                      ออเดอร์ลูกค้าใหม่
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="oldOrder"
                      isSelected={selectedCheckboxes.oldOrder} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("oldOrder")}
                    >
                      ออเดอร์ลูกค้าเก่า
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="totalOrder"
                      isSelected={selectedCheckboxes.totalOrder} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("totalOrder")}
                    >
                      ออเดอร์รวม
                    </Checkbox>
                  </CheckboxGroup>
                </div>

                {/* ค่า Ads Section */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">ค่า Ads</label>
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                    defaultSelected
                      value="adsCost"
                      isSelected={selectedCheckboxes.adsCost} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("adsCost")}
                    >
                      ค่า Ads
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="newAdsPercentage"
                      isSelected={selectedCheckboxes.newAdsPercentage} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("newAdsPercentage")}
                    >
                      % Ads ลูกค้าใหม่
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="adminAdsPercentage"
                      isSelected={selectedCheckboxes.adminAdsPercentage} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("adminAdsPercentage")}
                    >
                      % Ads Admin
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="totalAdsPercentage"
                      isSelected={selectedCheckboxes.totalAdsPercentage} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("totalAdsPercentage")}
                    >
                      % Ads
                    </Checkbox>
                  </CheckboxGroup>
                </div>

                {/* การปิดการขาย Section */}
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">การปิดการขาย</label>
                  <CheckboxGroup orientation="horizontal">
                    <Checkbox
                      defaultSelected
                      value="closeNew"
                      isSelected={selectedCheckboxes.closeNew} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("closeNew")}
                    >
                      % ปิดการขายลูกค้าใหม่
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="closeTotal"
                      isSelected={selectedCheckboxes.closeTotal} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("closeTotal")}
                    >
                      % ปิดการขายรวม
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="adminCloseAds"
                      isSelected={selectedCheckboxes.adminCloseAds} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("adminCloseAds")}
                    >
                      % Ads Admin
                    </Checkbox>
                    <Checkbox
                    defaultSelected
                      value="totalCloseAds"
                      isSelected={selectedCheckboxes.totalCloseAds} // ใช้ isSelected เพื่อแสดงสถานะที่ถูกเลือก
                      onChange={() => handleCheckboxSelection("totalCloseAds")}
                    >
                      % Ads
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ConfirmCancelButtons
                onConfirm={() => {
                  handleSave(); // บันทึกเมื่อกดปุ่มบันทึก
                  onClose();
                }}
                onCancel={onClose}
                confirmText={confirmText}
                cancelText={cancelText}
                size={buttonSize}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};


export default { CustomModal, FilterModal };
