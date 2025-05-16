import React, { useState, useEffect } from "react";
import DefaultLayout from "../../layouts/default";
import { Card, Tabs, Tab } from "@nextui-org/react";
import TabsAds from "./TabsExpense/TabsAds";
import TabsAdsNextGen from "./TabsExpense/TabsAdsNextGen";
import TabsCostSummary from "./TabsExpense/TabsCostSummary";
import TabsOthersCost from "./TabsExpense/TabsOthersCost";
import CommissionContextProvider from "../Commission/CommissionContext";
import { ACCESS } from "../../configs/access";
import { useAppContext } from "../../contexts/AppContext";

function ExpenseReport() {
  const currentData = useAppContext();
  const currentUser = useAppContext();

  return (
    <section title={"ค่าใช้จ่าย"}>
      <Card className="flex p-4 h-full shadow-none">
        <TabsOthersCost />
      </Card>
    </section>
  );
}

export default ExpenseReport;
