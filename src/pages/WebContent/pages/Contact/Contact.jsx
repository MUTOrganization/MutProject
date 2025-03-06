import React from "react";

function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        ช่องทางติดต่อ TEAM PRODUCTION HOPEFUL
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* คอลัมน์ซ้าย: ข้อมูลติดต่อ */}
        <div className="flex-1">
          <p className="mb-4">
            <strong>ที่อยู่:</strong>
            <br />
            4 ซอย รามคำแหง 118 แยก 57
            <br />
            แขวงสะพานสูง เขตสะพานสูง
            <br />
            กรุงเทพฯ 10240
          </p>
          <p className="mb-4">
            <strong>เวลาทำการ:</strong>
            <br />
            วันจันทร์ - วันศุกร์ เวลา 8:30 - 16:30
            <br />
            ปิดทำการ เสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์
          </p>
          <p className="mb-4">
            <strong>โทรศัพท์:</strong>{" "}
            <a
              href="tel:0954126668"
              className="text-blue-600 hover:underline ml-1"
            >
              095-412-6668
            </a>
          </p>
          <p className="mb-4">
            <strong>อีเมล:</strong>{" "}
            <a
              href="mailto:hopefulproteam@gmail.com"
              className="text-blue-600 hover:underline ml-1"
            >
              hopefulproteam@gmail.com
            </a>
          </p>
        </div>

        {/* คอลัมน์ขวา: QR Line */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="mb-4 text-center text-lg font-semibold">
            QR Line Official Content
          </p>
          <img
            src="/img/lineContent.png"
            alt="QR LINE"
            className="w-48 h-48 object-contain border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}

export default Contact;
