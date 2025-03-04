import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../../../../layouts/default";
import { useEffect, useState } from "react";
import { AlertQuestion, toastError, toastSuccess, toastWarning } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { Avatar, Badge, BreadcrumbItem, Breadcrumbs, Button, Card, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, User } from "@nextui-org/react";
import { DeleteIcon, EditIcon, HFCrown, HfGroups, HFVerticalDots } from "../../../../../component/Icons";
import { Screen, useResponsive } from "../../../../../component/responsive";
import { getProfileColor, getUserName } from "../../../../../../utils/util";
import { moveToFirstOfArray } from "../../../../../../utils/arrayFunc";
import { useAppContext } from "../../../../../contexts/AppContext";
import { ACCESS } from "../../../../../configs/access";

export default function TeamManage(){
    const {accessCheck} = useAppContext()
    const params = useParams();
    const {screenInt} = useResponsive();
    const [currentTeam, setCurrentTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [loadTeam, setLoadTeam] = useState(false);

    const [selectedTeamToDelete, setSelectedTeamToDelete] = useState(null)
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false)
    const [loadRemoveLeader, setLoadRemoveLeader] = useState(null);

    const [showChangeNameModal, setShowChangeNameModal] = useState(false);
    const [editedTeamName, setEditedTeamName] = useState('');


    const navigate = useNavigate();
 
    async function fetchTeamData() {
        try{
            const [
                teamRes,
                memberRes
            ] = await Promise.all([
                fetchProtectedData.get(`${URLS.teams.getById}/${params.teamId}`),
                fetchProtectedData.get(`${URLS.teams.getMembers}/${params.teamId}`)
            ])
            setCurrentTeam(teamRes.data)
            setMembers(memberRes.data)
        }catch(err){
            console.error('error fetching teamData');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
    useEffect(() => {
        fetchTeamData()
    },[])

    function handleMembersManageClick(){
        navigate('/teamMembersManage/'+ currentTeam?.id)
    }

    function handleDeleteTeamClick(team){
        setSelectedTeamToDelete(team);
        setShowDeleteTeamModal(true)
        
    }
    async function submitDeleteTeam() {
        try{
            await fetchProtectedData.put(`${URLS.teams.delete}`,{
                teamIds: [selectedTeamToDelete.id]
            })
            toastSuccess('สำเร็จ','ลบทีมแล้ว');
            navigate('/management');
        }catch(err){
            console.error('error delete team');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
    async function handleChangeNameClick(team){
        try{
            const res =await fetchProtectedData.put(`${URLS.teams.edit}/${team.id}`,{
                name: editedTeamName,
            })
            if(res.data.isDuplicate){
                toastWarning('เกิดข้อผิดพลาด','ชื่อทีมนี้มีอยู่ในระบบแล้ว');
                return;
            }
            toastSuccess('สำเร็จ','เปลี่ยนชื่อทีมแล้ว');
            setShowChangeNameModal(false);
            setEditedTeamName('');
            fetchTeamData();
        }catch(err){
            console.error(err);
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            
        }
    }
    return(
        <div>
            <section title={`ทีม ${currentTeam?.name??''}`}>

                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href="management">จัดการทีม</BreadcrumbItem>
                        <BreadcrumbItem>ทีม {currentTeam?.name??''}</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <Card className="flex p-4 mt-4 max-h-[calc(100vh-150px)] max-w-full overflow-hidden" shadow="sm">
                    <div className="px-4 flex justify-between items-center">
                        <div className="text-xl font-bold">สมาชิก {`(${members.length})`}</div>
                        <div className="text-xl font-bold flex items-center space-x-3">
                            {
                                accessCheck.haveOne(ACCESS.team.member_manager) &&
                                <Button size={screenInt <= Screen.md ? 'sm' : 'md'} color="primary" startContent={<HfGroups />} onPress={handleMembersManageClick}>จัดการสมาชิก</Button>
                            }
                            <div className="">
                            {
                                accessCheck.haveOne(ACCESS.team.manager) &&
                                <Popover aria-label="popup menu">
                                    <PopoverTrigger>
                                        <Button radius="full" size="md" variant="light" isIconOnly ><HFVerticalDots/></Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="">
                                            <Listbox aria-label="team menu" className="min-w-32"
                                                emptyContent={'ไม่มีเมนู'}
                                                onAction={(key) => {
                                                    if(key === 'delete') {
                                                        handleDeleteTeamClick(currentTeam);
                                                    }
                                                    else if(key === 'changeName') {
                                                        setEditedTeamName(currentTeam.name);
                                                        setShowChangeNameModal(true);
                                                    }

                                                }}
                                            >

                                                
                                                <ListboxItem key={"changeName"} className="text-warning" startContent={<EditIcon/>}>เปลี่ยนชื่อทีม</ListboxItem>
                                                <ListboxItem key={"delete"} className="text-danger" startContent={<DeleteIcon/>}>ลบทีม</ListboxItem>
                                            </Listbox>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="p-4 pt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4 max-h-[600px]">
                            {
                                moveToFirstOfArray(members, e => e.username === currentTeam.leader) .map(user => {
                                    return(
                                        <div key={user.username} className="">
                                            <Card className="p-4" shadow="sm">
                                                <div className="flex justify-between relative">
                                                    <div className="flex">
                                                        <div className="text-center">
                                                            <Badge isInvisible={!(user.username === currentTeam.leader)} content={<div className="text-sm text-yellow-400 rotate-45"><HFCrown /></div>}
                                                                showOutline={false} className="bg-transparent"
                                                            >
                                                                <Avatar
                                                                    name={getUserName(user.username)}
                                                                    src={user.displayImgUrl}
                                                                    style={{backgroundColor: getProfileColor(user.username), color: 'white', width: 46, height: 46}}
                                                                />
                                                            </Badge>
                                                        </div>
                                                        <div className="ps-4">
                                                            <div className="text-base max-sm:text-sm font-bold">{user.username}</div>
                                                            <div className="text-sm max-sm:text-xs text-gray-500 font-semibold">{user.name} {user.nickName ? `(${user.nickName})` : ''}</div>
                                                        </div>
                                                    </div>
                                                    <div className="ps-4">
                                                        <div className="text-base max-sm:text-sm font-bold text-end">{user.depName}</div>
                                                        <div className="text-sm max-xs:text-xs text-gray-500 font-semibold text-end">{user.roleName}</div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </Card>
            </section>
            <Modal isOpen={showChangeNameModal} onClose={() => setShowChangeNameModal(false)}>
                <ModalContent>
                    <ModalHeader>
                        <div>เปลี่ยนชื่อทีม</div>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            aria-label="edit team name"
                            label="ชื่อทีม"
                            value={editedTeamName}
                            onChange={(e) => setEditedTeamName(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={() => handleChangeNameClick(currentTeam)}>ยืนยัน</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

             {/* Alert Confirm DeleteTeam */}
             <AlertQuestion 
                isOpen={showDeleteTeamModal} 
                onClose={() => setShowDeleteTeamModal(false)} 
                title={'ลบทีม'}
                isDismissable={true}
                onConfirm={submitDeleteTeam}
                color={'danger'}
                icon="warning"
            >
                <div className="text-center">ต้องการลบทีมหรือไม่</div>
            </AlertQuestion>
        </div>
    )
}