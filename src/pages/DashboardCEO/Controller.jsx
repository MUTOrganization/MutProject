import AgentSelector from '@/component/AgentSelector'
import agentService from '@/services/agentService'
import React, { useEffect } from 'react'

function Controller({ agentList, setAgentList, selectAgent, setSelectAgent, currentUser }) {

    const fetchAgent = async () => {
        try {
            const res = await agentService.getAgent()
            setAgentList(res)
        } catch (err) {
            console.log('Cannot Get Agent', err)
        }
    }

    useEffect(() => {
        fetchAgent()
    }, [])

    return (
        <div className='w-full bg-white rounded-md p-4'>
            {currentUser.agent.agentId === 1 && (
                <AgentSelector />
            )}
        </div>
    )
}

export default Controller
