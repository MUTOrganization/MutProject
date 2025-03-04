import React, { useState, useCallback, useMemo, useEffect } from 'react';
import educationColumns from '../config/educationColumns';
import { SearchIcon, PlusIcon, CloseIcon, EditIcon, DeleteIcon } from '../../../component/Icons';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableColumn,
    Input,
    Button,
    DatePicker,
    Textarea,
    Spinner,
    Image,
    Tooltip,
    Chip,
    Badge
} from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@nextui-org/react";
import { PrimaryButton, ConfirmCancelButtons } from '../../../component/Buttons';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Toaster, toast } from 'sonner';
import { parseAbsoluteToLocal } from "@internationalized/date";
import { URLS } from '../../../config';
import { useAppContext } from '../../../contexts/AppContext';

function homeTable() {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const [formData, setFormData] = useState({
        title: '',
        date: null,
        description: '',
        link: '',
    });
    const [editFormData, setEditFormData] = useState({
        title: '',
        date: null,
        description: '',
        link: '',
    });

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editMediaId, setEditMediaId] = useState(null);
    const [deleteMediaId, setDeleteMediaId] = useState(null);
    const [findTitle, setFindTitle] = useState('')
    const currentData = useAppContext();

    const formatDateObject = (dateObj) => {
        if (!dateObj) return null;
        const year = dateObj.year;
        const month = String(dateObj.month).padStart(2, "0");
        const day = String(dateObj.day).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDate = (dateString) => {
        dayjs.locale('th');
        const [year, month, day] = dateString.split('-');
        let convertedYear = parseInt(year, 10);

        if (convertedYear < 2500) {
            convertedYear += 543;
        }

        const date = dayjs(`${convertedYear}-${month}-${day}`);
        return date.format('D MMMM YYYY');
    };

    const fetchEducationData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${URLS.home_education.getEducation}/${currentData.currentUser.businessId}`);
            setData(response.data);
        } catch (error) {
            console.log('Error fetching news', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEducationData();
    }, []);

    const handleSubmitEducation = async () => {
        setIsLoading(true);

        try {
            await axios.post(`${URLS.home_education.addEducation}`, {
                title: formData.title,
                business_id: currentData.currentUser.businessId,
                link: formData.link,
                date: formatDateObject(formData.date),
                description: formData.description,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchEducationData();
            onAddOpenChange(false);
            toast.success('เพิ่มข้อมูลสื่อความรู้สำเร็จ', { duration: 3000, position: 'top-right' });
        } catch (error) {
            console.log('Error adding media', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${URLS.home_education.getEducationById}/${id}`);
            const newsData = response.data;

            const date = newsData.date ? parseAbsoluteToLocal(newsData.date) : null;

            setEditFormData({
                title: newsData.title,
                date: date,
                link: newsData.link,
                description: newsData.description,
            });

            onEditOpenChange(true);
            setEditMediaId(id);
        } catch (error) {
            console.error('Error fetching media data: ', error);
        }
    };

    const handleEditSubmit = async () => {
        setIsLoading(true);

        try {
            await axios.put(`${URLS.home_education.updatEeducation}/${editMediaId}`, {
                title: editFormData.title,
                link: editFormData.link,
                date: formatDateObject(editFormData.date),
                description: editFormData.description,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchEducationData();
            onEditOpenChange(false);
            toast.success('แก้ไขข้อมูลสื่อความรู้สำเร็จ', { duration: 3000, position: 'top-right' });
        } catch (error) {
            console.error('Error updating media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteMediaId(id);
        onDeleteOpenChange(true);
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`${URLS.home_education.deletEeducation}/${deleteMediaId}`);
            fetchEducationData();
            setDeleteMediaId(null);
            onDeleteOpenChange(false);
            toast.success('ลบข้อมูลสื่อความรู้สำเร็จ', { duration: 3000, position: 'top-right' });
        } catch (error) {
            console.error('Error deleting news data:', error);
        }
    };

    const resetFormData = () => {
        setFormData({
            title: '',
            date: null,
            description: '',
            link: '',
        });
    }

    const handleDateChange = (date) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            date: date
        }));
    };

    const newsTopContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4 py-2">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        className="w-full sm:max-w-[40%]"
                        value={findTitle}
                        onChange={(e) => setFindTitle(e.target.value)}
                        placeholder="ค้นหาด้วยหัวข้อ"
                        startContent={<SearchIcon />}
                    />
                    <PrimaryButton radius='md' text='เพิ่มข้อมูล' className='bg-green-600 text-white' endContent={<PlusIcon />} onPress={onAddOpen} />
                </div>
            </div>
        );
    }, []);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "title":
                return (
                    <div className="flex flex-col">
                        <p className="text-center text-sm text-nowrap">{cellValue}</p>
                    </div>
                );
            case "description":
                return (
                    <div className="flex flex-col">
                        <p className="text-center text-sm line-clamp-2 overflow-hidden">
                            {cellValue}
                        </p>
                    </div>
                );
            case "date":
                return (
                    <div className="flex flex-col">
                        <p className="text-center text-sm text-nowrap">{formatDate(cellValue)}</p>
                    </div>
                );
            case "link":

                const isValidYoutubeLink = cellValue.includes("youtube.com/watch?v=") || cellValue.includes("youtu.be/");

                if (isValidYoutubeLink) {
                    const embedUrl = cellValue.includes("watch?v=")
                        ? cellValue.replace("watch?v=", "embed/")
                        : cellValue.replace("youtu.be/", "youtube.com/embed/");

                    return (
                        <div className="flex flex-col items-center">
                            <iframe
                                width="200"
                                height="150"
                                src={embedUrl}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className='rounded-lg'
                                allowFullScreen
                                title="Video"
                            ></iframe>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex flex-col items-center">
                            <Chip color='danger' variant='flat'>รูปแบบลิงค์ไม่ถูกต้อง</Chip>
                        </div>
                    );
                }

            case "actions":
                return (
                    <div className="flex justify-center gap-2">
                        <Tooltip
                            content="แก้ไขข้อมูล"
                            delay={0}
                            closeDelay={0}
                            motionProps={{
                                variants: {
                                    exit: {
                                        opacity: 0,
                                        transition: {
                                            duration: 0.1,
                                            ease: "easeIn",
                                        }
                                    },
                                    enter: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.15,
                                            ease: "easeOut",
                                        }
                                    },
                                },
                            }}
                        >
                            <span onPress={() => handleEdit(item.id)}
                                className={
                                    "text-lg text-default-400 cursor-pointer active:opacity-50 hover:opacity-50"
                                }
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip
                            content="ลบข้อมูล"
                            color="danger"
                            delay={0}
                            closeDelay={0}
                            motionProps={{
                                variants: {
                                    exit: {
                                        opacity: 0,
                                        transition: {
                                            duration: 0.1,
                                            ease: "easeIn",
                                        }
                                    },
                                    enter: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.15,
                                            ease: "easeOut",
                                        }
                                    },
                                },
                            }}
                        >
                            <span onPress={() => handleDeleteClick(item.id)}
                                className="text-lg text-danger cursor-pointer active:opacity-50 hover:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div>
            <div className="w-full mb-2">
                {newsTopContent}
            </div>
            <Table aria-label="Example table"
                removeWrapper
                isHeaderSticky
                className="max-h-[650px] overflow-y-auto scrollbar-hide"
                isCompact
            >
                <TableHeader columns={educationColumns}>
                    {(column) => (
                        <TableColumn key={column.uid} className='text-center text-sm'>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={data}
                    loadingState={isLoading ? "loading" : undefined}
                    loadingContent={<Spinner color="primary" />}
                    emptyContent='ยังไม่มีข้อมูลสื่อความรู้'>
                    {(item) => (
                        <TableRow key={item.title}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal for Adding News */}
            <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูลสื่อความรู้</ModalHeader>
                            <ModalBody>
                                <div className='space-y-4'>
                                    <Input
                                        type="text"
                                        label="หัวข้อ"
                                        placeholder='กรอกหัวข้อ'
                                        variant='bordered'
                                        value={formData.title}
                                        onChange={(e) => setFormData(prevState => ({
                                            ...prevState,
                                            title: e.target.value
                                        }))}
                                    />
                                    <Input
                                        type="text"
                                        label="ลิงค์"
                                        placeholder='กรอกลิงค์'
                                        variant='bordered'
                                        value={formData.link}
                                        onChange={(e) => setFormData(prevState => ({
                                            ...prevState,
                                            link: e.target.value
                                        }))}
                                    />
                                    <DatePicker
                                        label='วันที่'
                                        value={formData.date}
                                        variant='bordered'
                                        onChange={handleDateChange}
                                    />
                                    <Textarea
                                        label='รายละเอียด'
                                        value={formData.description}
                                        variant='bordered'
                                        onChange={(e) => setFormData(prevState => ({
                                            ...prevState,
                                            description: e.target.value
                                        }))}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <ConfirmCancelButtons
                                    onCancel={() => {
                                        onClose();
                                        resetFormData();
                                    }}
                                    onConfirm={handleSubmitEducation}
                                    isLoading={isLoading}
                                    confirmText={"ยืนยัน"}
                                    cancelText={"ยกเลิก"}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal for Editing Media */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูลสื่อความรู้</ModalHeader>
                            <ModalBody>
                                <div className='space-y-4'>
                                    <Input
                                        type="text"
                                        label="หัวข้อ"
                                        placeholder="กรอกหัวข้อ"
                                        variant='bordered'
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData(prevState => ({
                                            ...prevState,
                                            title: e.target.value
                                        }))}
                                    />
                                    <Input
                                        type="text"
                                        label="ลิงค์"
                                        placeholder="กรอกลิงค์"
                                        variant='bordered'
                                        value={editFormData.link}
                                        onChange={(e) => setEditFormData(prevState => ({
                                            ...prevState,
                                            link: e.target.value
                                        }))}
                                    />
                                    <DatePicker
                                        label="วันที่"
                                        value={editFormData.date}
                                        granularity='day'
                                        variant='bordered'
                                        onChange={(date) => setEditFormData(prevState => ({
                                            ...prevState,
                                            date: date
                                        }))}
                                    />
                                    <Textarea
                                        label="รายละเอียด"
                                        variant='bordered'
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData(prevState => ({
                                            ...prevState,
                                            description: e.target.value
                                        }))}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <ConfirmCancelButtons
                                    onCancel={onClose}
                                    onConfirm={handleEditSubmit}
                                    confirmText="ยืนยัน"
                                    cancelText="ยกเลิก"
                                    isLoading={isLoading}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal for Deleting Media */}
            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ลบข้อมูลสื่อความรู้</ModalHeader>
                            <ModalBody>
                                <p>ต้องการจะลบข้อมูลสื่อความรู้หรือไม่?</p>
                            </ModalBody>
                            <ModalFooter>
                                <ConfirmCancelButtons
                                    onCancel={onClose}
                                    onConfirm={handleDeleteSubmit}
                                    confirmText="ยืนยัน"
                                    cancelText="ยกเลิก"
                                    isLoading={isLoading}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default homeTable;
