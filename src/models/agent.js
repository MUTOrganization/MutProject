/* eslint-disable no-unused-vars */
import Department from "./department";

export default class Agent {
    constructor(data) {
        /** @type {number} */
        this.agentId = data.agentId;
        /** @type {string} */
        this.name = data.name;
        /** @type {string} */
        this.code = data.code;
        /** @type {string} */
        this.businessType = data.businessType;
        /** @type {Date} */
        this.createdDate = new Date(data.createdDate);
        /** @type {Date} */
        this.updatedDate = new Date(data.updatedDate);
        /** @type {Array<Department>} */
        this.departments = data.departments;
    }
}