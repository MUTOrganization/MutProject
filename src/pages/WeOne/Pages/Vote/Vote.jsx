import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Image,
  Chip,
  CardHeader,
} from "@nextui-org/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  LeftArrowIcon,
  TaskColorIcon,
  ArrowRightColorIcon,
  TreasureColorIcon,
  PlanetColorIcon,
  ListColorIcon,
} from "../../../../component/Icons";
import Layout from "../../Components/Layout";
import { URLS } from "../../../../config";
import fetchProtectedData from "../../../../../utils/fetchData";
import { useAppContext } from "../../../../contexts/AppContext";
import { formatDateThaiAndTime } from "../../../../component/DateUtiils";
import CountdownComponent from "../../Components/CountdownComponent";
dayjs.extend(duration);

function formatTimeWithoutSeconds(timeString) {
  if (!timeString) return "-";
  const [hours, minutes] = timeString.split(":"); // Split the time by ":"
  return `${hours}:${minutes} น.`; // Return only hours and minutes
}

function Vote() {
  const useData = useAppContext();
  const [remainingTime, setRemainingTime] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfEnabled = (card) => {
    const now = new Date();

    // ฟังก์ชันช่วยสำหรับการคำนวณเวลาเริ่มต้นและสิ้นสุดของวัน
    const getStartAndEndOfDay = (startTime, endTime) => {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startOfDay = new Date();
      startOfDay.setHours(startHour, startMinute, 0);

      const endOfDay = new Date();
      endOfDay.setHours(endHour, endMinute, 0);

      return { startOfDay, endOfDay };
    };

    if (card.type === "onlyOne") {
      // ตรวจสอบว่าอยู่ในช่วง start_date และ due_date หรือไม่
      const startDate = new Date(card.start_date);
      const dueDate = new Date(card.due_date);

      return now >= startDate && now <= dueDate;
    } else if (card.type === "Weekly") {
      // ตรวจสอบวันและเวลาเปิดสำหรับ Weekly
      const startTime = card.settings?.startTime;
      const endTime = card.settings?.endTime;
      const selectedDays = card.settings?.selected_daysOfWeek || []; // [1, 3, 5]

      if (startTime && endTime) {
        const { startOfDay, endOfDay } = getStartAndEndOfDay(
          startTime,
          endTime
        );

        // ตรวจสอบว่าปัจจุบันเป็นวันที่อยู่ใน selected_daysOfWeek หรือไม่
        const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // 1 = Monday, ..., 7 = Sunday
        if (!selectedDays.map(Number).includes(currentDay)) {
          return false; // ไม่ใช่วันเปิด
        }

        // ตรวจสอบว่าปัจจุบันอยู่ในช่วงเวลาเปิดหรือไม่
        return now >= startOfDay && now <= endOfDay;
      }
    } else if (card.type === "Daily") {
      // ตรวจสอบเวลาเปิดสำหรับ Daily
      const startTime = card.settings?.startTime;
      const endTime = card.settings?.endTime;

      if (startTime && endTime) {
        const { startOfDay, endOfDay } = getStartAndEndOfDay(
          startTime,
          endTime
        );

        // ตรวจสอบว่าปัจจุบันอยู่ในช่วงเวลาเปิดหรือไม่
        return now >= startOfDay && now <= endOfDay;
      }
    } else if (card.type === "Monthly") {
      // ตรวจสอบรอบสำหรับ Monthly
      const startTime = card.settings?.startTime;
      const endTime = card.settings?.endTime;
      const selectedDay = parseInt(
        card.settings?.selected_daysOfMonths || 1,
        10
      );

      if (startTime && endTime) {
        const { startOfDay, endOfDay } = getStartAndEndOfDay(
          startTime,
          endTime
        );

        // สร้างวันเริ่มต้นและสิ้นสุดสำหรับเดือนนี้
        const startOfMonth = new Date(now);
        startOfMonth.setDate(selectedDay);
        startOfMonth.setHours(
          startOfDay.getHours(),
          startOfDay.getMinutes(),
          0
        );

        const endOfMonth = new Date(now);
        endOfMonth.setDate(selectedDay);
        endOfMonth.setHours(endOfDay.getHours(), endOfDay.getMinutes(), 0);

        // ตรวจสอบว่าปัจจุบันอยู่ในช่วงเวลาเปิดหรือไม่
        return now >= startOfMonth && now <= endOfMonth;
      }
    }

    // ค่าเริ่มต้น ถ้าไม่มีการตั้งค่าใดๆ ถือว่าไม่เปิด
    return false;
  };

  const fetchQuestData = async () => {
    setIsLoading(true);
    try {
      const url = `${URLS.weOne.getForm}`;
      const params = {
        business_id: useData.currentUser.businessId,
        is_active: 1,
      };

      const response = await fetchProtectedData.get(url, { params });
      const data = response.data?.quests || []; // กำหนดข้อมูลเริ่มต้น

      const currentDate = new Date();

      // กรองกิจกรรมที่ยังไม่สำเร็จและอยู่ในช่วงเวลา
      const filteredData = data.filter((quest) => {
        const startDate = new Date(quest.start_date);
        const dueDate = new Date(quest.due_date);

        // ตรวจสอบว่ากิจกรรมอยู่ในช่วงและยังไม่สำเร็จ
        return (
          currentDate >= startDate && // อยู่ในช่วงเวลา
          currentDate <= dueDate && // ไม่เกิน due_date
          quest.is_active === 1 && // กิจกรรมยังเปิดใช้งาน
          quest.status !== "completed" // ไม่ใช่กิจกรรมที่สำเร็จแล้ว
        );
      });

      const updatedData = filteredData.map((quest) => {
        let nextStartTime = null;

        if (quest.type === "onlyOne") {
          const startDate = new Date(quest.start_date);
          const dueDate = new Date(quest.due_date);

          if (currentDate >= startDate && currentDate <= dueDate) {
            return { ...quest, status: "ongoing", nextStartTime: dueDate };
          }
          return { ...quest, status: "future", nextStartTime: startDate };
        }

        if (quest.type === "Weekly" && quest.settings?.selected_daysOfWeek) {
          const selectedDays = quest.settings.selected_daysOfWeek.map(Number);
          const [startHour, startMinute] = quest.settings.startTime
            .split(":")
            .map(Number);
          const currentDay =
            currentDate.getDay() === 0 ? 7 : currentDate.getDay();

          let closestDate = null;
          selectedDays.forEach((day) => {
            const nextDate = new Date(currentDate);
            const dayOffset = (day - currentDay + 7) % 7;
            nextDate.setDate(currentDate.getDate() + dayOffset);
            nextDate.setHours(startHour, startMinute, 0);

            if (!closestDate || nextDate < closestDate) {
              closestDate = nextDate;
            }
          });

          if (closestDate && currentDate >= closestDate) {
            const timeRemaining = closestDate - currentDate; // เวลาที่เหลือ
            return {
              ...quest,
              status: "ongoing",
              nextStartTime: closestDate,
              timeRemaining,
            };
          }
          const timeRemaining = closestDate ? closestDate - currentDate : null;
          return {
            ...quest,
            status: "future",
            nextStartTime: closestDate,
            timeRemaining,
          };
        }

        if (quest.type === "Monthly" && quest.settings?.startTime) {
          const [startHour, startMinute] = quest.settings.startTime
            .split(":")
            .map(Number);
          const selectedDay = parseInt(
            quest.settings.selected_daysOfMonths || 1,
            10
          );

          const startOfMonth = new Date(currentDate);
          startOfMonth.setDate(selectedDay);
          startOfMonth.setHours(startHour, startMinute, 0);

          if (currentDate >= startOfMonth) {
            return { ...quest, status: "ongoing", nextStartTime: startOfMonth };
          }

          const nextMonth = new Date(startOfMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return { ...quest, status: "future", nextStartTime: nextMonth };
        }

        return { ...quest, status: "future", nextStartTime: null };
      });

      const sortedData = updatedData.sort((a, b) => {
        const statusOrder = { ongoing: 0, future: 1 }; // ongoing มาก่อน future
        const currentDate = new Date();

        // เปรียบเทียบสถานะ (ongoing ก่อน future)
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }

        // คำนวณเวลาที่เหลือเป็นจำนวนมิลลิวินาที
        const remainingTimeA = a.nextStartTime
          ? new Date(a.nextStartTime) - currentDate
          : Infinity; // หากไม่มี nextStartTime, กำหนดเป็น Infinity
        const remainingTimeB = b.nextStartTime
          ? new Date(b.nextStartTime) - currentDate
          : Infinity; // หากไม่มี nextStartTime, กำหนดเป็น Infinity

        // เปรียบเทียบเวลาคงเหลือ
        return remainingTimeA - remainingTimeB;
      });

      setData(sortedData);
      console.log(updatedData);
    } catch (error) {
      console.error("Error fetching quest data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestData();
  }, []);

  const handleFormVote = async (key) => {
    console.log(key);
    navigate("/WeOne-FormVote", { state: { key } });
  };

  return (
    <Layout>
      <div className="relative w-full">
        <div className="relative w-full h-3/4">
          <Button
            isIconOnly
            variant="light"
            className="absolute top-4 left-4 z-20 bg-white rounded-full shadow-lg"
            onPress={() => navigate("/weone")}
          >
            <LeftArrowIcon width={16} />
          </Button>
          <Image
            alt="Image"
            src="/img/cloud.jpeg"
            className="w-full h-full object-cover rounded-b-3xl rounded-t-none"
          />
        </div>
        <section className="absolute top-32 left-1/2 transform -translate-x-1/2 w-11/12 z-20 space-y-4">
          <Card
            radius="lg"
            shadow="none"
            className="bg-[#fcf9e3] shadow-sm p-2"
          >
            <CardBody className="p-1">
              <div className="grid  items-center gap-4">
                <p className="text-xl text-center font-semibold text-yellow-600">
                  แบบสอบถาม
                </p>
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
          <div className="text-lg font-bold space-x-2">
            <span className="text-[#438c98]">{data.length}</span>
            <span className="text-[#25262a]">รายการ</span>
          </div>
          {/* Map over card data to render cards with unique background colors */}
          <div className="flex flex-col h-[60vh] overflow-hidden">
            <section className="flex-grow space-y-4 overflow-y-auto pb-64 scrollbar-hide">
              {data.map((card) => (
                <Card
                  key={card.quest_id}
                  radius="lg"
                  shadow="none"
                  isPressable={checkIfEnabled(card)} // Disable pressable if the card should be disabled
                  fullWidth
                  className={`p-2 relative shadow-md bg-gray-100 ${!checkIfEnabled(card) ? "opacity-50 cursor-not-allowed" : ""
                    }`} // Apply disabled styling
                  style={{ backgroundColor: card.backgroundColor }}
                  onPress={() => handleFormVote(card.quest_id)}
                >
                  <CardHeader className="text-small justify-end">
                    <Chip
                      className="absolute top-1 left-1 text-xs font-light bg-green-200 text-green-800"
                      size="sm"
                      radius="sm"

                    >
                      <span className="text-sm flex flex-col">
                        {(() => {
                          const currentDate = new Date();
                          const startDate = new Date(card.start_date);
                          const dueDate = new Date(card.due_date);

                          if (currentDate < startDate) {
                            return "ไม่ได้อยู่ในช่วง"; // กิจกรรมยังไม่เริ่ม
                          } else if (
                            currentDate >= startDate &&
                            currentDate <= dueDate
                          ) {
                            return "อยู่ในช่วง"; // กิจกรรมกำลังดำเนินการ
                          } else {
                            return "ภารกิจเสร็จสิ้น"; // กิจกรรมหมดเวลาแล้ว
                          }
                        })()}
                      </span>
                    </Chip>

                    <Chip
                      className="absolute top-1 right-1 text-xs font-light"
                      size="sm"
                      radius="sm"
                    >
                      <span className="text-xs flex flex-row space-x-1">
                        {card.type === "Weekly" &&
                          card.settings?.selected_daysOfWeek ? (
                          (() => {
                            const [startHour, startMinute] =
                              card.settings.startTime.split(":").map(Number);
                            const [endHour, endMinute] = card.settings.endTime
                              .split(":")
                              .map(Number);
                            const today = new Date();
                            const selectedDays =
                              card.settings.selected_daysOfWeek.map(Number);
                            const currentDay =
                              today.getDay() === 0 ? 7 : today.getDay(); // Adjust Sunday as 7

                            let closestStart = null;
                            let closestEnd = null;

                            selectedDays.forEach((day) => {
                              const nextStart = new Date(today);
                              const dayOffset = (day - currentDay + 7) % 7;
                              nextStart.setDate(today.getDate() + dayOffset);
                              nextStart.setHours(startHour, startMinute, 0);

                              const nextEnd = new Date(nextStart);
                              nextEnd.setHours(endHour, endMinute, 0);

                              if (!closestStart || nextStart < closestStart) {
                                closestStart = nextStart;
                                closestEnd = nextEnd;
                              }
                            });

                            if (
                              closestStart &&
                              new Date() >= closestStart &&
                              new Date() <= closestEnd
                            ) {
                              // If currently within the active period, show remaining time
                              return (
                                <>
                                  <span>เวลาคงเหลือ</span>
                                  <CountdownComponent
                                    startDate={new Date()}
                                    endDate={closestEnd}
                                  />
                                </>
                              );
                            } else {
                              // If not within the active period, show time until the next start
                              return (
                                <>
                                  <span>จะเปิดอีกครั้ง</span>
                                  <CountdownComponent
                                    startDate={new Date()}
                                    endDate={closestStart}
                                  />
                                </>
                              );
                            }
                          })()
                        ) : card.type === "Monthly" &&
                          card.settings?.startTime ? (
                          (() => {
                            const [startHour, startMinute] =
                              card.settings.startTime.split(":").map(Number);
                            const [endHour, endMinute] = card.settings.endTime
                              .split(":")
                              .map(Number);
                            const today = new Date();
                            const selectedDay = parseInt(
                              card.settings.selected_daysOfMonths || 1,
                              10
                            );

                            let nextStart = new Date(today);
                            nextStart.setDate(selectedDay);
                            if (nextStart < today) {
                              nextStart.setMonth(nextStart.getMonth() + 1);
                            }
                            nextStart.setHours(startHour, startMinute, 0);

                            const nextEnd = new Date(nextStart);
                            nextEnd.setHours(endHour, endMinute, 0);

                            if (
                              new Date() >= nextStart &&
                              new Date() <= nextEnd
                            ) {
                              // If currently within the active period, show remaining time
                              return (
                                <>
                                  <span>เวลาคงเหลือ</span>
                                  <CountdownComponent
                                    startDate={new Date()}
                                    endDate={nextEnd}
                                  />
                                </>
                              );
                            } else {
                              // If not within the active period, show time until the next start
                              return (
                                <>
                                  <span>จะเปิดอีกครั้ง</span>
                                  <CountdownComponent
                                    startDate={new Date()}
                                    endDate={nextStart}
                                  />
                                </>
                              );
                            }
                          })()
                        ) : card.status === "ongoing" ? (
                          <>
                            <span>เวลาคงเหลือ</span>
                            <CountdownComponent
                              startDate={card.start_date}
                              endDate={card.due_date}
                            />
                          </>
                        ) : new Date(card.start_date) > new Date() ? (
                          <>
                            <span>กำลังจะเริ่มอีก</span>
                            <CountdownComponent
                              startDate={new Date()}
                              endDate={new Date(card.start_date)}
                            />
                          </>
                        ) : (
                          "ภารกิจเสร็จสิ้น"
                        )}
                      </span>
                    </Chip>
                  </CardHeader>
                  <CardBody className=" overflow-visible p-0 grid items-center gap-4 px-4 relative">
                    <div>
                      <div className="flex flex-row">
                        <h2 className="text-md font-bold pb-2 w-full">
                          {card.quest_title}
                        </h2>
                      </div>

                      <div className="flex flex-col justify-start">
                        {card.settings && (
                          <>
                            {card.type === "onlyOne" ? (
                              // For "onlyOne", display start_date and due_date
                              <>
                                <li className="text-sm">ทำครั้งเดียว</li>
                                <li className="text-sm">
                                  ตั้งเเต่{" "}
                                  {formatDateThaiAndTime(card.start_date)}
                                </li>
                                <li className="text-sm">
                                  ถึง {formatDateThaiAndTime(card.due_date)}
                                </li>
                              </>
                            ) : (
                              // For other types, display settings
                              <>
                                {card.settings.selected_daysOfWeek &&
                                  card.settings.selected_daysOfWeek.length >
                                  0 && (
                                    <li className="text-sm">
                                      ทุกวัน:{" "}
                                      {card.settings.selected_daysOfWeek
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
                                {card.settings.selected_daysOfMonths &&
                                  card.settings.selected_daysOfMonths.length >
                                  0 && (
                                    <li className="text-sm">
                                      ทุกวันที่:{" "}
                                      {card.settings.selected_daysOfMonths.join(
                                        ", "
                                      )}{" "}
                                      ของเดือน
                                    </li>
                                  )}
                                <li className="text-sm">
                                  เวลาในการเปิด:{" "}
                                  {formatTimeWithoutSeconds(
                                    card.settings.startTime
                                  ) || "-"}{" "}
                                  ถึง{" "}
                                  {formatTimeWithoutSeconds(
                                    card.settings.endTime
                                  ) || "-"}
                                </li>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </section>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Vote;
