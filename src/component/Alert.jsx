import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
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
    isShowIcon = true,
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
        <Modal isOpen={isOpen} isDismissable={isDismissable} onClose={onClose} size={size}>
            <ModalContent>
                <ModalHeader>
                    <div className="w-full flex flex-col justify-center items-center text-xl">
                        {isShowIcon && (
                            <div
                                className={`text-${color} text-3xl mb-4 border-4 border-${color} rounded-full p-2` +
                                    ' ' +
                                    classNames.icon}
                            >
                                {selectIcon}
                            </div>
                        )}
                        <div className={'' + ' ' + classNames.title}>{title}</div>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="mb-8 w-full">
                        {children}
                        <div className={'text-center text-wrap' + ' ' + classNames.content}>{content}</div>
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
