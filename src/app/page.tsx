"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// --- Types matching actual DB schema ---
interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  nickname?: string | null;
  avatar_url?: string | null;
}

interface JourneyEvent {
  id: string;
  pet_id: string | null;
  home_id: string;
  event_type: string;
  content?: string | null;
  media_urls?: string[] | null;
  created_at: string;
}

interface Home {
  id: string;
  name: string;
  owner_id: string;
}

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [home, setHome] = useState<Home | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [events, setEvents] = useState<JourneyEvent[]>([]);

  // View Modes
  const [viewMode, setViewMode] = useState<"empty" | "nesting" | "living">("empty");

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      // 1. ดึง home ที่ user เป็น owner
      const { data: ownedHomes } = await supabase
        .from("homes")
        .select("id, name, owner_id")
        .eq("owner_id", user.id)
        .limit(1);

      let currentHome: Home | null = null;

      if (ownedHomes && ownedHomes.length > 0) {
        currentHome = ownedHomes[0] as Home;
      }

      if (!currentHome) {
        // ยังไม่มี home -> สร้างใหม่
        const { data: newHome } = await supabase
          .from("homes")
          .insert({ name: "บ้านของเรา", owner_id: user.id })
          .select()
          .single();

        if (newHome) {
          // Add self as owner in home_members
          await supabase.from("home_members").insert({
            home_id: newHome.id,
            user_id: user.id,
            role: "owner",
          });
          currentHome = newHome as Home;
        }
      }

      setHome(currentHome);

      if (!currentHome) {
        setViewMode("empty");
        setIsLoading(false);
        return;
      }

      // 2. ดึง pets ที่อยู่ใน home นี้
      const { data: petsData } = await supabase
        .from("pets")
        .select("id, name, species, breed, nickname, avatar_url")
        .eq("home_id", currentHome.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      setPets((petsData as Pet[]) || []);

      if (!petsData || petsData.length === 0) {
        setViewMode("nesting");
        setIsLoading(false);
        return;
      }

      // 3. ดึง events สำหรับ home นี้
      const { data: eventsData } = await supabase
        .from("life_journey_events")
        .select("id, pet_id, home_id, event_type, content, media_urls, created_at")
        .eq("home_id", currentHome.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setEvents((eventsData as JourneyEvent[]) || []);
      setViewMode("living");
    } catch (error) {
      console.error("Init Error:", error);
      setViewMode("empty");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function initAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser({ id: session.user.id, email: session.user.email });
    }
    initAuth();
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  // --- RENDER ---

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

  // 1. Empty
  if (viewMode === "empty" || !home) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ยินดีต้อนรับสู่ Meow World</h1>
          <p className="text-gray-500 mb-6">ระบบกำลังเตรียมพื้นที่ส่วนตัวให้คุณ...</p>
          <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            รีเฟรชหน้าจอ
          </button>
        </div>
      </div>
    );
  }

  // 2. Nesting (มีบ้าน รอรับแมว)
  if (viewMode === "nesting") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl">🐾</div>
          <div className="absolute bottom-20 right-10 text-6xl">🧶</div>
        </div>

        <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white">
          <div className="text-7xl mb-6 animate-bounce">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{home.name}</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            บ้านหลังใหม่พร้อมแล้ว!<br />
            มาต้อนรับสมาชิกขนฟูคนแรกกันเถอะ
          </p>

          <button
            onClick={() => router.push("/pets")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition transform hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
          >
            <span>🐱</span> รับน้องเข้าบ้าน
          </button>

          <button
            onClick={() => router.push("/pets")}
            className="mt-4 text-gray-500 hover:text-gray-800 font-medium text-sm underline decoration-dashed"
          >
            หรือ ดู Passport ทั้งหมด
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
            <h1 className="text-2xl font-bold text-gray-900">{home.name}</h1>
            <p className="text-sm text-gray-500">
              {pets.length} สมาชิกขนฟู • {events.length} เรื่องราว
            </p>
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
          <div className="flex gap-4 overflow-x-auto pb-2">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => router.push(`/pets/${pet.id}`)}
                className="flex-shrink-0 w-28 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center cursor-pointer hover:shadow-md transition"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl overflow-hidden">
                  {pet.avatar_url ? (
                    <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    "🐱"
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm truncate">{pet.name}</p>
                <p className="text-xs text-gray-500">{pet.species}</p>
              </div>
            ))}
            <button
              onClick={() => router.push("/pets")}
              className="flex-shrink-0 w-28 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition"
            >
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs font-medium">เพิ่มน้อง</span>
            </button>
          </div>
        </section>

        {/* Events Feed */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>✨</span> ความทรงจำล่าสุด
            </h2>
            <button
              onClick={() => {
                if (pets[0]) router.push(`/pets/${pets[0].id}`);
              }}
              className="text-xs text-orange-600 font-medium hover:underline"
            >
              ดูทั้งหมด
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-gray-200">
              <p className="text-gray-400 mb-4">ยังไม่มีเรื่องราวในบ้าน</p>
              <button
                onClick={() => {
                  if (pets[0]) router.push(`/pets/${pets[0].id}`);
                }}
                className="text-orange-600 font-bold text-sm hover:underline"
              >
                เริ่มเขียนเรื่องแรก
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const pet = pets.find((p) => p.id === event.pet_id);
                // Parse content to extract title
                const contentLines = (event.content || "").split("\n");
                const title = contentLines[0] || "ความทรงจำ";

                return (
                  <article
                    key={event.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">
                        {pet?.name?.slice(0, 1).toUpperCase() || "🐱"}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{pet?.name || "ความทรงจำ"}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(event.created_at).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {event.event_type}
                      </span>
                    </div>
                    {title && (
                      <p className="text-gray-600 text-sm leading-relaxed mt-1">{title}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FAB Button */}
      <button
        onClick={() => {
          if (pets[0]) router.push(`/pets/${pets[0].id}`);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition z-20"
      >
        <span className="text-3xl font-light">+</span>
      </button>
    </div>
  );
}
