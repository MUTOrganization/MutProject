import api from "@/configs/api";
import Department from "@/models/department";

const DepartmentURL = 'departments'

async function getDepartments(agentId, status) {
    const url = `${DepartmentURL}/getAll`
    const response = await api.get(url, {
        params: {
            agentId,
            status
        }
    })
    /** @type {Array<Department>} */
    const result = response.data.map(data => new Department(data));
    return result;
}

async function createDepartment(agentId, departmentName, isHq = false){
    const url = `${DepartmentURL}/create`
    await api.post(url, {
        agentId,
        departmentName,
        isHq
    })
}

async function updateDepartment(departmentId, departmentName, isHq = false){
    const url = `${DepartmentURL}/edit/${departmentId}`
    await api.put(url, {
        departmentName,
        isHq
    })
}

async function deleteDepartment(departmentId){
    const url = `${DepartmentURL}/delete/${departmentId}`
    await api.delete(url)
}

export default {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
}