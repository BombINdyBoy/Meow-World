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

  useEffect(() => {
    async function checkData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // ดึงข้อมูลบ้านและสัตว์เลี้ยง
        const { data: members } = await supabase
          .from("home_members")
          .select("homes(name), pets(id)")
          .eq("user_id", session.user.id)
          .single();

        if (members?.homes) {
          // แก้ไขจุด Error: เข้าถึง homes อย่างปลอดภัย
          const homeData = Array.isArray(members.homes) ? members.homes[0] : members.homes;
          setHomeName(homeData?.name || "บ้านของเรา");
          
          // ตรวจสอบว่ามีสัตว์เลี้ยงหรือไม่
          const hasPetData = Array.isArray(members.pets) && members.pets.length > 0;
          setHasPets(hasPetData);
        } else {
          setHasPets(false);
        }

      } catch (error) {
        console.error("Error loading home:", error);
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
          <div className="text-5xl mb-4">🏠</div>
          <p className="text-gray-500 font-medium">กำลังเปิดประตูบ้าน...</p>
        </div>
      </div>
    );
  }

  // กรณีที่ 1: ยังไม่มีสัตว์เลี้ยง (Nesting Mode)
  if (!hasPets) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner rotate-3">
          <span className="text-6xl">📦</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{homeName}</h1>
        <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
          บ้านพร้อมแล้ว! มาต้อนรับสมาชิกใหม่กันเถอะ
        </p>
        
        <button 
          onClick={() => alert("ฟังก์ชันรับน้องเข้าบ้าน (กำลังพัฒนา)")}
          className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🐱</span> รับน้องเข้าบ้าน
        </button>
        
        <button 
          onClick={() => alert("ฟังก์ชันเชิญเพื่อน (กำลังพัฒนา)")}
          className="mt-4 text-blue-600 font-medium hover:underline text-sm"
        >
          หรือ ชวนคนในบ้านมาร่วมสร้าง
        </button>
      </div>
    );
  }

  // กรณีที่ 2: มีสัตว์เลี้ยงแล้ว (Living Mode)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">ยินดีต้อนรับสู่บ้าน!</h2>
        <p className="text-gray-600 mb-6">คุณมีสัตว์เลี้ยงในบ้านแล้ว พร้อมเริ่มบันทึกเรื่องราวหรือยัง?</p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition">
          + บันทึกเรื่องราวแรก
        </button>
      </div>
    </div>
  );
}
