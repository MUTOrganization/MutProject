import api from "@/configs/api";


export async function getGroupAccess(safe) {
    const res = await api.get(`/access/group/get`, {
        params: {
            safe
        }
    })
    return res.data
}

export async function getAccess(safe) {
    const res = await api.get(`/access/get`, {
        params: {
            safe
        }
    })
    return res.data
}
