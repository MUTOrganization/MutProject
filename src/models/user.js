/* eslint-disable no-unused-vars */
import Agent from "./agent";
import Department from "./department";
import Role from "./roles";

export default class User {
    constructor(data) {
        /** @type {number} */
        this.id = data.id;
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
        /** @type {Role} */
        this.role = data.role;
        /** @type {Department} */
        this.department = data.department;
        /** @type {Agent} */
        this.agent = data.agent;
    }

}