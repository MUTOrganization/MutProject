import { useAppContext } from '@/contexts/AppContext';
import { Select, SelectItem } from '@nextui-org/select'
import React from 'react'

function UserManageControllerBar() {

    const { currentUser } = useAppContext();

    const isSuperAdmin = currentUser.baseRole === 'SUPER_ADMIN';
    const isAdmin = currentUser.baseRole === 'ADMIN';
    const isManager = currentUser.baseRole === 'MANAGER';

    return (
        <div className='my-4 flex flex-row justify-start items-center space-x-4'>
            {isSuperAdmin && (
                <div className='w-2/12'>
                    <Select
                        aria-label='ตัวแทน'
                        variant='bordered'
                        placeholder='เลือกตัวแทน'
                    >
                        <SelectItem>
                            <span>ทั้งหมด</span>
                        </SelectItem>
                    </Select>
                </div>
            )}

            {isAdmin || isSuperAdmin && (
                <div className='w-2/12'>
                    <Select
                        aria-label='แผนก'
                        variant='bordered'
                        placeholder='แผนก'
                    >
                        <SelectItem>
                            <span>ทั้งหมด</span>
                        </SelectItem>
                    </Select>
                </div>
            )}

            {isManager || isAdmin || isSuperAdmin && (
                <div className='w-48'>
                    <Select
                        aria-label='ตำแหน่ง'
                        placeholder='ตำแหน่ง'
                        variant='bordered'
                    >
                        <SelectItem>
                            <span>ทั้งหมด</span>
                        </SelectItem>
                    </Select>
                </div>
            )}

            <div className='w-48'>
                <Select
                    aria-label='สถานะการใช้งาน'
                    variant='bordered'
                    placeholder='สถานะการใช้งาน'
                >
                    <SelectItem>
                        <span>ทั้งหมด</span>
                    </SelectItem>
                </Select>
            </div>

            <div className='w-2/12'>
                <Select
                    aria-label='สถานะการทดลองงาน'
                    placeholder='สถานะการทดลองงาน'
                    variant='bordered'
                >
                    <SelectItem>
                        <span>ทั้งหมด</span>
                    </SelectItem>
                </Select>
            </div>
        </div>
    )
}

export default UserManageControllerBar
