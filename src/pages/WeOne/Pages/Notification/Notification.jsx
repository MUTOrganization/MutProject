import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import { Avatar, AvatarGroup } from '@nextui-org/react';
import { useNotifications } from '../../Components/NotificationContext';
import UserProfileAvatar from '../../../../component/UserProfileAvatar';
import { SmilelyColorIcon } from '../../../../component/Icons'

function Notification() {
    const { notifications, fetchNotifications, markAsRead } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, [])

    return (
        <Layout>
            <div className="p-4 space-y-6 h-screen">
                {notifications.length > 0 ? (
                    <div className="overflow-y-auto max-h-[100vh] pb-24 space-y-6 scrollbar-hide">
                        {notifications.map((notificationGroup, index) => (
                            <div key={index} className="space-y-4">
                                {/* Date Header */}
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {notificationGroup.date === new Date().toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                        ? 'วันนี้'
                                        : notificationGroup.date}
                                </h3>
                                {notificationGroup.items.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-[auto,1fr] gap-4 py-1 ${item.is_read === 0 ? 'bg-blue-50 border-blue-200' : ''} ${idx === notificationGroup.items.length - 1 ? 'border-b-2 border-dashed border-gray-200 rounded-lg pb-2' : ''
                                            }`}
                                        onClick={() => markAsRead(item.id)}
                                    >
                                        {/* Avatar Section */}
                                        <div className="flex items-center justify-center">
                                            {item.displayImgUrls && item.displayImgUrls.length > 0 ? (
                                                <AvatarGroup max={3} size="md" className="flex-shrink-0">
                                                    {item.data?.receiver_usernames.map((username, idx) => (
                                                        <UserProfileAvatar
                                                            key={idx}
                                                            name={username} // ส่ง username เพื่อแสดงตัวอักษรตัวแรก
                                                            imageURL={item.displayImgUrls[idx] || undefined} // หากไม่มี URL ให้ส่ง undefined
                                                            size="lg"
                                                        />
                                                    ))}
                                                </AvatarGroup>
                                            ) : (
                                                <UserProfileAvatar
                                                    name={item.data?.sender_username || 'SYSTEM'}
                                                    imageURL={item.senderImage || undefined}
                                                    size="lg"
                                                />
                                            )}
                                        </div>

                                        {/* Notification Content */}
                                        <div className="flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        (() => {
                                                            const nickNames = item.nickNames || [];
                                                            const message = item.message.replace(/ด้วยเหตุผล:.*/, '').trim(); // ลบ "ด้วยเหตุผล:" และส่วนท้าย
                                                            const usernamesMatch = message.match(/ให้กับผู้ใช้: (.*?)( |$)/); // จับข้อความ "ให้กับผู้ใช้: ..."

                                                            if (usernamesMatch) {
                                                                const usernames = usernamesMatch[1].split(', '); // แยกชื่อผู้ใช้จากข้อความ
                                                                const replacedNames = usernames.map((username, idx) => nickNames[idx] || username); // ใช้ nickNames ถ้ามี
                                                                return message.replace(/ให้กับผู้ใช้: (.*?)( |$)/, `ให้กับผู้ใช้: ${replacedNames.join(', ')} `);
                                                            }

                                                            return message; // ถ้าไม่มี "ให้กับผู้ใช้" ให้แสดงข้อความเดิม
                                                        })()
                                                    }
                                                </p>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(item.created_at).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            {item.data?.reason && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    เหตุผล: {item.data.reason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-screen text-center">
                        <SmilelyColorIcon className="mb-4" width={32} height={32} />
                        <p className="text-gray-500">ยังไม่มีการแจ้งเตือนเร็วๆนี้</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Notification;
