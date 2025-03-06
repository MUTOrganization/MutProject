import { BreadcrumbItem, Breadcrumbs, Button, Card, CircularProgress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import DefaultLayout from "../../../../../layouts/default";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { URLS } from "../../../../../config";
import { useAppContext } from "../../../../../contexts/AppContext";
import SearchBox from "../../../../../component/SearchBox";
import { getProfileColor, getUserName } from "../../../../../../utils/util";
import { CustomFormatDate } from "../../../../../../utils/FormatDate";
import { moveToLastOfArray } from "../../../../../../utils/arrayFunc";
import lodash from "lodash";
import { AlertQuestion, toastError, toastSuccess } from "../../../../../component/Alert";

export default function TeamMemberManage(){
    const params = useParams();
    const {currentUser} = useAppContext()
    const [currentTeam, setCurrentTeam] = useState(null);
    const [notMembers, setNotMembers] = useState([])
    const [notMembersDisplay, setNotMembersDisplay] = useState([])
    const [members, setMembers] = useState([])
    const [membersDisplay, setMembersDisplay] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedNotMembers, setSelectedNotMembers] = useState([]);
    const [loadMembers, setLoadMembers] = useState(false);
    
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);

    const [searchText1, setSearchText1] = useState('');
    const [searchText2, setSearchText2] = useState('');

    const [loadSubmit, setLoadSubmit] = useState(false)

    async function fetchMembers() {
        setLoadMembers(true);
        try{
            const [
                memberRes,
                outSiderRes
            ] = await Promise.all([
                fetchProtectedData.get(`${URLS.teams.getMembers}/${params.teamId}`),
                fetchProtectedData.get(`${URLS.teams.getNotInTeamUsers}/${currentUser.businessId}/${params.teamId}`)
            ])
            setMembers(memberRes.data)
            setMembersDisplay(memberRes.data)
            setNotMembers(outSiderRes.data)
            setNotMembersDisplay(outSiderRes.data) 
        }catch(err){
            console.error('erorr fetching members');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadMembers(false);
        }

    }
    async function fetchTeamData() {
        try{
            const [
                teamRes,
            ] = await Promise.all([
                fetchProtectedData.get(`${URLS.teams.getById}/${params.teamId}`),
            ])
            setCurrentTeam(teamRes.data)
            
        }catch(err){
            console.error('error fetching teamData');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
    useEffect(() => {
        fetchTeamData();
        fetchMembers();
    },[])

    function handleSelectMember(data){
        if(data === 'all'){
            if(membersDisplay.every(m => selectedMembers.some(sm => m.username === sm.username))){
                setSelectedMembers(p => lodash.differenceBy(p,membersDisplay,'username'));
            }else{
                setSelectedMembers(p => lodash.unionBy(p,membersDisplay,'username'));
            }
        }else{
            const _data = Array.from(data);
            setSelectedMembers(members.filter(sm => _data.includes(sm.username)));
        }
    }
    function handleSelectNotMember(data){
        if(data === 'all'){
            if(notMembersDisplay.every(m => selectedNotMembers.some(sm => m.username === sm.username))){
                setSelectedNotMembers(p => lodash.differenceBy(p,notMembersDisplay,'username'));
            }else{
                setSelectedNotMembers(p => lodash.unionBy(p,notMembersDisplay,'username'));
            }
        }else{
            const _data = Array.from(data);
            setSelectedNotMembers(notMembers.filter(sm => _data.includes(sm.username)));
        }
    }
    function clearFilter(){
        setSearchText1('');
        setSearchText2('');
    }
    async function submitAddMembers(){
        try{
            setLoadSubmit(true)
            const response = await fetchProtectedData.post(URLS.teams.addMembers,{
                teamId: currentTeam.id,
                usernames: selectedNotMembers.map(e => e.username),
                createBy: currentUser.userName
            })
            if(response.data.error) throw new Error(response.data.error);
            toastSuccess('เพิ่มสมาชิกสำเร็จ','');
            setSelectedNotMembers([]);
            fetchMembers();
            setShowAddMemberModal(false);
            clearFilter();
        }catch(err){
            console.error('error add members');
            toastError('เกิดข้อผิดพลาด','เกิดข้อผิดพลาดขณะเพิ่มสมาชิก');
        }finally{
            setLoadSubmit(false)
        }
    }
    async function submitRemoveMembers(){
        try{
            setLoadSubmit(true)
            const response = await fetchProtectedData.put(URLS.teams.removeMembers,{
                teamId: currentTeam.id,
                usernames: selectedMembers.map(e => e.username),
            })
            if(response.data.error) throw new Error(response.data.error);
            toastSuccess('สำเร็จ','ลบสมาชิกสำเร็จ');
            setSelectedMembers([]);
            fetchMembers();
            setShowRemoveMemberModal(false);
            clearFilter();
        }catch(err){
            console.error('error remove members');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadSubmit(false)
        }
    }

    return (
        <div>
            <section title={`ทีม ${currentTeam?.name??''}`}>
                <div>
                    <Breadcrumbs>
                        <BreadcrumbItem href="management">จัดการทีม</BreadcrumbItem>
                        <BreadcrumbItem href={`teamManage/${currentTeam?.id}`}>ทีม {currentTeam?.name??''}</BreadcrumbItem>
                        <BreadcrumbItem>จัดการสมาชิก</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <Card className="flex mt-4 max-h-[calc(100vh-150px)] max-w-full bg-transparent overflow-hidden" shadow="none">
                    <div className="lg:flex max-lg:space-y-10 lg:space-x-6 h-full scrollbar-hide overflow-auto">
                        <div className="w-full">
                            <Card className="p-3" shadow="sm">
                                <div className="text-center text-lg font-bold text-primary-500">สมาชิกในทีม</div>
                                <div className="my-4 flex justify-between items-end">
                                    <div className="w-52">
                                        <SearchBox data={members} searchRules={['username','name','nickName','depName','roleName']} 
                                            onChange={(data) => setMembersDisplay(data)} placeholder="ค้นหา" valueState={searchText1} onTextChange={(text) => setSearchText1(text)} />
                                    </div>
                                    <div className="h-16">
                                        {
                                            selectedMembers.length > 0 &&
                                            <div>
                                                <div className="text-center">เลือกแล้ว <span className="font-bold">{`(${selectedMembers.length})`}</span></div>
                                                <div className="text-center mt-1">
                                                    <Button size="sm" color="danger" onPress={() => setShowRemoveMemberModal(true)}
                                                        isLoading={loadSubmit}      
                                                    >ลบออกจากทีม</Button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <Table
                                        aria-label="member table"
                                        className="h-[600px] overflow-auto scrollbar-hide"
                                        removeWrapper
                                        isHeaderSticky
                                        selectionMode="multiple"
                                        onSelectionChange={handleSelectMember}
                                        selectedKeys={selectedMembers.map(e => e.username)}
                                    >
                                        <TableHeader>
                                            <TableColumn>ชื่อ</TableColumn>
                                            <TableColumn><div className="text-center">ตำแหน่ง</div></TableColumn>
                                            <TableColumn>วันที่เข้าทีม</TableColumn>
                                        </TableHeader>
                                        <TableBody items={membersDisplay.filter(e => e.username !== currentTeam.leader)} isLoading={loadMembers} loadingContent={<CircularProgress/>}>
                                            {user => (
                                                <TableRow key={user.username}>
                                                    <TableCell>
                                                        <div>
                                                            <User 
                                                                name={user.username}
                                                                description={`${user.name} ${user.nickName ? `(${user.nickName})` : ''}`}
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
                                                            <div className="text-center font-bold">{user.depName}</div>
                                                            <div className="text-center font-semibold text-gray-400 text-xs">{user.roleName}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{CustomFormatDate(user.joinDate)}</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        </div>
                        <div className="w-full">
                            <Card className="p-3" shadow="sm">
                            <div className="text-center text-lg font-bold text-primary-500">บุคลากรอื่นๆ</div>
                                <div className="my-4 flex justify-between items-end">
                                    <div className="w-52">
                                        <SearchBox data={notMembers} searchRules={['username','name','nickName','depName','roleName']} 
                                            onChange={(data) => setNotMembersDisplay(data)} placeholder="ค้นหา" valueState={searchText2} onTextChange={(text) => setSearchText2(text)}
                                        />
                                    </div>
                                    <div className="h-16">
                                        {
                                            selectedNotMembers.length > 0 &&
                                            <div>
                                                <div className="text-center">เลือกแล้ว <span className="font-bold">{`(${selectedNotMembers.length})`}</span></div>
                                                <div className="text-center mt-1 ">
                                                    <Button size="sm" color="success" className="text-white" onPress={() => setShowAddMemberModal(true)}
                                                        isLoading={loadSubmit}    
                                                    >นำเข้าทีม</Button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <Table
                                        aria-label="not member table"
                                        className="h-[600px] overflow-auto scrollbar-hide"
                                        removeWrapper
                                        isHeaderSticky
                                        selectionMode="multiple"
                                        onSelectionChange={handleSelectNotMember}
                                        selectedKeys={selectedNotMembers.map(e => e.username)}
                                    >
                                        <TableHeader>
                                            <TableColumn>ชื่อ</TableColumn>
                                            <TableColumn><div className="text-center">ตำแหน่ง</div></TableColumn>
                                        </TableHeader>
                                        <TableBody items={moveToLastOfArray(notMembersDisplay, e => !e.depId)} isLoading={loadMembers} loadingContent={<CircularProgress/>}>
                                            {user => (
                                                <TableRow key={user.username}>
                                                    <TableCell>
                                                        <div>
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
                            </Card>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Alert Confirm DeleteTeam */}
            <AlertQuestion 
                isOpen={showAddMemberModal} 
                onClose={() => setShowAddMemberModal(false)} 
                title={'เพิ่มสมาชิก'}
                isDismissable={true}
                onConfirm={submitAddMembers}
                color={'success'}
                icon="question"
            >
                <div className="text-center">ต้องการเพิ่มสมาชิกหรือไม่</div>
            </AlertQuestion>

            {/* Alert Confirm DeleteTeam */}
            <AlertQuestion 
                isOpen={showRemoveMemberModal} 
                onClose={() => setShowRemoveMemberModal(false)} 
                title={'ลบสมาชิก'}
                isDismissable={true}
                onConfirm={submitRemoveMembers}
                color={'danger'}
                icon="warning"
            >
                <div className="text-center">ต้องการลบสมาชิกหรือไม่</div>
            </AlertQuestion>
        </div>
    )
}