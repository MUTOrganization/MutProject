export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const customerData = [
    { key: "all", label: "ทั้งหมด" },
    { key: "Champions", label: "Champions" },
    { key: "Loyalty", label: "Loyalty" },
    { key: "Potential", label: "Potential" },
    { key: "Can't Lose", label: "Can't Lose" }
];

export const columns = [
    { name: "ลูกค้า", uid: "customer" },
    { name: "RECENCY (วัน)", uid: "recency" },
    { name: "FREQUENCY", uid: "frequency" },
    { name: "MONETARY", uid: "monetary" },
    { name: "AOV", uid: "aov" },
    { name: "Segment", uid: "segment" },
    ...[1, 2, 3, 4, 5, 6].map((col) => ({
        name: `ใช้บริการ ${col}`,
        uid: `service_${col}`
    }))
];

export const INITIAL_VISIBLE_COLUMNS = ["customer", "recency", "frequency", "monetary", "aov", "segment"];

/** ฟังก์ชันกรองผู้ใช้ */
export const getFilteredUsers = (users, selectedSegment, searchQuery) => {
    return users.filter(user => {
        const matchesSegment = selectedSegment === "all" || user.segment === selectedSegment;
        const matchesSearch = searchQuery
            ? user.name.includes(searchQuery) || user.phone.includes(searchQuery)
            : true;

        return matchesSegment && matchesSearch;
    });
};

/** ฟังก์ชันกรองคอลัมน์ */
export const getHeaderColumns = (columns, visibleColumns) => {
    return columns.filter(column => visibleColumns.has(column.uid));
};
