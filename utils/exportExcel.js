import * as XLSX from 'xlsx';
import moment from 'moment';

moment.locale('th');

/**
 * Export data to an Excel file with multiple sheets.
 * @requires fileName , 
 * @requires sheets,
 * @param {string} fileName - ชื่อไฟล์ที่จะ export.
 * @param {[ {sheetName: string, data: object} ]} sheets - เพิ่มชื่อและข้อมูลแต่ละหน้า.
 * @param {string} sheets[].sheetName - ชื่อ sheet แต่ละหน้า.
 * @param {object[]} sheets[].data - ข้อมูลในแต่ละ sheet.
 */
export function ExportExcel(fileName, sheets) {
    const workbook = XLSX.utils.book_new();
    sheets.forEach(sheet => {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);
        const columnWidths = {};
        const headerRow = Object.keys(sheet.data[0]);
        headerRow.forEach((header, i) => {
            const maxWidth = Math.max(
                header.length,
                ...sheet.data.map(row => String(row[header]).length)
            );
            columnWidths[XLSX.utils.encode_col(i)] = maxWidth + 2;
        });
        worksheet['!cols'] = Object.keys(columnWidths).map(col => ({
            wch: columnWidths[col]
        }));


        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
