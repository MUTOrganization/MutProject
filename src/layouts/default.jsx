import React from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
function DefaultLayout({ children, title }) {
  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-none">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow h-screen overflow-auto scrollbar-hide">
        {/* Navbar */}
        <div className="w-[97%] mx-auto">
          <Navbar title={title} />
        </div>
        {/* Main content */}
        <main className="w-[97%] mx-auto px-1 flex-grow pt-4 pb-4 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
