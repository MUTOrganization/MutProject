export function getUserName(username){
    if(typeof username !== 'string') return 'null';
    if(username.includes('_')){
        const splited = username.split('_');
        if(splited[1].trim() === ''){
            return splited[0];
        }else{
            return splited[1];
        }
    }
    return username
}

// export const letterColors = {
//     A: "#90CAF9", // สีฟ้าอ่อน
//     B: "#A5D6A7", // สีเขียวอ่อน
//     C: "#CE93D8", // สีม่วงอ่อน
//     D: "#FFAB91", // สีส้มอ่อน
//     E: "#FFCC80", // สีส้มอ่อน
//     F: "#EF9A9A", // สีแดงอ่อน
//     G: "#FFAB91", // สีส้มอ่อน
//     H: "#A5D6A7", // สีเขียวอ่อน
//     I: "#80DEEA", // สีฟ้าอ่อน
//     J: "#A5D6A7", // สีเขียวอ่อน
//     K: "#CE93D8", // สีม่วงอ่อน
//     L: "#EF9A9A", // สีแดงอ่อน
//     M: "#FFCC80", // สีส้มอ่อน
//     N: "#90CAF9", // สีฟ้าอ่อน
//     O: "#FFAB91", // สีส้มอ่อน
//     P: "#A5D6A7", // สีเขียวอ่อน
//     Q: "#80DEEA", // สีฟ้าอ่อน
//     R: "#CE93D8", // สีม่วงอ่อน
//     S: "#EF9A9A", // สีแดงอ่อน
//     T: "#FFCC80", // สีส้มอ่อน
//     U: "#90CAF9", // สีฟ้าอ่อน
//     V: "#A5D6A7", // สีเขียวอ่อน
//     W: "#CE93D8", // สีม่วงอ่อน
//     X: "#FFAB91", // สีส้มอ่อน
//     Y: "#EF9A9A", // สีแดงอ่อน
//     Z: "#80DEEA"  // สีฟ้าอ่อน
// };

export const letterColors = {
    A: "#FF7043", // สีส้ม
    B: "#FF7043", // สีส้ม
    C: "#FF7043", // สีส้ม
    D: "#66BB6A", // สีเขียว
    E: "#66BB6A", // สีเขียว
    F: "#66BB6A", // สีเขียว
    G: "#42A5F5", // สีฟ้า
    H: "#42A5F5", // สีฟ้า
    I: "#42A5F5", // สีฟ้า
    J: "#AB47BC", // สีม่วง
    K: "#AB47BC", // สีม่วง
    L: "#AB47BC", // สีม่วง
    M: "#EF5350", // สีแดง
    N: "#EF5350", // สีแดง
    O: "#EF5350", // สีแดง
    P: "#FFA726", // สีส้มอ่อน
    Q: "#FFA726", // สีส้มอ่อน
    R: "#FFA726", // สีส้มอ่อน
    S: "#26C6DA", // สีฟ้าอ่อน
    T: "#26C6DA", // สีฟ้าอ่อน
    U: "#26C6DA", // สีฟ้าอ่อน
    V: "#FF7043", // สีส้ม
    W: "#FF7043", // สีส้ม
    X: "#FF7043", // สีส้ม
    Y: "#66BB6A", // สีเขียว
    Z: "#66BB6A",  // สีเขียว

    ก: "#FF7043",
    ข: "#FF7043",
    ค: "#FF7043",
    ง: "#66BB6A",
    จ: "#66BB6A",
    ฉ: "#66BB6A",
    ช: "#42A5F5",
    ซ: "#42A5F5",
    ฌ: "#42A5F5",
    ญ: "#AB47BC",
    ฎ: "#AB47BC",
    ฏ: "#AB47BC",
    ฐ: "#EF5350",
    ฑ: "#EF5350",
    ฒ: "#EF5350",
    ณ: "#FFA726",
    ด: "#FFA726",
    ต: "#FFA726",
    ถ: "#26C6DA",
    ท: "#26C6DA",
    ธ: "#26C6DA",
    น: "#FF7043",
    บ: "#FF7043",
    ป: "#FF7043",
    ผ: "#66BB6A",
    ฝ: "#66BB6A",
    พ: "#66BB6A",
    ฟ: "#42A5F5",
    ภ: "#42A5F5",
    ม: "#42A5F5",
    ย: "#AB47BC",
    ร: "#AB47BC",
    ล: "#AB47BC",
    ฦ: "#EF5350",
    ว: "#EF5350",
    ศ: "#EF5350",
    ษ: "#EF5350",
    ส: "#FFA726",
    ห: "#FFA726",
    ฬ: "#26C6DA",
    อ: "#26C6DA",
    ฮ: "#26C6DA",
}


export function getProfileColor(username){
    if(typeof username !== 'string') return 'null';
    let name
    if(username.includes('_')){
        const splited = username.split('_');
        if(splited[1].trim() === ''){
            name = splited[0];
        }else{
            name = splited[1];
        }
    }else{
        name = username
    }
    return letterColors[name[0]?.toUpperCase()??'A']
}