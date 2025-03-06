import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import { Input } from "@nextui-org/react";
import { useState } from "react";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import { forEach } from "lodash";

function SettingPenaltyModal({ open, close, data, isSettingAll, isFetchData }) {

    const { currentUser } = useAppContext();

    const [inputPenalty, setInputPenalty] = useState();

    //state ErrorHandler
    const [errorInputPenalty, setErrorInputPenalty] = useState({ state: false, message: '' })

    //state loading
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    async function fetchSettingPenalty() {
        setLoadingSubmit(true);
        let settingPayload = [];
        if (isSettingAll) {
            forEach(data, item => {
                settingPayload.push(item.id)
            })
        }
        else {
            settingPayload.push(data.id)
        }
        await fetchProtectedData.post(URLS.settingPenalty.settingPenalty, {
            businessId: settingPayload,
            fineSetting: inputPenalty,
            createBy: currentUser.userName,
            updateBy: currentUser.userName
        })
            .then(() => {
                toastSuccess('ดำเนินการสำเร็จ', 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว')
                setLoadingSubmit(false);
            })
            .catch(err => {
                toastError('เกิดข้อผิดพลาด', 'ไม่สามารถดำเนินการได้โปรดลองใหม่อีกครั้ง')
            }).finally(() => {
                setLoadingSubmit(false);
            })
    }


    const handleSubmit = async () => {
        if (!inputPenalty) {
            setErrorInputPenalty({ state: true, message: '** กรุณากรอกค่าปรับ' })
            return
        }

        if (!parseFloat(inputPenalty).toFixed(2)) {
            setErrorInputPenalty({ state: true, message: '** กรุณากรอกเฉพาะตัวเลขเท่านั้น' })
            return
        }

        if (inputPenalty < 0) {
            setErrorInputPenalty({ state: true, message: '** กรุณากรอกค่าปรับมากกว่า จำนวนติดลบ' })
            return
        }

        await fetchSettingPenalty();
        isFetchData(true);
        setErrorInputPenalty({ state: false, message: '' })
        setInputPenalty('')
        close(false);
    }

    const handleClose = () => {
        setErrorInputPenalty({ state: false, message: '' })
        setInputPenalty('')
        isFetchData(false);
        close(false)
    }

    return (
        <Modal isOpen={open} onClose={() => close(false)} backdrop="opaque" size="sm">
            <ModalContent>
                <ModalHeader className="flex bg-blue-100 text-primary text-lg font-bold justify-center items-center">
                    <p>{isSettingAll ? 'แก้ไขค่าปรับสำหรับทุกตัวแทน' : 'แก้ไขค่าปรับ'}</p>
                </ModalHeader>
                <ModalBody>
                    <div className="w-full space-y-2">
                        {!isSettingAll ? (
                            <>
                                <div className="flex space-x-2">
                                    <p>ตัวแทน : </p>
                                    <p className="font-semibold">{data.name}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <p>รหัส : </p>
                                    <p className="font-semibold">{data.code}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <p>ค่าปรับเดิม : </p>
                                    <p className="font-semibold">{data.fineSetting || 'ยังไม่มีการตั้งค่า'}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex space-x-2">
                                    <p>ตั้งค่าให้กับตัวแทนทั้งหมด: </p>
                                    <p className="font-semibold">{data.length} ตัวแทน</p>
                                </div>
                            </>
                        )}
                        <div className="flex space-x-2">
                            <Input
                                label={`กรอกค่าปรับใหม่`}
                                size="md"
                                variant="bordered"
                                className="max-w-xs font-bold"
                                labelPlacement="inside"
                                placeholder={data.fineSetting || 'ยังไม่มีการตั้งค่า'}
                                isInvalid={errorInputPenalty.state}
                                errorMessage={errorInputPenalty.message}
                                onFocus={() => setErrorInputPenalty({ state: false, message: '' })}
                                onChange={e => setInputPenalty(e.target.value)}
                                value={inputPenalty}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons confirmText="แก้ไข" isLoading={loadingSubmit} onConfirm={handleSubmit} onCancel={handleClose} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SettingPenaltyModal;