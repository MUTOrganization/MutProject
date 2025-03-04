import moment from "moment-timezone";

export const getMonthNames = () => {
  return [
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
};

export function getCurrentWeekNumber() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const weekNumber = Math.ceil(
    (today.getDate() + firstDayOfMonth.getDay()) / 7
  );
  return weekNumber;
}

export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

export const getDayBeforeYesterdayDate = () => {
  const dayBeforeYesterday = new Date();
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  return dayBeforeYesterday.toISOString().split("T")[0];
};

export const getFirstDayOfMonth = () => {
  const firstDate = new Date();
  firstDate.setDate(1);
  return firstDate.toISOString().split("T")[0];
};

export const getLastDayOfMonth = () => {
  const lastDate = new Date();
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(0);
  return lastDate.toISOString().split("T")[0];
};

export const getFirstDayOfMonthAgo = () => {
  const firstDate = new Date();
  firstDate.setMonth(firstDate.getMonth() - 1);
  firstDate.setDate(1);
  return firstDate.toISOString().split("T")[0];
};

export const getFirstDateOfMonthAgo = () => {
  const firstDate = new Date();
  firstDate.setMonth(firstDate.getMonth() - 1);
  firstDate.setDate(1);
  return firstDate.getDate().toString().padStart(1);
};

export const getTodayAndLastMonthSameDay = () => {
  const today = new Date();
  const lastMonthSameDay = new Date(today);

  lastMonthSameDay.setMonth(today.getMonth() - 1);

  if (lastMonthSameDay.getMonth() === today.getMonth()) {
    lastMonthSameDay.setDate(0);
  }
  lastMonthSameDay.setHours(-1);
  return lastMonthSameDay.toISOString().split("T")[0];
};

export const getTodayAndLastMonthSameDaySale = () => {
  const today = new Date();
  const lastMonthSameDay = new Date();

  lastMonthSameDay.setMonth(today.getMonth() - 1);

  // ตรวจสอบว่าเดือนที่แล้วมีวันน้อยกว่าเดือนนี้หรือไม่
  if (lastMonthSameDay.getDate() < today.getDate()) {
    // ตั้งค่าวันสุดท้ายของเดือนที่แล้ว
    lastMonthSameDay.setMonth(lastMonthSameDay.getMonth() + 1);
    lastMonthSameDay.setDate(0);
  }

  return lastMonthSameDay.toISOString().split("T")[0];
};

export const getYesterdayAndLastMonthSameDaySale = () => {
  const today = new Date();
  const lastMonthSameDay = new Date(today);

  lastMonthSameDay.setMonth(today.getMonth() - 1);

  // ตรวจสอบว่าเดือนที่แล้วมีวันน้อยกว่าเดือนนี้หรือไม่
  if (lastMonthSameDay.getDate() < today.getDate()) {
    // ตั้งค่าวันสุดท้ายของเดือนที่แล้ว
    lastMonthSameDay.setMonth(lastMonthSameDay.getMonth() + 1);
    lastMonthSameDay.setDate(0);
  }

  // ลดวันลงหนึ่งวันเพื่อให้เป็นวันเมื่อวานของเดือนที่แล้ว
  lastMonthSameDay.setDate(lastMonthSameDay.getDate() - 1);

  return lastMonthSameDay.toISOString().split("T")[0];
};

export const getDateAgo = (date) => {
  const inputDate = new Date(date);
  inputDate.setMonth(inputDate.getMonth() - 1);
  // ถ้าเดือนเป็นมกราคม (0) และเดือนที่แล้วคือธันวาคม (11)
  if (inputDate.getMonth() === -1) {
    inputDate.setFullYear(inputDate.getFullYear() - 1);
    inputDate.setMonth(11);
  }
  inputDate.setDate(1);
  return inputDate.toISOString().split("T")[0];
};

export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const getCurrentMonthAndYear = () => {
  const today = new Date();
  const year = today.getFullYear(); // หา ปี ปัจจุบัน
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // หา เดือนปัจจุบัน (เพิ่ม 1 เพราะ getMonth() คืนค่าตั้งแต่ 0-11)
  return `${year}-${month}`;
};

export const getYesterdayDateFromGivenDate = (date) => {
  const givenDate = new Date(date);
  givenDate.setDate(givenDate.getDate() - 1);
  return givenDate.toISOString().split("T")[0];
};

export const getFirstDateofYear = () => {
  const firstDate = new Date();
  firstDate.setMonth(0);
  firstDate.setDate(1);
  return firstDate.toISOString().split("T")[0];
};
export const formatDateThaiAndTime = (dateStr) => {
  const months = [
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

  const date = new Date(dateStr); // แปลง string เป็น Date object

  const day = date.getDate(); // ดึงวันที่
  const month = date.getMonth(); // ดึงเดือน (0-11)
  const year = date.getFullYear() + 543; // ดึงปีและเพิ่ม 543 เพื่อแปลงเป็นพุทธศักราช (พ.ศ.)

  const hours = date.getHours(); // ดึงชั่วโมง
  const minutes = date.getMinutes().toString().padStart(2, "0"); // ดึงนาที และเติม 0 ข้างหน้าถ้าน้อยกว่า 10

  return `${day} ${months[month]} ${year} ${hours}:${minutes} น.`; // ส่งผลลัพธ์รูปแบบ DD/MM/YYYY HH:MM
};

export const formatDateThai = (dateStr) => {
  if (!dateStr) return "-"; // ป้องกัน error ถ้า dateStr เป็น undefined หรือ null

  const months = [
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

  const dateParts = dateStr.split("-");
  if (dateParts.length !== 3) return "-"; // ป้องกัน error ถ้า format ไม่ถูกต้อง

  const [year, month, day] = dateParts.map((num) => parseInt(num, 10));
  if (isNaN(year) || isNaN(month) || isNaN(day)) return "-"; // ตรวจสอบว่าข้อมูลเป็นตัวเลขจริง

  return `${day} ${months[month - 1]} ${year + 543}`;
};

export const formatHopefulHeroes = (dateStr) => {
  const days = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];

  const months = [
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

  const dateObj = new Date(dateStr);
  const dayOfWeek = days[dateObj.getDay()];
  const [year, month, day] = dateStr.split("-");

  return `${dayOfWeek} ที่ ${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${
    parseInt(year, 10) + 543
  }`;
};

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
export const formatDayOnly = (dateStr) => {
  const date = new Date(dateStr);
  return date.getDate(); // ดึงเฉพาะวันที่ เช่น 17
};

export const formatMonthThai = (dateStr) => {
  const months = [
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

  const [year, month] = dateStr.split("-");
  return `${months[parseInt(month, 10) - 1]} ${parseInt(year, 10) + 543}`;
};


export const formatMonthThaiandYear = (dateStr) => {
  const months = [
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

  const [year, month] = dateStr.split("-");
  return `ปี ${parseInt(year, 10)}`;
};

export const convertToThaiTimeFetch = (dateStr) => {
  return moment.tz(dateStr, "Asia/Bangkok").format("YYYY-MM-DD");
};

export const getLastMonthRange = () => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  lastMonth.setHours(0, 0, 0, 0); // ตั้งเวลาให้เป็น 00:00:00
  const startDate = lastMonth.toISOString().split("T")[0];

  // หาจำนวนวันในเดือนที่แล้ว
  const lastDayOfLastMonth = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
    0
  ).getDate();

  // ตรวจสอบวันที่ปัจจุบัน
  const endDate =
    now.getDate() > lastDayOfLastMonth
      ? new Date(
          lastMonth.getFullYear(),
          lastMonth.getMonth(),
          lastDayOfLastMonth
        )
          .toISOString()
          .split("T")[0]
      : new Date(lastMonth.getFullYear(), lastMonth.getMonth(), now.getDate())
          .toISOString()
          .split("T")[0];

  return { startDate, endDate };
};

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

export const defaultDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() เริ่มจาก 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
