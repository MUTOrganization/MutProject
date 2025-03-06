import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Layout";
import {
  Tabs,
  Tab,
  Button,
  Card,
  Accordion,
  AccordionItem,
  Textarea,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Badge,
  RadioGroup,
  Radio,
  Chip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  LeftArrowIcon,
  StopUsing,
  PlusIcon,
  SubtractIcon,
  EditIcon,
} from "../../../../../../component/Icons"; // Add StopUsing
import { useNavigate, useLocation } from "react-router-dom";
import MonthSelector from "../../../../Components/MonthSelector";
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import CountdownComponent from "../../../../Components/CountdownComponent.jsx";
import { formatDateObject } from "../../../../../../component/DateUtiils.jsx";
import DateTimeVote from "../../../../Components/DateTimeVote.jsx";
import DateTimeSelector from "../../../../Components/DateTimeSelector.jsx";
import TimeSelector from "../../../../Components/TimeSelector.jsx";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  generateDays,
  generatePeople,
} from "../../../../Components/calculateRemainingTime.jsx";
const toMySQLDateTime = (calendarDate) => {
  const jsDate = calendarDate.toDate(getLocalTimeZone());
  return dayjs(jsDate).format("YYYY-MM-DD HH:mm");
};

const toMySQLTime = (calendarDate) => {
  const jsDate = calendarDate.toDate(getLocalTimeZone());
  return dayjs(jsDate).format("HH:mm:ss"); // เฉพาะเวลา
};

function WeOneSettingVote() {
  const days = generateDays();
  const peoples = generatePeople();
  const useData = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDays, setSelectedDays] = useState([]);
  const [questionsNoChoies, setQuestionsNoChoies] = useState([{ title: "" }]);
  const [questions, setQuestions] = useState([{ title: "", choices: [""] }]);
  const [selectedNumberDay, setSelectedNumberDay] = useState([]);
  const [selectedNumberUser, setSelectedNumberUser] = useState([]);
  const [selectedUserVote, setSelectedUserVote] = useState([]);
  const [typePointsQuestions, setTypePointsQuestions] = useState("0");
  const [confirmPayload, setConfirmPayload] = useState({});

  const numberOptions = Array.from(
    { length: selectedUserVote },
    (_, i) => i + 1
  ); // [1, 2, 3, 4, 5]

  const [selectedNumberDuplicate, setSelectedNumberDuplicate] = useState([]);

  const [formData, setFormData] = useState({
    quest_title: "",
    points: "",
    description: "",
    start: toMySQLDateTime(now(getLocalTimeZone())),
    end: toMySQLDateTime(now(getLocalTimeZone())),
  });

  const [timeData, setTimeData] = useState({
    startTime: toMySQLTime(now(getLocalTimeZone())),
    endTime: toMySQLTime(now(getLocalTimeZone())),
  });

  const [selected, setSelected] = useState("History");
  const [selectedStatus, setSelectedStatus] = useState("ongoing");
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [typeVote, setTypeVote] = useState("onlyOne");
  const [typeChoice, setTypeChoice] = useState("user");
  const [typeNocoment, setTypeNocoment] = useState("1");
  const [typeDuplicateNo, setTypeDuplicateNo] = useState("1");
  const [Points, setPoints] = useState("average");
  const [configPoints, setConfigPoints] = useState("0");

  const [averagePoint, setAveragePoint] = useState(""); // คะแนนเฉลี่ย
  const [customPoints, setCustomPoints] = useState([]); // คะแนนแต่ละอันดับ

  const initialDays = [
    { key: "1", label: "วันจันทร์" },
    { key: "2", label: "วันอังคาร" },
    { key: "3", label: "วันพุธ" },
    { key: "4", label: "วันพฤหัสบดี" },
    { key: "5", label: "วันศุกร์" },
    { key: "6", label: "วันเสาร์" },
    { key: "7", label: "วันอาทิตย์" },
  ];

  const [monthRange, setMonthRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });

  const [accordionData, setAccordionData] = useState([]);

  const {
    isOpen: isModalAddQuest,
    onOpen: onOpenModalAddQuest,
    onOpenChange: onOpenChangeModalAddQuest,
  } = useDisclosure();

  const fetchFormData = async () => {
    setIsLoading(true);
    try {
      // Call the API
      const url = `${URLS.weOne.getForm}`;
      const params = {
        business_id: useData.currentUser.businessId,
        start_date: `${formatDateObject(monthRange.start)} 00:00:00`,
        due_date: `${formatDateObject(monthRange.end)} 23:59:59`,
      };
      const response = await axios.get(url, { params });

      // Access the correct data structure
      const data = response.data?.quests || []; // Fallback to empty array if undefined

      const currentDate = new Date();

      // Map over the data and assign status
      const updatedData = data.map((quest) => {
        if (quest.is_active === 0) {
          // กรณีปิดการใช้งาน
          return { ...quest, status: "close" };
        } else if (new Date(quest.due_date) < currentDate) {
          // กรณีที่หมดเวลา
          return { ...quest, status: "completed" };
        } else if (new Date(quest.start_date) > currentDate) {
          // กรณียังไม่เริ่ม
          return { ...quest, status: "future" };
        }
        return quest;
      });

      // Sort data based on status
      const sortedData = updatedData.sort((a, b) => {
        const statusOrder = { ongoing: 0, future: 1, completed: 2, close: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      // Update state with sorted data
      setAccordionData(sortedData);
      console.log(sortedData);
    } catch (error) {
      console.error("Error fetching quest data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, [monthRange]);

  const handleDelete = async (key, status) => {
    try {
      console.log("id", key, "status", status);

      const is_active = status === "close" ? 1 : 0; // ถ้าสถานะเป็น close ให้เปลี่ยนเป็นเปิดใช้งาน (1)

      // ตัวอย่างการตั้งค่า API URL และ Query Parameters
      const url = `${URLS.weOne.inActiveForm}?setting_id=${key}&is_active=${is_active}`;

      // ส่งคำขอ PUT
      const response = await axios.put(url);

      if (response.status === 200) {
        console.log(
          `Quest ${status === "close" ? "enabled" : "disabled"} successfully:`,
          response.data
        );
        fetchFormData(); // อัปเดตข้อมูลใหม่
      } else {
        console.warn(
          `Failed to ${status === "close" ? "enable" : "disable"} quest:`,
          response.data
        );
      }
    } catch (error) {
      console.error(
        `Error ${status === "close" ? "enabling" : "disabling"} quest:`,
        error.message
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = accordionData.map((item) => {
        if (item.status === "ongoing" && new Date(item.endDate) <= new Date()) {
          return { ...item, status: "completed" };
        }
        return item;
      });
      setAccordionData(updatedData);
    }, 1000);

    return () => clearInterval(interval);
  }, [accordionData]);

  const statusCounts = accordionData.reduce(
    (counts, item) => {
      counts.all += 1;
      counts[item.status] += 1; // item.status เป็น ongoing หรือ completed
      return counts;
    },
    { all: 0, ongoing: 0, completed: 0, future: 0, close: 0 } // เริ่มต้นนับเป็น 0
  );

  const filteredData =
    selectedStatus === "all"
      ? accordionData
      : accordionData.filter((item) => item.status === selectedStatus);

  const handleBack = () => {
    navigate(-1, {
      state: { activeTab: location.state?.activeTab || "ManageMission" },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (range) => {
    setFormData((prev) => ({
      ...prev,
      start: range.start,
      end: range.end,
    }));
  };

  const handleTimeChange = (range) => {
    setTimeData((prev) => ({
      ...prev,
      startTime: range.start,
      endTime: range.end,
    }));
  };

  const handleReset = () => {
    // รีเซ็ตค่าฟอร์ม
    setFormData({
      quest_title: "",
      points: "",
      description: "",
      start: toMySQLDateTime(now(getLocalTimeZone())),
      end: toMySQLDateTime(now(getLocalTimeZone())),
    });

    // รีเซ็ตค่าคำถามและตัวเลือก
    setQuestionsNoChoies([{ title: "" }]);
    setQuestions([{ title: "", choices: [""] }]);

    // รีเซ็ตค่าการตั้งค่า
    setSelectedDays([]);
    setSelectedNumberDay([]);
    setSelectedNumberUser([]);
    setSelectedUserVote([]);
    setSelectedNumberDuplicate([]);
    setTimeData({
      startTime: toMySQLTime(now(getLocalTimeZone())),
      endTime: toMySQLTime(now(getLocalTimeZone())),
    });

    // รีเซ็ตค่าการตั้งค่าอื่นๆ
    setTypeVote("onlyOne");
    setTypeChoice("user");
    setTypeNocoment("1");
    setTypeDuplicateNo("1");
    setPoints("average");
    setConfigPoints("0");
    setAveragePoint("");
    setCustomPoints([]);

    // รีเซ็ตสถานะ reset เพื่อบอกคอมโพเนนต์อื่นให้รีเฟรชค่า
    setReset(new Date());
  };

  const handleConfirmAddQuest = async (e) => {
    if (e) e.preventDefault();

    // ตรวจสอบข้อมูลในฟอร์ม
    if (
      !formData.quest_title ||
      !formData.description ||
      !formData.start ||
      !formData.end
    ) {
      toastError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (
      (typeChoice === "user" &&
        (!questionsNoChoies || questionsNoChoies.length === 0)) ||
      (typeChoice !== "user" && (!questions || questions.length === 0))
    ) {
      toastError("กรุณาเพิ่มคำถามก่อนดำเนินการต่อ");
      return;
    }

    // ตรวจสอบว่าคำถามมี title หรือไม่
    if (
      (typeChoice === "user" &&
        questionsNoChoies.some((q) => !q.title || q.title.trim() === "")) ||
      (typeChoice !== "user" &&
        questions.some((q) => !q.title || q.title.trim() === ""))
    ) {
      toastError("กรุณาระบุหัวข้อสำหรับคำถามทุกข้อ");
      return;
    }

    if (
      typeChoice !== "user" &&
      questions.some((q) => !q.choices || q.choices.length === 0)
    ) {
      toastError("กรุณาเพิ่มตัวเลือกสำหรับคำถามทุกข้อ");
      return;
    }
    
    // ตรวจสอบว่าตัวเลือกในคำถามมีข้อความครบถ้วน
    if (
      typeChoice !== "user" &&
      questions.some((q) =>
        q.choices.some((choice) => !choice || choice.trim() === "")
      )
    ) {
      toastError("กรุณาระบุข้อความสำหรับตัวเลือกทุกตัวในคำถาม");
      return;
    }

    const payload = {
      quest_title: formData.quest_title,
      description: formData.description,
      business_id: useData.currentUser.businessId,
      start_date: formData.start,
      due_date: formData.end,
      points: parseInt(formData.points, 10) || 0,
      type: typeVote,
      settings: {
        selected_daysOfWeek: selectedDays || [], // ใช้ในกรณี Weekly
        selected_daysOfMonths: Array.isArray(selectedNumberDay)
          ? selectedNumberDay
          : [selectedNumberDay] || [],
        selected_choices: parseInt(selectedNumberUser) || 1,
        user_options: typeChoice,
        no_comment_option: typeNocoment === "1" ? 1 : 0,
        duplicate_rank: parseInt(selectedNumberDuplicate) || 0,
        ranking: parseInt(selectedUserVote) || 3,
        startTime: timeData.startTime,
        endTime: timeData.endTime,
        configPoints: parseInt(configPoints),
        typePoints: configPoints === "1" ? Points : "",
        valuePoints:
          configPoints === "1"
            ? Points === "average"
              ? [parseInt(averagePoint)]
              : customPoints
            : [],
      },
      questions:
        typeChoice === "user"
          ? questionsNoChoies.map((q) => {
              if (!q.title || q.title.trim() === "") {
                toastError("กรุณาระบุหัวข้อสำหรับคำถามทุกข้อ");
                throw new Error("คำถามไม่มีหัวข้อ");
              }
              return {
                title: q.title,
                choices: [], // เฉพาะหัวข้อในกรณี typeChoice === 'user'
              };
            })
          : questions.map((q) => {
              if (!q.title || q.title.trim() === "") {
                toastError("กรุณาระบุหัวข้อสำหรับคำถามทุกข้อ");
                throw new Error("คำถามไม่มีหัวข้อ");
              }
              if (!q.choices || q.choices.length === 0) {
                toastError("กรุณาเพิ่มตัวเลือกสำหรับคำถามทุกข้อ");
                throw new Error("คำถามไม่มีตัวเลือก");
              }
              return {
                title: q.title, // หัวข้อ
                choices: q.choices, // ตัวเลือก
              };
            }),
    };

    // เก็บ payload ใน state
    setConfirmPayload(payload);

    // เปิด Modal ยืนยัน
    onOpenModalAddQuest();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    console.log(confirmPayload);

    try {
      const response = await axios.post(
        `${URLS.weOne.createForm}`,
        confirmPayload
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Mission created successfully:", response.data);
        onOpenChangeModalAddQuest(false);
        // รีเซ็ตฟอร์มเมื่อการสร้างภารกิจสำเร็จ
        setFormData({
          quest_title: "",
          points: "",
          description: "",
          start: toMySQLDateTime(now(getLocalTimeZone())),
          end: toMySQLDateTime(now(getLocalTimeZone())),
        });
        toastSuccess("สร้างภารกิจสำเร็จ");
        fetchFormData();
        setSelected("History");
      } else {
        console.warn("Unexpected response status:", response.status);
        toastError("Server มีปัญหา โปรดลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error creating mission:", error.message);
      toastError("สร้างภารกิจไม่สำเร็จ");
    }
  };

  const handleTypeVoteChange = (value) => {
    // รีเซ็ตค่าที่เกี่ยวข้องกับฟอร์ม
    setFormData({
      quest_title: "",
      points: "",
      description: "",
      start: toMySQLDateTime(now(getLocalTimeZone())),
      end: toMySQLDateTime(now(getLocalTimeZone())),
    });

    // รีเซ็ตค่าที่เกี่ยวข้องกับคำถามและตัวเลือก
    setQuestionsNoChoies([{ title: "" }]);
    setQuestions([{ title: "", choices: [""] }]);

    // รีเซ็ตค่าที่เกี่ยวข้องกับการตั้งค่า
    setSelectedDays([]);
    setSelectedNumberDay([]);
    setSelectedNumberUser([]);
    setSelectedUserVote([1]);
    setSelectedNumberDuplicate([]);
    setTimeData({
      startTime: toMySQLTime(now(getLocalTimeZone())),
      endTime: toMySQLTime(now(getLocalTimeZone())),
    });

    // รีเซ็ตค่าการตั้งค่าอื่นๆ

    setTypeVote(value);
    setTypePointsQuestions("0");
    setTypeChoice("user");
    setTypeNocoment("1");
    setTypeDuplicateNo("1");
    setPoints("average");
    setConfigPoints("0");
    setAveragePoint("");
    setCustomPoints([]);
  };

  const handleTypeQuestion = (value) => {
    // อัปเดตสถานะว่ามีแต้มหรือไม่มีแต้ม
    setTypePointsQuestions(value);

    if (value === "1") {
      // ตั้งค่าดีฟอลต์สำหรับแบบสอบถามที่มีแต้ม
      setConfigPoints("0"); // การตั้งค่าคะแนนยังไม่ได้กำหนด
      setPoints("average"); // ดีฟอลต์เป็นคะแนนเฉลี่ย
      setAveragePoint("");
      setCustomPoints([]);
    } else {
      // รีเซ็ตค่าที่เกี่ยวข้องเมื่อไม่มีแต้ม
      setFormData((prev) => ({
        ...prev,
        points: "",
      }));
      setConfigPoints("0");
      setPoints("");
      setAveragePoint("");
      setCustomPoints([]);
    }
  };

  const handleTypeChoiceChange = (value) => {
    setTypeChoice(value);
    setQuestionsNoChoies([{ title: "" }]); // รีเซ็ตคำถามเมื่อเปลี่ยนประเภท
    setQuestions([{ title: "", choices: [""] }]); // รีเซ็ตตัวเลือก
  };

  const toggleSelect = (key) => {
    setSelectedDays((prev) =>
      prev.includes(key) ? prev.filter((day) => day !== key) : [...prev, key]
    );
  };
  const addQuestionOptionUser = () => {
    setQuestionsNoChoies([...questionsNoChoies, { title: "" }]); // เพิ่มช่องว่างใหม่
  };

  const updateQuestionOptionUser = (index, value) => {
    const updatedQuestions = [...questionsNoChoies];
    updatedQuestions[index].title = value; // อัปเดตข้อความของหัวข้อ
    setQuestionsNoChoies(updatedQuestions);
  };

  const removeQuestionOptionUser = (index) => {
    const updatedQuestions = questionsNoChoies.filter((_, i) => i !== index);
    setQuestionsNoChoies(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { title: "", choices: [""] }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const updateQuestionTitle = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].title = value;
    setQuestions(updatedQuestions);
  };

  const addChoice = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push("");
    setQuestions(updatedQuestions);
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(updatedQuestions);
  };

  const updateChoice = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(updatedQuestions);
  };

  // ฟังก์ชันสำหรับอัปเดตคะแนนเฉลี่ย
  const handleAveragePointChange = (e) => {
    setAveragePoint(e.target.value);
  };

  // ฟังก์ชันสำหรับอัปเดตคะแนนแบบ Custom
  const handleCustomPointChange = (index, value) => {
    const updatedPoints = [...customPoints];
    updatedPoints[index] = Number(value); // แปลงค่าเป็นตัวเลข
    setCustomPoints(updatedPoints);
  };

  const handleTypePoints = (value) => {
    setConfigPoints(value);
    setPoints("average");
    setAveragePoint("");
    setCustomPoints([]);
  };

  const handlePoints = (value) => {
    setPoints(value);
    setAveragePoint("");
    setCustomPoints([]);
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="py-6 space-y-6 bg-white z-10">
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
              สร้างแบบสอบถาม
            </h2>
            {selected === "History" && (
              <span
                className={`flex p-2 text-lg ${
                  isDeleteMode ? "text-red-500" : "text-gray-500"
                }`}
              >
                <EditIcon onPress={() => setIsDeleteMode(!isDeleteMode)} />
              </span>
            )}
          </div>

          <div className="flex flex-col w-full px-4">
            <Card
              className="overflow-hidden"
              shadow="none"
              style={{ background: "transparent" }}
            >
              <Tabs
                fullWidth
                size="md"
                aria-label="Mission Tabs"
                selectedKey={selected}
                onSelectionChange={setSelected}
              >
                <Tab key="History" title="ประวัติแบบสอบถาม">
                  <div>
                    <MonthSelector
                      value={monthRange}
                      onChange={(newRange) => setMonthRange(newRange)}
                      className="custom-class mb-2"
                    />
                  </div>

                  <div
                    className="flex overflow-hidden"
                    style={{
                      whiteSpace: "nowrap", // ป้องกันข้อความตัดบรรทัด
                    }}
                  >
                    <section className="overflow-x-auto scrollbar-hide space-x-4 py-2">
                      <Button
                        color="primary"
                        variant={selectedStatus === "all" ? "flat" : "bordered"}
                        onPress={() => setSelectedStatus("all")}
                      >
                        <div
                          className={`flex items-center justify-between  ${statusCounts.all === 0 ? "" : "space-x-2"}`}
                        >
                          <span
                            className={`flex  ${statusCounts.all === 0 ? "" : "mr-2"}`}
                          >
                            ทั้งหมด
                          </span>
                          <Badge
                            content={
                              statusCounts.all === 0
                                ? undefined
                                : statusCounts.all
                            }
                            shape="circle"
                            showOutline={false}
                            className="bg-red-500 text-white"
                          />
                        </div>
                      </Button>
                      <Button
                        color="primary"
                        variant={
                          selectedStatus === "ongoing" ? "flat" : "bordered"
                        }
                        onPress={() => setSelectedStatus("ongoing")}
                      >
                        <div
                          className={`flex items-center justify-between  ${statusCounts.ongoing === 0 ? "" : "space-x-2"}`}
                        >
                          <span
                            className={`flex  ${statusCounts.ongoing === 0 ? "" : "mr-2"}`}
                          >
                            กำลังดำเนินการ
                          </span>
                          <Badge
                            content={
                              statusCounts.ongoing === 0
                                ? undefined
                                : statusCounts.ongoing
                            }
                            shape="circle"
                            showOutline={false}
                            className="bg-red-500 text-white"
                          />
                        </div>
                      </Button>
                      <Button
                        color="primary"
                        variant={
                          selectedStatus === "completed" ? "flat" : "bordered"
                        }
                        onPress={() => setSelectedStatus("completed")}
                      >
                        <div
                          className={`flex items-center justify-between  ${statusCounts.completed === 0 ? "" : "space-x-2"}`}
                        >
                          <span
                            className={`flex  ${statusCounts.completed === 0 ? "" : "mr-2"}`}
                          >
                            สำเร็จแล้ว
                          </span>
                          <Badge
                            content={
                              statusCounts.completed === 0
                                ? undefined
                                : statusCounts.completed
                            }
                            shape="circle"
                            showOutline={false}
                            className="bg-red-500 text-white"
                          />
                        </div>
                      </Button>
                      <Button
                        color="primary"
                        variant={
                          selectedStatus === "future" ? "flat" : "bordered"
                        }
                        onPress={() => setSelectedStatus("future")}
                      >
                        <div
                          className={`flex items-center justify-between  ${statusCounts.future === 0 ? "" : "space-x-2"}`}
                        >
                          <span
                            className={`flex  ${statusCounts.future === 0 ? "" : " mr-2"}`}
                          >
                            ยังไม่เริ่มแบบสอบถาม
                          </span>
                          <Badge
                            content={
                              statusCounts.future === 0
                                ? undefined
                                : statusCounts.future
                            }
                            shape="circle"
                            showOutline={false}
                            className="bg-red-500 text-white"
                          />
                        </div>
                      </Button>
                      <Button
                        color="primary"
                        variant={
                          selectedStatus === "close" ? "flat" : "bordered"
                        }
                        onPress={() => setSelectedStatus("close")}
                      >
                        <div
                          className={`flex items-center justify-between  ${statusCounts.close === 0 ? "" : "space-x-2"}`}
                        >
                          <span
                            className={`flex  ${statusCounts.close === 0 ? "" : " mr-2"}`}
                          >
                            ปิดการใช้งาน
                          </span>
                          <Badge
                            content={
                              statusCounts.close === 0
                                ? undefined
                                : statusCounts.close
                            }
                            shape="circle"
                            showOutline={false}
                            className="bg-red-500 text-white"
                          />
                        </div>
                      </Button>
                    </section>
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
                        <div className="flex flex-col">
                          {filteredData.map((item) => (
                            <div
                              key={item.id}
                              className={`flex items-center mb-2 transition-transform duration-500 ease-in-out ${
                                isDeleteMode
                                  ? "-translate-x-2"
                                  : "translate-x-0"
                              }`}
                            >
                              {/* Accordion */}
                              <Accordion
                                variant="splitted"
                                className="shadow-none flex-grow"
                                aria-label="Mission History Accordion"
                              >
                                <AccordionItem
                                  className="shadow-md"
                                  isDisabled={
                                    item.status === "close" &&
                                    selectedStatus !== "close"
                                  }
                                  key={item.id}
                                  aria-label={`Mission ${item.id}`}
                                  title={
                                    <div className="flex justify-between items-center gap-4">
                                      {/* Left Section: Title and Countdown */}
                                      <div className="flex flex-col flex-grow overflow-hidden">
                                        <span
                                          className="text-primary text-md overflow-hidden whitespace-nowrap text-ellipsis"
                                          style={{ maxWidth: "200px" }}
                                          title={item.quest_title}
                                        >
                                          {item.quest_title}
                                        </span>
                                        <span className="text-sm flex flex-col">
                                          {new Date(item.start_date) >
                                          new Date() ? (
                                            <>
                                              <span>กำลังจะเริ่มอีก</span>
                                              <CountdownComponent
                                                startDate={new Date()}
                                                endDate={item.start_date}
                                              />
                                            </>
                                          ) : item.status === "ongoing" ? (
                                            <>
                                              <span>เวลาคงเหลือ</span>
                                              <CountdownComponent
                                                startDate={item.start_date}
                                                endDate={item.due_date}
                                              />
                                            </>
                                          ) : (
                                            "ภารกิจเสร็จสิ้น"
                                          )}
                                        </span>
                                      </div>

                                      {/* Right Section: Status */}
                                      <div className="flex-shrink-0">
                                        <span
                                          className={`px-2 py-1 rounded-full text-sm ${
                                            item.status === "completed"
                                              ? "bg-success text-white"
                                              : item.status === "future"
                                                ? "bg-gray-400 text-white"
                                                : item.status === "close"
                                                  ? "bg-red-500 text-white"
                                                  : "bg-warning text-white"
                                          }`}
                                        >
                                          {item.status === "completed"
                                            ? "สำเร็จแล้ว"
                                            : item.status === "future"
                                              ? "ยังไม่เริ่มแบบสอบถาม"
                                              : item.status === "close"
                                                ? "ปิดการใช้งาน"
                                                : "กำลังดำเนินการ"}
                                        </span>
                                      </div>
                                    </div>
                                  }
                                >
                                  <div className="flex flex-col gap-2">
                                    <div key={item.id}>
                                      <div className="space-y-2 mb-4">
                                        <p className="font-medium">
                                          รายละเอียดกิจกรรม
                                        </p>
                                        <div
                                          className="prose prose-sm text-gray-600 break-words overflow-hidden"
                                          style={{
                                            maxWidth: "100%",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                          }}
                                        >
                                          <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                          >
                                            {item.description ||
                                              "ไม่มีรายละเอียดกิจกรรม"}
                                          </ReactMarkdown>
                                        </div>
                                      </div>

                                      {/* Points */}

                                      <div className="flex flex-col gap-2 text-gray-600 pb-4">
                                        <div className="flex items-center gap-2 ">
                                          <p className="text-sm font-medium">
                                            จำนวนแต้มของคนที่ทำแบบสอบถาม:
                                          </p>
                                          <p className="text-sm">
                                            {item.points || "0"} แต้ม
                                          </p>
                                        </div>
                                        {item.settings &&
                                          item.settings.typePoints && // Ensure typePoints exists
                                          item.settings.valuePoints && // Ensure valuePoints exists
                                          item.settings.valuePoints.length >
                                            0 && ( // Ensure valuePoints has data
                                            <div
                                              className={`flex ${
                                                item.settings.typePoints ===
                                                "average"
                                                  ? "flex-row"
                                                  : "flex-col"
                                              } gap-2 `}
                                            >
                                              <p className="text-sm font-medium">
                                                คะแนนสำหรับอันดับ:
                                              </p>
                                              {item.settings.typePoints ===
                                              "average" ? (
                                                <p className="text-sm">
                                                  {item.settings
                                                    .valuePoints?.[0] ||
                                                    "0"}{" "}
                                                  แต้ม เท่ากันทุกอันดับ
                                                </p>
                                              ) : (
                                                <div className="flex overflow-x-auto whitespace-nowrap gap-2 w-full scrollbar-hide">
                                                  {item.settings.valuePoints.map(
                                                    (point, index) => (
                                                      <Chip
                                                        key={index}
                                                        variant="flat"
                                                        color="warning"
                                                        className="text-xs"
                                                      >
                                                        อันดับที่ {index + 1}:{" "}
                                                        {point} แต้ม
                                                      </Chip>
                                                    )
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                      </div>

                                      {/* Start and End Date */}
                                      <div className="flex flex-col justify-between text-sm text-gray-600 mb-4 gap-3">
                                        <div>
                                          <p className="font-medium">
                                            วันและเวลาที่เริ่มแบบสอบถาม
                                          </p>
                                          <p>
                                            {new Date(
                                              item.start_date
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            วันและเวลาที่สิ้นสุดแบบสอบถาม
                                          </p>
                                          <p>
                                            {new Date(
                                              item.due_date
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Additional Details */}
                                      <div className="flex flex-col gap-2 text-gray-600">
                                        <p className="font-medium text-sm">
                                          ข้อมูลเพิ่มเติม:
                                        </p>
                                        <ul className="list-disc pl-5 text-xs">
                                          <li>
                                            ประเภทแบบสอบถาม:{" "}
                                            {item.type === "onlyOne"
                                              ? "ครั้งเดียว"
                                              : item.type === "Weekly"
                                                ? "สัปดาห์ละครั้ง"
                                                : item.type === "Monthly"
                                                  ? "เดือนละครั้ง"
                                                  : "-"}
                                          </li>

                                          {item.settings &&
                                            item.type !== "onlyOne" && (
                                              <>
                                                <li>
                                                  เวลาในการเปิด:{" "}
                                                  {item.settings.startTime ||
                                                    "-"}{" "}
                                                  ถึง{" "}
                                                  {item.settings.endTime || "-"}
                                                </li>
                                                {item.settings
                                                  .selected_daysOfWeek &&
                                                  item.settings
                                                    .selected_daysOfWeek
                                                    .length > 0 && (
                                                    <li>
                                                      วันที่ในสัปดาห์:{" "}
                                                      {item.settings.selected_daysOfWeek
                                                        .map((day) =>
                                                          day === "1"
                                                            ? "วันจันทร์"
                                                            : day === "2"
                                                              ? "วันอังคาร"
                                                              : day === "3"
                                                                ? "วันพุธ"
                                                                : day === "4"
                                                                  ? "วันพฤหัสบดี"
                                                                  : day === "5"
                                                                    ? "วันศุกร์"
                                                                    : day ===
                                                                        "6"
                                                                      ? "วันเสาร์"
                                                                      : "วันอาทิตย์"
                                                        )
                                                        .join(", ")}
                                                    </li>
                                                  )}
                                              </>
                                            )}
                                          {item.settings.selected_daysOfMonths
                                            .length > 0 && (
                                            <li>
                                              ทุกวันที่ :{" "}
                                              {item.settings.selected_daysOfMonths.join(
                                                ", "
                                              )}{" "}
                                              ของเดือน
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionItem>
                              </Accordion>
                              {/* ไอคอนลบ แสดงเฉพาะในโหมดลบ */}
                              {isDeleteMode && (
                                <span
                                  className={`flex p-2 text-lg ${
                                    item.status === "close"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  } cursor-pointer`}
                                  onPress={() => {
                                    handleDelete(item.quest_id, item.status);
                                  }}
                                >
                                  {item.status === "close" ? (
                                    <StopUsing />
                                  ) : (
                                    <StopUsing />
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </form>
                  )}
                </Tab>

                <Tab key="CreateVote" title="สร้างแบบสอบถาม">
                  <form className="flex flex-col gap-4 max-h-screen">
                    <div className="flex flex-col space-y-3 px-4 max-h-[75vh] overflow-y-auto pb-20 scrollbar-hide">
                      <div className="flex flex-col space-y-3">
                        <label className="font-medium">ประเภทเเบบสอบถาม</label>
                        <RadioGroup
                          orientation="horizontal"
                          defaultValue="onlyOne"
                          size="sm"
                          color="default"
                          className="flex items-center justify-between w-full border-b py-3"
                        >
                          <Radio
                            value="onlyOne"
                            className="flex-1 text-center"
                            onPress={() => handleTypeVoteChange("onlyOne")}
                          >
                            ครั้งเดียว
                          </Radio>
                          <Radio
                            value="Weekly"
                            className="flex-1 text-center"
                            onPress={() => handleTypeVoteChange("Weekly")}
                          >
                            ทุกสัปดาห์/Weekly
                          </Radio>
                          <Radio
                            value="Monthly"
                            className="flex-1 text-center"
                            onPress={() => handleTypeVoteChange("Monthly")}
                          >
                            ทุกเดือน/Monthly
                          </Radio>
                        </RadioGroup>
                      </div>
                      <div className="flex flex-col gap-3 items-center pb-3">
                        <RadioGroup
                          orientation="horizontal"
                          value={typePointsQuestions} // ใช้ value ที่มาจาก state
                          size="sm"
                          color="default"
                          className="flex items-center justify-between w-full"
                        >
                          <Radio
                            value="1"
                            className="flex-1 text-center"
                            onPress={() => handleTypeQuestion("1")}
                          >
                            แบบสอบถามมีแต้ม
                          </Radio>
                          <Radio
                            value="0"
                            className="flex-1 text-center"
                            onPress={() => handleTypeQuestion("0")}
                          >
                            แบบสอบถามไม่มีแต้ม
                          </Radio>
                        </RadioGroup>
                      </div>
                      {typeVote === "onlyOne" && (
                        <section className="flex flex-col space-y-3">
                          <div className="flex flex-col space-y-3">
                            <label className="font-medium">ชื่อแบบสอบถาม</label>
                            <Input
                              type="text"
                              name="quest_title"
                              value={formData.quest_title}
                              placeholder="ใส่ชื่อกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              className="w-full"
                            />
                          </div>
                          {typePointsQuestions === "1" && (
                            <div className="flex flex-col w-full">
                              <label className="font-medium mb-2">
                                จำนวนแต้มของคนที่ทำแบบสอบถาม
                              </label>
                              <Input
                                type="number"
                                name="points"
                                value={formData.points}
                                placeholder="จำนวน"
                                variant="bordered"
                                onChange={handleInputChange}
                                className="w-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col w-full">
                            <label className="font-medium mb-2">
                              รายละเอียดแบบสอบถาม
                            </label>
                            <Textarea
                              name="description"
                              value={formData.description}
                              placeholder="ใส่รายละเอียดกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              classNames={{
                                base: "w-full",
                                input: "resize-y min-h-[50px]",
                              }}
                            />
                          </div>
                        </section>
                      )}
                      {typeVote === "Weekly" && (
                        <section className="flex flex-col space-y-3">
                          <div className="flex flex-col space-y-3 overflow-hidden">
                            <label className="font-medium">เลือกวัน</label>
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                              {initialDays.map((day) => (
                                <Chip
                                  key={day.key} // ใช้ key เป็นภาษาอังกฤษ
                                  variant="flat"
                                  color=""
                                  className={`cursor-pointer ${
                                    selectedDays.includes(day.key)
                                      ? "bg-warning-500 text-white"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                  onPress={() => toggleSelect(day.key)}
                                >
                                  {day.label} {/* แสดงชื่อภาษาไทย */}
                                </Chip>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-3">
                            <label className="font-medium">ชื่อแบบสอบถาม</label>
                            <Input
                              type="text"
                              name="quest_title"
                              value={formData.quest_title}
                              placeholder="ใส่ชื่อกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              className="w-full"
                            />
                          </div>
                          {typePointsQuestions === "1" && (
                            <div className="flex flex-col w-full">
                              <label className="font-medium mb-2">
                                จำนวนแต้มของคนที่ทำแบบสอบถาม
                              </label>
                              <Input
                                type="number"
                                name="points"
                                value={formData.points}
                                placeholder="จำนวน"
                                variant="bordered"
                                onChange={handleInputChange}
                                className="w-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col w-full">
                            <label className="font-medium mb-2">
                              รายละเอียดแบบสอบถาม
                            </label>
                            <Textarea
                              name="description"
                              value={formData.description}
                              placeholder="ใส่รายละเอียดกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              classNames={{
                                base: "w-full",
                                input: "resize-y min-h-[50px]",
                              }}
                            />
                          </div>
                        </section>
                      )}
                      {typeVote === "Monthly" && (
                        <section className="flex flex-col space-y-3">
                          <div className="flex flex-row w-full gap-2">
                            <label className="font-medium w-1/3 flex items-center">
                              ทุกๆ วันที่
                            </label>
                            <div className="flex w-full">
                              <Select
                                disallowEmptySelection
                                variant="bordered"
                                label="เลือกวันที่"
                                size="sm"
                                className="w-full"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedNumberDay(value); // ตั้งค่าเดียว ไม่ใช่ array
                                }}
                                scrollShadowProps={{
                                  isEnabled: false,
                                }}
                              >
                                {days.map((day) => (
                                  <SelectItem key={day.key} value={day.key}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            </div>
                            <label className="font-medium w-1/3 flex items-center">
                              ของเดือน
                            </label>
                          </div>

                          <div className="flex flex-col space-y-3">
                            <label className="font-medium">ชื่อแบบสอบถาม</label>
                            <Input
                              type="text"
                              name="quest_title"
                              value={formData.quest_title}
                              placeholder="ใส่ชื่อกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              className="w-full"
                            />
                          </div>
                          {typePointsQuestions === "1" && (
                            <div className="flex flex-col w-full">
                              <label className="font-medium mb-2">
                                จำนวนแต้มของคนที่ทำแบบสอบถาม
                              </label>
                              <Input
                                type="number"
                                name="points"
                                value={formData.points}
                                placeholder="จำนวน"
                                variant="bordered"
                                onChange={handleInputChange}
                                className="w-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col w-full">
                            <label className="font-medium mb-2">
                              รายละเอียดแบบสอบถาม
                            </label>
                            <Textarea
                              name="description"
                              value={formData.description}
                              placeholder="ใส่รายละเอียดกิจกรรม"
                              variant="bordered"
                              onChange={handleInputChange}
                              classNames={{
                                base: "w-full",
                                input: "resize-y min-h-[50px]",
                              }}
                            />
                          </div>
                        </section>
                      )}
                      <section className="flex flex-col space-y-3 ">
                        <label className="font-medium">ระยะเวลากิจกรรม</label>
                        <DateTimeVote
                          onChange={handleDateTimeChange}
                          resetDate={reset}
                          value={{
                            start: new Date(formData.start),
                            end: new Date(formData.end),
                          }}
                        />
                      </section>
                      {typeVote !== "onlyOne" && (
                        <section className="flex flex-col space-y-3 ">
                          <label className="font-medium">
                            ช่วงเวลาในการเปิดแบบสอบถาม
                          </label>
                          <TimeSelector
                            onChange={handleTimeChange}
                            resetDate={reset}
                            value={{
                              startTime: timeData.start,
                              endTime: timeData.end,
                            }}
                          />
                        </section>
                      )}
                      <div className="flex flex-col space-y-3 ">
                        <label className="font-medium">ประเภทตัวเลือก</label>
                        <RadioGroup
                          orientation="horizontal"
                          defaultValue="user"
                          size="sm"
                          color="default"
                          className="flex  w-full border-b pb-4"
                        >
                          <Radio
                            value="user"
                            className="flex-1 text-center"
                            onPress={() => handleTypeChoiceChange("user")}
                          >
                            ตัวเลือกที่เป็นบุคคล
                          </Radio>
                          <Radio
                            value="customize"
                            className="flex-1 text-center"
                            onPress={() => handleTypeChoiceChange("customize")}
                          >
                            ตัวเลือกที่ตั้งค่าเอง
                          </Radio>
                        </RadioGroup>
                        {typeChoice === "user" && (
                          <div className="flex flex-col space-y-3">
                            <section className=" space-y-2 mb-2 border-b pb-4">
                              <label className="font-medium">
                                ตั้งค่าตัวเลือก
                              </label>
                              <div className="flex flex-row w-full gap-1 px-2">
                                <label className="font-medium flex items-center text-sm">
                                  จำนวนการเลือกของตัวเลือก
                                </label>
                                <div className="flex w-36">
                                  <Select
                                    disallowEmptySelection
                                    variant="bordered"
                                    label="เลือกจำนวน"
                                    size="sm"
                                    className="w-full"
                                    onChange={(e) =>
                                      setSelectedNumberUser(e.target.value)
                                    }
                                    scrollShadowProps={{
                                      isEnabled: false,
                                    }}
                                  >
                                    {peoples.map((day) => (
                                      <SelectItem key={day.key} value={day.key}>
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                </div>
                                <label className="font-medium flex items-center text-sm">
                                  ข้อ
                                </label>
                              </div>
                              <div className="flex flex-col w-full gap-3 px-2">
                                <label className="font-medium flex items-center text-sm">
                                  ต้องการให้เเบบสอบถามมี "ไม่เเสดงความคิดเห็น"
                                  หรือไม่
                                </label>
                                <RadioGroup
                                  orientation="horizontal"
                                  defaultValue={typeNocoment}
                                  size="sm"
                                  color="default"
                                  className="flex justify-between w-full"
                                >
                                  <Radio
                                    value="1"
                                    className="flex-1 text-center"
                                    onPress={() => setTypeNocoment("1")}
                                  >
                                    มี
                                  </Radio>
                                  <Radio
                                    value="0"
                                    className="flex-1 text-center"
                                    onPress={() => setTypeNocoment("0")}
                                  >
                                    ไม่มี
                                  </Radio>
                                </RadioGroup>
                              </div>
                            </section>

                            <label className="font-medium">
                              หัวข้อแบบสอบถาม
                            </label>
                            {questionsNoChoies.map((question, index) => (
                              <div
                                key={index}
                                className="flex flex-col space-y-3 border-b pb-4"
                              >
                                <label className="text-sm">
                                  หัวข้อที่ {index + 1} {question.title}
                                </label>
                                <div className="flex items-center space-x-3">
                                  <Input
                                    clearable
                                    fullWidth
                                    placeholder={`หัวข้อที่ ${index + 1}`}
                                    value={question.title}
                                    onChange={(e) =>
                                      updateQuestionOptionUser(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />

                                  {questionsNoChoies.length > 1 && ( // ปุ่มลบจะแสดงเมื่อมีมากกว่า 1 หัวข้อ
                                    <Button
                                      auto
                                      color="danger"
                                      size="sm"
                                      className="text-white"
                                      onPress={() =>
                                        removeQuestionOptionUser(index)
                                      }
                                      isIconOnly
                                    >
                                      <SubtractIcon />
                                    </Button>
                                  )}
                                  {index === questionsNoChoies.length - 1 && ( // ปุ่มเพิ่มจะแสดงเฉพาะในแถวสุดท้าย
                                    <Button
                                      auto
                                      color="success"
                                      onPress={addQuestionOptionUser}
                                      className="text-white"
                                      size="sm"
                                      isIconOnly
                                    >
                                      <PlusIcon />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {typeChoice === "customize" && (
                          <div className="flex flex-col space-y-3">
                            <section className=" space-y-2 mb-2 ">
                              <label className="font-medium">
                                ตั้งค่าตัวเลือก
                              </label>
                              <div className="flex flex-row w-full gap-1 px-2 ">
                                <label className="font-medium flex items-center text-sm">
                                  จำนวนการเลือกของตัวเลือก
                                </label>
                                <div className="flex w-36">
                                  <Select
                                    disallowEmptySelection
                                    variant="bordered"
                                    label="เลือกจำนวน"
                                    size="sm"
                                    className="w-full"
                                    onChange={(e) =>
                                      setSelectedNumberUser(e.target.value)
                                    }
                                    scrollShadowProps={{
                                      isEnabled: false,
                                    }}
                                  >
                                    {peoples.map((day) => (
                                      <SelectItem key={day.key} value={day.key}>
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                </div>
                                <label className="font-medium flex items-center text-sm ">
                                  ข้อ
                                </label>
                              </div>
                              <div className="flex flex-col w-full gap-3 px-2 border-b pb-4">
                                <label className="font-medium flex items-center text-sm">
                                  ต้องการให้เเบบสอบถามมี "ไม่เเสดงความคิดเห็น"
                                  หรือไม่
                                </label>
                                <RadioGroup
                                  orientation="horizontal"
                                  defaultValue="1"
                                  size="sm"
                                  color="default"
                                  className="flex justify-between w-full"
                                >
                                  <Radio
                                    value="1"
                                    className="flex-1 text-center"
                                    onPress={() => setTypeNocoment("1")}
                                  >
                                    มี
                                  </Radio>
                                  <Radio
                                    value="0"
                                    className="flex-1 text-center"
                                    onPress={() => setTypeNocoment("0")}
                                  >
                                    ไม่มี
                                  </Radio>
                                </RadioGroup>
                              </div>
                            </section>
                            <label className="font-medium">
                              หัวข้อแบบสอบถาม
                            </label>
                            {questions.map((question, questionIndex) => (
                              <div
                                key={questionIndex}
                                className="flex flex-col space-y-3 border-b pb-4"
                              >
                                <label className="text-sm">
                                  หัวข้อที่ {questionIndex + 1} {question.title}
                                </label>
                                <div className="flex items-center space-x-3">
                                  <Input
                                    clearable
                                    fullWidth
                                    placeholder={`หัวข้อที่ ${questionIndex + 1}`}
                                    value={question.title}
                                    onChange={(e) =>
                                      updateQuestionTitle(
                                        questionIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {questions.length > 1 && (
                                    <Button
                                      auto
                                      color="danger"
                                      className="text-white"
                                      size="sm"
                                      onPress={() =>
                                        removeQuestion(questionIndex)
                                      }
                                      isIconOnly
                                    >
                                      <SubtractIcon />
                                    </Button>
                                  )}
                                  {questionIndex === questions.length - 1 && (
                                    <Button
                                      auto
                                      color="success"
                                      className="text-white"
                                      size="sm"
                                      onPress={addQuestion}
                                      isIconOnly
                                    >
                                      <PlusIcon />
                                    </Button>
                                  )}
                                </div>

                                {/* ตัวเลือก */}
                                <div className="flex flex-col space-y-2">
                                  <label className="text-xs">
                                    ตัวเลือกทั้งหมด {question.choices.length}{" "}
                                    ข้อ
                                  </label>
                                  {question.choices.map(
                                    (choice, choiceIndex) => (
                                      <div
                                        key={choiceIndex}
                                        className="flex items-center space-x-3 ml-3"
                                      >
                                        <span>{choiceIndex + 1}.</span>
                                        <Input
                                          clearable
                                          fullWidth
                                          placeholder={`ตัวเลือกที่ ${choiceIndex + 1}`}
                                          value={choice}
                                          onChange={(e) =>
                                            updateChoice(
                                              questionIndex,
                                              choiceIndex,
                                              e.target.value
                                            )
                                          }
                                        />
                                        {question.choices.length > 1 && (
                                          <Button
                                            auto
                                            color="danger"
                                            className="text-white"
                                            size="sm"
                                            onPress={() =>
                                              removeChoice(
                                                questionIndex,
                                                choiceIndex
                                              )
                                            }
                                            isIconOnly
                                          >
                                            <SubtractIcon />
                                          </Button>
                                        )}
                                        {choiceIndex ===
                                          question.choices.length - 1 && (
                                          <Button
                                            auto
                                            color="success"
                                            className="text-white"
                                            size="sm"
                                            onPress={() =>
                                              addChoice(questionIndex)
                                            }
                                            isIconOnly
                                          >
                                            <PlusIcon />
                                          </Button>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <section className=" space-y-2 mb-2 border-b pb-4">
                        <label className="font-medium">ตั้งค่าการเเสดงผล</label>
                        <div className="flex flex-row w-full gap-1 px-2">
                          <label className="font-medium flex items-center text-sm">
                            จำนวนการจัดอันดับ
                          </label>
                          <div className="flex w-36">
                            <Select
                              disallowEmptySelection
                              variant="bordered"
                              label="เลือกจำนวน"
                              size="sm"
                              className="w-full"
                              onChange={(e) =>
                                setSelectedUserVote(e.target.value)
                              }
                              scrollShadowProps={{
                                isEnabled: false,
                              }}
                            >
                              {peoples.map((day) => (
                                <SelectItem key={day.key} value={day.key}>
                                  {day.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                          <label className="font-medium flex items-center text-sm">
                            อันดับ
                          </label>
                        </div>

                        {typePointsQuestions === "1" &&
                          typeChoice === "user" && (
                            <div className="flex flex-col w-full gap-3 px-2">
                              <div className="flex justify-between mt-2">
                                <div>
                                  <label className="font-medium flex items-center text-sm">
                                    ให้อันดับมีเเต้มหรือไม่
                                  </label>
                                </div>
                                <div>
                                  <RadioGroup
                                    orientation="horizontal"
                                    defaultValue={configPoints}
                                    size="sm"
                                    color="default"
                                    className="flex justify-between w-full"
                                  >
                                    <Radio
                                      value="1"
                                      className="flex-1 text-center"
                                      onPress={() => handleTypePoints("1")}
                                    >
                                      ต้องการ
                                    </Radio>
                                    <Radio
                                      value="0"
                                      className="flex-1 text-center"
                                      onPress={() => handleTypePoints("0")}
                                    >
                                      ไม่ต้องการ
                                    </Radio>
                                  </RadioGroup>
                                </div>
                              </div>
                              {configPoints === "1" && (
                                <>
                                  <div className="flex justify-center">
                                    <RadioGroup
                                      orientation="horizontal"
                                      defaultValue={Points}
                                      size="sm"
                                      color="default"
                                      className="flex justify-between w-full"
                                    >
                                      <Radio
                                        value="average"
                                        className="flex-1 text-center"
                                        onPress={() => handlePoints("average")}
                                      >
                                        คะเเนนเฉลี่ยทุกอันดับ
                                      </Radio>
                                      <Radio
                                        value="custom"
                                        className="flex-1 text-center"
                                        onPress={() => handlePoints("custom")}
                                      >
                                        ตั้งค่าคะเเนนทุกอันดับ
                                      </Radio>
                                    </RadioGroup>
                                  </div>
                                  <div>
                                    {Points === "average" ? (
                                      <div className="flex flex-row w-full gap-1 px-2">
                                        <label className="font-medium flex items-center text-sm">
                                          คะเเนนเฉลี่ยทุกอันดับ
                                        </label>
                                        <div className="flex w-32">
                                          <Input
                                            type="number"
                                            value={averagePoint}
                                            onChange={handleAveragePointChange}
                                            placeholder="ใส่คะเเนน"
                                            variant="bordered"
                                            className="w-full"
                                          />
                                        </div>
                                        <label className="font-medium flex items-center text-sm">
                                          คะเเนน
                                        </label>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col w-full gap-2 px-4 items-center">
                                        {numberOptions.map((number, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center gap-4"
                                          >
                                            <span className="font-medium">
                                              อันดับที่ {number}
                                            </span>
                                            <Input
                                              type="number"
                                              variant="bordered"
                                              value={customPoints[index] || []}
                                              onChange={(e) =>
                                                handleCustomPointChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              placeholder={`คะแนนอันดับ ${number}`}
                                              className="px-2 py-1 w-32"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                        {typeVote !== "onlyOne" && (
                          <div className="flex flex-col w-full gap-3 px-2">
                            <label className="font-medium flex items-center text-sm mt-5">
                              ต้องการให้อันดับซ้ำในเเต่ละเดือนหรือไม่
                            </label>
                            <RadioGroup
                              orientation="horizontal"
                              defaultValue="1"
                              size="sm"
                              color="default"
                              className="flex justify-between w-full"
                            >
                              <Radio
                                value="0"
                                className="flex-1 text-center"
                                onPress={() => setTypeDuplicateNo("0")}
                              >
                                ไม่ต้องการ
                              </Radio>
                              <Radio
                                value="1"
                                className="flex-1 text-center"
                                onPress={() => setTypeDuplicateNo("1")}
                              >
                                ต้องการ
                              </Radio>
                            </RadioGroup>
                            {typeDuplicateNo === "0" && (
                              <div className="flex flex-row w-full gap-1 px-2">
                                <label className="font-medium flex items-center text-sm">
                                  ห้ามซ้ำกันในระยะเวลา
                                </label>
                                <div className="flex w-32">
                                  <Select
                                    disallowEmptySelection
                                    variant="bordered"
                                    label="เลือกจำนวน"
                                    size="sm"
                                    className="w-full"
                                    onChange={(e) =>
                                      setSelectedNumberDuplicate(e.target.value)
                                    }
                                    scrollShadowProps={{
                                      isEnabled: false,
                                    }}
                                  >
                                    {peoples.map((day) => (
                                      <SelectItem key={day.key} value={day.key}>
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                </div>
                                <label className="font-medium flex items-center text-sm">
                                  เดือน
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </section>
                      <div className="flex gap-2 justify-end pt-4">
                        <ConfirmCancelButtons
                          onConfirm={handleConfirmAddQuest}
                          confirmText="สร้างเเบบสอบถาม"
                          onCancel={handleReset}
                          cancelText="ล้างข้อมูล"
                        />
                      </div>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalAddQuest}
        onOpenChange={onOpenChangeModalAddQuest}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>ต้องการเพิ่มแบบสอบถามใช่หรือไม่</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row text-gray-600 space-x-3">
                    <p className="text-sm font-medium">ประเภทเเบบสอบถาม :</p>
                    <p className="text-sm">
                      {confirmPayload.type === "onlyOne"
                        ? "ครั้งเดียว"
                        : confirmPayload.type === "Weekly"
                          ? "สัปดาห์ละครั้ง"
                          : confirmPayload.type === "Monthly"
                            ? "เดือนละครั้ง"
                            : "-"}
                    </p>
                  </div>

                  {/* Question Title */}
                  <div className="flex flex-col text-gray-600 gap-2">
                    <p className="text-sm font-medium">ชื่อแบบสอบถาม</p>
                    <p className="text-xs">
                      {confirmPayload.quest_title || "-"}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col text-gray-600 gap-2">
                    <p className="text-sm font-medium">รายละเอียดกิจกรรม</p>
                    <div
                      className="prose prose-sm text-gray-600 break-words overflow-hidden"
                      style={{
                        maxWidth: "100%",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {confirmPayload.description || "-"}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Points */}
                  {typePointsQuestions === "1" && (
                    <div className="flex flex-col gap-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          จำนวนแต้มของคนที่ทำแบบสอบถาม:
                        </p>
                        <p className="text-xs">
                          {confirmPayload.points || "0"} แต้ม
                        </p>
                      </div>

                      {confirmPayload.settings && (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-medium">
                            คะแนนสำหรับอันดับ:
                          </p>
                          {confirmPayload.settings.typePoints === "average" ? (
                            <p className="text-xs">
                              {confirmPayload.settings.valuePoints?.[0] || "0"}{" "}
                              แต้ม เท่ากันทุกอันดับ
                            </p>
                          ) : (
                            <div className="flex overflow-x-auto whitespace-nowrap gap-2 w-full scrollbar-hide">
                              {confirmPayload.settings.valuePoints?.map(
                                (point, index) => (
                                  <Chip
                                    key={index}
                                    variant="flat"
                                    color="warning"
                                    className="text-xs"
                                  >
                                    อันดับที่ {index + 1}: {point} แต้ม
                                  </Chip>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Start and End Dates */}
                  <div className="flex flex-row justify-between text-gray-600">
                    <div>
                      <p className="text-sm font-medium">วันที่เริ่ม</p>
                      <p className="text-xs">
                        {confirmPayload.start_date || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">วันที่สิ้นสุด</p>
                      <p className="text-xs">
                        {confirmPayload.due_date || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Settings */}
                  {confirmPayload.settings && (
                    <div className="flex flex-col gap-2 text-gray-600">
                      <p className="text-sm font-medium">การตั้งค่า:</p>
                      <ul className="list-disc pl-5">
                        <li className="text-xs">
                          ตัวเลือก:{" "}
                          {confirmPayload.settings.user_options === "customize"
                            ? "กำหนดตัวเลือกเอง"
                            : confirmPayload.settings.user_options === "user"
                              ? "ใช้ตัวเลือกเป็นชื่อคน"
                              : "-"}
                        </li>

                        <li className="text-xs">
                          ไม่แสดงความคิดเห็น:{" "}
                          {confirmPayload.settings.no_comment_option === 1
                            ? "มี"
                            : "ไม่มี"}
                        </li>
                        <li className="text-xs">
                          จำนวนการเลือกตัวเลือก:{" "}
                          {confirmPayload.settings.selected_choices || "1"}
                        </li>
                        <li className="text-xs">
                          อันดับที่ซ้ำ:{" "}
                          {confirmPayload.settings.duplicate_rank || "0"} เดือน
                        </li>
                        <li className="text-xs">
                          มีการจัดอันดับ: {confirmPayload.settings.ranking}{" "}
                          อันดับ
                        </li>
                        {confirmPayload.type !== "onlyOne" && (
                          <div className="flex flex-col text-gray-600 mt-2">
                            {/* Time Range */}

                            {/* Selected Days of the Week */}
                            {confirmPayload.type === "Weekly" &&
                              confirmPayload.settings.selected_daysOfWeek
                                .length > 0 && (
                                <li className="text-xs">
                                  ทุกวันที่ในสัปดาห์:{" "}
                                  {confirmPayload.settings.selected_daysOfWeek
                                    .map((day) =>
                                      day === "1"
                                        ? "วันจันทร์"
                                        : day === "2"
                                          ? "วันอังคาร"
                                          : day === "3"
                                            ? "วันพุธ"
                                            : day === "4"
                                              ? "วันพฤหัสบดี"
                                              : day === "5"
                                                ? "วันศุกร์"
                                                : day === "6"
                                                  ? "วันเสาร์"
                                                  : "วันอาทิตย์"
                                    )
                                    .join(", ")}
                                </li>
                              )}

                            {/* Selected Days of the Month */}
                            {confirmPayload.type === "Monthly" &&
                              confirmPayload.settings.selected_daysOfMonths
                                .length > 0 && (
                                <li className="text-xs">
                                  ทุกวันที่ในเดือน:{" "}
                                  {confirmPayload.settings.selected_daysOfMonths.join(
                                    ", "
                                  )}
                                </li>
                              )}
                            <li className="text-xs">
                              เวลาในการเปิดให้ทำแบบสอบถาม:{" "}
                              {confirmPayload.settings.startTime || "-"} น. ถึง{" "}
                              {confirmPayload.settings.endTime || "-"} น.
                            </li>
                          </div>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Questions */}
                  <div className="flex flex-col gap-2 text-gray-600">
                    <p className="text-sm font-medium">คำถามในแบบสอบถาม:</p>
                    {confirmPayload.questions?.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {confirmPayload.questions.map((q, index) => (
                          <Card
                            key={index}
                            className="flex-shrink-0 p-4 rounded-lg min-w-[250px] bg-white border border-gray-200"
                            shadow="none"
                          >
                            <p className="text-sm font-medium text-gray-800">
                              คำถาม {index + 1}:{" "}
                              <span className="text-xs text-gray-600">
                                {q.title}
                              </span>
                            </p>
                            {q.choices?.length > 0 && (
                              <ul className="list-disc pl-5 mt-2">
                                {q.choices.map((choice, i) => (
                                  <li key={i} className="text-xs text-gray-600">
                                    {choice}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs">-</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <ConfirmCancelButtons
                  onConfirm={handleSubmit}
                  onCancel={onClose}
                  confirmText={"ยืนยัน"}
                  cancelText={"ยกเลิก"}
                  size={"sm"}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default WeOneSettingVote;
