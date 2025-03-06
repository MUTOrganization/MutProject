import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const DeleteItemModal = ({ isOpen, onClose, itemName, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>ยืนยันการลบ</ModalHeader>
        <ModalBody>
          <p>
            คุณแน่ใจหรือไม่ว่าต้องการลบ <strong>{itemName}</strong> ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={onClose}>
            ยกเลิก
          </Button>
          <Button color="danger" onPress={onConfirm}>
            ลบ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteItemModal;
