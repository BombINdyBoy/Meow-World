"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import CreateMomentModal from "@/components/CreateMomentModal";
// import QRInviteModal from "@/components/QRInviteModal"; // ถ้ายังไม่มีให้คอมเมนต์ไว้ก่อน

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [hasPets, setHasPets] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [homeId, setHomeId] = useState<string | null>(null);

  useEffect(() => {
    async function checkData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // ตรวจสอบว่ามีบ้านและสัตว์เลี้ยงหรือยัง
        const { data: members, error } = await supabase
          .from("home_members")
          .select("homes(id, name), pets(id)")
          .eq("user_id", session.user.id)
          .single();

        if (members?.homes) {
          // แก้ Error: ใช้ Optional Chaining และเช็คค่าให้ชัดเจน
          setHomeName(members.homes.name || "บ้านของเรา");
          setHomeId(members.homes.id);
          
          // เช็คว่ามี pets ไหม (จัดการกรณีเป็น array หรือ null)
          const petList = members.pets;
          const hasPetData = Array.isArray(petList) && petList.length > 0;
          setHasPets(hasPetData);
        } else {
          // กรณีไม่มีบ้าน (ควรสร้างให้อัตโนมัติ หรือแจ้งเตือน)
          setHomeName("บ้านใหม่");
          setHasPets(false);
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
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-500">กำลังเปิดประตูบ้าน...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">{homeName}</h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {!hasPets ? (
          /* โหมด: ยังไม่มีสัตว์เลี้ยง */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">บ้านพร้อมแล้ว... ขาดแค่เจ้าเหมียว!</h2>
            <p className="text-gray-500 mb-8">มาสร้าง Passport และบันทึกเรื่องราวแรกของน้องกันเถอะ</p>
            
            <button 
              onClick={() => router.push('/pets/create')} // ต้องมีหน้านี้ หรือเปลี่ยนเป็น alert
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
            >
              🐱 รับน้องเข้าบ้าน
            </button>
            
            <button 
              onClick={() => alert('ฟีเจอร์ชวนเพื่อน กำลังพัฒนาครับ!')} 
              className="mt-4 w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              👨‍👩‍👧 ชวนคนในบ้านมาร่วมสร้าง
            </button>
          </div>
        ) : (
          /* โหมด: มีสัตว์เลี้ยงแล้ว (Nesting Mode) */
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!</h2>
            <p className="text-gray-500 mb-8">มาบันทึกโมเมนต์แรกของน้องกันเถอะ</p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition"
            >
              ✍️ เริ่มสร้างเรื่องราวแรก
            </button>
          </div>
        )}
      </main>

      {/* Modal สร้างเรื่องราว */}
      {homeId && (
        <CreateMomentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          homeId={homeId}
          onCreated={() => {
            setIsModalOpen(false);
            alert("บันทึกสำเร็จ! (เร็วๆ นี้จะแสดงในฟีด)");
          }}
        />
      )}
    </div>
  );
}
