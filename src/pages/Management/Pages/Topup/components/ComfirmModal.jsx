import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";

function ConfirmModal({ open, close, data, status, isApprove, isFetchData }) {
    const { currentUser } = useAppContext()
    const [textAreaInput, setTextAreaInput] = useState('');

    //Error state
    const [txtAreaError, setTxtAreaError] = useState({ state: false, message: '' });

    //loading state
    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

    //Function Update status
    async function updateStatus() {
        setLoadingChangeStatus(true);
        await fetchProtectedData.post(URLS.wallet.topUpUpdateStatus, {
            trx: data.transactionNo,
            remark: textAreaInput,
            status: !status ? isApprove ? 1 : 2 : status,
            amount: data.amount,
            reConfirmBy: data.status === 4 ? currentUser.userName : null,
            confirmBy: data.status !== 4 ? currentUser.userName : null,
            createBy: data.createBy,
            changeStatus: false,
        }).then(result => {
            toastSuccess(`ดำเดินการสำเร็จ`, `อนุมัติรายการ ${data.transactionNo} เรียบร้อยแล้ว`);
            setLoadingChangeStatus(false);
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการได้โปรดลองใหม่อีกครั้ง');
        }).finally(_ => {
            setLoadingChangeStatus(false);
        })
    }

    async function handleConfirm() {
        if (!isApprove && !textAreaInput) {
            toastWarning('กรุณากรอกรายละเอียดเพิ่มเติม');
            setTxtAreaError({ state: true, message: '**กรุณากรอกรายละเอียดเพิ่มเติม' });
            return;
        }

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
                    <p>ยืนยันการ {isApprove ? 'อนุมัติ' : 'ไม่อนุมัติ'}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center text-sm space-y-2">
                        <p className="text-lg font-semibold">{isApprove ? 'อนุมัติ' : 'ไม่อนุมัติ'} รายการ </p>
                        <p>หมายเลขอ้างอิง : {data.transactionNo}</p>
                        <p>สถานะรายการ : {CompareStatus(data.status, { 0: 'รอการอนุมัติ', 1: 'อนุมัติแล้ว', 2: 'ไม่อนุมัติ', 3: 'ผุ้ทำรายการยกเลิก', 4: 'รอการยืนยันใหม่' })}</p>
                        <p>ผู้ทำรายการ : {data.createBy}</p>
                        <p>จำนวนเงิน : {data.amount}</p>

                        {!isApprove && (
                            <Textarea
                                onChange={e => setTextAreaInput(e.target.value)}
                                size="sm"
                                variant="bordered"
                                placeholder={data.remark ? data.remark : 'กรอกรายเอียดเพิ่มเติมที่นี้'}
                                aria-label="remark-textarea"
                                label='หมายเหตุ'
                                isInvalid={txtAreaError.state}
                                errorMessage={txtAreaError.message}
                                onFocus={() => setTxtAreaError({ state: false, message: '' })}
                                labelPlacement="inside" />
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons confirmText="ยืนยัน" onConfirm={handleConfirm} onCancel={handleCancel} isLoading={loadingChangeStatus} isDisabledCancel={loadingChangeStatus} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmModal;