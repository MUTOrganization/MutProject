import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  CardHeader,
  CardFooter,
  Divider,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { LeftArrowIcon } from "../../../../../component/Icons";
import Layout from "../../../Components/Layout";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../../../../contexts/AppContext";
import { URLS } from "../../../../../config";
import fetchProtectedData from "../../../../../../utils/fetchData";
import {
  toastSuccess,
  toastError,
  toastWarning,
} from "../../../../../component/Alert";
import { formatDateThaiAndTime } from "../../../../../component/DateUtiils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CountdownComponent from "../../../Components/CountdownComponent";

dayjs.extend(duration);

function WeOneFormVote() {
  const useData = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [questionStates, setQuestionStates] = useState({});
  const [selectedDep, setSelectedDep] = useState(["ทั้งหมด"]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [noComment, setNoComment] = useState(false);
  const user_option = data?.settings?.user_options;

  const {
    isOpen: isOpenDetailForm,
    onOpen: onOpenDetailForm,
    onOpenChange: onOpenChangeDetailForm,
  } = useDisclosure();

  const fetchData = async () => {
    setIsLoading(true); // เริ่มโหลด
    try {
      const urlQuest = `${URLS.weOne.getForm}`;
      const paramsQuest = {
        business_id: useData.currentUser.businessId,
        quest_id: location.state?.key,
        username: useData.currentUser.userName,
      };

      const urlUser = `${URLS.users.getAll}`;
      const paramsUser = {
        businessId: useData.currentUser.businessId,
        status: 1,
      };

      // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน
      const [questResponse, userResponse] = await Promise.all([
        fetchProtectedData.get(urlQuest, { params: paramsQuest }),
        fetchProtectedData.get(urlUser, { params: paramsUser }),
      ]);

      // อัปเดต state ด้วยข้อมูลที่ดึงมา
      setData(questResponse?.data || []);
      setUser(userResponse?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // หยุดโหลด
    }
  };

  // เรียก fetchData เมื่อโหลดหน้าครั้งแรก
  useEffect(() => {
    fetchData();
  }, [location.state?.key]);
  console.log(data);

  const handleSelectionChange = (questionId, keys, questionTitle) => {
    // ตรวจสอบว่าจำนวนผู้ใช้ที่เลือกเกินค่า settings หรือไม่
    if (keys.size > data?.settings?.selected_choices) {
      toastWarning(
        `สามารถเลือกได้เเค่ ${data?.settings?.selected_choices} ตัวเลือก`
      );
      return; // ไม่อัปเดต state หากเลือกเกิน
    }

    // แปลง Set ของ keys เป็น Array
    const selectedArray = Array.from(keys);

    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        title: questionTitle || prev[questionId]?.title || "",
        selectedUsers: selectedArray, // อัปเดต selectedUsers
        noComment: false,
      },
    }));
  };

  const handleDepartmentChange = (questionId, selectedKey, title) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedDep: selectedKey || "ทั้งหมด", // อัปเดต selectedDep
        title: title || prev[questionId]?.title || "",
      },
    }));
  };

  const handleSelectionChoices = (questionId, keys, questionTitle, choices) => {
    // ตรวจสอบว่าจำนวนผู้ใช้ที่เลือกเกินค่า settings หรือไม่
    if (keys.size > data?.settings?.selected_choices) {
      toastWarning(
        `สามารถเลือกได้เเค่ ${data?.settings?.selected_choices} ตัวเลือก`
      );
      return; // ไม่อัปเดต state หากเลือกเกิน
    }

    // แปลง keys (index) เป็นค่าจริงจาก choices
    const selectedValues = Array.from(keys).map(
      (key) => choices[parseInt(key, 10)]
    );

    // อัปเดต state
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        title: questionTitle || prev[questionId]?.title || "",
        selectedUsers: selectedValues, // เก็บค่าจริงของช้อยที่เลือก
        noComment: false,
      },
    }));
  };

  const handleNoComment = (questionId) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        noComment: !prev[questionId]?.noComment, // สลับสถานะ "ไม่แสดงความคิดเห็น"
        selectedUsers: [], // ล้างการเลือกผู้ใช้ (เปลี่ยนเป็น Array)
      },
    }));
  };

  // จัดกลุ่มผู้ใช้ตาม depName
  const groupedUsers = Array.isArray(user)
    ? user.reduce(
        (acc, user) => {
          const department = user.depName || "ไม่มีแผนก";
          if (!acc[department]) acc[department] = [];
          acc[department].push(user);

          if (!acc["ทั้งหมด"]) acc["ทั้งหมด"] = [];
          acc["ทั้งหมด"].push(user);

          return acc;
        },
        { ทั้งหมด: [] }
      )
    : { ทั้งหมด: [] };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // ตรวจสอบว่ามีคำถามที่ไม่มีการตอบ
    const unansweredQuestions = Object.entries(questionStates).filter(
      ([_, state]) => state.selectedUsers.length === 0 && !state.noComment
    );

    if (unansweredQuestions.length > 0) {
      toastWarning("กรุณาตอบคำถามทั้งหมดก่อนส่ง");
      return;
    }

    // สร้าง payload
    const payload = {
      username: useData.currentUser.userName,
      points: data.points || 0,
      form_id: data.quest_id, // รหัสแบบฟอร์มคำถาม
      business_id: useData.currentUser.businessId,
      form_data: data.questions.map((question, index) => {
        const state = questionStates[index] || {};
        return {
          title: state.title || question.title || "",
          choices: state.selectedUsers || [],
        };
      }),
    };

    console.log("Payload:", payload);

    try {
      const response = await fetchProtectedData.post(
        `${URLS.weOne.sendForm}`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Mission created successfully:", response.data);
        fetchData();
      } else {
        console.warn("Unexpected response status:", response.status);
        toastError("Server มีปัญหา โปรดลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error creating mission:", error.message);
      toastError("สร้างภารกิจไม่สำเร็จ");
    }
  };

  const getNextActionMessage = () => {
    if (!data?.form_done) return null; // ถ้า form_done ไม่มีค่า

    const now = dayjs();
    const startDate = dayjs(data.start_date);
    const dueDate = dayjs(data.due_date);

    if (data?.type === "onlyOne") {
      if (data?.form_done?.is_submitted) {
        return (
          <Card className="shadow-lg my-4">
            <CardHeader>
              <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
            </CardHeader>
            <CardBody className="text-sm text-gray-700">
              <p>คุณได้ทำแบบฟอร์มนี้แล้ว</p>
              <p>
                เริ่มตั้งแต่: {formatDateThaiAndTime(startDate)} ถึง:{" "}
                {formatDateThaiAndTime(dueDate)}
              </p>
              <p>
                เวลาที่เหลือ:{" "}
                <CountdownComponent
                  startDate={now.toISOString()}
                  endDate={dueDate.toISOString()}
                />
              </p>
            </CardBody>
          </Card>
        );
      }
    }
    console.log(data?.type);

    if (data?.type === "Weekly") {
      const now = dayjs();
      const startDate = dayjs(data.start_date);
      const dueDate = dayjs(data.due_date);
      const currentUserName = useData.currentUser.userName;

      // ตรวจสอบว่าฟอร์มนี้ทำโดย currentUser หรือไม่
      if (data?.form_done?.username !== currentUserName) {
        return (
          <Card className="shadow-lg my-4">
            <CardHeader>
              <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
            </CardHeader>
            <CardBody className="text-sm text-gray-700">
              <p>ฟอร์มนี้ไม่ได้ถูกกำหนดสำหรับคุณ</p>
            </CardBody>
          </Card>
        );
      }

      const daysOfWeek = data?.settings?.selected_daysOfWeek || [];
      const startTime = data?.settings?.start_time || "00:00";
      const endTime = data?.settings?.end_time || "23:59";

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      // หา "วันถัดไป" ที่อยู่ใน `daysOfWeek` และอยู่ในช่วง `start_date` ถึง `due_date`
      const nextAvailableDay = daysOfWeek
        .map((day) => {
          const dayToCheck = dayjs()
            .day(day)
            .set("hour", startHour)
            .set("minute", startMinute);

          // ถ้าวันที่ตรงกับวันในสัปดาห์ถัดไป
          return dayToCheck.isBefore(now)
            ? dayToCheck.add(1, "week")
            : dayToCheck;
        })
        .find((day) => day.isAfter(startDate) && day.isBefore(dueDate));

      if (nextAvailableDay) {
        const nextEndTime = nextAvailableDay
          .clone()
          .set("hour", endHour)
          .set("minute", endMinute);

        if (now.isBefore(nextAvailableDay)) {
          // กรณีที่ยังไม่ถึงวันถัดไป
          return (
            <Card className="shadow-lg my-4">
              <CardHeader>
                <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
              </CardHeader>
              <CardBody className="text-sm text-gray-700">
                <p>คุณได้ทำแบบฟอร์มนี้แล้ว</p>
                <p>เวลาที่จะทำฟอร์มครั้งถัดไป:</p>
                <CountdownComponent
                  startDate={now.toISOString()}
                  endDate={nextAvailableDay.toISOString()}
                />
              </CardBody>
            </Card>
          );
        } else if (now.isBetween(nextAvailableDay, nextEndTime)) {
          // กรณีที่อยู่ในช่วงเวลาที่ทำได้
          return (
            <Card className="shadow-lg my-4">
              <CardHeader>
                <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
              </CardHeader>
              <CardBody className="text-sm text-gray-700">
                <p>คุณสามารถทำแบบฟอร์มได้ในขณะนี้</p>
                <p>
                  ช่วงเวลาทำแบบฟอร์ม: {startTime} - {endTime}
                </p>
              </CardBody>
            </Card>
          );
        }
      }

      // ไม่มีวันถัดไปที่เปิดให้ทำ
      return (
        <Card className="shadow-lg my-4">
          <CardHeader>
            <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
          </CardHeader>
          <CardBody className="text-sm text-gray-700">
            <p>ไม่มีเวลาถัดไปที่สามารถทำแบบฟอร์มนี้ได้</p>
          </CardBody>
        </Card>
      );
    }

    if (data?.type === "Monthly") {
      const selectedDays =
        data.settings?.selected_daysOfMonths?.map(Number) || [];
      const [startHour, startMinute] = data.settings?.startTime
        ?.split(":")
        .map(Number) || [0, 0];
      const now = dayjs();
      const startDate = dayjs(data.start_date);
      const dueDate = dayjs(data.due_date);

      if (!selectedDays.length) {
        console.error(
          "selected_daysOfMonths ไม่มีข้อมูลหรือไม่ถูกต้อง",
          data.settings?.selected_daysOfMonths
        );
        return (
          <Card className="shadow-lg my-4">
            <CardHeader>
              <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
            </CardHeader>
            <CardBody className="text-sm text-gray-700">
              <p>ไม่มีวันให้เลือกสำหรับกิจกรรมนี้</p>
            </CardBody>
          </Card>
        );
      }

      const closestDate = selectedDays.reduce((closest, day) => {
        if (isNaN(day)) {
          console.error("พบค่าที่ไม่ใช่ตัวเลขใน selected_daysOfMonths", day);
          return closest;
        }

        let potentialDate = dayjs()
          .date(day)
          .hour(startHour)
          .minute(startMinute)
          .second(0);

        if (potentialDate.isBefore(now)) {
          potentialDate = potentialDate.add(1, "month");
        }

        const durationToStart = dayjs
          .duration(potentialDate.diff(startDate))
          .asMilliseconds();
        const durationToEnd = dayjs
          .duration(dueDate.diff(potentialDate))
          .asMilliseconds();

        // ตรวจสอบว่า potentialDate อยู่ในช่วง startDate และ dueDate
        if (durationToStart >= 0 && durationToEnd >= 0) {
          return !closest || potentialDate.isBefore(closest)
            ? potentialDate
            : closest;
        }

        return closest;
      }, null);

      if (closestDate) {
        return (
          <Card className="shadow-lg my-4">
            <CardHeader>
              <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
            </CardHeader>
            <CardBody className="text-sm text-gray-700">
              <p>คุณได้ทำแบบฟอร์มนี้แล้ว</p>
              <p>วันถัดไปที่ต้องทำฟอร์ม:</p>
              <CountdownComponent
                startDate={now.toISOString()}
                endDate={closestDate.toISOString()}
              />
            </CardBody>
          </Card>
        );
      }

      return (
        <Card className="shadow-lg my-4">
          <CardHeader>
            <h3 className="text-md font-bold">สถานะฟอร์ม</h3>
          </CardHeader>
          <CardBody className="text-sm text-gray-700">
          <p>คุณได้ทำแบบฟอร์มนี้แล้ว</p>
          </CardBody>
        </Card>
      );
    }

    return null;
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="relative w-full h-3/4">
            {/* ปุ่มย้อนกลับ */}
            <Button
              isIconOnly
              variant="light"
              className="absolute top-10 left-4 z-20 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
              onPress={() => navigate("/WeOne-Vote")}
            >
              <LeftArrowIcon width={16} />
            </Button>

            {/* Card ส่วนกลาง */}
            <Card radius="none" shadow="md" className="px-2">
              <CardBody>
                {/* Section แสดงจำนวนรายการ */}
                <div className="flex items-center justify-between p-4">
                  <div
                    className="flex items-center flex-col ml-14 cursor-pointer"
                    onPress={onOpenDetailForm}
                  >
                    <p className="text-lg font-bold text-[#e74c3c]">
                      {data.quest_title || "ไม่มีชื่อหัวข้อ"}
                    </p>
                    {/* Description */}
                    <p className="text-sm font-bold text-[#e74c3c]">
                      กดเพื่อดูรายละเอียดแบบสอบถาม
                    </p>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    {/* รายการ */}

                    {/* Circle สำหรับจำนวนรายการ */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="flex items-center justify-center bg-[#438c98] text-white rounded-full w-10 h-10 text-base font-bold shadow-md">
                        {data?.questions?.length || 0}
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        รายการ
                      </span>
                    </div>
                  </div>

                  {/* ปุ่มจัดการ */}
                </div>
              </CardBody>
            </Card>
          </div>{" "}
          {data?.form_done === null ? (
            <section className="relative w-full h-[calc(100vh-200px)] overflow-y-auto px-4 space-y-4 pb-6 pt-2">
              {/* วนลูป questions */}
              {data?.questions?.map((question, index) => {
                const questionId = index; // ใช้ index เป็น questionId

                const questionState = questionStates[questionId] || {
                  noComment: false,
                  selectedUsers: [], // ค่าเริ่มต้นเป็น array ว่าง
                  selectedDep: "ทั้งหมด", // ค่าเริ่มต้นสำหรับแผนก
                };

                const selectedDepartmentUsers = Array.isArray(
                  groupedUsers[questionState.selectedDep || "ทั้งหมด"]
                )
                  ? groupedUsers[questionState.selectedDep || "ทั้งหมด"]
                  : [];

                return (
                  <Card key={questionId} className="max-w-[400px]">
                    <CardHeader className="flex gap-3">
                      <div className="flex flex-col">
                        <p className="text-md">
                          {question.title || "No title available"}
                        </p>
                        <p className="text-small text-default-500">
                          {`เลือกได้ ${data?.settings?.selected_choices || 0} ข้อ`}
                        </p>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <section>
                        <div>
                          {user_option === "user" ? (
                            // แสดง Listbox สำหรับ "user"
                            <div>
                              {/* Dropdown สำหรับเลือกแผนก */}
                              <div className="flex items-center justify-around">
                                <span className="text-sm">เลือกแผนก</span>
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button
                                      variant="bordered"
                                      className="capitalize text-xs w-1/2 py-2" // ขนาดฟอนต์เล็กและเพิ่มความกว้างเต็ม
                                    >
                                      {questionState.selectedDep || "ทั้งหมด"}
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu
                                    disallowEmptySelection
                                    variant="faded"
                                    aria-label="Select Department"
                                    onAction={(key) =>
                                      handleDepartmentChange(
                                        questionId,
                                        key,
                                        question.title
                                      )
                                    }
                                    selectedKeys={
                                      new Set([
                                        questionState.selectedDep || "ทั้งหมด",
                                      ])
                                    }
                                    selectionMode="single"
                                    className="text-xs" // ขนาดฟอนต์เมนูเล็ก
                                  >
                                    {Object.keys(groupedUsers).map(
                                      (depName) => (
                                        <DropdownItem
                                          key={depName}
                                          textValue={depName}
                                          className="text-xs px-4 py-2" // ขนาดฟอนต์และระยะห่างเล็ก
                                        >
                                          {depName}
                                        </DropdownItem>
                                      )
                                    )}
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                              {/* Listbox สำหรับผู้ใช้ */}

                              {selectedDepartmentUsers.length > 0 ? (
                                <Listbox
                                  aria-label="Select User"
                                  selectionMode="multiple"
                                  onSelectionChange={(keys) =>
                                    handleSelectionChange(
                                      questionId,
                                      keys,
                                      question.title
                                    )
                                  }
                                  selectedKeys={
                                    questionState.selectedUsers || []
                                  }
                                  style={{ maxHeight: "16rem" }}
                                  classNames={{
                                    base: "max-w-xs",
                                    list: "overflow-scroll",
                                  }}
                                >
                                  {selectedDepartmentUsers.map((user) => (
                                    <ListboxItem
                                      key={user.username}
                                      value={user.username}
                                      textValue={user.nickName || user.username}
                                      className="px-4 py-2"
                                    >
                                      <div>
                                        <div className="flex h-5 items-center space-x-4 text-sm">
                                          {user.nickName && (
                                            <span className="text-sm font-medium">
                                              {user.nickName}
                                            </span>
                                          )}
                                          {user.nickName && user.name && (
                                            <Divider orientation="vertical" />
                                          )}
                                          {user.name && (
                                            <span className="text-xs text-gray-500">
                                              {user.name}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {user.username}
                                        </div>
                                      </div>
                                    </ListboxItem>
                                  ))}
                                </Listbox>
                              ) : (
                                <p className="text-sm text-gray-500">
                                  ไม่มีผู้ใช้ในแผนกนี้
                                </p>
                              )}

                              {Array.isArray(questionState.selectedUsers) &&
                              questionState.selectedUsers.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-3 justify-center text-center">
                                  {questionState.selectedUsers.map((key) => {
                                    const selectedUser = user.find(
                                      (u) => u.username === key
                                    );
                                    return (
                                      <Chip
                                        key={key}
                                        className="text-xs px-3 py-2 bg-blue-100 text-blue-800 rounded-lg shadow-sm"
                                      >
                                        {selectedUser?.nickName ||
                                          selectedUser?.name}
                                      </Chip>
                                    );
                                  })}
                                </div>
                              ) : questionState.noComment ? (
                                <div className="text-sm text-gray-500 mt-3 justify-center text-center">
                                  คุณได้เลือก "ไม่แสดงความคิดเห็น"
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 mt-3 justify-center text-center">
                                  ยังไม่มีผู้ใช้ที่ถูกเลือก
                                </div>
                              )}
                            </div>
                          ) : user_option === "customize" ? (
                            // แสดง Listbox สำหรับ "customize" (choices)
                            <div className="flex mt-4 justify-center">
                              <Listbox
                                aria-label="Select Choice"
                                selectionMode="multiple"
                                onSelectionChange={(keys) =>
                                  handleSelectionChoices(
                                    questionId,
                                    keys, // ส่ง keys (index) ที่เลือก
                                    question.title,
                                    question.choices // ส่ง choices สำหรับการแปลง index เป็น value
                                  )
                                }
                                selectedKeys={
                                  Array.isArray(questionState.selectedUsers)
                                    ? questionState.selectedUsers.map((value) =>
                                        question.choices
                                          .indexOf(value)
                                          .toString()
                                      )
                                    : []
                                }
                                style={{ maxHeight: "16rem" }}
                                classNames={{
                                  base: "max-w-xs",
                                  list: "overflow-scroll",
                                }}
                              >
                                {question.choices.map((choice, idx) => (
                                  <ListboxItem
                                    key={idx.toString()} // ใช้ index เป็น key
                                    value={idx.toString()} // ใช้ index เป็น value
                                    className="px-4 py-2"
                                  >
                                    {choice}
                                  </ListboxItem>
                                ))}
                              </Listbox>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              ไม่มีข้อมูลสำหรับแสดงผล
                            </div>
                          )}
                        </div>
                      </section>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      {data?.settings?.no_comment_option === 1 ? (
                        <div className="flex items-center justify-center w-full">
                          <Button
                            variant={
                              questionState.noComment ? "solid" : "ghost"
                            }
                            onPress={() => handleNoComment(questionId)}
                            className={
                              questionState.noComment
                                ? "bg-red-500 text-white"
                                : ""
                            }
                            size="sm"
                          >
                            {questionState.noComment
                              ? "ยกเลิกไม่แสดงความคิดเห็น"
                              : "ไม่แสดงความคิดเห็น"}
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
              <section className="flex justify-center mt-6">
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md"
                >
                  ส่งคำตอบ
                </Button>
              </section>
            </section>
          ) : (
            <section>
              <div>{getNextActionMessage()}</div>
            </section>
          )}
        </>
      )}

      <Modal isOpen={isOpenDetailForm} onOpenChange={onOpenChangeDetailForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                รายละเอียดของ {data?.quest_title || "ไม่มีหัวข้อ"}
              </ModalHeader>
              <ModalBody>
                <div id="modal-description" className="prose text-gray-600">
                  {/* รายละเอียดใน Modal */}
                  <div
                    className="prose prose-sm text-gray-600 break-words overflow-hidden font-semibold "
                    style={{
                      maxWidth: "100%",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    คำอธิบาย
                    <ReactMarkdown remarkPlugins={[remarkGfm]} className="px-4">
                      {data?.description}
                    </ReactMarkdown>
                  </div>
                  ระยะเวลาในการทำ
                  <div className="grid justify-center list-none text-sm text-gray-600 font-medium px-4">
                    {data?.type === "onlyOne" ? (
                      <>
                        <li>
                          ตั้งแต่วันที่:{" "}
                          {formatDateThaiAndTime(data?.start_date)}
                        </li>
                        <li>
                          ถึงวันที่: {formatDateThaiAndTime(data?.due_date)}
                        </li>
                      </>
                    ) : data?.type === "Weekly" ? (
                      <li>
                        ทุกวัน:{" "}
                        {data?.settings?.selected_daysOfWeek || "ไม่ระบุ"}
                      </li>
                    ) : (
                      <li>
                        ทุกวันที่:{" "}
                        {data?.settings?.selected_daysOfWeek || "ไม่ระบุ"}{" "}
                        ของเดือน
                      </li>
                    )}
                  </div>
                  กฎเกณฑ์
                  <div className="grid grid-cols-1 list-none text-sm text-gray-600 font-medium px-4">
                    <li>จำนวนคำถาม: {data?.questions?.length || 0} ข้อ</li>
                    <li>จำนวนคะเเนน: {data?.points || 0} คะเเนน</li>
                    <li>
                      มีจำนวนอันดับ: {data?.settings?.ranking || 0} อันดับ
                    </li>
                    <li>
                      จำนวนเดือนที่อันดับไม่ซ้ำกัน:{" "}
                      {data?.questions?.ranking || 0}
                    </li>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default WeOneFormVote;
