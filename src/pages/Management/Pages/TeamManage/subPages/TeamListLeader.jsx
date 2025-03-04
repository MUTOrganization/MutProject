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

export default function TeamListPageLeader(){
    const {currentUser, accessCheck} = useAppContext();
    const [teamList, setTeamList] = useState([]);
    const [loadTeamList, setLoadTeamList] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLeaderToDelete, setSelectedLeaderToDelete] = useState(null)
    const [selectedTeamToDelete, setSelectedTeamToDelete] = useState(null)
   
    const {screen} = useResponsive();

    async function fetchTeams(){
        try{
            setLoadTeamList(true)
            const response = await fetchProtectedData.get(`${URLS.teams.getByLeader}/${currentUser.userName}`);
            setTeamList(response.data);
            console.log(response.data);
        }catch(err){
            console.error('error fetching team');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadTeamList(false);
        }
    }
    useEffect(() => {
        fetchTeams();
    },[])

    function handleSearch(data){
        setTeamList(data)
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
            console.error('error delete teama');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }
    }
    return(
        <div className="py-3">
            <div className="md:flex justify-between px-4">
                <div className="flex items-center">
                    <div className="font-bold text-xl me-10">ทีมที่ดูแล {`(${teamList.length})`}</div>
                </div>

                <div className="max-w-52 max-md:mt-4">
                    <SearchBox data={teamList} onChange={(data) => handleSearch(data)} 
                        searchRules={['name']} 
                        placeholder={`ค้นหาชื่อทีม`} 
                        removeZeroScore={false}
                        valueState={searchText}
                        onTextChange={(text) => setSearchText(text)}
                    />
                </div>
                
            </div>
            <div className="mt-6 max-h-[600px] min-h-[200px] overflow-auto scrollbar-hide">
                {
                loadTeamList ?
                <div className="w-full flex justify-center mt-8"><CircularProgress /></div> :
                teamList.length <= 0 ?
                <div className="flex justify-center text-lg font-semibold mt-6">คุณไม่มีทีมที่ดูแล</div> :
                //ถ้ามีข้อมูล แต่ไม่ตรงกับที่ค้นหา
                teamList.every(t => t.score <= 0) ?
                <div className="flex justify-center text-lg font-semibold mt-6">ไม่พบทีมที่ค้นหา</div> :
                <div className="px-4 divide-y-1">
                    {
                        teamList.map((team) => {
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
        </div>
    )
}

 