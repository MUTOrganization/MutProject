import React, { useState, useEffect } from "react";
import DefaultLayout from "../../layouts/default";
import {
  Card,
  Checkbox,
  Select,
  SelectItem,
  Avatar,
  CardBody,
  useDisclosure,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
} from "@nextui-org/react";
import { startOfMonth, endOfMonth, today } from "@internationalized/date";
import { useAppContext } from "../../contexts/AppContext";
import { formatDateObject } from "../../component/DateUtiils";
import { PrimaryButton } from "../../component/Buttons";
import { URLS } from "../../config";
import fetchProtectedData from "../../../utils/fetchData";
import { SelectorIcon, FilterIcon } from "../../component/Icons";
import Dashboard from "./component/Dashboard";
import Tablesale from "./component/Tablesale";
import { ACCESS } from "../../configs/access";
import DateSelector from "../../component/DateSelector";

function DashBoardSale() {
  const {
    isOpen: isFilterModalOpen,
    onOpen: openFilterModal,
    onOpenChange: onFilterModalChange,
  } = useDisclosure();

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(() => {
    const savedCheckboxes = localStorage.getItem(
      "selectedCheckboxesDashBoardSale"
    );
    return savedCheckboxes
      ? JSON.parse(savedCheckboxes)
      : {
        SalesNew: true,
        SalesOld: true,
        sales: true,
        newcus: true,
        oldcus: true,
        totalOrder: true,
        totalAdsAmount: false,
        newInbox: true,
        oldInbox: false,
        totalInbox: true,
        PercentAdsNew: false,
        PercentAdsSale: false,
        closeNew: true,
        closeTotal: true,
      };
  });

  const [viewTable, setViewTable] = useState(false);
  const [vatRate, setVatRate] = useState(false);
  const { currentUser } = useAppContext();
  const currentData = useAppContext();
  const agentId = currentUser?.businessId;
  const username = currentUser?.userName;
  const nickname = currentUser?.nickname;


  const role = currentUser?.role;
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
});

  const roleCheck = () => {
    if (currentData.accessCheck.haveAny([
      ACCESS.dashboard.view_manager_sale,
    ])) {
      return ["all"];
    } else {
      currentData.accessCheck.haveAny([
        ACCESS.dashboard.dashboard_stat_sale,
      ])
    } {
      return [username];
    }
  };

  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);

  const [selectedUser, setSelectedUser] = useState(roleCheck(role));
  const [selectedPage, setSelectedPage] = useState(["all"]);



  useEffect(() => {
    localStorage.setItem(
      "selectedCheckboxesDashBoardSale",
      JSON.stringify(selectedCheckboxes)
    );
  }, [selectedCheckboxes]);

  const fetchDataName = async () => {
    try {
      const urlUserSale = `${URLS.STATSSALE}/getUserSale/${agentId}`;
      const urllistPage = `${URLS.STATSSALE}/getlistPage/${agentId}`;
      // ใช้ Promise.all เพื่อ fetch ทั้งสองเส้นพร้อมกัน
      const [userSaleResponse, listPageResponse] = await Promise.all([
        fetchProtectedData.get(urlUserSale),
        fetchProtectedData.get(urllistPage),
      ]);

      const listPageResult = listPageResponse.data;
      const userSaleResult = userSaleResponse.data;
      setPages(listPageResult);
      setUsers(userSaleResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataName();
  }, []);

  const handleClear = () => {
    setSelectedUser(roleCheck(role));
    setSelectedPage(roleCheck(role));
  };



  const handleUserSelect = (key) => {
    setSelectedUser(key);
  };

  const handlePageSelect = (key) => {
    setSelectedPage(key);
  };

  const handleVatChange = (isChecked) => {
    setVatRate(isChecked);
  };

  const handleCheckboxSelection = (key) => {
    setSelectedCheckboxes((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <section title={"Dashboard Sale"}>
      <Card shadow="none" radius="sm">
        <CardBody>
          <div className="flex justify-center items-center max-h-screen w-full">
            <div className="flex flex-col w-full gap-4">
              <div className="flex justify-between ">
              <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center w-full'>

                <DateSelector value={dateRange} onChange={(value) => setDateRange(value)} />

                  {/* Reset Button Section */}
                  <div className="flex flex-col-2 space-x-3 items-center">
                    {viewTable ? (
                      <div>
                        <Select
                          items={pages}
                          variant="bordered"
                          label="เลือกเพจ"
                          className="max-w-[250px] min-w-[220px]"
                          onSelectionChange={(key) => handlePageSelect(key)}
                          selectedKeys={selectedPage}
                          disallowEmptySelection={true} 
                        >
                          {/* Add 'All' as the first option */}
                          <SelectItem key="all" textValue="ทั้งหมด">
                            <div className="flex gap-2 items-center">
                              <span className="text-small">ทั้งหมด</span>
                            </div>
                          </SelectItem>

                          {/* Render users as the other options */}
                          {pages.map((user) => (
                            <SelectItem
                              key={user.pageCode || user.name}
                              textValue={user.pageCode || user.name}
                            >
                              <div className="flex gap-2 items-center">
                                <span className="text-small">
                                  {user.pageCode || user.name}
                                </span>
                                <span className="text-tiny text-default-400">
                                  {user.platform}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    ) : (
                      <div>
                        {currentData.accessCheck.haveAny([
                          ACCESS.dashboard.view_manager_sale,
                        ]) ? (
                          <Select
                            items={users}
                            variant="bordered"
                            label="เลือกผู้ใช้"
                            className="max-w-[350px] min-w-[350px] "
                            onSelectionChange={(key) => handleUserSelect(key)}
                            selectedKeys={selectedUser}
                            disallowEmptySelection={true} 
                          >
                            {/* Add 'All' as the first option */}
                            <SelectItem key="all" textValue="ทั้งหมด">
                              <div className="flex gap-2 items-center">
                                <span className="text-small">ทั้งหมด</span>
                              </div>
                            </SelectItem>

                            {/* Render users as the other options */}
                            {users.map((user) => (
                              <SelectItem
                                key={user.username}
                                textValue={user.nickName || user.username}
                              >
                                <div className="flex items-center p-1 gap-3">
                                  <Avatar
                                    src={user.displayImgUrl || ""}
                                    color="primary"
                                    isBordered
                                    name={
                                      user.nickName
                                        ? user.nickName.charAt(0)
                                        : "?"
                                    }
                                    size="md"
                                  />
                                  <div className="flex flex-col flex-grow">
                                    <span className="text-sm font-bold">
                                      {user.username.replace(
                                        /[^a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\s]/g,
                                        ""
                                      )}
                                    </span>
                                    <p className="text-sm text-slate-600">
                                      {user.name || user.nickName || "-"}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-center ml-auto gap-1">
                                    <Chip
                                      size="sm"
                                      color={
                                        user.roleName === "CRM"
                                          ? "success"
                                          : "warning"
                                      }
                                      variant="flat"
                                    >
                                      {user.roleName}
                                    </Chip>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </Select>
                        ) : (
                          <div>
                            {" "}
                            {users
                              .filter(
                                (user) =>
                                  user.username === Array.from(selectedUser)[0]
                              )
                              .map((user) => (
                                <div
                                  key={user.username}
                                  className="flex items-center gap-3"
                                >
                                  <div className="flex gap-4">
                                    <Chip
                                      size="lg"
                                      variant="shadow"
                                      classNames={{
                                        base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                                        content:
                                          "drop-shadow shadow-black text-white",
                                      }}
                                      avatar={
                                        <Avatar src={user.displayImgUrl} />
                                      }
                                    >
                                      {user.nickName}
                                    </Chip>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex space-x-6">
                      <div>
                        <label className="text-xs block">ล้างการค้นหา</label>
                        <PrimaryButton
                          text="Reset"
                          size="sm"
                          onPress={handleClear}
                          className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                        />
                      </div>
                      {viewTable && (
                        <div className="flex flex-col justify-center items-center gap-2">
                          <label className="text-xs block">Vat 7%</label>
                          <Checkbox
                            onChange={(e) => handleVatChange(e.target.checked)} // Pass the checked value
                            isSelected={vatRate}
                            color="danger"
                            size="lg"
                          ></Checkbox>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  {viewTable ? (
                    <>
                      <div className="flex flex-row items-center mt-4 lg:mt-0 space-x-4">
                        <Tooltip content="กรองคอลัมน์" color="primary">
                          <div>
                            <PrimaryButton
                              text={<FilterIcon />}
                              size="sm"
                              variant="like"
                              onPress={openFilterModal}
                              className="text-black"
                            />
                          </div>
                        </Tooltip>
                        <PrimaryButton
                          text="กลับ"
                          color="danger"
                          onPress={() => setViewTable(false)}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {currentData.accessCheck.haveAny([
                        ACCESS.dashboard.view_manager_sale,
                      ]) && (
                          <PrimaryButton
                            text="ดูแบบตาราง"
                            endContent={<SelectorIcon />}
                            onPress={() => setViewTable(true)}
                          />
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {viewTable ? (
        <Tablesale
          vatRate={vatRate}
          username={username}
          agentId={agentId}
          nickname={nickname}
          startDate={formatDateObject(dateRange.start)}
          endDate={formatDateObject(dateRange.end)}
          selectedPage={selectedPage}
          storedCheckboxes={selectedCheckboxes}
          users={users}
        />
      ) : (
        <Dashboard
          vatRate={vatRate}
          username={username}
          agentId={agentId}
          nickname={nickname}
          startDate={formatDateObject(dateRange.start)}
          endDate={formatDateObject(dateRange.end)}
          selectedUser={selectedUser}
        />
      )}

      <Modal
        backdrop="opaque"
        isOpen={isFilterModalOpen}
        onOpenChange={onFilterModalChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        className="max-w-3xl w-full"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                {"ตั้งค่าการค้นหา"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col space-y-6 ">
                  {/* ยอดทัก Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ยอดทัก
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.newInbox}
                        onChange={() => handleCheckboxSelection("newInbox")}
                      >
                        ยอดทักใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.oldInbox}
                        onChange={() => handleCheckboxSelection("oldInbox")}
                      >
                        ยอดทักเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.totalInbox}
                        onChange={() => handleCheckboxSelection("totalInbox")}
                      >
                        ยอดทักรวม
                      </Checkbox>
                    </div>
                  </div>

                  {/* ยอดขาย Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ยอดขาย
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.SalesNew}
                        onChange={() => handleCheckboxSelection("SalesNew")}
                      >
                        ยอดขายลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.SalesOld}
                        onChange={() => handleCheckboxSelection("SalesOld")}
                      >
                        ยอดขายลูกค้าเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.sales}
                        onChange={() => handleCheckboxSelection("sales")}
                      >
                        ยอดขายรวม
                      </Checkbox>
                    </div>
                  </div>

                  {/* ออเดอร์ Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ออเดอร์
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.newcus}
                        onChange={() => handleCheckboxSelection("newcus")}
                      >
                        ออเดอร์ลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.oldcus}
                        onChange={() => handleCheckboxSelection("oldcus")}
                      >
                        ออเดอร์ลูกค้าเก่า
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.totalOrder}
                        onChange={() => handleCheckboxSelection("totalOrder")}
                      >
                        ออเดอร์รวม
                      </Checkbox>
                    </div>
                  </div>

                  {/* ค่า Ads Section */}
                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      ค่า Ads
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.totalAdsAmount}
                        onChange={() =>
                          handleCheckboxSelection("totalAdsAmount")
                        }
                      >
                        ค่า Ads
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.PercentAdsNew}
                        onChange={() =>
                          handleCheckboxSelection("PercentAdsNew")
                        }
                      >
                        % Ads ลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.PercentAdsSale}
                        onChange={() =>
                          handleCheckboxSelection("PercentAdsSale")
                        }
                      >
                        % Ads Admin
                      </Checkbox>
                    </div>
                  </div>

                  {/* การปิดการขาย Section */}

                  <div>
                    <label className="block mb-2 text-base font-semibold">
                      การปิดการขาย
                    </label>
                    <div className="flex space-x-4">
                      <Checkbox
                        isSelected={selectedCheckboxes.closeNew}
                        onChange={() => handleCheckboxSelection("closeNew")}
                      >
                        % ปิดการขายลูกค้าใหม่
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedCheckboxes.closeTotal}
                        onChange={() => handleCheckboxSelection("closeTotal")}
                      >
                        % ปิดการขายรวม
                      </Checkbox>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <PrimaryButton
                  onPress={() => {
                    onClose();
                  }}
                  text="ปิด"
                  variant="light"
                  className="text-black hover:bg-custom-redlogin hover:text-white"
                  size={"sm"}
                  color="error"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

export default DashBoardSale;
