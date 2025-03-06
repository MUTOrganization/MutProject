import React, { useState, useEffect } from "react";
import {
  Input,
  DatePicker,
  Select,
  SelectItem,
  Tooltip,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  useDisclosure,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Spinner,
} from "@nextui-org/react";
import { parseDate, today } from "@internationalized/date";
import {
  formatDateThai,
  formatDateObject,
} from "../../../../component/DateUtiils";
import { DeleteIcon, EditIcon, PlusIcon } from "../../../../component/Icons";
import {
  ConfirmCancelButtons,
  PrimaryButton,
} from "../../../../component/Buttons";
import { toastSuccess, toastError } from "../../../../component/Alert";
import { useAppContext } from "../../../../contexts/AppContext";
import fetchProtectedData from "../../../../../utils/fetchData";
import { URLS } from "@/config";

const FormInputAds = ({
  agentId,
  nickname,
  username,
  onSubmitSuccess,
  platformOptions,
  pageData,
  /** เพิ่ม props สองตัวนี้เข้ามา */
  isOpen,
  onOpenChange,
}) => {
  const yesterday = today().subtract({ days: 1 });
  const [selectedDate, setSelectedDate] = useState(yesterday);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // จัดการ state สำหรับรายการที่กำลังกรอก
  const [entries, setEntries] = useState([
    {
      date: formatDateObject(selectedDate),
      platform: "",
      selectedOption: "",
      teamAdsOrAgency: "",
      name: "",
      username: "",
      pageCode: "",
      department: "",
      roleName: "",
      values: [""],
      checked: false,
    },
  ]);

  // จัดการ state สำหรับรายการที่ผ่านการ "ตรวจสอบ" (checked)
  const [checkedEntries, setCheckedEntries] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const [canSubmit, setCanSubmit] = useState(false);



  
  useEffect(() => {
    setCanSubmit(checkedEntries.length > 0);
  }, [checkedEntries]);

  // ฟิลเตอร์ Page ตาม Platform
  const filteredPages = pageData.filter((p) =>
    selectedPlatform ? p.platform === selectedPlatform : true
  );

  // -------------------- Handlers --------------------
  const handleEntryChange = (index, field, value, valueIndex) => {
    const newEntries = [...entries];

    if (field === "values") {
      newEntries[index].values[valueIndex] = value;
    } else if (field === "date") {
      setSelectedDate(value);
      newEntries[index].date = formatDateObject(value);
    } else if (field === "platform") {
      // เปลี่ยน platform -> เคลียร์เพจ
      setSelectedPlatform(value);
      newEntries[index].platform = value;
      newEntries[index].selectedOption = "";
      setSelectedOption([]);
      // เคลียร์ fields อื่น
      newEntries[index].teamAdsOrAgency = "";
      newEntries[index].name = "";
      newEntries[index].username = "";
      newEntries[index].pageCode = "";
    } else if (field === "selectedOption") {
      const selectedVal = Array.from(value)[0];
      newEntries[index].selectedOption = selectedVal;
      setSelectedOption(value);

      // หา page ที่เลือก
      const found = filteredPages.find(
        (fp) => fp.pageCode === selectedVal || fp.name === selectedVal
      );
      if (found) {
        newEntries[index].teamAdsOrAgency =
          found.agencyAds === "noAgency" ? found.teamAds : found.agencyAds;
        newEntries[index].name = found.name;
        newEntries[index].pageCode = found.pageCode || found.name;
        newEntries[index].username = found.username;
        newEntries[index].department = found.department;
        newEntries[index].roleName = found.roleName;
      } else {
        newEntries[index].teamAdsOrAgency = "";
        newEntries[index].name = "";
        newEntries[index].username = "";
        newEntries[index].pageCode = "";
      }
    } else {
      // field ทั่วไป
      newEntries[index][field] = value;
    }
    setEntries(newEntries);
  };

  const handleAddValue = (index) => {
    const copy = [...entries];
    copy[index].values.push("");
    setEntries(copy);
  };

  const handleRemoveValue = (entryIndex, valueIndex) => {
    const copy = [...entries];
    copy[entryIndex].values.splice(valueIndex, 1);
    setEntries(copy);
  };

  // ตรวจสอบรายการก่อน "ย้าย" ไปอยู่ใน checkedEntries
  const handleCheckData = (index) => {
    const e = entries[index];
    if (
      !e.date ||
      !e.platform ||
      !e.selectedOption ||
      e.values.some((val) => val === "" || isNaN(val))
    ) {
      toastError("กรุณากรอกข้อมูลให้ครบทุกช่องและใส่ตัวเลขที่ถูกต้อง");
      return;
    }

    // ถ้าเป็นโหมดแก้ไข
    if (editIndex !== null) {
      const newChecked = [...checkedEntries];
      newChecked[editIndex] = { ...e, checked: true };
      setCheckedEntries(newChecked);
      setEditIndex(null);
      setIsEditing(false);
    } else {
      // เพิ่มรายการใหม่
      setCheckedEntries([...checkedEntries, { ...e, checked: true }]);
    }
    setSelectedDate(yesterday);
    resetEntryForm(); // เคลียร์ form
    toastSuccess("ข้อมูลตรวจสอบแล้ว!");
  };

  // ดึงข้อมูลจาก checkedEntries มาแก้
  const handleEditEntry = (idx) => {
    setEditIndex(idx);
    setIsEditing(true);

    const toEdit = checkedEntries[idx];
    setSelectedDate(parseDate(toEdit.date));

    // เคลียร์ฟอร์มเหลือ 1 รายการ
    setEntries([{ ...toEdit }]);
    setSelectedPlatform(toEdit.platform);
    setSelectedOption([toEdit.selectedOption]);
  };

  const handleDeleteCheckedEntry = (idx) => {
    const newArr = checkedEntries.filter((_, i) => i !== idx);
    setCheckedEntries(newArr);
    setCanSubmit(newArr.length > 0);
    toastSuccess("ลบข้อมูลสำเร็จ");
  };

  // Submit -> เรียก API
  const handleSubmit = async () => {
    try {
      const formattedEntries = checkedEntries.map((entry) => ({
        date_time: entry.date,
        page: entry.name,
        platform: entry.platform,
        teamAds: entry.teamAdsOrAgency,
        department: entry.department,
        roleName: entry.roleName,
        username: entry.username,
        CODE: entry.selectedOption,
        ads: entry.values.reduce(
          (sum, v) => sum + parseFloat(parseFloat(v).toFixed(2)),
          0
        ),
        businessId: agentId,
      }));

      const res = await fetchProtectedData.post(
        `${URLS.ADSFORM}/insertAds`,
        formattedEntries
      );

      if (res.status === 200) {
        toastSuccess("บันทึกข้อมูลสำเร็จ");
        setCheckedEntries([]);

        // ถ้า parent ส่ง onSubmitSuccess มา ให้เรียก
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        // ปิด Modal หลัก
        onOpenChange(false);
      } else {
        toastError("บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (err) {
      toastError("บันทึกข้อมูลไม่สำเร็จ");
    }
  };

  const resetEntryForm = () => {
    setEntries([
      {
        date: formatDateObject(selectedDate),
        platform: "",
        selectedOption: "",
        teamAdsOrAgency: "",
        name: "",
        username: "",
        pageCode: "",
        department: "",
        roleName: "",
        values: [""],
        checked: false,
      },
    ]);
    setSelectedPlatform("");
    setSelectedOption([]);
    setCanSubmit(checkedEntries.length > 0);
  };

  return (
    // Modal หลัก ที่จะเปิด/ปิด จาก TabsAdsNextGen
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
    >
      <ModalContent>
        <ModalBody>
          <div className="h-[600px] max-h-[600px] flex flex-col gap-4 overflow-hidden">
            <div className="px-4 pt-2">
              <h2 className="text-lg md:text-xl font-semibold">
                {isEditing ? "แก้ไขค่าแอดของ" : "กรอกค่าแอดใหม่"}
              </h2>
              {isEditing && (
                <p className="text-sm text-gray-600 mt-1">
                  {entries[editIndex]?.name || ""}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 px-4 pb-2">
              {/* ฟอร์ม */}
              <Card
                radius="sm"
                shadow="none"
                className="flex-[1_1_0%] lg:max-w-[400px] overflow-y-auto p-4"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {entries.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className="border-b mb-3 pb-3 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Date + Platform */}
                      <div className="flex flex-col gap-3">
                        <DatePicker
                          label="เลือกวันที่"
                          value={selectedDate}
                          onChange={(date) =>
                            handleEntryChange(entryIndex, "date", date)
                          }
                        />
                        <Select
                          label="เลือกช่องทาง"
                          placeholder="เลือกช่องทาง"
                          onSelectionChange={(keys) => {
                            const val = Array.from(keys)[0] || "";
                            handleEntryChange(entryIndex, "platform", val);
                          }}
                          selectedKeys={
                            selectedPlatform
                              ? new Set([selectedPlatform])
                              : new Set([])
                          }
                          items={platformOptions}
                        >
                          {platformOptions.map((pf) => (
                            <SelectItem key={pf.platform} value={pf.platform}>
                              {pf.platform}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      {/* Select Page + ชื่อ */}
                      <div className="flex flex-col gap-3">
                        <Select
                          label="เลือกชื่อช่องทางการขาย"
                          placeholder="เลือกเพจ"
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0];
                            const selectedPage = pageData.find(
                              (p) => (p.pageCode || p.name) === selectedKey
                            );
                            // เก็บค่าใน entries
                            handleEntryChange(
                              entryIndex,
                              "selectedOption",
                              keys
                            );
                            handleEntryChange(
                              entryIndex,
                              "teamAdsOrAgency",
                              selectedPage?.teamAds ||
                                selectedPage?.username ||
                                ""
                            );
                          }}
                          selectedKeys={new Set(selectedOption)}
                          isDisabled={!selectedPlatform}
                        >
                          {pageData
                            .filter((p) => p.platform === selectedPlatform)
                            .map((p) => (
                              <SelectItem
                                key={p.pageCode || p.name}
                                value={p.pageCode || p.name}
                              >
                                {p.pageCode || p.name}
                              </SelectItem>
                            ))}
                        </Select>
                        <Input
                          label="ชื่อ"
                          value={entry.teamAdsOrAgency}
                          isReadOnly
                        />
                      </div>
                    </div>

                    {/* values */}
                    <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                      {entry.values.map((val, idxVal) => (
                        <div key={idxVal} className="flex items-start gap-2">
                          <Input
                            isRequired
                            type="number"
                            label="Amount"
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-sm">
                                  ฿
                                </span>
                              </div>
                            }
                            value={val}
                            onChange={(e) =>
                              handleEntryChange(
                                entryIndex,
                                "values",
                                e.target.value,
                                idxVal
                              )
                            }
                          />
                          <div className="flex items-center gap-1 mt-5">
                            {entry.values.length > 1 && (
                              <Tooltip color="danger" content="ลบรายการ">
                                <span
                                  className="text-lg text-danger cursor-pointer"
                                  onClick={() =>
                                    handleRemoveValue(entryIndex, idxVal)
                                  }
                                >
                                  <DeleteIcon />
                                </span>
                              </Tooltip>
                            )}
                            {idxVal === entry.values.length - 1 && (
                              <Tooltip
                                color="success"
                                content="เพิ่มรายการค่าแอด"
                              >
                                <span
                                  className="text-lg text-success cursor-pointer"
                                  onClick={() => handleAddValue(entryIndex)}
                                >
                                  <PlusIcon />
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <PrimaryButton
                        onPress={() => handleCheckData(entryIndex)}
                        text={editIndex !== null ? "บันทึกการแก้ไข" : "บันทึก"}
                        size="sm"
                        className="text-white"
                        color="success"
                      />
                    </div>
                  </div>
                ))}
              </Card>

              {/* ตาราง */}
              <div
                className="flex-[1_1_0%] overflow-y-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-semibold">ข้อมูลที่บันทึก</p>
                  <p>จำนวน {checkedEntries.length} ข้อมูล</p>
                </div>
                <Table
                  aria-label="Checked Entries Table"
                  bordered
                  shadow={false}
                  removeWrapper
                  css={{ height: "auto", minWidth: "100%" }}
                >
                  <TableHeader>
                    <TableColumn>ชื่อ</TableColumn>
                    <TableColumn className="text-center">วันที่</TableColumn>
                    <TableColumn className="text-center">
                      ชื่อช่องทาง
                    </TableColumn>
                    <TableColumn className="text-center">
                      ชื่อผู้ดูแล
                    </TableColumn>
                    <TableColumn className="text-center">รวม</TableColumn>
                    <TableColumn className="text-center">จัดการ</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {checkedEntries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Badge
                            color="primary"
                            variant="flat"
                            css={{ fontSize: "1rem" }}
                          >
                            {entry.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDateThai(entry.date)}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.selectedOption}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.teamAdsOrAgency}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.values.reduce(
                            (sum, v) => sum + parseFloat(v),
                            0
                          )}
                        </TableCell>
                        <TableCell className="flex justify-center space-x-2">
                          <Tooltip color="warning" content="แก้ไข">
                            <span
                              className="text-lg text-warning cursor-pointer"
                              onClick={() => handleEditEntry(idx)}
                            >
                              <EditIcon />
                            </span>
                          </Tooltip>
                          <Tooltip color="danger" content="ลบข้อมูล">
                            <span
                              className="text-lg text-danger cursor-pointer"
                              onClick={() => handleDeleteCheckedEntry(idx)}
                            >
                              <DeleteIcon />
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* ปุ่ม Submit */}
            <div className="px-4 pb-4 flex justify-end">
              <PrimaryButton
                onPress={handleSubmit}
                isDisabled={!canSubmit}
                text="เพิ่มค่าแอด"
                className="text-white"
                color="success"
                size="md"
              />
            </div>

          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormInputAds;
