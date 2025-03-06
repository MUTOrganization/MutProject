import React, { useState } from "react";
import { Image, Button } from "@nextui-org/react";
import { HFChevronLeft, HFChevronRight } from "@/component/Icons";

export function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesLength = images.length;

  if (!imagesLength) return null;

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imagesLength);
  };

  // ฟังก์ชันสำหรับเปลี่ยนสไลด์เมื่อคลิกดอท
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center">
      {/* ส่วนรูปภาพ */}
      <Image
        radius="none"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="w-full h-full object-cover"
      />

      {/* ปุ่ม Previous */}
      {images.length > 1 && (
        <Button
          isIconOnly
          variant="flat"
          onPress={goToPrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 text-xl
                     bg-white/40 hover:bg-white focus:bg-white z-10"
        >
          <HFChevronLeft />
        </Button>
      )}

      {/* ปุ่ม Next */}
      {images.length > 1 && (
        <Button
          isIconOnly
          variant="flat"
          onPress={goToNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-xl
                     bg-white/40 hover:bg-white focus:bg-white z-10"
        >
          <HFChevronRight />
        </Button>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 w-full flex justify-center gap-2 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)} // ถ้าอยากให้คลิกดอทแล้วเปลี่ยนรูป
              className={`w-3 h-3 rounded-full cursor-pointer transition-all 
                ${index === currentIndex ? "bg-gray-700 scale-125" : "bg-gray-400"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
