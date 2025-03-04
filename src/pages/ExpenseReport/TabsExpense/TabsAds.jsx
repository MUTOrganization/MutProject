import React, { useState, useEffect, useMemo } from "react";
import FormInputAds from "../components/Ads/FormInputAds";
import {
  Card,
  Checkbox,
  DateRangePicker,
  DatePicker,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { PrimaryButton } from "../../../component/Buttons";
import { startOfMonth, endOfMonth, today } from "@internationalized/date";
import {
  formatDateObject,
  formatDateRange,
} from "../../../component/DateUtiils";
import { ACCESS } from "../../../configs/access";
import { URLS } from "../../../config";
import { useAppContext } from "../../../contexts/AppContext";
import fetchProtectedData from "../../../../utils/fetchData";
import { PlusIcon } from "../../../component/Icons";
import { Toaster, toast } from "sonner";
import {
  toastSuccess,
  toastWarning,
  toastError,
} from "../../../component/Alert";
import {
  convertToThaiTimeFetch,
  formatDateThai,
} from "../../../component/DateUtiils";
import { calculateVAT } from "../../../component/Calculate";
import { EditIcon, DeleteIcon } from "../../../component/Icons";
import { ConfirmCancelButtons } from "../../../component/Buttons";
import { formatDateThaiAndTime } from "../../../component/DateUtiils";
import DateSelector from "../../../component/DateSelector";

const getUniqueUsernames = (data, key) => {
  return Array.from(new Set(data.map((item) => item[key]))).sort();
};

const getFilteredData = (
  data,
  selectedPlatform,
  selectedUser,
  selectedPage
) => {
  let filtered = data;

  // กรองข้อมูลตามแพลตฟอร์ม
  if (selectedPlatform.length > 0) {
    filtered = filtered.filter((item) =>
      selectedPlatform.includes(item.platform)
    );
  }

  // กรองข้อมูลตามเพจ
  if (selectedPage.length > 0) {
    filtered = filtered.filter(
      (item) =>
        selectedPage.includes(item.code) ||
        selectedPage.includes(item.saleChannelName)
    );
  }

  // กรองข้อมูลตามผู้ใช้
  if (selectedUser.length > 0) {
    filtered = filtered.filter((item) => selectedUser.includes(item.teamAds));
  }

  return filtered;
};

function TabsAds() {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataAds, setDataAds] = useState([]);
  const [dataSale, setDataSale] = useState([]);

  const [vatRate, setVatRate] = useState(false);
  const { currentUser } = useAppContext();
  const agentId = currentUser?.businessId;
  const username = currentUser?.userName;
  const nickname = currentUser?.nickname;

  const [dateRange, setDateRange] = useState({
    start: startOfMonth(today()),
    end: endOfMonth(today()),
  });
  const teamAdsValue =
    currentUser.role !== "Staff" ? "all" : nickname || username;

  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedPage, setSelectedPage] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [selectededit, setSelectededit] = useState(null);

  const [isAdd, setIsAdd] = useState(false);

  const {
    isOpen: isModalDeletUser,
    onOpen: onOpenModalDeletUser,
    onOpenChange: onOpenChangeModalDeletUser,
  } = useDisclosure();

  const {
    isOpen: isModalSetUser,
    onOpen: onOpenModalSetUser,
    onOpenChange: onOpenChangeModalSetUser,
  } = useDisclosure();

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === 0) return 0;
    const number = Number(amount);
    const formattedNumber = number
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `฿${formattedNumber}`;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let saleUrl = `${URLS.ADSFORM}/totalSaleAds`;
      let adsUrl = `${URLS.ADSFORM}/getAds`;

      const [saleResponse, adsResponse] = await Promise.all([
        fetchProtectedData.post(saleUrl, {
          agent: agentId,
          startDate: formatDateObject(dateRange.start),
          endDate: formatDateObject(dateRange.end),
          teamAds: teamAdsValue,
        }),
        fetchProtectedData.post(adsUrl, {
          teamAds: teamAdsValue,
          businessId: agentId,
          startDate: formatDateObject(dateRange.start),
          endDate: formatDateObject(dateRange.end),
        }),
      ]);

      setDataSale(saleResponse.data);

      const adsResult = adsResponse.data.map((ads) => ({
        ...ads,
        date_time: convertToThaiTimeFetch(ads.date_time),
      }));
      // Sort the ads result (if needed)
      const sortedAdsResult = adsResult.sort(
        (a, b) => new Date(a.date_time) - new Date(b.date_time)
      );
      setDataAds(sortedAdsResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Reset loading state after both requests finish
    }
  };

  const handleClear = () => {
    setSelectedUser([]);
    setSelectedPlatform([]);
    setSelectedPage([]);
  };
  useEffect(() => {
    fetchData();
  }, [agentId, dateRange, isAdd]);

  const handleVatChange = (isChecked) => {
    setVatRate(isChecked);
  };

  const column = [
    { name: "วันที่", uid: "date_time" },
    { name: "เพจ", uid: "code" },
    { name: "แพลตฟอร์ม", uid: "platform" },
    { name: "ชื่อผู้ใช้", uid: "teamAds" },
    { name: "ค่าแอด", uid: "ads" },
    { name: "เวลาที่สร้าง", uid: "created_at" },
    { name: "จัดการ", uid: "actions" },
  ];

  const handleUpdateUser = async () => {
    if (selectededit) {
      try {
        // Ensure that the ads value has only one decimal place
        const formattedAds = parseFloat(selectededit.ads).toFixed(2);

        await fetchProtectedData.put(
          `${URLS.ADSFORM}/updateAds/${selectededit.id}`,
          {
            ads: formattedAds,
            businessId: agentId,
          }
        );
        fetchData();
        setSelectededit([]);
        onOpenChangeModalSetUser(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("Event has not been created");
      }
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (selectedId) {
      await handleDeleteUser(selectedId.id);
      onOpenChangeModalDeletUser(false); // ปิด Modal หลังจากลบเสร็จ
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetchProtectedData.delete(`${URLS.ADSFORM}/deleteAds/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      toastError("ลบไม่สำเร็จ");
    } finally {
      toastSuccess("ลบสำเร็จ");
    }
  };

  const uniquePlatform = useMemo(() => {
    // ถ้าไม่มีการเลือกแพลตฟอร์ม ให้ใช้ข้อมูลทั้งหมด
    const filteredDataByPlatform =
      selectedPlatform.length > 0
        ? dataAds.filter((item) => selectedPlatform.includes(item.platform))
        : dataAds;

    // ดึงเฉพาะแพลตฟอร์มที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPlatform, "platform");
  }, [dataAds, selectedPlatform]);

  const uniqueUsername = useMemo(() => {
    const filteredDataByPage =
      selectedPage.length > 0
        ? dataAds.filter((item) => selectedPage.includes(item.code))
        : dataAds;

    return getUniqueUsernames(filteredDataByPage, "teamAds");
  }, [dataAds, selectedPage]);

  const uniquePage = useMemo(() => {
    // กรองข้อมูลตามแพลตฟอร์มและผู้ใช้ ถ้ามีการเลือก
    const filteredDataByPage =
      selectedPlatform.length > 0 || selectedUser.length > 0
        ? dataAds.filter((item) => {
            const matchesPlatform =
              selectedPlatform.length > 0
                ? selectedPlatform.includes(item.platform)
                : true;
            const matchesUser =
              selectedUser.length > 0
                ? selectedUser.includes(item.teamAds)
                : true;
            return matchesPlatform && matchesUser;
          })
        : dataAds;

    // ดึงเฉพาะเพจที่ไม่ซ้ำ
    return getUniqueUsernames(filteredDataByPage, "code");
  }, [dataAds, selectedPlatform, selectedUser]);

  const filteredData = useMemo(() => {
    const vat = vatRate ? 7 : 0;

    return getFilteredData(
      dataAds,
      selectedPlatform,
      selectedUser,
      selectedPage
    ).map((item) => ({
      ...item,
      adsWithVat: calculateVAT(parseFloat(item.ads || 0), vat),
    }));
  }, [dataAds, selectedPlatform, selectedUser, vatRate, selectedPage]);

  const filteredSale = useMemo(
    () =>
      getFilteredData(dataSale, selectedPlatform, selectedUser, selectedPage),
    [dataSale, selectedPlatform, selectedUser, selectedPage]
  );

  const vat = vatRate ? 7 : 0;

  const totalAds = useMemo(
    () => filteredData.reduce((total, item) => total + item.adsWithVat, 0),
    [filteredData]
  );

  const totalSale = filteredSale.reduce(
    (total, item) => total + parseFloat(item.admin || 0),
    0
  );

  const totalUpsale = filteredSale.reduce(
    (total, item) => total + parseFloat(item.upsale || 0),
    0
  );

  const totalSalesNew = filteredSale.reduce(
    (total, item) => total + parseFloat(item.SalesNew || 0),
    0
  );

  const totalPercentAds =
    parseFloat(totalUpsale || totalSale) > 0
      ? (parseFloat(totalAds || 0) /
          (parseFloat(totalSale || 0) + parseFloat(totalUpsale || 0) || 1)) *
        100
      : 0;

  const totalPercentAdsSale =
    parseFloat(totalSale) > 0
      ? (parseFloat(totalAds || 0) / (parseFloat(totalSale || 0) || 1)) * 100
      : 0;

  const totalPercentAdsNew =
    parseFloat(totalSalesNew) > 0
      ? (parseFloat(totalAds || 0) / parseFloat(totalSalesNew)) * 100
      : 0;

  const renderCell = (item, columnKey) => {
    const formattedValue = (value) =>
      value ? new Intl.NumberFormat().format(value) : "0";

    const costAds = calculateVAT(item.ads || 0, vat);

    switch (columnKey) {
      case "date_time":
        return formatDateThai(item[columnKey]);
      case "code":
        return item.code || item.page;
      case "platform":
        return item[columnKey];
      case "teamAds":
        return item[columnKey];
      case "ads":
        return `฿${formattedValue(costAds.toFixed(2))}`;
      case "created_at":
        return formatDateThaiAndTime(item[columnKey]);

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip
              content="Edit user"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  onOpenModalSetUser();
                  setSelectededit(item);
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content="Delete user"
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  onOpenModalDeletUser();
                  setSelectedId(item);
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  // console.log("filteredUniqueUsernames", filteredUniqueUsernames);

  // console.log("Ads", uniquePlatform);
  // console.log("Ads", filteredData);
  // console.log("Sale", filteredSale);
  // console.log(selectedPlatform);
  // console.log("selectedUser", selectedUser);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      } else {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  return (
    <div className="flex justify-center items-center max-h-screen w-full">
      <div className="flex flex-col w-full gap-4">
        <div className="flex lg:justify-between justify-center">
          {isAdd ? (
            <div className="flex flex-col lg:flex-row items-center gap-4 p-3">
              {" "}
            </div>
          ) : (
            <div className="flex flex-col  sm:flex-row sm:space-x-4  space-y-4 sm:space-y-0 lg:items-center w-64 lg:w-full  md:w-full">
              <DateSelector
                value={dateRange}
                onChange={(value) => setDateRange(value)}
              />

              {/* Reset Button Section */}
              <div className="flex flex-col-2 space-x-3 items-center">
                <div className="flex flex-col lg:flex-row gap-3">
                  <Select
                    label="แพลตฟอร์ม"
                    placeholder="ทั้งหมด"
                    variant="bordered"
                    className="w-64"
                    onSelectionChange={(keys) =>
                      setSelectedPlatform(Array.from(keys))
                    }
                    selectedKeys={new Set(selectedPlatform)}
                    selectionMode="multiple"
                    disallowEmptySelection={false} // Allow deselection to filter all
                  >
                    {uniquePlatform.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    label="เพจ"
                    placeholder="ทั้งหมด"
                    variant="bordered"
                    className="w-64"
                    onSelectionChange={(keys) =>
                      setSelectedPage(Array.from(keys))
                    }
                    selectedKeys={new Set(selectedPage)}
                    selectionMode="multiple"
                    disallowEmptySelection={false} // Allow deselection to filter all
                  >
                    {uniquePage.map((page) => (
                      <SelectItem key={page} value={page}>
                        {page}
                      </SelectItem>
                    ))}
                  </Select>

                  {teamAdsValue === "all" && (
                    <div>
                      <div>
                        <Select
                          label="ผู้บันทึกค่าแอด"
                          placeholder="ทั้งหมด"
                          variant="bordered"
                          className="w-64"
                          onSelectionChange={(keys) =>
                            setSelectedUser(Array.from(keys))
                          }
                          selectedKeys={new Set(selectedUser)}
                          selectionMode="multiple"
                          disallowEmptySelection={false} // Allow deselection to filter all
                        >
                          {uniqueUsername.map((teamAds) => (
                            <SelectItem key={teamAds} value={teamAds}>
                              {teamAds}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex lg:flex-row md:flex-col lg:space-x-6 gap-2 justify-center">
                <div>
                  <label className="text-xs block">ล้างการค้นหา</label>
                  <PrimaryButton
                    text="Reset"
                    size="sm"
                    onPress={handleClear}
                    className="text-black hover:bg-custom-redlogin hover:text-white bg-gray-100"
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <label className="text-xs block">Vat 7%</label>
                  <Checkbox
                    onChange={(e) => handleVatChange(e.target.checked)} // Pass the checked value
                    isSelected={vatRate}
                    color="danger"
                    size="lg"
                  ></Checkbox>
                </div>
              </div>
            </div>
          )}

          {isAdd ? (
            <div className="hidden lg:flex flex-col lg:flex-row items-center gap-4 p-3 ">
              <PrimaryButton
                text="กลับ"
                size="md"
                onPress={() => setIsAdd(false)}
                className=" bg-custom-redlogin text-white "
                radius="md"
              />
            </div>
          ) : (
            <div className="hidden lg:flex flex-col lg:flex-row items-center gap-4 p-3 ">
              <PrimaryButton
                endContent={<PlusIcon />}
                text="เพิ่มค่าแอด"
                size="md"
                onPress={() => setIsAdd(true)}
                className="bg-green-600 text-white "
                radius="md"
              />
            </div>
          )}
        </div>
        {isAdd ? (
          <section>
            <FormInputAds
              username={username}
              agentId={agentId}
              nickname={nickname}
            />
          </section>
        ) : (
          <section>
            <div className="flex flex-col-2 w-full gap-4">
              <section className="lg:grid lg:grid-cols-1 gap-3 w-full transition-all duration-500">
                <div className="flex lg:flex-row md:flex-row gap-6 px-6 py-3 flex-col">
                  {/* Total Amount */}
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-slate-500 text-sm">ยอดรวม</span>
                    <span className="text-2xl">
                      {isLoading ? (
                        <Spinner
                          color="primary"
                          className="mx-auto"
                          size="sm"
                        />
                      ) : (
                        <p>{formatCurrency(totalAds) || 0}</p>
                      )}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block border-l border-gray-300 h-12"></div>

                  {/* % ADS ลูกค้าใหม่ */}
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-slate-500 text-sm">
                      % ADS ลูกค้าใหม่
                    </span>
                    <span className="text-2xl">
                      {isLoading ? (
                        <Spinner
                          color="primary"
                          className="mx-auto"
                          size="sm"
                        />
                      ) : (
                        <p>
                          {totalPercentAdsNew > 0
                            ? `${totalPercentAdsNew.toFixed(2)} %`
                            : "ไม่มียอดขาย"}
                        </p>
                      )}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block border-l border-gray-300 h-12"></div>

                  {/* % ADS รวม */}
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-slate-500 text-sm">% ADS รวม</span>
                    <span className="text-2xl">
                      {isLoading ? (
                        <Spinner
                          color="primary"
                          className="mx-auto"
                          size="sm"
                        />
                      ) : (
                        <p>
                          {totalPercentAds > 0
                            ? `${totalPercentAds.toFixed(2)} %`
                            : "ไม่มียอดขาย"}
                        </p>
                      )}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block border-l border-gray-300 h-12"></div>

                  {/* % ADS เซลล์ */}
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-slate-500 text-sm">% ADS เซลล์</span>
                    <span className="text-2xl">
                      {isLoading ? (
                        <Spinner
                          color="primary"
                          className="mx-auto"
                          size="sm"
                        />
                      ) : (
                        <p>
                          {totalPercentAdsSale > 0
                            ? `${totalPercentAdsSale.toFixed(2)} %`
                            : "ไม่มียอดขาย"}
                        </p>
                      )}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="hidden lg:block border-l border-gray-300 h-12"></div>

                  {/* Total Items */}
                  <div className="flex flex-col items-center lg:items-start text-sm">
                    <span className="text-slate-500">จำนวนรายการ</span>
                    <span className="text-2xl">
                      {isLoading ? (
                        <Spinner
                          color="primary"
                          className="mx-auto"
                          size="sm"
                        />
                      ) : (
                        filteredData.length
                      )}
                    </span>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto hidden lg:block md:block">
                  <Table
                    color="primary"
                    aria-label="Employee list with custom cells"
                    className="w-full"
                    isHeaderSticky
                    removeWrapper
                    allowsSorting
                  >
                    <TableHeader columns={column}>
                      {(column) => (
                        <TableColumn
                          key={column.uid}
                          onPress={
                            () =>
                              column.uid !== "actions" && handleSort(column.uid) // ป้องกันการ Sort คอลัมน์จัดการ
                          }
                          className={
                            column.uid !== "actions" ? "cursor-pointer" : ""
                          }
                        >
                          {column.name}
                          {sortConfig.key === column.uid &&
                            column.uid !== "actions" && (
                              <span className="ml-2">
                                {sortConfig.direction === "ascending"
                                  ? "⬆"
                                  : "⬇"}
                              </span>
                            )}
                        </TableColumn>
                      )}
                    </TableHeader>

                    <TableBody
                      items={sortedData} // ใช้ข้อมูลที่ผ่านการ Sort
                      emptyContent={"ยังไม่มีข้อมูล"}
                      loadingState={isLoading ? "loading" : undefined}
                      loadingContent={<Spinner color="primary" />}
                    >
                      {(item) => (
                        <TableRow key={item.id}>
                          {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Modal สำหรับแก้ไขผู้ใช้ */}
              <Modal
                isOpen={isModalSetUser}
                onOpenChange={onOpenChangeModalSetUser}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>
                        <h3>Edit User</h3>
                      </ModalHeader>
                      <ModalBody>
                        <Input
                          isReadOnly
                          label="วันที่"
                          value={
                            selectededit
                              ? formatDateThai(selectededit.date_time)
                              : ""
                          }
                          onChange={(e) =>
                            setSelectededit({
                              ...selectededit,
                              date_time: e.target.value,
                            })
                          }
                        />
                        <Input
                          isReadOnly
                          label="ชื่อ"
                          value={selectededit ? selectededit.teamAds : ""}
                          onChange={(e) =>
                            setSelectededit({
                              ...selectededit,
                              teamAds: e.target.value,
                            })
                          }
                        />
                        <Input
                          isReadOnly
                          label="รหัสเพจ"
                          value={selectededit ? selectededit.code : ""}
                          onChange={(e) =>
                            setSelectededit({
                              ...selectededit,
                              code: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="number"
                          label="ค่าแอด"
                          isRequired
                          placeholder="ค่าแอดของบัญชี"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                ฿
                              </span>
                            </div>
                          }
                          value={selectededit ? selectededit.ads : ""}
                          onChange={(e) =>
                            setSelectededit({
                              ...selectededit,
                              ads: e.target.value,
                            })
                          }
                        />
                      </ModalBody>
                      <ModalFooter>
                        <ConfirmCancelButtons
                          onConfirm={handleUpdateUser}
                          onCancel={onClose}
                          confirmText={"ยืนยัน"}
                          cancelText={"ยกเลิก"}
                          size={"sm"}
                        />
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>

              <Modal
                isOpen={isModalDeletUser}
                onOpenChange={onOpenChangeModalDeletUser}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader>
                        <h3>ลบค่าแอดแพลตฟอร์ม {selectedId.platform}</h3>
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col gap-2">
                          <p className="text-gray-700 text-base leading-relaxed">
                            ต้องการลบค่าแอดเพจ{" "}
                            <span className="font-semibold text-gray-900">
                              {selectedId.code || selectedId.page}
                            </span>{" "}
                            วันที่{" "}
                            <span className="font-semibold text-gray-900">
                              {formatDateThai(selectedId.date_time)}
                            </span>{" "}
                            นี้หรือไม่
                          </p>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <ConfirmCancelButtons
                          onConfirm={handleConfirmDeleteUser}
                          onCancel={onClose}
                          confirmText={"ยืนยัน"}
                          cancelText={"ยกเลิก"}
                          size={"sm"}
                        />
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Toaster richColors position="top-right" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default TabsAds;
