import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function ImageCarousel({ activeImages, setActiveImages, editMode, addMode }) {
  
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActiveImages((prev) => [...prev, file]); // เพิ่มไฟล์ใหม่เข้า activeImages
    }
  };

  const handleRemoveImage = (index) => {
    setActiveImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      {/* แสดง Swiper สำหรับรูปภาพทั้งหมด */}
      {activeImages?.length > 0 ? (
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination, Navigation, Autoplay]}
          className="w-96 h-64"
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {activeImages.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image) // URL สำหรับไฟล์ใหม่
                    : image // URL สำหรับไฟล์เดิม
                }
                alt={`Uploaded ${index}`}
                className="w-96 max-h-64 object-cover rounded-md"
              />
              {(editMode || addMode) && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
       <></>
      )}

      {/* Input สำหรับเพิ่มรูปภาพ */}
      {(editMode || addMode) && (
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
