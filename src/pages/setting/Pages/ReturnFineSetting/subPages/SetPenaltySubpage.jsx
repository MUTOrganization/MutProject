import { Button, Input } from "@nextui-org/react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useEffect, useState } from "react";
import { cFormatter } from "../../../../../../utils/numberFormatter";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { toastError, toastSuccess } from "../../../../../component/Alert";
import { formatDateThaiAndTime } from "../../../../../component/DateUtiils";

function SetPenaltySubpage() {
    const appContext = useAppContext();

    //state input
    const [inputPenalty, setInputPenalty] = useState();

    //state fetchData
    const [listPenalty, setListPenalty] = useState([]);

    //state loading
    const [loadingPenalty, setLoadingPenalty] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    //state ErrorHandler
    const [errorInputPenalty, setErrorInputPenalty] = useState({ state: false, message: '' })

    async function fetchGetPenalty() {
        setLoadingPenalty(true);
        await fetchProtectedData.get(URLS.settingPenalty.getAll)
            .then(results => {
                setListPenalty(results.data);
                setLoadingPenalty(false);
            }).catch(err => {
                toastError('เกิดข้อผิดพลาด', 'โปลดลองใหม่อีกครั้ง')
            }).finally(() => {
                setLoadingPenalty(false);
            })
    }

    async function fetchSettingPenalty() {
        setLoadingSubmit(true);
        await fetchProtectedData.post(URLS.settingPenalty.settingPenalty, {
            businessId: [appContext.currentUser.businessId],
            fineSetting: inputPenalty,
            createBy: appContext.currentUser.userName,
            updateBy: appContext.currentUser.userName,
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

    useEffect(() => {
        fetchGetPenalty();
    }, [])

    const penaltyData = listPenalty.find(x => x.businessId === appContext.currentUser.businessId) || null;
    const penalty = listPenalty.filter(x => x.businessId === appContext.currentUser.businessId).map(value => {
        return value.fineSetting
    })

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
        fetchGetPenalty();
        setInputPenalty('');
        setErrorInputPenalty({ state: false, message: '' })
    }

    return (
        <div className="w-full">
            <h1 className="font-bold">ตั้งค่า ค่าปรับออเดอร์ตีกลับ</h1>
            <div className="flex space-x-4 my-5 items-center p-2">
                <Input
                    label='ค่าปรับ' labelPlacement="outside"
                    size="md" placeholder="กรอกค่าปรับที่ต้องการ" variant="bordered" color="default"
                    className="max-w-xs "
                    isInvalid={errorInputPenalty.state}
                    errorMessage={errorInputPenalty.message}
                    onFocus={() => setErrorInputPenalty({ state: false, message: '' })}
                    onChange={e => setInputPenalty(e.target.value)}
                    value={inputPenalty}
                />

                <Button onPress={handleSubmit} size="sm" variant="solid" color="primary" isLoading={loadingSubmit} className="mt-5">บันทึกข้อมูล</Button>
            </div>
            <div className="w-full flex space-x-4">
                <p>ค่าปรับปัจจุบัน</p>
                <p className="font-bold">{cFormatter(penalty ?? 0, 2)}฿</p>
                <p>อัพเดตล่าสุดเมื่อ</p>
                <p className="font-bold">{penaltyData && formatDateThaiAndTime(penaltyData.updateDate)}</p>
                <p>โดย</p>
                <p className="font-bold">{penaltyData && penaltyData.updateBy}</p>
            </div>
        </div>
    )
}

export default SetPenaltySubpage;