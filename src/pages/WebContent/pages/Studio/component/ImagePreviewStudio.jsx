import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Image,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const images = Array.from({ length: 24 }, (_, i) => {
  // i จะเริ่มจาก 0 → 24, เราจึง +1 และใช้ padStart(4, '0') เพื่อให้เป็น 0001 → 0025
  const index = String(i + 2).padStart(4, "0");

  return {
    src: `/imgStudio/HOPEFUL_STUDIO_PERSPECTIVE_page-${index}.jpg`,
    headerTitle: `Title ${index}`,
    headerSubtitle: `Subtitle ${index}`,
  };
});

export default function ImagePreviewStudio() {
  const imagesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const currentImages = images.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  const [selectedImage, setSelectedImage] = useState(null);

  // state สำหรับ Modal
  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onOpenChange: onOpenChangeDetail,
    onClose: onCloseDetail,
  } = useDisclosure();

  const handleCardClick = (img) => {
    setSelectedImage(img);
    onOpenDetail();
  };

  return (
    <div className="min-h-full py-10">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-12 gap-2">
          {currentImages.map((img, index) => (
            <Card
              isPressable
              key={index}
              onPress={() => handleCardClick(img)}
              className="col-span-12 sm:col-span-4 h-[300px] relative shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src={img.src}
              />
            </Card>
          ))}
        </div>
        <div className="flex justify-center items-center mt-6">
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            onChange={(page) => setCurrentPage(page)}
            color="primary"
            showControls
          />
        </div>
      </div>

      <Modal isOpen={isOpenDetail} onOpenChange={onOpenChangeDetail} size="5xl">
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Image
                removeWrapper
                alt={selectedImage.headerTitle}
                className="w-full h-auto object-contain"
                src={selectedImage.src}
              />
            )}
          
          </ModalBody>
          <ModalFooter>
       
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
