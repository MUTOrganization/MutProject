import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import { Card, CardBody, Button, Badge, Image, Chip, useDisclosure, Textarea } from '@nextui-org/react';
import { AlertQuestion } from '../../../../component/Alert'
import { CoinColorIcon, LeftArrowIcon, SmilelyColorIcon, AlertColorIcon } from '../../../../component/Icons';
import { useNavigate } from 'react-router-dom';
import fetchProtectedData from '../../../../../utils/fetchData';
import CountdownComponent from '../../Components/CountdownComponent';
import { convertToThaiTimeFetch } from '../../../../component/DateUtiils';
import { useAppContext } from '../../../../contexts/AppContext';
import { useTransfer } from '../../Components/TransferContext';
import { URLS } from '../../../../config';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from '@nextui-org/react';

function Quests() {
    const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
    const [selectedType, setSelectedType] = useState('all');
    const [selectedQuest, setSelectedQuest] = useState(null);
    const [questData, setQuestData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [evidenceFile, setEvidenceFile] = useState(null); // สำหรับเก็บไฟล์
    const [description, setDescription] = useState(''); // เก็บคำอธิบาย
    const [isError, setIsError] = useState(false);
    const { userPoints, isLoadingPoints, fetchUserPoints } = useTransfer();

    const currentData = useAppContext();

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserPoints();
    }, [])

    const fetchQuestsData = async () => {
        setIsLoading(true);
        try {
            const response = await fetchProtectedData.get(`${URLS.weOne.getQuestUser}`, {
                params: {
                    business_id: currentData.currentUser.businessId,
                    username: currentData.currentUser.userName, // ส่ง username ไปกรองข้อมูล
                },
            });

            const currentDate = new Date();
            const updatedData = response.data.map((quest) => {
                // ตรวจสอบสถานะ ongoing
                if (quest.accepted_status === 'ongoing') {
                    return { ...quest, type: 'ongoing' };
                }
                // ตรวจสอบสถานะ completed
                if (quest.accepted_status === 'completed') {
                    return { ...quest, type: 'completed' };
                }
                // ตรวจสอบสถานะ returned
                if (quest.accepted_status === 'returned') {
                    return { ...quest, type: 'all' }; // นำกลับไปอยู่ในแท็บ "all"
                }
                // ตรวจสอบภารกิจที่หมดเวลา
                if (new Date(quest.due_date) < currentDate) {
                    return { ...quest, type: 'expired' };
                }
                // เควสต์ที่ยังไม่ได้รับ
                if (!quest.accepted_status) {
                    return { ...quest, type: 'all' };
                }

                // จัดการ image_link (ถ้าเป็น array อยู่แล้ว ไม่ต้องแปลง)
                if (!Array.isArray(quest.image_link)) {
                    quest.image_link = []; // ถ้าไม่มีค่าให้ตั้งเป็น array ว่าง
                }

                return quest;
            });

            setQuestData(updatedData || []);
        } catch (error) {
            console.error('Error fetching quests:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const renderEvidenceImages = (images) => {
        if (!images || images.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Evidence ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg shadow"
                    />
                ))}
            </div>
        );
    };

    useEffect(() => {
        fetchQuestsData();
    }, [currentData.currentUser.businessId]);

    const handleButtonPress = (type) => {
        setSelectedType(type);
    };

    const handleCardClick = (quest) => {
        if (quest) {
            setSelectedQuest(quest);
            onOpen();
        }
    };

    const handleConfirmQuest = async () => {
        setIsAccepting(true);
        try {
            if (selectedQuest.type === 'ongoing') {
                // กดยกเลิกภารกิจ
                await handleCancelQuest();
            } else {
                // รับภารกิจใหม่หรือรับภารกิจที่เคยยกเลิก
                const response = await fetchProtectedData.post(
                    `${URLS.weOne.acceptQuestUser}`,
                    {
                        username: currentData.currentUser.userName,
                        quest_id: selectedQuest.id,
                    }
                );

                if (response.status === 201 || response.status === 200) {
                    await fetchQuestsData();
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error processing quest:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleCancelQuest = async () => {
        setIsAccepting(true);
        try {
            const response = await fetchProtectedData.post(
                `${URLS.weOne.cancelQuestUser}`,
                {
                    username: currentData.currentUser.userName,
                    quest_id: selectedQuest.id,
                }
            );

            if (response.status === 200) {
                await fetchQuestsData(); // รีเฟรชข้อมูล
                handleModalClose(); // ปิด Modal
            }
        } catch (error) {
            console.error('Error canceling quest:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleCompleteQuest = async () => {
        if (!evidenceFile) {
            setIsError(true); // ตั้งค่าให้มีข้อผิดพลาด
            return;
        }

        setIsAccepting(true);
        setIsError(false); // ล้างข้อผิดพลาดเมื่อมีการเพิ่มรูปภาพแล้ว

        try {
            const formData = new FormData();
            formData.append('username', currentData.currentUser.userName);
            formData.append('quest_id', selectedQuest.id);
            formData.append('description', description);
            formData.append('file', evidenceFile);

            const response = await fetchProtectedData.post(
                `${URLS.weOne.completedQuestUser}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
                await fetchQuestsData();
                setDescription('');
                setEvidenceFile(null);
                onClose();
            }
        } catch (error) {
            console.error('Error completing quest:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleUpdatePendingQuest = async () => {
        setIsAccepting(true);
        const isDescriptionChanged = description !== selectedQuest?.accepted_description;
        const isFileChanged = !!evidenceFile;

        // ส่งค่าทั้ง description และ image_link (ใช้ค่าดั้งเดิมถ้าไม่มีการเปลี่ยนแปลง)
        const formData = new FormData();
        formData.append('username', currentData.currentUser.userName);
        formData.append('quest_id', selectedQuest.id);

        formData.append(
            'description',
            isDescriptionChanged ? description : selectedQuest.accepted_description
        );

        if (isFileChanged) {
            formData.append('file', evidenceFile); // ใช้ไฟล์ใหม่ถ้ามี
        } else if (selectedQuest?.image_link?.length > 0) {
            formData.append('existingImage', selectedQuest.image_link[0]); // ใช้ URL เดิมถ้าไม่มีการเปลี่ยนแปลง
        }

        try {
            const response = await fetchProtectedData.put(
                `${URLS.weOne.updateQuestUser}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (response.status === 200) {
                await fetchQuestsData(); // ดึงข้อมูลใหม่มาแสดง
                onClose();
            }
        } catch (error) {
            console.error('Error updating quest:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    const handleModalClose = () => {
        setEvidenceFile(null);
        setDescription('');
        setIsError(false);
        onClose();
    };

    const formatDateTime = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleString('th-TH', options);
    };

    const filteredQuests = questData.filter((quest) => {
        if (selectedType === 'all') return quest.type === 'all';
        if (selectedType === 'ongoing') return quest.type === 'ongoing';
        if (selectedType === 'completed') return quest.type === 'completed';
        if (selectedType === 'expired') return quest.type === 'expired';
        return false;
    });

    return (
        <Layout>
            <div className="relative w-full">
                <div className="relative w-full h-3/4">
                    <Button
                        isIconOnly
                        variant="light"
                        className="absolute top-4 left-4 z-20 bg-white rounded-full shadow-lg"
                        onPress={() => navigate(-1)}
                    >
                        <LeftArrowIcon width={16} />
                    </Button>

                    <Image
                        alt="Image"
                        src="/img/background-1.jpeg"
                        className="w-full h-full object-cover rounded-b-3xl rounded-t-none"
                    />
                </div>
            </div>
            <section className="absolute top-24 left-1/2 transform -translate-x-1/2 w-11/12 z-20 space-y-3">
                <Card radius="lg" shadow="none" className="bg-[#fcf9e3] shadow-sm p-2">
                    <CardBody className='p-1'>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-xl font-semibold text-yellow-600">คะแนนของฉัน</p>
                            <div className="flex items-baseline justify-end space-x-1">
                                <p className="text-xl font-bold text-blue-600">{userPoints.total_points}</p>
                            </div>
                        </div>
                        <div className="border-t-2 border-dashed border-gray-300 my-2"></div>
                        <div className="space-y-2 text-center">
                            <p className="text-sm font-bold text-green-600">
                                อย่าหยุดพยายาม เพราะสิ่งที่ดีที่สุดกำลังรอคุณอยู่ 🌈
                            </p>
                            <p className="text-sm font-semibold text-teal-700">
                                ทุกก้าวที่คุณเดินคือความสำเร็จที่ใกล้เข้ามา 🏞️✨
                            </p>
                            <p className="text-lg text-gray-600 font-bold italic">
                                "เพราะวิธีคิด สำคัญกว่าวิธีการ"
                            </p>
                        </div>
                    </CardBody>
                </Card>
                <div className="flex flex-wrap overflow-hidden max-w-full">
                    <section className="flex space-x-4 overflow-x-auto scrollbar-hide whitespace-nowrap">
                        {[
                            { type: 'all', label: 'กิจกรรมทั้งหมด' },
                            { type: 'ongoing', label: 'รับกิจกรรมแล้ว' },
                            { type: 'completed', label: 'สำเร็จแล้ว' },
                            { type: 'expired', label: 'หมดเวลา' },
                        ].map(({ type, label }) => (
                            <div className="flex-shrink-0" key={type}>
                                <Button
                                    color="primary"
                                    variant={selectedType === type ? 'flat' : 'bordered'}
                                    radius="full"
                                    className="flex items-center justify-center px-4 py-4 text-sm font-semibold space-x-2"
                                    onPress={() => handleButtonPress(type)}
                                >
                                    <span>{label}</span>
                                    <Badge
                                        content={questData.filter((quest) => quest.type === type).length}
                                        shape="circle"
                                        showOutline={false}
                                        className="bg-[#ff4b63] ml-2 text-white"
                                    />
                                </Button>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="flex flex-col h-[60vh] overflow-hidden max-w-full">
                    <section className="flex-grow space-y-4 overflow-y-auto pb-16 scrollbar-hide">
                        {filteredQuests.length > 0 ? (
                            filteredQuests.map((quest, index) => {
                                const isNotStarted = new Date(quest.start_date) > new Date();
                                const isExpired = new Date(quest.due_date) < new Date();

                                return (
                                    <div
                                        key={quest.id}
                                        onClick={isNotStarted || quest.type === 'expired' ? undefined : () => handleCardClick(quest)}
                                        className={`cursor-pointer ${isNotStarted || quest.type === 'expired' ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <div className="bg-white p-2">
                                            <p className="text-md font-semibold text-gray-900">{quest.quest_title}</p>
                                            <p className="text-sm text-gray-500">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">
                                                        วันที่สิ้นสุด :{' '}
                                                        {formatDateTime(quest.due_date)}
                                                    </span>{' '}
                                                    {new Date(quest.start_date) > new Date() ? (
                                                        <span className="font-semibold">
                                                            จะเริ่มในอีก:{' '}
                                                            <CountdownComponent
                                                                startDate={new Date()}
                                                                endDate={convertToThaiTimeFetch(quest.start_date)}
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span className="font-semibold">
                                                            เวลาคงเหลือ:{' '}
                                                            <CountdownComponent
                                                                startDate={convertToThaiTimeFetch(quest.start_date)}
                                                                endDate={convertToThaiTimeFetch(quest.due_date)}
                                                            />
                                                        </span>
                                                    )}

                                                </div>
                                            </p>
                                            <div className="flex space-x-2 mt-4 items-center">
                                                <Chip
                                                    className="flex items-center justify-center space-x-1 px-2 py-1 bg-[#e7effe]"
                                                    startContent={<CoinColorIcon />}
                                                    variant="flat"
                                                    size='sm'
                                                >
                                                    <div className="flex flex-row space-x-2">
                                                        <p className="text-sm font-semibold text-[#e3c04c]">
                                                            {quest.coins}
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-900">เหรียญ</p>
                                                    </div>
                                                </Chip>
                                                <Chip
                                                    className="flex items-center justify-center space-x-1 px-2 py-1 bg-[#e7effe]"
                                                    variant="flat"
                                                    size='sm'
                                                >
                                                    <div className="flex flex-row space-x-2">
                                                        <p className="text-sm font-semibold text-blue-600">
                                                            {quest.points}
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-900">คะแนน</p>
                                                    </div>
                                                </Chip>
                                                {quest.type === 'ongoing' && (
                                                    <Button
                                                        className="flex items-center justify-center space-x-1 px-2 py-1 bg-danger-50"
                                                        variant="flat"
                                                        size="sm"
                                                        radius="lg"
                                                        onPress={() => {
                                                            const updatedQuest = { ...quest, action: 'cancel' };
                                                            setSelectedQuest(updatedQuest);
                                                            onOpen();
                                                        }}
                                                    >
                                                        <div className="flex flex-row space-x-2">
                                                            <p className="text-md font-semibold text-danger-500">ยกเลิกภารกิจ</p>
                                                        </div>
                                                    </Button>
                                                )}
                                                {quest.type === 'completed' && (
                                                    <Chip
                                                        className="flex items-center justify-center space-x-1 px-2 py-1"
                                                        variant="flat"
                                                        size='sm'
                                                        color={
                                                            quest.pending_status === 'approved'
                                                                ? 'success'
                                                                : quest.pending_status === null || quest.pending_status === 'pending'
                                                                    ? 'warning'
                                                                    : 'success'
                                                        }
                                                    >
                                                        <div className="flex flex-row space-x-2">
                                                            <p
                                                                className={`text-sm font-semibold ${quest.pending_status === 'approved'
                                                                    ? 'text-green-600'
                                                                    : quest.pending_status === null || quest.pending_status === 'pending'
                                                                        ? 'text-yellow-600'
                                                                        : 'text-gray-900'
                                                                    }`}
                                                            >
                                                                {quest.pending_status === null || quest.pending_status === 'pending'
                                                                    ? 'รอตรวจสอบ'
                                                                    : quest.pending_status === 'approved'
                                                                        ? 'ตรวจสอบแล้ว'
                                                                        : quest.pending_status}
                                                            </p>
                                                        </div>
                                                    </Chip>
                                                )}
                                                {quest.type === 'all' && (
                                                    <Chip
                                                        className="flex items-center justify-center space-x-1 px-3 py-1"
                                                        variant="flat"
                                                        size='sm'
                                                        color={isNotStarted ? 'warning' : isExpired ? 'error' : 'success'}
                                                    >
                                                        <div className="flex flex-row space-x-2">
                                                            <p
                                                                className={`text-sm font-semibold ${isNotStarted
                                                                    ? 'text-yellow-600'
                                                                    : isExpired
                                                                        ? 'text-red-600'
                                                                        : 'text-green-600'
                                                                    }`}
                                                            >
                                                                {isNotStarted
                                                                    ? 'ยังไม่เริ่ม'
                                                                    : isExpired
                                                                        ? 'กิจกรรมหมดเวลาแล้ว'
                                                                        : 'เข้าร่วมเลย'}
                                                            </p>
                                                        </div>
                                                    </Chip>
                                                )}
                                            </div>
                                        </div>
                                        {index < questData.length - 1 && (
                                            <div className="border-t-2 border-dashed border-gray-300 my-2"></div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <SmilelyColorIcon className="mb-4" width={32} height={32} />
                                <p className="text-gray-500">ไม่พบข้อมูล</p>
                            </div>
                        )}
                    </section>

                </div>
            </section>
            <Modal isOpen={isModalOpen} onOpenChange={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            {/* Header */}
                            <ModalHeader>
                                {selectedQuest?.pending_status === 'pending'
                                    ? '✏️ แก้ไขรายละเอียดกิจกรรม'
                                    : selectedQuest?.pending_status === 'approved'
                                        ? '🎉 รายละเอียดกิจกรรมที่อนุมัติแล้ว'
                                        : selectedQuest?.type === 'completed'
                                            ? '🎉 รายละเอียดกิจกรรมที่สำเร็จ'
                                            : selectedQuest?.type === 'ongoing'
                                                ? selectedQuest?.action === 'cancel'
                                                    ? '❌ ยกเลิกกิจกรรม'
                                                    : '✅ ยืนยันการทำกิจกรรม'
                                                : '✅ ยืนยันการรับกิจกรรม'}
                            </ModalHeader>

                            {/* Body */}
                            <ModalBody>
                                {selectedQuest?.pending_status === 'pending' || selectedQuest?.pending_status === 'approved' ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <p className="text-md text-gray-600">รายละเอียดกิจกรรม:</p>
                                        <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md">
                                            {evidenceFile || (selectedQuest?.image_link && selectedQuest.image_link.length > 0) ? (
                                                <div className="flex flex-col items-center">
                                                    <img
                                                        src={
                                                            evidenceFile
                                                                ? URL.createObjectURL(evidenceFile)
                                                                : selectedQuest?.image_link[0]
                                                        }
                                                        alt="Evidence"
                                                        className="w-64 h-64 object-cover rounded-md cursor-pointer"
                                                        onClick={() => {
                                                            if (selectedQuest?.pending_status === 'pending') {
                                                                document.getElementById('imageUpload').click();
                                                            }
                                                        }}
                                                    />
                                                    {selectedQuest?.pending_status === 'pending' && (
                                                        <p className="text-sm text-gray-500 mt-2">กดที่รูปเพื่อเปลี่ยนรูป</p>
                                                    )}
                                                    <input
                                                        id="imageUpload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => setEvidenceFile(e.target.files[0])}
                                                    />
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="imageUpload"
                                                    className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer"
                                                >
                                                    <p className="text-gray-500">กดเพื่อเพิ่มรูปภาพ</p>
                                                    <input
                                                        id="imageUpload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => setEvidenceFile(e.target.files[0])}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <Textarea
                                            className="text-md font-semibold text-gray-800"
                                            size="lg"
                                            placeholder={description || selectedQuest?.accepted_description || ''}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            isReadOnly={selectedQuest?.pending_status === 'approved'}
                                        />
                                    </div>
                                ) : selectedQuest?.type === 'ongoing' ? (
                                    selectedQuest?.action === 'cancel' ? (
                                        <div className="flex flex-col items-center">
                                            <p className="text-md text-gray-600 mb-4">คุณต้องการยกเลิกกิจกรรมนี้หรือไม่?</p>
                                            <p className="text-lg font-semibold text-red-600">{selectedQuest?.quest_title}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-4">
                                            <p className="text-md text-gray-600 mb-4">กรุณาเพิ่มรายละเอียดและหลักฐานของคุณเพื่อยืนยันการทำกิจกรรม</p>
                                            <label
                                                className={`border-2 border-dashed ${isError ? 'border-red-500' : 'border-gray-300'} p-4 text-center cursor-pointer rounded-md`}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        setEvidenceFile(e.target.files[0]);
                                                        setIsError(false);
                                                    }}
                                                />
                                                {!evidenceFile ? (
                                                    <p className={`${isError ? 'text-red-500' : ''}`}>{isError ? 'กรุณาเพิ่มรูปหลักฐาน' : 'กดตรงนี้เพื่อเพิ่มรูปภาพ'}</p>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={URL.createObjectURL(evidenceFile)}
                                                            alt="Selected"
                                                            className="w-64 h-64 object-cover rounded-md"
                                                        />
                                                        <p className="text-sm text-gray-500 mt-2">กดอีกครั้งเพื่อเปลี่ยนรูป</p>
                                                    </div>
                                                )}
                                            </label>
                                            <Textarea
                                                placeholder="กรอกรายละเอียดเพิ่มเติม"
                                                variant="bordered"
                                                size="lg"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <p className="text-md text-gray-600 mb-4">คุณต้องการรับกิจกรรมนี้หรือไม่?</p>
                                        <p className="text-lg font-semibold text-blue-600 py-2">{selectedQuest?.quest_title}</p>
                                        <Textarea
                                            value={selectedQuest?.description || 'ไม่มีรายละเอียด'}
                                            size="lg"
                                            isReadOnly
                                        />
                                    </div>
                                )}
                            </ModalBody>

                            {/* Footer */}
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    ปิด
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => {

                                        if (selectedQuest?.type === 'ongoing') {
                                            if (selectedQuest?.action === 'cancel') {
                                                handleCancelQuest();
                                            } else {
                                                console.log("Calling handleCompleteQuest");
                                                handleCompleteQuest();
                                            }
                                        }
                                        else if (selectedQuest?.pending_status === 'pending') {
                                            handleUpdatePendingQuest();
                                        }
                                        else {
                                            handleConfirmQuest();
                                        }
                                        onClose();
                                    }}
                                >
                                    {selectedQuest?.type === 'ongoing' && selectedQuest?.action === 'cancel'
                                        ? 'ยืนยันการยกเลิก'
                                        : selectedQuest?.type === 'ongoing'
                                            ? 'ยืนยันการทำกิจกรรม'
                                            : 'ยืนยัน'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </Layout>
    );
}

export default Quests;
