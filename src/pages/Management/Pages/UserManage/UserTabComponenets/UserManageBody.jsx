import UserProfileAvatar from '@/component/UserProfileAvatar'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useLink } from '@heroui/react'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'
import { FaBan, FaCheck, FaEdit, FaPencilAlt, FaPlus, FaPlusCircle, FaPlusSquare, FaRegEdit, FaTrashAlt, FaUserEdit } from 'react-icons/fa'
import AddEmployee from '../UserTabModal/AddEmployee'
import roleService from '@/services/roleService'
import CloseStatus from '../UserTabModal/CloseStatus'
import EditEmployeeModal from '../UserTabModal/EditEmployeeModal'
import ChangePassword from '../UserTabModal/ChangePassword'
import { formatDateThai } from '@/utils/dateUtils'

function UserManageBody({ userList, isLoading, fetchData, departmentId, isSuperAdmin, selector , isManager }) {
    // Open Modal
    const [isOpenAddmployeeModal, setIsOpenAddmployeeModal] = useState(false)
    const [isOpenCloseStatusModal, setIsOpenCloseStatusModal] = useState(false)
    const [isOpenUpdateUserModal, setIsOpenUpdateUserModal] = useState(false)
    const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false)

    const [selectUserData, setSelectUserData] = useState(null)
    const columns = [
        { key: 'user', label: 'พนักงาน' },
        { key: 'dep/role', label: 'แผนก | ตำแหน่ง' },
        { key: 'probStatus', label: 'สถานะการทดลองงาน' },
        { key: 'status', label: 'สถานะการใช้งาน' },
        { key: 'startWork', label: 'วันที่เริ่มทำงาน' },
        { key: 'passProbDate', label: 'วันที่ผ่านการทดลองงาน' },
        {
            key: 'action', label: (<div className="text-right w-full">
                <span className='text-green-500 cursor-pointer hover:bg-green-200 transition-all duration-200 px-2 py-1.5 rounded-md' onClick={() => setIsOpenAddmployeeModal(true)}>
                    <FaPlus className="inline-block text-sm" />
                </span>
            </div>)
        }
    ]
    
    return (
        <>
            <div className='text-end text-slate-500 font-semibold text-sm px-2'>
                <span>จำนวนพนักงาน {userList?.length} คน</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto rounded-lg scrollbar-hide">
                <Table aria-label='ตารางพนักงาน' isHeaderSticky removeWrapper className='scroll-y-auto'>
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.key} className={column.key === 'action' ? 'text-right pr-4' : ''}>
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={userList} emptyContent='ไม่พบข้อมูลผู้ใช้งาน' isLoading={isLoading} loadingContent={<><Spinner /></>}>
                        {(user) => (
                            <TableRow key={`${user.username}-${user.nickname}`} className='h-16'>
                                <TableCell>
                                    <div className='flex flex-row justify-bstart items-center space-x-2'>
                                        <UserProfileAvatar name={user.name} imageURL={user.displayImgUrl} className={'h-16 w-16'} />
                                        <div className='flex flex-col justify-start items-start space-y-1 text-sm text-slate-500'>
                                            <span>{user.username}</span>
                                            <span>{user.name} ({user.nickname})</span>
                                        </div>
                                    </div>

                                </TableCell>
                                <TableCell><span className='text-slate-500 font-bold'>{user.department.departmentName}</span> | <span className='text-slate-500'>{user.role.roleName}</span></TableCell>
                                <TableCell>
                                    <span className={`${user.probStatus ? 'text-blue-500 bg-blue-100' : 'text-red-500 bg-red-100'} rounded-lg px-2 py-1`}>{user.probStatus ? 'ผ่านการทดลองงาน' : 'ยังไม่ผ่านการทดลองงาน'}</span>
                                </TableCell>
                                <TableCell>
                                    <span className={`${user.status ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'} rounded-lg px-2 py-1`}>{user.status ? 'ใช้งานอยู่' : 'ปิดการใช้งาน'}</span>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-row justify-start items-center'>
                                        <span>{formatDateThai(user.hireDate)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-row justify-start items-center'>
                                        <span>{user.probPassedDate ? formatDateThai(user.probPassedDate) : '-'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-row justify-start items-center w-full'>

                                        {/* Change Password */}
                                        <span onClick={() => { setIsOpenChangePasswordModal(true); setSelectUserData(user) }} className='px-3 py-1 rounded-lg bg-yellow-100 text-yellow-600 cursor-pointer hover:bg-yellow-200 transition-all duration-200'>เปลี่ยนรหัสผ่าน</span>

                                        {/* Edit User Date */}
                                        {isSuperAdmin ? (
                                            selector.agent !== 'ทั้งหมด' && (
                                                <div onClick={() => { setIsOpenUpdateUserModal(true); setSelectUserData(user) }} className='p-2 cursor-pointer hover:bg-yellow-100 transition-all duration-200 rounded-full'><span><FaPencilAlt className='text-yellow-500 font-bold text-sm' /></span></div>
                                            )
                                        ) : (
                                            <div onClick={() => { setIsOpenUpdateUserModal(true); setSelectUserData(user) }} className='p-2 cursor-pointer hover:bg-yellow-100 transition-all duration-200 rounded-full'><span><FaPencilAlt className='text-yellow-500 font-bold text-sm' /></span></div>
                                        )}

                                        {/* Close Status User */}
                                        {user?.status && (
                                            <Tooltip content={'ปิดการใช้งาน'} placement='top' color='danger'>
                                                <div onClick={() => { setIsOpenCloseStatusModal(true); setSelectUserData(user) }} className={`${user.status ? 'text-red-500  hover:bg-red-100' : 'text-green-500  hover:bg-green-100'} p-2 cursor-pointer transition-all duration-200 rounded-full`}><span> <FaBan /> </span></div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Add User */}
                {isOpenAddmployeeModal && (
                    <AddEmployee
                        isOpen={isOpenAddmployeeModal}
                        onClose={() => setIsOpenAddmployeeModal(false)}
                        fetchData={fetchData}
                        departmentId={departmentId}
                        userList={userList}
                        isSuperAdmin={isSuperAdmin}
                        selector={selector}
                        isManager={isManager}
                    />
                )}

                {/* Update User */}
                {isOpenUpdateUserModal && (
                    <EditEmployeeModal
                        isOpen={isOpenUpdateUserModal}
                        onClose={() => setIsOpenUpdateUserModal(false)}
                        selectUserData={selectUserData}
                        fetchData={fetchData}
                        departmentId={departmentId}
                        userList={userList}
                        isSuperAdmin={isSuperAdmin}
                        selector={selector}
                    />
                )}

                {/* Change Status */}
                {isOpenCloseStatusModal && (
                    <CloseStatus
                        isOpen={isOpenCloseStatusModal}
                        onClose={() => setIsOpenCloseStatusModal(false)}
                        selectUserData={selectUserData}
                        fetchData={fetchData}
                    />
                )}

                {/* Change Password */}
                {isOpenChangePasswordModal && (
                    <ChangePassword
                        isOpen={isOpenChangePasswordModal}
                        onClose={() => setIsOpenChangePasswordModal(false)}
                        selectUserData={selectUserData}
                        fetchData={fetchData}
                    />
                )}

            </div>
        </>
    )
}

export default UserManageBody
