import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Image, Badge } from "@nextui-org/react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
  TaskColorIcon,
  ArrowRightColorIcon,
  TreasureColorIcon,
  PlanetColorIcon,
  ListColorIcon,
} from "../../../../component/Icons";
import { useTransfer } from "../../Components/TransferContext";

function Home() {
  const [isTaskPressed, setIsTaskPressed] = useState(false);
  const [isPointPressed, setIsPointPressed] = useState(false);
  const [isQuestsPressed, setIsQuestsPressed] = useState(false);
  const [isQuestionarePressed, setIsQuestionarePressed] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const { userPoints, isLoadingPoints, fetchUserPoints } = useTransfer();
  const navigate = useNavigate();

  dayjs.extend(duration);
  useEffect(() => {
    function calculateRemainingTime() {
      const now = dayjs();
      let target;

      // ตั้งเวลาเป็นวันศุกร์ 17:00 น.
      if (now.day() === 5 && now.hour() >= 17) {
        // ถ้าวันนี้เป็นวันศุกร์หลัง 17:00 น. ให้ตั้งเป้าเป็นเที่ยงคืน
        target = now.hour(23).minute(59).second(59);
      } else {
        // ตั้งเป้าเป็นวันศุกร์ถัดไป 17:00 น.
        target = now.day(5).hour(17).minute(0).second(0).millisecond(0);
        if (now.day() > 5) {
          target = target.add(1, "week");
        }
      }

      const diff = target.diff(now);

      if (diff <= 0) {
        setRemainingTime("หมดเวลา");
        return;
      }

      const timeLeft = dayjs.duration(diff);
      const hours = String(timeLeft.hours()).padStart(2, "0");
      const minutes = String(timeLeft.minutes()).padStart(2, "0");
      const seconds = String(timeLeft.seconds()).padStart(2, "0");

      setRemainingTime(`${hours}:${minutes}:${seconds} ชม.`);
    }

    calculateRemainingTime();
    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUserPoints();
  }, [])

  const cardData = [
    {
      id: "points",
      to: "/WeOne-Point",
      bgColor: "#fcf9e3",
      icon: {
        gradientFrom: "#fdedb9",
        gradientTo: "#f5c948",
        textColor: "text-yellow-600",
        borderColor: "#fad336",
        iconComponent: <TreasureColorIcon width={40} height={40} />,
      },
      title: `คะแนน :`,
      titleHighlight: userPoints.total_points,
      description: "ทำความดีไม่เคยสูญเปล่า คะแนนจะคอยบอกเล่าความพยายามของคุณ",
      isPressed: isPointPressed,
      onPressStart: () => setIsPointPressed(true),
      onPressEnd: () => setIsPointPressed(false),
    },
    {
      id: "quests",
      to: "/WeOne-Quests",
      bgColor: "#dcf6d8",
      icon: {
        gradientFrom: "#dcf6d8",
        gradientTo: "#b8d9a6",
        textColor: "text-green-500",
        borderColor: "#c4e3b4",
        iconComponent: <PlanetColorIcon width={40} height={40} />,
      },
      title: "กิจกรรม",
      description: "ทำกิจกรรมหรือภารกิจต่างๆ เพื่อรับคะแนน",
      isPressed: isQuestsPressed,
      onPressStart: () => setIsQuestsPressed(true),
      onPressEnd: () => setIsQuestsPressed(false),
    },
    {
      id: "questionnaire",
      to: "/WeOne-Vote",
      bgColor: "#fce2e2",
      icon: {
        gradientFrom: "#fce2e2",
        gradientTo: "#f6b2b0",
        textColor: "text-red-500",
        borderColor: "#f69e9b",
        iconComponent: <ListColorIcon width={40} height={40} />,
      },
      title: "แบบสอบถาม",
      description: "ทำแบบสอบถามเพื่อรับคะแนนเพิ่มเติม",
      isPressed: isQuestionarePressed,
      onPressStart: () => setIsQuestionarePressed(true),
      onPressEnd: () => setIsQuestionarePressed(false),
    },
  ];

  return (
    <div className="relative w-full">
      <div className="w-full h-3/4">
        <Image
          alt="Image"
          src="/img/background.jpeg"
          className="w-full h-full object-cover rounded-b-3xl rounded-t-none"
        />
      </div>
      <section className="absolute top-36 left-1/2 transform -translate-x-1/2 w-11/12 z-20 space-y-2">
        <Card radius="lg" shadow="none" className="bg-[#fcf9e3] shadow-sm">
          <CardBody >
            <div className="grid grid-cols-2 items-center">
              <div>
                <p className="text-xl font-semibold">
                  คะแนน <span className="text-blue-600 font-bold">{userPoints.total_points}</span>
                </p>
                <p className="text-md text-gray-500">
                  โอนคะแนนง่ายๆ เพิ่มพลังบวกให้ทุกคน
                </p>
              </div>
              <div className="text-right">
                <Button
                  className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold text-lg"
                  fullWidth
                  onPress={() => navigate("/WeOne-Transfer")}
                >
                  โอนเลย
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="text-lg font-bold space-x-2">
          <span className="text-[#438c98]">3</span>
          <span className="text-[#25262a]">รายการ</span>
        </div>
        <div className="flex flex-col h-[60vh] overflow-hidden">
          <section className="flex-grow space-y-4 overflow-y-auto pb-24 scrollbar-hide">
            <Card
              radius="lg"
              shadow="none"
              isPressable
              fullWidth
              as={Link}
              to={"/WeOne-Point"}
              className="bg-[#fcf9e3] p-2 relative shadow-sm"
            >

              <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-1">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-b from-[#fdedb9] to-[#f5c948] rounded-lg text-yellow-600 border-2 border-[#fad336]">
                  <TreasureColorIcon width={40} height={40} />
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-lg font-bold">
                    คะแนน :{" "}
                    <span className="text-blue-600 font-bold">{userPoints.total_points}</span>
                  </h2>
                  <p className="text-sm text-gray-600">
                    ทำความดีไม่เคยสูญเปล่า คะแนนจะคอยบอกเล่าความพยายามของคุณ
                  </p>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`relative flex items-center justify-center  transition-transform duration-200 ${isPointPressed ? "scale-110" : ""}`}
                  onMouseDown={() => setIsPointPressed(true)}
                  onMouseUp={() => setIsPointPressed(false)}
                  onTouchStart={() => setIsPointPressed(true)} // สำหรับมือถือ
                  onTouchEnd={() => setIsPointPressed(false)} // สำหรับมือถือ
                  onMouseLeave={() => setIsPointPressed(false)} // กรณีลากออกนอกขอบ
                  style={{ justifySelf: "end" }}
                >

                </div>
              </CardBody>
            </Card>
            <Card
              radius="lg"
              shadow="none"
              isPressable
              fullWidth
              as={Link}
              to={"/WeOne-Quests"}
              className="bg-[#dcf6d8] p-2 relative shadow-sm"
            >
              <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4 p-1">
                {/* Icon */}
                {/* <Badge
                    content="2"
                    placement="top-left"
                    shape="circle"
                    showOutline={false}
                    className="bg-white text-[#60b634] text-sm font-semibold"
                    size="md"
                    variant="shadow"
                  > */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-b from-[#dcf6d8] to-[#b8d9a6] rounded-lg text-green-500 border-2 border-[#c4e3b4]">
                  <PlanetColorIcon width={40} height={40} />
                </div>
                {/* </Badge> */}
                {/* Content */}
                <div>
                  <h2 className="text-lg font-bold">กิจกรรม</h2>
                  <p className="text-sm text-gray-600">
                    ทำกิจกรรมหรือภารกิจต่างๆ เพื่อรับคะแนน
                  </p>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`relative flex items-center justify-center transition-transform duration-200 ${isQuestsPressed ? "scale-110" : ""}`}
                  onMouseDown={() => setIsQuestsPressed(true)}
                  onMouseUp={() => setIsQuestsPressed(false)}
                  onTouchStart={() => setIsQuestsPressed(true)} // สำหรับมือถือ
                  onTouchEnd={() => setIsQuestsPressed(false)} // สำหรับมือถือ
                  onMouseLeave={() => setIsQuestsPressed(false)} // กรณีลากออกนอกขอบ
                >

                </div>
              </CardBody>
            </Card>

            <Card
              radius="lg"
              shadow="none"
              isPressable
              fullWidth
              as={Link}
              to={"/WeOne-Vote"}
              className="bg-[#fce2e2] p-2 relative shadow-sm"
            >
              <CardBody className="grid grid-cols-[auto,1fr,auto] items-center gap-4 relative p-1">
                {/* Icon */}
                {/* <Badge
                    content="4"
                    placement="top-left"
                    shape="circle"
                    showOutline={false}
                    className="bg-white text-[#e3544e] text-sm font-semibold"
                    size="md"
                    variant="shadow"
                  > */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-b from-[#fce2e2] to-[#f6b2b0] rounded-lg text-red-500 border-2 border-[#f69e9b]">
                  <ListColorIcon width={40} height={40} />
                </div>
                {/* </Badge> */}

                {/* Content */}
                <div>
                  <h2 className="text-lg font-bold">แบบสอบถาม</h2>
                  <p className="text-sm text-gray-600">
                    ทำแบบสอบถามเพื่อรับคะแนนเพิ่มเติม
                  </p>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`relative flex items-center justify-center  transition-transform duration-200 ${isQuestionarePressed ? "scale-110" : ""}`}
                  onMouseDown={() => setIsQuestionarePressed(true)}
                  onMouseUp={() => setIsQuestionarePressed(false)}
                  onTouchStart={() => setIsQuestionarePressed(true)} // สำหรับมือถือ
                  onTouchEnd={() => setIsQuestionarePressed(false)} // สำหรับมือถือ
                  onMouseLeave={() => setIsQuestionarePressed(false)} // กรณีลากออกนอกขอบ

                >
                </div>
              </CardBody>
            </Card>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Home;
