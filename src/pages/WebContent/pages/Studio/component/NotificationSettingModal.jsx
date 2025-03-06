// NotificationSettingModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "@/config";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
function NotificationSettingModal({ isOpen, onOpenChange, businessId }) {
  // เก็บค่าจาก Input
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleSave = async () => {
    try {
      // ตัวอย่าง payload
      const payload = {
        business_id: businessId,
        webhook_url: webhookUrl,
      };

      const response = await fetchProtectedData.post(
        URLS.WebContent.createWebhook,
        payload
      );
      if (response.status !== 200) {
        throw new Error("Failed to create webhook");
      }
      console.log("Payload ที่จะส่งไป:", payload);

      toastSuccess("บันทึก Webhook สำเร็จ!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toastError("เกิดข้อผิดพลาดในการบันทึก Webhook");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>ตั้งค่า Webhook URL</ModalHeader>
        <ModalBody>
          {/* คำแนะนำวิธีสร้าง Custom Bot และนำ webhook_url มาใส่ */}
          <div className="text-sm text-gray-600 mb-4 space-y-2">
            <p>ขั้นตอนการไปเอา URL Webhook จากการสร้าง Custom Bot:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                เข้าไปที่การตั้งค่าห้องแชท (Chat Settings) แล้วคลิกที่ตัวเลือก{" "}
                <strong>Bot</strong>
              </li>
              <li>
                กดสร้าง <strong>Custom Bot</strong> จากนั้นตั้งค่าโปรไฟล์ Bot
                (ชื่อ, รูปภาพ ฯลฯ) ตามต้องการ
              </li>
              <li>
                สามารถกด “ตั้งค่าภายหลัง” ได้ หากยังไม่ต้องการปรับอะไรเพิ่มเติม
              </li>
              <li>
                เมื่อสร้างเสร็จแล้ว ให้เข้าไปที่การตั้งค่า Bot อีกครั้ง
                จะเห็นช่องสำหรับ <strong>Webhook URL</strong>
              </li>
              <li>
                <strong>คัดลอก (Copy)</strong> ค่านั้นมาใส่ในฟิลด์ด้านล่างนี้
              </li>
            </ol>
          </div>

          {/* ช่องกรอก Webhook URL */}
          <p className="mb-2">กรุณากรอก Webhook URL ที่ต้องการใช้งาน</p>
          <Input
            placeholder="https://example.com/my-webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            fullWidth
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={handleSave}>
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

export default NotificationSettingModal;
