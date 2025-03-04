// utils/readFileData.js
import * as XLSX from "xlsx";

/**
 * อ่านไฟล์ Excel/CSV แล้วส่งกลับเป็น Array-of-Array (AOA)
 * @param {File} file - ไฟล์จาก input type="file"
 * @returns {Promise<Array<Array<any>>>}
 */
export async function readFileData(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const extension = file.name.split(".").pop().toLowerCase();

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      try {
        let workbook;
        if (extension === "csv") {
          // CSV ให้อ่านเป็น text แล้ว XLSX.read type = "string"
          workbook = XLSX.read(data, { type: "string" });
        } else {
          // XLS/XLSX ให้อ่านเป็น binary
          workbook = XLSX.read(data, { type: "binary" });
        }
        // เลือกชีตแรก
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        // AOA
        const aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(aoa);
      } catch (error) {
        reject(error);
      }
    };

    if (extension === "csv") {
      reader.readAsText(file, "utf-8");
    } else {
      reader.readAsBinaryString(file);
    }
  });
}
