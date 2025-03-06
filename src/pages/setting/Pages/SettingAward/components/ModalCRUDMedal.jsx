import { Input } from "@nextui-org/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal"
import { Button, Card, image, Image, Select, SelectItem } from "@nextui-org/react"
import { useRef, useState, useEffect } from "react"
import { AddStreamlineUltimateWhiteIcon } from "../../../../../component/Icons";
import { ConfirmCancelButtons } from "../../../../../component/Buttons";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import { useAppContext } from "../../../../../contexts/AppContext";

//#region ADD MEDAL
export function AddMedal({ open, closed, medalData = [], isRefresh = false }) {
    const { currentUser } = useAppContext();

    const [imageURL, setImageURL] = useState('');
    const [inputImage, setInputImage] = useState(); //รูปเหรียญรางวัล
    const [inputName, setInputName] = useState(''); // ชื่อเหรียญรางวัล
    const [inputType, setInputType] = useState(''); // ประเภทเหรียญ

    //Error validate
    const [nameError, setNameError] = useState({ state: false, message: '' });

    //Loading fetch
    const [saveLoading, setSaveLoading] = useState(false)

    let refInputFile = useRef(null);


    //Func เปลี่ยนไฟล์รูป
    const handleFileChange = (value) => {
        const file = value.target.files[0];
        setImageURL(URL.createObjectURL(file));
        setInputImage(file)
        refInputFile.current.value = '';
    }
    //Func ล้างไฟล์รูป
    const clearFileInput = () => {
        setInputImage(null);
        setImageURL('');
        refInputFile.current.value = '';
    }


    //เช็คชื่อเหรียญรางวัล
    const formCheck = () => {
        if (inputName.trim() === '') {
            setNameError({ state: true, message: "**กรุณากรอกชื่อก่อนบันทึก" });
            return false;
        }
        return true;
    }

    //Fetch Save medal
    const fetchAddMedal = async () => {
        setSaveLoading(true);
        var payload = new FormData();
        payload.append('image', inputImage);
        payload.append('name', inputName);
        payload.append('type', inputType);
        payload.append('createBy', currentUser.userName);
        payload.append('tier', medalData[medalData.length - 1].tier + 1);

        // const body = {
        //     image: inputImage,
        //     name: inputName,
        //     businessId: currentUser.businessId,
        //     createBy: currentUser.userName
        // }

        await fetchProtectedData.post(URLS.award.addMedal, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(results => {
            toastSuccess('บันทึกข้อมูลสำเร็จ')
        }).catch(err => {
            toastError('เกิดข้อผิดพลาด', 'ดำเนินการไม่สำเร็จโปรดลองใหม่อีกครั้ง');
        }).finally(() => {
            setSaveLoading(false);
        })
    }

    //Func บันทึกข้อมูล
    const subbmit = async () => {
        if (!formCheck()) {
            return
        }
        await fetchAddMedal();
        isRefresh(true);
        handleClose();
    }

    const handleClose = () => {
        setInputName('');
        setNameError({ state: false, message: '' })
        setInputImage(null);
        setImageURL('');
        refInputFile.current.value = '';
        closed(false);
    }


    return (
        <>
            <Modal isOpen={open} onClose={() => closed(false)} backdrop="opaque">
                <ModalContent>
                    <ModalHeader className="text-lg bg-blue-100 text-primary font-bold flex items-center justify-center">
                        <p>เพิ่มเหรียญรางวัล</p>
                    </ModalHeader>
                    <ModalBody className="space-y-4 my-5">
                        <div className="flex justify-start items-center text-nowrap space-x-5 max-w-xs">
                            <p className="w-40">ชื่อเหรียญ</p>
                            <Input placeholder="กรอกชื่อเหรียญรางวัล"
                                isInvalid={nameError.state}
                                errorMessage={nameError.message}
                                variant="bordered"
                                onFocus={() => setNameError({ state: false, message: '' })}
                                onChange={e => setInputName(e.target.value)}
                                value={inputName} />
                        </div>

                        {/* <div className="flex justify-start items-center text-nowrap space-x-5 max-w-xs">
                            <p>ลำดับเหรียญ</p>
                            <Select
                                items={medalData}
                                variant="bordered"
                                size="sm"
                                placeholder="จัดลำดับเหรียญ"
                            >
                                {item =>{
                                    return (
                                        <SelectItem value={item.tier}>{item.name + ' ลำดับ ' + item.tier}</SelectItem>
                                    )
                                }}

                            </Select>
                        </div> */}

                        <div className="flex justify-start items-center text-nowrap space-x-5 max-w-xs">
                            <p className="w-40">ประเภทเหรียญ</p>
                            <Select
                                variant="bordered"
                                size="md"
                                placeholder="ประเภทเหรียญ"
                                labelPlacement="outside-left"
                                aria-label="ประเภทเหรียญ"
                                value={inputType}
                                onChange={e => setInputType(e.target.value)}
                                selectedKeys={[inputType]}
                            >
                                <SelectItem key="common" value="common">ทั่วไป</SelectItem>
                                <SelectItem key="hero" value="hero">HERO</SelectItem>
                                <SelectItem key="rookie" value="rookie">ROOKIE</SelectItem>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p>รูปเหรียญ</p>
                                <Button variant="flat" color="warning" size="sm" onPress={clearFileInput}>ล้างไฟล์รูป</Button>
                            </div>
                            {imageURL ?
                                <div className="flex items-center justify-center">
                                    <Image src={imageURL} className="object-fill cursor-pointer" height={300} onClick={() => refInputFile.current.click()} />
                                </div>
                                :
                                <Card className="flex justify-center items-center w-full h-[200px] bg-gray-400/10" isPressable onPress={() => refInputFile.current.click()}>
                                    <AddStreamlineUltimateWhiteIcon size={30} />
                                </Card>
                            }

                            <input type="file" ref={refInputFile} accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <ConfirmCancelButtons confirmText="บันทึก" onConfirm={subbmit} onCancel={handleClose} isDisabledCancel={saveLoading} isLoading={saveLoading} />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
//#endregion

//#region EDIT MEDAL
export function EditMedal({ open, closed, medal, isRefresh = false }) {
    const { currentUser } = useAppContext();

    const [imageURL, setImageURL] = useState('');
    const [inputImage, setInputImage] = useState(); //รูปเหรียญรางวัล
    const [inputName, setInputName] = useState(''); // ชื่อเหรียญรางวัล
    const [inputType, setInputType] = useState(''); // ประเภทเหรียญ

    //Error validate
    const [nameError, setNameError] = useState({ state: false, message: '' });

    //Loading fetch
    const [saveLoading, setSaveLoading] = useState(false);

    let refInputFile = useRef(null);

    // โหลดข้อมูลเดิมเมื่อเปิด Modal
    useEffect(() => {
        if (open && medal) {
            setInputName(medal.name || '');
            setImageURL(medal.imageURL || '');
            setInputType(medal.type?.toString() || '1');
        }
    }, [open, medal]);

    //Func เปลี่ยนไฟล์รูป
    const handleFileChange = (value) => {
        const file = value.target.files[0];
        setImageURL(URL.createObjectURL(file));
        setInputImage(file);
        refInputFile.current.value = '';
    }

    //Func ล้างไฟล์รูป
    const clearFileInput = () => {
        setInputImage(null);
        setImageURL('');
        refInputFile.current.value = '';
    }

    //เช็คชื่อเหรียญรางวัล
    const formCheck = () => {
        if (inputName.trim() === '') {
            setNameError({ state: true, message: "**กรุณากรอกชื่อก่อนบันทึก" });
            return false;
        }
        return true;
    }

    //Fetch Update medal
    const fetchUpdateMedal = async () => {
        setSaveLoading(true);
        try {
            const formData = new FormData();
            if (inputImage) {
                formData.append('image', inputImage);
            }
            formData.append('id', medal.id);
            formData.append('name', inputName);
            formData.append('type', inputType);
            formData.append('updateBy', currentUser.userName);

            const response = await fetchProtectedData.put(URLS.award.updateMedal + '/' + medal.id, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toastSuccess('แก้ไขข้อมูลสำเร็จ');
                isRefresh(true);
                handleClose();
            }
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้ โปรดลองใหม่อีกครั้ง');
        } finally {
            setSaveLoading(false);
        }
    }

    //Func บันทึกข้อมูล
    const handleSubmit = async () => {
        if (!formCheck()) {
            return;
        }
        await fetchUpdateMedal();
    }

    const handleClose = () => {
        setInputName('');
        setNameError({ state: false, message: '' });
        setInputImage(null);
        setImageURL('');
        setInputType('1');
        refInputFile.current.value = '';
        closed(false);
    }

    return (
        <Modal isOpen={open} onClose={handleClose} backdrop="opaque">
            <ModalContent>
                <ModalHeader className="text-lg bg-warning-100 text-warning font-bold flex items-center justify-center">
                    <p>แก้ไขเหรียญรางวัล</p>
                </ModalHeader>
                <ModalBody className="space-y-4 my-5">
                    <div className="flex justify-start items-center text-nowrap space-x-5 max-w-xs">
                        <p className="w-40">ชื่อเหรียญ</p>
                        <Input
                            placeholder="กรอกชื่อเหรียญรางวัล"
                            isInvalid={nameError.state}
                            errorMessage={nameError.message}
                            variant="bordered"
                            onFocus={() => setNameError({ state: false, message: '' })}
                            onChange={e => setInputName(e.target.value)}
                            value={inputName}
                        />
                    </div>

                    <div className="flex justify-start items-center text-nowrap space-x-5 max-w-xs">
                        <p className="w-40">ประเภทเหรียญ</p>
                        <Select
                            variant="bordered"
                            size="md"
                            placeholder="ประเภทเหรียญ"
                            labelPlacement="outside-left"
                            aria-label="ประเภทเหรียญ"
                            value={inputType}
                            onChange={e => setInputType(e.target.value)}
                            selectedKeys={[inputType]}
                            defaultSelectedKeys={['common']}
                        >
                            <SelectItem key="common" value="common">ทั่วไป</SelectItem>
                            <SelectItem key="hero" value="hero">HERO</SelectItem>
                            <SelectItem key="rookie" value="rookie">ROOKIE</SelectItem>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p>รูปเหรียญ</p>
                            <Button
                                variant="flat"
                                color="warning"
                                size="sm"
                                onPress={clearFileInput}
                            >
                                ล้างไฟล์รูป
                            </Button>
                        </div>
                        {imageURL ? (
                            <div className="flex items-center justify-center">
                                <Image
                                    src={imageURL}
                                    className="object-fill cursor-pointer"
                                    height={300}
                                    onClick={() => refInputFile.current.click()}
                                />
                            </div>
                        ) : (
                            <Card
                                className="flex justify-center items-center w-full h-[200px] bg-gray-400/10"
                                isPressable
                                onPress={() => refInputFile.current.click()}
                            >
                                <AddStreamlineUltimateWhiteIcon size={30} />
                            </Card>
                        )}
                        <input
                            type="file"
                            ref={refInputFile}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons
                        confirmText="บันทึก"
                        onConfirm={handleSubmit}
                        onCancel={handleClose}
                        isDisabledCancel={saveLoading}
                        isLoading={saveLoading}
                        confirmColor="warning"
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
//#endregion

//#region DELETE MEDAL
export function DeleteMedal({ open, closed, medal, isRefresh }) {
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch Delete medal
    const fetchDeleteMedal = async () => {
        setDeleteLoading(true);
        try {
            const response = await fetchProtectedData.delete(URLS.award.deleteMedal + '/' + medal.id);
            if (response.status === 200) {
                toastSuccess('ลบข้อมูลสำเร็จ');
                hasRefresh();
            }
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้ โปรดลองใหม่อีกครั้ง');
        } finally {
            setDeleteLoading(false);
        }
    };

    const hasRefresh = () => {
        console.log('hasRefresh')
        isRefresh(true);
        handleClose();
    }

    const handleClose = () => {
        closed(false);
    };

    return (
        <Modal isOpen={open} onClose={handleClose} backdrop="opaque">
            <ModalContent>
                <ModalHeader className="text-lg bg-red-100 text-danger font-bold flex items-center justify-center">
                    <p>ลบเหรียญรางวัล</p>
                </ModalHeader>
                <ModalBody className="space-y-4 my-5">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-center">
                            <p className="text-lg font-semibold">{medal?.name}</p>
                            <p className="text-sm text-gray-500">คุณต้องการลบเหรียญรางวัลนี้ใช่หรือไม่?</p>
                            <p className="text-sm text-danger">การลบข้อมูลนี้จะไม่สามารถกู้คืนได้</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons
                        confirmText="ลบ"
                        color="danger"
                        onConfirm={fetchDeleteMedal}
                        onCancel={handleClose}
                        isDisabledCancel={deleteLoading}
                        isLoading={deleteLoading}
                        confirmColor="danger"
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
//#endregion

