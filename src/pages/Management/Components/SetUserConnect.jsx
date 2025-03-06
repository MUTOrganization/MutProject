import React, { useState, useEffect ,useMemo} from "react";
import {
  Spinner,
  Card,
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Tabs,
  Tab,
  code,
} from "@nextui-org/react";
import { toastError,toastSuccess } from "../../../component/Alert";
import { URLS } from "../../../config";
import fetchProtectedData from "../../../../utils/fetchData";
import { useAppContext } from "../../../contexts/AppContext";
import {
  EditIcon,
  SettingPermissionIcon,
  DeleteIcon,
  CorrectIcon,
  IncorrectIcon,
} from "../../../component/Icons";
import {
  formatDateThai,
  formatDateThaiAndTime,
} from "../../../component/DateUtiils";
import { ConfirmCancelButtons } from "../../../component/Buttons";

const statusColorMap = {
  1: "success",
  0: "danger",
};

const statusColorPermission = {
  Active: "success",
  Inactive: "danger",
  Unconfigured: "",
};

function SetUserConnect() {
  const [isUserSale, setIsUserSale] = useState([]);
  const [agencySelected, setAgencySelected] = useState(false); // Track agency selection
  const [selectedAgency, setSelectedAgency] = useState([]);
  const [agency, setAgency] = useState(""); // Store user input
  const [selecteddepartment, setSelecteddepartment] = useState("all");
  const [users, setUsers] = useState([]);
  const [usersAds, setUsersAds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", username: "", status: 1 });
  const [newPage, setNewPage] = useState({
    platform: "",
    pageName: "",
    code: "",
    accounts: "",
  });
  const { currentUser } = useAppContext();
  const [userSelect, setUserSelect] = useState([]);

  const agentId = currentUser?.businessId;

  const [department, setDepartment] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPage, setFilteredPage] = useState([]);
  const [filteredPermission, setFilteredPermission] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activateTabs, setActivateTabs] = useState("user");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [agentName, setagentName] = useState([]);
  const [page, setPage] = useState([]);
  const [nameAccount, setNameAccount] = useState([]);
  const [selectedName, setSelectedName] = useState(['all']);
  const [selectedAgentPage, setSelectedAgentPage] = useState(['all']);
  const [selectedAgentPagePermission, setSelectedAgentPagePermission] = useState(['all']);
  const [pagePermssion, setPagePermssion] = useState([]);

  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedKeysPage, setSelectedKeysPage] = useState(new Set());
  const [selectedKeysPermision, setSelectedKeysPermission] = useState(
    new Set()
  );

  // setting > USER
  const {
    isOpen: isModalSetUser,
    onOpen: onOpenModalSetUser,
    onOpenChange: onOpenChangeModalSetUser,
  } = useDisclosure();
  const {
    isOpen: isModalAddUser,
    onOpen: onOpenModalAddUser,
    onOpenChange: onOpenChangeModalAddUser,
  } = useDisclosure();

  const {
    isOpen: isModalDeletUser,
    onOpen: onOpenModalDeletUser,
    onOpenChange: onOpenChangeModalDeletUser,
  } = useDisclosure();

  // setting > PAGE
  const {
    isOpen: isModalSetPage,
    onOpen: onOpenModalSetPage,
    onOpenChange: onOpenChangeModalSetPage,
  } = useDisclosure();
  const {
    isOpen: isModalAddPage,
    onOpen: onOpenModalAddPage,
    onOpenChange: onOpenChangeModalAddPage,
  } = useDisclosure();

  const {
    isOpen: isModalDeletPage,
    onOpen: onOpenModalDeletPage,
    onOpenChange: onOpenChangeModalDeletPage,
  } = useDisclosure();

  // setting > Permission
  const {
    isOpen: isModalsettingPage,
    onOpen: onOpenModalsettingPage,
    onOpenChange: onOpenChangeModalsettingPage,
  } = useDisclosure();

  const fetchDataName = async () => {
    setIsLoading(true);
    try {
      const urlUserSale = `${URLS.SETTING}/getUserPancakeEdit/${agentId}`;
      const urllistSale = `${URLS.SETTING}/getUserPancake/${agentId}`;
      const urlUserSelect = `${URLS.SETTING}/getUserSale/${agentId}`;
      const [nameAgentResponse, userSaleResponse, userSelect] =
        await Promise.all([
          fetchProtectedData.get(urllistSale),
          fetchProtectedData.get(urlUserSale),
          fetchProtectedData.get(urlUserSelect),
        ]);
      setIsUserSale(userSaleResponse.data);
      setUserSelect(userSelect.data);

      const sortedUsers = nameAgentResponse.data.sort(
        (a, b) => b.status - a.status
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataPage = async () => {
    setIsLoading(true);

    try {
      const urlgetPage = `${URLS.SETTING}/getPages/${agentId}`;
      const urlNameAgent = `${URLS.SETTING}/nameAgent/${agentId}`;
      const urlNameAccount = `${URLS.SETTING}/getAccount/${agentId}`;

      const [pagesResponse, agentResponse, accountResponse] = await Promise.all(
        [
          fetchProtectedData.get(urlgetPage),
          fetchProtectedData.get(urlNameAgent),
          fetchProtectedData.get(urlNameAccount),
        ]
      );

      setagentName(agentResponse.data);
      setPage(pagesResponse.data);
      setNameAccount(accountResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataPermission = async () => {
    setIsLoading(true);
    try {
      const urlgetPage = `${URLS.SETTING}/getPagesPermission`;

      const pagesResponse = await fetchProtectedData.get(urlgetPage, {
        params: { businessId: agentId },
      });

      // เรียงข้อมูลให้ 'Active' มาอยู่ก่อน 'Inactive'
      const sortedData = pagesResponse.data.sort((a, b) => {
        return a.statusPage === "Active" ? -1 : 1;
      });

      setPagePermssion(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toastError("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataNamePermission = async (selecteddepartment) => {
    try {
      const urlUserAds = `${URLS.SETTING}/getUsersByBusinessId`;

      const userAdsResponse = await fetchProtectedData.post(urlUserAds, {
        businessId: agentId,
        department: selecteddepartment,
      });

      setUsersAds(userAdsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDepartmentPermission = async () => {
    try {
      const urlDepartment = `${URLS.SETTING}/getOnlyDepartments/${agentId}`;

      const departmentResponse = await fetchProtectedData.post(urlDepartment);

      setDepartment(departmentResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(selecteddepartment);

  // Fetch department-specific user data only when selected department changes
  useEffect(() => {
    if (activateTabs === "Permission") {
      const departmentToFetch = selecteddepartment || "all";
      fetchDataNamePermission(departmentToFetch);
    }
  }, [activateTabs, selecteddepartment]);

  // Main useEffect to load data when tabs are switched
  useEffect(() => {
    setSearchTerm(""); // Reset search term on tab switch

    if (activateTabs === "user") {
      fetchDataName(); // Fetch user data
    } else if (activateTabs === "page") {
      fetchDataPage(); // Fetch page data
    } else if (activateTabs === "Permission") {
   
      fetchDepartmentPermission();
      fetchDataPermission(); // Fetch permission data (only once)
    }
  }, [activateTabs, agentId]); // Reload only on tab change or agentId change

  const handleAddUser = async () => {
    try {
      await fetchProtectedData.post(`${URLS.SETTING}/addUser`, {
        name: newUser.name,
        username: newUser.username,
        status: newUser.status,
        businessId: agentId,
      });
      fetchDataName();
      onOpenChangeModalAddUser(false);
      setNewUser({ name: "", username: "", status: 1 });
      toastSuccess("เพิ่มผู้ใช้สำเร็จ");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleAddPage = async () => {
    try {
      await fetchProtectedData.post(`${URLS.SETTING}/addpagesName`, {
        name: newPage.pageName,
        platform: newPage.platform,
        code: newPage.code,
        agentName: agentName,
        created_by: currentUser.userName,
        businessId: agentId,
        accounts: newPage.accounts,
      });
      fetchDataPage();
      onOpenChangeModalAddPage(false);
      setNewPage({ platform: "", pageName: "", code: "", accounts: "" });
      toastSuccess("เพิ่มผู้ใช้สำเร็จ");
    } catch (error) {
      console.error("Error adding user:", error);
      toastError("การเพิ่มผู้ใช้ล้มเหลว");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    onOpenModalSetUser();
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      try {
        await fetchProtectedData.put(
          `${URLS.SETTING}/updateUser/${selectedUser.id}`,
          {
            name: selectedUser.name,
            username: selectedUser.username,
            status: selectedUser.status,
          }
        );
        fetchDataName();
        setSelectedUser(null);
        onOpenChangeModalSetUser(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("Event has not been created");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetchProtectedData.delete(`${URLS.SETTING}/deleteUser/${id}`);
      fetchDataName();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    toastSuccess("ลบสำเร็จ");
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    onOpenModalSetPage();
  };

  const handleDepartmentSelect = (key) => {
    setSelecteddepartment(key);
    setSelectedUser(null);
  };

  const handleUpdatePage = async () => {
    if (selectedPage) {
      try {
        await fetchProtectedData.put(
          `${URLS.SETTING}/updatePage/${selectedPage.id}`,
          {
            name: selectedPage.name,
            platform: selectedPage.platform,
            code: selectedPage.code,
            statusByAdmin: selectedPage.statusByAdmin,
            created_by: currentUser.userName,
            accounts: selectedPage.accounts,
          }
        );
        fetchDataPage();
        setSelectedPage(null);
        onOpenChangeModalSetPage(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("การแก้ไขไม่สำเร็จ");
      }
    }
  };

  const handleEditPermission = (page) => {
    setSelectedPermission(page);
    onOpenModalsettingPage();
  };

  const handleUpdatePermission = async () => {
    if (selectedPermission) {
      try {
        await fetchProtectedData.put(
          `${URLS.SETTING}/updatePermissionAds/${selectedPermission.id}`,
          {
            teamAds: selectedPermission.teamAds,
            agentName:
              selectedPermission.agencyAds === "noAgency"
                ? agentName[0]
                : "Agency",
            managePage: selectedPermission.managePage,
            statusPage: selectedPermission.statusPage,
            agencyAds: selectedPermission.agencyAds,
            updated_by: selectedPermission.updated_by,
            department: selectedPermission.department,
          }
        );
        fetchDataPermission();
        fetchDepartmentPermission();
        onOpenChangeModalsettingPage(false);
        toastSuccess("แก้ไขสำเร็จ");
      } catch (error) {
        console.error("Error updating user:", error);
        toastError("การแก้ไขไม่สำเร็จ");
      }
    }
  };

  const handleDeletePage = async (id) => {
    try {
      await fetchProtectedData.delete(`${URLS.SETTING}/deletePage/${id}`);
      fetchDataPage();
      toastSuccess("ลบสำเร็จ");
    } catch (error) {
      console.error("Error deleting user:", error);
      toastError("การลบไม่สำเร็จ");
    }
  };

  const handleAgencySelect = (key) => {
    const selectedKey = Array.from(key)[0];

    if (selectedKey === "noAgency") {
      setAgencySelected(false);
      setSelectedPermission((prevState) => ({
        ...prevState,
        agencyAds: selectedKey,
      }));
    } else if (selectedKey === "Agency") {
      setAgencySelected(true);
      setAgency(""); // Clear user input
      setSelectedPermission((prevState) => ({
        ...prevState,
        agencyAds: "",
      }));
    }
  };

  const handleUserAgency = (event) => {
    const inputValue = event.target.value;

    setAgency(inputValue);

    setSelectedPermission((prevState) => ({
      ...prevState,
      agencyAds: inputValue,
      managePage: inputValue,
    }));
  };

  const handleUserManage = (event) => {
    const inputValue = event.target.value;

    setSelectedPermission((prevState) => ({
      ...prevState,
      managePage: inputValue,
    }));
  };
  const getPlatformImage = (platform) => {
    switch (platform) {
      case "FACEBOOK":
        return "https://cdn-icons-png.freepik.com/256/15707/15707884.png?semt=ais_hybrid";
      case "LINE":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/1200px-LINE_logo.svg.png";
      case "LINEAD":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/LINE_logo.svg/1200px-LINE_logo.svg.png";
      case "LAZADA":
        return "https://www.lnwshop.com/system/application/modules/lnwshopweb/_images/store/store_lazada_4_1.png?new=true";
      case "SHOPEE":
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvMxPi-iG63ipbjJd5jh7QYZIM4qZ2tNBQTw&s";
      case "TIKTOK":
        return "https://sf-static.tiktokcdn.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png";
      case "TIKTOK/FB":
        return "https://sf-static.tiktokcdn.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png";

      case "INBCALL":
        return "https://static.vecteezy.com/system/resources/previews/016/151/594/original/cartoon-operator-with-microphone-icon-in-comic-style-operator-in-call-center-sign-illustration-pictogram-people-business-splash-effect-concept-vector.jpg";
      case "CRM":
        return "https://cdn-icons-png.flaticon.com/512/8020/8020943.png";
      case "SALESPAGE":
        return "https://cdn.icon-icons.com/icons2/1526/PNG/512/basket_106594.png";
      case "Instagram":
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/640px-Instagram_logo_2022.svg.png";
      default:
        return "https://example.com/default.jpg"; // รูปภาพเริ่มต้นเมื่อไม่พบ platform ที่ตรงกัน
    }
  };
  const columnsuser = [

    { name: "ชื่อผู้ใช้", uid: "name" },
    { name: "ผู้ใช้", uid: "username" },
    { name: "ชื่อตัวเเทน", uid: "nameAgent" },
    { name: "สถานะ", uid: "status" },
    { name: "จัดการ", uid: "actions" },
  ];

  const columnspage = [
    { name: "ชื่อเพจ", uid: "name" },
    { name: "แพลตฟอร์ม", uid: "platform" },
    { name: "ชื่อตัวแทน", uid: "nameAgent" },
    { name: "วันที่สร้าง", uid: "created_at" },
    { name: "สร้างโดย", uid: "created_by" },
    { name: "สถานะ", uid: "status" },
    { name: "จัดการ", uid: "actions" },
  ];

  const columnsPermission = [
    { name: "ชื่อเพจ", uid: "name" },
    { name: "ผู้บันทึกค่าแอด", uid: "teamAds" },
    { name: "แผนก", uid: "department" },
    { name: "ผู้ดูแล", uid: "managePage" },
    { name: "วันที่สร้าง", uid: "created_at" },
    { name: "สร้างโดย", uid: "created_by" },
    { name: "สถานะ", uid: "status" },
    { name: "จัดการ", uid: "actions" },
  ];

  const renderCellUser = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            name={cellValue}
            description={user.username}
            avatarProps={{
              src:
                user.displayImgUrl ||
                "https://prod-thailand-res.popmart.com/default/20240815_092128_174517____3-1_____1200x1200.jpg?x-oss-process=image/format,webp",
              radius: "lg",
            }}
          />
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
                onClick={() => handleEditUser(user)} // เรียกใช้ฟังก์ชันแก้ไข
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
                  setSelectedUserId(user.id);
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
  };

  const renderCellPage = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            name={cellValue}
            description={`account : ${user.accounts} ${user.code ? `| รหัส : ${user.code}` : ""} `}     
            avatarProps={{
              src: getPlatformImage(user.platform),
              radius: "lg",
            }}
          />
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.statusByAdmin]}
            size="sm"
            variant="flat"
          >
            {user.statusByAdmin === "1" ? "Active" : "Inactive"}
          </Chip>
        );

      case "created_at":
        return <>{formatDateThai(user.created_at)}</>;

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
                onClick={() => handleEditPage(user)} // เรียกใช้ฟังก์ชันแก้ไข
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
                  onOpenModalDeletPage();
                  setSelectedPageId(user.id);
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
  };

  const renderCellPagePermission = (user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            name={cellValue}
            description={
              <span className="flex">
                {`${user.accounts} | ${user.code ? `รหัส : ${user.code} |` : ""} แพลตฟอร์ม : ${user.platform} | เอเจนซี่ : `}

                {user.agencyAds === "noAgency" ? (
                  <span className="flex space-x-3 ml-1 text-danger">
                    <p> ไม่มี </p>
                  </span>
                ) : (
                  <span className="flex space-x-3 ml-1 text-success">
                    <p>{user.agencyAds} </p>
                  </span>
                )}
              </span>
            }
            avatarProps={{
              src: getPlatformImage(user.platform),
              radius: "lg",
            }}
          />
        );

      case "department":
        return <>{user.department === "all" ? "ไม่มีแผนก" : user.department}</>;

      case "teamAds":
        return user.teamAds === "NoAds" ? (
          <span className="flex space-x-2 items-center">
            <IncorrectIcon className="text-danger" />
          </span>
        ) : (
          user.teamAds
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorPermission[user.statusPage]}
            size="sm"
            variant="flat"
          >
            {user.statusPage === "Active" ? "มีการโฆษณา" : "ไม่มีการโฆษณา"}
          </Chip>
        );

      case "created_at":
        return <>{formatDateThai(user.created_at)}</>;

      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
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
                onClick={() => handleEditPermission(user)} // เรียกใช้ฟังก์ชันแก้ไข
              >
                <SettingPermissionIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (selectedUserId) {
      await handleDeleteUser(selectedUserId);
      onOpenChangeModalDeletUser(false); // ปิด Modal หลังจากลบเสร็จ
    }
  };

  const handleConfirmDeletePage = async () => {
    if (selectedPageId) {
      await handleDeletePage(selectedPageId);
      onOpenChangeModalDeletPage(false); // ปิด Modal หลังจากลบเสร็จ
    }
  };

  const handleSelectionChange = (keys) => {
    setSelectedKeys(new Set(keys));
  };

  const handleUpdateStatus = async (status) => {
    const containsInvalidKeys =
      Array.from(selectedKeys).includes("a") &&
      Array.from(selectedKeys).includes("l");
    const selectedRows = containsInvalidKeys ? "all" : Array.from(selectedKeys);
    try {
      await fetchProtectedData.put(`${URLS.SETTING}/updateSelectedUserStatus`, {
        status,
        selectedRows,
      });
      if (status === 1) {
        toastSuccess("เปิดการใช้งานผู้ใช้");
      } else {
        toastError("ปิดการใช้งานผู้ใช้");
      }
      fetchDataName();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelectionChangePage = (keys) => {
    setSelectedKeysPage(new Set(keys));
  };

  const handleUpdateStatusPage = async (statusByAdmin) => {
    const containsInvalidKeys =
      Array.from(selectedKeysPage).includes("a") &&
      Array.from(selectedKeysPage).includes("l");
    const selectedRows = containsInvalidKeys
      ? "all"
      : Array.from(selectedKeysPage);
    try {
      await fetchProtectedData.put(`${URLS.SETTING}/updateAllPagesStatus`, {
        statusByAdmin,
        selectedRows,
      });
      if (statusByAdmin === "1") {
        toastSuccess("เปิดการใช้งานเพจ");
      } else {
        toastError("ปิดการใช้งานเพจ");
      }

      fetchDataPage();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSelectionChangePermission = (keys) => {
    setSelectedKeysPermission(new Set(keys));
  };

  const handleUpdateStatusPermiision = async (statusPage) => {
    const containsInvalidKeys =
      Array.from(selectedKeysPermision).includes("a") &&
      Array.from(selectedKeysPermision).includes("l");
    const selectedRows = containsInvalidKeys
      ? "all"
      : Array.from(selectedKeysPermision);
    try {
      await fetchProtectedData.put(`${URLS.SETTING}/updateAllPermissionAds`, {
        statusPage,
        selectedRows,
      });
      if (statusPage === "Active") {
        toastSuccess("เปิดการใช้งานเพจ");
      } else {
        toastError("ปิดการใช้งานเพจ");
      }

      fetchDataPermission();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const getUniqueUsernames = (data) => {
    const usernameMap = new Map();
    data.forEach((item) => {
      if (!usernameMap.has(item.nameAgent)) {
        usernameMap.set(item.nameAgent);
      }
    });
  
    return Array.from(usernameMap.entries()).sort((a) => a[0]);
  };
  const getFilteredData = (data, selectedNames, searchTerm, nameKey = "nameAgent", searchKeys = ["name", "username"]) => {
    let filtered = data;
  
    // If 'all' is selected, use the full data for search filtering
    if (!selectedNames.includes('all')) {
      filtered = data.filter((item) => selectedNames.includes(item[nameKey]));
    }
  
    // Apply searchTerm filter if a search term is provided
    if (searchTerm && typeof searchTerm === 'string') {
      filtered = filtered.filter((item) =>
        searchKeys.some((key) =>
          item[key]?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  
    return filtered;
  };
  const uniqueUsername = useMemo(() => getUniqueUsernames(users), [users]);
  const filteredData = useMemo(
    () => getFilteredData(users, selectedName, searchTerm, "nameAgent", ["name", "username"]),
    [users, selectedName, searchTerm]
  );
  const uniquePage = useMemo(() => getUniqueUsernames(page), [page]);
  const filteredAgentPage = useMemo(() => getFilteredData(page, selectedAgentPage, searchTerm,"nameAgent", ["name", "code","platform"]), [page, selectedAgentPage, searchTerm]);
 
 
  const uniquePagePermission = useMemo(() => getUniqueUsernames(pagePermssion), [pagePermssion]);
  
  const filteredAgentPagePermission = useMemo(() => getFilteredData(pagePermssion, selectedAgentPage, searchTerm,"nameAgent", ["name", "code","platform"]), [pagePermssion, selectedAgentPage, searchTerm]);
  
  return (
    <Card className="flex p-4 h-full shadow-none">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
        onSelectionChange={(key) => setActivateTabs(key)}
      >
        <Tab
          key="user"
          title={
            <div className="flex items-center space-x-2">
              <span>จัดการชื่อพนักงานที่เชื่อมกับ Pancake</span>
            </div>
          }
        >
          <section className="p-1">
            <div className="flex justify-between items-center gap-3 mb-4">
              {/* ซ้ายสุด: หัวข้อ */}
              <h3 className="text-lg font-bold text-gray-800 w-1/4">
                ข้อมูลพนักงานที่เชื่อมแพนเค้ก
                <Chip size="md" variant="faded" className="ml-2">
                  {filteredData.length}
                </Chip>
              </h3>

              {/* ขวาสุด: ช่องค้นหาและปุ่ม */}
              <div className="flex items-center gap-3 w-3/4 justify-end">
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
                {uniqueUsername.map(([nameAgent]) => (
                  <SelectItem key={nameAgent} value={nameAgent}>
                    {nameAgent}
                  </SelectItem>
                ))}
              </Select>}
                <div className="flex gap-2">
                  
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
                </div>
                <Input
                  placeholder="ค้นหาพนักงาน"
                  className="w-1/3"
                  size="md"
                  variant="bordered"
                  value={searchTerm} // ใช้ค่า searchTerm
                  onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าค้นหาเมื่อพิมพ์
                />
                <Button color="primary" auto onPress={onOpenModalAddUser}>
                  + เพิ่มพนักงาน
                </Button>
              </div>
            </div>

            <Table
              color={"primary"}
              aria-label="Employee list with custom cells"
              className="h-[650px] overflow-y-auto scrollbar-hide"
              isHeaderSticky
              removeWrapper
              selectionMode="multiple"
              onSelectionChange={handleSelectionChange}
            >
              <TableHeader columns={columnsuser}>
                {(column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={filteredData} emptyContent='ไม่มีข้อมูล'>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>{renderCellUser(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Modal
              isOpen={isModalAddUser}
              onOpenChange={onOpenChangeModalAddUser}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h3>Add User</h3>
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        label="Name"
                        variant="bordered"
                        placeholder="กรอกชื่อพนักงาน"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            name: e.target.value,
                          })
                        }
                      />
                      <Select
                      disallowEmptySelection
                        label="Select Username"
                        variant="bordered"
                        placeholder="เลือกชื่อผู้ใช้"
                        selectedKeys={
                          newUser.username ? [newUser.username] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedUsername = Array.from(keys).join("");
                          setNewUser({
                            ...newUser,
                            username: selectedUsername,
                          });
                        }}
                      >
                        {userSelect.map((user) => (
                          <SelectItem
                            key={user.username}
                            textValue={user.username}
                          >
                            {user.username} - {user.nickName}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                      disallowEmptySelection
                        label="Status"
                        variant="bordered"
                        selectedKeys={[String(newUser.status)]}
                        onSelectionChange={(keys) => {
                          const newStatus = parseInt(
                            Array.from(keys).join(""),
                            10
                          );
                          setNewUser({
                            ...newUser,
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
                          handleAddUser // Save on confirm button click
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
                        variant="bordered"
                        label="Name"
                        value={selectedUser ? selectedUser.name : ""}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                      />
                      {/* เปลี่ยน Input เป็น Select สำหรับ Username */}
                      <Select
                      disallowEmptySelection
                        label="Username"
                        variant="bordered"
                        selectedKeys={
                          selectedUser ? [selectedUser.username] : []
                        }
                        onSelectionChange={(keys) => {
                          const newUsername = Array.from(keys).join("");
                          setSelectedUser({
                            ...selectedUser,
                            username: newUsername,
                          });
                        }}
                      >
                        {isUserSale.map((user) => (
                          <SelectItem
                            key={user.username}
                            textValue={user.username}
                          >
                            {user.username}
                          </SelectItem>
                        ))}
                      </Select>
                      {/* เพิ่ม Select สำหรับแก้ไข Status */}
                      <Select
                      disallowEmptySelection
                        label="Status"
                        variant="bordered"
                        selectedKeys={
                          selectedUser ? [String(selectedUser.status)] : []
                        }
                        onSelectionChange={(keys) => {
                          const newStatus = parseInt(
                            Array.from(keys).join(""),
                            10
                          );
                          setSelectedUser({
                            ...selectedUser,
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
                          handleUpdateUser // Save on confirm button click
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
              isOpen={isModalDeletUser}
              onOpenChange={onOpenChangeModalDeletUser}
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
                          handleConfirmDeleteUser // Save on confirm button click
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
          </section>
        </Tab>

        <Tab
          key="page"
          title={
            <div className="flex items-center space-x-2">
              <span>จัดการเพจที่เชื่อมกับ Pancake</span>
            </div>
          }
        >
          <section className="p-1">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 w-1/4">
                ข้อมูลเพจ
                <Chip size="md" variant="faded" className="ml-2">
                  {filteredAgentPage.length}
                </Chip>
              </h3>

              <div className="flex items-center gap-3 w-3/4 justify-end">
              {agentId === 1 && <Select
                label="ตัวแทน"
                placeholder="เลือกทั้งหมด"
                size="sm"
                className="w-64"
                onSelectionChange={(keys) => setSelectedAgentPage(Array.from(keys))}
                selectedKeys={new Set(selectedAgentPage)}
                selectionMode="multiple"
                disallowEmptySelection
              >
                <SelectItem key="all" value="all">
                  {"ทั้งหมด"}
                </SelectItem>
                {uniquePage.map(([nameAgent]) => (
                  <SelectItem key={nameAgent} value={nameAgent}>
                    {nameAgent}
                  </SelectItem>
                ))}
              </Select>}
                <div className="flex gap-2">
                  
                  <Button
                    color="success"
                    variant="ghost"
                    className="hover:bg-success hover:text-white"
                    onPress={() => handleUpdateStatusPage("1")} // เปิดใช้งาน
                    isDisabled={selectedKeysPage.size === 0}
                    size="sm"
                  >
                    ใช้งาน
                  </Button>
                  <Button
                    color="danger"
                    variant="ghost"
                    className="hover:bg-danger hover:text-white"
                    onPress={() => handleUpdateStatusPage("0")} // ปิดใช้งาน
                    isDisabled={selectedKeysPage.size === 0}
                    size="sm"
                  >
                    ปิดใช้งาน
                  </Button>
                </div>
                <Input
                  placeholder="ค้นหาเพจ"
                  variant="bordered"
                  className="w-1/3"
                  size="md"
                  value={searchTerm} // ใช้ค่า searchTerm
                  onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าค้นหาเมื่อพิมพ์
                />
                <Button color="primary" auto onPress={onOpenModalAddPage}>
                  + เพิ่มเพจ
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-[650px]">
                <Spinner label="Loading" color="primary" labelColor="primary" />
              </div>
            ) : (
              <Table
                color={"primary"}
                aria-label="Employee list with custom cells"
                className="h-[650px] overflow-y-auto scrollbar-hide"
                isHeaderSticky
                removeWrapper
                selectionMode="multiple"
                onSelectionChange={handleSelectionChangePage}
              >
                <TableHeader columns={columnspage}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredAgentPage} emptyContent='ไม่มีข้อมูล'>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{renderCellPage(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <Modal
              isOpen={isModalAddPage}
              onOpenChange={onOpenChangeModalAddPage}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h3>เพิ่มเพจ</h3>
                    </ModalHeader>
                    <ModalBody>
                      <Select
                      disallowEmptySelection
                        label="account"
                        variant="bordered"
                        selectedKeys={newPage ? [String(newPage.accounts)] : []}
                        onSelectionChange={(keys) => {
                          const newPlatform = Array.from(keys).join("");
                          setNewPage({
                            ...newPage,
                            accounts: newPlatform,
                          });
                        }}
                      >
                        {nameAccount.map((account) => (
                          <SelectItem key={account.id} value={account.accounts}>
                            {account.accounts}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                      disallowEmptySelection
                        label="แพลตฟอร์ม"
                        variant="bordered"
                        selectedKeys={newPage ? [String(newPage.platform)] : []}
                        onSelectionChange={(keys) => {
                          const newPlatform = Array.from(keys).join("");
                          setNewPage({
                            ...newPage,
                            platform: newPlatform,
                          });
                        }}
                      >
                        <SelectItem key="FACEBOOK">FACEBOOK</SelectItem>
                        <SelectItem key="LINE">LINE</SelectItem>
                        <SelectItem key="LINEAD">LINEAD</SelectItem>
                        <SelectItem key="LAZADA">LAZADA</SelectItem>
                        <SelectItem key="SHOPEE">SHOPEE</SelectItem>
                        <SelectItem key="TIKTOK">TIKTOK</SelectItem>
                        <SelectItem key="WEB">WEB</SelectItem>
                        <SelectItem key="INBCALL">INBCALL</SelectItem>
                        <SelectItem key="CRM">CRM</SelectItem>
                        <SelectItem key="SALESPAGE">SALESPAGE</SelectItem>
                        <SelectItem key="Instagram">Instagram</SelectItem>
                        <SelectItem key="GOOGLEADS">Google Ads</SelectItem>
                        <SelectItem key="UPSELL">UPSELL</SelectItem>
                      </Select>

                      <Input
                        label="ชื่อเพจ"
                        variant="bordered"
                        value={newPage ? newPage.pageName : ""}
                        onChange={(e) =>
                          setNewPage({
                            ...newPage,
                            pageName: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="รหัสเพจ"
                        variant="bordered"
                        value={newPage ? newPage.code : ""}
                        onChange={(e) =>
                          setNewPage({
                            ...newPage,
                            code: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="ชื่อตัวแทน"
                        variant="bordered"
                        value={agentName}
                        onChange={(e) =>
                          setNewPage({
                            ...newPage,
                            agentName: e.target.value,
                          })
                        }
                        isDisabled
                      />
                    </ModalBody>
                    <ModalFooter>
                      <ConfirmCancelButtons
                        onConfirm={
                          handleAddPage // Save on confirm button click
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
              isOpen={isModalSetPage}
              onOpenChange={onOpenChangeModalSetPage}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h3>Edit Page</h3>
                    </ModalHeader>
                    <ModalBody>
                      {/* เพิ่ม Select สำหรับแก้ไข Status */}
                      <Select
                      disallowEmptySelection
                        label="account"
                        variant="bordered"
                        selectedKeys={
                          selectedPage ? [String(selectedPage.accounts)] : []
                        }
                        onSelectionChange={(keys) => {
                          const accounts = Array.from(keys).join("");
                          setSelectedPage({
                            ...selectedPage,
                            accounts: accounts,
                          });
                        }}
                      >
                        {nameAccount.map((account) => (
                          <SelectItem key={account.accounts}>
                            {account.accounts}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select
                      disallowEmptySelection
                        label="แพลตฟอร์ม"
                        variant="bordered"
                        selectedKeys={
                          selectedPage && selectedPage.platform
                            ? [String(selectedPage.platform)]
                            : [""]
                        }
                        onSelectionChange={(keys) => {
                          const newplatform = Array.from(keys).join(""); // ดึงค่าเป็น string
                          setSelectedPage({
                            ...selectedPage,
                            platform: newplatform, // บันทึกเป็น string
                          });
                        }}
                      >
                       <SelectItem key="FACEBOOK">FACEBOOK</SelectItem>
                        <SelectItem key="LINE">LINE</SelectItem>
                        <SelectItem key="LINEAD">LINEAD</SelectItem>
                        <SelectItem key="LAZADA">LAZADA</SelectItem>
                        <SelectItem key="SHOPEE">SHOPEE</SelectItem>
                        <SelectItem key="TIKTOK">TIKTOK</SelectItem>
                        <SelectItem key="WEB">WEB</SelectItem>
                        <SelectItem key="INBCALL">INBCALL</SelectItem>
                        <SelectItem key="CRM">CRM</SelectItem>
                        <SelectItem key="SALESPAGE">SALESPAGE</SelectItem>
                        <SelectItem key="Instagram">Instagram</SelectItem>
                        <SelectItem key="GOOGLEADS">Google Ads</SelectItem>
                        <SelectItem key="UPSELL">UPSELL</SelectItem>
                      </Select>

                      <Input
                        label="ชื่อเพจ"
                        variant="bordered"
                        s
                        value={selectedPage ? selectedPage.name : ""}
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="รหัสเพจ"
                        variant="bordered"
                        value={selectedPage ? selectedPage.code : ""}
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            code: e.target.value,
                          })
                        }
                      />
                      <Input
                        variant="bordered"
                        label="ชื่อตัวเเทน"
                        value={agentName}
                        isDisabled
                      />
                      <Select
                      disallowEmptySelection
                        label="Status"
                        variant="bordered"
                        selectedKeys={
                          selectedPage &&
                          selectedPage.statusByAdmin !== undefined
                            ? [String(selectedPage.statusByAdmin)]
                            : [""]
                        }
                        onSelectionChange={(keys) => {
                          const newStatus = parseInt(
                            Array.from(keys).join(""),
                            10
                          );
                          setSelectedPage({
                            ...selectedPage,
                            statusByAdmin: newStatus,
                          });
                        }}
                      >
                        <SelectItem key="1">Active</SelectItem>
                        <SelectItem key="0">Inactive</SelectItem>
                      </Select>
                    </ModalBody>
                    <ModalFooter>
                      <ConfirmCancelButtons
                        onConfirm={handleUpdatePage}
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
              isOpen={isModalDeletPage}
              onOpenChange={onOpenChangeModalDeletPage}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h3>คุณต้องการลบเพจนี้หรือไม่?</h3>
                    </ModalHeader>
                    <ModalBody>
                      <p>การลบนี้จะไม่สามารถยกเลิกได้ คุณแน่ใจหรือไม่?</p>
                    </ModalBody>
                    <ModalFooter>
                      <ConfirmCancelButtons
                        onConfirm={
                          handleConfirmDeletePage // Save on confirm button click
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
          </section>
        </Tab>

        <Tab
          key="Permission"
          title={
            <div className="flex items-center space-x-2">
              <span>สิทธิ์พนักงานที่บันทึกค่าโฆษณาของเพจ</span>
            </div>
          }
        >
          <section className="p-1">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 w-1/4">
                ข้อมูลเพจ
                <Chip size="md" variant="faded" className="ml-2">
                  {filteredAgentPagePermission.length}
                </Chip>
              </h3>

              <div className="flex items-center gap-3 w-3/4 justify-end">
              {agentId === 1 && <Select
                label="ตัวแทน"
                placeholder="เลือกทั้งหมด"
                size="sm"
                className="w-64"
                onSelectionChange={(keys) => setSelectedAgentPagePermission(Array.from(keys))}
                selectedKeys={new Set(selectedAgentPagePermission)}
                selectionMode="multiple"
                disallowEmptySelection
              >
                <SelectItem key="all" value="all">
                  {"ทั้งหมด"}
                </SelectItem>
                {uniquePagePermission.map(([nameAgent]) => (
                  <SelectItem key={nameAgent} value={nameAgent}>
                    {nameAgent}
                  </SelectItem>
                ))}
              </Select>}
                <div className="flex gap-2">
                  <Button
                    color="success"
                    variant="ghost"
                    className="hover:bg-success hover:text-white"
                    onPress={() => handleUpdateStatusPermiision("Active")} // เปิดใช้งาน
                    isDisabled={selectedKeysPermision.size === 0}
                    size="sm"
                  >
                    เปิดการโฆษณา
                  </Button>
                  <Button
                    color="danger"
                    variant="ghost"
                    className="hover:bg-danger hover:text-white"
                    onPress={() => handleUpdateStatusPermiision("Inactive")} // ปิดใช้งาน
                    isDisabled={selectedKeysPermision.size === 0}
                    size="sm"
                  >
                    ปิดการโฆษณา
                  </Button>
                </div>
                <Input
                  placeholder="ค้นหาเพจ"
                  variant="bordered"
                  className="w-1/3"
                  size="md"
                  value={searchTerm} // ใช้ค่า searchTerm
                  onChange={(e) => setSearchTerm(e.target.value)} // อัปเดตค่าค้นหาเมื่อพิมพ์
                />
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-[650px]">
                <Spinner label="Loading" color="primary" labelColor="primary" />
              </div>
            ) : (
              <Table
                color={"primary"}
                aria-label="Employee list with custom cells"
                className="h-[650px] overflow-y-auto scrollbar-hide"
                isHeaderSticky
                removeWrapper
                selectionMode="multiple"
                onSelectionChange={handleSelectionChangePermission}
              >
                <TableHeader columns={columnsPermission}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={filteredAgentPagePermission} emptyContent='ไม่มีข้อมูล'>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>
                          <Tooltip
                            content={
                              <span className="flex">
                                อัพเดตล่าสุดโดย {item.updated_by} ณ วันที่{" "}
                                {formatDateThaiAndTime(item.updated_at)}
                              </span>
                            }
                            placement="top"
                          >
                            {renderCellPagePermission(item, columnKey)}
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <Modal
              isOpen={isModalsettingPage}
              onOpenChange={onOpenChangeModalsettingPage}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
              size="xl"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody>
                      <div className="h-[600px] flex flex-col">
                        {/* Static Header Section */}
                        <div className="p-4 border-b border-slate-200">
                          <span className="text-center font-extrabold text-xl block">
                            จัดการสิทธิ์ของเพจ
                          </span>
                          <span className="text-center text-sm block p-2">
                            {selectedPermission.name}
                          </span>
                          <div className="grid lg:grid-cols-2 lg:gap-4 text-md mt-2">
                            <span className="text-center">
                              แพลตฟอร์ม : {selectedPermission.platform}
                            </span>
                            <span className="text-center">
                              รหัสเพจ : {selectedPermission.code}
                            </span>
                          </div>
                          <div className="grid lg:grid-cols-2 lg:gap-4 text-md">
                            <span className="text-center">
                              บัญชี : {selectedPermission.accounts}
                            </span>
                            <span className="text-center">
                              ดูแลโดย : {selectedPermission.agentName}
                            </span>
                          </div>
                          <div className="grid text-md justify-center mt-2">
                            {selectedPermission?.statusPage === "Active" ? (
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center">
                                  {" "}
                                  <Chip
                                    className="capitalize"
                                    color={
                                      statusColorPermission[
                                        selectedPermission.statusPage
                                      ]
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    มีการโฆษณา
                                  </Chip>
                                </span>
                                <CorrectIcon className="text-success" />
                              </div>
                            ) : (
                              <span className="flex items-center">
                                {" "}
                                <Chip
                                  className="capitalize"
                                  color={
                                    statusColorPermission[
                                      selectedPermission.statusPage
                                    ]
                                  }
                                  size="sm"
                                  variant="flat"
                                >
                                  ไม่มีการโฆษณา
                                </Chip>
                                <IncorrectIcon className="text-danger" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="flex-grow overflow-auto p-6 scrollbar-hide">
                          <div className="grid gap-6 items-center justify-items-center">
                            <div className="grid space-y-4">
                              {/* First Section */}
                              <div className="grid grid-cols-1 space-y-4 border border-slate-200 p-3">
                                <h3 className="text-md font-semibold">
                                  โฆษณาและการจัดการผู้ใช้
                                </h3>
                                <Select
                                  variant="bordered"
                         
                                  label="เลือกแผนกดูแลการโฆษณา"
                                  className="max-w-[250px] min-w-[220px]"
                                  onSelectionChange={(key) => {
                                    const selectedKey =
                                      Array.from(key).join("");
                                    setSelectedPermission({
                                      ...selectedPermission,
                                      department: selectedKey,
                                    });
                                    handleDepartmentSelect(selectedKey);
                                  }}
                                  selectedKeys={
                                    selectedPermission?.department
                                      ? [String(selectedPermission.department)]
                                      : "all"
                                  }
                                  size="md"
                                >
                                  <SelectItem key="all" textValue="ทั้งหมด">
                                    <div className="flex gap-2 items-center">
                                      <span className="text-small">
                                        ทั้งหมด
                                      </span>
                                    </div>
                                  </SelectItem>

                                  {department.map((user) => (
                                    <SelectItem
                                      key={user.departmentName}
                                      textValue={user.departmentName}
                                    >
                                      <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                          {user.departmentName}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </Select>
                                <Select
                                  items={usersAds}
                             
                                  variant="bordered"
                                  label="เลือกผู้ใช้"
                                  className="max-w-[250px] min-w-[220px]"
                                  onSelectionChange={(keys) => {
                                    const selectedKey =
                                      Array.from(keys).join("");
                                    setSelectedPermission({
                                      ...selectedPermission,
                                      teamAds: selectedKey,
                                    });
                                  }}
                                  selectedKeys={
                                    selectedPermission?.teamAds
                                      ? [String(selectedPermission.teamAds)]
                                      : [
                                          (selectedPermission.teamAds = [
                                            "NoAds",
                                          ]),
                                        ]
                                  }
                                  size="md"
                                >
                                  <SelectItem
                                    key="NoAds"
                                    textValue="ไม่มีผู้ใช้งาน"
                                  >
                                    <div className="flex gap-2 items-center">
                                      <span className="text-small">
                                        ไม่มีผู้ใช้งาน
                                      </span>
                                    </div>
                                  </SelectItem>

                                  {usersAds.map((user) => (
                                    <SelectItem
                                      key={user.nickName || user.username}
                                      textValue={user.nickName || user.username}
                                    >
                                      <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                          {user.nickName || user.username}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                          {user.roleName}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>

                              {/* Second Section */}
                              <div className="grid grid-cols-1 space-y-4 border border-slate-200 p-3">
                                <h3 className="text-md font-semibold">
                                  ข้อมูลเอเจนซี่
                                </h3>
                                <div className="flex flex-col gap-4">
                                  <Select
                                  disallowEmptySelection
                                    variant="bordered"
                                    label="เพจมีเอเจนซี่"
                                    className="max-w-[250px] min-w-[220px]"
                                    selectedKeys={
                                      selectedPermission?.agencyAds ===
                                      "noAgency"
                                        ? ["noAgency"]
                                        : ["Agency"]
                                    }
                                    size="md"
                                    onSelectionChange={handleAgencySelect}
                                  >
                                    <SelectItem
                                      key="Agency"
                                      textValue="มีเอเจนซี่"
                                    >
                                      <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                          มีเอเจนซี่
                                        </span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem
                                      key="noAgency"
                                      textValue="ไม่มีเอเจนซี่"
                                    >
                                      <div className="flex gap-2 items-center">
                                        <span className="text-small">
                                          ไม่มีเอเจนซี่
                                        </span>
                                      </div>
                                    </SelectItem>
                                  </Select>

                                  <Input
                                    variant="bordered"
                                    label="เลือกผู้ใช้"
                                    className="max-w-[250px] min-w-[220px]"
                                    size="md"
                                    value={selectedPermission?.agencyAds || ""}
                                    onChange={handleUserAgency}
                                    isDisabled={
                                      selectedPermission?.agencyAds ===
                                      "noAgency"
                                    }
                                    placeholder="ใส่ชื่อเอเจนซี่"
                                  />
                                </div>
                              </div>

                              {/* Third Section */}
                              <div className="grid grid-cols-1 space-y-4 border border-slate-200 p-3">
                                <h3 className="text-md font-semibold">
                                  สถานะและการจัดการผู้ใช้
                                </h3>
                                <div className="flex flex-col gap-4">
                                  <Input
                                    variant="bordered"
                                    label="ชื่อผู้ดูเเล"
                                    className="max-w-[250px] min-w-[220px]"
                                    size="md"
                                    value={selectedPermission?.managePage || ""}
                                    onChange={handleUserManage}
                                    isDisabled={
                                      selectedPermission?.agencyAds !==
                                      "noAgency"
                                    }
                                    placeholder="ใส่ชื่อผู้ดูเเล"
                                  />

                                  <Select
                                  disallowEmptySelection
                                    label={
                                      <span className="flex space-x-3">
                                        <p>สถานะ</p>
                                        {selectedPermission?.statusPage ===
                                        "Active" ? (
                                          <CorrectIcon className="text-success" />
                                        ) : (
                                          <IncorrectIcon className="text-danger" />
                                        )}
                                      </span>
                                    }
                                    variant="bordered"
                                    selectedKeys={
                                      selectedPermission?.statusPage
                                        ? [selectedPermission.statusPage]
                                        : [""]
                                    }
                                    onSelectionChange={(keys) => {
                                      const selectedKey = Array.from(keys)[0]; // Extract the selected key
                                      const newStatus =
                                        selectedKey === "Active"
                                          ? "Active"
                                          : "Inactive";
                                      setSelectedPermission({
                                        ...selectedPermission,
                                        statusPage: newStatus,
                                      });
                                    }}
                                  >
                                    <SelectItem key="Active">ใช้งาน</SelectItem>
                                    <SelectItem key="Inactive">
                                      ปิดใช้งาน
                                    </SelectItem>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <ConfirmCancelButtons
                        onConfirm={
                          handleUpdatePermission // Save on confirm button click
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
          </section>
        </Tab>
      </Tabs>
    </Card>
  );
}

export default SetUserConnect;
