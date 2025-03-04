import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function DeleteNewsModal({
  isOpen,
  onOpenChange,
  onConfirmDelete,
  newsItem,
}) {
  // newsItem คือข่าวที่จะลบ
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>ยืนยันการลบ</ModalHeader>
        <ModalBody>
          <p className="text-sm">
            คุณต้องการลบข่าว “<strong>{newsItem?.news_title}</strong>” ใช่หรือไม่?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button color="danger" onPress={onConfirmDelete}>
            ลบ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
