"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import CreateMomentModal from "@/components/CreateMomentModal"; // Import Modal ที่เราสร้างไว้

// Types
interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_role: "human" | "pet";
  media_urls?: string[] | null;
  participant_names?: string[];
}

interface HomeData {
  id: string;
  name: string;
  member_count: number;
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  // States
  const [session, setSession] = useState<any>(null);
  const [home, setHome] = useState<HomeData | null>(null);
  const [moments, setMoments] = useState<Moment[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Debug State (เอาไว้ทดสอบ UI ระหว่างพัฒนา)
  const [debugMode, setDebugMode] = useState(false);
  const [forceView, setForceView] = useState<"loading" | "empty" | "nesting" | "living">("loading");

  // 1. โหลดข้อมูลเมื่อหน้าเว็บเปิด
  useEffect(() => {
    async function initPage() {
      try {
        // ดึง Session ผู้ใช้ปัจจุบัน
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login"); // ถ้ายังไม่ล็อกอิน ให้เด้งไปหน้า Login
          return;
        }
        setSession(session);

        // ค้นหาว่าผู้ใช้คนนี้มี "บ้าน" อยู่แล้วหรือยัง (ผ่านตาราง home_members)
        const { data: memberData } = await supabase
          .from("home_members")
          .select("homes(id, name), profiles(display_name)")
          .eq("user_id", session.user.id)
          .single();

        let currentHome: HomeData | null = null;

        if (memberData && memberData.homes) {
          // กรณีที่ 1: มีบ้านอยู่แล้ว
          currentHome = {
            id: memberData.homes.id,
            name: memberData.homes.name,
            member_count: 1, // TODO: นับจำนวนสมาชิกจริง
          };
          setHome(currentHome);

          // ดึงข้อมูล Moments ในบ้านนี้
          await fetchMoments(currentHome.id);
        } else {
          // กรณีที่ 2: ยังไม่มีบ้าน (First Time User) -> สร้างบ้านให้เลยอัตโนมัติ
          const newHome = await createHomeForUser(session.user);
          if (newHome) {
            currentHome = newHome;
            setHome(newHome);
            // ไม่ต้องโหลด moments เพราะบ้านใหม่ยังไม่มีข้อมูล
          }
        }

        setForceView(currentHome && moments.length > 0 ? "living" : "nesting");
      } catch (error) {
        console.error("Error initializing page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initPage();
  }, []);

  // ฟังก์ชันสร้างบ้านใหม่
  async function createHomeForUser(user: any) {
    const homeName = "บ้านของเรา"; // ชื่อเริ่มต้น
    const displayName = user.user_metadata?.full_name || "เจ้าของบ้าน";

    // 1. อัปเดต Profile ก่อน (ถ้ายังไม่มีชื่อ)
    await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);

    // 2. สร้างบ้าน
    const { data: newHome, error: homeError } = await supabase
      .from("homes")
      .insert({ name: homeName, owner_id: user.id })
      .select()
      .single();

    if (homeError || !newHome) throw homeError;

    // 3. เพิ่มเจ้าของบ้านเข้าไปในตารางสมาชิก
    await supabase.from("home_members").insert({
      home_id: newHome.id,
      user_id: user.id,
      role: "owner",
    });

    return { id: newHome.id, name: newHome.name, member_count: 1 };
  }

  // ฟังก์ชันดึงข้อมูล Moments
  async function fetchMoments(homeId: string) {
    const { data, error } = await supabase
      .from("life_journey_events")
      .select("*") // เลือกทุกคอลัมน์ (ภายหลังอาจ select เฉพาะที่จำเป็น)
      .eq("home_id", homeId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      // แปลงข้อมูลให้ตรงกับ Interface (จำลองชื่อผู้เขียนจาก ID)
      const formattedMoments: Moment[] = data.map((item: any) => ({
        id: item.id,
        content: item.content || "",
        created_at: item.created_at,
        author_name: "สมาชิกในบ้าน", // TODO: ดึงชื่อจริงจาก profiles/pets ตาม author_id
        author_role: "human", 
        media_urls: item.media_urls,
      }));
      setMoments(formattedMoments);
    }
  }

  // Handle เมื่อ Modal บันทึกสำเร็จ
  const handleMomentCreated = () => {
    setIsModalOpen(false);
    if (home) {
      fetchMoments(home.id); // รีโหลดข้อมูลล่าสุด
      setForceView("living"); // บังคับให้เห็นโหมด Living
    }
  };

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

  // ใช้ Debug Mode หรือข้อมูลจริง
  const currentView = debugMode ? forceView : (moments.length > 0 ? "living" : "nesting");

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Debug Toggle */}
      <button 
        onClick={() => setDebugMode(!debugMode)} 
        className="fixed top-4 right-4 z-50 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-30 hover:opacity-100 transition"
      >
        🔧 {currentView}
      </button>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{home?.name || "บ้านของเรา"}</h1>
            <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
            🏠
          </div>
        </div>
      </header>

      <main className="px-4 mt-6">
        {/* --- MODE: NESTING (มีบ้าน แต่ยังไม่มีเรื่องราว) --- */}
        {currentView === "nesting" && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800">บ้านพร้อมแล้ว... ขาดแค่เรื่องราว!</h2>
            <p className="text-gray-500 mb-6 max-w-xs">มาบันทึกโมเมนต์แรกของน้องกันเถอะ</p>
            <button 
              onClick={() => setIsModalOpen(true)} // เปิด Modal
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <span>✍️</span> บันทึกเรื่องราวแรก
            </button>
          </div>
        )}

        {/* --- MODE: LIVING (มีเรื่องราวแล้ว - Feed) --- */}
        {currentView === "living" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
              <span className="text-xs text-gray-400">{moments.length} เรื่องราว</span>
            </div>

            {moments.map((m) => (
              <article key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">{m.content}</p>
                {m.media_urls && m.media_urls.length > 0 && (
                   <div className="w-full h-48 bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
                     <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                       📷 รูปภาพ/วิดีโอ
                     </div>
                   </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {/* FAB Button (แสดงเฉพาะโหมด Living) */}
      {currentView === "living" && (
        <button 
          onClick={() => setIsModalOpen(true)} // เปิด Modal
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-900/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      )}

      {/* --- MODAL COMPONENT --- */}
      {home && (
        <CreateMomentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          homeId={home.id}
          onCreated={handleMomentCreated}
        />
      )}
    </div>
  );
}