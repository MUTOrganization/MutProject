/* eslint-disable no-unused-vars */
import Agent from "./agent";
import Department from "./department";
import Role from "./roles";

export default class User {
    constructor(data) {
        /** @type {string} */
        this.username = data.username;
        /** @type {string} */
        this.name = data.name;
        /** @type {string} */
        this.nickname = data.nickname;
        /** @type {string} */
        this.displayImgUrl = data.displayImgUrl;
        /** @type {string} */
        this.hireDate = data.hireDate;
        /** @type {boolean} */
        this.probStatus = data.probStatus;
        /** @type {Array<number>} */
        this.access = data.access;
        /** @type {Date} */
        this.createdDate = new Date(data.createdDate);
        /** @type {Date} */
        this.updatedDate = new Date(data.updatedDate);
        /** @type {Role} */
        this.role = data.role;
        /** @type {Department} */
        this.department = data.department;
        /** @type {Agent} */
        this.agent = data.agent;
        /** @type {import('@/configs/types/rolebase').ROLES} */
        this.baseRole = data.baseRole || '';
    }

}