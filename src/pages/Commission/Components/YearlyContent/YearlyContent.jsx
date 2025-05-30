import { Card, CardBody } from "@heroui/react";
import CommissionChart from "./CommissionChart";
import SummaryTable from "./SummaryTable";
import IncomeChart from "./IncomeChart";
import SaleOrderChart from "./SaleOrderChart";

/**
 * 
 * @param {{
 *      data: [CommissionData],
 *      selectedYear: Number,
 *      isLoading: Boolean
 * }} param0 
 * @returns 
 */
export default function YearlyContent({data, selectedYear, isLoading}){
    return (
        <div className="space-y-8 overflow-auto max-h-[calc(100vh-120px-120px)] rounded-lg scrollbar-hide">
            <div className="xl:flex xl:space-x-4 max-xl:space-y-4">
                <Card shadow="none" className="flex flex-1">
                    <CardBody>
                        <CommissionChart data={data} isLoading={isLoading} selectedYear={selectedYear} />
                    </CardBody>
                </Card>
                <Card shadow="none" className="flex flex-1 h-fit">
                    <CardBody>
                        <IncomeChart data={data} isLoading={isLoading} selectedYear={selectedYear} />
                    </CardBody>
                </Card>
            </div>
            <div className="xl:flex xl:space-x-4 max-xl:space-y-4">
                <Card shadow="none" className="flex flex-1">
                    <CardBody>
                        <SaleOrderChart data={data} isLoading={isLoading} selectedYear={selectedYear} />
                    </CardBody>
                </Card>
                <Card shadow="none" className="flex flex-1 h-fit">
                    <CardBody>
                        <SummaryTable data={data} isLoading={isLoading} selectedYear={selectedYear} />
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}