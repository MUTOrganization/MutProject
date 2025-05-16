import React, { useState, useEffect } from "react";
import {
  Card,
} from "@nextui-org/react";
import "dayjs/locale/th";


function HomeContent() {
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

  return (
    <Card className="flex flex-col w-full mx-auto bg-custom-gradient shadow-none border border-separate p-3 lg:p-7 h-[calc(100vh-8rem)]">
      <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
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
