import { CommissionData } from "../src/pages/Commission/Components/YearlyContent/CommissionData";

/**
* 
* @param {Array} array 
* @param {(value) => value is } predicate 
* @returns 
*/
export function moveToFirstOfArray(array = [], predicate) {
    if (array.length === 0) return [];
    const tmp = array.filter(x => predicate(x))
    const tmpArray = array.filter(x => !predicate(x));
    if (tmp) {
        tmpArray.unshift(...tmp);
    }

    return tmpArray;
}

/**
* 
* @param {Array} array 
* @param {(value) => value is } predicate 
* @returns 
*/
export function moveToLastOfArray(array = [], predicate) {
    if (array.length === 0) return [];
    const tmp = array.filter(x => predicate(x))
    const tmpArray = array.filter(x => !predicate(x));
    if (tmp) {
        tmpArray.push(...tmp);
    }

    return tmpArray;
}

/**
 * 
 * @param {[value]} array 
 * @param {String} fieldName 
 * @returns {{[]}}
 */
export function groupArray(array, fieldName) {
    return array.reduce((groups, item) => {
        let group = item[fieldName];
        group = group ?? "ไม่มีกลุ่ม"
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});
}

/**
 * 
 * @param {[Object]} array 
 * @param {[String]} fields 
 * วิธีใช้ sortArray(leaderListDisplay,[ ['departmentName','asc'],'roleLevel',['roleName','desc'] ])
 */
export function sortArrayMultiField(array, fields) {
    return array.sort((a, b) => {
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const [key, order] = Array.isArray(field) ? field : [field, 'asc'];
            const orderMultiplier = order === 'desc' ? -1 : 1;

            if (a[key] < b[key]) return -1 * orderMultiplier;
            if (a[key] > b[key]) return 1 * orderMultiplier;
        }
        return 0;
    }
    )
}

/**
 * @template T
 * @param {T[]} arr 
 * @param {String} fieldName 
 * @param {import("../src/configs/types/sorting").SORTING_STR} direction 
 * @returns {T[]}
 */
export function sortArray(arr, fieldName, direction) {
    const factor = (direction === 'descending' || direction === 'desc' || direction == '-1') ? -1 : 1; 
    return arr.sort((a, b) => {
      const first = a[fieldName];
      const second = b[fieldName];
      // ตรวจสอบว่าค่าทั้งสองเป็นตัวเลขหรือไม่
      if (!isNaN(first) && !isNaN(second)) {
        return (first - second) * factor; // ถ้าเป็นตัวเลขทั้งคู่ ให้เรียงตามค่าตัวเลข
      } else {
        return String(first).localeCompare(String(second)) * factor; // ถ้าไม่ใช่ตัวเลข ให้เรียงตามตัวอักษร
      }
    });
  }

  function ss(ar){
    return ar.sort();
  }