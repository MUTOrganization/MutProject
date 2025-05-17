import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./styles/App.css";
import DefaultLayout from "./layouts/default";

import Management from "./pages/Management/Management";
import Setting from "./pages/Setting/Setting";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import DashboardSummary from "./pages/DashboardSummary/DashboardSummary";
import Commission from "./pages/Commission/Commission";
import ExpenseReport from "./pages/ExpenseReport/ExpenseReport";


import { useAppContext } from "./contexts/AppContext";
import { CircularProgress } from "@nextui-org/react";
import { Toaster } from "sonner";
import ConfirmCommissionBody from "./pages/ConfirmCommssion/ConfirmCommissionBody";
import DashboardOverView from "./pages/DashboardOverView/DashboardOverView";
import DashboardCEO from "./pages/DashboardCEO/DashboardCEO";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isUserLoading } = useAppContext();

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
  one: [
    { path: "/home", component: <Home />, title: "หน้าแรก" },
    { path: "/setting", component: <Setting />, title: "การตั้งค่า" },
    { path: "/management", component: <Management />, title: "การจัดการ" },
    {
      path: "/Dashboard-Summary",
      component: <DashboardSummary />,
      title: "แดชบอร์ด Summary",
    },
    {
      path: "/ExpenseReport",
      component: <ExpenseReport />,
      title: "ค่าใช้จ่าย",
    },
    { path: "/Commission", component: <Commission />, title: "คอมมิชชัน" },
    {
      path: "/ConfirmCommission",
      component: <ConfirmCommissionBody />,
      title: "ยืนยันค่าคอม",
    },
    {
      path: "/Dashboard-Overview",
      component: <DashboardOverView />,
      title: "แดชบอร์ดยอดสั่งซื้อ",
    },
    {
      path: "/Dashboard-CEO",
      component: <DashboardCEO />,
      title: "แดชบอร์ดผู้บริหาร",
    },
  ],
};

function App() {
  const { isUserLoading } = useAppContext();

  if (isUserLoading) {
    return (
      <div className="fixed size-full flex justify-center items-center">
        <CircularProgress aria-label="Loading..." size="lg" color="primary" className="" />
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
            </Routes>
            <Toaster richColors />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
