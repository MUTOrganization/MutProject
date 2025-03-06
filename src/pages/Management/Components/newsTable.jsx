import React, { useState, useCallback, useMemo, useEffect } from 'react';
import newsColumns from '../config/newsColumns';
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
    Tooltip
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
import { toastSuccess, AlertQuestion } from '../../../component/Alert'
import { useAppContext } from '../../../contexts/AppContext';

function homeTable() {
    const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
    const [formData, setFormData] = useState({
        image: null,
        title: '',
        date: null,
        description: '',
    });
    const [editFormData, setEditFormData] = useState({
        image: null,
        title: '',
        date: null,
        description: '',
    });

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editNewsId, setEditNewsId] = useState(null);
    const [deleteNewsId, setDeleteNewsId] = useState(null);
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

    const truncateFileName = (fileName, maxLength = 15) => {
        if (fileName.length <= maxLength) return fileName;
        const extension = fileName.slice(fileName.lastIndexOf('.'));
        return fileName.slice(0, maxLength - extension.length) + '...' + extension;
    };

    const filteredData = useMemo(() => {
        let filtered = data;

        if (findTitle && typeof findTitle === 'string') {
            filtered = filtered.filter((data) =>
                data.title.toLowerCase().includes(findTitle.toLowerCase())
            );
        }

        return filtered;
    }, [data]);

    const fetchNewsData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${URLS.home_news.getNews}/${currentData.currentUser.businessId}`);
            setData(response.data);
        } catch (error) {
            console.log('Error fetching news', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, []);

    const handleSubmitNews = async () => {
        setIsLoading(true);

        const newsData = new FormData();
        newsData.append('image', formData.image);
        newsData.append('title', formData.title);
        newsData.append('date', formatDateObject(formData.date));
        newsData.append('description', formData.description);
        newsData.append('business_id', currentData.currentUser.businessId);

        try {
            await axios.post(`${URLS.home_news.addNews}`, newsData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchNewsData();
            onAddOpenChange(false);
            toastSuccess('เพิ่มข้อมูลข่าวสารสำเร็จ');
        } catch (error) {
            console.log('Error adding news', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFormData(prevState => ({
                ...prevState,
                image: acceptedFiles[0]  // Support only one image
            }));
        }
    }, []);

    const clearNewsDataFile = () => {
        setFormData(prevState => ({
            ...prevState,
            image: null  // Reset the image field
        }));
    };

    const { getRootProps: getNewsDataProps, getInputProps: getNewsDataInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, image/gif'
    });

    const { getRootProps: getEditNewsDataProps, getInputProps: getEditNewsDataInputProps } = useDropzone({
        accept: 'image/jpeg, image/png, image/gif',
        onDrop: (acceptedFiles) => {
            const newImage = acceptedFiles[0];
            setEditFormData((prevState) => ({
                ...prevState,
                image: newImage,
            }));
        },
    });

    const handleRemoveEditImage = () => {
        setEditFormData((prevState) => ({
            ...prevState,
            image: null,
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            date: date
        }));
    };

    const resetFormData = () => {
        setFormData({
            image: null,
            title: '',
            date: null,
            description: ''
        });
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${URLS.home_news.getNewById}/${id}`);
            const newsData = response.data;

            const date = newsData.date ? parseAbsoluteToLocal(newsData.date) : null;

            setEditFormData({
                title: newsData.title,
                date: date,
                description: newsData.description,
                image: null,
                image_url: newsData.image_url || null
            });

            onEditOpenChange(true);
            setEditNewsId(id);
        } catch (error) {
            console.error('Error fetching news data: ', error);
        }
    };

    const handleEditSubmit = async () => {
        setIsLoading(true);

        const newsData = new FormData();

        newsData.append('image', editFormData.image);
        newsData.append('title', editFormData.title);
        newsData.append('date', formatDateObject(editFormData.date));
        newsData.append('description', editFormData.description);

        try {
            await axios.put(`${URLS.home_news.updateNews}/${editNewsId}`, newsData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchNewsData();
            onEditOpenChange(false);
            toastSuccess('แก้ไขข้อมูลข่าวสารสำเร็จ');
        } catch (error) {
            console.error('Error updating news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteNewsId(id);
        onDeleteOpenChange(true);
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`${URLS.home_news.deleteNews}/${deleteNewsId}`);
            fetchNewsData();
            setDeleteNewsId(null);
            onDeleteOpenChange(false);
            toastSuccess('ลบข้อมูลข่าวสารสำเร็จ');
        } catch (error) {
            console.error('Error deleting news data:', error);
        }
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
            case "image_url":
                return (
                    <div className="flex justify-center">
                        <Image src={cellValue} alt="news" isZoomed radius='sm' className="object-cover" />
                    </div>
                );
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
                            <span onClick={() => handleEdit(item.id)}
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
                            <span onClick={() => handleDeleteClick(item.id)}
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
                <TableHeader columns={newsColumns}>
                    {(column) => (
                        <TableColumn key={column.uid} className='text-center text-sm'>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={data}
                    loadingState={isLoading ? "loading" : undefined}
                    loadingContent={<Spinner color="primary" />}
                    emptyContent='ยังไม่มีข้อมูลข่าวสาร'>
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
                            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูลข่าวสาร</ModalHeader>
                            <ModalBody>
                                <div className='space-y-4'>
                                    <div className="mb-4">
                                        <div {...getNewsDataProps()} className="border-2 border-dashed p-4 text-center cursor-pointer rounded-md">
                                            <input {...getNewsDataInputProps()} />
                                            {!formData.image ? (
                                                <p>กดตรงนี้เพื่อเพิ่มรูปภาพ</p>
                                            ) : (
                                                <div className="flex justify-between items-center space-x-2">
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Selected Image"
                                                        className="w-48 h-48 object-cover rounded-md"
                                                    />
                                                    <span className="text-sm">{truncateFileName(formData.image.name)}</span>
                                                    <Button isIconOnly size='sm' color='danger' variant='flat' className='text-danger' onPress={clearNewsDataFile}>
                                                        <CloseIcon />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
                                    onConfirm={handleSubmitNews}
                                    isLoading={isLoading}
                                    confirmText={"ยืนยัน"}
                                    cancelText={"ยกเลิก"}
                                />
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal for Editing News */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูลข่าวสาร</ModalHeader>
                            <ModalBody>
                                <div className='space-y-4'>
                                    <div className="mb-4">
                                        <div {...getEditNewsDataProps()} className="border-2 border-dashed p-4 text-center cursor-pointer rounded-md">
                                            <input {...getEditNewsDataInputProps()} />
                                            {!editFormData.image && !editFormData.image_url ? (
                                                <p>กดตรงนี้เพื่อเพิ่มรูปภาพ</p>
                                            ) : (
                                                <div className="flex justify-center items-center space-x-2">
                                                    <img
                                                        src={editFormData.image ? URL.createObjectURL(editFormData.image) : editFormData.image_url}
                                                        alt="Selected Image"
                                                        className="w-64 h-64 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

            {/* Modal for Deleting News */}
            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ลบข้อมูลข่าวสาร</ModalHeader>
                            <ModalBody>
                                <p>ต้องการจะลบข้อมูลข่าวสารหรือไม่?</p>
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
