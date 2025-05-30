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

    return (
        <div className='my-4 flex flex-row justify-start items-center space-x-4'>
            {isSuperAdmin && (
                <div className='w-2/12'>
                    <Autocomplete
                        aria-label='ตัวแทน'
                        variant='bordered'
                        label='ตัวแทน'
                        // disableClearable={true}
                        placeholder='เลือกตัวแทน'
                        onSelectionChange={(value) =>
                            setSelector((prev) => ({
                                ...prev,
                                agent: value || null,
                                department: null,
                                role: null,
                            }))
                        }
                        selectedKey={`${selector.agent}`}
                    >
                        {agentId.map(item => (
                            <AutocompleteItem key={item.agentId} value={item.agentId}>{item.name}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            )}

            {isAdmin || isSuperAdmin && (
                <div className='w-2/12'>
                    <Select
                        aria-label='แผนก'
                        variant='bordered'
                        label='แผนก'
                        placeholder='ทั้งหมด'
                        onChange={(e) => setSelector(prev => ({ ...prev, department: Number(e.target.value) || null }))}
                        value={selector.department || null}
                        isDisabled={selector.agent === null}
                    >
                        {departmentId.map(item => (
                            <SelectItem key={item.departmentId} value={item.departmentId}>{item.departmentName}</SelectItem>
                        ))}
                    </Select>
                </div>
            )}

            {(isManager || isAdmin || isSuperAdmin) && (
                <div className='w-48'>
                    <Select
                        aria-label='ตำแหน่ง'
                        label='ตำแหน่ง'
                        placeholder='ทั้งหมด'
                        variant='bordered'
                        onChange={(e) => setSelector(prev => ({ ...prev, role: Number(e.target.value) || null }))}
                        value={selector.role || null}
                        isDisabled={isSuperAdmin && selector.department === null || selector.agent === null}
                    >
                        {isManager ? (
                            roleId.filter(r => r?.department?.departmentId === currentUser?.department?.departmentId).map(item => (
                                <SelectItem key={item.roleId} value={item.roleId}>{item.roleName}</SelectItem>
                            ))
                        ) : (
                            roleId.map(item => (
                                <SelectItem key={item.roleId} value={item.roleId}>{item.roleName}</SelectItem>
                            ))
                        )}
                    </Select>
                </div>
            )}

            <div className='w-48'>
                <Select
                    aria-label='สถานะการทดลองงาน'
                    variant='bordered'
                    placeholder='สถานะการทดลองงาน'
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
                    variant='bordered'
                    placeholder='สถานะการใช้งาน'
                    onChange={(e) => setSelector(prev => ({ ...prev, status: Number(e.target.value) === 1 ? true : Number(e.target.value) === 2 ? false : null }))}
                    value={selector.status || null}
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
