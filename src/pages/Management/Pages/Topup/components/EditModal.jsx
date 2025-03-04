import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import { URLS } from "../../../../../config";
import fetchProtectedData from "../../../../../../utils/fetchData";


function EditModal({ open, close, data, status, isFetchData }) {
    const [amountInput, setAmountInput] = useState()

    //state loading
    const [loadingEdit, setLoadingEdit] = useState(false);

    //state Error
    const [amountError, setAmountError] = useState({ state: false, message: '' })


    async function fetchEditTopUp() {
        setLoadingEdit(true);
        const amountNum = parseFloat(amountInput).toFixed(2)
        console.log(amountNum)
        await fetchProtectedData.post(URLS.wallet.editTopUp, {
            trx: data.transactionNo,
            amount: amountNum
        }).then(r => {
            toastSuccess('ดำเนินการสำเร็จ', `แก้ไขรายการเติมเงิน ${data.transactionNo} เรียบร้อยแล้ว ตรวจสอบได้ที่ประวัติการเติมเงิน`)
            setLoadingEdit(false);
        }).catch(err => {
            toastError('ดำเนินการไม่สำเร็จ', 'เกิดข้อผิดพลาดในการแก้่ไขรายการเติมเงิน โปรดลองใหม่อีกครั้ง')
        }).finally(e => {
            setLoadingEdit(false);
        })
    }

    async function handleSubmit() {
        if (!amountInput) {
            toastWarning('กรุณากรอกจำนวนเงิน')
            setAmountError({ state: true, message: '**กรุณากรอกจำนวนเงิน' })
            return;
        }

        if (!Number(amountInput) || !parseFloat(amountInput) || amountInput <= 0) {
            toastWarning('กรุณากรอกจำนวนเงินให้ถูกต้อง')
            setAmountError({ state: true, message: '**กรุณากรอกจำนวนเงินให้ถูกต้อง' })
            return;
        }

        await fetchEditTopUp();
        isFetchData(true);
        close(false);
    }

    function handleClose() {
        clear();
        close(false);
    }

    function clear() {
        setAmountInput('');
        setAmountError({ state: false, message: '' });
    }

    return (
        <Modal isOpen={open} onClose={() => close(false)}>
            <ModalContent>
                <ModalHeader className="flex text-xl text-primary bg-blue-100 justify-center items-center font-semibold">
                    <p>แก้ไขรายการเติมเงิน</p>
                </ModalHeader>
                <ModalBody>
                    <div className="text-start text-sm space-y-2 flex flex-col items-center justify-start">
                        <p className="text-lg font-semibold">รายละเอียด</p>
                        <p>หมายเลขอ้างอิง : {data.transactionNo}</p>
                        <p>สถานะรายการ : {CompareStatus(data.status, { 0: 'รอการอนุมัติ', 1: 'อนุมัติแล้ว', 2: 'ไม่อนุมัติ', 3: 'ผุ้ทำรายการยกเลิก', 4: 'รอการยืนยันใหม่' })}</p>
                        <p>ผู้ทำรายการ : {data.createBy}</p>
                        <div className="flex text-nowrap items-center space-x-2">
                            <p>จำนวนเงิน :</p>
                            <Input
                                isInvalid={amountError.state}
                                errorMessage={amountError.message}
                                onFocus={clear}
                                onChange={e => setAmountInput(e.target.value)}
                                value={amountInput}
                                placeholder={data.amount || '0'}
                                size="sm"
                                variant="bordered"
                                className="max-w-xs"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons onConfirm={handleSubmit} onCancel={handleClose} isLoading={loadingEdit} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal;