import { Button } from "@heroui/react";
import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Page403() {

  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
      navigate('/');
    }
  }, [counter]);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <LockKeyhole className="w-24 h-24 mx-auto text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <p className="text-2xl text-gray-600 mb-8">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <p className="text-xl text-red-500 font-bold mb-8">กำลังนำท่านกลับหน้าหลักใน {counter} วินาที</p>
        <Button 
          color="primary"
          variant="solid"
          className="text-sm font-medium shadow-md hover:scale-105 transition-transform"
          onPress={() => navigate(-1)}
        >
          กลับไปหน้าก่อนหน้า
        </Button>
      </div>
    </div>
  );
}
