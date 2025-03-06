import React, { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Input,
  Button,
  Divider,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { toastError, toastSuccess } from "../../../component/Alert";
import { EditIcon, DeleteIcon, CopyIcon } from "../../../component/Icons";
import { URLS } from "../../../config";
import { ConfirmCancelButtons } from "../../../component/Buttons";
import fetchProtectedData from "../../../../utils/fetchData";

const statusColorMap = {
  1: "success",
  0: "danger",
};

import { formatDateThaiAndTime } from "../../../component/DateUtiils";
import { useAppContext } from "../../../contexts/AppContext";
function SetConnect() {
  const [isMetaFacebook, setisMetaFacebook] = useState(false);
  const [isPancake, setisPancake] = useState(false);
  const [isConfig, setisConfig] = useState(false);
  const [isAgent, setisAgent] = useState();
  const [data, setData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const { currentUser } = useAppContext();
  const agentId = currentUser?.businessId;
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedName, setSelectedName] = useState(['all']);
  const [connectionData, setConnectionData] = useState({
    connectionType: "",
    accountName: "",
    accessToken: "",
    status: 1,
    created_by: currentUser.userName,
    updated_by: currentUser.userName,
    businessId: agentId,
  });
console.log(agentId);

  const {
    isOpen: isModalEdit,
    onOpen: onOpenModalEdit,
    onOpenChange: onOpenChangeModalEdit,
  } = useDisclosure();

  const {
    isOpen: isModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  const fetchDataName = async () => {
    try {
      const urlNameAgent = `${URLS.SETTING}/nameAgent/${agentId}`;
      const urlData = `${URLS.SETTING}/getSettingsPlatform/${agentId}`;
      // ใช้ Promise.all เพื่อ fetch ทั้งสองเส้นพร้อมกัน
      const [nameAgentResponse, dataResponse] = await Promise.all([
        fetchProtectedData.get(urlNameAgent),
        fetchProtectedData.get(urlData),
      ]);

      const nameAgentResult = nameAgentResponse.data;
      const dataResult = dataResponse.data;
      setData(dataResult);
      setisAgent(nameAgentResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataName();
  }, []);

  const handleCheckboxChange = (type) => {
    if (type === "pancake") {
      setisPancake((prev) => !prev);
      setConnectionData((prev) => ({
        ...prev,
        connectionType: "Pancake", // อัปเดตการเชื่อมต่อ
      }));
      if (!isPancake) setisMetaFacebook(false);
    } else if (type === "MetaFacebook") {
      setisMetaFacebook((prev) => !prev);
      setConnectionData((prev) => ({
        ...prev,
        connectionType: "MetaFacebook", // อัปเดตการเชื่อมต่อ
      }));
      if (!isMetaFacebook) setisPancake(false);
    }
  };

  const handleAccountNameChange = (value) => {
    setConnectionData((prev) => ({
      ...prev,
      accountName: value, // อัปเดตชื่อบัญชีใน connectionData
    }));
  };

  const handleAccessTokenChange = (value) => {
    setConnectionData((prev) => ({
      ...prev,
      accessToken: value, // อัปเดต Access Token ใน connectionData
    }));
  };

  const handleSubmit = async () => {
    try {
      await fetchProtectedData.post(
        `${URLS.SETTING}/addSettingPlatform`,
        connectionData
      );
      toastSuccess("Setting added successfully!");
      fetchDataName();
      setisConfig(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      toastError("Failed to add setting.");
    }
  };
  const maskToken = (token) => {
    if (!token || token.length < 2) return token; // ตรวจสอบว่ามี token หรือไม่และยาวพอหรือไม่
    const visibleStart = token.slice(0, 2); // แสดงตัวอักษรเริ่มต้น 2 ตัว
    const maskedPart = "*".repeat(3); // แสดงดอกจัน 3 ตัว
    return `${visibleStart}${maskedPart}`; // แสดงผลรวมเป็น 5 ตัว (2 ตัว + 3 ดอกจัน)
  };
  const handleCopyToClipboard = (token) => {
    navigator.clipboard
      .writeText(token)
      .then(() => {
        toastSuccess("คัดลอกสำเร็จ");
      })
      .catch((error) => {
        console.error("Failed to copy token:", error);
      });
  };

  const handleEdit = (page) => {
    setSelected(page);
    onOpenModalEdit();
  };

  const handleConfirmDelete = async () => {
    if (selected) {
      await handleDelete(selected);
      onOpenChangeModalDelete(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchProtectedData.delete(
        `${URLS.SETTING}/deleteSettingPlatform/${id}`
      );
      fetchDataName();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    toastSuccess("ลบสำเร็จ");
  };

  const handleUpdate = async () => {
    if (selected) {
      try {
        await fetchProtectedData.put(
          `${URLS.SETTING}/updateSettingPlatform/${selected.id}`,
          {
            accounts: selected.accounts || "",
            accessToken: selected.accessToken || "",
            status: selected.status ?? 1,
            updated_by: currentUser.userName,
          }
        );
        fetchDataName();
        setSelected(null);
        onOpenChangeModalEdit(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("Event has not been created");
      }
    } else {
      toastError("No item selected for updating.");
    }
  };

  const columns = [
    { name: "เเพลตฟอร์ม", uid: "platform" },
    { name: "ชื่อตัวแทน", uid: "name" },
    { name: "token", uid: "accessToken" },
    { name: "วันที่เริ่มตั้งค่า", uid: "created_at" },
    { name: "วันที่อัพเดต", uid: "updated_at" },
    { name: "บัญชี", uid: "accounts" },
    { name: "STATUS", uid: "status" },
    { name: "จัดการ", uid: "actions" },
  ];

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "platform":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src:
                user.connectionType === "Pancake"
                  ? "https://play-lh.googleusercontent.com/LYu5fhtGgEbeWCNIp1irIqvuM8WgFVzfAbKUkkb2l82CgmFYAGlby-L7lI3fixfbWzQ"
                  : user.connectionType === "MetaFacebook"
                    ? "https://cdn.pixabay.com/photo/2021/12/14/22/29/meta-6871457_1280.png"
                    : "https://play.google.com/store/apps/details?id=vn.pancake.app&hl=en_US", // URL ดีฟอลต์
            }}
            description={user.connectionType}
          >
            {cellValue}
          </User>
        );
      case "created_at":
        return <>{formatDateThaiAndTime(user.created_at)}</>;
      case "updated_at":
        return <>{formatDateThaiAndTime(user.updated_at)}</>;
      case "accessToken":
        return (
          <div className="flex items-center">
            <span>{maskToken(user.accessToken)}</span>{" "}
            {/* แสดง token แบบ mask */}
            <CopyIcon
              onClick={() => handleCopyToClipboard(user.accessToken)}
              style={{ cursor: "pointer", marginLeft: "2px" }} // ปรับระยะห่างให้น้อยลง
            />
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {user.status === 1 ? "Active" : "Inactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
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
                onClick={() => handleEdit(user)} // เรียกใช้ฟังก์ชันแก้ไข
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
                  onOpenModalDelete();
                  setSelected(user.id);
                }}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleSelectionChange = (keys) => {
    setSelectedKeys(new Set(keys));
  };

  const handleUpdateStatus = async (status) => {
    const containsInvalidKeys =
      Array.from(selectedKeys).includes("a") &&
      Array.from(selectedKeys).includes("l");
    const selectedRows = containsInvalidKeys ? "all" : Array.from(selectedKeys);
    try {
      await fetchProtectedData.put(
        `${URLS.SETTING}/updateAllStatusSettingPlatform`,
        {
          status,
          selectedRows,
        }
      );
      if (status === 1) {
        toastSuccess("เปิดการใช้งานเพจ");
      } else {
        toastError("ปิดการใช้งานเพจ");
      }

      fetchDataName();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const uniqueUsername = useMemo(() => {
    const usernameMap = new Map();
    data.forEach((item) => {
      if (!usernameMap.has(item.name)) {
        usernameMap.set(item.name);
      }
    });

    return Array.from(usernameMap.entries()).sort((a) => {
      return a[0];
    });
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedName.includes('all')) {
        return data;
    }

    let filtered = data;

    if (selectedName.length > 0) {
        filtered = filtered.filter((item) => selectedName.includes(item.name));
    }

    return filtered;
}, [data, selectedName]);


  console.log(selectedName);

  return (
    <Card className="flex p-4 shadow-none h-full">
      <CardHeader>
        <div className="flex justify-between items-center text-base font-bold w-full">
          <div className="flex items-center">
            จัดการข้อมูลการดึงข้อมูลจากแพลตฟอร์ม
          </div>

          {isConfig === false && (
            <div className="flex items-center space-x-4">
              {agentId === 1 && <Select
                label="ตัวแทน"
                placeholder="เลือกทั้งหมด"
                size="sm"
                className="w-64"
                onSelectionChange={(keys) => setSelectedName(Array.from(keys))}
                selectedKeys={new Set(selectedName)}
                selectionMode="multiple"
                disallowEmptySelection
              >
                <SelectItem key="all" value="all">
                  {"ทั้งหมด"}
                </SelectItem>
                {uniqueUsername.map(([name]) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </Select>}
              <Button
                color="success"
                variant="ghost"
                className="hover:bg-success hover:text-white"
                onPress={() => handleUpdateStatus(1)} // เปิดใช้งาน
                isDisabled={selectedKeys.size === 0}
                size="sm"
              >
                ใช้งาน
              </Button>
              <Button
                color="danger"
                variant="ghost"
                className="hover:bg-danger hover:text-white"
                onPress={() => handleUpdateStatus(0)} // ปิดใช้งาน
                isDisabled={selectedKeys.size === 0}
                size="sm"
              >
                ปิดใช้งาน
              </Button>
              <Button
                color="success"
                variant="solid"
                className="text-white"
                onPress={() => setisConfig(true)}
                size="sm"
              >
                + เพิ่มการเชื่อมต่อ
              </Button>
            </div>
          )}

          {isConfig === true && (
            <div className="flex items-center">
              <Button
                color="danger"
                variant="solid"
                className="bg-danger text-white"
                onPress={() => setisConfig(false)}
                size="sm"
              >
                กลับ
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {isConfig === false && (
          <div className="flex flex-col gap-4">
            {" "}
            <div className="flex flex-col w-full md:w-auto">
              <h3 className="text-md font-bold mb-2">
                สถานะและประวัติการเชื่อมต่อ
              </h3>
              <Table
                color={"primary"}
                aria-label="Employee list with custom cells"
                className="h-[650px] overflow-y-auto scrollbar-hide"
                isHeaderSticky
                removeWrapper
                selectionMode="multiple"
                onSelectionChange={handleSelectionChange}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredData}>
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
          </div>
        )}
        {isConfig === true && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center md:flex-nowrap gap-8">
              <div className="flex flex-col w-full md:w-auto">
                <h3 className="text-md font-bold mb-2">
                  เลือกรูปแบบการเชื่อมต่อ
                </h3>
                <div className="flex items-center gap-4">
                  <Checkbox
                    color="success"
                    isSelected={isMetaFacebook}
                    onChange={() => handleCheckboxChange("MetaFacebook")}
                    isDisabled
                  >
                    <Tooltip content="I am a tooltip">
                      <span>Meta Facebook</span>
                    </Tooltip>
                  </Checkbox>
                  <Checkbox
                    color="success"
                    isSelected={isPancake}
                    onChange={() => handleCheckboxChange("pancake")}
                  >
                    Pancake
                  </Checkbox>
                </div>
              </div>
            </div>

            {isPancake && (
              <div className="flex flex-col gap-6">
                <Divider className="my-1" />
                {/* พาร์ทเกี่ยวกับบัญชี */}
                <section>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    ข้อมูลบัญชี Pancake ของบริษัท {isAgent}
                  </h3>
                  <div className="flex flex-row gap-4 w-full max-w-md">
                    <Input
                      label="ชื่อบัญชี"
                      variant="bordered"
                      fullWidth
                      className="rounded-md"
                      onChange={(e) => handleAccountNameChange(e.target.value)}
                    />
                    <Input
                      label="Access Token"
                      variant="bordered"
                      fullWidth
                      type="password"
                      className="rounded-md"
                      onChange={(e) => handleAccessTokenChange(e.target.value)}
                    />
                  </div>
                </section>

                <Divider className="my-1" />

                {/* ปุ่มส่งข้อมูลขวาล่าง */}
                <div className="flex justify-end w-full">
                  <Button
                    color="primary"
                    className="rounded-md mt-4"
                    onPress={handleSubmit}
                  >
                    ส่งข้อมูล
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardBody>

      <Modal
        isOpen={isModalEdit}
        onOpenChange={onOpenChangeModalEdit}
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
                  label="account"
                  value={selected ? selected.accounts : ""}
                  isDisabled
                />
                <Input
                  label="accessToken"
                  value={selected ? selected.accessToken : ""}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      accessToken: e.target.value,
                    })
                  }
                />

                <Select
                  label="Status"
                  selectedKeys={selected ? [String(selected.status)] : []}
                  disallowEmptySelection
                  onSelectionChange={(keys) => {
                    const newStatus = parseInt(Array.from(keys).join(""), 10);
                    setSelected({
                      ...selected,
                      status: newStatus,
                    });
                  }}
                >
                  <SelectItem key="1">Active</SelectItem>
                  <SelectItem key="0">Inactive</SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <ConfirmCancelButtons
                  onConfirm={
                    handleUpdate // Save on confirm button click
                  }
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
        isOpen={isModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>คุณต้องการลบผู้ใช้นี้หรือไม่?</h3>
              </ModalHeader>
              <ModalBody>
                <p>การลบนี้จะไม่สามารถยกเลิกได้ คุณแน่ใจหรือไม่?</p>
              </ModalBody>
              <ModalFooter>
                <ConfirmCancelButtons
                  onConfirm={
                    handleConfirmDelete // Save on confirm button click
                  }
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
    </Card>
  );
}

export default SetConnect;
