import { Accordion, AccordionItem, Avatar, AvatarGroup, Button, Card, Checkbox, CircularProgress, Input, Link, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import { DeleteIcon, HFArrowLeft, HFDoubleArrowLeft, HfGroups, HfPerson, HFRemoveUser, HFVerticalDots, UserAddPlusIcon } from "../../../../../component/Icons";
import SearchBox from "../../../../../component/SearchBox";
import { useAppContext } from "../../../../../contexts/AppContext";
import { ACCESS } from "../../../../../configs/access";
import { useEffect, useMemo, useState } from "react";
import { AlertQuestion, toastError, toastSuccess } from "../../../../../component/Alert";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { groupArray } from "../../../../../../utils/arrayFunc";
import { getProfileColor, getUserName } from "../../../../../../utils/util";
import { useResponsive } from "../../../../../component/responsive";
import lodash from "lodash"

export default function TeamListPageManager(){
    const {currentUser, accessCheck} = useAppContext();
    const [leaders, setLeaders] = useState([])
    const [teamList, setTeamList] = useState([]);
    const [loadTeamList, setLoadTeamList] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLeaderToDelete, setSelectedLeaderToDelete] = useState(null)
    const [selectedTeamToDelete, setSelectedTeamToDelete] = useState(null)
    const [leaderTeamList, setLeaderTeamList] = useState([])

    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [showAddLeaderModal, setShowAddLeaderModal] = useState(false);
    const [showRemoveLeaderModal, setShowRemoveLeaderModal] = useState(false)
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false)

    const [loadSubmit, setLoadSubmit] = useState(null);
    const [loadRemoveLeader, setLoadRemoveLeader] = useState(null);
   
    const {screen} = useResponsive();

    async function fetchTeams(){
        try{
            setLoadTeamList(true)
            const response = await fetchProtectedData.get(`${URLS.teams.getByManager}/${currentUser.userName}`);
            setLeaders(response.data);
            const teams = [];
            response.data.forEach(e => {
                teams.push(...e.teams);
            })
            setTeamList(teams);
            if(accessCheck.haveOne(ACCESS.team.leader)){
                const response = await fetchProtectedData.get(`${URLS.teams.getByLeader}/${currentUser.userName}`);
                setLeaderTeamList(response.data);
            }
        }catch(err){
            console.error('error fetching teams');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadTeamList(false);
        }
    }
    useEffect(() => {
        fetchTeams();
    },[])
    
    const leaderList = useMemo(() => {
        return leaders.map(e => e.leader) 
    },[leaders])

    function handleSearch(data){
        const groupTeams = groupArray(data, 'leader')
        setLeaders(p => p.map(leader => {
            leader.teams = groupTeams[leader.leader]??[];
            return leader;
        }))
    }
    function handleRemoveLeaderClick(username){
        setSelectedLeaderToDelete(username);
        setShowRemoveLeaderModal(true)
    }
    async function submitRemoveLeader(){
        const findLeader = leaders.find(e => e.leader === selectedLeaderToDelete)
        if(!findLeader) {
            toastError('ไม่สำเร็จ','ไม่พบทีมที่เลือก');
            return;
        }
        try{
            setLoadRemoveLeader(selectedLeaderToDelete)
            await Promise.all([
                fetchProtectedData.delete(URLS.teams.removeLeaders,{
                    data: {
                        manager: currentUser.userName,
                        leaders: [findLeader.leader]
                    }
                }),
                fetchProtectedData.put(URLS.teams.delete,{
                    teamIds: findLeader.teams.map(e => e.id),
                })
            ]);
            toastSuccess('สำเร็จ','นำหัวหน้าทีมออกสำเร็จ');
            setShowRemoveLeaderModal(false);
            fetchTeams();
        }catch(err){
            console.error('error remove leader');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadRemoveLeader(null);
        }
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
            setShowDeleteTeamModal(false);
            fetchTeams();
        }catch(err){
            console.error('error delete team');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
    return(
        <div className="py-3">
            <div className="md:flex justify-between px-4">
                <div className="flex items-center">
                    <div className="font-bold text-lg me-10">ทีมที่เป็นผู้จัดการ {`(${teamList.length})`}</div>
                    <Button size="sm" className="text-sm text-white me-3" color="success" onPress={() => setShowCreateTeamModal(true)}
                        startContent={<HfGroups/>}
                    >
                        สร้างทีม
                    </Button>
                    <Button size="sm" className="text-sm text-white" color="primary" onPress={() => setShowAddLeaderModal(true)}
                        startContent={<HfPerson/>}
                    >
                        เพิ่มหัวหน้าทีม
                    </Button>
                </div>

                <div className="max-w-52 max-md:mt-4">
                    <SearchBox data={teamList} onChange={(data) => handleSearch(data)} 
                        searchRules={['leader','name']} 
                        placeholder={`ค้นหาชื่อทีม หรือหัวหน้าทีม`} 
                        removeZeroScore={false}
                        valueState={searchText}
                        onTextChange={(text) => setSearchText(text)}
                    />
                </div>
                
            </div>
            <div className="mt-6 max-h-[450px] min-h-[100px] overflow-auto scrollbar-hide">
                {
                loadTeamList ?
                <div className="w-full flex justify-center mt-8"><CircularProgress /></div> :
                leaders.length <= 0 || teamList.length <= 0 ?
                <div className="flex justify-center text-lg font-semibold mt-6">ไม่มีทีมที่ดูแล</div> :
                //ถ้ามีข้อมูล แต่ไม่ตรงกับที่ค้นหา
                leaders.every(l => l.teams.every(e => e.score <= 0)) ?
                <div className="flex justify-center text-lg font-semibold mt-6">ไม่พบทีมที่ค้นหา</div> :
                <Accordion aria-label="team list" selectionMode="multiple" showDivider={false} 
                    defaultExpandedKeys={['0','1','2']}
                >
                    {
                        leaders.map((leader, i) => {
                            //ถ้ามีการค้นหา และทีมทั้งหมดของหัวหน้าทีมไม่ตรง ให้ซ่อนหัวหน้าทีม
                            const isLeaderHidden = searchText !== '' && leader.teams.every(e => e.score <= 0);
                            if(isLeaderHidden) return null
                            const isLeaderLoad = loadRemoveLeader === leader.leader
                            return(
                                <AccordionItem 
                                    key={i}
                                    classNames={{
                                        base: 'mb-2 rounded-lg',
                                        trigger: ' px-2 hover:bg-default-100 rounded-lg py-2 bg-gray-50 shadow-md transition-colors duration-300',
                                        indicator: 'text-2xl',
                                    }}
                                    title={
                                        <div className="flex items-center text-sm lg:text-base">
                                            <div className="flex overflow-hidden text-ellipsis text-nowrap flex-1 items-center border-0">
                                                <div className="me-2">หัวหน้าทีม:</div>
                                                <div className="font-bold">
                                                    <User 
                                                        name={leader.leader} 
                                                        description={`${leader ? `${leader.name??''} ${leader.nickName ? `(${leader.nickName})` : ''}` : ''}`} 
                                                        avatarProps={{
                                                            name: getUserName(leader.leader),
                                                            src: leader?.displayImgUrl,
                                                            style: {backgroundColor: getProfileColor(leader.leader), color:'white'}
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className=" font-semibold">{leader.teams.length} ทีม</div>
                                                <div className=" flex justify-end">
                                                    <Tooltip content="นำหัวหน้าทีมออกจากการดูแล" color="danger">
                                                        <Button color="danger" variant="light" isIconOnly radius="lg" onPress={() => handleRemoveLeaderClick(leader.leader)} isLoading={isLeaderLoad}>
                                                            <HFRemoveUser size={24} />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    
                                >
                                    <div className="px-4">
                                        {
                                            leader.teams.map((team) => {
                                                const isHidden = team.score <= 0
                                                if(isHidden) return null
                                                return(
                                                    <div key={team.id} className="flex items-center justify-between text-sm lg:text-base py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors duration-300">
                                                        <div className="flex flex-1 ">
                                                            <div className="w-1/2 flex items-center">
                                                                <Link href={"TeamManage/"+team.id} underline="hover">ทีม {team.name}</Link>
                                                            </div>
                                                            <div className="w-1/2 flex justify-start items-center space-x-5">
                                                                <div className="max-md:hidden font-semibold">สมาชิก {team.members.length} คน</div>
                                                                <AvatarGroup aria-label="asas" size={screen === 'sm' ? 'sm' : 'md'}>
                                                                    {team.members.map((user,index) => (
                                                                        <Tooltip key={user.username} content={<div className="text-nowrap"><div className="font-semibold">{user.username}</div><div className="text-gray-500">{user.name}</div></div>}>
                                                                            <Avatar name={getUserName(user.username)} src={user.displayImgUrl} 
                                                                                style={{backgroundColor: getProfileColor(user.username), color: 'white'}}
                                                                                
                                                                            />
                                                                        </Tooltip>
                                                                    ))}
                                                                </AvatarGroup>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <Popover aria-label="popup menu">
                                                                <PopoverTrigger>
                                                                    <Button variant="light" radius="full" isIconOnly isDisabled={isLeaderLoad}>
                                                                        <HFVerticalDots size={'1.2em'}/>
                                                                    </Button>
                                                                </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div className="">
                                                                    <Listbox aria-label="team menu" className="min-w-32"
                                                                        onAction={(key) => {
                                                                            if(key === 'delete') {
                                                                                handleDeleteTeamClick(team)
                                                                            }
                                                                            else {}
                                                                        }}
                                                                    >
                                                                        <ListboxItem key={"delete"} className="text-danger" startContent={<DeleteIcon/>}>ลบทีม</ListboxItem>
                                                                    </Listbox>
                                                                </div>
                                                            </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
                }
                
            </div>
            {
                accessCheck.haveOne(ACCESS.team.leader) &&
                <>
                    <div className="border-t-1 border-gray-200 my-6"></div>
                    <div>
                    <div className="text-lg font-semibold mb-4 ms-4">ทีมที่เป็นหัวหน้าทีม ({leaderTeamList.length})</div>
                    {
                        leaderTeamList.length <= 0 ?
                        <div className="flex justify-center text-lg font-semibold mt-6">ไม่มีทีมที่เป็นหัวหน้าทีม</div> :
                        <div className="px-8 max-h-[450px] min-h-[100px] overflow-auto scrollbar-hide">
                            {
                                leaderTeamList.map((team) => {
                                    const isHidden = team.score <= 0
                                    if(isHidden) return null
                                    return(
                                        <div key={team.id} className="flex items-center justify-between text-sm lg:text-base py-3 hover:bg-gray-100 rounded-lg px-2 transition-colors duration-300">
                                            <div className="flex flex-1 items-center">
                                                <div className="w-3/12 flex items-center">
                                                    <div className="me-4">ผู้จัดการ: <strong>{team.manager}</strong></div>
                                                    <Link href={"TeamManage/"+team.id} underline="hover">ทีม {team.name}</Link>
                                                </div>
                                                <div className="w-6/12 flex justify-start items-center space-x-5">
                                                    <div className="max-md:hidden font-semibold">สมาชิก {team.members.length} คน</div>
                                                    <AvatarGroup aria-label="asas" size={screen === 'sm' ? 'sm' : 'md'}>
                                                        {team.members.map((user,index) => (
                                                            <Tooltip key={user.username} content={<div className="text-nowrap"><div className="font-semibold">{user.username}</div><div className="text-gray-500">{user.name}</div></div>}>
                                                                <Avatar name={getUserName(user.username)} src={user.displayImgUrl} 
                                                                    style={{backgroundColor: getProfileColor(user.username), color: 'white'}}
                                                                    
                                                                />
                                                            </Tooltip>
                                                        ))}
                                                    </AvatarGroup>
                                                </div>
                                            </div>
                                            <div className="">
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                    </div>
                </>
            }
            {/* ModalCreateTeam */}
            <Modal isOpen={showCreateTeamModal} size="lg" onClose={() => setShowCreateTeamModal(false)}>
                <ModalContent>
                    <ModalHeader>
                        สร้างทีม
                    </ModalHeader>
                    <ModalBody>
                        <div className="py-4">
                            <CreateTeamModal leaderList={leaderList} onSaved={() => fetchTeams()} onClose={() => setShowCreateTeamModal(false)} />
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

            {/* ModalAddLeader */}
            <Modal isOpen={showAddLeaderModal} size="xl" onClose={() => setShowAddLeaderModal(false)}>
                <ModalContent>
                    <ModalHeader>
                        เพิ่มหัวหน้าทีม
                    </ModalHeader>
                    <ModalBody>
                        <div className="py-4">
                            <AddLeaderModal leaderList={leaderList} onSaved={() => fetchTeams()} onClose={() => setShowAddLeaderModal(false)} />
                        </div>
                    </ModalBody>

                </ModalContent>
            </Modal>

            {/* Alert Confirm RemoveLeader */}
            <AlertQuestion 
                isOpen={showRemoveLeaderModal} 
                onClose={() => setShowRemoveLeaderModal(false)} 
                title={'นำหัวหน้าทีมออก'}
                isDismissable={true}
                onConfirm={submitRemoveLeader}
                confirmText={'ยืนยัน'}
                color={'danger'}
                icon="warning"
                
            >
                <div className="text-center">ต้องการนำ {selectedLeaderToDelete} ออกจากการดูแลหรือไม่</div>
            </AlertQuestion>

            {/* Alert Confirm DeleteTeam */}
            <AlertQuestion 
                isOpen={showDeleteTeamModal} 
                onClose={() => setShowDeleteTeamModal(false)} 
                title={'ลบทีม'}
                isDismissable={true}
                onConfirm={submitDeleteTeam}
                confirmText={'ยืนยัน'}
                color={'danger'}
                icon="warning"
            >
                <div className="text-center">ต้องการลบทีม <span className="font-semibold">{selectedTeamToDelete?.name}</span> ของ <span className="font-semibold">{selectedTeamToDelete?.leader}</span> หรือไม่</div>
            </AlertQuestion>
        </div>
    )
}

function CreateTeamModal({leaderList, onSaved, onClose}){
    const [name, setName] = useState('');
    const [leader, setLeader] = useState(null);
    const {currentUser} = useAppContext()
    const [showValidate, setShowValidate] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    function handleSelectLeader(data){
        const _data = Array.from(data);
        setLeader(_data[0])
    }

    async function handleSubmit(){
        setShowValidate(true);
        if(name.trim() === '' || !leader) return;
        try{
            setLoadSubmit(true);
            const response = await fetchProtectedData.post(URLS.teams.create,{
                name: name,
                leader: leader,
                createBy: currentUser.userName,
                businessId: currentUser.businessId,
                manager: currentUser.userName
            });
            if(response.data.isDuplicate){
                toastError('สร้างทีมไม่สำเร็จ','ชื่อทีมนี้ถูกใช้แล้ว')
                return;
            }
            toastSuccess('สำเร็จ','สร้างทีมสำเร็จ');
            onClose();
            onSaved();

        }catch(err){
            console.error('error create team');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadSubmit(false);
        }
    }
    return (
        <div className="flex flex-col items-center">
            <div className="w-64">
                <Input
                    variant="bordered" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    label='ชื่อทีม'
                    isInvalid={showValidate && name.trim() === ''}
                />
            </div>
            <div className="w-64 mt-4">
                <Select aria-label="leader selector" label='เลือกหัวหน้าทีม'
                    isInvalid={showValidate && !leader}
                    selectedKeys={[leader]}
                    onSelectionChange={(data) => handleSelectLeader(data)}
                >
                    {leaderList.map(leader => (
                        <SelectItem key={leader}>{leader}</SelectItem>
                    ))}
                </Select>
            </div>
            <div className="mt-6">
                <Button color="success" className="text-white" onPress={handleSubmit} isLoading={loadSubmit}>สร้างทีม</Button>
            </div>
        </div>
    )
}

function AddLeaderModal({leaderList, onSaved, onClose}){
    const {currentUser} = useAppContext()
    const [selectedLeaders, setSelectedLeaders] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [leadersDisplay, setLeadersDisplay] = useState([]);
    const [loadLeaders, setLoadLeaders] = useState(false);
    const [loadSubmit, setLoadSubmit] = useState(false);

    async function fetchTeams(){
        try{
            setLoadLeaders(true);
            const response = await fetchProtectedData.post(`${URLS.users.getByAnyAccess}/${currentUser.businessId}`,{
                access: [ACCESS.team.leader]
            });
            const _leaders = response.data.filter(e => !leaderList.includes(e.username))
            setLeaders(_leaders)
            setLeadersDisplay(_leaders)
        }catch(err){
            console.error('error fetching leader');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadLeaders(false);
        }
    }
    useEffect(() => {
        fetchTeams();
    },[])
    async function handleSubmit() {
        try{
            setLoadSubmit(true);
            const reponse = await fetchProtectedData.post(URLS.teams.addLeaders,{
                manager: currentUser.userName,
                leaders: selectedLeaders.map(e => e.username)
            })
            toastSuccess('สำเร็จ','สร้างทีมสำเร็จ');
            onClose();
            onSaved();
        }catch(err){
            console.error('error add leader');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadSubmit(false);
        }
    }
    function handleSelectLeader(data){
        if(data === 'all'){
            if(leadersDisplay.every(m => selectedLeaders.includes(sm => m.username === sm.username))){
                setSelectedLeaders(p => lodash.differenceBy(p,leadersDisplay,'username'));
            }else{
                setSelectedLeaders(p => lodash.unionBy(p,leadersDisplay,'username'));
            }
        }else{
            const _data = Array.from(data);
            setSelectedLeaders(leaders.filter(sm => _data.includes(sm.username)));
        }
    }
    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-end mb-3">
                <div className="w-48">
                    <SearchBox data={leaders} onChange={(data) => setLeadersDisplay(data)} searchRules={['username','name','nickName','depName','roleName']} placeholder="ค้นหา" />
                </div>
            </div>
           <div className="w-full h-[500px]">
                <Table className="max-h-full overflow-auto scrollbar-hide"
                    aria-label="leaders table"
                    isHeaderSticky
                    removeWrapper
                    selectionMode="multiple"
                    selectedKeys={selectedLeaders.map(e => e.username)}
                    onSelectionChange={(data) => handleSelectLeader(data)}
                >
                    <TableHeader>
                        <TableColumn>
                            <div className="ms-10">ชื่อ</div>
                        </TableColumn>
                        <TableColumn>
                            <div className="text-center">ตำแหน่ง</div>
                        </TableColumn>
                    </TableHeader>
                    <TableBody items={leadersDisplay} isLoading={loadLeaders} emptyContent={'ไม่มีผู้ที่มีสิทธิ์เป็นหัวหน้าทีม'}>
                        {(user) => (
                            <TableRow key={user.username}>
                                <TableCell>
                                    <div className="">
                                        <User 
                                            name={user.username}
                                            description={`${user.name??''} ${user.nickName ? `(${user.nickName})` : ''}`}
                                            avatarProps={{
                                                name: getUserName(user.username),
                                                src: user.displayImgUrl,
                                                style: {backgroundColor: getProfileColor(user.username), color: 'white'}
                                            }}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col justify-center">
                                        <div className="text-center font-bold">{user.depName??'ไม่มีแผนก'}</div>
                                        <div className="text-center font-semibold text-gray-400 text-xs">{user.roleName??'ไม่มีตำแหน่ง'}</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
           </div>
           <div>
                <Button color="primary" isLoading={loadSubmit} isDisabled={selectedLeaders.length <= 0} onPress={handleSubmit}>เพิ่ม</Button>
           </div>
        </div>
    )
}

 