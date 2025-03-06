import React from 'react';
import Layout from '../../Components/Layout';
import { Button, Divider } from '@nextui-org/react';
import { LeftArrowIcon } from '../../../../component/Icons';
import { useNavigate } from 'react-router-dom';

function Rules() {
    const navigate = useNavigate();

    const rulesData = [
        {
            isSectionHeader: true,
            title: "กฎพื้นฐาน"
        },
        {
            title: "การใช้เหรียญต่อวัน",
            description: [
                "– ให้เหรียญได้มากที่สุดเพียง 40 เหรียญ / วัน",
                "– วันนี้คุณเสียเหรียญไปแล้ว 0/40 เหรียญ, ยอดคงเหลือที่ได้ในวันนี้คือ 40 เหรียญ"
            ]
        },
        {
            title: "ไร้ความเคลื่อนไหว",
            description: [
                "ระบบจะตัดเหรียญของคุณ 2 เหรียญ กรณีที่คุณไม่มีความเคลื่อนไหวของเหรียญเป็นเวลา 2 วัน"
            ]
        },
        {
            isSectionHeader: true,
            title: "การรับเหรียญ"
        },
        {
            title: "จากการเชตเหรียญ",
            description: [
                "เหรียญของคุณจะถูกรีเซตใหม่ทุกครั้งเมื่อเริ่มรอบใหม่ทำงานซึ่งคุณจะได้รับตั้งแต่ต้นคือ 80 เหรียญ"
            ]
        },
        {
            title: "ได้รับเหรียญขณะยกฐานะผู้ร่ำรวย",
            description: [
                "ในกรณีที่เหรียญของคุณหมด เมื่อถอนระบบจะขอคืน “เหรียญ” ของผู้ที่เสียเหรียญมากที่สุด 3 อันดับแรก มาเฉลี่ยแบ่งให้แก่ 3 อันดับรั้งท้าย"
            ]
        },
        {
            title: "รับจากการเดิมพันหรือภารกิจ",
            description: [
                "คุณสามารถรับเหรียญเพิ่มขึ้นได้จากการเดิมพันและภาระงานหรือภารการงานภายในซึ่งที่ผู้มีสมบูรณ์จะได้"
            ]
        },
        {
            isSectionHeader: true,
            title: "การสูญเสีย"
        },
        {
            title: "ในกรณีที่คุณหมดตัวหรือสิ้นสลาย",
            description: [
                "เสียใจด้วยนะ... ในเมื่อเหรียญของคุณหมดระบบจะขอรีเซตเหรียญคุณนะฮะ"
            ]
        },
        {
            title: "เคารพความถูกต้อง",
            description: [
                "ทำเวลาให้สำเร็จ เมื่อหากคุณมีเหรียญเหลือทำตามระบบ ทำคะแนนให้ครบจะได้มีที่ดีกว่าได้แค่นี้"
            ]
        }
    ];
    return (
        <Layout>
            <div className="space-y-4 px-4 py-4">
                {/* Section Header */}
                <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-2">
                    <Button isIconOnly variant='light' className="flex-shrink-0" onPress={() => navigate(-1)}>
                        <LeftArrowIcon width={16} />
                    </Button>
                    <h2 className="text-xl font-bold flex-grow text-center">Rules</h2>
                    <span className="w-8"></span>
                </div>
            </div>

            {/* Rules Section */}
            <section className="space-y-6 px-4 overflow-y-auto max-h-full scrollbar-hide">
                {rulesData.map((rule, index) => (
                    <div key={index} className={rule.isWarning ? 'bg-red-100 border border-red-300 rounded-lg p-4' : ''}>
                        {rule.isSectionHeader ? (
                            <h3 className="text-md font-semibold text-gray-800">{rule.title}</h3>
                        ) : (
                            <>
                                <h3 className={`text-md font-semibold ${rule.isWarning ? 'text-red-600 text-center' : ''}`}>{rule.title}</h3>
                                <div className={`space-y-1 ${rule.isWarning ? 'text-red-600 text-center' : 'text-gray-600'}`}>
                                    {rule.description?.map((desc, i) => (
                                        <p key={i}>{desc}</p>
                                    ))}
                                </div>
                            </>
                        )}
                        {index < rulesData.length - 1 && !rule.isSectionHeader && <Divider className="my-4" />}
                    </div>
                ))}
            </section>
        </Layout>
    );
}

export default Rules;
