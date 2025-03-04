export const columns = [
  { name: "เดือนเเละปี", uid: "orderMonthyear", sortable: true },
  { name: "ชื่อสินค้า", uid: "productName", sortable: true },
  { name: "รหัสสินค้า", uid: "orderNo", sortable: true },
  { name: "ชื่อตัวเเทน", uid: "agent" , sortable: true},
  { name: "รหัสตัวเเทน", uid: "agentCode" , sortable: true},
  { name: "จำนวนกล่อง", uid: "qty" , sortable: true},
  { name: "ยอดขาย", uid: "totalPrice", sortable: true },
  { name: "ประเภทสินค้า", uid: "type", sortable: true },

];


export const statusOptions = ["สินค้าขาย", "สินค้าแถม"];


export const statusColorMap = {
  สินค้าขาย: "success",
  สินค้าเเถม: "primary",
};




export const columnsettingSaleProd = [
  { name: "ชือรายการ", uid: "name", sortable: true },
  { name: "ราคาขาย", uid: "price", sortable: true },

];

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}



