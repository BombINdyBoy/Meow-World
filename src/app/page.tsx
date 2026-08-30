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
        const { data: members, error } = await supabase
          .from("home_members")
          .select("homes(id, name), pets(id)")
          .eq("user_id", session.user.id)
          .single();

        if (error) {
           // ถ้าไม่มีข้อมูลเลย (ผู้ใช้ใหม่) ให้สร้างบ้านรอไว้ก่อน (แบบง่าย)
           // หรือปล่อยให้เป็นหน้าว่างๆ ไปก่อน
           console.log("No home found yet or error:", error);
           setHomeName("บ้านใหม่ของคุณ");
           setHasPets(false);
        } else if (members) {
          // กรณีมีข้อมูล
          if (members.homes && typeof members.homes === 'object') {
             setHomeName(members.homes[0].name || "บ้านของเรา");
          }
          
          // เช็คว่ามีสัตว์เลี้ยงไหม (pets อาจเป็น array หรือ null)
          const petsArray = Array.isArray(members.pets) ? members.pets : [];
          setHasPets(petsArray.length > 0);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-2">🐱</div>
          <p className="text-gray-500">กำลังเปิดประตูบ้าน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="px-4 mt-6">
        {!hasPets ? (
          /* โหมด: ยังไม่มีน้องแมว */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner rotate-3">
              <span className="text-6xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              มาสร้าง Passport และบันทึกเรื่องราวแรกของน้องกันเถอะ
            </p>
            
            <button 
              onClick={() => alert("ฟังก์ชันรับน้องเข้าบ้าน (กำลังพัฒนา)")}
              className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              🐱 รับน้องเข้าบ้าน
            </button>
            
            <button 
               onClick={() => alert("ฟังก์ชันชวนเพื่อน (กำลังพัฒนา)")}
               className="mt-4 text-blue-600 font-medium hover:underline"
            >
              หรือ ชวนคนในบ้านมาร่วมสร้าง
            </button>
          </div>
        ) : (
          /* โหมด: มีน้องแมวแล้ว (Feed) */
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">ความทรงจำล่าสุด</h3>
            <div className="bg-white p-6 rounded-2xl text-center text-gray-400 border border-dashed">
              ยังไม่มีเรื่องราวใหม่ ๆ <br/> กดปุ่ม + เพื่อเริ่มบันทึก
            </div>
          </div>
        )}
      </main>

      {/* ปุ่มลอย (FAB) */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition">
        <span className="text-2xl">+</span>
      </button>
    </div>
  );
}
