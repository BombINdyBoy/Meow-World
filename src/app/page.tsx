"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// นิยามประเภทข้อมูลให้ตรงกับ Database
interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string; // ชื่อผู้เขียน (คนหรือแมว)
  author_role: "human" | "pet";
  media_url?: string | null;
  participant_names?: string[]; // ชื่อคนที่ถูกแท็ก
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [moments, setMoments] = useState<Moment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [memberCount, setMemberCount] = useState(0);
  
  // สถานะสำหรับ Debug (สามารถลบออกได้เมื่อใช้งานจริง)
  const [debugMode, setDebugMode] = useState(false);
  const [forceStatus, setForceStatus] = useState<"loading" | "empty" | "nesting" | "living">("loading");

  // ฟังก์ชันโหลดข้อมูลจริง
  useEffect(() => {
    async function fetchHomeData() {
      try {
        // 1. ดึงข้อมูลบ้าน (สมมติว่าเราเก็บ home_id ใน localStorage หรือ Session หลัง Login)
        // ในขั้นตอนนี้ เราจะจำลองว่าผู้ใช้มีบ้านแล้ว ID คือ 'demo-home-id' (ต้องแก้เป็น logic จริงภายหลัง)
        // const { data: session } = await supabase.auth.getSession();
        // if (!session) { router.push('/login'); return; }

        // 2. ดึงข้อมูล Moments ล่าสุด 20 รายการ
        // หมายเหตุ: Query นี้ต้องปรับตามโครงสร้างตารางจริงของคุณ
        const { data, error } = await supabase
          .from('life_journey_events')
          .select(`
            id,
            content,
            created_at,
            media_urls,
            event_type,
            profiles:participant_ids(display_name, role) 
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        // แปลงข้อมูลจาก DB ให้เป็นรูปแบบที่ Component ต้องการ
        const formattedMoments: Moment[] = (data || []).map((item: any) => ({
          id: item.id,
          content: item.content || "",
          created_at: item.created_at,
          media_url: item.media_urls?.[0] || null, // เอารูปแรกมาแสดง
          author_name: "มูมู่", // ต้องดึงจากความสัมพันธ์ของ pets หรือ profiles
          author_role: "pet", 
          participant_names: item.profiles?.map((p: any) => p.display_name) || []
        }));

        setMoments(formattedMoments);
        
        // กำหนดสถานะหน้าเว็บตามจำนวนข้อมูล
        if (formattedMoments.length === 0) {
           setForceStatus("nesting"); // มีบ้านแต่ยังไม่มีเรื่องราว
        } else {
           setForceStatus("living"); // มีเรื่องราวแล้ว
        }

      } catch (err) {
        console.error("Error fetching home data:", err);
        // ถ้า Error ให้แสดงหน้าว่างชั่วคราว
        setForceStatus("empty");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeData();
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

  // ใช้สถานะจาก Debug หรือจากข้อมูลจริง
  const currentStatus = debugMode ? forceStatus : (moments.length > 0 ? "living" : "nesting");

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Debug Toggle */}
      <button 
        onClick={() => setDebugMode(!debugMode)} 
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-30 hover:opacity-100 transition"
      >
        🔧 {currentStatus}
      </button>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
            <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
            🏠
          </div>
        </div>
      </header>

      <main className="px-4 mt-6">
        {/* --- MODE: NESTING (มีบ้าน แต่ยังไม่มีเรื่องราว) --- */}
        {currentStatus === "nesting" && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!</h2>
            <p className="text-gray-500 mb-6 max-w-xs">มาบันทึกโมเมนต์แรกของน้องกันเถอะ</p>
            <button 
              onClick={() => alert("เปิด Modal สร้างเรื่องราว")}
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
            >
              ✍️ บันทึกเรื่องราวแรก
            </button>
          </div>
        )}

        {/* --- MODE: LIVING (มีเรื่องราวแล้ว - Feed) --- */}
        {currentStatus === "living" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
              <span className="text-xs text-gray-400">{moments.length} เรื่องราว</span>
            </div>

            {moments.map((m) => (
              <article key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Author Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-sm ${
                    m.author_role === 'pet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {m.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{m.author_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(m.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">{m.content}</p>
                
                {/* Media (ถ้ามี) */}
                {m.media_url && (
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-3 overflow-hidden relative group">
                    {/* ในขั้นต่อไปเราจะใส่ <Image /> ตรงนี้ */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                      📷 รูปภาพ/วิดีโอ
                    </div>
                  </div>
                )}

                {/* Tags (ผู้ร่วมเหตุการณ์) */}
                {m.participant_names && m.participant_names.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-50">
                    {m.participant_names.map((name, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                        #{name}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* FAB Button (สร้างเรื่องราวใหม่) */}
      {currentStatus === "living" && (
        <button 
          onClick={() => alert("เปิด Modal สร้างเรื่องราว")}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-900/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}
    </div>
  );
}