import { AlertQuestion, toastError, toastSuccess, toastWarning } from "@/component/Alert"
import fetchProtectedData from "../../../../../../utils/fetchData"
import { useAppContext } from "@/contexts/AppContext"
import { useEffect, useMemo, useState } from "react"
import { URLS } from "@/config"
import { Button, Card, CardBody, CardHeader, Divider, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react"
import { AddCircleIcon, AddStreamlineUltimateWhiteIcon, EditIcon, HFChevronRight, HFVerticalDots } from "@/component/Icons"
import { DeleteIcon, PencilIcon } from "lucide-react"
import RoleAccesBox from "../components/RoleAccessBox"

export default function DefaultDepRoleManageTab() {
    const {currentUser, agent} = useAppContext()
    const isDev = process.env.NODE_ENV == 'development'
    const [depList, setDepList] = useState([])
    const [selectedDep, setSelectedDep] = useState(null)
    const [selectedDepToEdit, setSelectedDepToEdit] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [selectedRoleToEdit, setSelectedRoleToEdit] = useState(null)

    const [accessList, setAccessList] = useState([])

    const [isManageDepModalOpen, setIsManageDepModalOpen] = useState(false)
    const [isManageRoleModalOpen, setIsManageRoleModalOpen] = useState(false)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)

    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)

    const [isAccessEdit, setIsAccessEdit] = useState(false)
    const [roleAccessList, setRoleAccessList] = useState([])

    
    const roleList = useMemo(() => {
        return depList.find(dep => dep.id == selectedDep)?.roles || []
    }, [depList ,selectedDep])

    const selectedRoleDetail = useMemo(() => {
        return roleList.find(role => role.id == selectedRole)
    }, [roleList, selectedRole])
    
    const fetchDepList = async () => {
        try{
            const res = await fetchProtectedData.get(URLS.department_template.getDepartment)
            setDepList(res.data);

        }catch(err){
            console.log(err)
            toastError(isDev ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก')
        }
    }


    const fetchAccessList = async () => {
        try{
            const res = await fetchProtectedData.get(URLS.access.getAll, {
                params: {
                    businessId: currentUser.businessId,

                    safe: 'false'
                }
            })
            setAccessList(res.data)

        }catch(err){
            console.log(err)
            toastError(isDev ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์')
        }
    }

    const fetchRoleAccessList = async () => {
        try{
            const res = await fetchProtectedData.get()
        }catch(err){
            
            console.error(err)
        }
    }

    async function refresh(){
        setIsLoading(true)
        await Promise.all([
            fetchDepList(),
            fetchAccessList()
        ])
        setIsLoading(false)
    }

    useEffect(() => {
        refresh()
    }, [])


    async function handleSaveDep(name, code){
        try{
            setIsSubmitLoading(true)
            const isEdit = Boolean(selectedDepToEdit)
            if(isEdit){
                await fetchProtectedData.put(URLS.department_template.updateDepartment, {
                    id: selectedDepToEdit?.id,
                    name,
                    code
                })
                toastSuccess('แก้ไขแผนกสำเร็จ')
            }else{
                await fetchProtectedData.post(URLS.department_template.createDepartment, {
                    name,
                    code,
                })
                toastSuccess('เพิ่มแผนกสำเร็จ')
            }
            setSelectedDepToEdit(null)
            setIsManageDepModalOpen(false)
            refresh()
        }catch(err){
            if(err?.response?.data?.isDuplicate){
                toastWarning('ชื่อแผนกนี้มีอยู่ในระบบแล้ว')
            }else{
                console.log(err)
                toastError(isDev ? err.message : 'เกิดข้อผิดพลาดในการบันทึกแผนก')
            }
        }finally{
            setIsSubmitLoading(false)
        }
    }

    async function handleSaveRole(name){
        try{
            setIsSubmitLoading(true)
            const isEdit = Boolean(selectedRoleToEdit)
            if(isEdit){
                await fetchProtectedData.put(URLS.department_template.updateRole, {
                    id: selectedRoleToEdit?.id,
                    name
                })
                toastSuccess('แก้ไขตำแหน่งสำเร็จ')
            }else{
                await fetchProtectedData.post(URLS.department_template.createRole, {
                    name,
                    depId: selectedDep
                })
                toastSuccess('เพิ่มตำแหน่งสำเร็จ')
            }
            setSelectedRoleToEdit(null)
            setIsManageRoleModalOpen(false)
            refresh()
        }catch(err){
            if(err?.response?.data?.isDuplicate){
                toastWarning('ชื่อตำแหน่งนี้มีอยู่ในระบบแล้ว')
            }else{
                isDev && console.error(err)
                toastError(isDev ? err.message : 'เกิดข้อผิดพลาดในการบันทึกตำแหน่ง')
            }
        }finally{
            setIsSubmitLoading(false)
        }

    }

    return (
        <div>
            <AlertQuestion 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                onConfirm={() => {
                    handleDeleteItem()
                    setIsDeleteModalOpen(false)
                }} 
                title={itemToDelete?.type == 'dep' ? 'ลบแผนก' : 'ลบตำแหน่ง'}
                content={`คุณต้องการลบ ${itemToDelete?.type == 'dep' ? 'แผนก' : 'ตำแหน่ง'} ${itemToDelete?.name} หรือไม่`}
                color="danger"
            />
            <ManageDepModal isOpen={isManageDepModalOpen} onClose={() => setIsManageDepModalOpen(false)} dep={selectedDepToEdit} onSave={handleSaveDep} isLoading={isSubmitLoading} />
            <ManageRoleModal isOpen={isManageRoleModalOpen} onClose={() => setIsManageRoleModalOpen(false)} role={selectedRoleToEdit} onSave={handleSaveRole} isLoading={isSubmitLoading} />
            <div className="flex space-x-4 h-[680px]">
                <div className="w-[240px] h-full">
                    <Card shadow="sm" className="h-full overflow-auto">

                        <CardHeader className="border-b-1">
                            <div className="flex items-center justify-between gap-2 w-full">
                                <p className="text-lg font-bold ms-4">แผนก</p>
                                <Button isIconOnly color="success" variant="light" size="sm" className="text-xs"
                                    onPress={() => {
                                        setSelectedDepToEdit(null)
                                        setIsManageDepModalOpen(true);
                                    }}
                                >
                                    <AddStreamlineUltimateWhiteIcon />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-auto scrollbar-hide">
                        {
                            depList.map((dep) => (
                                // <Tooltip key={dep.id} content={dep.name}>
                                    (<div  
                                        className={`flex items-center p-2 transition-all cursor-pointer rounded-md ${dep.id == selectedDep ? 'bg-primary-100 text-primary' : 'hover:bg-gray-100'}`}
                                        onClick={() => {
                                            setSelectedDep(dep.id)
                                        }}
                                    >
                                        <div className="w-full flex items-center gap-2">
                                            <div className="flex-1 min-w-0">

                                                <p className="truncate">{dep.name}</p>
                                            </div>
                                            <div className=""> 
                                                <Popover placement="right">
                                                    <PopoverTrigger>
                                                        <Button isIconOnly color="default" variant="light" size="sm" className="text-xs text-gray-500"><HFVerticalDots /></Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                    <div className="">
                                                        <Listbox aria-label="team menu" className="min-w-32"
                                                            emptyContent={'ไม่มีเมนู'}
                                                            onAction={(key) => {
                                                                if(key === 'delete') {
                                                                    handleDeleteTeamClick(currentTeam);
                                                                }
                                                                else if(key === 'edit') {
                                                                    setSelectedDepToEdit(dep)
                                                                    setIsManageDepModalOpen(true)
                                                                }
                                                            }}
                                                        >
                                                            <ListboxItem key={"edit"} className="text-warning" startContent={<EditIcon/>}>แก้ไขแผนก</ListboxItem>
                                                            <ListboxItem key={"delete"} className="text-danger" startContent={<DeleteIcon/>}>ลบแผนก</ListboxItem>
                                                        </Listbox>
                                                    </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>)
                                // </Tooltip>
                            ))
                        }
                        </CardBody>
                    </Card>
                </div>
                <div className="flex items-center justify-center"><HFChevronRight/></div>
                <div className="w-[240px] h-full">
                    <Card shadow="sm" className="h-full overflow-auto">
                        <CardHeader className="border-b-1 font-semibold flex items-center justify-between">
                            <p className="ms-4">ตำแหน่ง</p>
                            <Button isIconOnly color="success" variant="light" size="sm" className="text-xs" onPress={() => {
                                setSelectedRoleToEdit(null)
                                setIsManageRoleModalOpen(true)
                            }}><AddStreamlineUltimateWhiteIcon /></Button>
                        </CardHeader>
                        <CardBody>
                        {
                            !selectedDep ?
                            <p className="text-center text-gray-500">กรุณาเลือกแผนก</p>
                            :
                            roleList.length == 0 ?
                            <p className="text-center text-gray-500">ไม่มีตำแหน่ง</p>
                            :
                            roleList.map((role) => (
                                <div key={role.id} 
                                    className={`flex items-center p-2 transition-all cursor-pointer rounded-md ${role.id == selectedRole ? 'bg-warning-100 text-warning' : 'hover:bg-gray-100'}`}
                                    onClick={() => {
                                        setSelectedRole(role.id)
                                    }}
                                >
                                    <div className="w-full flex items-center justify-between gap-2">

                                        <div>
                                            <p>{role.name}</p>
                                        </div>
                                        <div className=""> 
                                                <Popover placement="right">
                                                    <PopoverTrigger>
                                                        <Button isIconOnly color="default" variant="light" size="sm" className="text-xs text-gray-500"><HFVerticalDots /></Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                    <div className="">
                                                        <Listbox aria-label="team menu" className="min-w-32"
                                                            emptyContent={'ไม่มีเมนู'}
                                                            onAction={(key) => {
                                                                if(key === 'delete') {
                                                                    handleDeleteTeamClick(currentTeam);
                                                                }
                                                                else if(key === 'edit') {
                                                                    setSelectedRoleToEdit(role)
                                                                    setIsManageRoleModalOpen(true)
                                                                }
                                                            }}
                                                        >
                                                            <ListboxItem key={"edit"} className="text-warning" startContent={<EditIcon/>}>แก้ไขตำแหน่ง</ListboxItem>
                                                            <ListboxItem key={"delete"} className="text-danger" startContent={<DeleteIcon/>}>ลบตำแหน่ง</ListboxItem>
                                                        </Listbox>
                                                    </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                    </div>
                                </div>
                            ))
                        }
                        </CardBody>
                    </Card>
                </div>
                <div className="flex items-center justify-center"><HFChevronRight/></div>
                <div className="flex-1 h-full">
                    <Card shadow="sm" className="h-full overflow-auto">
                        <CardHeader className="border-b-1 font-semibold flex items-center justify-between">
                            <p className="ms-4">ตำแหน่ง</p>
                        </CardHeader>
                        <CardBody>
                            <RoleAccesBox accessList={accessList} selectedRole={selectedRoleDetail} loadAccessList={false} onSave={() => {}} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ManageDepModal({isOpen, onClose, dep, onSave, isLoading}){
    const [name, setName] = useState(dep?.name ?? '')
    const [code, setCode] = useState(dep?.code ?? '')

    useEffect(() => {
        setName(dep?.name ?? '')
        setCode(dep?.code ?? '')
    },[dep, isOpen])

    const isEdit = Boolean(dep)
    return (
        <Modal isOpen={isOpen} onClose={() => {
            setName('')
            setCode('')
            onClose()
        }}>
            <ModalContent>

                <ModalHeader>

                    <p className="text-lg font-bold">{isEdit ? 'แก้ไขแผนก' : 'เพิ่มแผนก'}</p>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="flex gap-2">
                            <Input 
                                label="ชื่อแผนก" 
                                variant="bordered"
                                endContent={<PencilIcon color="gray" size={20}/>}
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            <Input 
                                label="ตัวย่อ" 
                                variant="bordered"
                                endContent={<PencilIcon color="gray" size={20}/>}
                                value={code} 
                                onChange={(e) => setCode(e.target.value)} 
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="mt-4" variant="light" onPress={onClose}>ยกเลิก</Button>
                    <Button className="mt-4 text-white" color="success" isLoading={isLoading} onPress={() => onSave(name, code)}>บันทึก</Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

function ManageRoleModal({isOpen, onClose, role, onSave, isLoading}){
    const [name, setName] = useState(role?.name ?? '')

    useEffect(() => {
        setName(role?.name ?? '')
    },[role, isOpen])

    const isEdit = Boolean(role)
    return (
        <Modal isOpen={isOpen} onClose={() => {
            setName('')
            onClose()
        }}>
            <ModalContent>
                <ModalHeader>
                    <p className="text-lg font-bold">{isEdit ? 'แก้ไขตำแหน่ง' : 'เพิ่มตำแหน่ง'}</p>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <div className="flex gap-2">
                            <Input 
                                label="ชื่อตำแหน่ง" 
                                variant="bordered"
                                endContent={<PencilIcon color="gray" size={20}/>}
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button className="mt-4" variant="light" onPress={onClose}>ยกเลิก</Button>
                    <Button className="mt-4 text-white" color="success" isLoading={isLoading} onPress={() => onSave(name)}>บันทึก</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
