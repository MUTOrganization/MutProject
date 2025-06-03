import { Accordion, AccordionItem, Card, CardBody, CardHeader, Chip, Listbox, ListboxItem, Spinner, Table, TableColumn, TableHeader } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { toastError } from "@/component/Alert";
import fetchProtectedData from "@/utils/fetchData";
import { useAppContext } from "@/contexts/AppContext";
import { HFCheck } from "@/component/Icons";
import { cFormatter } from "@/utils/numberFormatter";
import { sortArray } from "@/utils/arrayFunc";

export default function CommissionSettingsTable({departmentData, depLoading}){
    const {currentUser} = useAppContext()
    const [selectedDep, setSelectedDep] = useState(null);
    const [settingsData, setSettingsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchSettingsData() {
        try{
            setIsLoading(true);
            const response = await fetchProtectedData.get(URLS.setting.getCommissionSettingByBusiness, {
                params: {
                    businessId: currentUser.businessId
                }
            })
            setSettingsData(response.data);
        }catch(err){
            console.error('error fetching commission setting');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchSettingsData();
    },[])

    function handleSelectDep(id){
        const findDep = departmentData.find(e => e.id == id);
        if(findDep){
            setSelectedDep(findDep);
        }
    }

    const haveSettingRoles = useMemo(() => {
        return Array.from(new Set(settingsData.map(e => e.roleId))).map(e => String(e));
    },[settingsData])
    
    return(
        <section className="mt-4">
            <div className="flex space-x-4 max-h-[650px]">
                {/* deparment section */}
                <div className="">
                    {
                        depLoading ?
                        <div className="flex mt-4 justify-center"><Spinner aria-label="loading" /></div> :
                        <div>
                            <Card shadow="sm" className="w-56 max-h-[600px] overflow-auto scrollbar-hide">
                                <div className="text-center py-2 font-bold border-b mx-2">แผนก</div>
                                <Listbox
                                    aria-label="sdsd"
                                    className="overflow-auto scrollbar-hide"
                                    selectedKeys={selectedDep ? [String(selectedDep.id)] : []}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => handleSelectDep(Array.from(keys)[0])}
                                    disallowEmptySelection
                                >
                                {
                                    departmentData.map((dep, index) => {
                                        return(
                                            <ListboxItem key={dep.id} textValue={dep.name}
                                            >
                                                <div className="flex justify-center items-center py-2 relative">
                                                    <div className="text-center text-wrap font-semibold ">
                                                        <div>{dep.name}</div>
                                                    </div>
                                                    {
                                                        dep.isHq == '1' &&
                                                        <div className="ms-2">
                                                            <Chip className="text-[10px]" size="sm" color="warning" variant="flat">HQ</Chip>
                                                        </div>
                                                    }

                                                </div>
                                            </ListboxItem>
                                        )
                                    })

                                }
                                </Listbox>
                            </Card>
                        </div>
                    }
                </div>
                {/* end deparment section */}
                {/* table section */}
                <div className="flex-1 max-h-[600px]">
                    <Card shadow="sm" className="h-full p-4 overflow-auto scrollbar-hide">
                        {
                        !selectedDep ?
                        <div className="text-center mt-3 font-bold">
                            กรุณาเลือกแผนก
                        </div> 
                        :
                        isLoading ?
                        <div className="flex mt-4 justify-center"><Spinner /></div>
                        :
                        selectedDep.roles.length <= 0 ?
                        <div className="text-center mt-3 font-bold">
                            แผนกนี้ไม่มีตำแหน่ง
                        </div> 
                        :
                        <Accordion selectionMode="single">
                            {selectedDep?.roles.map(role => {
                                const settings = settingsData.filter(e => e.roleId == role.id);
                                return(
                                    <AccordionItem key={role.id}
                                        isDisabled={settings.length <= 0}
                                        textValue={role.name}
                                        title={
                                        <div className="w-full flex justify-between px-4 text-base">
                                            <div><span className="font-bold">{selectedDep.name} - {role.name}</span></div>
                                            {
                                                settings.length > 0 ?
                                                <div>
                                                    <Chip color="success" variant="flat"><HFCheck size={12} /></Chip>
                                                </div>
                                                :
                                                <div className="text-sm">ไม่มีการตั้งค่า</div>
                                            }
                                        </div>}
                                    >
                                        <div className="mx-6">
                                            {
                                            settings.length <= 0 ?
                                            <div></div> :
                                            <div>
                                                {sortArray(settings, 'prob_status', '-1').map((setting, prob_index) => {
                                                    let tierList = setting?.tier_list;
                                 
                                                    const settingValue = tierList?.percentage ?? tierList?.baht;
                                                    const isPercentage = !tierList?.baht;
                                                    return(
                                                        <div key={setting.prob_status} className={`py-4 ${prob_index === 0 && 'border-b' }`}>
                                                            <div className="mb-2 font-bold">{setting.prob_status == '1' ? 'ผ่านการทดลองงาน' : 'อยู่ในช่วงทดลองงาน'}</div>
                                                            <div className="space-y-2">
                                                                {settingValue.map((item, index) => {
                                                                    return(
                                                                        <div key={index} className="flex space-x-2">
                                                                            <div className="w-12">ขั้นที่ <span className="font-bold">{index + 1}</span></div>
                                                                            <div className="w-3/12">ตั้งแต่ <span className="font-bold">{cFormatter(item.minAmount)}</span></div>
                                                                            {
                                                                                index === settingValue.length - 1 ?
                                                                                <div className="w-3/12">ขึ้นไป</div> :
                                                                                <div className="w-3/12">ถึง <span className="font-bold">{cFormatter(item.maxAmount)}</span></div>
                                                                            }
                                                                            <div className="w-3/12">ได้ <span className="font-bold text-success">{cFormatter(isPercentage ? item.percentage : item.baht)}</span> {isPercentage ? '%' : 'บาท'}</div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            }
                                        </div>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                        }
                    </Card>
                </div>
                {/* end table section */}
            </div>
        </section>
    )
}