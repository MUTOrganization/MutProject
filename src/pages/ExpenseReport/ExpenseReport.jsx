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
        <Tabs
          // aria-label="Options"
          // color="primary"
          // // variant="underlined"
          // classNames={{
          //   tabList:
          //     "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          //   cursor: "w-full bg-[#22d3ee]",
          //   tab: "max-w-fit px-0 h-12",
          //   tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          // }}
        >
          {/* TabsConst */}
          {/* {currentData.accessCheck.haveAny([ACCESS.expenses.expenses_summary]) && (
            <Tab
              key="cost"
              title={
                <div className="flex items-center space-x-2">
                  <span>สรุปรายจ่าย</span>
                </div>
              }
            >
              <CommissionContextProvider>
                <TabsCostSummary />
              </CommissionContextProvider>
            </Tab>
          )} */}
          {/* ADS */}

          {/* <TabsAds /> */}
          {/* {currentData.accessCheck.haveAny([ACCESS.expenses.expenses_ads]) && (
            <Tab
              key="ads"
              title={
                <div className="flex items-center space-x-2">
                  <span>ค่า Ads</span>
                </div>
              }
            >
              <TabsAdsNextGen />
            </Tab>
          )} */}

          {/* FixCost */}

          {/* {currentData.accessCheck.haveAny([ACCESS.expenses.expenses_other]) && (
            <Tab
              key="fixCost"
              title={
                <div className="flex items-center space-x-2">
                  <span>ค่าใช้จ่ายอื่นๆ</span>
                </div>
              }
            >
              <TabsOthersCost />
            </Tab>
          )} */}
        </Tabs>
        {currentData.accessCheck.haveAny([ACCESS.expenses.expenses_other]) && (
          <TabsOthersCost />
        )}
      </Card>
    </section>
  );
}

export default ExpenseReport;
