export const columns = [
    { name: "ชื่อ", uid: "username"},
    { name: "ยอดเงินเข้า", uid: "totalNetAmount", sortable: true },
    { name: "ยอดยก", uid: "totalLiftCost", sortable: true },
    { name: "ยอดยกไปเดือนหน้า", uid: "totalNextLiftAmount", sortable: true },
    { name: "ค่าส่งสุทธิ", uid: "totalDelivery", sortable: true },
    { name: "ยอดยกค่าส่ง", uid: "totalDeliveryUpSale", sortable: true },
    { name: "ยอดยกค่าส่งไปเดือนหน้า", uid: "deliveryLiftAmountAdminNextMonth", sortable: true },
    { name: "ยอดเงินเข้าสุทธิ", uid: "totalNetAmountSumLiftCost", sortable: true },
    { name: "ยอดค่าส่งสุทธิ", uid: "totalNetDeliveryCost", sortable: true },
    { name: "ยอดเงินสุทธิ", uid: "totalAmount", sortable: true },
    { name: "ค่าคอม", uid: "totalNetIncome", sortable: true },
    { name: "", uid: "detail"},
];

export default columns