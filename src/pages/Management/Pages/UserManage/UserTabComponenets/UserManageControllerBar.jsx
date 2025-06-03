import { useAppContext } from '@/contexts/AppContext';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { Select, SelectItem } from '@nextui-org/select'
import React, { useEffect } from 'react'

function UserManageControllerBar({ agentId, departmentId, roleId, selector, setSelector }) {
    const { currentUser } = useAppContext();

    const isSuperAdmin = currentUser.baseRole === 'SUPER_ADMIN';
    const isAdmin = currentUser.baseRole === 'ADMIN';
    const isManager = currentUser.baseRole === 'MANAGER';

    const probitem = [
        { key: 1, value: 'ผ่านการทดลองงาน' },
        { key: 2, value: 'ไม่ผ่านการทดลองงาน' },
    ]

    const statusitem = [
        { key: 1, value: 'ใช้งานอยู่' },
        { key: 2, value: 'ปิดการใช้งาน' },
    ]

    const displayRole = () => {
        if (isAdmin) {
            return (
                roleId.filter(r => r?.department?.departmentId === Number(selector.department)).map(item => (
                    <SelectItem key={item.roleId} value={item.roleId}>{item.roleName}</SelectItem>
                ))
            )
        } else if (isManager) {
            return (
                roleId.filter(r => r?.department?.departmentId === currentUser?.department?.departmentId).map(item => (
                    <SelectItem key={item.roleId} value={item.roleId}>{item.roleName}</SelectItem>
                ))
            )
        } else {
            return (
                roleId.map(item => (
                    <SelectItem key={item.roleId} value={item.roleId}>{item.roleName}</SelectItem>
                ))
            )
        }
    }

    return (
        <div className='my-4 flex flex-row justify-start items-center space-x-4'>
            {isSuperAdmin && (
                <div className='w-2/12'>
                    <Autocomplete
                        aria-label='ตัวแทน'
                        variant='bordered'
                        label='ตัวแทน'
                        placeholder='เลือกตัวแทน'
                        onSelectionChange={(value) => {
                            if (value === null) return
                            setSelector((prev) => ({
                                ...prev,
                                agent: value,
                                department: null,
                                role: null,
                            }))
                        }}
                        selectedKey={`${selector.agent}`}
                    >
                        {agentId.map(item => (
                            <AutocompleteItem key={item.agentId} value={item.agentId}>{item.name}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            )}

            {(isAdmin || isSuperAdmin) && (
                <div className='w-2/12'>
                    <Select
                        key={selector.agent}
                        aria-label='แผนก'
                        variant='bordered'
                        label='แผนก'
                        placeholder='ทั้งหมด'
                        onChange={(e) => setSelector(prev => ({ ...prev, department: Number(e.target.value) || null, role: null }))}
                        value={selector.department || null}
                        isDisabled={isAdmin ? false : selector.agent === null}
                    >
                        {departmentId?.map(item => (
                            <SelectItem key={item.departmentId} value={item.departmentId}>{item.departmentName}</SelectItem>
                        ))}
                    </Select>
                </div>
            )}

            {(isManager || isAdmin || isSuperAdmin) && (
                <div className='w-48'>
                    <Select
                        key={isSuperAdmin ? selector.agent : selector.department}
                        aria-label='ตำแหน่ง'
                        label='ตำแหน่ง'
                        placeholder='ทั้งหมด'
                        variant='bordered'
                        onChange={(e) => setSelector(prev => ({ ...prev, role: Number(e.target.value) || null }))}
                        value={selector.role || null}
                        isDisabled={isSuperAdmin ? selector.department === null || selector.agent === null : isAdmin ? selector.department === null : false}
                    >
                        {displayRole()}
                    </Select>
                </div>
            )}

            <div className='w-48'>
                <Select
                    aria-label='สถานะการทดลองงาน'
                    label='สถานะการทดลองงาน'
                    variant='bordered'
                    placeholder='ทั้งหมด'
                    onChange={(e) => setSelector(prev => ({ ...prev, probStatus: Number(e.target.value) === 1 ? true : Number(e.target.value) === 2 ? false : null }))}
                    value={selector.probStatus || null}
                >
                    {probitem.map(item => (
                        <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                    ))}
                </Select>
            </div>

            <div className='w-2/12'>
                <Select
                    aria-label='สถานะการใช้งาน'
                    label='สถานะการใช้งาน'
                    variant='bordered'
                    placeholder='ทั้งหมด'
                    onChange={(e) => setSelector(prev => ({ ...prev, status: e.target.value || null }))}
                    value={selector.status || null}
                    defaultSelectedKeys={String(selector.status)}
                >
                    {statusitem.map(item => (
                        <SelectItem key={item.key} value={item.key}>{item.value}</SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    )
}

export default UserManageControllerBar
