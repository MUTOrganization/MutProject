/* eslint-disable no-unused-vars */

import Agent from "./agent";
import Role from "./roles";

export default class Department {
    constructor(data) {
        /** @type {number} */
        this.departmentId = data.departmentId;
        /** @type {string} */
        this.departmentName = data.departmentName;
        /** @type {boolean} */
        this.isHq = data.isHq;  
        /** @type {Date} */
        this.createdDate = new Date(data.createdDate);
        /** @type {Date} */
        this.updatedDate = new Date(data.updatedDate);
        /** @type {Agent} */
        this.agent = data.agent;
        /** @type {Array<Role>} */
        this.roles = data.roles;

    }
}