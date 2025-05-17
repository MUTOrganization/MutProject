import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/react";
import { toast } from "sonner";
import { HFExclamation, HFQuestionMark } from "./Icons";

export function toastError(txtHeader, txtDescription) {
    toast.error(txtHeader, {
        description: txtDescription,
        duration: 3000,
        closeButton: true,
        position: 'top-right'
    })
}

export function toastSuccess(txtHeader, txtDescription) {
    toast.success(txtHeader, {
        description: txtDescription,
        duration: 3000,
        closeButton: true,
        position: 'top-right'
    })
}

export function toastWarning(txtHeader, txtDescription) {
    toast.warning(txtHeader, {
        description: txtDescription,
        duration: 3000,
        closeButton: true,
        position: 'top-right'
    })
}

export function AlertQuestion({
    title,
    content,
    isDismissable = false,
    children,
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    confirmText,
    cancelText,
    showConfirmButton = true,
    size = 'lg',
    classNames = {
        title: '',
        icon: '',
        content: '',
        cancelButton: '',
        confirmButton: ''
    },
    icon = 'question',
    color = 'success'
}) {
    let selectIcon;
    switch (icon) {
        case 'question':
            selectIcon = <HFQuestionMark />;
            break;
        case 'warning':
            selectIcon = <HFExclamation />;
            break;
        default:
            break;
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={size}>
            <ModalContent>
                <ModalHeader className="w-full flex flex-col gap-1 text-center bg-custom-redlogin text-white">
                    <p>{title}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="w-full p-2 text-center">
                        <div className="mb-8 w-full">
                            {children}
                        <div className={'text-center text-wrap' + ' ' + classNames.content}>{content}</div>
                    </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button
                        variant="light"
                        onPress={onClose}
                        className={'' + ' ' + classNames.cancelButton}
                    >
                        {cancelText ?? 'ยกเลิก'}
                    </Button>
                    {showConfirmButton && (
                        <Button
                            color={color}
                            variant="solid"
                            className={'text-white' + ' ' + classNames.confirmButton}
                            onPress={onConfirm}
                            isLoading={isLoading}
                        >
                            {confirmText ?? 'ยืนยัน'}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
