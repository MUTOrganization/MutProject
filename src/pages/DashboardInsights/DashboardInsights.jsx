import React from "react";
import DashboardInsightsBody from "./components/DashboardInsightsBody";
import DashboardInsightsHeader from "./components/DashboardInsightsHeader";
function DashboardInsights() {
  return (
    <div className=" space-y-4">
      <section>
        <DashboardInsightsHeader />
      </section>
      <section>
        <DashboardInsightsBody />
      </section>
    </div>
  );
}

export default DashboardInsights;
