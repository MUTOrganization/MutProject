import React, { useState, useEffect, useMemo, lazy } from "react";
import { Card, CardHeader, CardBody, CardFooter, Tabs, Tab } from "@heroui/react";
import NewsTable from "../Components/newsTable";
import EducationTable from '../Components/educationTable'

function ManageHome() {

  const [activateTabs, setActivateTabs] = useState("home");

  return (
    <section className="w-full">
      <Card className="flex p-4" shadow="none" radius="sm">
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
          selectedKey={activateTabs}
          onSelectionChange={(key) => setActivateTabs(key)}
        >
          <Tab
            key="news"
            title={
              <div className="flex items-center space-x-2">
                <span>ข่าวสาร</span>
              </div>
            }
          />
          <Tab
            key="education"
            title={
              <div className="flex items-center space-x-2">
                <span>สื่อความรู้</span>
              </div>
            }
          />
        </Tabs>
        <CardBody>
          {activateTabs === "news" && (
            <NewsTable />
          )}
          {activateTabs === "education" && (
            <EducationTable />
          )}
        </CardBody>
      </Card>
    </section>
  );
}

export default ManageHome;
