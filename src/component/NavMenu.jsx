import React, { useState, useEffect } from "react";
import { Divider, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { MainMenu } from "./Sidebar";

function NavMenu({ onSelectMenu = () => {} }) {
  const {logout } = useAppContext();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };
  return (
    <div>
      <MainMenu isShow={true} isNavMenu={true} onSelectMenu={onSelectMenu} />
      <div className="sticky bottom-0">
        <Divider className="my-4" />
        <div className="flex justify-center items-center text-small">
          <Button
            className="w-16 mb-4 h-8 bg-custom-redlogin border-custom-redlogin text-white shadow-lg shadow-custom-redlogin-effect"
            onPress={handleLogout}
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NavMenu;
