import agentService from "@/services/agentService";
import { Button, Card, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { DeleteIcon, EditIcon, MessageCircleQuestion, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import AddAgentModal from "../components/AddAgentModal";
import { SearchIcon } from "@/component/Icons";
import EditAgentModal from "../components/EditAgentModal";
import DelAgentModal from "../components/DelAgentModal";
import { formatDateThai } from "@/utils/dateUtils";

function AgentPage() {

    //* List
    const [agentList, setAgentList] = useState([]);
    const [agentTmp, setAgentTmp] = useState([]);

    //* Loading
    const [isLoading, setIsLoading] = useState(false);

    //*Modal
    const [openAddAgent, setOpenAddAgent] = useState(false);
    const [openEditAgent, setOpenEditAgent] = useState(false);
    const [openDeleteAgent, setOpenDeleteAgent] = useState(false);

    //* ตัวแทนที่เลือก
    const [selectedAgent, setSelectedAgent] = useState(null);

    const [filterStatus, setFilterStatus] = useState('active');

    const statusText = [
        { key: 'all', text: 'ทั้งหมด' },
        { key: 'active', text: 'ใช้งานอยู่' },
        { key: 'inactive', text: 'ปิดใช้งาน' }
    ]



    //* open modal
    const handleOpenAddAgent = () => {
        setOpenAddAgent(true)
    }

    //* close modal
    //#region
    const handleCloseAddAgent = () => {
        setOpenAddAgent(false)
    }

    const handleCloseEditAgent = () => {
        setOpenEditAgent(false)
        setSelectedAgent(null)
    }

    const handleCloseDeleteAgent = () => {
        setOpenDeleteAgent(false)
        setSelectedAgent(null)
    }
    //#endregion



    //* แก้ไขตัวแทน
    const handleEditAgent = (item) => {
        setOpenEditAgent(true)
        setSelectedAgent(item)
    }

    //* ลบตัวแทน
    const handleDeleteAgent = (item) => {
        setOpenDeleteAgent(true)
        setSelectedAgent(item)
    }

    //* ค้นหาตัวแทน
    const handleSearchAgent = (text) => {
        const result = agentTmp.filter((item) => {

            const searchText = text.toLowerCase().trim()
            const itemCode = item.code.toLowerCase().trim()
            const itemName = item.name.toLowerCase().trim()


            return itemCode.includes(searchText) || itemName.includes(searchText)
        })
        setAgentList(result)
    }

    //*ดึงรายการข้อมูลตัวแทน
    const fetchAgentList = async () => {
        setIsLoading(true)
        await agentService.getAgent('A').then((res) => {
            setAgentList(res)
            setAgentTmp(res)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }


    useEffect(() => {
        fetchAgentList()
    }, [])


    return (
        <div className="w-full h-full  bg-white rounded-lg shadow-sm">
            {/* ส่วนหัว */}
            <h2 className="text-2xl font-semibold text-gray-800">จัดการตัวแทน</h2>
            <div className="m-3 flex items-center justify-between mb-6 max-md:flex-col max-md:gap-4">
                {/* กล่องซ้าย */}
                <div className="flex items-center max-md:w-full max-md:flex-col   gap-4">
                    {/* ช่องค้นหา */}
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="ค้นหาตัวแทน"
                            variant="bordered"
                            startContent={<SearchIcon className="w-5 h-5 text-gray-400" />}
                            labelPlacement="inside"
                            size="sm"
                            aria-label="Search Agent"
                            className="w-[200px] transition-all duration-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary"
                            onChange={(e) => handleSearchAgent(e.target.value)}
                        />

                        <Tooltip
                            content={
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm">ค้นหาตัวแทนตามชื่อหรือรหัสตัวแทน</p>
                                    <p className="text-sm">ตัวอย่าง : HF001 หรือ Hopeful Wellness</p>
                                </div>
                            }
                            placement="bottom-start"
                            color="success"
                            className="text-white">
                            <MessageCircleQuestion className="w-5 h-5 text-primary" />
                        </Tooltip>
                    </div>

                    {/* ช่องค้นหาสถานะ */}
                    <Select
                        aria-label="Status"
                        size="sm"
                        label="สถานะการใช้งาน"
                        labelPlacement="inside"
                        variant="bordered"
                        className="w-[200px]"
                        value={filterStatus}
                        defaultSelectedKeys={['active']}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        {statusText.map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                                {item.text}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* ปุ่มเพิ่มตัวแทน */}
                <Button
                    color="primary"
                    variant="solid"
                    size="md"
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={handleOpenAddAgent}
                >
                    เพิ่มตัวแทน
                </Button>
            </div>

            {/* หน้าเพิ่มตัวแทน */}
            {openAddAgent && (
                <AddAgentModal
                    isOpen={openAddAgent}
                    onClose={handleCloseAddAgent}
                    fetchAgentList={fetchAgentList}
                />
            )}

            {/* แก้ไขตัวแทน */}
            {openEditAgent && (
                <EditAgentModal
                    isOpen={openEditAgent}
                    onClose={handleCloseEditAgent}
                    selectedAgent={selectedAgent}
                    fetchAgentList={fetchAgentList}
                />
            )}

            {/* ลบตัวแทน */}
            {openDeleteAgent && (
                <DelAgentModal
                    isOpen={openDeleteAgent}
                    onClose={handleCloseDeleteAgent}
                    selectedAgent={selectedAgent}
                    fetchAgentList={fetchAgentList}
                />
            )}

            {/* ส่วนของรายการตัวแทน */}
            <Card className="w-full max-h-[600px] overflow-y-auto scrollbar-hide" shadow="none">
                <Table
                    removeWrapper
                    isStriped
                    isHeaderSticky
                    aria-label="Agent List"
                    align="center"
                    className="w-full h-full select-none"
                    classNames={{
                        th: "font-semibold text-md",
                        td: "text-gray-600 text-sm py-3",
                        tr: "hover:bg-gray-50 transition-colors duration-200"
                    }}
                >
                    <TableHeader>
                        <TableColumn>รหัสตัวแทน</TableColumn>
                        <TableColumn>ชื่อตัวแทน</TableColumn>
                        <TableColumn>สถานะ</TableColumn>
                        <TableColumn>วันที่สร้าง</TableColumn>
                        <TableColumn>วันที่แก้ไข</TableColumn>
                        <TableColumn></TableColumn>
                    </TableHeader>
                    <TableBody
                        items={agentList.filter(x => {
                            const status = x.status ? 'active' : 'inactive';
                            if (filterStatus === 'all') return true;
                            return status === filterStatus;
                        })}
                        isLoading={isLoading}
                        emptyContent={
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <p className="text-lg">ไม่พบข้อมูล</p>
                                <Button
                                    color="primary"
                                    variant="solid"
                                    size="md"
                                    startContent={<PlusIcon className="w-5 h-5" />}
                                    onPress={handleOpenAddAgent}
                                >
                                    เพิ่มตัวแทน
                                </Button>
                            </div>
                        }
                    >
                        {(item) => (
                            <TableRow key={item.agentId}>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.status ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 items-center text-sm">
                                        <p>{formatDateThai(item.createdDate, 'date')}</p>
                                        <p className="text-gray-500">{formatDateThai(item.createdDate, 'time')}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                <div className="flex flex-col gap-1 items-center text-sm">
                                    <p>{formatDateThai(item.updatedDate, 'date')}</p>
                                    <p className="text-gray-500">{formatDateThai(item.updatedDate, 'time')}</p>
                                </div>
                                </TableCell>
                                <TableCell>
                                    <Button size="sm" isIconOnly variant="light" color="primary" className="hover:bg-primary-50" onPress={() => handleEditAgent(item)}>
                                        <EditIcon className="w-4 h-4" />
                                    </Button>
                                    {item.status && (
                                        <Button size="sm" isIconOnly variant="light" color="danger" className="hover:bg-danger-50" onPress={() => handleDeleteAgent(item)}>
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default AgentPage; 