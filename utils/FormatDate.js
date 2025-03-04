import moment from "moment";

/**
 * 
 * @param {Date} date วันที่ ที่ต้องการแปลง
 * @param {string} format รูปแบบที่ต้องการ ค่าเริ่มต้น YYYY-MM-DD 
 * @returns 
 */
export const CustomFormatDate = (date = moment(), format = 'YYYY-MM-DD') => {
    date = moment(date).format(format);
    return date;
}


/**
 * 
 * @param {Date} date วันที่ ที่ต้องการแปลง
 * @param {string} format รูปแบบที่ต้องการ ค่าเริ่มต้น YYYY-MM-DD HH:mm:ss'
 * @returns 
 */
export const CustomFormatDateTime = (date = moment(), format = 'YYYY-MM-DD HH:mm:ss') => {
    date = moment(date).format(format);
    return date;
}