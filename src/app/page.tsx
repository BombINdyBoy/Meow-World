"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- Types ---
interface Pet {
  id: string;
  name: string;
  breed?: string;
  avatar_url?: string;
  birth_date?: string;
  gender?: string;
}

interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  media_urls?: string[];
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  // States
  const [session, setSession] = useState<any>(null);
  const [homeName, setHomeName] = useState("บ้านของเรา");
  const [pets, setPets] = useState<Pet[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"onboarding" | "nesting" | "living">("onboarding");
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMomentModalOpen, setIsMomentModalOpen] = useState(false);

  // Form States (Pet)
  const [newPetName, setNewPetName] = useState("");
  const [newPetBreed, setNewPetBreed] = useState("");
  const [isCreatingPet, setIsCreatingPet] = useState(false);

  // 1. Initialize
  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setSession(session);

      // Fetch Home & Pets
      const { data: memberData } = await supabase
        .from("home_members")
        .select("homes(name), pets(id, name, breed, avatar_url, birth_date, gender)")
        .eq("user_id", session.user.id)
        .single();

      if (memberData?.homes) {
        setHomeName(memberData.homes.name || "บ้านของเรา");
        if (memberData.pets) {
          setPets(memberData.pets);
          setViewMode("living"); // มีแมวแล้ว -> Living Mode (หรือ Nesting ถ้ายังไม่มีเรื่องราว)
          
          // Fetch Moments
          const { data: momentsData } = await supabase
            .from("life_journey_events")
            .select("*")
            .eq("home_id", memberData.homes.id) // ต้องมี home_id ใน memberData หรือ query แยก
            .order("created_at", { ascending: false })
            .limit(10);
            
          if (momentsData) setMoments(momentsData as any);
          if (momentsData && momentsData.length === 0) setViewMode("nesting");
        } else {
          setViewMode("nesting"); // มีบ้าน แต่ไม่มีแมว
        }
      } else {
        // สร้างบ้านอัตโนมัติถ้ายังไม่มี
        await createHome(session.user);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  async function createHome(user: any) {
    const { data, error } = await supabase.from("homes").insert({ name: "บ้านของเรา", owner_id: user.id }).select().single();
    if (data && !error) {
      await supabase.from("home_members").insert({ home_id: data.id, user_id: user.id, role: "owner" });
      setHomeName(data.name);
    }
  }

  // 2. Handle Create Pet
  async function handleCreatePet() {
    if (!newPetName) return;
    setIsCreatingPet(true);
    
    // หา home_id อีกครั้งเพื่อความชัวร์
    const { data: memberData } = await supabase.from("home_members").select("home_id").eq("user_id", session.user.id).single();
    if (!memberData) { setIsCreatingPet(false); return; }

    const { error } = await supabase.from("pets").insert({
      home_id: memberData.home_id,
      name: newPetName,
      breed: newPetBreed,
      avatar_url: null, // TODO: Upload รูป
      gender: "unknown",
      birth_date: null
    });

    if (!error) {
      alert("ต้อนรับสมาชิกใหม่! 🎉");
      setIsPetModalOpen(false);
      setNewPetName("");
      setNewPetBreed("");
      window.location.reload(); // Reload เพื่อโหลดข้อมูลใหม่
    } else {
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
    setIsCreatingPet(false);
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-orange-50"><div className="animate-bounce text-4xl">🐱</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden font-sans">
      
      {/* --- HEADER --- */}
      <header className="px-6 pt-12 pb-4 bg-white/80 backdrop-blur sticky top-0 z-20 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{homeName}</h1>
          <p className="text-xs text-gray-500">{pets.length} สมาชิกขนฟู</p>
        </div>
        <button onClick={() => setIsInviteModalOpen(true)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          👥
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto">
        
        {/* --- MODE 1: NESTING (มีบ้าน ไม่มีแมว) --- */}
        {viewMode === "nesting" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up text-center">
            <div className="relative mb-8 group cursor-pointer" onClick={() => setIsPetModalOpen(true)}>
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative w-40 h-40 bg-white rounded-3xl shadow-xl border-4 border-blue-50 flex items-center justify-center transform group-hover:scale-105 transition duration-300">
                <span className="text-6xl">📦</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                เปิดเลย!
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">บ้านหลังใหม่รอเจ้าเหมียวอยู่</h2>
            <p className="text-gray-500 mb-8 max-w-xs">มาเริ่มเรื่องราวด้วยกันเถอะ</p>
            
            <button 
              onClick={() => setIsPetModalOpen(true)}
              className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🐱</span> รับน้องเข้าบ้าน
            </button>
            <p className="mt-4 text-sm text-gray-400">หรือ</p>
            <button onClick={() => setIsInviteModalOpen(true)} className="mt-2 text-blue-600 font-medium hover:underline">ชวนคนในบ้านมาร่วมสร้าง</button>
          </div>
        )}

        {/* --- MODE 2: LIVING (มีแมวแล้ว) --- */}
        {viewMode === "living" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Pet Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {pets.map(pet => (
                <div key={pet.id} className="flex-shrink-0 w-32 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 overflow-hidden flex items-center justify-center text-2xl">
                    {pet.avatar_url ? <Image src={pet.avatar_url} alt={pet.name} width={64} height={64} className="object-cover"/> : "🐱"}
                  </div>
                  <span className="font-bold text-gray-800 text-sm truncate w-full">{pet.name}</span>
                  <span className="text-[10px] text-gray-400">{pet.breed || "แมว"}</span>
                  <button onClick={() => router.push(`/passport/${pet.id}`)} className="mt-2 text-[10px] bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 w-full">ดู Passport</button>
                </div>
              ))}
              <button onClick={() => setIsPetModalOpen(true)} className="flex-shrink-0 w-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition">
                <span className="text-2xl mb-1">+</span>
                <span className="text-[10px] font-medium">เพิ่มน้อง</span>
              </button>
            </div>

            {/* Moments Feed */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg">ความทรงจำ</h3>
                <button onClick={() => setIsMomentModalOpen(true)} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full font-medium hover:bg-gray-800 transition">+ บันทึก</button>
              </div>
              
              {moments.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
                  <p className="text-gray-400 mb-4">ยังไม่มีเรื่องราวในบ้าน</p>
                  <button onClick={() => setIsMomentModalOpen(true)} className="text-blue-600 font-bold hover:underline">เริ่มเขียนเรื่องแรก</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {moments.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">M</div>
                        <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString('th-TH')}</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- FAB --- */}
      {viewMode === "living" && (
        <button onClick={() => setIsMomentModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition z-30">
          <span className="text-2xl">+</span>
        </button>
      )}

      {/* --- MODALS (Inline for simplicity) --- */}
      
      {/* 1. Add Pet Modal */}
      {isPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-scale-up">
            <h2 className="text-xl font-bold mb-4 text-center">🐱 รับน้องเข้าบ้าน</h2>
            <input type="text" placeholder="ชื่อน้องแมว" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newPetName} onChange={(e) => setNewPetName(e.target.value)} />
            <input type="text" placeholder="สายพันธุ์ (เช่น วิเชียรมาศ)" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500" value={newPetBreed} onChange={(e) => setNewPetBreed(e.target.value)} />
            <button onClick={handleCreatePet} disabled={isCreatingPet || !newPetName} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition">
              {isCreatingPet ? "กำลังสร้าง..." : "ยืนยันการรับน้อง"}
            </button>
            <button onClick={() => setIsPetModalOpen(false)} className="w-full mt-2 text-gray-500 py-2 text-sm">ยกเลิก</button>
          </div>
        </div>
      )}

      {/* 2. Invite Modal (Simple Version) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏠</div>
            <h2 className="text-xl font-bold mb-2">ชวนคนในบ้าน</h2>
            <p className="text-sm text-gray-500 mb-6">สแกน QR นี้เพื่อร่วมสร้างบ้านไปด้วยกัน</p>
            <div className="bg-gray-100 w-48 h-48 mx-auto rounded-xl flex items-center justify-center mb-4">
              <span className="text-gray-400">QR Code Placeholder</span>
            </div>
            <button onClick={() => setIsInviteModalOpen(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">ปิดหน้าต่าง</button>
          </div>
        </div>
      )}

      {/* 3. Moment Modal (Simple Version) */}
      {isMomentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">✨ บันทึกเรื่องราว</h2>
            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="วันนี้เกิดอะไรขึ้นกับน้องบ้าง?"></textarea>
            <div className="flex gap-2">
              <button onClick={() => setIsMomentModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">ยกเลิก</button>
              <button onClick={() => { alert("บันทึกสำเร็จ (Mockup)"); setIsMomentModalOpen(false); }} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold">บันทึก</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
