import api from '@/configs/api'

/**
 * @param {number} agentId 
 * @param {number} status
 * @param {string} username
 * @param {string} name
 * @param {string} nickname
 * @param {string} password
 * @param {string} displayImgUrl
 * @param {number} roleId
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

async function createUser(username, name, nickname, password, displayImgUrl, roleId) {
    const url = 'auth/createUser'
    const res = await api.post(url, {
        username,
        name,
        nickname,
        password,
        displayImgUrl,
        roleId
    })
}

export default {
    getAllUser,
    createUser
}