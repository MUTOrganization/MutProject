import { Card } from "@nextui-org/react";
import React from "react";
import AgentRanking from "./AgentRanking";
import BestSellingProduct from "./BestSellingProduct";
import ProductStar from "./ProductStar";

function DashboardOverViewBody({ data, isLoading, dateMode, isPercentage }) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card shadow="none" radius="sm" className="h-full flex flex-col">
                <div className="p-4 flex flex-col justify-between h-full">
                    <BestSellingProduct data={data} isLoading={isLoading} dateMode={dateMode} isPercentage={isPercentage} />
                </div>
            </Card>
            <Card shadow="none" radius="sm" className="h-full flex flex-col">
                <div className="p-4 flex flex-col justify-between h-full">
                    <ProductStar data={data} isLoading={isLoading} dateMode={dateMode} isPercentage={isPercentage} />
                </div>
            </Card>
            <Card shadow="none" radius="sm" className="h-full flex flex-col">
                <div className="p-4 flex flex-col justify-between h-full">
                    <AgentRanking data={data} isLoading={isLoading} dateMode={dateMode} isPercentage={isPercentage} />
                </div>
            </Card>
        </section>
    );
}

export default DashboardOverViewBody;
