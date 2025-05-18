import api from "@/configs/api";

async function login(username, password) {
    const url = 'auth/login';
    const res = await api.post(url, {
        username,
        password
    })
    return res.data
}

async function logout() {
    const url = 'auth/logout';
    await api.post(url)
}

async function getUserData() {
    const url = 'auth/getUserData';
    const res = await api.post(url)
    return res.data
}

export default {
    login,
    getUserData,
    logout
}