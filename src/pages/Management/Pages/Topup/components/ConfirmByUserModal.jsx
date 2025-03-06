import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";

function ConfirmByUserModal({ open, close, data, status, isFetchData }) {
    const { currentUser } = useAppContext()

    //loading state
    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

    //Function Update status
    async function updateStatus() {
        setLoadingChangeStatus(true);
        await fetchProtectedData.post(URLS.wallet.cancelTopup, {
            trx: data.transactionNo,
            status: status,
        }).then(result => {
            toastSuccess(`ดำเดินการสำเร็จ`, `ยกเลิกรายการ ${data.transactionNo} เรียบร้อยแล้ว`);
            setLoadingChangeStatus(false);
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการได้โปรดลองใหม่อีกครั้ง');
        }).finally(_ => {
            setLoadingChangeStatus(false);
        })
    }

    async function handleConfirm() {
        await updateStatus();
        isFetchData(true);
        close(false);
    }

    function handleCancel() {
        isFetchData(false);
        close(false);
    }

    return (
        <Modal size="sm" backdrop="opaque" isOpen={open} onClose={() => close(false)}>
            <ModalContent>
                <ModalHeader className="flex bg-blue-100 text-primary text-lg font-semibold justify-center">
                    <p>ยืนยันการ ยกเลิกรายการ</p>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center text-sm space-y-2">
                        <p className="text-lg font-semibold">รายละเอียดการยกเลิก </p>
                        <p>หมายเลขอ้างอิง : {data.transactionNo}</p>
                        <p>สถานะรายการ : {CompareStatus(data.status, { 0: 'รอการอนุมัติ', 1: 'อนุมัติแล้ว', 2: 'ไม่อนุมัติ', 3: 'ผุ้ทำรายการยกเลิก', 4: 'รอการยืนยันใหม่' })}</p>
                        <p>ผู้ทำรายการ : {data.createBy}</p>
                        <p>จำนวนเงิน : {data.amount}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons confirmText="ยืนยัน" onConfirm={handleConfirm} onCancel={handleCancel} isLoading={loadingChangeStatus} isDisabledCancel={loadingChangeStatus} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmByUserModal;