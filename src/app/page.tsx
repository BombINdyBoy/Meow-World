"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_role: "human" | "pet";
  media_url?: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [homeId, setHomeId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Debug State
  const [debugMode, setDebugMode] = useState(false);
  const [forceStatus, setForceStatus] = useState<"nesting" | "living">("nesting");

  useEffect(() => {
    async function initHome() {
      try {
        // 1. เช็คว่าใครล็อกอิน
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        setUserId(session.user.id);

        // 2. หาบ้านของ-user นี้ (จากตาราง home_members หรือ homes)
        // สมมติว่าเราให้ผู้ใช้ 1 คน มี 1 บ้านหลัก (หรือบ้านแรกที่เป็นเจ้าของ)
        let homeData = null;

        // ลองดึงจาก home_members ก่อน (กรณีถูกเชิญเข้าบ้าน)
        const { data: memberData } = await supabase
          .from('home_members')
          .select('homes(id, name), role')
          .eq('user_id', session.user.id)
          .single();

        if (memberData && memberData.homes) {
          homeData = memberData.homes;
        } else {
          // ถ้าไม่มี ให้ลองหาบ้านที่ user นี้เป็นเจ้าของ (owner_id)
          const { data: ownerData } = await supabase
            .from('homes')
            .select('id, name')
            .eq('owner_id', session.user.id)
            .single();

          if (ownerData) {
            homeData = ownerData;
          } else {
            // 3. ถ้ายังไม่มีบ้านเลย -> สร้างบ้านใหม่ให้อัตโนมัติ (Onboarding แบบนุ่มนวล)
            const tempHomeName = "บ้านหลังแรกของฉัน";
            const { data: newHome, error: insertError } = await supabase
              .from('homes')
              .insert({ name: tempHomeName, owner_id: session.user.id })
              .select()
              .single();

            if (insertError) throw insertError;

            // เพิ่มตัวเองเป็นสมาชิกบ้านด้วย
            await supabase.from('home_members').insert({
              home_id: newHome.id,
              user_id: session.user.id,
              role: 'owner'
            });

            homeData = newHome;
          }
        }

        if (homeData) {
          setHomeId(homeData.id);
          setHomeName(homeData.name);

          // 4. ดึง Moments ของบ้านนี้
          const { data: eventsData } = await supabase
            .from('life_journey_events')
            .select('*')
            .eq('home_id', homeData.id)
            .order('created_at', { ascending: false })
            .limit(20);

          if (eventsData && eventsData.length > 0) {
            const formattedMoments: Moment[] = eventsData.map(ev => ({
              id: ev.id,
              content: ev.content || "",
              created_at: ev.created_at,
              author_name: "สมาชิกในบ้าน", // ต้องแก้เป็นการ Join กับ profiles/pets
              author_role: "human",
              media_url: ev.media_urls?.[0] || null
            }));
            setMoments(formattedMoments);
            setForceStatus("living");
          } else {
            setForceStatus("nesting");
          }
        }

      } catch (error) {
        console.error("Error initializing home:", error);
        // กรณี Error รุนแรง ให้กลับไปหน้า Login
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    initHome();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-2">🐱</div>
          <p className="text-gray-500">กำลังเตรียมบ้าน...</p>
        </div>
      </div>
    );
  }

  const currentStatus = debugMode ? forceStatus : (moments.length > 0 ? "living" : "nesting");

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Debug Toggle */}
      <button onClick={() => setDebugMode(!debugMode)} className="fixed top-4 right-4 z-50 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-30 hover:opacity-100 transition">
        🔧 {currentStatus}
      </button>

      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="px-4 mt-6">
        {currentStatus === "nesting" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!</h2>
            <p className="text-gray-500 mb-6 max-w-xs">มาบันทึกโมเมนต์แรกของน้องกันเถอะ</p>
            <button 
              onClick={() => alert("ฟังก์ชันเปิด Modal (กำลังสร้าง)") }
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              ✍️ บันทึกเรื่องราวแรก
            </button>
          </div>
        ) : (
          <div className="space-y-4">
             {/* ส่วนแสดง Feed (Living Mode) - เหมือนโค้ดเดิม */}
             <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
             {moments.map(m => (
               <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                 <p className="font-bold text-sm">{m.author_name}</p>
                 <p className="text-gray-700 text-sm">{m.content}</p>
               </div>
             ))}
          </div>
        )}
      </main>

      {/* FAB Button */}
      {currentStatus === "living" && (
         <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center">
           <span className="text-2xl">+</span>
         </button>
      )}
    </div>
  );
}