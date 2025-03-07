import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./styles/App.css";
import DefaultLayout from "./layouts/default";
import DefaultContent from "./layouts/defaultContent";

import Management from "./pages/Management/Management";
import Setting from "./pages/Setting/Setting";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Developer from "./pages/Developer/Developer";
import DashboardSummary from "./pages/DashboardSummary/DashboardSummary";
import StatsPlatform from "./pages/StatsPlatform/StatsPlatform";
import DashBoardAds from "./pages/DashBoardAds/DashBoardAds";
import DashBoardSale from "./pages/DashBoardSale/DashBoardSale";
import DashBoardCrm from "./pages/DashboardCrm/DashboardCrm";
import Commission from "./pages/Commission/Commission";
import ExpenseReport from "./pages/ExpenseReport/ExpenseReport";
import ReturnOrder from "./pages/Commission/Components/returnOrderPage";
import DashboardTalkTime from "./pages/DashboardTalkTime/DashboardTalkTime";
import DocumentProduct from "./pages/DocumentProduct/DocumentProduct";
import DashBoardNicecall from "./pages/DashBoardNicecall/DashBoardNicecall";
import DashboardInsights from "./pages/DashboardInsights/DashboardInsights";

import WeOne from "./pages/WeOne/WeOne";
import WeOneQuest from "./pages/WeOne/Pages/Quests/Quests";
import WeOneTransfer from "./pages/WeOne/Pages/Transfer/Transfer";
import WeOnePoint from "./pages/WeOne/Pages/Point/Point";
import WeOneRanking from "./pages/WeOne/Pages/Ranking/Ranking";
import WeOneHistory from "./pages/WeOne/Pages/History/History";
import WeOneRules from "./pages/WeOne/Pages/Rules/Rules";
import WeOneNotification from "./pages/WeOne/Pages/Notification/Notification";
import WeOneProfile from "./pages/WeOne/Pages/Profile/Profile";
import WeOneManage from "./pages/WeOne/Pages/Manage/Manage";
import WeOneSettingMission from "./pages/WeOne/Pages/Manage/components/ManageMission/WeOneSettingMission";
import WeOneSettingVote from "./pages/WeOne/Pages/Manage/components/ManageVote/WeOneSettingVote";
import WeOneCheckMission from "./pages/WeOne/Pages/Manage/components/ManageMission/WeOneCheckMission";
import WeOneSummaryVote from "./pages/WeOne/Pages/Manage/components/ManageVote/WeOneSummaryVote";
import WeOneSettingReward from "./pages/WeOne/Pages/Manage/components/ManageReward/WeOneSettingReward";
import WeOneManageReward from "./pages/WeOne/Pages/Manage/components/ManageReward/WeOneManageReward";
import WeOneRankingPoint from "./pages/WeOne/Pages/Manage/components/ManageReward/WeOneRankingPoint";
import WeOneFormVote from "./pages/WeOne/Pages/Vote/Components/WeOneFormVote";
import WeOneReward from "./pages/WeOne/Pages/Reward/Reward";

import WebContent from "./pages/WebContent/WebContent";
import Hopeful from "./pages/WebContent/pages/Hopeful/Hopeful";

import Contact from "./pages/WebContent/pages/Contact/Contact";
import Studio from "./pages/WebContent/pages/Studio/Studio";
import CaseReview from "./pages/WebContent/pages/caseReview/CaseReview";

import ListDetail from "./pages/WebContent/pages/Hopeful/page/ListDetail/ListDetail";
import GroupDetail from "./pages/WebContent/pages/Hopeful/page/GroupDetail/GroupDetail";

import { useAppContext } from "./contexts/AppContext";
import Cookies from "js-cookie";
import { CircularProgress } from "@nextui-org/react";
import TeamManage from "./pages/Management/Pages/TeamManage/subPages/TeamManage";
import TeamMemberManage from "./pages/Management/Pages/TeamManage/subPages/TeamMembersManage";
import { Toaster } from "sonner";
import HistoryTopup from "./pages/Management/Pages/Topup/subPages/HistoryTopup";
import ConfirmCommssion from "./pages/ConfirmCommssion/ConfirmCommssion";
import Vote from "./pages/WeOne/Pages/Vote/Vote";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory";
import ConfirmCommissionBody from "./pages/ConfirmCommssion/ConfirmCommissionBody";
import AwardBody from "./pages/Award/AwardBody";
import AwardDashboard from "./pages/Award/AwardDashboard";
import DashboardOverView from "./pages/DashboardOverView/DashboardOverView";
import OKRBody from "./pages/OKR/OKRBody";
import OKRDashboard from "./pages/OKR/OKRDashboard";
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isUserLoading } = useAppContext();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!isUserLoading) {
      if (!currentUser) {
        navigate("/login", { replace: true, state: { from: location } });
      }
    }
  }, [currentUser, isUserLoading, location, navigate]);

  if (isUserLoading) {
    // อาจโชว์ Loading หรือเปล่า
    return null;
  }

  return currentUser ? children : null;
}

const primaryRoutes = {
  weOne: [
    { path: "/WeOne", component: <WeOne /> },
    { path: "/WeOne-Quests", component: <WeOneQuest /> },
    { path: "/WeOne-Notfication", component: <WeOneNotification /> },
    { path: "/WeOne-Profile", component: <WeOneProfile /> },
    { path: "/WeOne-Transfer", component: <WeOneTransfer /> },
    { path: "/WeOne-Point", component: <WeOnePoint /> },
    { path: "/WeOne-Ranking", component: <WeOneRanking /> },
    { path: "/WeOne-History", component: <WeOneHistory /> },
    { path: "/WeOne-Vote", component: <Vote /> },
    { path: "/WeOne-Rules", component: <WeOneRules /> },
    { path: "/WeOne-FormVote", component: <WeOneFormVote /> },
    { path: "/WeOne-Reward", component: <WeOneReward /> },
    { path: "/WeOne-Manage", component: <WeOneManage /> },
    { path: "/WeOne-Manage-SetMission", component: <WeOneSettingMission /> },
    { path: "/WeOne-Manage-SetVote", component: <WeOneSettingVote /> },
    { path: "/WeOne-Manage-CheckMission", component: <WeOneCheckMission /> },
    { path: "/WeOne-Manage-SummaryVote", component: <WeOneSummaryVote /> },
    { path: "/WeOne-Manage-SetReward", component: <WeOneSettingReward /> },
    { path: "/WeOne-Manage-ManageReward", component: <WeOneManageReward /> },
    { path: "/WeOne-Manage-RankingPoint", component: <WeOneRankingPoint /> },
  ],
  one: [
    { path: "/home", component: <Home />, title: "หน้าแรก" },
    { path: "/setting", component: <Setting />, title: "การตั้งค่า" },
    { path: "/management", component: <Management />, title: "การจัดการ" },
    { path: "/dev", component: <Developer /> },
    {
      path: "/Dashboard-Summary",
      component: <DashboardSummary />,
      title: "แดชบอร์ด Summary",
    },
    {
      path: "/Dashboard-StatsPlatform",
      component: <StatsPlatform />,
      title: "Stats Platform",
    },
    {
      path: "/ExpenseReport",
      component: <ExpenseReport />,
      title: "ค่าใช้จ่าย",
    },
    {
      path: "/Dashboard-Ads",
      component: <DashBoardAds />,
      title: "แดชบอร์ด Ads",
    },
    {
      path: "/Dashboard-Sale",
      component: <DashBoardSale />,
      title: "แดชบอร์ด Sale",
    },
    {
      path: "/Dashboard-CRM",
      component: <DashBoardCrm />,
      title: "แดชบอร์ด CRM",
    },
    {
      path: "/Dashboard-TalkTime",
      component: <DashboardTalkTime />,
      title: "แดชบอร์ด Talk Time",
    },
    { path: "/Commission", component: <Commission />, title: "Dashboard Sales" },
    {
      path: "/Return-Order",
      component: <ReturnOrder />,
      title: "ออเดอร์ตีกลับ",
    },
    {
      path: "/TeamManage/:teamId",
      component: <TeamManage />,
      title: "จัดการทีม",
    },
    { path: "/TeamMembersManage/:teamId", component: <TeamMemberManage /> },
    { path: "/HistoryTopUp", component: <HistoryTopup />, title: "เติมเงิน" },
    {
      path: "/ConfirmCommission",
      component: <ConfirmCommissionBody />,
      title: "ยืนยันค่าคอม",
    },
    {
      path: "/TransactionHistory",
      component: <TransactionHistory />,
      title: "ประวัติการทำธุรกรรม",
    },
    {
      path: "/DocumentProduct",
      component: <DocumentProduct />,
      title: "ข้อมูลสินค้า",
    },
    { path: "/Award", component: <AwardBody />, title: "Award" },
    { path: "/okr", component: <OKRBody />, title: "My OKR" },
    { path: "/okr_dashboard", component: <OKRDashboard />, title: "OKR Dashboard" },
    {
      path: "/Dashboard-Overview",
      component: <DashboardOverView />,
      title: "แดชบอร์ดยอดสั่งซื้อ",
    },
    {
      path: "/DashBoardNicecall",
      component: <DashBoardNicecall />,
      title: "Nice Call",
    },
    {
      path: "/Award_Dashboard",
      component: <AwardDashboard />,
      title: "AwardDashboard",
    },
    {
      path: "/Dashboard-Insights",
      component: <DashboardInsights />,
      title: "แดชบอร์ด RFM",
    },
  ],
  content: [
    { path: "/content-home", component: <WebContent /> },
    { path: "/content-hopeful", component: <Hopeful /> },
    { path: "/content-hopeful/list/:id", component: <ListDetail /> },
    {
      path: "/content-hopeful/list/:id/group/:groupid",
      component: <GroupDetail />,
    },
    { path: "/content-studio", component: <Studio /> },
    { path: "/content-contact", component: <Contact /> },
    { path: "/content-caseReview", component: <CaseReview /> },
  ],
};

function App() {
  const { isUserLoading } = useAppContext();

  if (isUserLoading) {
    return (
      <div className="fixed size-full flex justify-center items-center">
        <CircularProgress size="lg" color="primary" className="" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Routes>
              {primaryRoutes.weOne.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.component}
                />
              ))}
              {primaryRoutes.one.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <DefaultLayout title={route.title}>
                      {route.component}
                    </DefaultLayout>
                  }
                />
              ))}
              {primaryRoutes.content.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<DefaultContent>{route.component}</DefaultContent>}
                />
              ))}
            </Routes>
            <Toaster richColors />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
