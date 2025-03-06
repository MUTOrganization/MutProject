import React, { useEffect, useState } from "react";
import {
  Chip,
  Spinner,
  Card,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { MeetingIcon } from "../../../component/Icons";
import EventManagement from "../Components/EventManagement";
import { today, startOfMonth, endOfMonth } from "@internationalized/date";
import axios from "axios";

const API_KEY = "AIzaSyCore1Mx1tY3QmjSizHJ2QSAzgI4HwlTgA";
const CALENDAR_ID = "4343686e33e287b3aec538b65e1ba4e6c894908f8ccb4a00c9b290afb9d9817f@group.calendar.google.com";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDate = startOfMonth(today());
  const endDate = endOfMonth(today());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formatDateObject = (dateObj) => {
    if (!dateObj) return null;

    const year = dateObj.year;
    const month = String(dateObj.month).padStart(2, "0");
    const day = String(dateObj.day).padStart(2, "0");

    return `${year}-${month}-${day}T00:00:00Z`;
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${formatDateObject(startDate)}&timeMax=${formatDateObject(endDate)}&singleEvents=true&orderBy=startTime`
      );

      if (response.data.items) {
        setEvents(response.data.items);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getDatesInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const dates = [];

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const getLeadingEmptyCells = (firstDayOfWeek) => {
    return Array.from({ length: firstDayOfWeek }, (_, index) => (
      <td key={`empty-start-${index}`} className="border border-gray-200 h-24"></td>
    ));
  };

  const getTrailingEmptyCells = (daysInLastWeek) => {
    return Array.from({ length: 7 - daysInLastWeek }, (_, index) => (
      <td key={`empty-end-${index}`} className="border border-gray-200 h-24"></td>
    ));
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const dates = getDatesInMonth(currentYear, currentMonth);

  return (
    <div className="w-full h-full mb-0 ">
      <h2 className="text-xl font-bold lg:text-2xl lg:mt-0 lg:mb-0 ml-4">ปฏิทินสำหรับตัวแทน</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* ปฏิทิน */}
        <div className="col-span-2 pr-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size="xl" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">Error: {error}</div>
          ) : (
            <table className="table-auto w-full h-[400px] border-collapse bg-white lg:h-[639px] text-xs rounded-md shadow-lg">
              <thead>
                <tr>
                  {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"].map((day) => (
                    <th key={day} className="border border-gray-200 p-2 bg-gray-100">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.ceil((dates.length + new Date(currentYear, currentMonth, 1).getDay()) / 7),
                }).map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {weekIndex === 0 &&
                      getLeadingEmptyCells(new Date(currentYear, currentMonth, 1).getDay())}
                    {dates
                      .slice(
                        weekIndex * 7 - new Date(currentYear, currentMonth, 1).getDay(),
                        (weekIndex + 1) * 7 - new Date(currentYear, currentMonth, 1).getDay()
                      )
                      .map((date) => {
                        const dateEvents = events.filter(
                          (event) =>
                            new Date(event.start.dateTime || event.start.date).toDateString() === date.toDateString()
                        );

                        return (
                          <td key={date} className="border border-gray-200 align-top p-2 h-18 w-32 text-xs">
                            <div className="font-bold mb-1">{date.getDate()}</div>
                            <div className="flex flex-col gap-1 h-18">
                              {dateEvents.length > 0 ? (
                                dateEvents.map((event, index) => (
                                  <Chip
                                    key={index}
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    // className="p-0 text-transparent sm:text-xs sm:p-2"
                                  >
                                    <span className="text-xs block lg:hidden text-black">
                                      <MeetingIcon />
                                    </span>
                                    <span className="hidden lg:block text-black">{event.summary}</span>
                                  </Chip>
                                ))
                              ) : (
                                <div className="text-xs text-gray-400">ว่าง</div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    {weekIndex ===
                      Math.ceil((dates.length + new Date(currentYear, currentMonth, 1).getDay()) / 7) -
                      1 &&
                      getTrailingEmptyCells(dates.length % 7 || 7)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* กิจกรรม */}
        <div className="w-full max-h-[700px] lg:max-w-full">
          <span className="flex justify-between mb-2">
            <h3 className="text-xl font-bold">กิจกรรม</h3>
            <Button
              auto
              color="success"
              size="sm"
              radius="md"
              onPress={onOpen}
              className="hover:text-white hover:bg-green-600 text-black bg-gray-100 lg:mr-0 mr-4"
            >
              จัดการกิจกรรม
            </Button>
          </span>
          <div className="max-h-[700px] overflow-y-auto scrollbar-hide h-[600px]">
            {loading ? (
              <div className="text-center">
                <Spinner size="xl" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">Error: {error}</div>
            ) : events.length === 0 ? (
              <p className="text-center">ยังไม่มีการจัดกิจกรรมในขณะนี้</p>
            ) : (
              <div className="flex flex-col gap-4 ">
                {events.map((event, index) => {
                  const startDateTime = new Date(event.start.dateTime || event.start.date);
                  const endDateTime = new Date(event.end.dateTime || event.end.date);

                  const formattedStartDate = startDateTime.toLocaleDateString("th-TH", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });

                  const formattedStartTime = startDateTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                  const formattedEndTime = endDateTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  const imageUrl =
                    event.attachments && event.attachments.length > 0
                      ? `${event.attachments[0].fileUrl}`
                      : "";

                  return (
                    <Card key={index} className="p-2 relative scrollbar-hide h-full mb-0 shadow-lg" radius="sm">
                      <div className="flex flex-col lg:flex-row  text-black">
                        <div className="flex-1 pr-4">
                          <h3 className="text-xl font-bold mb-2 text-black">{event.summary}</h3>
                          <p className="text-sm text-black mb-1">{`${formattedStartDate}`}</p>
                          <p className="text-sm text-black mb-2">{`เวลา ${formattedStartTime} น. ถึง ${formattedEndTime} น.`}</p>
                          <div className="overflow-hidden">
                            <Chip size="sm" color="primary" variant="flat">
                              รายละเอียด
                            </Chip>
                            <p className="text-sm text-black  mb-2">{event.description}</p>
                            <Chip size="sm" color="success" variant="flat">
                              สถานที่
                            </Chip>
                            <p className="text-sm text-black">{event.location || " "}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <EventManagement />
              </ModalBody>

              <ModalFooter>
                <Button
                  onPress={onClose}
                  color="error"
                  size="sm"
                  auto
                  radius="full"
                  variant="light"
                  className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                >
                  ปิด
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
