import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";


const DeleteConfirmationModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  listName,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-xl">ยืนยันการลบ</h2>
            </ModalHeader>
            <ModalBody>
              <p>คุณแน่ใจหรือไม่ว่าต้องการลบ List "{listName}"?</p>
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

export default DeleteConfirmationModal;
