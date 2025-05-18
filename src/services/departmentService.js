import api from "@/configs/api";
import Department from "@/models/department";

const DepartmentURL = 'departments'

async function getDepartments(agentId, status = 1) {
    const url = `${DepartmentURL}/getAll`
    const response = await api.get(url, {
        params: {
            agentId,
            status
        }
    })
    // console.log(response.data.map(data => new Department(data)));
    /** @type {Array<Department>} */
    return response.data.map(data => new Department(data));
}


export default {
    getDepartments
}