export const columns = [
    { name: "วันที่ทำรายการ", uid: "orderDate", sortable: true },
    { name: "รหัสคำสั่งซื้อ", uid: "orderNo"},
    { name: "ชื่อลูกค้า", uid: "name", sortable: true },
    { name: "ยอดชำระ", uid: "totalAmount", sortable: true },
    { name: "ประเภทการชำระเงิน", uid: "paymentType"},
    { name: "สถานะการชำระเงิน", uid: "paymentStatus"},
    { name: "ค่าปรับ", uid: "fine"},
    { name: "สถานะการปรับ", uid: "fineImposed"},
    { name: "ผู้ใช้", uid: "createBy"},
    { name: "การจัดการ", uid: "actions"},
];

export default columns