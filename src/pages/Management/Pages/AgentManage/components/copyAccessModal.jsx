import { toastError } from "@/component/Alert";
import { HFInfoFilled } from "@/component/Icons";
import { useAppContext } from "@/contexts/AppContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Button, Card, Checkbox, CircularProgress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "@/utils/fetchData";
import { URLS } from "@/config";
import { groupArray } from "@/utils/arrayFunc";

export default function CopyAccessModal({isCopyModalOpen, onClose, onCopy}) {
    const agentList = useAppContext().agent.agentList;
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [agentAccess, setAgentAccess] = useState([]);
    const [loadingAgentAccess, setLoadingAgentAccess] = useState(false);

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoData, setInfoData] = useState(null);
    
    async function fetchAgentAccess(controller) {
        try{
            setLoadingAgentAccess(true);
            const response = await fetchProtectedData.get(`${URLS.agent.getAgentAccess}/${selectedAgent}`,{signal: controller?.signal});
            setAgentAccess(response.data);
        }catch(err){
            if(err.name === 'CanceledError'){
                return;
            }
            console.error(err);
            toastError('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
        }finally{
            setLoadingAgentAccess(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        if(selectedAgent){
            fetchAgentAccess(controller);
        }
        return () => controller.abort();
    },[selectedAgent]);


    function handleClickInfo(acc){
        setInfoData({name: acc.accessName, des: acc.description, groupName: acc.groupName});
        setIsInfoOpen(true);
    }
    const handleSubmit = () => {
        onClose();
        onCopy(agentAccess);
        setAgentAccess([]);
        setSelectedAgent(null);
        setInfoData(null);
    }
    return (
        <Modal isOpen={isCopyModalOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader>คัดลอกสิทธิ์</ModalHeader>
                <ModalBody>
                    <div className="flex justify-end font-bold me-4">
                        {agentAccess.length} สิทธิ์
                    </div>
                    <div className="flex h-[550px] space-x-4">
                        <Card className="p-4 flex-1 h-full" shadow="sm">
                            <Table aria-label="agent-table"
                                className={`h-full overflow-auto scrollbar-hide`}
                                color="primary"
                                isHeaderSticky
                                removeWrapper
                                disallowEmptySelection
                                selectionMode="single"
                                onSelectionChange={(e) => setSelectedAgent(Array.from(e)[0])}
                                selectedKeys={selectedAgent ? [String(selectedAgent)] : []}
                            >
                                <TableHeader className="">
                                    <TableColumn>รหัสตัวแทน</TableColumn>
                                    <TableColumn>ชื่อตัวแทน</TableColumn>
                                </TableHeader>
                                <TableBody items={agentList} emptyContent={"No agents found."}>
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
                        </Card>
                        <Card className="p-4 flex-1 h-full" shadow="sm">
                            <div className="h-full overflow-auto scrollbar-hide">
                                {
                                    (loadingAgentAccess || loadingAgentAccess) ?
                                    <div className="flex justify-center mt-4"><CircularProgress aria-label="loading" /></div>
                                    :
                                    !selectedAgent ?
                                    <div className="font-semibold mt-4 text-center">กรุณาเลือกตัวแทนขาย</div> 
                                    :
                                    (agentAccess.length === 0) ?
                                    <div className="font-semibold mt-4 text-center">ตัวแทนนี้ไม่มีสิทธิ์อยู่</div>
                                    :
                                    Object.keys(groupArray(agentAccess,'groupName')).map((groupKey,groupKey_index) => {
                                        const accGroups = groupArray(agentAccess,'groupName');
                                        return(
                                            <div key={groupKey_index} className="text-sm">
                                                <div className="sticky top-0 z-10 py-1 font-semibold bg-primary-50 text-primary-700 text-center flex justify-between px-2">
                                                    <div className="flex-1">
                                                        {groupKey}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    {
                                                        accGroups[groupKey].map((acc, i) => {
                                                            return(
                                                                <div key={i} className={`flex items-center`}>
                                                                    <div className="size-full border-b mx-2 flex items-center">
                                                                        <div className={`flex cursor-pointer py-2 select-none text-start w-full`}>
                                                                            <div className="w-full text-center text-nowrap overflow-hidden text-ellipsis">{acc.accessName}</div>
                                                                        </div>
                                                                        <Button isIconOnly size="sm" radius="full" variant="light" className="text-blue-700 px-2 cursor-pointer" onPress={() => handleClickInfo(acc)}>
                                                                            <HFInfoFilled size={18} />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Card>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button color="primary" onPress={handleSubmit}>คัดลอก</Button>
                    </div>
                </ModalBody>
                <Modal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>รายละเอียดสิทธิ์</ModalHeader>
                                <ModalBody>
                                    <div className="font-semibold text-start">{`${infoData.groupName} - ${infoData.name}`}</div>
                                    <div className="border-4 rounded-lg p-4 mb-3 h-32 flex flex-col">
                                    {
                                        infoData ? 
                                        <>
                                            
                                            <textarea className=" w-full resize-none flex-1 bg-transparent" disabled={true} value={infoData.des}>
                                                
                                            </textarea>
                                        </>
                                        :
                                        <div>กรุณาเลือกสิทธิ์</div>
                                    }
                                    </div>

                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </ModalContent>
        </Modal>
    )
}