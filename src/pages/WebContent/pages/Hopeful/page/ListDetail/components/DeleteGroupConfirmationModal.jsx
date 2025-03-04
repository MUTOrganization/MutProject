import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const DeleteGroupConfirmationModal = ({ isOpen, onOpenChange, onConfirm, groupName }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-xl">ยืนยันการลบ Group</h2>
            </ModalHeader>
            <ModalBody>
              <p>คุณแน่ใจหรือไม่ว่าต้องการลบ Group "{groupName}"?</p>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onPress={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button auto onPress={onConfirm}>
                ลบ
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteGroupConfirmationModal;
