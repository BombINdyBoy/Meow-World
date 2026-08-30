"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [hasPets, setHasPets] = useState(false);
  const [hasMembers, setHasMembers] = useState(false);

  useEffect(() => {
    async function checkData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // ดึงข้อมูลบ้าน, สมาชิก, และสัตว์เลี้ยง
        const { data: members } = await supabase
          .from("home_members")
          .select("homes(name), pets(id)")
          .eq("user_id", session.user.id)
          .single();

        if (members?.homes) {
          setHomeName((members.homes as any[])?.[0]?.name || "บ้านของเรา");
          setHasPets(Array.isArray(members.pets) && members.pets.length > 0);
          // สมมติว่ามีสมาชิกอย่างน้อย 1 คนคือตัวเรา
          setHasMembers(true); 
        }
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    checkData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <p className="text-gray-500 font-medium">กำลังเตรียมบ้าน...</p>
        </div>
      </div>
    );
  }

  // --- SCENE 1: ยังไม่มีสัตว์เลี้ยง (Empty State แบบ Graphic) ---
  if (!hasPets) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        
        {/* Background Elements (ตกแต่งฉาก) */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        {/* Main Graphic: กล่องปริศนา */}
        <div className="relative z-10 mb-8 group cursor-pointer transition-transform hover:scale-105 duration-500">
          <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl border-4 border-blue-100 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="text-8xl relative z-10 drop-shadow-lg">📦</span>
            {/* เอฟเฟกต์แสงลอดจากกล่อง */}
            <div className="absolute -bottom-10 w-32 h-32 bg-yellow-300 rounded-full filter blur-3xl opacity-20"></div>
          </div>
          <div className="mt-4 text-blue-500 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            เปิดเพื่อดู сюрприز
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 z-10">
          {homeName}
        </h1>
        <p className="text-gray-500 mb-10 max-w-xs leading-relaxed z-10">
          บ้านหลังใหม่รอเจ้าเหมียวอยู่<br/>มาเริ่มเรื่องราวด้วยกันเถอะ
        </p>
        
        {/* Action Button: กราฟิกปุ่มใหญ่ */}
        <button 
          onClick={() => router.push("/pets/create")} // จะสร้างหน้านี้ถัดไป
          className="group relative w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl">🐱</span> รับน้องเข้าบ้าน
          </span>
        </button>

        <p className="mt-6 text-xs text-gray-400 z-10">
          หรือ <button onClick={() => alert("ฟีเจอร์เชิญสมาชิกกำลังวาดภาพ...")} className="underline hover:text-blue-500 font-medium">ชวนคนในบ้านมาร่วมสร้าง</button>
        </p>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
          .animate-shimmer { animation: shimmer 1.5s infinite; }
        `}</style>
      </div>
    );
  }

  // --- SCENE 2: มีสัตว์เลี้ยงแล้ว (Living State) ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
          <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
        </div>
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
          🏠
        </div>
      </header>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ยินดีต้อนรับสู่บ้าน!</h2>
        <p className="text-gray-600 mb-8 max-w-sm">
          คุณมีสมาชิกขนฟูอยู่แล้ว พร้อมเริ่มบันทึกเรื่องราวหรือยัง?
        </p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <button className="bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20">
            📝 บันทึกเรื่องราว
          </button>
          <button className="bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:border-orange-300 hover:text-orange-500 transition">
            👨‍👩‍👧‍👦 เชิญสมาชิก
          </button>
        </div>
      </div>
    </div>
  );
}
