import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../component/Buttons";
import { cFormatter } from "../../../../utils/numberFormatter";
import { Radio, RadioGroup, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useState } from "react";
import fetchProtectedData from "../../../../utils/fetchData";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import { toastError, toastSuccess, toastWarning } from "../../../component/Alert";
import moment from "moment";


function ConfirmPenalty({ open, close, isRefresh, data, isNotPenalty, selectedUserPenalty, isSelectedTwo }) {
    //state Context
    const { currentUser } = useAppContext();

    //state Input
    const [fineType, setFineType] = useState(0);
    const [textRemark, setTextRemark] = useState(!isNotPenalty ? 'มีค่าปรับ' : '');
    const [selectedMonth, setSelectedMonth] = useState();

    //state Loading
    const [loadingFetchData, setLoadingFetchData] = useState(false);

    //state Error  Handler
    const [textRemarkError, setTextRemarkError] = useState({ state: false, message: '' })
    const [selectedMonthError, setSelectedMonthError] = useState({ state: false, message: '' })

    const monthTH = [
        { id: 1, value: "มกราคม" },
        { id: 2, value: "กุมภาพันธ์" },
        { id: 3, value: "มีนาคม" },
        { id: 4, value: "เมษายน" },
        { id: 5, value: "พฤษภาคม" },
        { id: 6, value: "มิถุนายน" },
        { id: 7, value: "กรกฎาคม" },
        { id: 8, value: "สิงหาคม" },
        { id: 9, value: "กันยายน" },
        { id: 10, value: "ตุลาคม" },
        { id: 11, value: "พฤศจิกายน" },
        { id: 12, value: "ธันวาคม" },
    ];

    async function fetchFineOrder() {
        setLoadingFetchData(true);
        const finedUser = isSelectedTwo ? [data.createBy, data.upsaleUser].filter(user => user !== null) : [selectedUserPenalty || data.createBy];
        const payLoad = {
            businessId: currentUser.businessId,
            orderId: data.id,
            createBy: currentUser.userName,
            finedUser: finedUser,
            amount: isNotPenalty ? 0 : data.fine,
            remark: textRemark,
            monthCommission: selectedMonth,
            yearCommission: moment().year(),
            fineType
        }

        await fetchProtectedData.post(URLS.PENALTYDEDUCTION, {
            data: payLoad,
            status: 1
        }).then(() => {
            toastSuccess('ดำเดินการสำเร็จ', 'ระบบได้ดำเนินการหักค่าปรับเรียบร้อยแล้ว')
        }).catch(() => {
            toastError('ดำเนินการไม่สำเร็จ', 'เกิดข้อมูลผิดพลาดกับการดำเนินการ')
        }).finally(() => {
            setLoadingFetchData(false);
        })
    }

    function clearForm() {
        setFineType(0);
        setTextRemark('');
        setTextRemarkError({ state: false, message: '' });
    }

    async function handleSubmit() {
        if (isNotPenalty) {
            if (!textRemark || textRemark.trim() === '' || textRemark.length > 10000) {
                setTextRemarkError({ state: true, message: '**กรุณากรอกรายละเอียดเพิ่มเติมก่อนกดยืนยัน' });
                toastWarning('กรุณากรอกรายละเอียดเพิ่มเติมก่อนกดยืนยัน');
                return;
            }
        }

        if (fineType === 1) {
            if (!selectedMonth || selectedMonth < moment().month() + 1) {
                toastWarning('กรุณาเลือกเดือนที่จะหักจาก Commission')
                setSelectedMonthError({ state: true, message: 'กรุณาเลือกเดือนที่จะหักค่าคอมมิชชั่น' })
                return;
            }
        }

        await fetchFineOrder();
        isRefresh(true);
        setSelectedMonthError({ state: false, message: '' })
        setSelectedMonth(null);
        clearForm();
        close(false);
    }

    async function handleClose() {
        setSelectedMonth(null);
        setSelectedMonthError({ state: false, message: '' })
        close(false);
        clearForm();
    }


    return (
        <Modal isOpen={open} onClose={() => close(false)} backdrop="opaque" size="sm">
            <ModalContent>
                <ModalHeader className="flex justify-center bg-blue-100 text-primary text-lg font-semibold">
                    <p>{isNotPenalty ? 'ยืนยันที่จะไม่หักค่าปรับ' : 'ยืนยันการหักค่าปรับ'}</p>
                </ModalHeader>
                <ModalBody className="font-semibold">
                    {!isNotPenalty ?
                        <>
                            <p>รายละเอียด</p>
                            <p>ผู้ถูกปรับ : {isSelectedTwo ? data.createBy + (data.upsaleUser ? ',' + data.upsaleUser : '') : selectedUserPenalty || data.createBy}</p>
                            <p>จำนวน : ฿{cFormatter(isSelectedTwo ? data.fine / 2 : data.fine, 2)}</p>
                            <RadioGroup value={fineType} onValueChange={setFineType}>
                                <Radio value={0}>หักจาก  ยอดเงินในบัญชี</Radio>
                                {moment(data.orderDate).month() >= moment().month() && <Radio value={1}>หักจาก  Commission</Radio>}
                            </RadioGroup>
                            {fineType === 1 &&
                                <Select
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    value={selectedMonth}
                                    size="sm"
                                    variant="bordered"
                                    className="max-w-xs"
                                    label='เลือกเดือนที่จะหัก Commission'
                                    isInvalid={selectedMonthError.state}
                                    errorMessage={selectedMonthError.message}
                                    onFocus={() => setSelectedMonthError({ state: false, message: '' })}
                                    labelPlacement="inside">
                                    {monthTH.slice(moment().month()).map((item) => {
                                        return (
                                            <SelectItem key={item.id}>{item.value}</SelectItem>
                                        )
                                    })}
                                </Select>
                            }
                        </>
                        :
                        <>
                            <p>รายละเอียด</p>
                            <p>ผู้ถูกปรับ : {isSelectedTwo ? data.createBy + (data.upsaleUser ? ',' + data.upsaleUser : '') : selectedUserPenalty || data.createBy}</p>
                            <p>จำนวน : ฿{isNotPenalty ? 0 : cFormatter(data.fine, 2)}</p>
                            <Textarea label='รายละเอียดเพิ่มเติม'
                                labelPlacement="outside"
                                variant="bordered"
                                size="sm"
                                isInvalid={textRemarkError.state}
                                errorMessage={textRemarkError.message}
                                onFocus={() => setTextRemarkError({ state: false, message: '' })}
                                onChange={e => setTextRemark(e.target.value)} value={textRemark} />
                        </>
                    }
                    <p className="text-danger">** หมายเหตุ หากกดแล้วจะไม่สามารถยกเลิกได้</p>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons onCancel={handleClose} onConfirm={handleSubmit} confirmText={isNotPenalty ? 'ไม่หักค่าปรับ' : 'หักค่าปรับ'} isLoading={loadingFetchData} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmPenalty;