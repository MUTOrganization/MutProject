import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { LeftArrowIcon, PlusIcon } from "../../../../../../component/Icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Chip,
  Tabs,
  Tab,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Switch,
} from "@nextui-org/react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { URLS } from "../../../../../../config";
import fetchProtectedData from "../../../../../../../utils/fetchData";
import {
  toastError,
  toastSuccess,
  toastWarning,
} from "../../../../../../component/Alert";

function WeOneSettingReward() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setIsLoading] = useState(false);
  const useData = useAppContext();
  const [data, setData] = useState([]);
  const [isAddReWard, setIsAddReWard] = useState(false);
  const [selected, setSelected] = useState("History");
  const [selectedItem, setSelectedItem] = useState({
    image_url: null,
    points: null,
    quantity: null,
    title_reward: null,
    business_id: useData.currentUser.businessId,
  });

  const {
    isOpen: isModalAddReward,
    onOpen: onOpenModalAddReward,
    onOpenChange: onOpenChangeModalAddReward,
  } = useDisclosure();

  const {
    isOpen: isModalSetReward,
    onOpen: onOpenModalSetReward,
    onOpenChange: onOpenChangeModalSetReward,
  } = useDisclosure();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // สร้าง URL และแนบ Query Parameters
      const url = `${URLS.weOne.getlistReward}`;
      const params = {
        business_id: useData.currentUser.businessId,
      };

      const response = await fetchProtectedData.get(url, { params });

      setData(response.data);
    } catch (error) {
      console.error("Error fetching quest data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(data);

  useEffect(() => {
    fetchData();
  }, [location]);

  const handleBack = () => {
    navigate(-1, {
      state: { activeTab: location.state?.activeTab || "ManageMission" },
    });
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    onOpenModalSetReward();
  };

  const handleQuantityChange = (change) => {
    setSelectedItem((prev) => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + change),
    }));
  };

  const handlePointChange = (change) => {
    setSelectedItem((prev) => ({
      ...prev,
      points: Math.max(0, prev.points + change),
    }));
  };

  const handleUpdateChanges = async () => {
    // ตรวจสอบข้อมูลใน selectedItem
    if (
      !selectedItem.title_reward ||
      !selectedItem.points ||
      !selectedItem.quantity ||
      !selectedItem.image_url
    ) {
      toastError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // Construct the API URL
      const url = `${URLS.weOne.updateReward}`;
      const formData = new FormData();
      formData.append("reward_id", selectedItem.reward_id);
      formData.append("file", selectedItem.image_url);
      formData.append("title_reward", selectedItem.title_reward);
      formData.append("quantity", selectedItem.quantity);
      formData.append("points", selectedItem.points);
      formData.append("status", selectedItem.status);
      formData.append("business_id", useData.currentUser.businessId);

      // เรียก API
      await fetchProtectedData.put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show a success toast message
      toastSuccess("บันทึกข้อมูลสำเร็จ");
      fetchData();
      onOpenChangeModalSetReward(false);
    } catch (error) {
      // Log the error and display an error toast
      console.error("Error sending reward to database:", error);
      toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSelectedItem({
        image_url: null,
        points: "",
        quantity: "",
        status: "",
        title_reward: "",
      });
    }
  };

  const handleSaveReward = async () => {
    // ตรวจสอบข้อมูลใน selectedItem
    if (
      !selectedItem.title_reward ||
      !selectedItem.points ||
      !selectedItem.quantity ||
      !selectedItem.image_url
    ) {
      toastError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      // Construct the API URL
      const url = `${URLS.weOne.settingsReward}`;
      const formData = new FormData();

      formData.append("file", selectedItem.image_url);
      formData.append("title_reward", selectedItem.title_reward);
      formData.append("quantity", selectedItem.quantity);
      formData.append("points", selectedItem.points);
      formData.append("status", selectedItem.status);
      formData.append("business_id", useData.currentUser.businessId);

      // เรียก API
      await fetchProtectedData.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onOpenChangeModalAddReward(false);
      fetchData();
      // Show a success toast message
      toastSuccess("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      // Log the error and display an error toast
      console.error("Error sending reward to database:", error);
      toastError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSelectedItem({
        image_url: null,
        points: "",
        quantity: "",
        status: "",
        title_reward: "",
      });
    }
  };

  return (
    <Layout>
      <div className="py-6 space-y-6 bg-gradient-to-b from-blue-50 to-white z-10">
        <div className="flex items-center justify-between px-4">
          <Button
            isIconOnly
            variant="light"
            onPress={handleBack}
            aria-label="Go back to the previous page"
          >
            <LeftArrowIcon width={16} />
          </Button>
          <h2 className="text-xl font-bold flex-grow text-center">
            จัดการคลังของรางวัล
          </h2>

          <span
            className={`flex p-2 text-lg transition-all duration-300 ease-in-out cursor-pointer ${
              isAddReWard ? "text-red-500 scale-110" : "text-gray-500 scale-100"
            }`}
            onPress={onOpenModalAddReward}
          >
            <PlusIcon />
          </span>
        </div>

        <div className="flex flex-col w-full px-4">
          <Card
            className="overflow-hidden"
            shadow="none"
            style={{ background: "transparent" }}
          >
            <Tabs
              fullWidth
              size="md"
              aria-label="Reward Tabs"
              selectedKey={selected}
              onSelectionChange={setSelected}
            >
              {/* Active Rewards Tab */}
              <Tab key="active" title="รางวัลที่ใช้งาน">
                <div
                  className="gap-2 grid grid-cols-2 sm:grid-cols-2 overflow-y-auto pb-16 scrollbar-hide"
                  style={{ maxHeight: "calc(90vh - 120px)" }}
                >
                  {data
                    .filter((item) => item.status === 1) // Filter active rewards
                    .map((item, index) => (
                      <Card
                        shadow="none"
                        key={index}
                        isPressable
                        onPress={() => handleCardClick(item)}
                      >
                        <CardBody className="relative p-0">
                          <Image
                            shadow="sm"
                            radius="none"
                            width="100%"
                            alt={item.title_reward}
                            className="w-full object-cover h-[140px]"
                            src={item.image_url}
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <Chip color="primary" size="sm">
                              เหลือ {item.quantity}
                            </Chip>
                          </div>
                        </CardBody>
                        <CardBody className="overflow-visible p-0">
                          <CardFooter className="text-small justify-between">
                            <b>{item.title_reward}</b>
                            <p className="text-default-500">
                              {item.points} คะเเนน
                            </p>
                          </CardFooter>
                        </CardBody>
                      </Card>
                    ))}
                </div>
              </Tab>

              <Tab key="inactive" title="รางวัลที่ปิดการใช้งาน">
                <div
                  className="gap-2 grid grid-cols-2 sm:grid-cols-2 overflow-y-auto pb-16 scrollbar-hide"
                  style={{ maxHeight: "calc(90vh - 120px)" }}
                >
                  {data
                    .filter((item) => item.status === 0) // Filter inactive rewards
                    .map((item, index) => (
                      <Card
                        shadow="none"
                        key={index}
                        isPressable
                        onPress={() => handleCardClick(item)}
                      >
                        <CardBody className="relative p-0">
                          <Image
                            shadow="sm"
                            radius="none"
                            width="100%"
                            alt={item.title_reward}
                            className="w-full object-cover h-[140px]"
                            src={item.image_url}
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <Chip color="primary" size="sm">
                              เหลือ {item.quantity}
                            </Chip>
                          </div>
                          <div className="absolute top-2 right-2 z-10">
                            <Chip color="danger" size="sm">
                              ปิดใช้งาน
                            </Chip>
                          </div>
                        </CardBody>
                        <CardBody className="overflow-visible p-0">
                          <CardFooter className="text-small justify-between">
                            <b>{item.title_reward}</b>
                            <p className="text-default-500">
                              {item.points} คะเเนน
                            </p>
                          </CardFooter>
                        </CardBody>
                      </Card>
                    ))}
                </div>
              </Tab>
            </Tabs>
          </Card>
        </div>

        <Modal
          isOpen={isModalSetReward}
          onOpenChange={onOpenChangeModalSetReward}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedItem?.title_reward || "เพิ่มรางวัลใหม่"}
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-center">
                    <Image
                      src={
                        selectedItem?.image_url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={selectedItem?.title_reward || "Reward Image"}
                      className="w-full h-[140px] object-cover flex"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <b>คะเเนน:</b>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handlePointChange(-1)}
                      >
                        -
                      </Button>
                      <Input
                        readOnly
                        type="number"
                        value={selectedItem?.points || 0}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            points: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        style={{ width: "50px", textAlign: "center" }}
                      />
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => handlePointChange(1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <b>จำนวน:</b>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleQuantityChange(-1)}
                        variant="flat"
                      >
                        -
                      </Button>
                      <Input
                        readOnly
                        type="number"
                        value={selectedItem?.quantity || 0}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            quantity: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        style={{ width: "50px", textAlign: "center" }}
                      />
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handleQuantityChange(1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <b>สถานะของรางวัล:</b>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <p
                          className={`text-sm ${
                            selectedItem?.status === 1
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          ใช้งาน
                        </p>
                        <Switch
                          isSelected={selectedItem?.status || 0}
                          checked={selectedItem?.status === 1}
                          onChange={(e) =>
                            setSelectedItem((prev) => ({
                              ...prev,
                              status: e.target.checked ? 1 : 0,
                            }))
                          }
                        />
                        <p
                          className={`text-sm ${
                            selectedItem?.status === 0
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          ไม่ใช้งาน
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleUpdateChanges}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isModalAddReward}
          onOpenChange={onOpenChangeModalAddReward}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {"เพิ่มรางวัลใหม่"}
                </ModalHeader>
                <ModalBody>
                  <div className="flex items-center justify-between mt-4">
                    <b>ชื่อของรางวัล:</b>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={selectedItem?.title_reward || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            title_reward: e.target.value, // Directly update the string value
                          }))
                        }
                        style={{ width: "100%", textAlign: "left" }}
                        placeholder="กรอกชื่อของรางวัล"
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md">
                    {selectedItem?.image_url ? (
                      <div className="flex flex-col items-center">
                        {selectedItem.image_url instanceof File ? (
                          <img
                            src={URL.createObjectURL(selectedItem.image_url)}
                            alt="Reward"
                            className="w-64 h-64 object-cover rounded-md cursor-pointer"
                            onPress={() =>
                              document.getElementById("imageUpload").click()
                            }
                          />
                        ) : (
                          <img
                            src={
                              selectedItem.image_url ||
                              "https://via.placeholder.com/150"
                            }
                            alt="Reward"
                            className="w-64 h-64 object-cover rounded-md cursor-pointer"
                            onPress={() =>
                              document.getElementById("imageUpload").click()
                            }
                          />
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          กดที่รูปเพื่อเปลี่ยนรูป
                        </p>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedItem((prev) => ({
                                ...prev,
                                image_url: file, // Save the actual file object
                              }));
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="imageUpload"
                        className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer"
                      >
                        <p className="text-gray-500">กดเพื่อเพิ่มรูปภาพ</p>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedItem((prev) => ({
                                ...prev,
                                image_url: file, // Save the image URL
                              }));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* title_reward Section */}
                  <div className="flex items-center justify-between mt-4">
                    <b>คะเเนน:</b>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handlePointChange(-1)}
                      >
                        -
                      </Button>
                      <Input
                        readOnly
                        type="number"
                        value={selectedItem?.points || 0}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            points: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        style={{ width: "50px", textAlign: "center" }}
                      />
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => handlePointChange(1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Quantity Section */}
                  <div className="flex items-center justify-between mt-4">
                    <b>จำนวน:</b>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleQuantityChange(-1)}
                        variant="flat"
                      >
                        -
                      </Button>
                      <Input
                        readOnly
                        type="number"
                        value={selectedItem?.quantity || 0}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            quantity: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        style={{ width: "50px", textAlign: "center" }}
                      />
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => handleQuantityChange(1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="flex items-center justify-between mt-4">
                    <b>สถานะของรางวัล:</b>
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-2">
                        <p
                          className={`text-sm ${
                            selectedItem?.status === 1
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          ใช้งาน
                        </p>
                        <Switch
                          checked={selectedItem?.status === 1}
                          onChange={(e) =>
                            setSelectedItem((prev) => ({
                              ...prev,
                              status: e.target.checked ? 1 : 0,
                            }))
                          }
                        />
                        <p
                          className={`text-sm ${
                            selectedItem?.status === 0
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        >
                          ไม่ใช้งาน
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSaveReward}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
}

export default WeOneSettingReward;
