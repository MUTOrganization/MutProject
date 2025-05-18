import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page404() {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter === 0) {
      navigate('/');
    }
  }, [counter]);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <PackageOpen className="w-20 h-20 text-red-500 m-4" />
      <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8">ไม่พบหน้าที่คุณกำลังค้นหา</p>
      <p className="text-xl text-red-500 font-bold mb-8">กำลังนำท่านกลับหน้าหลักใน {counter} วินาที</p>
      <Button
        color="primary"
        variant="solid"
        className="text-sm font-medium shadow-md hover:scale-105 transition-transform"
        onPress={() => navigate('/')}
      >
        กลับหน้าหลัก
      </Button>
    </div>
  );
}
