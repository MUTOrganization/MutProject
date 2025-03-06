import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import ConfirmCaseModal from "./components/ConfirmCaseModal";
import ManagementSection from "./components/ManagementSection";
import { GalleryImages } from "./components/GalleryImages";
import fetchProtectedData from "../../../../../utils/fetchData";
import { URLS } from "@/config";
import { useAppContext } from "@/contexts/AppContext";
import { useCase } from "./utils/fetchCase";
import { toastError, toastSuccess, toastWarning } from "@/component/Alert";

const products = [
  { key: "beta-oil", value: "Beta Oil", label: "Beta Oil" },
  { key: "beta-liv", value: "Beta Liv", label: "Beta Liv" },
  { key: "beta-x-plus", value: "Beta X+", label: "Beta X+" },
  { key: "beta-herb", value: "Beta Herb", label: "Beta Herb" },
  { key: "beta-farm", value: "Beta Farm", label: "Beta Farm" },
  { key: "beta-cal+", value: "Beta Cal+", label: "Beta Cal+" },
  { key: "other", value: "อื่นๆ", label: "อื่นๆ" },
];

export default function CaseReview() {
  const { caseReview, isLoading, fetchCase } = useCase();
  const currentData = useAppContext();
  const businessId = useAppContext().currentUser.businessId;
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
        );
        const data = await res.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  const [formData, setFormData] = useState({
    companyName: "",
    discountCode: "",
    customerName: "",
    phone: "",
    province: "",
    product: "",
    address: "",
    symptomBefore: "",
    symptomAfter: "",
    other: "",
  });

  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onOpenChange: onOpenChangeConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();

  const handleConfirmCase = async () => {
    // สร้าง payload ในรูปแบบ JSON
    const payload = {
      company: formData.companyName,
      agent_code: formData.discountCode,
      business_id: businessId,
      customer_name: formData.customerName,
      phone: formData.phone,
      customer_province: formData.province,
      product: formData.product,
      customer_location: formData.address,
      before_food: formData.symptomBefore,
      after_food: formData.symptomAfter,
      description: formData.other,
    };

    try {
      // เรียก API ด้วย fetchProtectedData.post (หรือ fetch, axios, etc.)
      const responseCase = await fetchProtectedData.post(
        URLS.WebContent.createCase,
        payload, // ส่ง payload เป็น JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // ตรวจสอบสถานะการตอบกลับ
      if (!responseCase || responseCase.status !== 200) {
        throw new Error("Failed to create item");
      }

      // เคลียร์ฟอร์มหลังส่งข้อมูลสำเร็จ
      setFormData({
        companyName: "",
        discountCode: "",
        customerName: "",
        phone: "",
        province: "",
        product: "",
        address: "",
        symptomBefore: "",
        symptomAfter: "",
        other: "",
      });

      // ปิด Modal หรือ Dialog ที่แสดงอยู่
      onOpenChangeConfirm(false);

      fetchCase();
      toastSuccess("การจองของคุณอยู่ในสถานะ");
    } catch (error) {
      console.error(error);
      toastError(error.message || "เกิดข้อผิดพลาดในการสร้างการจอง");
    }
  };

  const handleSelectProvince = (keys) => {
    setSelectedProvince(keys);
    setFormData({ ...formData, province: keys });
  };

  const handleSelectProduct = (keys) => {
    const productName = Array.from(keys)[0] || "";
    setSelectedProduct(productName);
    setFormData({ ...formData, product: productName });
  };

  return (
    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 font-prompt">
      <div className="md:w-1/3 w-full ">
        <h2 className="text-2xl font-bold text-center mb-4">
          ประวัติการส่งเคสรีวิวลูกค้า
        </h2>
        <GalleryImages data={caseReview} />
      </div>
      <div className="md:w-2/3 w-full">
        <Card variant="shadow" className="bg-gray-100 rounded-lg">
          <CardHeader className="justify-center">
            <h2 className="text-xl font-semibold text-center">
              📋 ส่งเคสรีวิว
            </h2>
          </CardHeader>
          <CardBody className=" grid md:grid-cols-2 md:gap-10 h-full">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ชื่อบริษัท"
                  size="sm"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
                <Input
                  size="sm"
                  label="รหัสตัวแทน"
                  value={formData.discountCode}
                  onChange={(e) =>
                    setFormData({ ...formData, discountCode: e.target.value })
                  }
                />
              </div>
              <Input
                size="sm"
                label="ชื่อ-นามสกุล (ลูกค้า)"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="mt-4"
              />
              <Input
                size="sm"
                label="หมายเลขโทรศัพท์ลูกค้า"
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const newValue = e.target.value;
                  // ตรวจสอบว่าเป็นตัวเลขทั้งหมดหรือไม่
                  if (/^\d*$/.test(newValue)) {
                    setFormData({ ...formData, phone: newValue });
                  }
                }}
                className="mt-4"
              />
              <Select
                size="sm"
                label="สินค้า"
                placeholder="เลือกสินค้า"
                selectedKeys={
                  selectedProduct ? new Set([selectedProduct]) : new Set()
                }
                onSelectionChange={handleSelectProduct}
                selectionMode="single"
                disallowEmptySelection={false}
                className="mt-4"
              >
                {products.map((product) => (
                  <SelectItem key={product.value} textValue={product.value}>
                    {product.label}
                  </SelectItem>
                ))}
              </Select>

              {formData.product === "อื่นๆ" && (
                <Input
                  size="sm"
                  label="กรอกชื่อสินค้า"
                  placeholder="ระบุชื่อสินค้า"
                  value={formData.otherProduct || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, otherProduct: e.target.value })
                  }
                  className="mt-4"
                />
              )}

              <Autocomplete
                size="sm"
                label="จังหวัด"
                placeholder="เลือกจังหวัด"
                selectedKeys={
                  selectedProvince ? new Set([selectedProvince]) : new Set()
                }
                onSelectionChange={handleSelectProvince}
                selectionMode="single"
                disallowEmptySelection={false}
                className="mt-4"
              >
                {provinces.map((prov) => (
                  <AutocompleteItem key={prov.name_th} textValue={prov.name_th}>
                    {prov.name_th}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <Textarea
                size="sm"
                isClearable
                className="mt-4"
                label="ที่อยู่ / Location ของลูกค้า"
                variant="bordered"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <Textarea
                size="sm"
                isClearable
                className="mt-4"
                label="อาการก่อนทาน"
                variant="bordered"
                value={formData.symptomBefore || ""}
                onChange={(e) =>
                  setFormData({ ...formData, symptomBefore: e.target.value })
                }
              />
              <Textarea
                size="sm"
                isClearable
                className="mt-4"
                label="อาการหลังทาน"
                variant="bordered"
                value={formData.symptomAfter || ""}
                onChange={(e) =>
                  setFormData({ ...formData, symptomAfter: e.target.value })
                }
              />
              <Textarea
                size="sm"
                isClearable
                className="mt-4"
                label="ข้อมูลเพิ่มเติม"
                variant="bordered"
                value={formData.other || ""}
                onChange={(e) =>
                  setFormData({ ...formData, other: e.target.value })
                }
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-5">
            <Button
              onPress={onOpenConfirm}
              className="bg-black text-white w-full sm:w-auto"
            >
              ส่งเคสรีวิว
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ConfirmCaseModal
        isOpen={isOpenConfirm}
        onClose={onCloseConfirm}
        formData={formData}
        onConfirm={handleConfirmCase}
        onOpenChangeConfirm={onOpenChangeConfirm}
      />
    </div>
  );
}
