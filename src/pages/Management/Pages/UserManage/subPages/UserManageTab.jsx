import React, { useEffect, useState } from 'react'
import UserManageControllerBar from '../UserTabComponenets/UserManageControllerBar'
import UserManageBody from '../UserTabComponenets/UserManageBody'
import { useAppContext } from '@/contexts/AppContext'
import userService from '@/services/userService'
import User from "@/models/user";
import roleService from '@/services/roleService'
import departmentService from '@/services/departmentService'

function UserManageTab() {

    const { currentUser } = useAppContext();

    // Fetch Data
    const [allUser, setAllUser] = useState([])
    const [roleId, setRoleId] = useState([])
    const [departmentId, setDepartmentId] = useState([])

    // Other Stage
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [allUser] = await Promise.all([
                await userService.getAllUser(currentUser.agent.agentId, 'all')
            ])
            setAllUser(allUser)
            setIsLoading(false)
        } catch (err) {
            console.log('Cannot Get Data User In Manager Users!', err)
        }
    }

    const fetchRoles = async () => {
        try {
            const [roles, departments] = await Promise.all([
                await roleService.getRolesByDepartmentId(currentUser.agent.agentId),
                await departmentService.getDepartments(currentUser.agent.agentId)
            ])
            setRoleId(roles)
            setDepartmentId(departments)
        } catch (err) {
            console.log('Can not Get Roles in AddEmployee Modal', err)
        }
    }

    useEffect(() => {
        fetchData()
        fetchRoles()
    }, [])

    const filterUser = () => {
        const userList = allUser
        return userList
    }

    return (
        <div className='flex flex-col space-y-4'>
            <UserManageControllerBar />
            <UserManageBody userList={filterUser()} isLoading={isLoading} fetchData={fetchData} roleId={roleId} departmentId={departmentId} />
        </div>
    )
}

export default UserManageTab
