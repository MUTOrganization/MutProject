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
    return res.data
}

async function changeStatus(username) {
    const url = `users/changeStatus/${username}`
    const res = await api.patch(url)
    return res.data
}

async function deleteUser(username) {
    const url = `users/delete/${username}`
    const res = await api.put(url)
    return res.data
}

async function updateUser(userData, usernameList) {
    const url = 'users/update'
    const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v != null && v !== '')
    );

    const body = {
        username: usernameList,
        ...filteredData
    };

    const res = await api.put(url, body)
    return res.data
}

async function changePassword(username, password) {
    const url = 'users/changePassword'
    const res = await api.put(url, {
        username,
        password
    })
    return res.data
}

async function changeProfileImage(username, file) {
    const url = 'users/changeProfileImage'
    if (!file) throw new Error('File is required');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('file', file);

    const res = await api.put(url, formData)
    return res.data.url;
}

export default {
    getAllUser,
    createUser,
    changeStatus,
    updateUser,
    changePassword,
    changeProfileImage,
    deleteUser
}