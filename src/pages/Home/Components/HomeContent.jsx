import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Chip,
  Divider,
  Image,
  Badge,
} from "@nextui-org/react";
import CalendarComponent from "../Components/CalendarComponent";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import { ACCESS } from "../../../configs/access";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function HomeContent() {
  const updates = [
    {
      title: "Version 2.1.0",
      date: "September 5, 2024",
      description:
        "This update includes new features for user management, enhanced security protocols, and various bug fixes.",
    },
    {
      title: "Version 2.0.5",
      date: "August 20, 2024",
      description:
        "This minor update addresses several performance improvements and minor bug fixes.",
    },
    {
      title: "Version 2.0.0",
      date: "August 1, 2024",
      description:
        "Major update with revamped user interface, new dashboard features, and improved user experience.",
    },
    {
      title: "Version 1.9.8",
      date: "July 15, 2024",
      description:
        "Patch update that resolves login issues and enhances data synchronization across platforms.",
    },
    // Add more updates as needed
  ];

  const texts = [
    "Welcome to Hopeful One!",
    "Solution for 'Managing' your online business seamlessly.",
  ];

  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(160);
  const [activeTab, setActiveTab] = useState("home");
  const [prevTab, setPrevTab] = useState("home");

  const [newsData, setNewsData] = useState([]);
  const [educationData, setEducationData] = useState([]);

  const [showBadgeNews, setShowBadgeNews] = useState(true);
  const [showBadgeMedia, setShowBadgeMedia] = useState(true);

  const currentData = useAppContext();

  const formatThaiDate = (dateString) => {
    dayjs.locale("th");
    const [year, month, day] = dateString.split("-");
    let convertedYear = parseInt(year, 10);

    if (convertedYear < 2500) {
      convertedYear += 543;
    }

    const date = dayjs(`${convertedYear}-${month}-${day}`);
    return date.format("D MMMM YYYY");
  };

  const fetchNewsData = async () => {
    try {
      const response = await axios.get(
        `${URLS.home_news.getNewsAll}/${currentData.currentUser.businessId}`
      );
      setNewsData(response.data);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchEducationData = async () => {
    try {
      const response = await axios.get(
        `${URLS.home_education.getEducation}/${currentData.currentUser.businessId}`
      );
      setEducationData(response.data);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % texts.length;
      const fullText = texts[i];

      setCurrentText(
        isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimeout = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [currentText, isDeleting, loopNum, typingSpeed]);

  // Determine the animation class based on the tab change direction
  const getAnimationClass = () => {
    if (activeTab === prevTab) return "";
    return activeTab > prevTab ? "animate-slide-right" : "animate-slide-left";
  };

  const handleTabChange = (key) => {
    setPrevTab(activeTab);
    setActiveTab(key);

    if (key === "news") {
      setShowBadgeNews(false);
    }
    if (key === "media") {
      setShowBadgeMedia(false);
    }
  };

  return (
    <Card className="flex flex-col w-full mx-auto bg-custom-gradient shadow-none border border-separate p-3 lg:p-7 max-h-[calc(94vh-4rem)]">
      <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
        {/* <section className="flex justify-center sticky top-0 z-20">
          <Tabs
            aria-label="Tabs colors"
            color="primary"
            radius="md"
            selectedKey={activeTab}
            onSelectionChange={handleTabChange}
          >
            <Tab
              key="home"
              title={
                <div className="flex items-center space-x-2">
                  <span>หน้าเเรก</span>
                </div>
              }
            />
            {currentData.accessCheck.haveAny([ACCESS.home.home_news]) && (
              <Tab
                key="news"
                title={
                  <div className="relative flex items-center space-x-2">
                    <span>ข่าวสาร</span>
                    {showBadgeNews && (
                      <Badge
                        content={newsData.length}
                        size="sm"
                        color="primary"
                        variant="shadow"
                        shape="rectangle"
                        showOutline={false}
                        className="absolute -top-2 -right-2"
                      />
                    )}
                  </div>
                }
              />
            )}
            {currentData.accessCheck.haveAny([ACCESS.home.home_map]) && (
              <Tab
                key="maps"
                title={
                  <div className="flex items-center space-x-2">
                    <span>แผนที่</span>
                  </div>
                }
              />
            )}

            {currentData.accessCheck.haveAny([ACCESS.home.home_lernnig]) && (
              <Tab
                key="media"
                title={
                  <div className="flex items-center space-x-2">
                    <span>สื่อความรู้</span>
                    {showBadgeMedia && (
                      <Badge
                        content={educationData.length}
                        size="sm"
                        color="primary"
                        variant="shadow"
                        shape="rectangle"
                        showOutline={false}
                        className="absolute -top-2 -right-2 z-10"
                      />
                    )}
                  </div>
                }
              />
            )}
          </Tabs>
        </section> */}

        {/* Content Section with Flex Grow */}
        <div
          className={`flex-grow transition-transform duration-500 ${getAnimationClass()}`}
        >
          {activeTab === "home" && (
            <section
              className="flex flex-row items-center justify-between w-full"
              style={{ height: "700px" }}
            >
              {/* Left Column */}
              <div className="flex flex-col">
                <div className="text-6xl grid grid-cols-2">
                  <div className="col-span-1 text-right">
                    <span className="text-black font-bold italic">
                      Hopeful{" "}
                    </span>
                    <span className="bg-clip-text font-normal text-transparent bg-gradient-to-r from-custom-blue via-custom-purple to-custom-light-blue italic">
                      One
                    </span>
                  </div>
                  <div className="col-span-1 col-start-2"></div>
                </div>
                <div className="text-6xl font-bold grid grid-cols-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">
                    <span className="text-black font-bold italic">Your </span>
                    <span className="font-normal bg-clip-text text-transparent italic bg-gradient-to-r from-custom-purple via-custom-blue  to-custom-purple p-1">
                      All-In-One
                    </span>
                  </div>
                </div>
                <span className="text-2xl text-black font-normal mt-4 p-3 text-center italic">
                  {currentText}
                  <span className="font-normal bg-clip-text text-transparent bg-gradient-to-r from-custom-blue via-custom-purple to-custom-light-blue">
                    |
                  </span>
                </span>
              </div>
              {/* Right Column */}
              <div className="flex p-0 relative mr-4 mt-4">
                <img
                  src="./img/logoHomeWhite.png"
                  alt="Decorative Icon"
                  style={{ width: "500px" }}
                  className="p-0 mr-10 animate-float"
                />
                {/* Icons around the image */}
                <img
                  src="./img/facebookIcon.png"
                  alt="Facebook Icon"
                  className="absolute -top-6 right-1/2 w-14 h-14 animate-float"
                />
                <img
                  src="./img/shopeeIcon.png"
                  alt="Shopee Icon"
                  className="absolute left-0 top-1/4  w-14 h-14 animate-float"
                />
                <img
                  src="./img/tiktokIcon.png"
                  alt="TikTok Icon"
                  className="absolute right-0 top-1/4  w-14 h-14 animate-float"
                />
              </div>
            </section>
          )}

          {activeTab === "maps" && (
            <div className="flex flex-col items-center justify-center w-full h-screen mt-4">
              {/* Title for the map */}

              {/* Full-screen map container */}
              <Card
                className="responsive-map-container w-full h-full"
                radius="sm"
              >
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=177q-iNzGnA6dLltRxonG5pEWBl_RVdE&femb=1&ll=13.76156%2C100.6902594&z=15"
                  frameBorder="0"
                  allowFullScreen
                  title="Google Map"
                  className="w-full h-full"
                ></iframe>
              </Card>
            </div>
          )}

          {activeTab === "Calendar" && (
            <div className="w-full h-full">
              <CalendarComponent />
            </div>
          )}

          {/* Other Tab Content */}
          {activeTab === "news" && (
            <div className="w-full max-h-screen p-0 mt-4 mb-4">
              <h2 className="text-2xl font-bold mb-6">มีอะไรใหม่?</h2>
              <div className="grid grid-cols-1 gap-4">
                {newsData.map((item, index) => (
                  <div key={index}>
                    <div
                      className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      <div className="flex-1 p-4 flex justify-center items-center">
                        <Image
                          isZoomed
                          shadow="md"
                          style={{
                            maxWidth: "300px", // กำหนดความกว้างสูงสุด
                            maxHeight: "300px", // กำหนดความสูงสูงสุด
                            objectFit: "contain", // ปรับรูปภาพให้อยู่ในกรอบโดยไม่เสียสัดส่วน
                          }}
                          radius="sm"
                          src={item.image_url}
                          alt={`News ${index + 1}`}
                        />
                      </div>

                      <Card className="flex-1 p-4 shadow-md" radius="sm">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-base text-gray-500 mb-2">
                          อัพเดทล่าสุด : {formatThaiDate(item.date)}
                        </p>
                        <div
                          className="prose prose-sm text-gray-600 break-words overflow-hidden"
                          style={{
                            maxWidth: "100%",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {item.description}
                          </ReactMarkdown>
                        </div>
                      </Card>
                    </div>
                    {/* Divider */}
                    {index < newsData.length - 1 && (
                      <Divider className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "new" && (
            <div className="w-full min-h-screen p-6 mt-10 mb-10">
              <h2 className="text-2xl font-bold mb-6">Version Updates</h2>
              <Accordion>
                {updates.map((update, index) => (
                  <AccordionItem
                    key={index}
                    title={
                      <div className="flex justify-start items-center">
                        {update.title}
                        {index === 0 && (
                          <Chip
                            variant="shadow"
                            classNames={{
                              base: "bg-gradient-to-br from-custom-blue via-custom-purple to-custom-light-blue border-small border-white/50 shadow-custom-purple ml-4",
                              content: "drop-shadow shadow-black text-white",
                            }}
                          >
                            New
                          </Chip>
                        )}
                      </div>
                    }
                  >
                    <Card className="p-4 shadow-md bg-white/40 backdrop-blur-md">
                      <p className="text-sm text-gray-500 mb-2">
                        Updated on: {update.date}
                      </p>
                      <p className="text-base text-gray-600">
                        {update.description}
                      </p>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {activeTab === "media" && (
            <div className="w-full max-h-screen p-0 mt-4 mb-4">
              <h2 className="text-2xl font-bold mb-6">สื่อความรู้</h2>
              <div className="grid grid-cols-1 gap-4">
                {educationData.map((item, index) => {
                  const isValidYoutubeLink =
                    item.link.includes("youtube.com/watch?v=") ||
                    item.link.includes("youtu.be/");
                  let embedUrl = "";

                  if (isValidYoutubeLink) {
                    embedUrl = item.link.includes("watch?v=")
                      ? item.link.replace("watch?v=", "embed/")
                      : item.link.replace("youtu.be/", "youtube.com/embed/");
                  }

                  return (
                    <div key={index}>
                      <div
                        className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                      >
                        <div className="flex-1 p-4">
                          {isValidYoutubeLink ? (
                            <div className="flex flex-col items-center">
                              <iframe
                                width="100%"
                                height="315"
                                src={embedUrl}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="rounded-lg shadow-lg"
                                allowFullScreen
                                title="Video"
                              ></iframe>
                            </div>
                          ) : (
                            <Chip color="danger">รูปแบบลิงก์ไม่ถูกต้อง</Chip>
                          )}
                        </div>
                        <Card className="flex-1 p-4 shadow-md" radius="sm">
                          <h3 className="text-xl font-bold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-base text-gray-500 mb-2">
                            อัพเดทล่าสุด : {formatThaiDate(item.date)}
                          </p>
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
                                {item.description}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </Card>
                      </div>
                      {index < educationData.length - 1 && (
                        <Divider className="my-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer fixed at the bottom */}
      <footer className="w-full text-white p-0 text-center text-sm mt-auto">
        <p>&copy; 2024 Hopeful Co.,Ltd. All rights reserved.</p>
      </footer>
    </Card>
  );
}

export default HomeContent;
