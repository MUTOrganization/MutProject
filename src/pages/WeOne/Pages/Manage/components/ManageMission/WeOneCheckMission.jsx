import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Layout";
import {
  Button,
  Card,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  User,
  TableColumn,
  Image,
  Badge,
} from "@nextui-org/react";
import { LeftArrowIcon, DeleteIcon } from "../../../../../../component/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import MonthSelector from "../../../../Components/MonthSelector";
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import CountdownComponent from "../../../../Components/CountdownComponent.jsx";
import { formatDateObject } from "../../../../../../component/DateUtiils.jsx";
import DateTimeSelector from "../../../../Components/DateTimeSelector.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ConfirmCancelButtons,
  PrimaryButton,
} from "../../../../../../component/Buttons.jsx";
import dayjs from "dayjs";
import { now, getLocalTimeZone } from "@internationalized/date";
import axios from "axios";
import { URLS } from "../../../../../../config.js";
import { useAppContext } from "../../../../../../contexts/AppContext.jsx";
import {
  toastSuccess,
  toastError,
} from "../../../../../../component/Alert.jsx";

function WeOneCheckMission() {
  const useData = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [monthRange, setMonthRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });
  const [accordionData, setAccordionData] = useState([]);
  const {
    isOpen: isModalDetailApprove,
    onOpen: onOpenModalDetailApprove,
    onOpenChange: onOpenChangeModalDetailApprove,
  } = useDisclosure();

  const {
    isOpen: isModalImg,
    onOpen: onOpenModalImg,
    onOpenChange: onOpenChangeModalImg,
  } = useDisclosure();
  const {
    isOpen: isModalConfirm,
    onOpen: onOpenModalConfirm,
    onOpenChange: onOpenChangeModalConfirm,
  } = useDisclosure();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set());
  const [currentImage, setCurrentImage] = useState(null); // สำหรับเก็บรูปที่เลือก
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityState, setActivityState] = useState({});

  const fetchQuestPandingData = async () => {
    setIsLoading(true);
    try {
      // สร้าง URL และแนบ Query Parameters
      const url = `${URLS.weOne.getPendingQuest}`;
      const params = {
        business_id: useData.currentUser.businessId,
        start_date: `${formatDateObject(monthRange.start)} 00:00:00`,
        end_date: `${formatDateObject(monthRange.end)} 23:59:59`,
      };

      const response = await axios.get(url, { params });

      setAccordionData(response.data);
    } catch (error) {
      console.error("Error fetching quest data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendApproval = async (userId) => {
    try {
      const url = `${URLS.weOne.getApproveQuest}`;
      const payload = {
        admin_id: useData.currentUser.userName, // ระบุ admin_id
        pending_id: [userId],
        status: "approved",
      };

      await axios.post(url, payload);
    } catch (error) {
      console.error("Error sending approval to database:", error);
      toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  useEffect(() => {
    fetchQuestPandingData();
  }, [monthRange]);

  // คำนวณจำนวนของแต่ละสถานะ
  const allCount = accordionData.length; // จำนวนทั้งหมด
  const pendingCount = accordionData.filter((activity) =>
    activity.user.some((user) => user.pending_status === "pending")
  ).length;

  // นับจำนวน activity ที่มี user ในสถานะ approved
  const approvedCount = accordionData.filter((activity) =>
    activity.user.some((user) => user.pending_status === "approved")
  ).length;

  const filteredData = accordionData
    .map((activity) => {
      const filteredUsers = activity.user.filter(
        (user) =>
          selectedStatus === "all" || user.pending_status === selectedStatus
      );

      return {
        ...activity,
        user: filteredUsers,
      };
    })
    .filter((activity) => activity.user.length > 0);

  const handleApproveSelected = async () => {
    const containsInvalidKeys =
      Array.from(selectedKeys).includes("a") &&
      Array.from(selectedKeys).includes("l");
    const selected = containsInvalidKeys ? "all" : Array.from(selectedKeys);

    setAccordionData((prevData) =>
      prevData.map((activity) => {
        if (activity.quest_id === activityState.quest_id) {
          if (selected.includes("all")) {
            // กรณีเลือกทั้งหมดใน activity นี้
            activity.user.forEach(async (user) => {
              await sendApproval(user.id);
            });

            return {
              ...activity,
              user: activity.user.map((user) => ({
                ...user,
                pending_status: "approved",
              })),
            };
          } else {
            activity.user.forEach(async (user) => {
              if (selected.includes(user.id.toString())) {
                await sendApproval(user.id);
              }
            });

            return {
              ...activity,
              user: activity.user.map((user) =>
                selected.includes(user.id.toString())
                  ? { ...user, pending_status: "approved" }
                  : user
              ),
            };
          }
        }
        return activity;
      })
    );

    // ปิด Modal และรีเซ็ตการเลือก
    setCurrentActivity(null);
    onOpenChangeModalDetailApprove(false);
    onOpenChangeModalConfirm(false);
    setSelectedKeys(new Set()); // รีเซ็ต selectedKeys

    toastSuccess("สถานะเปลี่ยนเป็น Approved แล้ว!");
  };

  const handleBack = () => {
    navigate(-1, {
      state: { activeTab: location.state?.activeTab || "ManageMission" },
    });
  };

  const handleOpenModal = async (activity) => {
    setCurrentActivity(activity.user); // เก็บข้อมูลผู้ใช้ของกิจกรรม
    setActivityState({ quest_id: activity.quest_id }); // เก็บ quest_id ของกิจกรรมที่เลือก
    onOpenModalDetailApprove(); // เปิด Modal
  };

  const handleOpenModalConfirm = async () => {
    onOpenModalConfirm();
  };

  const handleOpenModalImg = async (item) => {
    setCurrentImage(item);
    onOpenModalImg();
  };

  const column = [
    { name: "ชื่อ", uid: "username" },
    { name: "หลักฐาน", uid: "img" },
  ];
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "username":
        return (
          <User
            avatarProps={{ radius: "lg", src: item.user_img, size: "sm" }}
            name={<span style={{ fontSize: "0.875rem" }}>{item.username}</span>}
          >
            {item.email}
          </User>
        );

      case "img":
        return (
          <div>
            <Image
              width={50}
              height={50}
              src={item.image_link}
              alt="หลักฐาน"
              onPress={() => handleOpenModalImg(item)} // เมื่อคลิกจะเปิด Modal
            />
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  const handleSelectionChange = (keys) => {
    setSelectedKeys(new Set(keys));
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="py-6 space-y-6 bg-gradient-to-b from-blue-50 to-white z-10">
          <div className="flex items-center justify-between px-4">
            <Button
              isIconOnly
              variant="light"
              onPress={handleBack}
              aria-label="Go back to the previous page"
            >
              <LeftArrowIcon width={16} />
            </Button>
            <h2 className="text-xl font-bold flex-grow text-center">
              ตรวจสอบกิจกรรม
            </h2>
            <span className="w-8"></span>
          </div>

          <div className="flex flex-col w-full px-4">
            <Card
              className="overflow-hidden"
              shadow="none"
              style={{ background: "transparent" }}
            >
              <div>
                <MonthSelector
                  value={monthRange}
                  onChange={(newRange) => setMonthRange(newRange)}
                  className="custom-class mb-2"
                />
              </div>

              <div className="flex space-x-4 py-2 justify-center">
                <Button
                  color="primary"
                  variant={selectedStatus === "all" ? "flat" : "bordered"}
                  onPress={() => setSelectedStatus("all")}
                >
                  <div
                    className={`flex items-center justify-between ${allCount === 0 ? "" : "space-x-2"}`}
                  >
                    <span className={`flex  ${allCount === 0 ? "" : " mr-2"}`}>
                      ทั้งหมด
                    </span>

                    <Badge
                      content={allCount === 0 ? undefined : allCount}
                      shape="circle"
                      showOutline={false}
                      className="bg-[#ff4b63] ml-2 text-white"
                    />
                  </div>
                </Button>
                <Button
                  color="primary"
                  variant={selectedStatus === "pending" ? "flat" : "bordered"}
                  onPress={() => setSelectedStatus("pending")}
                >
                  <div
                    className={`flex items-center justify-between  ${pendingCount === 0 ? "" : "space-x-2"}`}
                  >
                    <span
                      className={`flex  ${pendingCount === 0 ? "" : " mr-2"}`}
                    >
                      รอตรวจสอบ
                    </span>{" "}
                    <Badge
                      content={pendingCount === 0 ? undefined : pendingCount}
                      shape="circle"
                      showOutline={false}
                      className="bg-[#ff4b63] ml-2 text-white"
                    />
                  </div>
                </Button>
                <Button
                  color="primary"
                  variant={selectedStatus === "approved" ? "flat" : "bordered"}
                  onPress={() => setSelectedStatus("approved")}
                >
                  <div
                    className={`flex items-center justify-between  ${approvedCount === 0 ? "" : "space-x-2"}`}
                  >
                    <span
                      className={`flex  ${approvedCount === 0 ? "" : " mr-2"}`}
                    >
                      ตรวจสอบแล้ว
                    </span>{" "}
                    <Badge
                      content={approvedCount === 0 ? undefined : approvedCount}
                      shape="circle"
                      showOutline={false}
                      className="bg-[#ff4b63] ml-2 text-white"
                    />
                  </div>
                </Button>
              </div>

              {isLoading ? (
                <Spinner
                  className="flex items-center min-h-[300px]"
                  color="primary"
                  labelColor="foreground"
                />
              ) : (
                <form
                  className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide mt-2"
                  style={{
                    maxHeight: "calc(100vh - 350px)",
                    paddingBottom: "16px",
                  }}
                >
                  {filteredData.length === 0 ? (
                    // แสดงข้อความเมื่อไม่มีข้อมูล
                    <div className="text-center text-gray-500 py-4">
                      ไม่มีข้อมูลที่จะแสดง
                    </div>
                  ) : (
                    <Accordion
                      variant="splitted"
                      className="shadow-none"
                      aria-label="Mission History Accordion"
                    >
                      {filteredData.map((item) => (
                        <AccordionItem
                          className="shadow-md"
                          key={item.pending_id}
                          aria-label={`Mission ${item.pending_id}`}
                          title={
                            <div className="flex justify-between items-center gap-4">
                              {/* Left Section: Title and Countdown */}
                              <div className="flex flex-col flex-grow overflow-hidden">
                                <span
                                  className="text-primary text-md overflow-hidden whitespace-nowrap text-ellipsis"
                                  style={{ maxWidth: "200px" }} // กำหนดขนาดสูงสุด
                                  title={item.quest_title} // Hover เพื่อดูข้อความเต็ม
                                >
                                  {item.quest_title}
                                </span>

                                {selectedStatus === "all" ? (
                                  <>
                                    <span className="text-sm font-medium text-gray-500">
                                      ตรวจสอบแล้ว:{" "}
                                      {
                                        item.user.filter(
                                          (u) => u.pending_status === "approved"
                                        ).length
                                      }{" "}
                                      คน
                                    </span>
                                    <span className="text-sm font-medium text-warning-500">
                                      รอตรวจสอบ:{" "}
                                      {
                                        item.user.filter(
                                          (u) => u.pending_status === "pending"
                                        ).length
                                      }{" "}
                                      คน
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    className={`text-sm font-medium ${
                                      item.user.some(
                                        (user) =>
                                          user.pending_status === "pending"
                                      )
                                        ? "text-warning-500"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {item.user.some(
                                      (user) =>
                                        user.pending_status === "pending"
                                    )
                                      ? `รอตรวจสอบ ${
                                          item.user.filter(
                                            (u) =>
                                              u.pending_status === "pending"
                                          ).length
                                        } คน`
                                      : `ตรวจสอบแล้ว ${
                                          item.user.filter(
                                            (u) =>
                                              u.pending_status === "approved"
                                          ).length
                                        } คน`}
                                  </span>
                                )}
                              </div>

                              {/* Right Section: Status Badge */}
                              {selectedStatus === "all" ? (
                                <div className="flex-shrink-0">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      item.user.some(
                                        (user) =>
                                          user.pending_status === "pending"
                                      )
                                        ? "bg-warning text-white"
                                        : "bg-success text-white"
                                    }`}
                                  >
                                    {item.user.some(
                                      (user) =>
                                        user.pending_status === "pending"
                                    )
                                      ? "ยังดำเนินการ"
                                      : "สำเร็จ"}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex-shrink-0">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      selectedStatus === "pending"
                                        ? "bg-warning text-white"
                                        : "bg-success text-white"
                                    }`}
                                  >
                                    {selectedStatus === "pending"
                                      ? "รอตรวจสอบ"
                                      : "ตรวจสอบเเล้ว"}
                                  </span>
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="flex flex-col gap-2">
                            <div key={item.id}>
                              <div className="flex space-x-2 text-success mb-2 ">
                                <p className="font-medium">
                                  จำนวนแต้มของภารกิจ :{" "}
                                </p>
                                <p className="flex font-medium ">
                                  {item.points}
                                </p>
                              </div>
                              <div className="space-y-2 mb-4">
                                <p className="font-medium">รายละเอียดกิจกรรม</p>
                                <div
                                  className="prose prose-sm text-gray-600 break-words overflow-hidden"
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {item.quest_description}
                                  </ReactMarkdown>
                                </div>
                              </div>

                              <div
                                onPress={() => handleOpenModal(item)}
                                className="cursor-pointer"
                              >
                                <p
                                  className={`font-medium underline mb-4 ${
                                    selectedStatus === "approved"
                                      ? "text-success"
                                      : "text-warning-500"
                                  }`}
                                >
                                  {selectedStatus === "all"
                                    ? item.user.some(
                                        (user) =>
                                          user.pending_status === "pending"
                                      )
                                    : selectedStatus === "pending"
                                      ? `รายชื่อ: ${item.user.filter((user) => user.pending_status === "pending").length}`
                                      : `จำนวนคนเข้าร่วม: ${item.user.filter((user) => user.pending_status === "approved").length}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalImg}
        onOpenChange={onOpenChangeModalImg}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <h3 className="flex justify-center font-medium text-lg py-2">
                  หลักฐาน
                </h3>
                <div className=" space-y-2">
                  <p className="font-normal">รูปภาพ</p>
                  <Image
                    src={currentImage.image_link}
                    alt="หลักฐาน"
                    width="auto"
                    height="auto"
                    objectFit="contain"
                  />{" "}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="font-medium">รายละเอียดกิจกรรม</p>
                  <div
                    className="prose prose-sm text-gray-600 break-words overflow-hidden"
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentImage.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isModalConfirm}
        onOpenChange={onOpenChangeModalConfirm}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>ยืนยันตรวจสอบทั้งหมด</h3>
              </ModalHeader>
              <ModalBody></ModalBody>

              <ModalFooter>
                <ConfirmCancelButtons
                  onCancel={onClose}
                  cancelText={"ยกเลิก"}
                  confirmText="ยืนยัน"
                  onConfirm={handleApproveSelected}
                  size={"sm"}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isModalDetailApprove}
        onOpenChange={onOpenChangeModalDetailApprove}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="text-medium mt-2">
                  รายชื่อที่รอตรวจสอบ {currentActivity.length} คน
                </h3>
              </ModalHeader>
              <ModalBody>
                {currentActivity && currentActivity.length > 0 ? (
                  <Table
                    color="primary"
                    aria-label="Employee list with custom cells"
                    className="w-full max-h-[400px] overflow-auto scrollbar-hide"
                    isHeaderSticky
                    selectionMode={
                      selectedStatus !== "approved" ? "multiple" : undefined
                    }
                    removeWrapper
                    onSelectionChange={handleSelectionChange}
                  >
                    <TableHeader columns={column}>
                      {(column) => (
                        <TableColumn key={column.uid}>
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>

                    <TableBody
                      items={currentActivity} // ใช้ข้อมูลดิบโดยตรง
                      emptyContent={"ยังไม่มีข้อมูล"}
                      loadingState={isLoading ? "loading" : undefined}
                      loadingContent={<Spinner color="primary" />}
                    >
                      {(item) => (
                        <TableRow key={item.id}>
                          {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500">ไม่มีข้อมูลผู้ใช้</p>
                )}
              </ModalBody>

              {selectedStatus !== "approved" ? (
               <ModalFooter>
               <ConfirmCancelButtons
                 onCancel={onClose}
                 cancelText={"ปิด"}
                 confirmText="ตรวจสอบสำเร็จ"
                 onConfirm={handleOpenModalConfirm}
                 size={"sm"}
               />
             </ModalFooter> 
              ) : (
                <ModalFooter></ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default WeOneCheckMission;
