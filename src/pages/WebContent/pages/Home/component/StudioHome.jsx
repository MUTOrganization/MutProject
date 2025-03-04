import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useNavigate } from "react-router-dom";
import { Button, useDisclosure } from "@nextui-org/react";
import { useStudio } from "../../Studio/utils/fetchStudio";

import BookingDetailModal from "../../Studio/component/BookingDetailModal";
import { formatDateThai } from "@/component/DateUtiils";

const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "รอ Admin ตรวจสอบ";
    case "confirm":
    case "confirmed":
      return "Admin ยืนยันแล้ว";
    case "cancel":
    case "cancelled":
      return "การจองถูกยกเลิกแล้ว";
    default:
      return status;
  }
};
function StudioHome() {
  const { studio, isLoading, fetchStudio } = useStudio();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onOpenChange: onOpenChangeDetail,
  } = useDisclosure();

  useEffect(() => {
    fetchStudio();
  }, []);

  const getBookingDetails = (id) => {
    return bookings.find((booking) => booking.id === id);
  };
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const bookingDetail = getBookingDetails(eventId);

    if (bookingDetail) {
      setSelectedEvent(bookingDetail);
    } else {
      const { extendedProps } = info.event;
      setSelectedEvent({
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        date: extendedProps?.date,
        time: extendedProps?.time,
        company: extendedProps?.company,
        name: extendedProps?.name,
        phone: extendedProps?.phone,
        email: extendedProps?.email,
        rooms: extendedProps?.rooms,
        contentType: extendedProps?.contentType,
        price: 300,
        status: "pending",
      });
    }
    onOpenDetail();
  };

  useEffect(() => {
    if (!isLoading && Array.isArray(studio)) {
      const mappedData = studio.map((item) => {
        return {
          id: String(item.id),
          title: "จองเเล้ว",
          start: item.date_start,
          end: item.date_end,
          date: item.date,
          time: item.time,
          company: item.company,
          name: item.name,
          phone: item.phone,
          email: item.email,
          rooms: Array.isArray(item.rooms) ? item.rooms : [],
          contentType: item.contentType,
          price: item.price || 300,
          slip: item.slip_image,
          status: item.status,
        };
      });
      setBookings(mappedData);
    }
  }, [isLoading, studio]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        📅 ตารางการจองห้อง Studio
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center md:justify-between gap-6">
        <div className="w-full max-w-5xl overflow-x-auto">
          <FullCalendar
            plugins={[dayGridPlugin]}
            events={bookings}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onPress={() => navigate("/content-studio")}
          className="w-full sm:w-auto bg-black text-white text-lg font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all"
        >
          เข้าชมห้องสตูดิโอ
        </Button>
      </div>
      {/* Modal (2): Booking Detail */}
      <BookingDetailModal
        isOpen={isOpenDetail}
        onOpenChange={onOpenChangeDetail}
        selectedEvent={selectedEvent}
        getStatusLabel={getStatusLabel}
        formatDateThai={formatDateThai}
      />
    </div>
  );
}

export default StudioHome;
