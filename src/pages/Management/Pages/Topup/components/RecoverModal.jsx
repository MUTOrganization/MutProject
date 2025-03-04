import { ConfirmCancelButtons } from "@/component/Buttons";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Avatar, AvatarGroup, Chip, Input, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import fetchProtectedData from "../../../../../../utils/fetchData";
import UserProfileAvatar from "@/component/UserProfileAvatar";
import { CompareStatus } from "../../../../../../utils/CompareStatus";
import { toastError, toastSuccess } from "@/component/Alert";
import { SearchIcon } from "@/component/Icons";

function RecoverModal({ isOpen, closed, isFetching }) {
    const { currentUser } = useAppContext();

    //State list data api
    const [listEmp, setListEmp] = useState([]);
    const [listDep, setListDep] = useState([]);
    const [listRole, setListRole] = useState([]);

    //State select type
    const [type, setType] = useState('1');

    //State select employee
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [selectedDep, setSelectedDep] = useState(new Set([]));
    const [selectedRole, setSelectedRole] = useState(new Set([]));

    //State input amount
    const [amount, setAmount] = useState('0.00');

    //State loading
    const [loadingEmp, setLoadingEmp] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // เพิ่ม state สำหรับ search
    const [searchQuery, setSearchQuery] = useState("");

    //func fetch data api
    const fetchListEmp = async () => {
        setLoadingEmp(true);
        try {
            const [empRes, depRes, roleRes] = await Promise.all([
                fetchProtectedData.get(URLS.users.getAll, {
                    params: {
                        businessId: currentUser.businessId
                    }
                }),
                fetchProtectedData.get(URLS.departments.getall, {
                    params: {
                        businessId: currentUser.businessId
                    }
                }),
                fetchProtectedData.get(URLS.roles.getall, {
                    params: {
                        businessId: currentUser.businessId
                    }
                })
            ]);

            setListEmp(empRes.data);
            setListDep(depRes.data);
            setListRole(roleRes.data);
        } catch (err) {
            toastError("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลได้");
        } finally {
            setLoadingEmp(false);
        }
    }

    const fetchSetTopUpTransaction = async () => {
        await fetchProtectedData.post(URLS.wallet.setTopUpTransaction, {
            username: selectedEmp,
            amount: Number(amount.replace(/,/g, '')),
            confirmBy: currentUser.userName,
            businessId: currentUser.businessId
        }).then(res => {
            if (res.status === 200) {
                toastSuccess("ดำเนินการสำเร็จ", "ระบบเดินรายการสำเร็จเรียบร้อยแล้ว");
            }
        }).catch(err => {
            toastError("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลพนักงานได้");
        });
    };

    const fetchSetBalance = async () => {
        await fetchProtectedData.post(URLS.wallet.setBalance, {
            username: selectedEmp,
            amount: Number(amount.replace(/,/g, '')),
            updateBy: currentUser.userName
        }).then(res => {
            if (res.status === 200) {
                toastSuccess("ดำเนินการสำเร็จ", "ระบบเดินรายการสำเร็จเรียบร้อยแล้ว");
            }
        }).catch(err => {
            toastError("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลพนักงานได้");
        });
    };

    const fetchSetFineLogs = async () => {
        await fetchProtectedData.post(URLS.wallet.setFineLogs, {
            businessId: currentUser.businessId,
            finedUser: selectedEmp,
            amount: Number(amount.replace(/,/g, '')),
            createBy: currentUser.userName
        }).then(res => {
            if (res.status === 200) {
                toastSuccess("ดำเนินการสำเร็จ", "ระบบเดินรายการสำเร็จเรียบร้อยแล้ว");
            }
        }).catch(err => {
            toastError("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลพนักงานได้");
        });
    };

    const handleSubmit = async () => {
        if (selectedEmp.length === 0) {
            toastError('กรุณาเลือกพนักงาน', 'กรุณาเลือกพนักงานอย่างน้อย 1 คน');
            return;
        }

        setLoadingSubmit(true);
        try {
            if (type === '1') {
                await fetchSetBalance();
            } else if (type === '2') {
                await fetchSetTopUpTransaction();
            } else if (type === '3') {
                await fetchSetFineLogs();
            }
            isFetching(true);
            setLoadingSubmit(false);
            setSelectedEmp([]);
            setAmount('0.00');
            setType('1');
            closed(true);
        } catch (err) {
            setLoadingSubmit(false);
            toastError('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    }

    const handleClose = () => {
        setSelectedEmp([]);
        setAmount('0.00');
        setType('1');
        closed(true);
    }

    const handleSelectEmp = (e) => {
        if (e === 'all') {
            setSelectedEmp(filteredEmployees().map(item => item.username));
        }
        else {
            setSelectedEmp(Array.from(e));
        }
    }


    const handleSelectDep = (keys) => {
        const keysArray = Array.from(keys);
        if (keysArray.includes('all')) {
            if (selectedDep.has('all')) {
                setSelectedDep(new Set([]));
            } else {
                setSelectedDep(new Set(['all', ...listDep.map(dep => dep.id.toString())]));
            }
        } else {
            setSelectedDep(keys);
        }
    };

    const handleSelectRole = (keys) => {
        const keysArray = Array.from(keys);
        if (keysArray.includes('all')) {
            if (selectedRole.has('all')) {
                setSelectedRole(new Set([]));
            } else {
                setSelectedRole(new Set(['all', ...listRole.map(role => role.id.toString())]));
            }
        } else {
            setSelectedRole(keys);
        }
    };

    const filteredEmployees = () => {
        return listEmp.filter(emp => {
            // กรองตาม department และ role
            const depMatch = selectedDep.has('all') || selectedDep.size === 0 || selectedDep.has(emp.depId?.toString());
            const roleMatch = selectedRole.has('all') || selectedRole.size === 0 || selectedRole.has(emp.roleId?.toString());

            // กรองตาม search query
            const query = searchQuery.toLowerCase();
            const searchMatch = query === '' ||
                emp.username?.toLowerCase().includes(query) ||
                emp.name?.toLowerCase().includes(query) ||
                emp.nickName?.toLowerCase().includes(query) ||
                emp.depName?.toLowerCase().includes(query) ||
                emp.roleName?.toLowerCase().includes(query);

            return depMatch && roleMatch && searchMatch;
        });
    }

    useEffect(() => {
        if (isOpen) {
            fetchListEmp();
            setType('1');
        }
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="2xl" className="min-h-[800px]">
            <ModalContent>
                <ModalHeader className="flex text-lg font-bold text-primary justify-center items-center bg-blue-100">
                    <h2>Recover data</h2>
                </ModalHeader>
                <ModalBody>
                    <div className="w-full p-2 space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-nowrap">ประเภทรายการ</p>
                            <Select
                                label="ประเภทรายการ"
                                placeholder="ประเภทรายการ"
                                labelPlacement="inside"
                                className="max-w-xs"
                                variant="bordered"
                                disallowEmptySelection
                                defaultSelectedKeys={['1']}
                                onChange={e => setType(e.target.value)}
                            >
                                <SelectItem key="1" value="1">ยอดคงเหลือ</SelectItem>
                                <SelectItem key="2" value="2">ยอดสะสม</SelectItem>
                                <SelectItem key="3" value="3">ยอดหักค่าปรับ</SelectItem>
                            </Select>
                        </div>

                        <div className="space-x-2 flex">
                            <Select
                                label="แผนก"
                                placeholder="เลือกแผนก"
                                selectionMode="multiple"
                                selectedKeys={selectedDep}
                                onSelectionChange={handleSelectDep}
                                variant="bordered"
                                className="w-[300px]"
                                isLoading={loadingEmp}
                            >
                                <SelectItem key="all" value="all">
                                    ทั้งหมด
                                </SelectItem>
                                {listDep.map((dep) => (
                                    <SelectItem key={dep.id.toString()} value={dep.id} endContent={dep.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>
                                        {dep.departmentName}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Select
                                label="ตำแหน่ง"
                                placeholder="เลือกตำแหน่ง"
                                selectionMode="multiple"
                                selectedKeys={selectedRole}
                                onSelectionChange={handleSelectRole}
                                variant="bordered"
                                className="w-[300px]"
                                isLoading={loadingEmp}
                            >
                                <SelectItem key="all" value="all">
                                    ทั้งหมด
                                </SelectItem>
                                {listRole.map((role) => (
                                    <SelectItem key={role.id.toString()} value={role.id} endContent={role.isHq === 1 && <Chip size="sm" variant="flat" color="success">สำนักงานใหญ่</Chip>}>
                                        {role.roleName}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-nowrap">เลือกพนักงาน</p>
                                <Input
                                    type="text"
                                    placeholder="ค้นหาพนักงาน..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-[300px]"
                                    size="sm"
                                    variant="bordered"
                                    startContent={<SearchIcon />}

                                />
                            </div>
                            <div className="min-h-[400px]  max-h-[400px] overflow-auto scrollbar-hide">
                                <Table
                                    selectionMode="multiple"
                                    selectionBehavior="toggle"
                                    color="primary"
                                    removeWrapper
                                    isHeaderSticky
                                    aria-label="Select employee"
                                    onSelectionChange={handleSelectEmp}
                                >
                                    <TableHeader>
                                        <TableColumn>ชื่อพนักงาน</TableColumn>
                                        <TableColumn>สถานะ</TableColumn>
                                    </TableHeader>
                                    <TableBody
                                        items={filteredEmployees()}
                                        loadingState={!loadingEmp}
                                        loadingContent={<Spinner size="lg" color="primary" />}
                                        emptyContent="ไม่พบข้อมูล"
                                    >
                                        {(item) => (
                                            <TableRow key={item.username} >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <UserProfileAvatar name={item.username} imageURL={item.displayImgUrl} />
                                                        <div className="">
                                                            <p className="text-sm font-bold text-nowrap">{item.username}</p>
                                                            <div className="space-x-2 flex">
                                                                <p className="text-xs text-gray-500">{item.name || ''}</p>
                                                                {item.nickName && <p className="text-xs text-gray-500">({item.nickName || ''})</p>}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {item.depName && <Chip color="primary" variant="dot" size="sm">{item.depName || '-'}</Chip>}
                                                                {item.roleName && <Chip color="success" variant="dot" size="sm">{item.roleName || '-'}</Chip>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {CompareStatus(item.status, {
                                                        1: <Chip color="success" variant="dot" size="sm">กำลังใช้งาน</Chip>,
                                                        0: <Chip color="danger" variant="dot" size="sm">ปิดการใช้งาน</Chip>
                                                    })}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <div className="space-y-2">

                            <div className="flex items-center space-x-4">
                                <p className="text-sm font-bold text-nowrap">{CompareStatus(type, {
                                    "1": "จำนวนยอดคงเหลือ",
                                    "2": "จำนวนยอดสะสม",
                                    "3": "จำนวนยอดหักค่าปรับ"
                                })}
                                </p>
                                <AvatarGroup max={5} size="md">
                                    {selectedEmp.map(item => (
                                        <Tooltip content={item} placement="top" showArrow>
                                            <div>
                                                <UserProfileAvatar size="md" name={item} imageURL={listEmp.find(x => x.username === item)?.displayImgUrl || ''} />
                                            </div>
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>
                            </div>
                            <Input
                                label="จำนวนยอด"
                                labelPlacement="inside"
                                size="sm"
                                variant="bordered"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    // อนุญาตให้ใส่เครื่องหมายลบได้เฉพาะตัวแรก
                                    if (value === '-') {
                                        setAmount(value);
                                        return;
                                    }
                                    // ลบทุกอักขระยกเว้นตัวเลข จุดทศนิยม และเครื่องหมายลบ
                                    value = value.replace(/[^0-9.-]/g, '');
                                    // ตรวจสอบรูปแบบตัวเลขที่ถูกต้อง
                                    if (!isNaN(value) || value === '-') {
                                        const parts = value.split('.');
                                        if (parts.length > 2) {
                                            parts.splice(2);
                                        }
                                        if (parts[1] && parts[1].length > 2) {
                                            parts[1] = parts[1].substring(0, 2);
                                        }
                                        if (parts[0]) {
                                            const numPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                            setAmount(parts[1] ? `${numPart}.${parts[1]}` : numPart);
                                        } else {
                                            setAmount(value);
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <ConfirmCancelButtons color="bg-green-700" isLoading={loadingSubmit} isDisabledCancel={loadingSubmit} onConfirm={handleSubmit} onCancel={handleClose} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default RecoverModal;    
