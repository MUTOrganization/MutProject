import React, { createContext, useContext, useState, useEffect } from 'react';
import fetchProtectedData from '../../../../utils/fetchData';
import { useAppContext } from '../../../contexts/AppContext';
import { URLS } from '../../../config';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0); // เพิ่ม unreadCount
    const [isLoading, setIsLoading] = useState(false);
    const currentData = useAppContext();

    const fetchNotifications = async () => {
        if (!currentData?.currentUser?.userName) {
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.weOne.getNotifications}`, {
                params: {
                    username: currentData.currentUser.userName,
                },
            });

            const groupedNotifications = response.data.notifications.reduce((acc, notification) => {
                const date = new Date(notification.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });

                if (!acc[date]) acc[date] = [];
                acc[date].push(notification);

                return acc;
            }, {});

            const formattedNotifications = Object.keys(groupedNotifications).map((date) => ({
                date,
                items: groupedNotifications[date],
            }));

            setNotifications(formattedNotifications);

            // คำนวณ unreadCount ใหม่
            const count = response.data.notifications.filter((item) => item.is_read === 0).length;
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await fetchProtectedData.post(`${URLS.weOne.readNotification}`, {
                notificationIds: [id],
            });

            if (response.status === 200) {
                // อัปเดต is_read และ unreadCount ใน state
                setNotifications((prev) =>
                    prev.map((group) => ({
                        ...group,
                        items: group.items.map((item) =>
                            item.id === id ? { ...item, is_read: 1 } : item
                        ),
                    }))
                );

                // ลด unreadCount ทันที
                setUnreadCount((prevCount) => prevCount - 1);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };
    
    useEffect(() => {
        if (currentData?.currentUser?.userName) {
            fetchNotifications();
        }
    }, [currentData?.currentUser?.userName]);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, isLoading, fetchNotifications, markAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    return useContext(NotificationContext);
};
