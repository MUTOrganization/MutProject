import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { toastSuccess, toastError } from "@/component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";

function SaleTargetModal({ isOpen, onOpenChange, businessId }) {
  const [targetValue, setTargetValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOldTarget() {
      if (!isOpen) return;
      try {
        // เรียก API GET ค่าเป้าหมายเก่า
        const response = await fetchProtectedData.get(
          `${URLS.WebContent.getRate}`
        );
        if (response.status === 200 && response.data) {
          setTargetValue(response.data.rate_amount || "");
        }
      } catch (error) {
        console.error("Error fetching old sale target:", error);
      }
    }
    fetchOldTarget();
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    console.log(targetValue);
    
    try {
      const payload = {
        business_id: businessId,
        rate_amount: targetValue,
      };
      const response = await fetchProtectedData.post(
        URLS.WebContent.createRate,
        payload
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to set sale target");
      }
      toastSuccess("บันทึกเป้าหมายยอดขายสำเร็จ!");
    } catch (error) {
      console.error(error);
      toastError("เกิดข้อผิดพลาดในการบันทึกเป้าหมาย");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>ตั้งค่าเป้าหมายยอดขาย</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-sm">กรุณากรอกยอดขายเป้าหมาย (บาท)</p>
            <Input
              label="ยอดขายเป้าหมาย"
              aria-label="TargetSale"
              placeholder="เช่น 500000"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleSave} isLoading={isLoading}>
            บันทึก
          </Button>
          <Button
            color="danger"
            variant="light"
            onPress={() => onOpenChange(false)}
          >
            ปิด
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SaleTargetModal;
