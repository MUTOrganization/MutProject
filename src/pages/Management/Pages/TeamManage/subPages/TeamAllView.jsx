import { toastError } from "@/component/Alert";
import { useResponsive } from "@/component/Responsive";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import { Accordion, AccordionItem, Avatar, AvatarGroup, CircularProgress, Link, User } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import { getProfileColor, getUserName } from "../../../../../../utils/util";
import AgentSelector from "@/component/AgentSelector";
import { Tooltip } from "recharts";

export default function TeamAllView() {
    const {currentUser, accessCheck} = useAppContext();
    const selectedAgent = useAppContext().agent.selectedAgent;
    const [teamList, setTeamList] = useState([]);
    const [loadTeamList, setLoadTeamList] = useState(false);
    const [managerList, setManagerList] = useState({});

    console.log(managerList);

    const {screen} = useResponsive();

    async function fetchTeams(){
        try{
            setLoadTeamList(true)
            const response = await fetchProtectedData.get(`${URLS.teams.getTeamByAgent}`, {
                params: { businessId: selectedAgent.id }
            });
            setManagerList(response.data);
        }catch(err){
            console.error('error fetching teams');
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadTeamList(false);
        }
    }
    useEffect(() => {
        fetchTeams();
    },[selectedAgent])

    // function handleSearch(data){
    //     const groupTeams = groupArray(data, 'leader')
    //     setLeaders(p => p.map(leader => {
    //         leader.teams = groupTeams[leader.leader]??[];
    //         return leader;
    //     }))
    // }

    return (
        <div className="py-3">
            <div className="md:flex justify-between px-4">
                {/* <div className="max-w-52 max-md:mt-4">
                    <SearchBox data={teamList} onChange={(data) => handleSearch(data)} 
                        searchRules={['leader','name']} 
                        placeholder={`ค้นหาชื่อทีม หรือหัวหน้าทีม`} 
                        removeZeroScore={false}
                        valueState={searchText}
                        onTextChange={(text) => setSearchText(text)}
                    />
                </div> */}
                {
                    currentUser.businessId === 1 &&
                    <AgentSelector/>
                }
            </div>
            <div className="mt-6 max-h-[450px] min-h-[100px] overflow-auto scrollbar-hide">
                {
                loadTeamList ?
                <div className="w-full flex justify-center mt-8"><CircularProgress /></div> :
                Object.keys(managerList).length <= 0 ?
                <div className="flex justify-center text-lg font-semibold mt-6">ไม่มีข้อมูลทีม</div> :
                <Accordion aria-label="manager list" selectionMode="multiple" showDivider={false} 
                >
                    {
                        Object.entries(managerList).map(([managerKey, manager], i) => {
                            return(
                                <AccordionItem 
                                    key={managerKey}
                                    classNames={{
                                        base: 'mb-2 rounded-lg',
                                        trigger: ' px-2 hover:bg-default-100 rounded-lg py-2 bg-gray-50 shadow-md transition-colors duration-300',
                                        indicator: 'text-2xl',
                                    }}
                                    title={
                                        <div className="flex items-center text-sm lg:text-base">
                                            <div className="flex overflow-hidden text-ellipsis text-nowrap flex-1 items-center border-0">
                                                <div className="me-2">ผู้จัดการ:</div>
                                                <div className="font-bold">
                                                    <User 
                                                        name={manager.username} 
                                                        description={`${manager ? `${manager.name??''} ${manager.nickName ? `(${manager.nickName})` : ''}` : ''}`} 
                                                        avatarProps={{
                                                            name: getUserName(manager.username),
                                                            src: manager?.displayImgUrl,
                                                            style: {backgroundColor: getProfileColor(manager.username), color:'white'}
                                                        }}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    
                                >
                                    <div className="px-4">
                                        <Accordion key={managerKey} aria-label="leader list" selectionMode="multiple" showDivider={false}>
                                            {Object.entries(manager.leaders).map(([leaderKey, leader]) => {
                                                return(
                                                    <AccordionItem 
                                                        key={leaderKey}
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
                                                                            name={leader.username} 
                                                                            description={`${leader ? `${leader.name??''} ${leader.nickName ? `(${leader.nickName})` : ''}` : ''}`} 
                                                                            avatarProps={{
                                                                                name: getUserName(leader.username),
                                                                                src: leader?.displayImgUrl,
                                                                                style: {backgroundColor: getProfileColor(leader.username), color:'white'}
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    >
                                                        {
                                                            Object.entries(leader.teams).map(([teamKey, team]) => {
                                                                return(
                                                                    <div key={teamKey} className="flex items-center justify-between text-sm lg:text-base py-2 hover:bg-gray-100 rounded-lg px-2 transition-colors duration-300">
                                                                        <div className="flex flex-1 ">
                                                                            <div className="w-1/2 flex items-center">
                                                                                <Link href={"TeamManage/"+team.id} underline="hover">ทีม {team.name}</Link>
                                                                            </div>
                                                                            <div className="w-1/2 flex justify-start items-center space-x-5">
                                                                                <div className="max-md:hidden font-semibold">สมาชิก {Object.keys(team.members).length} คน</div>
                                                                                <AvatarGroup aria-label="asas" size={screen === 'sm' ? 'sm' : 'md'}>
                                                                                    {Object.entries(team.members).map(([userKey,user]) => (
                                                                                        //<Tooltip key={user.username} content={<div className="text-nowrap"><div className="font-semibold">{user.username}</div><div className="text-gray-500">{user.name}</div></div>}>
                                                                                            <Avatar name={getUserName(user.username)} src={user.displayImgUrl} 
                                                                                                style={{backgroundColor: getProfileColor(user.username), color: 'white'}}
                                                                                                
                                                                                            />
                                                                                        //</Tooltip>
                                                                                    ))}
                                                                                </AvatarGroup>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </AccordionItem>
                                                )
                                            })}
                                        </Accordion>
                                    </div>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
                }
                
            </div>
        </div>
    )
}
