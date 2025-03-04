import React, { createContext, useContext, useState, useEffect } from 'react';
import fetchProtectedData from '../../../../utils/fetchData';
import { useAppContext } from '../../../contexts/AppContext';
import { URLS } from '../../../config';

const TransferContext = createContext();

export const TransferProvider = ({ children }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedRemark, setSelectedRemark] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPoints, setUserPoints] = useState({ total_points: 0, total_coins: 0 });
    const [isLoadingPoints, setIsLoadingPoints] = useState(false);
    const [lastestTransfers, setLastestTransfers] = useState([]); // State ใหม่
    const [isLoadingLastestTransfers, setIsLoadingLastestTransfers] = useState(false);
    const currentUser = useAppContext();

    const remarks = [
        { type: "ด้วยความรัก 💘", description: "ไฟรักมันร้อนแรงจนลวกหัวใจ! น้ำทะเลก็ยังดับไม่ได้ หวานเจี๊ยบ!" },
        { type: "ด้วยความเบื่อ 🥴", description: "ชีวิตมันเซ็งเกินบรรยาย คะแนนก็เหมือนกองผัก ไม่รู้จะสนใจไปทำไม!" },
        { type: "ด้วยความพ่ายแพ้ 🤕", description: "แพ้แล้วไง? ไม่ร้องหรอก แค่หัวใจหักเป็นเสี่ยงๆ เอง... เจ็บจี๊ดเลย!" },
        { type: "ด้วยความสับสน 🤯", description: "นี่เราทำอะไรอยู่? หลงมาแบบงงๆ แต่อย่างน้อยก็ยังหายใจอยู่ละกัน!" },
        { type: "ด้วยความยินดี 🥳", description: "เฮ้ย! ดีใจแบบไม่ไหวแล้ว เหมือนถูกหวยรางวัลที่ 1 แต่ไม่มีเลขบอก!" },
        { type: "ด้วยความเห็นใจ 😔", description: "มานี่มา ให้กอดที! เพราะชีวิตมันไม่ง่าย แต่เราจะไม่ทิ้งคุณแน่นอน!" },
        { type: "ด้วยความประชดประชัน 😏", description: "อ้อ เก่งนะ? เก่งจริงๆ คะแนนอะไรแบบนี้ คนรวยไม่แคร์หรอก! หึ!" },
        { type: "ด้วยความชื่นชม ✨", description: "สุดปังไปเลยแม่! คุณคือไฟลุกพรึ่บกลางเวที ชนะใจไปเลยสิคะ!" },
        { type: "ด้วยความขี้เกียจ 😴", description: "ตื่นมาทำคะแนนยังเหนื่อยเลย ขอแป๊บหนึ่งนะ! เหนื่อยมากจริงๆ!" },
        { type: "ด้วยความหิวโหย 🍔", description: "คะแนนอะไรไม่รู้ แต่ตอนนี้อยากกินเบอร์เกอร์มากกก!" },
        { type: "ด้วยความหมั่นไส้ 🙄", description: "หึ เก่งเนอะ! แจกคะแนนแบบไม่คิดเลย... หมั่นไส้มาก!" },
        { type: "ด้วยความระทึกใจ 😬", description: "นี่มันเกมชีวิต! คะแนนนี้จะพลิกชะตาหรือพังทุกอย่างก็ได้!" },
        { type: "ด้วยความเสียดาย 🥹", description: "โถ่! คะแนนหายไปในอากาศ จะร้องไห้แล้ว!" },
        { type: "ด้วยความอลังการ ✨", description: "คะแนนนี้ยิ่งใหญ่เหมือนสร้างปราสาทเลย! มีตังค์ก็แจกๆ ไปสิ!" },
        { type: "ด้วยความขี้เล่น 😜", description: "คะแนนนี้ไม่มีอะไรจริงจัง! แค่ให้เพราะอยากแกล้ง!" },
        { type: "ด้วยความคิดถึง 🥹", description: "คะแนนนี้ส่งมาให้ เพราะคิดถึงแบบสุดหัวใจ!" },
        { type: "ด้วยความลุ้นระทึก 🎲", description: "คะแนนนี้เหมือนการพนัน ไม่รู้จะรอดไหม แต่ลุ้นทุกวินาที!" },
        { type: "ด้วยความตื่นเต้น 🚀", description: "โอโห! ตื่นเต้นแบบนี้เหมือนขึ้นจรวดไปดาวอังคารเลย!" },
        { type: "ด้วยความอิ่มเอม 🥰", description: "คะแนนนี้เหมือนไอติมหวานเย็น ชื่นใจที่สุด!" },
        { type: "ด้วยความมึนงง 🤔", description: "คะแนนนี้มาจากไหน? อืม... คิดไม่ออก แต่ว่าเอาไป!" },
        { type: "ด้วยความรวยล้น 💎", description: "คะแนนนี้เหมือนเศษเงินทอน... แจกเล่นๆ ไม่คิดมาก!" },
        { type: "ด้วยความอินดี้ 🧢", description: "คะแนนนี้มีความหมายเฉพาะตัว เอาไปเลย แต่คุณไม่มีทางเข้าใจ!" },
        { type: "ด้วยความฮึกเหิม 💪", description: "ไฟในตัวมันลุกโชน! แจกคะแนนแบบไม่แคร์โลก!" },
        { type: "ด้วยความเผ็ด 🌶", description: "คะแนนนี้เผ็ดร้อนเหมือนพริกสิบเม็ด! รับไปซี้ดเลย!" },
        { type: "ด้วยความขนลุก 🫣", description: "โอ้โห! คะแนนนี้ทำเอาขนลุกเกรียวเลย... รับไปแบบงงๆ!" },
        { type: "ด้วยความเวิ่นเว้อ 🎭", description: "คะแนนนี้มาจากการเวิ่นเว้อจนเกินเบอร์ แค่ให้เพราะว่างจัด!" },
        { type: "ด้วยความบ้าบอ 🤪", description: "คะแนนนี้ไม่มีเหตุผล! แค่บ้าก็แจก!" },
        { type: "ด้วยความสงสัย 🤨", description: "คะแนนนี้แจกไปแล้วทำไมต้องแจก? แต่ก็แจกไปแล้ว!" },
        { type: "ด้วยความอ่อนเพลีย 🥱", description: "คะแนนนี้ให้แบบหมดแรง... เหมือนชีวิตมันแบตหมด!" },
        { type: "ด้วยความกร้าวใจ 🔥", description: "คะแนนนี้กร้าวใจเหมือนช็อตไฟฟ้า! รับไปสะดุ้งกันไปเลย!" },
        { type: "ด้วยความฟรุ้งฟริ้ง 🌸", description: "คะแนนนี้มาพร้อมกลิ่นหอมของดอกไม้ โรแมนติกสุดๆ!" },
        { type: "ด้วยความหมั่นเขี้ยว 🐾", description: "น่ารักเกินไปละ! รับคะแนนนี้ไปแบบหมั่นเขี้ยวสุดๆ!" },
        { type: "ด้วยความพริ้วไหว 🌊", description: "คะแนนนี้ไหลเหมือนน้ำในแม่น้ำ... ให้แบบไม่มีติดขัด!" },
        { type: "ด้วยความบ้าระห่ำ 🏴‍☠️", description: "คะแนนนี้เหมือนโจรสลัดแจกสมบัติ! ลุยไปเลย!" },
        { type: "ด้วยความซึ้งใจ 😭", description: "คะแนนนี้มาพร้อมน้ำตาไหลพราก ขอบคุณมากเลยนะ!" },
        { type: "ด้วยความซ่าส์ 🍻", description: "คะแนนนี้ซ่าส์เหมือนน้ำอัดลม! ฟู่ฟ่ากันไปเลย!" },
        { type: "ด้วยความร็อค 🤘", description: "คะแนนนี้กระแทกใจเหมือนเสียงกีตาร์ไฟฟ้า! ร็อคมันส์ไปเลย!" },
        { type: "ด้วยความสายลุย 🏞", description: "คะแนนนี้มาพร้อมรองเท้าผ้าใบ! พร้อมลุยทุกสถานการณ์!" },
        { type: "ด้วยความดราม่า 🎬", description: "คะแนนนี้เหมือนซีนในหนังน้ำตาแตก! ให้แบบสุดพีค!" }
    ];

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const businessId = currentUser?.currentUser?.businessId;
            const status = 1;

            const response = await fetchProtectedData.get(
                `${URLS.users.getAll}`,
                {
                    params: { businessId, status },
                }
            );

            const filteredUsers = response.data.filter(
                (user) => user.username !== currentUser?.currentUser?.userName
            );

            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLastestTransfers = async () => {
        setIsLoadingLastestTransfers(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.weOne.getLatestTransfers}`, {
                params: { sender_username: currentUser?.currentUser?.userName },
            });

            if (response.status === 200 && response.data?.data) {
                const filteredUsers = response.data.data.filter(
                    (transfer) => transfer.receiver_username !== currentUser?.currentUser?.userName
                );

                setLastestTransfers(filteredUsers);
            } else {
                setLastestTransfers([]);
            }
        } catch (error) {
            console.error('Error fetching latest transfers:', error);
            setLastestTransfers([]);
        } finally {
            setIsLoadingLastestTransfers(false);
        }
    };

    useEffect(() => {
        if (currentUser?.currentUser?.businessId) {
            fetchUsers();
        }

        if (currentUser?.currentUser?.userName) {
            fetchLastestTransfers();
        }
    }, [currentUser]);


    const fetchUserPoints = async () => {
        setIsLoadingPoints(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.weOne.getUserPoints}`, {
                params: { username: currentUser.currentUser.userName },
            });

            if (response.status === 200) {
                setUserPoints(response.data);
            }
        } catch (error) {
            console.error('Error fetching user points:', error);
        } finally {
            setIsLoadingPoints(false);
        }
    };

    useEffect(() => {
        if (currentUser?.currentUser?.userName) {
            fetchUserPoints();
        }
    }, [currentUser]);

    return (
        <TransferContext.Provider
            value={{
                selectedUsers,
                setSelectedUsers,
                selectedRemark,
                setSelectedRemark,
                users,
                isLoading,
                fetchUsers,
                remarks,
                userPoints,
                isLoadingPoints,
                fetchUserPoints,
                lastestTransfers, // State ให้ Components อื่นใช้
                isLoadingLastestTransfers, // สถานะ Loading
                fetchLastestTransfers, // ฟังก์ชัน Fetch Lastest
            }}
        >
            {children}
        </TransferContext.Provider>
    );
};

export const useTransfer = () => {
    return useContext(TransferContext);
};
