import { Image, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import UserProfileAvatar from "../../../../../component/UserProfileAvatar";

function DetailImageModal({ image, open, close }) {
    return (
        <Modal isOpen={open} onClose={() => close(false)}>
            <ModalContent >
                <ModalHeader className="flex bg-blue-100 font-semibold text-primary justify-center items-center text-lg">
                    <p>ไฟล์แนบ</p>
                </ModalHeader>
                <ModalBody className="p-2 flex justify-center items-center max-h-[800px] overflow-auto scrollbar-hide">
                    <Image
                        src={image}
                        alt="Slip"
                        aria-label="img-slip"
                        height={600}
                        className="object-contain" />
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}


export default DetailImageModal;