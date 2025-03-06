export const columnsAds = [
  { name: "วันที่", uid: "date_time", sortable: true  },
  { name: "เพจ", uid: "code" , sortable: true },
  { name: "ชื่อผู้ใช้", uid: "teamAds" , sortable: true },
  { name: "ค่าแอด", uid: "ads" , sortable: true },
  { name: "จัดการ", uid: "actions" },
];

export const getUniqueUsernames = (data, key) => {
  return Array.from(new Set(data.map((item) => item[key]))).sort();
};

export const getFilteredData = (
  data,
  selectedPlatform,
  selectedUser,
  selectedPage
) => {
  let filtered = data;

  // กรองข้อมูลตามแพลตฟอร์ม
  if (selectedPlatform.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPlatform.includes(item.platform)
    );
  }

  // กรองข้อมูลตามเพจ
  if (selectedPage.length > 0) {
    filtered = filtered.filter(
      (item) =>
        selectedPage.includes(item.code) ||
        selectedPage.includes(item.saleChannelName)
    );
  }

  // กรองข้อมูลตามผู้ใช้
  if (selectedUser.length > 0) {
    filtered = filtered.filter((item) => selectedUser.includes(item.teamAds));
  }

  return filtered;
};