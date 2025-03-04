import { useState, useEffect } from "react";
import NavbarSection from "@/pages/WebContent/components/NavbarSection";
import { UpArrowIcon } from "@/component/Icons";

export default function DefaultContent({ children }) {
  const [showScroll, setShowScroll] = useState(false);

  // ตรวจสอบการเลื่อนของผู้ใช้
  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  // ฟังก์ชันเลื่อนกลับไปด้านบน
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <NavbarSection />

      <main
        className="container mx-auto max-w-full flex-grow bg-cover bg-center bg-no-repeat bg-white"
      >
        {children}
      </main>

      {showScroll && (
        <UpArrowIcon
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 text-red-500 hover:text-white rounded-full shadow-lg hover:bg-red-600 transition duration-300 text-4xl"
          aria-label="Scroll to top"
        />
      )}
    </div>
  );
}
