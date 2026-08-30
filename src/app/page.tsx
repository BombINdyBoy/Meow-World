"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
// import CreateMomentModal from "@/components/CreateMomentModal"; // ยังไม่ต้องใช้ตอนนี้

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasPets, setHasPets] = useState(false);
  const [homeName, setHomeName] = useState("บ้านของเรา");

  useEffect(() => {
    async function checkData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // ตรวจสอบว่ามีสัตว์เลี้ยงหรือยัง
        const { data: members } = await supabase
          .from("home_members")
          .select("homes(id, name), pets(id)")
          .eq("user_id", session.user.id)
          .single();

        if (members?.homes) {
          setHomeName(members.homes.name);
          // เช็คว่ามีpetsไหม (ในทางเทคนิคอาจต้อง query แยก แต่ตอนนี้สมมติว่ายังไม่มี)
          setHasPets(!!members.pets && members.pets.length > 0);
        }
      } catch (error) {
        console.error(error);
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
          <div className="text-4xl mb-2">🐱</div>
          <p className="text-gray-500">กำลังเปิดประตูบ้าน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">{homeName}</h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="p-6 max-w-md mx-auto">
        
        {/* กรณี: มีบ้านแล้ว แต่ยังไม่มีสัตว์เลี้ยง */}
        {!hasPets && (
          <div className="flex flex-col items-center text-center py-10 animate-fade-in-up">
            <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner rotate-3">
              <span className="text-6xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">บ้านพร้อมแล้ว... ขาดแค่เจ้าเหมียว!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              มาสร้าง Passport และบันทึกเรื่องราวแรกของน้องกันเถอะ<br/>
              เป็นก้าวแรกของความทรงจำที่ไม่มีวันลืม
            </p>
            
            <button 
              onClick={() => router.push('/pets/create')} // ไปหน้าเพิ่มแมว
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mb-4"
            >
              <span className="text-2xl">🐱</span> รับน้องเข้าบ้าน
            </button>

            <button 
              onClick={() => alert("ฟังก์ชันเชิญครอบครัว (กำลังพัฒนา)")}
              className="w-full bg-white text-gray-700 border border-gray-200 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl">👨‍👩‍👧‍👦</span> ชวนคนในบ้านมาร่วมสร้าง
            </button>
          </div>
        )}

        {/* กรณี: มีสัตว์เลี้ยงแล้ว แต่ยังไม่มีเรื่องราว (Moments) */}
        {hasPets && (
          <div className="flex flex-col items-center text-center py-10 animate-fade-in-up">
             <div className="w-32 h-32 bg-orange-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner -rotate-2">
              <span className="text-6xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">พร้อมบันทึกโมเมนต์แรก!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              ถ่ายรูป กินข้าว นอนหลับ หรือก้าวแรกที่บ้านใหม่<br/>
              ทุกเรื่องราวล้วนมีความหมาย
            </p>
            
            <button 
              onClick={() => alert("เปิด Modal บันทึกเรื่องราว")}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-2xl">✨</span> เริ่มสร้างเรื่องราวแรก
            </button>
          </div>
        )}

      </main>
    </div>
  );
}