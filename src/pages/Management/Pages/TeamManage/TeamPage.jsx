import { Card, Spinner } from "@nextui-org/react";
import { useAppContext } from "../../../../contexts/AppContext";
import { ACCESS } from "../../../../configs/access";
import { lazy, Suspense } from "react";
const TeamListPageManager = lazy(() => import("./subPages/TeamListManager"));
const TeamListPageLeader = lazy(() => import("./subPages/TeamListLeader")); 
const TeamAllView = lazy(() => import("./subPages/TeamAllView"));


export default function TeamPage() {
    const { accessCheck } = useAppContext()

    return (
        <section className="w-full">
            <Card className="flex p-4 max-h-[calc(100vh-120px)] max-w-screen-2xl overflow-hidden" shadow="none" radius="sm">
                <Suspense fallback={<Spinner />}>
                    {
                        accessCheck.haveOne(ACCESS.team.team_view_all) ?
                        <TeamAllView /> :
                        accessCheck.haveOne(ACCESS.team.manager) ?
                        <TeamListPageManager /> :
                        <TeamListPageLeader />
                    }
                </Suspense>
            </Card>


        </section>
    )
}