import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Button, Textarea } from "@nextui-org/react";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { CustomFormatDate, CustomFormatDateTime } from "../../../../../../utils/FormatDate";
import { InfomationIcon } from "../../../../../component/Icons";
import { useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import moment from "moment";
import { toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";


function ModalRemark({ open, close, data, status, changeStatus, isFetchData }) {
    const { currentUser } = useAppContext();
    const [textAreaInput, setTextAreaInput] = useState('');

    //stete error
    const [textAreaError, setTextAreaError] = useState({ state: false, message: '' })
    //state loading
    const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);


    async function updateStatus() {
        setLoadingChangeStatus(true);
        await fetchProtectedData.post(URLS.wallet.topUpUpdateStatus, {
            trx: data.transactionNo,
            remark: textAreaInput,
            status: status || 2,
            amount: data.amount,
            reConfirmBy: data.status === 4 ? currentUser.userName : null,
            reConfirmDate: data.status === 4 ? CustomFormatDateTime() : null,
            createBy: data.createBy,
            changeStatus: changeStatus
        }).then(result => {
            toastSuccess(`ดำเดินการสำเร็จ`, `อนุมัติรายการ ${data.transactionNo} เรียบร้อยแล้ว`);
            setLoadingChangeStatus(false);
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการได้โปรดลองใหม่อีกครั้ง');
        }).finally(_ => {
            setLoadingChangeStatus(false);
        })
    }

    async function handleSubmit() {
        if (changeStatus && !textAreaInput) {
            toastWarning('กรุณากรอกรายละเอียดเพิ่มเติม');
            setTextAreaError({ state: true, message: 'กรุณากรอกรายละเอียดเพิ่มเติม' })
            return;
        }

        await updateStatus();
        isFetchData(true);
        close(false);
    }

    return (
        <Modal isOpen={open} onClose={() => close(false)}>
            <ModalContent>
                <ModalHeader className="flex bg-blue-100 text-primary justify-center items-center text-lg font-semibold">
                    <p>รายละเอียดเพิ่มเติม</p>
                </ModalHeader>
                <ModalBody className="p-5">
                    <div className="text-center m-2">
                        <p>หมายเลขอ้างอิง : {data.transactionNo}</p>
                        <p>สถานะรายการ : {CompareStatus(data.status, { 0: 'รอการอนุมัติ', 1: 'อนุมัติแล้ว', 2: 'ไม่อนุมัติ', 3: 'ผุ้ทำรายการยกเลิก', 4: 'รอการยืนยันใหม่' })}</p>
                        <p>วันที่ทำรายการ : {CustomFormatDate(data.createDate, 'DD/MM/YYYY HH:mm')}</p>
                        <p>ผู้ทำรายการ : {data.createBy}</p>
                        {data.confirmBy && <p>ผู้ยืนยัน : {data.reConfirmBy ?? data.confirmBy}</p>}
                        <p>จำนวนเงิน : {data.amount}</p>

                    </div>
                    <Textarea
                        onChange={e => setTextAreaInput(e.target.value)}
                        isInvalid={textAreaError.state}
                        errorMessage={textAreaError.message}
                        onFocus={() => setTextAreaError({ state: false, message: '' })}
                        placeholder={data.remark ?? ''} isDisabled={!changeStatus}
                        size="sm"
                        label='หมายเหตุ'
                        labelPlacement="inside"
                        variant="bordered"
                        aria-label="textarea-remark" />
                    {changeStatus &&
                        <Button
                            onPress={handleSubmit}
                            endContent={<InfomationIcon size={20} className={`${status === 4 ? 'text-primary' : 'text-red-500'}`} />}
                            color={status === 4 ? 'warning' : 'danger'}
                            className={`${status === 4 ? 'text-primary' : 'text-red-500'} font-semibold text-sm`}
                            variant="flat"
                            isLoading={loadingChangeStatus}
                            fullWidth size="sm">{status === 4 ? 'เปลี่ยนสถานะเป็นรอการยืนยันใหม่' : 'เปลี่ยนสถานะ ไม่อนุมัติรายการ'}</Button>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalRemark;