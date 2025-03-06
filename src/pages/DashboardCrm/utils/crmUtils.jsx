import { useMemo } from "react";

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
        const map = new Map();

        data.forEach((item) => {
            const keyValue = item[key];
            const value = item[valueKey] || defaultValue;

            if (filterFn(item) && !map.has(keyValue)) {
                map.set(keyValue, value);
            }
        });

        const entries = Array.from(map.entries());

        if (returnType === "key") {
            return entries.map(([key]) => key);
        } else if (returnType === "value") {
            return entries.map(([, value]) => value);
        }
        return entries;
    }, [data, key, valueKey, defaultValue, returnType, filterFn]);
};

// ฟังก์ชันสำหรับดึง Username ที่ไม่ซ้ำ
export const useUniqueUsername = (data) => {
    return useMemo(() => {
        const usernameMap = new Map();

        data.forEach((item) => {
            if (!usernameMap.has(item.username)) {
                usernameMap.set(item.username, item.team || "ยังไม่มีทีม");
            }
        });

        return Array.from(usernameMap.entries()).sort((a, b) =>
            a[0].localeCompare(b[0])
        );
    }, [data]);
};

// ฟังก์ชันสำหรับดึงทีมที่ไม่ซ้ำ
export const useUniqueTeam = (data) => {
    return useMemo(() => {
        const teamMap = new Set();

        data.forEach((item) => {
            teamMap.add(item.team || "ยังไม่มีทีม");
        });

        return Array.from(teamMap).sort((a, b) => a.localeCompare(b));
    }, [data]);
};

// ฟังก์ชันสำหรับฟอร์แมตวันที่ส่งไปหาข้อมูลจาก Object เป็น String 
export const formatDateObject = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.year;
    const month = String(dateObj.month).padStart(2, "0");
    const day = String(dateObj.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
