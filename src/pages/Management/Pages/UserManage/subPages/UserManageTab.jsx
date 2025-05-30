import React, { useEffect, useRef, useState } from 'react'
import UserManageControllerBar from '../UserTabComponenets/UserManageControllerBar'
import UserManageBody from '../UserTabComponenets/UserManageBody'
import { useAppContext } from '@/contexts/AppContext'
import userService from '@/services/userService'
import User from "@/models/user";
import roleService from '@/services/roleService'
import departmentService from '@/services/departmentService'
import agentService from '@/services/agentService'

function UserManageTab() {

    const { currentUser } = useAppContext();
    // Fetch Data
    const [allUser, setAllUser] = useState([])
    const [roleId, setRoleId] = useState([])
    const [departmentId, setDepartmentId] = useState([])
    const [agentId, setAgentId] = useState([])

    // Other Stage
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRole, setIsLoadingRole] = useState(false)

    // Selector
    const [selector, setSelector] = useState({
        agent: null,
        department: null,
        role: null,
        probStatus: null,
        status: null,
    })

    // Role Check
    const isSuperAdmin = currentUser.baseRole === 'SUPER_ADMIN'
    const isAdmin = currentUser.baseRole === 'ADMIN'
    const isManager = currentUser.baseRole === 'MANAGER'

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [allUser] = await Promise.all([
                await userService.getAllUser(selectAgentParams(), 'all')
            ])
            setAllUser(allUser)
            setIsLoading(false)
        } catch (err) {
            console.log('Cannot Get Data User In Manager Users!', err)
        }
    }

    const fetchRole = async () => {
        try {
            const [agent, roles, departments] = await Promise.all([
                await agentService.getAgent(),
                await roleService.getRolesByDepartmentId(selectAgentParams(), selectAgentParamsRoleDepId()),
                await departmentService.getDepartments(selectAgentParams())
            ])
            setRoleId(roles)
            setDepartmentId(departments)
            setAgentId(agent)
        } catch (err) {
            console.log('Can not Get Roles in AddEmployee Modal', err)
        }
    }

    const selectAgentParams = () => {
        if (isSuperAdmin) {
            return Number(selector.agent)
        } else {
            return currentUser.agent.agentId
        }
    }

    const selectAgentParamsRoleDepId = () => {
        if (isSuperAdmin) {
            return Number(selector.department)
        } else {
            return ''
        }
    }
    console.log(selector.agent)

    useEffect(() => {
        fetchRole()
    }, [selector.agent, selector.department])

    useEffect(() => {
        if (agentId.length > 0 && selector.agent === null) {
            setSelector(prev => ({
                ...prev,
                agent: String(agentId[0].agentId),
                department: null,
                role: null
            }))
        }
    }, [agentId])

    useEffect(() => {
        if (selector.agent !== null) {
            fetchData()
        }
    }, [selector.agent])



    const filterUser = () => {
        let userList = allUser
        if (isManager) {
            userList = userList.filter(user => user?.department?.departmentId === currentUser?.department?.departmentId)
        }
        if (selector.department !== null) {
            userList = userList.filter(user => user.department.departmentId === Number(selector.department))
        }
        if (selector.role !== null) {
            userList = userList.filter(user => user.role.roleId === Number(selector.role))
        }
        if (selector.probStatus !== null) {
            userList = userList.filter(user => user.probStatus === selector.probStatus)
        }
        if (selector.status !== null) {
            userList = userList.filter(user => user.status === selector.status)
        }
        return userList
    }

    return (
        <div className='flex flex-col space-y-4'>
            <UserManageControllerBar agentId={agentId} departmentId={departmentId} roleId={roleId} selector={selector} setSelector={setSelector} />
            <UserManageBody isLoadingRole={isLoadingRole} userList={filterUser()} isLoading={isLoading} fetchData={fetchData} roleId={roleId} departmentId={departmentId} isSuperAdmin={isSuperAdmin} selector={selector} />
        </div>
    )
}

export default UserManageTab
