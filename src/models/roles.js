/* eslint-disable no-unused-vars */
import Department from "./department";
import User from "./user";

export default class Role {
    constructor(data) {
        /** @type {number} */
        this.roleId = data.roleId;
        /** @type {string} */
        this.roleName = data.roleName;
        /** @type {number} */
        this.roleLevel = data.roleLevel;
        /** @type {boolean} */
        this.isHq = data.isHq;
        /** @type {Date} */
        this.createdDate = new Date(data.createdDate);
        /** @type {Date} */
        this.updatedDate = new Date(data.updatedDate);
        /** @type {Department} */
        this.department = data.department;
        /** @type {Array<User>} */
        this.users = data.users;
    }
}