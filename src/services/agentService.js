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
    const res = await api.post('/agents', body)
    return res.data
}

export default {
    getAgent,
    addAgent
}

