import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, Radio, RadioGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { HfGroups, HfPerson } from "@/component/Icons";
import SearchBox from "@/component/SearchBox";
import AccessManageBox from "../components/AccessManageBox";
import { URLS } from "@/config";
import { toastError, toastSuccess } from "@/component/Alert";
import fetchProtectedData from "@/utils/fetchData";

export default function AgentAccessManagePage() {
    const { currentUser, agent } = useAppContext();
    const [displayAgents, setDisplayAgents] = useState([]);

    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedAgents, setSelectedAgents] = useState([]);

    const [loadSubmit, setLoadSubmit] = useState(false);

    const [mode, setMode] = useState('0');

    useEffect(() => {
        setDisplayAgents(agent.agentList);
    }, [agent.agentList])

    function handleSelectAgent1(id) {
        if (selectedAgent?.id == id) return;
        const _agent = agent.agentList.find(e => e.id == id)
        if (_agent) {
            setSelectedAgent(_agent);
        }
    }
    function handleSelectAgent2(ids) {
        if (JSON.stringify(ids) === JSON.stringify(['a', 'l', 'l'])) {
            setSelectedAgents([...displayAgents]);
            return;
        }
        setSelectedAgents(ids.map(id => agent.agentList.find(e => e.id == id)));
    }

    async function handleSubmit(_selectedAccess) {
        if (mode == '0' && !selectedAgent) {
            toastError('ไม่สามารถแก้ไขสิทธิ์', 'กรุณาเลือกตัวแทน');
            return;
        }
        if (mode == '1' && selectedAgents.length <= 0) {
            toastError('ไม่สามารถแก้ไขสิทธิ์', 'กรุณาเลือกตัวแทน');
            return;
        }
        try {
            setLoadSubmit(true);
            const response = await fetchProtectedData.post(URLS.agent.editAccess, {
                agents: mode == '0' ? [selectedAgent.id] : selectedAgents.map(e => e.id),
                access: _selectedAccess.map(e => e.accessCode),
                createBy: currentUser.userName
            })
            toastSuccess('สำเร็จ', 'แก้ไขสิทธิ์สำเร็จ');
            if (mode == '1') {
                setMode('0');
                setSelectedAgents([]);
            }
            return true

        } catch (err) {
            console.error('error save agent access');
            toastError('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้ง');
            return false
        } finally {
            setLoadSubmit(false)
        }

    }
    return (
        <div className="w-full h-full">
            <div className="size-full xl:flex overflow-auto">
                <div className="w-full max-xl:mb-10 xl:max-w-[450px] pb-4">
                    <div className="w-full flex justify-between px-4">
                        <div className="flex mb-3">
                            <div className="">
                                <SearchBox
                                    size="sm"
                                    data={agent.agentList}
                                    searchRules={['code', 'name']}
                                    placeholder="ค้นหาตัวแทน"
                                    onChange={(data) => setDisplayAgents(data)}
                                />
                            </div>
                        </div>
                        <div className="pb-4">
                            <RadioGroup
                                className=""
                                color="primary"
                                value={mode}
                                orientation="horizontal"
                                onChange={(e) => setMode(e.target.value)}
                            >
                                <div className="w-full flex justify-start space-x-10">
                                    <div className="">
                                        {/* แก้ไขสิทธิ์ตัวแทน */}
                                        <Radio value='0' className=""><HfPerson /></Radio>
                                    </div>
                                    <div className="">
                                        {/* แก้ไขสิทธิ์ให้หลายตัวแทน */}
                                        <Radio value='1'><HfGroups /></Radio>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <Card className="m-4 p-4" shadow="sm">
                        <Table aria-label="agent-table"
                            className={`${mode == '1' && 'hidden'} h-[550px] overflow-auto scrollbar-hide`}
                            color="primary"
                            isHeaderSticky
                            removeWrapper
                            selectionMode="single"
                            onSelectionChange={(e) => handleSelectAgent1(Array.from(e)[0])}
                            selectedKeys={[selectedAgent?.id.toString()]}
                        >
                            <TableHeader className="">
                                <TableColumn>รหัสตัวแทน</TableColumn>
                                <TableColumn>ชื่อตัวแทน</TableColumn>
                            </TableHeader>
                            <TableBody items={displayAgents.filter(e => e.id != 1)} emptyContent={"No agents found."}>
                                {(agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell>
                                            <div className="py-2">
                                                {agent.code}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="my-2">
                                                {agent.name}
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                )}
                            </TableBody>
                        </Table>

                        <Table aria-label="agent-table"
                            className={`${mode == '0' && 'hidden'} h-[550px] overflow-auto scrollbar-hide`}
                            color="primary"
                            isHeaderSticky
                            removeWrapper
                            selectionMode="multiple"
                            onSelectionChange={(e) => handleSelectAgent2(Array.from(e))}
                            selectedKeys={selectedAgents.filter(e => e).map(e => e.id.toString())}

                        >
                            <TableHeader className="">
                                <TableColumn>รหัสตัวแทน</TableColumn>
                                <TableColumn>ชื่อตัวแทน</TableColumn>
                            </TableHeader>
                            <TableBody items={displayAgents.filter(e => e.id != 1)} emptyContent={"ไม่พบรายการ"}>
                                {(agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell>{agent.code}</TableCell>
                                        <TableCell>{agent.name}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
                <div className="flex-1 h-[600px] overflow-auto pb-4">
                    <AccessManageBox agent={selectedAgent} mode={mode} onSave={handleSubmit} loadSubmit={loadSubmit} />
                </div>
            </div>
        </div>
    )
}