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
        this.level = data.level;
        /** @type {boolean} */
        this.isHq = data.isHq;
        /** @type {Department} */
        this.department = data.department;
        /** @type {Array<User>} */
        this.users = data.users;
    }
}