"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- Types ---
interface Pet {
  id: string;
  name: string;
  breed?: string | null;
  avatar_url?: string | null;
}

interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  media_urls?: string[] | null;
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [homeId, setHomeId] = useState<string | null>(null);
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  
  // View Modes: 'empty' (ไม่มีอะไร), 'nesting' (มีบ้านรอแมว), 'living' (มีครบ)
  const [viewMode, setViewMode] = useState<"empty" | "nesting" | "living">("empty");

  useEffect(() => {
    async function initData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // 1. ดึงข้อมูลสมาชิกและบ้าน
        const { data: memberData, error: memberError } = await supabase
          .from("home_members")
          .select(`
            homes (id, name),
            pets (id, name, breed, avatar_url)
          `)
          .eq("user_id", session.user.id)
          .single();

        if (memberError || !memberData) {
          // ถ้าไม่มีข้อมูลเลย -> สร้างบ้านใหม่
          await createHome(session.user);
          setViewMode("empty"); 
          // Note: หลังสร้างบ้านเสร็จ อาจต้อง reload 1 ครั้งเพื่อให้ข้อมูลมา แต่เพื่อความง่ายเราจะให้ user กดปุ่มสร้างเองในขั้นตอนนี้หรือทำ Auto-reload ในขั้นสูง
          // สำหรับตอนนี้ให้แสดงหน้าว่างไปก่อน
          setHomeName("บ้านหลังใหม่ของคุณ");
          setIsLoading(false);
          return;
        }

        // 2. จัดการข้อมูลบ้าน (TypeScript Safe)
        const home = Array.isArray(memberData.homes) ? memberData.homes[0] : memberData.homes;
        
        if (home) {
          setHomeId(home.id);
          setHomeName(home.name || "บ้านของเรา");

          // 3. จัดการข้อมูลสัตว์เลี้ยง (TypeScript Safe)
          const petsList = Array.isArray(memberData.pets) ? memberData.pets : (memberData.pets ? [memberData.pets] : []);
          setPets(petsList as Pet[]);

          if (petsList.length > 0) {
            // มีแมวแล้ว -> โหลดเรื่องราว
            setViewMode("living"); // ตั้งค่าเริ่มต้นเป็น living ก่อน
            
            const { data: momentsData } = await supabase
              .from("life_journey_events")
              .select("*")
              .eq("home_id", home.id)
              .order("created_at", { ascending: false })
              .limit(10);

            if (momentsData && momentsData.length > 0) {
              setMoments(momentsData as Moment[]);
              setViewMode("living");
            } else {
              setViewMode("nesting"); // มีแมวแต่ยังไม่มีเรื่องราว
            }
          } else {
            setViewMode("nesting"); // มีบ้านแต่ยังไม่มีแมว
          }
        } else {
          setViewMode("empty");
        }

      } catch (error) {
        console.error("Init Error:", error);
        setViewMode("empty");
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  // ฟังก์ชันสร้างบ้าน (เรียกเมื่อไม่มีข้อมูล)
  const createHome = async (user: any) => {
    const newHome = { name: "บ้านของเรา", owner_id: user.id };
    const { data, error } = await supabase.from("homes").insert(newHome).select().single();
    if (!error && data) {
      await supabase.from("home_members").insert({ home_id: data.id, user_id: user.id, role: "owner" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🏠</div>
          <p className="text-gray-500 font-medium">กำลังเตรียมบ้าน...</p>
        </div>
      </div>
    );
  }

  // --- RENDER ตาม Mode ---

  // 1. Empty / Need Setup
  if (viewMode === "empty" || !homeId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ยินดีต้อนรับสู่ Meow World</h1>
          <p className="text-gray-500 mb-6">ระบบกำลังเตรียมพื้นที่ส่วนตัวให้คุณ...</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">รีเฟรชหน้าจอ</button>
        </div>
      </div>
    );
  }

  // 2. Nesting (มีบ้าน รอรับแมว)
  if (viewMode === "nesting") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 text-6xl">🐾</div>
           <div className="absolute bottom-20 right-10 text-6xl">🧶</div>
        </div>

        <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white">
          <div className="text-7xl mb-6 animate-bounce">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{homeName}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            บ้านหลังใหม่พร้อมแล้ว!<br/>
            มาต้อนรับสมาชิกขนฟูคนแรกกันเถอะ
          </p>
          
          <button 
            onClick={() => alert("เปิดหน้าเพิ่มสัตว์เลี้ยง (กำลังพัฒนา)")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
          >
            <span>🐱</span> รับน้องเข้าบ้าน
          </button>
          
          <button 
             onClick={() => alert("เปิดหน้าเชิญสมาชิก (กำลังพัฒนา)")}
             className="mt-4 text-gray-500 hover:text-gray-800 font-medium text-sm underline decoration-dashed"
          >
            หรือ ชวนคนในบ้านมาร่วมสร้าง
          </button>
        </div>
      </div>
    );
  }

  // 3. Living (มีแมว มีเรื่องราว)
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{homeName}</h1>
            <p className="text-sm text-gray-500">{pets.length} สมาชิกขนฟู • {moments.length} เรื่องราว</p>
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🏠</div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Pets Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🐾</span> สมาชิกในบ้าน
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {pets.map((pet) => (
              <div key={pet.id} className="flex-shrink-0 w-28 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 overflow-hidden flex items-center justify-center text-2xl">
                  {pet.avatar_url ? "🖼️" : "🐱"}
                </div>
                <p className="font-bold text-gray-900 text-sm truncate">{pet.name}</p>
                <p className="text-xs text-gray-500">{pet.breed || "แมวเหมียว"}</p>
              </div>
            ))}
            <button className="flex-shrink-0 w-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition">
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs font-medium">เพิ่มน้อง</span>
            </button>
          </div>
        </section>

        {/* Moments Feed */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>✨</span> ความทรงจำล่าสุด
            </h2>
            <button className="text-xs text-orange-600 font-medium hover:underline">ดูทั้งหมด</button>
          </div>
          
          {moments.length === 0 ? (
             <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-200">
               <p className="text-gray-400 mb-4">ยังไม่มีเรื่องราวในบ้าน</p>
               <button onClick={() => alert("เปิด Modal บันทึกเรื่องราว")} className="text-orange-600 font-bold text-sm hover:underline">เริ่มเขียนเรื่องแรก</button>
             </div>
          ) : (
            <div className="space-y-4">
              {moments.map((m) => (
                <article key={m.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">M</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">สมาชิกในบ้าน</p>
                      <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString('th-TH')}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{m.content}</p>
                  {m.media_urls && m.media_urls.length > 0 && (
                    <div className="mt-3 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      📷 รูปภาพ/วิดีโอ
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FAB Button */}
      <button 
        onClick={() => alert("เปิด Modal บันทึกเรื่องราว")}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition z-20"
      >
        <span className="text-3xl font-light">+</span>
      </button>
    </div>
  );
}
