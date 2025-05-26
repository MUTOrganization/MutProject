import api from "@/configs/api";


/**
 * ดึงข้อมูลตัวแทน
 * @param {string} type ประเภทของตัวแทน หัวหน้าตัวแทน ตัวแทนทั้งหมด
 * @returns {Promise<Object>}
 */
export async function getAgent(type = 'A,C,H') {
    const res = await api.get('/agents', { params: { type } })
    return res.data
}


/**
 * เพิ่มตัวแทน
 * @param {object {code: string, name: string}} body ข้อมูลตัวแทน
 * @returns {Promise<Object>}
 */
export async function addAgent(body) {
    const res = await api.post('/agents/create', body)
    return res.data
}


/**
 * ลบตัวแทน
 * @param {string} id รหัสตัวแทน
 * @returns {Promise<Object>}
 */
export async function deleteAgent(agentId) {
    const res = await api.delete(`/agents/delete/${agentId}`)
    return res.data
}


/**
 * อัพเดตสิทธิ์ตัวแทน
 * @param {string} agentId รหัสตัวแทน
 * @param {string[]} accessIds รหัสสิทธิ์
 * @returns {Promise<{insertedCount: number, deletedCount: number}>}
 */
export async function updateAgentAccess(agentId, accessIds) {
    const res = await api.put(`/agentAccess/updateAgent`, { 
        agentId,
        accessIdList: accessIds
    })
    return res.data
}


export default {
    getAgent,
    addAgent,
    deleteAgent,
    updateAgentAccess
}

