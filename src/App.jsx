import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./styles/App.css";
import DefaultLayout from "./layouts/default";
import { useAppContext } from "./contexts/AppContext";
import { CircularProgress } from "@heroui/react";
import { Toaster } from "sonner";
import FloatingButton from "./pages/Chat/FloatingButton";
import { SocketProvider } from "./contexts/SocketContext";
import ChatContextProvider from "./pages/Chat/ChatContext";
import ChangeProfileImageModal from "./component/ChangeProfileImageModal";



const Management = lazy(() => import("./pages/Management/Management"));
const Setting = lazy(() => import("./pages/Setting/Setting"));
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Commission = lazy(() => import("./pages/Commission/Commission"));
const ExpenseReport = lazy(() => import("./pages/ExpenseReport/ExpenseReport"));
const DashboardCEO = lazy(() => import("./pages/DashboardCEO/DashboardCEO"));
const Page403 = lazy(() => import("./pages/page403"));
const Page404 = lazy(() => import("./pages/Page404"));

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isUserLoading, accessCheck } = useAppContext();

  useEffect(() => {
    if (!isUserLoading) {
      if (!currentUser) {
        navigate("/login", { replace: true, state: { from: location } });
      } else {
        const route = routes.find(route => route.path === location.pathname);
        if (!route) {
          console.log("ไม่พบหน้าที่คุณกำลังค้นหา");
          return navigate("/notfound", { replace: true });
        }
        if (!accessCheck.haveAny(route.access)) {
          console.log("ไม่มีสิทธิ์เข้าถึงหน้านี้");
          return navigate("/forbidden", { replace: true });
        }
      }
    }
  }, [currentUser, isUserLoading, location]);

  if (isUserLoading) {
    // อาจโชว์ Loading หรือเปล่า
    return null;
  }

  return currentUser ? children : null;
}

const routes = [
  { path: "/home", component: <Home />, title: "หน้าแรก", access: [] },
  { path: "/setting", component: <Setting />, title: "การตั้งค่า", access: [] },
  { path: "/management", component: <Management />, title: "การจัดการ", access: [] },
  {
    path: "/ExpenseReport",
    component: <ExpenseReport />,
    title: "ค่าใช้จ่าย",
    access: []
  },
  { path: "/Commission", component: <Commission />, title: "คอมมิชชัน", access: [] },
  {
    path: "/Dashboard-CEO",
    component: <DashboardCEO />,
    title: "แดชบอร์ดผู้บริหาร",
    access: []
  },
];

function App() {
  const { isUserLoading, isChangeProfileImageModalOpen, setIsChangeProfileImageModalOpen } = useAppContext();

  if (isUserLoading) {
    return (
      <div className="fixed size-full flex justify-center items-center">
        <CircularProgress aria-label="Loading..." size="lg" color="primary" className="" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="fixed size-full flex justify-center items-center"><CircularProgress aria-label="Loading..." size="lg" color="primary" className="" /></div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forbidden" element={<Page403 />} />
        <Route path="/notfound" element={<Page404 />} />
        <Route path="/*"
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Routes>
                  {routes.map((route) => (
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
                <ChangeProfileImageModal isOpen={isChangeProfileImageModalOpen} onClose={() => setIsChangeProfileImageModalOpen(false)} />
                <ChatContextProvider>
                  <FloatingButton />
                </ChatContextProvider>
              </SocketProvider>
              <Toaster richColors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
