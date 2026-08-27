"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type HomeStatus = "empty" | "nesting" | "living";

interface Moment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_role: "human" | "pet";
  tags: string[];
}

const MOCK_MOMENTS: Moment[] = [
  {
    id: "1",
    content: "วันแรกที่บ้านใหม่! มูมู่ยังเขินๆ อยู่เลย 😸",
    created_at: new Date().toISOString(),
    author_name: "มูมู่",
    author_role: "pet",
    tags: ["พ่อ", "แม่"],
  },
];

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<HomeStatus>("living");
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Debug Button */}
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="fixed top-4 right-4 z-50 bg-gray-200 text-xs px-3 py-1 rounded-full opacity-50 hover:opacity-100"
      >
        🔧 Debug: {status}
      </button>

      {showDebug && (
        <div className="fixed top-12 right-4 z-50 bg-white shadow-xl rounded-lg p-2 border text-xs">
          <button onClick={() => { setStatus("empty"); setShowDebug(false); }} className="block w-full text-left p-2 hover:bg-gray-100">1. Empty</button>
          <button onClick={() => { setStatus("nesting"); setShowDebug(false); }} className="block w-full text-left p-2 hover:bg-gray-100">2. Nesting</button>
          <button onClick={() => { setStatus("living"); setShowDebug(false); }} className="block w-full text-left p-2 hover:bg-gray-100">3. Living</button>
        </div>
      )}

      <header className="px-6 pt-12 pb-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          {status === "empty" ? "ยินดีต้อนรับ" : "บ้านเหมียวอบอุ่น"}
        </h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="px-4 mt-6">
        {status === "empty" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-bold mb-2">ยังไม่มีบ้านหลังแรก</h2>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              + สร้างบ้านหลังแรก
            </button>
          </div>
        )}

        {status === "nesting" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">บ้านพร้อมแล้ว... ขาดแค่น้อง!</h2>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              🐱 รับน้องเข้าบ้าน
            </button>
          </div>
        )}

        {status === "living" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
            {MOCK_MOMENTS.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${m.author_role === 'pet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {m.author_name[0]}
                  </div>
                  <span className="font-bold text-sm">{m.author_name}</span>
                </div>
                <p className="text-gray-700 text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {status === "living" && (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center text-2xl">
          +
        </button>
      )}
    </div>
  );
}
