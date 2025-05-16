import React, { useEffect, useState } from "react";
import { Input, Button, Card } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LockIcon,
  EyeIcon,
  LoginIcon,
  CloseEyeIcon,
} from "../../component/Icons";
import { useAppContext } from "../../contexts/AppContext";
import { Toaster, toast } from "sonner";

function Login() {
  const { currentUser, isUserLoading, login } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadSubmit, setisLoadSubmit] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Path เดิมที่ผู้ใช้พยายามเข้าก่อนถูก redirect ไป /login
  const fromPath = location.state?.from?.pathname || "/home";

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    // หากผู้ใช้ login อยู่แล้ว เปลี่ยนเส้นทางไป path เดิม
    if (!isUserLoading && currentUser) {
      navigate(fromPath, { replace: true });
    }
  }, [currentUser, isUserLoading, fromPath, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setisLoadSubmit(true);
    const result = await login(username, password);
    setisLoadSubmit(false);

    if (result === "success") {
      localStorage.removeItem("managementMenu");
      navigate(fromPath, { replace: true }); // เปลี่ยนไป path เดิม
    } else if (result === "invalid") {
      setIsValid(true);
    } else {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-4/5 md:w-2/3 lg:w-1/2 bg-white rounded-3xl shadow-lg overflow-hidden h-2/3">
        {/* Left Side - Login Form */}
        <div
          className="w-full xl:w-1/2 bg-white p-8 flex flex-col justify-center items-center bg-oap"
          style={{
            backgroundImage: "url('/img/bgLogin.png')",
            backgroundSize: "180%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "80% 100%",
          }}
        >
          <img
            src="/img/logoMenu.png"
            alt="Logo Title"
            className="mb-5 p-0"
            style={{ width: "300px", height: "100px" }}
          />
          <div className="flex justify-start w-64">
            <div className="text-center font-semibold text-lg">เข้าสู่ระบบ</div>
          </div>
          
          <form onSubmit={(e) => handleSubmit(e)}>
            <Input
              placeholder="กรอกชื่อผู้ใช้"
              color={!isValid ? "" : "danger"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPress={() => {
                setIsValid(false);
              }}
              className="mb-4 mt-3 w-full"
              startContent={
                <LoginIcon className="text-2xl pointer-events-none flex-shrink-0 mr-5" />
              }
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={!isValid ? "" : "danger"}
              placeholder="กรอกรหัสผ่าน"
              onPress={() => {
                setIsValid(false);
              }}
              startContent={
                <LockIcon className="text-2xl pointer-events-none flex-shrink-0 mr-5" />
              }
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                  variant="light"
                >
                  {isVisible ? (
                    <CloseEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="mb-4 mt-1 w-full"
            />
            {isValid && (
            <div className="text-danger text-center font-bold mb-4">
              ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            </div>
          )}
            <Button
              className="w-64 mb-4 bg-custom-redlogin border-custom-redlogin text-white shadow-lg shadow-custom-redlogin-effect"
              type="submit"
              isLoading={isLoadSubmit}
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </div>

        {/* Right Side - Welcome Message */}
        <Card className="w-1/2 bg-custom-red text-white p-8 hidden  xl:flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Hopeful One</h2>
          <p className="text-xl mb-8">Your All-In-One</p>
          <img
            src="/img/infoLogin.png"
            alt="Logo Title"
            className="mb-5 p-0"
            style={{ width: "300px", height: "300px" }}
          />
        </Card>
      </div>
      <Toaster richColors />
    </div>
  );
}

export default Login;
