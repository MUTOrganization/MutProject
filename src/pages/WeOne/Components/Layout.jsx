import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeColorIcon, NoficationColorIcon, ProfileColorIcon, CogColorIcon } from '../../../component/Icons';
import { Badge } from '@nextui-org/react';
import { useNotifications } from './NotificationContext';

function Layout({ children }) {
    const location = useLocation();

    const { unreadCount, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const navigationMap = [
        {
            path: '/weOne',
            label: 'หน้าแรก',
            icon: {
                component: HomeColorIcon,
                props: { width: 28, height: 28 },
            },
        },
        {
            path: '/WeOne-Notfication',
            label: 'การแจ้งเตือน',
            icon: {
                component: NoficationColorIcon,
                props: { width: 28, height: 28 },
            },
            badge: unreadCount, // ใช้ unreadCount จาก Context
        },
        {
            path: '/WeOne-Profile',
            label: 'โปรไฟล์',
            icon: {
                component: ProfileColorIcon,
                props: { width: 28, height: 28 },
            },
        },
        {
            path: '/WeOne-Manage',
            label: 'การจัดการ',
            icon: {
                component: CogColorIcon,
                props: { width: 28, height: 28 },
            },
        },
    ];

    return (
        <div className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto bg-[#ffffff]">
            <div className="flex-grow w-full">{children}</div>
            <div className="fixed bottom-0 z-50 flex items-center justify-around w-[100%] max-w-md px-4 py-1 bg-white border border-gray-200 shadow-lg rounded-lg">
                {navigationMap.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center"
                        >
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${isActive
                                    ? 'bg-[#74ba6b] text-white shadow-md'
                                    : 'hover:bg-[#e6f7e6] hover:text-[#74ba6b]'
                                    }`}
                            >
                                <item.icon.component {...item.icon.props} />
                                {item.badge > 0 && (
                                    <Badge
                                        content={item.badge}
                                        color="danger"
                                        shape="circle"
                                        size="md"
                                        showOutline={false}
                                        className="absolute -top-2 -right-2"
                                    />
                                )}
                            </div>
                            {item.label && (
                                <span
                                    className={`text-sm mt-1 transition-all duration-200 ${isActive ? 'text-[#52c41a] font-semibold' : 'text-gray-500 hover:text-[#52c41a]'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Layout;
