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
 * @param {string} name ชื่อตัวแทน
 * @param {string} code รหัสตัวแทน
 * @returns {Promise<Object>}
 */
export async function addAgent(name, code) {
    const payload = {
        name,
        code
    }
    const res = await api.post('/agents/create', payload)
    return res.data
}


/**
 * แก้ไขตัวแทน
 * @param {string} name ชื่อตัวแทน
 * @param {string} code รหัสตัวแทน
 * @returns {Promise<Object>}
 */
export async function editAgent(name, code) {
    const payload = {
        name,
        code
    }
    const res = await api.put('/agents/edit', payload)
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


export default {
    getAgent,
    addAgent,
    editAgent,
    deleteAgent
}

