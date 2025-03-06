import { useMemo } from "react";
import _ from "lodash";

/**
 * ใช้สำหรับกรองข้อมูลที่ไม่ซ้ำ โดยสามารถระบุ Key, Value และเงื่อนไขการกรองได้
 *
 * @param {Array} data - ข้อมูลต้นทางที่เป็น Array ของ Object
 * @param {string} key - ชื่อคีย์ที่ใช้เป็น Key (เช่น "username", "team")
 * @param {string} valueKey - ชื่อคีย์ที่ใช้เป็น Value (เช่น "team", "score")
 * @param {any} defaultValue - ค่าที่จะใช้เมื่อ Value ไม่มีค่า
 * @param {"key" | "value" | "both"} [returnType="both"] - ระบุประเภทการคืนค่า:
 *      - `"key"`: คืนเฉพาะ Key
 *      - `"value"`: คืนเฉพาะ Value
 *      - `"both"`: คืน Key และ Value เป็นคู่
 * @param {Function} [filterFn=() => true] - ฟังก์ชันกรองข้อมูล (ค่าเริ่มต้นคือไม่มีการกรอง)
 *      - ฟังก์ชันนี้จะรับ Object แต่ละตัวใน `data` และคืนค่า `true` หรือ `false`
 *      - ตัวอย่าง:
 *          - กรองเฉพาะ `score > 80`: `(item) => item.score > 80`
 *          - กรองเฉพาะทีมที่ไม่ว่าง: `(item) => item.team !== null`
 *
 * @returns {Array} - คืนค่าผลลัพธ์ที่คัดกรองแล้วในรูปแบบ:
 *      - หาก `returnType` เป็น `"key"`: คืน Array ของ Key (เช่น ["Alice", "Bob"])
 *      - หาก `returnType` เป็น `"value"`: คืน Array ของ Value (เช่น ["Team A", "Team B"])
 *      - หาก `returnType` เป็น `"both"`: คืน Array ของ Key-Value Pair (เช่น [["Alice", "Team A"], ["Bob", "Team B"]])
 */
export const useUniqueItems = (data, key, valueKey, defaultValue, returnType = "both", filterFn = () => true) => {
    return useMemo(() => {

        const filteredData = _.filter(data, filterFn);

        const entries = _.uniqBy(filteredData, key).map((item) => [
            item[key],
            item[valueKey] || defaultValue,
        ]);

        if (returnType === "key") {
            return _.map(entries, ([key]) => key);
        } else if (returnType === "value") {
            return _.map(entries, ([, value]) => value);
        }
        return entries;

    }, [data, key, valueKey, defaultValue, returnType, filterFn]);
};

/**
 * ดึงค่าที่ไม่ซ้ำจาก Object หลายตัวในข้อมูล พร้อมรองรับค่า Default
 *
 * @param {Object} data - ข้อมูลต้นทางที่เป็น Object
 * @param {Array<string>} keys - รายชื่อคีย์ใน Object ที่ต้องการดึงข้อมูล (เช่น ["monthlyData", "yearlyData"])
 * @param {string} field - ชื่อฟิลด์ที่ต้องการดึงค่าจากแต่ละ Object (เช่น "username", "team")
 * @param {any} defaultValue - ค่าที่จะใช้แทนเมื่อฟิลด์ไม่มีค่า
 * @returns {Array} - คืนค่าที่ไม่ซ้ำและเรียงตามตัวอักษร
 */
export const useCombinedUniqueItems = (data, keys, field, defaultValue = null) => {
    return useMemo(() => {

        const combinedData = _.flatMap(keys, (key) => data?.[key] || []);
        const values = _.map(combinedData, (item) => item[field] || defaultValue);

        return _.uniq(values).sort((a, b) => a.localeCompare(b));
    }, [data, keys, field, defaultValue]);
};