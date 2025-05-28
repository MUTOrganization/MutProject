import api from "@/configs/api";
import Role from "@/models/roles";

const roleURL = 'roles'

async function getRolesByDepartmentId(agentId, departmentId) {
    const url = `${roleURL}/getAll`
    const response = await api.get(url, {
        params: {
            agentId,
            departmentId
        }
    })
    /** @type {Array<Role>} */
    const result = response.data.map(data => new Role(data));
    return result;
}

/**
 * 
 * @param {Number} departmentId 
 * @param {String} roleName 
 * @param {Number} roleLevel 
 */
async function createRole(departmentId, roleName, roleLevel = 1) {
    const url = `${roleURL}/create`
    await api.post(url, {
        departmentId,
        roleName,
        roleLevel
    })
}

/**
 * 
 * @param {Number} roleId 
 * @param {String} roleName 
 */
async function updateRole(roleId, roleName) {
    const url = `${roleURL}/update`
    await api.put(url, {
        roleId,
        roleName,
    })
}

/**
 * 
 * @param {Array<{roleId: Number, roleLevel: Number}>} roleList 
 */
async function updateRoleLevel(roleList) {
    const url = `${roleURL}/updateLevel`
    const data = roleList.map((item, index) => ({
        id: item.roleId,
        roleLevel: index + 1
    }))
    await api.put(url, {
        roles: data
    })
}

/**
 * 
 * @param {Number} departmentId 
 * @param {Array<{roleId: Number, roleLevel: Number}>} roleList 
 */
async function updateRoleLevelHq(departmentId, roleList) {
    const url = `${roleURL}/updateLevelHq`
    const data = roleList.map((item, index) => ({
        roleId: item.roleId,
        roleLevel: index + 1
    }))
    await api.put(url, {
        departmentId,
        roles: data
    })
}

/**
 * 
 * @param {Number} roleId 
 */
async function deleteRole(roleId) {
    const url = `${roleURL}/delete/${roleId}`
    await api.delete(url)
}

/**
 * 
 * @param {Number} roleId 
 * @param {Array<Number>} accessIdList 
 */
async function updateRoleAccess(roleId, accessIdList) {
    const url = `roleAccess/update`
    await api.put(url, {
        roleId,
        accessIdList
    })
}

/**
 * 
 * @param {Number} roleId 
 * @param {Array<Number>} accessIdList 
 */
async function updateRoleAccessHq(roleId, accessIdList) {
    const url = `roleAccess/updateHq`
    await api.put(url, {
        roleId,
        accessIdList
    })
}


export default {
    getRolesByDepartmentId,
    createRole,
    updateRole,
    deleteRole,
    updateRoleLevel,
    updateRoleLevelHq,
    updateRoleAccess,
    updateRoleAccessHq
}