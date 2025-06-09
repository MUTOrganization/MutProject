import { Lock } from "lucide-react";

export default function Page403() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <Lock className="w-24 h-24 mx-auto text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <p className="text-2xl text-gray-600 mb-8">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
        <button 
          onClick={() => window.history.back()} 
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          กลับไปหน้าก่อนหน้า
        </button>
      </div>
    </div>
  );
}
