import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { LeftArrowIcon } from "../../../../../../component/Icons";
import {
  Button,
  Card,
  Spinner,
  Table,
  Checkbox,
  TableColumn,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Badge,
} from "@nextui-org/react";
import { formatDateThaiAndTime } from "../../../../../../component/DateUtiils";
function WeOneManageReward() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const handleBack = () => {
    navigate(-1, {
      state: { activeTab: location.state?.activeTab || "ManageMission" },
    });
  };

  // Mock Data for demonstration purposes
  const data = [
    {
      reward_id: 63,
      username: "hq000_o",
      reward_name: "แมวทองหน้า",
      hero_point: 1,
      quantity: 1,
      image_url: "https://storage.googleapis.com/hopeful-wellness/image.png",
      remark: "",
      status: 0, // 0 = Pending, 1 = Approved, 2 = Rejected
      redeemed_at: "2024-11-04 16:24:09",
    },
    {
      reward_id: 64,
      username: "hq000_o",
      reward_name: "แมวทองหน้า",
      hero_point: 1,
      quantity: 1,
      image_url: "https://storage.googleapis.com/hopeful-wellness/image.png",
      remark: "",
      status: 0,
      redeemed_at: "2024-11-04 16:26:37",
    },
  ];

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setFilteredData(data);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUpdateStatus = (rewardIds, newStatus) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        rewardIds.includes(item.reward_id)
          ? { ...item, status: newStatus }
          : item
      )
    );
    console.log(filteredData);
  };

  const filteredByStatus = () => {
    if (selectedStatus === "pending")
      return filteredData.filter((item) => item.status === 0);
    if (selectedStatus === "approved")
      return filteredData.filter((item) => item.status === 1);
    if (selectedStatus === "rejected")
      return filteredData.filter((item) => item.status === 2);
    return filteredData;
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
            จัดการขอแลกรางวัล
          </h2>
        </div>

        <div
          className="flex overflow-hidden px-8"
          style={{
            whiteSpace: "nowrap", // ป้องกันข้อความตัดบรรทัด
          }}
        >
          <section className="overflow-x-auto scrollbar-hide space-x-4 py-2">
            <Button
              color="primary"
              variant={selectedStatus === "pending" ? "flat" : "bordered"}
              onPress={() => setSelectedStatus("pending")}
            >
              <div className={`flex items-center justify-between  space-x-4`}>
                <span>รอตรวจสอบ</span>

                {filteredData.filter((item) => item.status === 0).length !==
                0 ? (
                  <Badge
                    content={
                      filteredData.filter((item) => item.status === 0).length
                    }
                    shape="circle"
                    showOutline={false}
                    className="bg-[#ff4b63] ml-2 text-white "
                  />
                ) : (
                  <></>
                )}
              </div>
            </Button>
            <Button
              color="primary"
              variant={selectedStatus === "approved" ? "flat" : "bordered"}
              onPress={() => setSelectedStatus("approved")}
            >
              <div className={`flex items-center justify-between  space-x-4`}>
                <span>ยืนยันเเล้ว</span>
                {filteredData.filter((item) => item.status === 1).length !==
                0 ? (
                  <Badge
                    content={
                      filteredData.filter((item) => item.status === 1).length
                    }
                    shape="circle"
                    showOutline={false}
                    className="bg-[#ff4b63] ml-2 text-white"
                  />
                ) : (
                  <></>
                )}
              </div>
            </Button>
            <Button
              color="primary"
              variant={selectedStatus === "rejected" ? "flat" : "bordered"}
              onPress={() => setSelectedStatus("rejected")}
            >
               <div className={`flex items-center justify-between  space-x-4`}>
               <span>
              ปฏิเสธ
              </span>
             { filteredData.filter((item) => item.status === 2).length !== 0 ? <Badge
                content={
                  filteredData.filter((item) => item.status === 2).length
                }
                shape="circle"
                showOutline={false}
                className="bg-[#ff4b63] ml-2 text-white"
              /> : <></>}
              </div>
            </Button>
          </section>
        </div>

        <div className="flex flex-col w-full px-4">
          {isLoading ? (
            <Spinner
              className="flex items-center min-h-[300px]"
              color="primary"
              labelColor="foreground"
            />
          ) : (
            <Card
              className="overflow-hidden mb-6"
              shadow="none"
              style={{ background: "transparent" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">รอการยืนยัน</h3>
                <div className="flex space-x-4">
                  <Button
                    color="success"
                    isDisabled={selectedItems.length === 0}
                    onPress={() => handleUpdateStatus(selectedItems, 1)}
                  >
                    ยืนยันที่เลือก
                  </Button>
                  <Button
                    color="danger"
                    isDisabled={selectedItems.length === 0}
                    onPress={() => handleUpdateStatus(selectedItems, 2)}
                  >
                    ปฏิเสธที่เลือก
                  </Button>
                </div>
              </div>
              <Table
                selectionMode="multiple"
                selectedKeys={new Set(selectedItems)}
                onSelectionChange={(keys) => setSelectedItems([...keys])}
                aria-label="Pending Rewards Table"
                css={{
                  overflowX: "auto",
                  width: "100%",
                  minWidth: "600px", // Ensure it scrolls on small devices
                }}
              >
                <TableHeader>
                  <TableColumn>ชื่อรางวัล</TableColumn>
                  <TableColumn>ผู้ใช้</TableColumn>
                  <TableColumn>จำนวน</TableColumn>
                  <TableColumn>วันที่แลก</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredByStatus()
                    .filter((item) => item.status === 0)
                    .map((item) => (
                      <TableRow key={item.reward_id}>
                        <TableCell className="text-xs">
                          {item.reward_name}
                        </TableCell>
                        <TableCell className="text-xs">
                          {" "}
                          {item.username}
                        </TableCell>
                        <TableCell className="text-xs">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDateThaiAndTime(item.redeemed_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default WeOneManageReward;
