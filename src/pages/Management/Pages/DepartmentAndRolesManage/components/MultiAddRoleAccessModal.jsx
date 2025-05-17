import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { Button, Card, Checkbox, Select, SelectItem } from "@heroui/react";
import lodash from "lodash"
import { groupArray, sortArrayMultiField } from "@/utils/arrayFunc";
import { AlertQuestion, toastError, toastSuccess } from "@/component/Alert";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "@/config";
import { HFArrowRight } from "@/component/Icons";

export default function MultiAddRoleAccessModal({isOpen, onClose, accessList, roleList}){
    const {currentUser, selectedAgent} = useAppContext()
    const [accessListDisplay, setAccessListDisplay] = useState([]);
    const [selectedAccess, setSelectedAccess] = useState([]);

    const [roleListDisplay, setRoleListDisplay] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [selectedAccG, setSelectedAccG] = useState({id: 'all'});
    const [selectedDep, setSelectedDep] = useState({id: 'all'});

    const [existAccessRole, setExistAccessRole] = useState([]);
    const [notExistAccessRole, setNotExistAccessRole] = useState([]);

    const [loadingModal, setLoadingModal] = useState(false);

    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

    useEffect(() => {
        setAccessListDisplay(accessList);
    },[accessList])
    useEffect(() => {
        setRoleListDisplay(roleList);
    },[roleList])

    useEffect(() => {
        if(selectedAccG.id == 'all'){
            setAccessListDisplay(accessList);
        }else{
            const fileredAccess = accessList.filter(e => e.groupId == selectedAccG.id)
            setAccessListDisplay(fileredAccess);
        }
    },[selectedAccG])

    useEffect(() => {
        if(selectedDep.id == 'all'){
            setRoleListDisplay(roleList);
        }else{
            const fileredRole = roleList.filter(e => e.depId == selectedDep.id)
            setRoleListDisplay(fileredRole);
        }
    },[selectedDep])
    const departmentList = useMemo(() => {
        return lodash.uniqBy(roleList, 'depId').map(e => ({id: e.depId, name: e.departmentName, isHq: e.isHq}));
    },[roleList])
    
    const accGroupList = useMemo(() => {
        return lodash.uniqBy(accessList, 'groupName').map(e => ({id: e.groupId, name: e.groupName}));
    },[accessList])

    const isAccessAllCheck = useMemo(() => {
        return accessListDisplay.every(e => selectedAccess.some(e1 => e1.id == e.id))
    },[accessListDisplay,selectedAccess])

    const isRoleAllCheck = useMemo(() => {
        return roleListDisplay.every(e => selectedRoles.some(e1 => e1.id == e.id))
    },[roleListDisplay, selectedRoles])

    function handleSelectDep(id){
        const findDep = departmentList.find(e => e.id == id);
        if(findDep){
            setSelectedDep(findDep);
        }
        if(id == 'all'){
            setSelectedDep({id: 'all'})
        }
    }
    function handleSelectAccG(id){
        const findAccG = accGroupList.find(e => e.id == id);
        if(findAccG){
            setSelectedAccG(findAccG);
        }
        if(id == 'all'){
            setSelectedAccG({id: 'all'})
        }
    }

    function handleSelectAccess(acc ,isSelected){
        if(isSelected){
            setSelectedAccess(p => p.filter(e => e.id != acc.id));
        }else{
            setSelectedAccess(p => [...p, acc])
        }
    }
    function handleSelectAccessAll(){
        if(isAccessAllCheck){
            const a = lodash.differenceBy(selectedAccess, accessListDisplay, 'id')
            setSelectedAccess(a);
        }else{
            const a = lodash.unionBy(selectedAccess, accessListDisplay, 'id')
            setSelectedAccess(a);
        }
    }

    function handleSelectRole(role ,isSelected){
        if(isSelected){
            setSelectedRoles(p => p.filter(e => e.id != role.id));
        }else{
            setSelectedRoles(p => [...p, role])
        }
    }
    function handleSelectRoleAll(){
        if(isRoleAllCheck){
            const a = lodash.differenceBy(selectedRoles, roleListDisplay, 'id')
            setSelectedRoles(a);
        }else{
            const a = lodash.unionBy(selectedRoles, roleListDisplay, 'id')
            setSelectedRoles(a);
        }
    }

    async function submitMultiAdd(){
        try{
            setLoadingModal(true);

            const exist = [];
            const notExist = [];
            const response = await fetchProtectedData.post(URLS.roleAccess.getAccessMultiRole,{
                roleIds: selectedRoles.map(e => e.id)
            })
            const roleResult = groupArray(response.data,'id')
            selectedAccess.forEach(acc => {
                selectedRoles.forEach(role => {
                    const value = {
                        roleId: role.id,
                        roleName: role.roleName,
                        depName: role.departmentName,
                        accessId: acc.id,
                        accessCode: acc.accessCode,
                        accessName: acc.accessName,
                        groupName: acc.groupName
                    }
                    if(roleResult[role.id]?.length > 0 && roleResult[role.id][0].accessIds.some(e => e == acc.id)){
                        exist.push(value)
                    }else{
                        notExist.push(value)
                    }
                })
            })
            setExistAccessRole(exist);
            setNotExistAccessRole(notExist);
            setIsShowConfirmModal(true);
        }catch(err){
            console.error('error fetch access multi role ');
            toastError('เกิดข้อผิดพลาด','เกิดข้อผิดพลาดขณะรับข้อมูล',document.getElementById('multi_add_modal'));
        }finally{
            setLoadingModal(false);
        }
    }
    async function confirmAdd(){
        try{
            setLoadingModal(true);
            const roleAccessToAdd = notExistAccessRole.map(e => { return {roleId: e.roleId, accessId: e.accessId, accessCode: e.accessCode}});
            await fetchProtectedData.post(URLS.roleAccess.multiAdd,{
                roleAccess: roleAccessToAdd,
                createBy: currentUser.userName
            })
            toastSuccess('สำเร็จ','เพิ่มข้อมูลสำเร็จ');
            onClose();
            setSelectedAccG({id: 'all'});
            setSelectedDep({id: 'all'});
            setSelectedAccess([]);
            setSelectedRoles([]);
        }catch(err){
            console.error('error submit multi add');
            toastError('เกิดข้อผิดพลาด','เกิดข้อผิดพลาดขณะรับข้อมูล',);
        }finally{
            setIsShowConfirmModal(false)
            setLoadingModal(false);
        }
    }
    return(
        <div>
            <Modal isOpen={isOpen} onClose={onClose} size="5xl" className="max-h-screen overflow-auto">
                <ModalContent>
                    <ModalHeader>

                    </ModalHeader>
                    <ModalBody>
                        <div className="text-sm">
                            <div className="flex mt-10 space-x-5">
                                <div className="sm:w-1/2 w-full flex mx-4 items-center space-x-3">
                                    <span className="text-blue-800">กลุ่มสิทธิ์</span>
                                    <div className="w-3/5">
                                        <Select aria-label="access group select" items={accGroupList}
                                            selectedKeys={[selectedAccG.id+""]}
                                            onSelectionChange={(e) => handleSelectAccG(Array.from(e)[0])}
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            {accGroupList.map(ag => (
                                                <SelectItem key={ag.id}>{ag.name}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="max-sm:hidden w-1/2 flex mx-4 items-center space-x-3">
                                    <span className="text-orange-800">แผนก</span>
                                    <div className="w-3/5">
                                        <Select aria-label="department select" items={departmentList}
                                            selectedKeys={[selectedDep.id+""]}
                                            onSelectionChange={(e) => handleSelectDep(Array.from(e)[0])}
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            {departmentList.map(dep => (
                                                <SelectItem key={dep.id}>{dep.name}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:flex mt-5 sm:space-x-5 sm:h-[600px]">
                                <Card className="sm:w-1/2 max-sm:h-[400px] max-sm:mb-10" shadow="sm">
                                    <div className=" bg-white flex flex-col h-full overflow-auto">
                                        <div className="flex text-lg max-md:text-base font-bold p-4 shadow-lg shadow-gray-400 z-10">
                                            <Checkbox
                                                isSelected={isAccessAllCheck} 
                                                onValueChange={() => handleSelectAccessAll()}
                                            ></Checkbox>
                                            <div className="text-blue-500 text-center flex-1" >สิทธิ์</div>
                                        </div>
                                        <div className="flex-1 overflow-auto">
                                            {
                                                Object.keys(groupArray(accessListDisplay,'groupName')).map((key,key_index) => {
                                                    const accessGroup = groupArray(accessListDisplay,'groupName')[key];
                                                    
                                                    return(
                                                        <div key={key_index}>
                                                            <div className="sticky top-0 ps-7 p-2 bg-blue-200 font-semibold z-9 shadow-md text-center">{key}</div>
                                                            {
                                                                accessGroup.map((item,item_index) => {
                                                                    const isSelected = selectedAccess.some(e => e.id == item.id)
                                                                    return(
                                                                        <div key={item_index} className="flex hover:bg-blue-100 p-2 select-none z-5"
                                                                            onClick={() =>  handleSelectAccess(item,isSelected)}>
                                                                            <Checkbox
                                                                                isSelected={isSelected} 
                                                                                onValueChange={() => handleSelectAccess(item, isSelected)}
                                                                            ></Checkbox>
                                                                            <div className="text-center flex-1">{item.accessName}</div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </Card>
                                <div className="sm:hidden mb-4 w-full flex mx-4 items-center space-x-3">
                                    <span className="text-orange-800">แผนก</span>
                                    <div className="w-3/5">
                                        <Select aria-label="department select" items={departmentList}
                                            selectedKeys={[selectedDep.id+""]}
                                            onSelectionChange={(e) => handleSelectDep(Array.from(e)[0])}
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            {departmentList.map(dep => (
                                                <SelectItem key={dep.id}>{dep.name}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <Card className="sm:w-1/2 max-sm:h-[400px] max-sm:mb-10" shadow="sm">
                                    <div className="bg-white flex flex-col h-full overflow-auto">
                                        <div className="flex text-lg font-bold p-4 shadow-md shadow-orange-300 z-10 relative">
                                            <Checkbox
                                                isSelected={isRoleAllCheck} 
                                                onValueChange={() => handleSelectRoleAll()}
                                            ></Checkbox>
                                            <div className="flex-1 text-yellow-600 text-center">ตำแหน่ง</div>
                                        </div>
                                        <div className="flex-1 overflow-auto">
                                            {
                                                Object.keys(groupArray(roleListDisplay,'departmentName')).map((key,key_index) => {
                                                    const roleGroup = groupArray(roleListDisplay,'departmentName')[key];
                                                    return(
                                                        <div key={key_index}>
                                                            <div className="sticky ps-7 top-0 p-2 bg-orange-200 font-semibold z-9 shadow-md text-center" >{key}</div>
                                                            {
                                                                roleGroup.map((item,item_index) => {
                                                                    const isSelected = selectedRoles.some(e => e.id == item.id)
                                                                    return(
                                                                        <div key={item_index} className="flex hover:bg-orange-100 p-2 select-none z-5"
                                                                            onClick={() => handleSelectRole(item, isSelected)}>
                                                                            <Checkbox
                                                                                isSelected={isSelected} 
                                                                                onValueChange={() => handleSelectRole(item, isSelected)}
                                                                            ></Checkbox>
                                                                            <div className="flex-1 text-center">{item.roleName}</div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="mt-5 text-center w-full">
                            <Button className=" me-3" variant="light"
                                onPress={() => onClose()}
                            >
                                ยกเลิก
                            </Button>
                            <Button className="text-white" color="success"
                                onPress={() => submitMultiAdd()}
                                isDisabled={selectedRoles.length <= 0 || selectedAccess.length <= 0}
                                isLoading={loadingModal}
                            >
                                ยืนยัน
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <AlertQuestion isShowIcon={false} title={``}
                isOpen={isShowConfirmModal}
                onClose={() => setIsShowConfirmModal(false)}
                onConfirm={confirmAdd}
                size='5xl'
            >
                <div>
                    <div className="">
                        <div className="font-bold mb-3 text-green-600 text-center">สิทธิ์ที่จะเพิ่ม {`(${notExistAccessRole.length})`}</div>
                        <div className="max-h-[250px] overflow-auto bg-white rounded-lg shadow-lg border">
                            {
                                sortArrayMultiField(notExistAccessRole, ['groupName']).map((item,index) => {
                                    return(
                                        <div key={index} className="flex py-1 even:bg-gray-200 hover:bg-gray-300">
                                            <div className="w-1/12 text-start font-semibold ps-3">{index+1}</div>
                                            <div className="w-5/12"><span className="font-bold">{`${item.groupName}`}</span> - {`${item.accessName}`}</div>
                                            <div className="w-1/12"><HFArrowRight /></div>
                                            <div className="w-5/12"><span className="font-bold">{`${item.depName}`}</span> - {`${item.roleName}`}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="font-bold mb-3 text-orange-400">สิทธิ์ที่มีอยู่แล้ว {`(${existAccessRole.length})`}</div>
                        <div className="max-h-[250px] overflow-auto bg-white rounded-lg shadow-lg border">
                            {
                                sortArrayMultiField(existAccessRole,['groupName']).map((item,index) => {
                                    return(
                                        <div key={index} className="flex py-1 even:bg-gray-200 hover:bg-gray-300">
                                            <div className="w-1/12 text-start font-semibold ps-3">{index+1}</div>
                                            <div className="w-5/12"><span className="font-bold">{`${item.groupName}`}</span> - {`${item.accessName}`}</div>
                                            <div className="w-1/12"><HFArrowRight /></div>
                                            <div className="w-5/12"><span className="font-bold">{`${item.depName}`}</span> - {`${item.roleName}`}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </AlertQuestion>
        </div>
    )
}