import api from "@/configs/api";
import Role from "@/models/roles";

const roleURL = 'roles'

async function getRolesByDepartmentId(departmentId) {
    const url = `${roleURL}/getAll`
    const response = await api.get(url, {
        params: {
            departmentId
        }
    })
    /** @type {Array<Role>} */
    const result = response.data.map(data => new Role(data));
    return result;
}


async function createRole(departmentId, roleName, roleLevel = 1) {
    const url = `${roleURL}/create`
    await api.post(url, {
        departmentId,
        roleName,
        roleLevel
    })
}

async function updateRole(roleId, roleName) {
    const url = `${roleURL}/update`
    await api.put(url, {
        roleId,
        roleName,
    })
}

async function deleteRole(roleId) {
    const url = `${roleURL}/delete/${roleId}`
    await api.delete(url)
}

export { 
    getRolesByDepartmentId,
    createRole,
    updateRole,
    deleteRole
 }