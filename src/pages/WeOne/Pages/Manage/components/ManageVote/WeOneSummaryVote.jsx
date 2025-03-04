import React, { useState, useEffect } from "react";
import Layout from "../../../../Components/Layout";
import { Button } from "@nextui-org/react";
import { LeftArrowIcon, EditIcon } from "../../../../../../component/Icons";
import { useNavigate, useLocation } from "react-router-dom";
function WeOneSummaryVote() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState("History");
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const handleBack = () => {
    navigate(-1, {
      state: { activeTab: location.state?.activeTab || "ManageMission" },
    });
  };
  return (
    <Layout>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="py-6 space-y-6 bg-white z-10">
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
              สรุปผลเเบบสอบถาม
            </h2>
            {selected === "History" && (
              <span
                className={`flex p-2 text-lg ${
                  isDeleteMode ? "text-red-500" : "text-gray-500"
                }`}
              >
                <EditIcon onPress={() => setIsDeleteMode(!isDeleteMode)} />
              </span>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </Layout>
  );
}

export default WeOneSummaryVote;
