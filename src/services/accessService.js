import api from "@/configs/api";


//#region หมวดหมู่สิทธิ์
export async function getGroupAccess(safe) {
    const res = await api.get(`/access/group/get`, {
        params: {
            safe
        }
    })
    return res.data
}

export async function createGroupAccess({ groupName, description }) {
    const res = await api.post(`/access/group/create`, {
        groupName,
        description
    })
    return res.data
}

export async function deleteGroupAccess({ groupId }) {
    const res = await api.delete(`/access/group/delete/${groupId}`)
    return res.data
}

//#endregion

//#region สิทธิ์
export async function getAccess(safe) {
    const res = await api.get(`/access/get`, {
        params: {
            safe
        }
    })
    return res.data
}

export async function getAccessByRoleId(roleId, controllor) {
    const res = await api.get(`/access/getAccessByRole/${roleId}`, {
        signal: controllor?.signal
    })
    return res.data
}


export async function createAccess({  accessName , accessCode , description , accessGroupId }) {
    const res = await api.post(`/access/create`, {
        accessName,
        accessCode,
        description,
        accessGroupId
    })
    return res.data
}

export async function updateAccess({ accessId, accessName, accessCode, description, accessGroupId }) {
    const res = await api.put(`/access/edit/${accessId}`, {
        accessName,
        accessCode,
        description,
        accessGroupId
    })
    return res.data
}

export async function deleteAccess({ accessId }) {
    const res = await api.delete(`/access/delete/${accessId}`)
    return res.data
}

//#endregion


