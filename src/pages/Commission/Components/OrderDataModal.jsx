import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import { useCommissionContext } from "../CommissionContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, Button, Card, Chip, Input, Pagination, Select, SelectItem, Spinner, User } from "@nextui-org/react";
import { cFormatter } from "../../../../utils/numberFormatter";
import { FilterIcon, HFCheck, HFRefresh, SearchIcon } from "../../../component/Icons";
import { toastError } from "../../../component/Alert";
import DateSelector from "../../../component/DateSelector";
import { filter } from "lodash";
import { sortArray } from "../../../../utils/arrayFunc";
import lodash from 'lodash'

export default function OrderDataModal({isOpen, onClose, userList, isLoading}) {
    const {orderList, refreshOrderList, loadOrder, orderFilter, setOrderFilter} = useCommissionContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSize, setCurrentSize] = useState(50);
    const [total, setTotal] = useState(0);

    const [dateMode, setDateMode] = useState('เดือน');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


    const abortControllerRef = useRef(null);
    
    async function refresh(controller){
        const _total = await refreshOrderList(currentPage, currentSize, controller);
        if(_total !== 'abort'){
            setTotal(_total);
        }
    }

    useEffect(() => {
        if(!isOpen) return;
        const controller = new AbortController();
        refresh(controller);

        return () => {
            controller.abort();
        }
    },[isOpen, currentPage, currentSize])
    
    const orderStatusDic = {
        O: {text: 'ออเดอร์ใหม่', color: { text: 'text-yellow-900', bg: 'bg-yellow-100', bd: 'border-yellow-400'}},
        W: {text: 'ยืนยันออเดอร์', color: { text: 'text-green-800', bg: 'bg-green-100', bd: 'border-green-600'}},
        CALLED: {text: 'เรียกขนส่งแล้ว', color: { text: 'text-blue-900', bg: 'bg-blue-200', bd: 'border-blue-600'}},
        TRANSIT: {text: 'กำลังจัดส่ง', color: { text: 'text-amber-700', bg: 'bg-amber-100', bd: 'border-amber-200'}},
        RETURN: {text:'ตีกลับ', color: { text: 'text-orange-900', bg: 'bg-orange-300', bd: 'border-orange-400'}},
        C: {text: 'ยกเลิกรายการ', color: { text: 'text-white', bg: 'bg-red-400', bd: 'border-red-600'}},
        FINISH: {text: 'ลูกค้ารับสินค้าแล้ว', color: { text: 'text-white', bg: 'bg-green-500', bd: 'border-green-600'}}
    }

    const totalPage = useMemo(() => {
        const _totalPage = Math.floor(total / currentSize) + 1
        if(currentPage > _totalPage) setCurrentPage(_totalPage)
        return _totalPage;
    },[total, currentSize, orderList])

    async function handleRefresh() {
        if(abortControllerRef.current) {
            abortControllerRef.current?.abort();
        }
        abortControllerRef.current = new AbortController();
        refresh(abortControllerRef.current)
    }

    const pagination = useMemo(() => {
        return {
            startItem: ((currentPage - 1) * currentSize) + 1,
            endItem: ((currentPage - 1) * currentSize) + orderList.length,
        }
    }, [currentPage, currentSize, orderList])

    function handleFilter(field, value){
        if(field === 'orderStatus'){
            const isCheck = orderFilter.orderStatus[value];
            setOrderFilter(p => ({
                ...p,
                orderStatus: {
                    ...p.orderStatus,
                    [value]: !isCheck
                }
            }))
        }else{
            setOrderFilter(p => ({
                ...p,
                [field]: value
            }))
        }
    }

    const sortedUserList = useMemo(() => {
        return sortArray(userList, 'username')
    }, [userList])

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose} size="5xl" className="max-w-[1600px] max-h-[100vh]">
                <ModalContent>
                    <ModalHeader>
                        <h2 className='text-2xl font-bold'>ข้อมูลออเดอร์</h2>
                    </ModalHeader>
                    <ModalBody className="overflow-auto max-h-">
                        <div>
                            <div className="flex flex-col">
                                {/* filter desktop */}
                                <div className="flex gap-4 flex-wrap max-lg:hidden">
                                    <div className="w-96">
                                        <DateSelector value={orderFilter.dateRange} onChange={(value) => handleFilter('dateRange', value)} modeState={dateMode} onModeChange={setDateMode} />
                                    </div>
                                    {/* orderNo */}
                                    <div className="w-80">
                                        <Input variant="bordered" label="รหัสคำสั่งซื้อ" className="w-full" value={orderFilter.orderNo} onChange={(e) => handleFilter('orderNo', e.target.value)}></Input>
                                    </div>
                                    {/* เซลล์ */}
                                    <div className="w-80">
                                        <Select
                                            label="เลือกเซลล์"
                                            className="w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={[orderFilter.salesName]}
                                            onSelectionChange={(keys) => handleFilter('salesName', Array.from(keys)[0])}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                        >
                                            <SelectItem key="all" textValue="ทั้งหมด">
                                                ทั้งหมด
                                            </SelectItem>
                                            {sortedUserList.map((user) => (
                                                <SelectItem key={user.username} textValue={user.username}>
                                                    <div className="flex items-center p-1 gap-3">
                                                        <Avatar
                                                            src={user.displayImgUrl || ''}
                                                            color="primary"
                                                            isBordered
                                                            name={user.nickName ? user.nickName.charAt(0) : "?"}
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col flex-grow">
                                                            <span className="text-sm font-bold">
                                                                {user.username.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g, '')}
                                                            </span>
                                                            <p className="text-sm text-slate-600">{user.name || user.nickName || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col items-center ml-auto gap-1">
                                                            <Chip size="sm" color={user.depName === 'CRM' ? 'success' : 'warning'} variant="flat">
                                                                {user.depName ?? '--'}
                                                            </Chip>
                                                            <p className="text-xs text-slate-600 text-center">{user.roleName}</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    {/* อัพเซลล์ */}
                                    {/* <div className="w-80">
                                        <Select
                                            label="เลือกอัพเซลล์"
                                            className="w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={[orderFilter.upsaleName]}
                                            onSelectionChange={(keys) => handleFilter('upsaleName', Array.from(keys)[0])}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                        >
                                            <SelectItem key="all" textValue="ทั้งหมด">
                                                ทั้งหมด
                                            </SelectItem>
                                            {sortedUserList.map((user) => (
                                                <SelectItem key={user.username} textValue={user.username}>
                                                    <div className="flex items-center p-1 gap-3">
                                                        <Avatar
                                                            src={user.displayImgUrl || ''}
                                                            color="primary"
                                                            isBordered
                                                            name={user.nickName ? user.nickName.charAt(0) : "?"}
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col flex-grow">
                                                            <span className="text-sm font-bold">
                                                                {user.username.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g, '')}
                                                            </span>
                                                            <p className="text-sm text-slate-600">{user.name || user.nickName || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col items-center ml-auto gap-1">
                                                            <Chip size="sm" color={user.depName === 'CRM' ? 'success' : 'warning'} variant="flat">
                                                                {user.depName ?? '--'}
                                                            </Chip>
                                                            <p className="text-xs text-slate-600 text-center">{user.roleName}</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div> */}
                                    {/* ชื่อลูกค้า */}
                                    <div className="w-80">
                                        <Input variant="bordered" label="ชื่อลูกค้า" className="w-full" value={orderFilter.customerName} onChange={(e) => handleFilter('customerName', e.target.value)}></Input>
                                    </div>
                                    {/* สถานะการชำระเงิน */}
                                    <div className="w-80">
                                        <Select className="w-full" variant="bordered" label="สถานะการชำระเงิน"
                                            selectedKeys={[orderFilter.paymentStatus]} 
                                            onSelectionChange={(keys => handleFilter('paymentStatus', Array.from(keys)[0]))}
                                            disallowEmptySelection
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            <SelectItem key={'1'} startContent={<div className="p-2 rounded-full bg-green-500"></div>}>ชำระเงินแล้ว</SelectItem>
                                            <SelectItem key={'0'} startContent={<div className="p-2 rounded-full bg-warning"></div>}>ยังไม่ชำระ</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 flex-wrap max-w-[500px]">
                                        {Object.entries(orderStatusDic).map(([key, value]) => {
                                            const isCheck = orderFilter.orderStatus[key]
                                            return (
                                            <Chip key={key} variant="bordered" className="cursor-pointer select-none"
                                                onClick={() => handleFilter('orderStatus', key)}
                                                classNames={{
                                                    base: isCheck ? `${value.color.bg} ${value.color.bd}` : `bg-gray-100` ,
                                                    content: isCheck ? value.color.text : `text-gray-400`,
                                                }}
                                            >
                                                <div className="min-w-16 text-center">{value.text}</div>
                                            </Chip>
                                        )})}
                                    </div>
                                    <div className="flex-1 flex justify-end items-end">
                                        <Button onPress={() => handleRefresh()} color="primary" variant="flat" endContent={<SearchIcon />}>ค้นหา</Button>
                                    </div>
                                </div>
                                {/* filter mobile */}
                                
                                <div className="flex justify-between items-center text-sm mb-1 mt-4 space-x-4">
                                    <div className="lg:hidden flex">
                                        <Button isIconOnly variant="light" color="primary" className="" onPress={() => setIsFilterModalOpen(true)}><FilterIcon /></Button>
                                    </div>
                                    <div>ทั้งหมด <strong className="mx-2">{cFormatter(total,0)}</strong> รายการ</div>
                                </div>
                                <Card shadow="none">
                                    <Table aria-label="ตารางข้อมูลออเดอร์"
                                        className="min-h-[200px] max-h-[500px] lg:max-h-[500px] overflow-auto"
                                        removeWrapper
                                        isHeaderSticky
                                    >
                                        <TableHeader>
                                            <TableColumn className="font-bold">รหัสคำสั่งซื้อ</TableColumn>
                                            <TableColumn className="font-bold">ชื่อลูกค้า</TableColumn>
                                            <TableColumn className="font-bold">ผู้ทำรายการ</TableColumn>
                                            <TableColumn className="font-bold">ตัวแทนจำหน่าย</TableColumn>
                                            <TableColumn className="font-bold">ยอดชำระ</TableColumn>
                                            <TableColumn className="font-bold">การชำระเงิน</TableColumn>
                                            <TableColumn className="font-bold">จำนวนครั้งที่ซื้อ</TableColumn>
                                            <TableColumn className="font-bold text-center">สถานะการชำระเงิน</TableColumn>
                                            <TableColumn className="font-bold text-center">สถานะ</TableColumn>
                                        </TableHeader>
                                        <TableBody isLoading={loadOrder} loadingContent={<Spinner/>} emptyContent={<div>ไม่พบข้อมูล</div>}
                                            className=""
                                        >
                                            {orderList.map(order => {
                                                const className = 'text-xs px-4'
                                                return (
                                                    <TableRow key={order.id} className="hover:bg-gray-100 border-b">
                                                        <TableCell className={className}>
                                                            <div className="font-bold">{order.orderNo}</div>
                                                            <div className="">{order.orderDate.format('DD-MM-YYYY HH:mm:ss')}</div>
                                                        </TableCell>
                                                        <TableCell className={className}>
                                                            <div className="font-bold">{order.customerName}</div>
                                                            <div className="">{order.customerPhone}</div>
                                                        </TableCell>
                                                        <TableCell className={className}>
                                                            <div className="font-bold">{order.salesName ?? order.createBy}</div>
                                                            <div className="text-gray-500">{order.salesNickname}</div>
                                                        </TableCell>
                                                        <TableCell className={className}>{order.ownerName}</TableCell>
                                                        <TableCell className={className}>{cFormatter(order.adminAmount)}</TableCell>
                                                        <TableCell className={className}>{order.paymentType}</TableCell>
                                                        <TableCell className={className}>{order.orderCount}</TableCell>
                                                        <TableCell className={className + ' text-center'}>{order.isPaid ? 
                                                            <Chip variant="dot" color="success" size="sm" startContent={<div className="ps-1 text-success"><HFCheck size={10} /></div>} >ชำระเงินแล้ว</Chip> 
                                                            : <Chip variant="dot" color="warning" size="sm">ยังไม่ชำระ</Chip>}
                                                        </TableCell>
                                                        <TableCell className={className + ' text-center'}>
                                                            <Chip size="sm" variant="flat"
                                                                classNames={{
                                                                    content: `${orderStatusDic[order.orderStatus].color.text} font-bold`,
                                                                    base: orderStatusDic[order.orderStatus].color.bg
                                                                }}>
                                                                {orderStatusDic[order.orderStatus].text}
                                                            </Chip>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                            <div className="flex flex-col max-md:gap-4 md:flex-row justify-end max-md:items-end mt-8 mb-4 space-x-8">
                                <div className="w-48">
                                    <Select aria-label="ตัวเลือกจำนวนข้อมูล" selectedKeys={[String(currentSize)]}
                                        onSelectionChange={(keys) => setCurrentSize(Number(Array.from(keys)[0]))}
                                        disallowEmptySelection
                                    >
                                        {[50, 100, 500, 1000, 2000].map(e => (
                                            <SelectItem key={e} textValue={`แสดง ${cFormatter(e)} รายการ`}>{e}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {/* <div className="flex items-center text-sm">
                                    <div>แสดงรายการ {cFormatter(pagination.startItem)} - {cFormatter((pagination.endItem))}</div>
                                </div> */}
                                <div className="w-72 flex justify-center items-center">
                                    <div>
                                        <Pagination total={totalPage} siblings={1} className=""
                                            page={currentPage}
                                            onChange={(page) => setCurrentPage(page)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal isOpen={isFilterModalOpen} onClose={() => {
                            handleRefresh();
                            setIsFilterModalOpen(false)
                        }}>
                            <ModalContent>
                                <ModalHeader>
                                    <div className="flex items-center gap-4">
                                        <div><FilterIcon/></div>
                                        <div>ตัวกรอง</div>
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                <div className="flex gap-4 flex-wrap">
                                    <div className="w-96">
                                        <DateSelector value={orderFilter.dateRange} onChange={(value) => handleFilter('dateRange', value)} modeState={dateMode} onModeChange={setDateMode} />
                                    </div>
                                    {/* orderNo */}
                                    <div className="w-80">
                                        <Input variant="bordered" label="รหัสคำสั่งซื้อ" className="w-full" value={orderFilter.orderNo} onChange={(e) => handleFilter('orderNo', e.target.value)}></Input>
                                    </div>
                                    {/* เซลล์ */}
                                    <div className="w-80">
                                        <Select
                                            label="เลือกเซลล์"
                                            className="w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={[orderFilter.salesName]}
                                            onSelectionChange={(keys) => handleFilter('salesName', Array.from(keys)[0])}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                        >
                                            <SelectItem key="all" textValue="ทั้งหมด">
                                                ทั้งหมด
                                            </SelectItem>
                                            {sortedUserList.map((user) => (
                                                <SelectItem key={user.username} textValue={user.username}>
                                                    <div className="flex items-center p-1 gap-3">
                                                        <Avatar
                                                            src={user.displayImgUrl || ''}
                                                            color="primary"
                                                            isBordered
                                                            name={user.nickName ? user.nickName.charAt(0) : "?"}
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col flex-grow">
                                                            <span className="text-sm font-bold">
                                                                {user.username.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g, '')}
                                                            </span>
                                                            <p className="text-sm text-slate-600">{user.name || user.nickName || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col items-center ml-auto gap-1">
                                                            <Chip size="sm" color={user.depName === 'CRM' ? 'success' : 'warning'} variant="flat">
                                                                {user.depName ?? '--'}
                                                            </Chip>
                                                            <p className="text-xs text-slate-600 text-center">{user.roleName}</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    {/* อัพเซลล์ */}
                                    {/* <div className="w-80">
                                        <Select
                                            label="เลือกอัพเซลล์"
                                            className="w-full"
                                            variant="bordered"
                                            isLoading={isLoading}
                                            disallowEmptySelection
                                            selectedKeys={[orderFilter.upsaleName]}
                                            onSelectionChange={(keys) => handleFilter('upsaleName', Array.from(keys)[0])}
                                            scrollShadowProps={{
                                                isEnabled: false
                                            }}
                                        >
                                            <SelectItem key="all" textValue="ทั้งหมด">
                                                ทั้งหมด
                                            </SelectItem>
                                            {sortedUserList.map((user) => (
                                                <SelectItem key={user.username} textValue={user.username}>
                                                    <div className="flex items-center p-1 gap-3">
                                                        <Avatar
                                                            src={user.displayImgUrl || ''}
                                                            color="primary"
                                                            isBordered
                                                            name={user.nickName ? user.nickName.charAt(0) : "?"}
                                                            size="md"
                                                        />
                                                        <div className="flex flex-col flex-grow">
                                                            <span className="text-sm font-bold">
                                                                {user.username.replace(/[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g, '')}
                                                            </span>
                                                            <p className="text-sm text-slate-600">{user.name || user.nickName || '-'}</p>
                                                        </div>
                                                        <div className="flex flex-col items-center ml-auto gap-1">
                                                            <Chip size="sm" color={user.depName === 'CRM' ? 'success' : 'warning'} variant="flat">
                                                                {user.depName ?? '--'}
                                                            </Chip>
                                                            <p className="text-xs text-slate-600 text-center">{user.roleName}</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div> */}
                                    {/* ชื่อลูกค้า */}
                                    <div className="w-80">
                                        <Input variant="bordered" label="ชื่อลูกค้า" className="w-full" value={orderFilter.customerName} onChange={(e) => handleFilter('customerName', e.target.value)}></Input>
                                    </div>
                                    {/* สถานะการชำระเงิน */}
                                    <div className="w-80">
                                        <Select className="w-full" variant="bordered" label="สถานะการชำระเงิน"
                                            selectedKeys={[orderFilter.paymentStatus]} 
                                            onSelectionChange={(keys => handleFilter('paymentStatus', Array.from(keys)[0]))}
                                            disallowEmptySelection
                                        >
                                            <SelectItem key={'all'}>ทั้งหมด</SelectItem>
                                            <SelectItem key={'1'} startContent={<div className="p-2 rounded-full bg-green-500"></div>}>ชำระเงินแล้ว</SelectItem>
                                            <SelectItem key={'0'} startContent={<div className="p-2 rounded-full bg-warning"></div>}>ยังไม่ชำระ</SelectItem>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 flex-wrap max-w-[500px]">
                                        {Object.entries(orderStatusDic).map(([key, value]) => {
                                            const isCheck = orderFilter.orderStatus[key]
                                            return (
                                            <Chip key={key} variant="bordered" className="cursor-pointer select-none"
                                                onClick={() => handleFilter('orderStatus', key)}
                                                classNames={{
                                                    base: isCheck ? `${value.color.bg} ${value.color.bd}` : `bg-gray-100` ,
                                                    content: isCheck ? value.color.text : `text-gray-400`,
                                                }}
                                            >
                                                <div className="min-w-16 text-center">{value.text}</div>
                                            </Chip>
                                        )})}
                                    </div>
                                    <div className="flex-1 flex justify-end items-end">
                                        <Button className="w-full" onPress={() => {
                                                handleRefresh()
                                                setIsFilterModalOpen(false)
                                            }} color="primary" variant="solid" startContent={<SearchIcon />}>ค้นหา</Button>
                                    </div>
                                </div>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}