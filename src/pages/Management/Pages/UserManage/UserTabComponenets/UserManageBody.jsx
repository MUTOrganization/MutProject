import UserProfileAvatar from '@/component/UserProfileAvatar'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useLink } from '@heroui/react'
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect, useState } from 'react'
import { FaBan, FaEdit, FaPencilAlt, FaPlus, FaPlusCircle, FaPlusSquare, FaRegEdit, FaTrashAlt, FaUserEdit } from 'react-icons/fa'
import AddEmployee from '../UserTabModal/AddEmployee'
import roleService from '@/services/roleService'
import CloseStatus from '../UserTabModal/CloseStatus'
import EditEmployeeModal from '../UserTabModal/EditEmployeeModal'
import ChangePassword from '../UserTabModal/ChangePassword'

function UserManageBody({ userList, isLoading, fetchData, departmentId, isSuperAdmin, selector }) {
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
        {
            key: 'action', label: (<div className="text-right w-full">
                {isSuperAdmin ? (
                    selector.agent !== null && (
                        <span className='text-green-500 cursor-pointer hover:bg-green-200 transition-all duration-200 px-2 py-1.5 rounded-md' onClick={() => setIsOpenAddmployeeModal(true)}>
                            <FaPlus className="inline-block text-sm" />
                        </span>
                    )
                ) : (
                    <span className='text-green-500 cursor-pointer hover:bg-green-200 transition-all duration-200 px-2 py-1.5 rounded-md' onClick={() => setIsOpenAddmployeeModal(true)}>
                        <FaPlus className="inline-block text-sm" />
                    </span>
                )}
            </div>)
        }
    ]

    return (
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
                        <TableRow key={`${user.username}-${user.nickname}`} className='h-16 border-b border-slate-100'>
                            <TableCell>
                                <div className='flex flex-row justify-bstart items-center space-x-2'>
                                    <UserProfileAvatar name={user.name} imageURL={user.displayImgUrl} className={'h-16 w-16'} />
                                    <div className='flex flex-col justify-start items-start space-y-1 text-sm text-slate-500'>
                                        <span>{user.username}</span>
                                        <span>{user.name}</span>
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
                                    <span>{new Date(user.hireDate).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                                </div>
                            </TableCell>
                            <TableCell className='w-2/12'>
                                <div className='flex flex-row justify-center items-center w-full'>
                                    <span onClick={() => { setIsOpenChangePasswordModal(true); setSelectUserData(user) }} className='px-3 py-1 rounded-lg bg-slate-200 text-slate-600 cursor-pointer hover:bg-slate-300 transition-all duration-200'>เปลี่ยนรหัสผ่าน</span>
                                    <div onClick={() => { setIsOpenUpdateUserModal(true); setSelectUserData(user) }} className='p-2 cursor-pointer hover:bg-yellow-100 transition-all duration-200 rounded-full'><span><FaPencilAlt className='text-yellow-500 font-bold text-sm' /></span></div>
                                    <div onClick={() => { setIsOpenCloseStatusModal(true); setSelectUserData(user) }} className='p-2 cursor-pointer hover:bg-red-100 transition-all duration-200 rounded-full'><span><FaBan className='text-red-500 font-bold text-sm' /></span></div>
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
    )
}

export default UserManageBody
