import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { gapi } from "gapi-script";
import {
  LocationIcon,
  CalendarIcon,
  DescriptionIcon,
  PlusIcon
} from "../../../component/Icons";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Toaster, toast } from "sonner";

const formatThaiDate = (dateString) => {
  dayjs.locale('th');
  const [year, month, day] = dateString.split('-');
  let convertedYear = parseInt(year, 10);

  if (convertedYear < 2500) {
    convertedYear += 543;
  }

  const date = dayjs(`${convertedYear}-${month}-${day}`);
  return date.format('D MMMM YYYY');
};

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const bangkokDate = date.toLocaleString("sv-SE", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  });
  return bangkokDate.replace(" ", "T").slice(0, 16);
};

const CLIENT_ID =
  "955528037011-ums564o30dkod378aggp4g92i72sg2fn.apps.googleusercontent.com";
const API_KEY = "AIzaSyB0o1Wcbi2qMy9Ef9E_dYQrMoLf_9Tik-A";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file";

const EventManagement = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [AddEvent, setAddEvent] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);

          if (authInstance.isSignedIn.get()) {
            fetchEvents();
          }
        });
    }
    gapi.load("client:auth2", start);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId:
          "4343686e33e287b3aec538b65e1ba4e6c894908f8ccb4a00c9b290afb9d9817f@group.calendar.google.com",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      });

      const fetchedEvents = response.result.items.map((event) => ({
        id: event.id,
        title: event.summary,
        startDate: event.start.dateTime || event.start.date,
        endDate: event.end.dateTime || event.end.date,
        location: event.location || "-",
        description: event.description || "No description",
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignoutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const handleSubmit = async () => {
    try {
      const eventDetails = {
        summary: title,
        location: location || undefined,
        description: description || undefined,
        start: {
          dateTime: new Date(startDate).toISOString(),
          timeZone: "Asia/Bangkok",
        },
        end: {
          dateTime: new Date(endDate).toISOString(),
          timeZone: "Asia/Bangkok",
        },
        // Remove the attachments field if no file is being uploaded
      };

      let request;
      if (editEventId) {
        request = gapi.client.calendar.events.update({
          calendarId:
            "4343686e33e287b3aec538b65e1ba4e6c894908f8ccb4a00c9b290afb9d9817f@group.calendar.google.com",
          eventId: editEventId,
          resource: eventDetails,
        });
      } else {
        request = gapi.client.calendar.events.insert({
          calendarId:
            "4343686e33e287b3aec538b65e1ba4e6c894908f8ccb4a00c9b290afb9d9817f@group.calendar.google.com",
          resource: eventDetails,
        });
      }

      request.execute((event) => {
        if (event.htmlLink) {
          toast.success(`อัพเดทข้อมูลกิจกรรม ${editEventId ? "อัพเดทกิจกรรมสำเร็จ" : "สร้างกิจกรรมสำเร็จ"}`, {
            duration: 3000,
            position: 'top-right'
          });
          setEditEventId(null);
          fetchEvents();
          setAddEvent(false);
        } else {
          console.error("Error creating/updating event:", event);
          toast.error('อัพเดทข้อมูลกิจกรรมล้มเหลว', { duration: 3000, position: 'top-right' })
        }
      });
    } catch (error) {
      console.error("Error creating/updating event:", error);
      alert("Error creating/updating event.");
    }
  };

  const handleEdit = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartDate(formatDateForInput(eventToEdit.startDate));
      setEndDate(formatDateForInput(eventToEdit.endDate));
      setLocation(eventToEdit.location);
      setDescription(eventToEdit.description);
      setEditEventId(eventId); // Track the event being edited
      setAddEvent(true); // Open the form for editing
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await gapi.client.calendar.events.delete({
        calendarId:
          "4343686e33e287b3aec538b65e1ba4e6c894908f8ccb4a00c9b290afb9d9817f@group.calendar.google.com",
        eventId: eventId,
      });
      alert("Event deleted successfully");
      fetchEvents(); // Refetch events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event.");
    }
  };

  const handleBack = () => {
    // Clear all form fields and exit the edit/add view
    setTitle("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setDescription("");
    setEditEventId(null); // Clear any editing state
    setAddEvent(false); // Return to event list view
  };

  return (
    <div>
      {!AddEvent ? (
        <div className="flex flex-col gap-4 mt-5 relative lg:h-[600px] h-[550px]">
          <div className="flex justify-between mt-2">
            <h3 className="text-xl font-bold">รายการกิจกรรมทั้งหมด</h3>
            {!isSignedIn ? (
              <Button
                onPress={handleAuthClick}
                color=""
                size="sm"
                className="text-white bg-custom-redlogin font-semibold"
              >
                Sign In Google Calendar
              </Button>
            ) : (
              <Button
                onPress={handleSignoutClick}
                color=""
                size="sm"
                className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100 font-bold"
              >
                Sign Out
              </Button>
            )}
          </div>

          {/* Display all event cards with scrolling */}
          <div className="flex flex-wrap gap-4 lg:h-full overflow-y-auto scrollbar-hide w-full">
            {events.map((event, index) => (
              <Card
                key={index}
                className="lg:w-full md:w-1/3 space-y-3 w-full border-2 border-gray-300 rounded-md shadow-sm"
                shadow="none"
              >
                <CardHeader>
                  <h4 className="text-xl font-semibold">{event.title}</h4>
                </CardHeader>
                <Divider />
                <CardBody className="py-2">
                  <div className="grid grid-cols-[auto,1fr] gap-2 items-center text-gray-500 text-md">
                    <CalendarIcon />
                    <p>{formatThaiDate(event.startDate)} ถึง {formatThaiDate(event.endDate)}</p>

                    <DescriptionIcon />
                    <span className="truncate">{event.description}</span>

                    <LocationIcon />
                    <span className="truncate">{event.location}</span>
                  </div>
                </CardBody>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    color="primary"
                    onPress={() => handleEdit(event.id)}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => handleDelete(event.id)}
                    variant="light"
                  >
                    ลบ
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              จำนวนกิจกรรม: {events.length} กิจกรรม
            </p>
            <Button
              onPress={() => setAddEvent(true)}
              color="success"
              className="text-sm text-white"
              size="md"
              endContent={<PlusIcon />}
            >
              เพิ่มกิจกรรม
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-center">
            {editEventId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
          </h3>

          {/* Title Input */}
          <Input
            label="หัวข้อ"
            variant="bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="หัวข้อกิจกรรม"
            required
            className="w-full"
          />

          {/* Date and Time Inputs */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row gap-2 items-center w-full">
              <Input
                label='วันที่เริ่ม'
                variant="bordered"
                type="datetime-local"
                value={startDate}
                onChange={setStartDate}
                isRequired
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2 items-center w-full">
              <Input
                label='วันที่สิ้นสุด'
                variant="bordered"
                type="datetime-local"
                value={endDate}
                onChange={setEndDate}
                isRequired
              />
            </div>
          </div>

          {/* Location Input */}
          <Input
            label="สถานที่"
            variant="bordered"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="กรอกสถานที่"
            className="w-full"
          />

          {/* Description Input */}
          <Input
            label="รายละเอียด"
            variant="bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="กรอกรายละเอียด"
            className="w-full"
          />

          {/* Buttons */}
          <div className="flex flex-row gap-4 justify-center mt-4">
            <Button onPress={handleSubmit} color="success" className="text-white">
              {editEventId ? "อัพเดทกิจกรรม" : "บันทึกข้อมูล"}
            </Button>
            <Button onPress={handleBack} variant="light" color="primary">
              {"กลับ"}
            </Button>
          </div>
        </div>
      )}
      <Toaster richColors />
    </div>
  );
};

export default EventManagement;
