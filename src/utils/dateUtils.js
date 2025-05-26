import dayjs from "dayjs";
import 'dayjs/locale/th'

export const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

/**
 * 
 * @param {Date} date วันที่ ที่ต้องการแปลง
 * @param {string} format รูปแบบที่ต้องการ ค่าเริ่มต้น YYYY-MM-DD 
 * @returns 
 */
export const CustomFormatDate = (date = dayjs(), format = 'YYYY-MM-DD') => {
    date = dayjs(date).format(format);
    return date;
}


/**
 * 
 * @param {Date} date วันที่ ที่ต้องการแปลง
 * @param {string} format รูปแบบที่ต้องการ ค่าเริ่มต้น YYYY-MM-DD HH:mm:ss'
 * @returns 
 */
export const CustomFormatDateTime = (date = dayjs(), format = 'YYYY-MM-DD HH:mm:ss') => {
    date = dayjs(date).format(format);
    return date;
}

/**
 * 
 * @param {Date} dateStr วันที่ ที่ต้องการแปลง
 * @param {'date' | 'datetime' | 'time'} type รูปแบบที่ต้องการ ค่าเริ่มต้น YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export const formatDateThai = (dateStr, type = 'date') => {
    if(dayjs(dateStr).isValid()){
      if(type === 'date'){
        return dayjs(dateStr)
            .add(543, 'year')
            .locale('th')
            .format('D MMMM YYYY');
      }else if(type === 'time'){
        return dayjs(dateStr).format('HH:mm');
      }else{
        return dayjs(dateStr)
            .add(543, 'year')
            .locale('th')
            .format('D MMMM YYYY HH:mm') 
            + ' น.';
      }
    }
    return 'Invalid Date';
}

export const formatDateObject = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.year;
    const month = String(dateObj.month).padStart(2, "0");
    const day = String(dateObj.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  export const formatMonthObject = (dateObj) => {
    if (!dateObj) return null;
    const year = dateObj.year;
    const month = String(dateObj.month).padStart(2, "0");
    return `${year}-${month}`;
  };
  
  export const formatDateRange = (dateRange) => {
    return {
      start: formatDateObject(dateRange.start),
      end: formatDateObject(dateRange.end),
    };
  };
  