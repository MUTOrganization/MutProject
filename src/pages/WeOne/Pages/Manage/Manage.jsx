import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { Tabs, Tab } from "@nextui-org/react";
import ManageMission from "./Pages/ManageMission";
import ManageVote from "./Pages/ManageVote";
import ManageReward from "./Pages/ManageReward";
import ManageReport from "./Pages/ManageReport";

function Manage() {
  // Initialize tab state from localStorage or default to the first tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "ManageMission";
  });

  // Update localStorage whenever the activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="py-6 space-y-6 bg-gradient-to-b from-blue-50 to-white z-10">
          <Tabs
            variant="underlined"
            aria-label="Options"
            color="primary"
            size="lg"
            className="flex-1 flex flex-col"
            selectedKey={activeTab} // Set active tab
            onSelectionChange={(key) => setActiveTab(key)} // Update active tab on change
          >
            <Tab
              key="ManageMission"
              title="ภารกิจ"
              className="flex-1 flex items-center justify-center"
            >
              <ManageMission />
            </Tab>
            <Tab
              key="ManageVote"
              title="แบบสอบถาม"
              className="flex-1 flex items-center justify-center"
            >
              <ManageVote />
            </Tab>
            <Tab
              key="Reward"
              title="คะเเนนและรางวัล"
              className="flex-1 flex items-center justify-center"
            >
              <ManageReward />
            </Tab>
            <Tab
              key="Validate"
              title="สรุป"
              className="flex-1 flex items-center justify-center"
            >
              <ManageReport />
            </Tab>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

export default Manage;
