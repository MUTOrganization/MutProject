import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { ConfirmCancelButtons } from "./Buttons";
import { Button, Chip, DatePicker, Image, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { AddFileIcon } from "./Icons";
import fetchProtectedData from "../../utils/fetchData";
import { URLS } from "../config";
import { toastError, toastSuccess } from "./Alert";
import moment from "moment";
import { parseDate } from "@internationalized/date";
import { useAppContext } from "../contexts/AppContext";



function TopupModal({ open, onClose, size = 'md' }) {
    // context
    const { currentUser } = useAppContext()

    // state Input
    const [inputBalance, setInputBalance] = useState(0.00)
    const [fileList, setFileList] = useState([]);
    const [dateInput, setDateInput] = useState(parseDate(moment().format('YYYY-MM-DD')))

    // state loading
    const [isLoadingTopup, setLoadingTopup] = useState(false);
    const [loadingSetting, setLoadingSetting] = useState(false)

    //state data
    const [settingImageTopUp, setSettingImageTopUp] = useState('');

    // state Validate Error
    const [validateNumber, setValidateInputNumber] = useState({ state: false, message: '' })
    const [validateFile, setValidateFile] = useState({ state: false, message: '' })

    //useRef
    let fileInputRef = useRef(null);

    //#region all function fetch API
    async function fetchTopup() {
        setLoadingTopup(true);
        try {
            var newForm = new FormData();
            newForm.append('amount', inputBalance);
            newForm.append('currentUser', currentUser.userName)
            newForm.append('businessId', currentUser.businessId)
            newForm.append('orderDate', dateInput)
            newForm.append('image', fileList[0])
            await fetchProtectedData.post(URLS.wallet.topUp, newForm, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    toastSuccess('ดำเนินรายการเสร็จสมบูรณ์', 'โปรดรอแอดมินตรวจสอบ');
                    setLoadingTopup(false);
                })

        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถทำรายการนี้ได้โปรดลองใหม่อีกครั้ง')
        } finally {
            setLoadingTopup(false);
        }
    }

    async function fetchGetSettingImageTopUp() {
        setLoadingSetting(true);
        await fetchProtectedData.get(URLS.wallet.getSettingImageTopUp, { params: { businessId: currentUser.businessId } })
            .then(res => {
                setSettingImageTopUp(res.data.imgSetting)
                setLoadingSetting(false)
            }).catch(err => {
                setSettingImageTopUp('')
            })
            .finally(() => {
                setLoadingSetting(false)
            })
    }

    //#endregion

    //#region validateInput
    function validateInputNumber(value) {
        if (!value || !Number(value) || !parseFloat(value).toFixed(2) || value <= 0.00) {
            setValidateInputNumber({ state: true, message: '**กรุณากรอกจำนวนเงินให้ถูกต้อง' })
            return false;
        }

        if (fileList.length <= 0) {
            setValidateFile({ state: true, message: 'กรุณาแนบไฟล์' })
            return false;
        }
        return true;
    }
    //#endregion

    //#region clear Function
    function clear() {
        setInputBalance('')
        setValidateInputNumber({ state: false, message: '' })
    }

    function clearFile() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileList([])
    }
    //#endregion

    //#region openFile Dialog
    function openFileDialog() {
        fileInputRef.current.click();
    }

    function handleFileChange(value) {
        setValidateFile({ state: false, message: '' });
        const files = Array.from(value.target.files);
        setFileList(files)
    }
    //#endregion

    //#region function Confirm and Close
    async function handleConfirm() {
        if (validateInputNumber(inputBalance)) {
            await fetchTopup();
            clear();
            clearFile();
            setValidateFile({ state: false, message: '' });
            onClose(false)
            return;
        }
    }

    function handleClose() {
        clear();
        onClose(false);
    }
    //#endregion


    useEffect(() => {
        fetchGetSettingImageTopUp();
    }, [])



    return (
        <>
            <Modal isOpen={open} onClose={() => onClose(false)} backdrop="blur" size={size}>
                <ModalContent className="max-h-[750px]">
                    <ModalHeader className="flex justify-center items-center text-xl bg-blue-100 text-primary">
                        <p>เติมเงิน</p>
                    </ModalHeader>
                    <ModalBody className="overflow-auto scrollbar-hide">
                        <div className="w-full h-full">
                            {settingImageTopUp ?
                                <Image src={URLS.googleCloud.settingImageTopUp + settingImageTopUp} isLoading={loadingSetting} alt="บัญชีบริษัท" />
                                :
                                <Chip size="sm" color="primary" variant="flat" className=" my-5">โปรดติดต่อ admin ให้ เพิ่มบัญชีบริษัท</Chip>
                            }
                        </div>

                        <div className="w-full h-full max-h-full">
                            <Input
                                label='จำนวนเงิน'
                                placeholder="0.00"
                                onChange={e => setInputBalance(e.target.value)}
                                value={inputBalance}
                                isInvalid={validateNumber.state}
                                errorMessage={validateNumber.message}
                                labelPlacement="inside"
                                onFocus={clear}
                                variant="bordered"
                                size="sm" />

                            <div className="flex w-full space-x-4 my-4">
                                <DatePicker
                                    label="วันที่ทำรายการ"
                                    size="sm"
                                    variant="bordered"
                                    showMonthAndYearPickers
                                    color="default"
                                    value={dateInput}
                                    onChange={setDateInput}
                                />

                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                {validateFile.state ? <p className="text-danger font-semibold text-xs">**กรุณาแนบไฟล์</p> : <div></div>}
                                <Button variant="light" size="sm" color="danger" onPress={clearFile}>ล้างไฟล์</Button>
                            </div>
                            <div className="w-full h-fit justify-center items-center flex border border-inherit p-2 rounded border-black overflow-auto scrollbar-hide">
                                {fileList?.length > 0 ? (
                                    <>
                                        {fileList.map((file, index) => {
                                            const urlImage = URL.createObjectURL(file);
                                            return (
                                                <Image
                                                    key={index}
                                                    src={urlImage}
                                                    alt="Slip Image"
                                                    radius="sm"
                                                    className="object-cover rounded border-3"
                                                />
                                            );
                                        })}
                                    </>
                                ) : (
                                    <Button
                                        size="md"
                                        variant="light"
                                        onPress={openFileDialog}
                                        color="primary"
                                        type="button"
                                        startContent={<AddFileIcon />}>
                                        แนบไฟล์
                                    </Button>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                        </div>


                    </ModalBody>

                    <ModalFooter>
                        <ConfirmCancelButtons onConfirm={handleConfirm} isLoading={isLoadingTopup} isDisabledCancel={isLoadingTopup} onCancel={handleClose} size="sm" />
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}


export default TopupModal;