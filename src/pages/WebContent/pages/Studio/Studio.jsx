import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useNavigate } from "react-router-dom";
import {
  Button,
  useDisclosure,
  Input,
  Checkbox,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";
import { formatDateThai } from "@/component/DateUtiils";
import { useStudio } from "./utils/fetchStudio";
import BookingConfirmModal from "./component/BookingConfirmModal";
import BookingDetailModal from "./component/BookingDetailModal";
import ManagementSection from "./component/ManagementSection";
import fetchProtectedData from "../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import { ACCESS } from "@/configs/access";
import { fetchCoupon, fetchReviewCoupon, fetchRate } from "./utils/couponAPI";
import { useCoupon } from "./utils/couponAPI";
import ImagePreviewStudio from "./component/ImagePreviewStudio";

function Studio() {
  const currentData = useAppContext();
  const businessId = useAppContext().currentUser.businessId;

  const { studio, bookingPrivilege, isLoading, fetchStudio } = useStudio();
  console.log(studio);
  console.log(bookingPrivilege);

  const { couponData, reviewCoupon, rate, fetchCouponData } =
    useCoupon(businessId);
  const navigate = useNavigate();

  // state สำหรับ FullCalendar
  const [bookings, setBookings] = useState([]);

  // state สำหรับ Modal
  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onOpenChange: onOpenChangeDetail,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onOpenChange: onOpenChangeConfirm,
  } = useDisclosure();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedConfirm, setSelectedConfirm] = useState(null);

  // state สำหรับฟอร์มการจอง
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    rooms: [],
    date: "",
    time: "09:00",
    contentType: "",
    slip: null,
  });

  // state สำหรับควบคุมการแสดงฟอร์มหรือส่วนการจัดการ
  const [isManagement, setIsManagement] = useState(false);

  // ฟังก์ชันแปลงสถานะ (ใช้ใน Modal)
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "รอตรวจสอบ";
      case "confirmed":
        return "จองเเล้ว";
      case "cancelled":
        return "จองไม่สำเร็จ";
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchStudio();
    fetchCouponData();
  }, [businessId]);

  useEffect(() => {
    if (!isLoading && Array.isArray(studio)) {
      const mappedData = studio.map((item) => {
        return {
          id: String(item.id),
          title: getStatusLabel(item.status),
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

  // หารายละเอียดการจองจาก bookings state
  const getBookingDetails = (id) => {
    return bookings.find((booking) => booking.id === id);
  };

  // เมื่อคลิก Event บน FullCalendar
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

  // เมื่อกดปุ่ม "ยืนยันการจอง" (ในฟอร์ม)
  const handleBooking = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.date ||
      !formData.time ||
      formData.rooms.length === 0
    ) {
      toastWarning("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
    setSelectedConfirm(formData);
    onOpenConfirm();
  };

  const handleConfirmBooking = async (useCoupon, couponCode) => {
    // 1) ตรวจสอบเงื่อนไขการแนบสลิป
    if (!useCoupon && !formData.slip) {
      toastWarning("กรุณาแนบสลิปการชำระเงินก่อนยืนยัน!");
      return;
    }
    console.log(useCoupon, couponCode);
    // 2) คำนวณราคา
    const totalPrice = useCoupon ? 0 : 300;

    // 3) เตรียม FormData
    const formDataToSend = new FormData();
    formDataToSend.append("business_id", businessId);
    formDataToSend.append("title", formData.name);
    formDataToSend.append("date_start", formData.date);
    formDataToSend.append("date_end", formData.date);
    formDataToSend.append("time", formData.time);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("company", formData.company);
    formDataToSend.append("rooms", JSON.stringify(formData.rooms));
    formDataToSend.append("contentType", formData.contentType);
    formDataToSend.append("status", "pending");
    formDataToSend.append("price", totalPrice);

    if (!useCoupon && formData.slip) {
      formDataToSend.append("image", formData.slip);
    }

    try {
      // 4) เรียก API สร้าง Booking ก่อน
      const responseBooking = await fetchProtectedData.post(
        URLS.WebContent.createBookings,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (!responseBooking || responseBooking.status !== 200) {
        throw new Error("Failed to create item");
      }

      if (useCoupon && couponCode) {
        const payloadCoupon = {
          couponCode: couponCode,
        };

        // เรียก API เพื่อบันทึกการใช้คูปอง
        const responseCoupon = await fetchProtectedData.post(
          URLS.WebContent.useCoupon,
          payloadCoupon
        );

        if (!responseCoupon || responseCoupon.status !== 200) {
          throw new Error("Failed to use reviewCoupon");
        }
      }

      // 6) ถ้าทุกอย่างผ่าน เคลียร์ฟอร์ม + ปิด Modal + รีเฟรชตาราง
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        rooms: [],
        date: "",
        time: "09:00",
        contentType: "",
        slip: null,
      });
      onOpenChangeConfirm(false);
      fetchStudio();
      fetchCoupon();
      fetchReviewCoupon();
      toastSuccess("การจองของคุณอยู่ในสถานะ");
    } catch (error) {
      console.error(error);
      toastError(error.message || "เกิดข้อผิดพลาดในการสร้างการจอง");
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-center mt-10">
          <h1 className="md:text-6xl text-xl font-prompt">Hopeful Studio</h1>
        </div>
        <ImagePreviewStudio />
      </div>
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row md:gap-5 justify-between font-prompt">
        {/* Left: Calendar */}
        <div className="md:w-2/3 w-full">
          <h2 className="text-2xl font-bold text-center mb-4">
            📅 ตารางการจองห้อง Studio
          </h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={bookings}
            eventClick={handleEventClick}
            height="auto"
            aspectRatio={1.35}
          />
          <div className="flex items-center space-x-2 py-8 justify-center md:justify-start">
            <h1 className="font-prompt text-xl">พิกัด Hopeful Studio :</h1>
            <a
              href="https://maps.app.goo.gl/CqUkHBQZbGqEYFx38"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline font-prompt text-xl"
            >
              เปิด App แผนที่
            </a>
          </div>
        </div>

        {/* Right: Booking Form / Management Section */}
        <div className="md:w-1/3 w-full">
          {isManagement ? (
            <ManagementSection
              onBack={() => setIsManagement(false)}
              bookings={bookings}
              businessId={businessId}
              fetch={fetchStudio}
            />
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-center">
                📋 ฟอร์มการจอง
              </h2>
              <Input
                label="ชื่อ"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mb-4"
              />
              <Input
                type="tel"
                maxLength={10}
                label="เบอร์โทร"
                value={formData.phone}
                onChange={(e) => {
                  const newValue = e.target.value;
                  // ตรวจสอบให้แน่ใจว่าค่าใหม่เป็นตัวเลขเท่านั้น
                  if (/^\d*$/.test(newValue)) {
                    setFormData({ ...formData, phone: newValue });
                  }
                }}
                className="mb-4"
              />

              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mb-4"
              />

              <Input
                label="จากบริษัท"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="mb-4 font-prompt"
              />
              <p className="text-sm font-prompt mb-2">
                เลือกห้องใช้งาน (เลือกได้มากกว่า 1 ห้อง)
              </p>
              {[
                "ห้องโถงใหญ่ชั้น 1",
                "ห้องร้านยา ชั้น 3",
                "ห้อง Podcast ชั้น 4",
              ].map((room) => (
                <Checkbox
                  key={room}
                  isSelected={formData.rooms.includes(room)}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      rooms: formData.rooms.includes(room)
                        ? formData.rooms.filter((r) => r !== room)
                        : [...formData.rooms, room],
                    })
                  }
                  className="mb-2 flex font-prompt"
                >
                  {room}
                </Checkbox>
              ))}
              <Input
                type="date"
                label="วันที่ต้องการจอง"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="mb-4"
              />
              <Input
                type="time"
                label="เวลาที่เข้ามา (ชั่วโมง:นาที)"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="mb-4"
                min="06:00"
                max="18:00"
              />

              <Select
                label="รูปแบบของ Content"
                value={formData.contentType}
                onChange={(e) =>
                  setFormData({ ...formData, contentType: e.target.value })
                }
                className="mb-4"
              >
                <SelectItem key="ถ่ายคลิปรีวิว" textValue="ถ่ายคลิปรีวิว">
                  ถ่ายคลิปรีวิว
                </SelectItem>
                <SelectItem key="Podcast" textValue="Podcast">
                  Podcast
                </SelectItem>
                <SelectItem key="Live Stream" textValue="Live Stream">
                  Live Stream
                </SelectItem>
              </Select>
              <div className="flex justify-between gap-5">
                <Button
                  onPress={handleBooking}
                  className="w-full bg-black text-white text-lg font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all"
                  isDisabled={
                    currentData.accessCheck.haveAny([
                      ACCESS.admin_content.admin_content,
                    ])
                      ? false
                      : bookingPrivilege?.is_booking_today !== 0
                  }
                >
                  ยืนยันการจอง
                </Button>

                {currentData.accessCheck.haveAny([
                  ACCESS.admin_content.admin_content,
                ]) && (
                  <Button
                    onPress={() => setIsManagement(!isManagement)}
                    className="w-full bg-black text-white text-lg font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all"
                  >
                    ตรวจสอบ
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal (1): Confirm Booking */}
        <BookingConfirmModal
          isOpen={isOpenConfirm}
          onOpenChange={onOpenChangeConfirm}
          selectedConfirm={selectedConfirm}
          formatDateThai={formatDateThai}
          onConfirmBooking={handleConfirmBooking}
          onSlipFileChange={(file) => setFormData({ ...formData, slip: file })}
          totalAmount={couponData ? couponData.totalAmount : 0}
          goalAmount={rate ? rate : 0}
          used={reviewCoupon ? reviewCoupon.used : 0}
          code={reviewCoupon ? reviewCoupon.coupon_code : ""}
        />

        {/* Modal (2): Booking Detail */}
        <BookingDetailModal
          isOpen={isOpenDetail}
          onOpenChange={onOpenChangeDetail}
          selectedEvent={selectedEvent}
          getStatusLabel={getStatusLabel}
          formatDateThai={formatDateThai}
        />
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="py-8">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            แผนที่ของ Hopeful Studio
          </h1>
          <p className="mt-2 text-center text-base sm:text-lg text-gray-600">
            ค้นหาตำแหน่งของเราและพบกับประสบการณ์ที่น่าประทับใจ
          </p>
        </div>

        <section className="flex justify-center my-8 items-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.1287661473216!2d100.6099385!3d13.771107400000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f003a840b11%3A0x9831668fe4a1feef!2sHopeful%20Studio!5e0!3m2!1sth!2sth!4v1740113602352!5m2!1sth!2sth"
            width="80%"
            height="650"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
      </div>
    </>
  );
}

export default Studio;
