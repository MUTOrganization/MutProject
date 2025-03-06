import React from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import DashboardOverviewSettingBody from './DashboardOverviewSettingBody'

function DashboardOverviewSettings() {

    return (
        <div>
            <section className="w-full">
                <Card className="flex p-4" shadow="none" radius="sm">
                    <CardHeader className="flex justify-between">
                        <div className="text-base font-bold">การตั้งค่า เงื่อนไขรางวัลหน้า แดชบอร์ดยอดสั่งซื้อ</div>
                    </CardHeader>
                    <CardBody>
                        <DashboardOverviewSettingBody />
                    </CardBody>
                </Card>
            </section>
        </div>
    )
}

export default DashboardOverviewSettings