import api from '@/configs/api'

/**
 * @param {number} agentId 
 * @param {number} status 
 * @returns 
 */
async function getAllUser(agentId, status = 1) {
    const url = 'users/getAll'
    const res = await api.get(url, {
        params: {
            agentId,
            status
        }
    })
    return res.data
}

export default {
    getAllUser
}