export const columns = [
    { name: "ชื่อ", uid: "username" },
    { name: "ยอดเงินเข้าแอดมิน", uid: "totalAmountPayAdmin", sortable: true },
    { name: "ยอดเงินเข้าอัพเซล", uid: "totalAmountPayUpSale", sortable: true },
    { name: "ยอดขายแอดมิน", uid: "totalAmountAdmin", sortable: true },
    { name: "ยอดอัพเซล", uid: "totalAdminUpSale", sortable: true },
    { name: "ยอดยกแอดมิน", uid: "totalLiftAdmin", sortable: true },
    { name: "ยอดยกอัพเซล", uid: "totalLiftUpSale", sortable: true },
    { name: "ยอดออเดอร์", uid: "totalOrder", sortable: true },
    { name: "ออเดอร์อัพเซล", uid: "totalUpSaleOrder", sortable: true },
    { name: "ยอดค่าส่งแอดมิน", uid: "deliveryAdminCost", sortable: true },
    { name: "ยอดค่าส่งอัพเซล", uid: "deliveryUpSaleCost", sortable: true },
    { name: "ยอดยกค่าส่งแอดมิน", uid: "deliveryAdminLiftCost", sortable: true },
    { name: "ยอดยกค่าส่งอัพเซล", uid: "deliveryUpSaleLiftCost", sortable: true },
];

export default columns