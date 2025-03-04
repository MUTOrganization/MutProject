import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../component/Buttons";
import { cFormatter } from "../../../../utils/numberFormatter";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { toastError, toastSuccess } from "../../../component/Alert";
import { useEffect, useState } from "react";


function RefundModal({ open, close, data, isFetchData }) {

    const [listFinedOrder, setFinedOrder] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const amount = () => {
        return listFinedOrder.filter(x => x.orderId === data.id).map(x => x.amount);
    }

    const finedUser = () => {
        return listFinedOrder.filter(x => x.orderId === data.id).map(x => x.finedUser);
    }


    async function fetchRefund() {
        setIsLoading(true);
        await fetchProtectedData.post(URLS.order.refundReturnOrder, {
            orderId: data.id,
            balance: amount()[0],
            username: finedUser(),
        }).then(() => {
            toastSuccess('ดำเนินการสำเร็จ', 'ระบบได้คืนเงินค่าปรับเรียบร้อยแล้ว');
        }).catch(err => {
            toastError('ดำเนินการไม่สำเร็จ', 'เกิดข้อมูลผิดพลาด โปรดลองใหม่อีกครั้ง');
        }).finally(() => {
            setIsLoading(false);
        })
    }

    async function fetchGetFinedOrder() {
        await fetchProtectedData.get(URLS.order.getFinedOrder, { params: { orderId: data.id } })
            .then(res => {
                setFinedOrder(res.data)
            }).catch(err => {
                toastError('เกิดข้อผิดพลาด', 'การข้อผิดพลาดระหว่างดึงข้อมูลจากเซิฟเวอร์')
            })
    }

    const handleSubmit = async () => {
        await fetchRefund();
        isFetchData(true);
        close(false);
    }

    const handleClose = () => {
        close(false);
    }

    useEffect(() => {
        fetchGetFinedOrder();
    }, [])

    return (
        <Modal isOpen={open} onClose={() => close(false)} backdrop="opaque" size="sm">
            <ModalContent>
                <ModalHeader className="flex justify-center bg-blue-100 text-primary text-lg font-semibold">
                    <p>คืนเงินค่าปรับ</p>
                </ModalHeader>
                <ModalBody className="font-semibold">
                    <p>รายละเอียด</p>
                    <p>ผู้ถูกปรับ : {finedUser().length > 1 ? finedUser()[0] + ' , ' + finedUser()[1] : finedUser()[0]}</p>
                    <p>จำนวน : ฿{cFormatter(amount()[0])}</p>
                    <p className="text-danger">** หมายเหตุ ระบบจะทำการคืนเงินให้กับ เงินในระบบ หากกดแล้วจะไม่สามารถยกเลิกได้</p>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons isLoading={isLoading} onConfirm={handleSubmit} onCancel={handleClose} confirmText="คืนเงิน" />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default RefundModal;