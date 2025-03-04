import { useEffect, useState } from "react";
import CardRankAdd from "../components/CardRankAdd";
import CardRankInfo from "../components/CardRankInfo";
import { AddMedal } from "../components/ModalCRUDMedal";
import { Button, Chip } from "@nextui-org/react";
import { Medal3ColorIcon } from "../../../../../component/Icons";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import moment from "moment";
import { toastError } from "../../../../../component/Alert";
import { Select, SelectItem } from "@nextui-org/react";


function SettingMedal() {
    const { currentUser } = useAppContext();

    const [openModalAddMedal, setOpenModalAddMedal] = useState(false); //modal Add Medal

    //State Loading
    const [loadingMedalAward, setLoadingAward] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);

    //State list data from api
    const [listMedal, setListMedal] = useState([]);
    const [listAward, setListAward] = useState([]);
    const [listYear, setListYear] = useState([]);
    const [listDepartment, setListDepartment] = useState([]);

    // เพิ่ม state สำหรับเก็บปีที่เลือก
    const [selectedYear, setSelectedYear] = useState(moment().year());

    //State selected department
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchDepartment = async () => {
        setLoadingDepartment(true)
        try {
            const [dep, year] = await Promise.all([
                await fetchProtectedData.get(URLS.departments.getall, {
                    params: {
                        businessId: currentUser.businessId,
                    }
                }),
                await fetchProtectedData.get(URLS.award.getAllYears),
            ])
            setListDepartment(dep.data);
            setListYear(year.data);
            // ตั้งค่าเริ่มต้นให้เป็นแผนกแรก
            setSelectedDepartment(dep.data.filter(item => item.isHq === 1)[0]?.id);
        } catch (err) {
            toastError('เกิดข้อผิดพลาด', 'ระบบไม่สามารถโหลดข้อมูลได้ โปรดรีเฟรชหน้าเว็บใหม่อีกครั้ง')
        } finally {
            setLoadingDepartment(false)
        }
    }

    const fetchMedalAward = async () => {
        setLoadingAward(true)
        try {
            const [medal, award] = await Promise.all([
                await fetchProtectedData.get(URLS.award.getMedals),
                await fetchProtectedData.get(URLS.award.getAwards, {
                    params: {
                        depId: selectedDepartment || listDepartment[0]?.id,
                        year: selectedYear || moment().year()
                    }
                }),
            ])
            setListMedal(medal.data);
            setListAward(award.data);
        } catch {
            toastError('เกิดข้อผิดพลาด', 'ระบบไม่สามารถโหลดข้อมูลได้ โปรดรีเฟรชหน้าเว็บใหม่อีกครั้ง')
        } finally {
            setLoadingAward(false)
        }
    }

    useEffect(() => {
        fetchDepartment();
    }, [])

    useEffect(() => {
        if (selectedYear && selectedDepartment) {
            fetchMedalAward();
        }
    }, [selectedYear, selectedDepartment])

    const handleChangeYear = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleChangeDepartment = (e) => {
        setSelectedDepartment(e.target.value);
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                    {/* ปุ่มเลือกปี */}
                    <Select
                        items={listYear}
                        variant="bordered"
                        size="sm"
                        color="default"
                        label="ของรางวัลในปี"
                        labelPlacement="inside"
                        className="w-52"
                        aria-label="ปี"
                        onChange={handleChangeYear}
                        disallowEmptySelection
                        value={selectedYear}
                        defaultSelectedKeys={[moment().year().toString()]}
                        selectionMode="single"
                    >
                        {item => (
                            <SelectItem key={item.year.toString()} value={item.year}>
                                {item.year.toString()}
                            </SelectItem>
                        )}
                    </Select>

                    <Select
                        variant="bordered"
                        size="sm"
                        label="แผนก"
                        labelPlacement="inside"
                        className="w-52"
                        aria-label="แผนก"
                        selectionMode="single"
                        disallowEmptySelection
                        value={selectedDepartment}
                        defaultSelectedKeys={[listDepartment[0]?.id.toString()]}
                        selectedKeys={[selectedDepartment?.toString()]}
                        onChange={handleChangeDepartment}
                        isLoading={loadingDepartment}
                    >
                        {listDepartment.filter(item => item.isHq === 1).map(item => (
                            <SelectItem key={item.id.toString()} value={item.id} endContent={item.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>
                                {item.departmentName}
                            </SelectItem>
                        ))}
                    </Select>
                </div>


                <div className="flex space-x-3">
                    <Button
                        endContent={<Medal3ColorIcon />}
                        color="success"
                        variant="flat"
                        onPress={() => setOpenModalAddMedal(true)}
                    >
                        เพิ่มเหรียญ
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-4 max-lg:grid-cols-2 gap-4 max-w-full  max-h-[800px] overflow-auto scrollbar-hide p-2">
                <AddMedal open={openModalAddMedal} closed={e => setOpenModalAddMedal(e)} medalData={listMedal} isRefresh={e => e && fetchMedalAward()} />
                {listMedal.length > 0 ? (
                    listMedal.sort((a, b) => a.tier - b.tier).map(item => {
                        return (
                            <div className="flex space-x-3" key={item.id}>
                                <CardRankInfo selectedYear={selectedYear} medalData={item} listMedalData={listMedal} awardData={listAward} hasRefresh={fetchMedalAward} selectedDep={selectedDepartment} listDepData={listDepartment} />
                                {/* <div className="mt-10 space-y-5">

                                    <Button isIconOnly startContent={<EditIcon />} onPress={() => handleOpenModalEdit(findMedal, item)} className="text-lg" variant="flat" color="warning" size="sm" />
                                    <Button isIconOnly startContent={<DeleteIcon />} className="text-lg" variant="flat" color="danger" size="sm" onPress={() => setOpenModalDeleteAward({ state: true, data: item })} />
                                </div> */}
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center justify-end  items-center flex text-gray-500 text-lg">
                        กรุณาเลือกแผนก
                    </div>
                )}
                {selectedDepartment &&
                    <CardRankAdd onPress={() => setOpenModalAddMedal(true)} />
                }
            </div>
        </div>
    )
}

export default SettingMedal;