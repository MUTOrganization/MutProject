import { Button } from "@heroui/react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import ImageInput from "./ImageInput";
import { useAppContext } from "@/contexts/AppContext";
import { useState } from "react";

export default function ChangeProfileImageModal({ isOpen, onClose = () => {} }) {
    const { currentUser, changeProfileImage } = useAppContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if(!selectedFile) return;
        setIsLoading(true);
        await changeProfileImage(selectedFile);
        onClose();
        setIsLoading(false);
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>เปลี่ยนรูปโปรไฟล์</ModalHeader>
                <ModalBody className="flex justify-center items-center">
                    <ImageInput size="xl" oldImageUrl={currentUser.displayImgUrl} onChange={(file) => setSelectedFile(file)} />
                </ModalBody>
                <ModalFooter>
                    <Button variant="solid" color="primary" onPress={() => handleSubmit()} isLoading={isLoading} isDisabled={!selectedFile}>ยืนยัน</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}