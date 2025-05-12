/**
 * 
 * @param {*} value ค่าที่ต้องการเช็ค 
 * @param {object} format  format ที่ต้องการ เช่น 0 : ไม่ใช้งาน 1 : ใช้งาน
 * ตัวอย่างการใช้งาน FormatStatus(item.status, {1:'ใช้งาน' 0 : 'ไม่ใช้งาน'})
 * @returns 
 */
export const CompareStatus = (value, format = {}) => {
    if (typeof format === 'object' && format !== null) {
        if (format.hasOwnProperty(value)) {
            return format[value];
        }
        return 'anonymous';
    } else if (typeof format === 'string') {
        return format;
    }
    return 'anonymous';
}


export const CompareValue = (value1 = [], value2 = [], field1 = '', field2 = '') => {
    if (!field1 || !field2) {
        throw new Error("field1 และ field2 ต้องไม่เป็นค่าว่าง");
    }

    return value1.map(item1 => {
        const matchedItem = value2.find(item2 => item1[field1] === item2[field1]);

        if (matchedItem) {
            return {
                ...item1,
                [field2]: matchedItem[field2]
            };
        } else {
            return item1;
        }
    });
};

