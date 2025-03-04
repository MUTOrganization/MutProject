import React, { useState, useEffect } from "react";
import { URLS } from "../../../config";
import {
  Card,
  Checkbox,
  DateRangePicker,
  DatePicker,
  Select,
  SelectItem,
  Avatar,
  Button,
  CardBody,
  useDisclosure,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Switch,
  user,
} from "@nextui-org/react";

import { useAppContext } from "../../../contexts/AppContext";
import { startOfMonth, endOfMonth, today } from "@internationalized/date";
import fetchProtectedData from "../../../../utils/fetchData";
import Section1 from "./DashboardComponents/section1";
import Section2 from "./DashboardComponents/Section2";
import Section3 from "./DashboardComponents/Section3";

function Dashboard({
  agentId,
  username,
  selectedUser,
  role,
  startDate,
  endDate,
  viewTable,
  vatRate,
  viewdate,
  storedCheckboxes,
}) {
  const [dataSale, setDataSale] = useState([]);
  const [dataPlatformsale, setDataPlatformsale] = useState([]);
  const [dataOrderStat, setDataOrderStat] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const fetchPagestat = async () => {
    setIsLoading(true);
    try {
      const saleUserUrl = `${URLS.STATSSALE}/saleforUserName`; // Add the URL for saleUser
      const platformsaleUrl = `${URLS.STATSSALE}/platformsale`; // Add the URL for saleUser
      const orderStatUrl = `${URLS.STATSSALE}/orderStat`; 
      const [saleUserResponse, platformsaleResponse,orderStatResponse] = await Promise.all(
        [
          fetchProtectedData.post(saleUserUrl, {
            agent: agentId,
            startDate: startDate,
            endDate: endDate,
            userName: Array.from(selectedUser)[0],
          }),
          fetchProtectedData.post(platformsaleUrl, {
            agent: agentId,
            startDate: startDate,
            endDate: endDate,
            createBy: Array.from(selectedUser)[0],
          }),
          fetchProtectedData.post(orderStatUrl, {
            startDate: startDate,
            endDate: endDate,
            ownerId: agentId,
            customerOwnerId: agentId,
            createBy: Array.from(selectedUser)[0],
          })
        ]
      );
      setDataOrderStat(orderStatResponse.data)
      setDataPlatformsale(platformsaleResponse.data);
      setDataSale(saleUserResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
console.log(dataOrderStat);

  useEffect(() => {
    if (selectedUser !== null) {
      fetchPagestat();
    }
  }, [agentId, startDate, endDate, selectedUser]);



  return (
    <>
      <div className="section-container mt-4">
        <Section1 dataSale={dataSale} isLoading={isLoading} />
        <Section2 data={dataPlatformsale} dataSale={dataSale} startDate={startDate} endDate={endDate} isLoading={isLoading}/>
        <Section3 dataOrderStat={dataOrderStat} isLoading={isLoading}/>
      </div>
    </>
  );
}

export default Dashboard;
