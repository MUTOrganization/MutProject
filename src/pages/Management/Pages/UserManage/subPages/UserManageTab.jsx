import React, { useEffect, useState } from 'react'
import UserManageControllerBar from '../UserTabComponenets/UserManageControllerBar'
import UserManageBody from '../UserTabComponenets/UserManageBody'
import { useAppContext } from '@/contexts/AppContext'
import userService from '@/services/userService'
import User from "@/models/user";

function UserManageTab() {

    const { currentUser } = useAppContext();

    // Fetch Data
    const [allUser, setAllUser] = useState([])

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

    useEffect(() => {
        fetchData()
    }, [])

    const filterUser = () => {
        const userList = allUser
        return userList
    }

    return (
        <div className='flex flex-col space-y-4'>
            <UserManageControllerBar />
            <UserManageBody userList={filterUser()} isLoading={isLoading} fetchData={fetchData} />
        </div>
    )
}

export default UserManageTab
