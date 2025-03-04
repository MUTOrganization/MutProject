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
} from "@nextui-org/react";
import {
  LeftArrowIcon,
  StopUsing,
  EditIcon,
  CorrectIcon,
} from "../../../../../../component/Icons"; // Add StopUsing
import { useNavigate, useLocation } from "react-router-dom";
import MonthSelector from "../../../../Components/MonthSelector";
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import CountdownComponent from "../../../../Components/CountdownComponent.jsx";
import { formatDateObject } from "../../../../../../component/DateUtiils.jsx";
import DateTimeVote from "../../../../Components/DateTimeVote.jsx";
import { ConfirmCancelButtons } from "../../../../../../component/Buttons.jsx";
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
const toMySQLDateTime = (calendarDate) => {
  const jsDate = calendarDate.toDate(getLocalTimeZone());
  return dayjs(jsDate).format("YYYY-MM-DD HH:mm");
};

function WeOneSettingMission() {
  const useData = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    quest_title: "",
    points: "",
    description: "",
    start: toMySQLDateTime(now(getLocalTimeZone())),
    end: toMySQLDateTime(now(getLocalTimeZone())),
  });

  const [selected, setSelected] = useState("History");
  const [selectedStatus, setSelectedStatus] = useState("ongoing");
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [monthRange, setMonthRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });
  console.log(
    formatDateObject(monthRange.start),
    formatDateObject(monthRange.end)
  );

  const [accordionData, setAccordionData] = useState([]);

  const {
    isOpen: isModalAddQuest,
    onOpen: onOpenModalAddQuest,
    onOpenChange: onOpenChangeModalAddQuest,
  } = useDisclosure();

  const fetchQuestData = async () => {
    setIsLoading(true);
    try {
      // สร้าง URL และแนบ Query Parameters
      const url = `${URLS.weOne.getQuestHistory}`;
      const params = {
        business_id: useData.currentUser.businessId,
        start_date: `${formatDateObject(monthRange.start)} 00:00:00`,
        due_date: `${formatDateObject(monthRange.end)} 23:59:59`,
      };

      const response = await axios.get(url, { params });

      const currentDate = new Date();
      const updatedData = response.data.map((quest) => {
        // ตรวจสอบภารกิจที่หมดเวลา
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
      const sortedData = updatedData.sort((a, b) => {
        const statusOrder = { ongoing: 0, future: 1, completed: 2, close: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setAccordionData(sortedData);
      console.log(accordionData);
    } catch (error) {
      console.error("Error fetching quest data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestData();
  }, [monthRange]);

  const handleDelete = async (key, status) => {
    try {
      console.log("id", key, "status", status);

      const is_active = status === "close" ? 1 : 0; // ถ้าสถานะเป็น close ให้เปลี่ยนเป็นเปิดใช้งาน (1)

      // ตัวอย่างการตั้งค่า API URL และ Query Parameters
      const url = `${URLS.weOne.inActiveQuest}?quest_id=${key}&is_active=${is_active}`;

      // ส่งคำขอ PUT
      const response = await axios.put(url);

      if (response.status === 200) {
        console.log(
          `Quest ${status === "close" ? "enabled" : "disabled"} successfully:`,
          response.data
        );
        fetchQuestData(); // อัปเดตข้อมูลใหม่
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

  const handleReset = () => {
    setReset(new Date());
    setFormData({
      quest_title: "",
      points: "",
      description: "",
    });
  };

  const handleConfirmAddQuest = async () => {
    if (
      !formData.quest_title ||
      !formData.description ||
      !formData.start ||
      !formData.end ||
      !formData.points
    ) {
      toastError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    onOpenModalAddQuest(); // ปิด Modal หลังจากเพิ่มภารกิจสำเร็จ
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const payload = {
      quest_title: formData.quest_title,
      description: formData.description,
      start_date: formData.start,
      due_date: formData.end,
      coins: 0,
      points: formData.points,
      business_id: useData.currentUser.businessId,
      is_active: 1,
    };
    console.log(payload);

    try {
      const response = await axios.post(`${URLS.weOne.createQuest}`, [payload]);

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
        fetchQuestData();
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
              สร้างกิจกรรม
            </h2>
            {selected === "History" && (
              <span
                className={`flex p-2 text-lg transition-all duration-300 ease-in-out cursor-pointer ${
                  isDeleteMode
                    ? "text-red-500 scale-110"
                    : "text-gray-500 scale-100"
                }`}
                onPress={() => setIsDeleteMode(!isDeleteMode)}
              >
                <EditIcon />
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
                <Tab key="History" title="ประวัติกิจกรรม">
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
                            ยังไม่เริ่มกิจกรรม
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
                                              ? "ยังไม่เริ่มกิจกรรม"
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
                                            {item.description}
                                          </ReactMarkdown>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2 text-success mb-2">
                                        <p className="font-medium text-sm">
                                          จำนวนแต้มของภารกิจ :{" "}
                                        </p>
                                        <p className="flex font-medium text-sm">
                                          {item.points}
                                        </p>
                                      </div>

                                      <div className="flex flex-col justify-between text-sm text-gray-600 mb-4 gap-3">
                                        <div>
                                          <p className="font-medium">
                                            วันที่เริ่ม
                                          </p>
                                          <p>
                                            {new Date(
                                              item.start_date
                                            ).toLocaleString()}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="font-medium">
                                            วันที่สิ้นสุด
                                          </p>
                                          <p>
                                            {new Date(
                                              item.due_date
                                            ).toLocaleString()}
                                          </p>
                                        </div>
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
                                    handleDelete(item.id, item.status);
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

                <Tab key="CreateMission" title="สร้างกิจกรรม">
                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col space-y-4 px-4">
                      {/* Mission Name Input */}
                      <div className="flex flex-col w-full">
                        <label className="font-medium mb-2">ชื่อกิจกรรม</label>
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
                      {/* Mission Points */}
                      <div className="flex flex-col w-full">
                        <label className="font-medium mb-2">
                          จำนวนแต้มของกิจกรรม
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

                      {/* Mission Details */}
                      <div className="flex flex-col w-full">
                        <label className="font-medium mb-2">
                          รายละเอียดกิจกรรม
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
                    </div>

                    <section className="px-4">
                      <DateTimeVote
                        onChange={handleDateTimeChange}
                        resetDate={reset}
                        value={{
                          start: new Date(formData.start),
                          end: new Date(formData.end),
                        }}
                      />
                    </section>
                    <div className="flex gap-2 justify-end px-4">
                      <ConfirmCancelButtons
                        onConfirm={handleConfirmAddQuest}
                        confirmText="สร้างภารกิจ"
                        onCancel={handleReset}
                        cancelText="ล้างข้อมูล"
                      />
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>ต้องการเพิ่มภารกิจใช่หรือไม่</h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-gray-600 mb-4">
                      ภารกิจ {formData.quest_title}
                    </p>

                    <div className="flex flex-col justify-between text-sm text-gray-600 mb-4 ">
                      <div className="flex space-x-2 text-success">
                        <p className="font-medium">จำนวนแต้มของภารกิจ : </p>
                        <p className="flex">{formData.points}</p>
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
                            {formData.description}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div>
                          <p className="font-medium">วันที่เริ่ม</p>
                          <p>{new Date(formData.start).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">วันที่สิ้นสุด</p>
                          <p>{new Date(formData.end).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
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

export default WeOneSettingMission;
