import React from "react";
import { Card } from "@heroui/react";
import TabsOthersCost from "./TabsExpense/TabsOthersCost";

function ExpenseReport() {

  return (
    <section title={"ค่าใช้จ่าย"}>
      <Card className="flex p-4 h-full shadow-none">
        <TabsOthersCost />
      </Card>
    </section>
  );
}

export default ExpenseReport;
