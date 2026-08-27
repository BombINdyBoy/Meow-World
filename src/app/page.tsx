"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type HomeStatus = "empty" | "nesting" | "living";

interface Moment {
  id: string;
  content: string;
  author_name: string;
  author_role: "human" | "pet";
  created_at: string;
  tags: string[];
}

const MOCK_MOMENTS: Moment[] = [
  { id: "1", content: "วันแรกที่บ้านใหม่! มูมู่ยังเขินๆ อยู่เลย 😸", author_name: "มูมู่", author_role: "pet", created_at: new Date().toISOString(), tags: ["พ่อ", "แม่"] },
  { id: "2", content: "พาเจ้าดำไปฉีดวัคซีนเข็มแรก 💉", author_name: "แม่", author_role: "human", created_at: new Date().toISOString(), tags: ["เจ้าดำ"] },
];

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<HomeStatus>("living"); 
  const [showDebug, setShowDebug] = useState(false);

  // ฟังก์ชันเปลี่ยนโหมดสำหรับทดสอบ
  const toggleStatus = () => {
    if (status === "empty") setStatus("nesting");
    else if (status === "nesting") setStatus("living");
    else setStatus("empty");
    setShowDebug(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Debug Button */}
      <button onClick={() => setShowDebug(!showDebug)} className="fixed top-4 right-4 z-50 bg-gray-800 text-white text-xs px-3 py-1 rounded-full opacity-60 hover:opacity-100">
        🔧 Mode: {status}
      </button>
      
      {showDebug && (
        <div className="fixed top-12 right-4 z-50 bg-white shadow-xl rounded-lg p-2 border text-xs">
          <button onClick={toggleStatus} className="block w-full text-left p-2 hover:bg-gray-100 rounded">เปลี่ยนเป็น: {status === 'empty' ? 'Nesting' : status === 'nesting' ? 'Living' : 'Empty'}</button>
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">
          {status === 'empty' ? 'ยินดีต้อนรับ' : 'บ้านเหมียวอบอุ่น'}
        </h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="px-4 mt-6">
        {/* 1. EMPTY STATE */}
        {status === "empty" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-bold mb-2">ยังไม่มีบ้านหลังแรก</h2>
            <button onClick={() => setStatus('nesting')} className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              + สร้างบ้านหลังแรก
            </button>
          </div>
        )}

        {/* 2. NESTING STATE */}
        {status === "nesting" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">บ้านพร้อมแล้ว... ขาดแค่น้อง!</h2>
            <button onClick={() => setStatus('living')} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              🐱 รับน้องเข้าบ้าน
            </button>
          </div>
        )}

        {/* 3. LIVING STATE (Feed) */}
        {status === "living" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
            {MOCK_MOMENTS.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${m.author_role === 'pet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {m.author_name[0]}
                  </div>
                  <span className="font-bold text-sm">{m.author_name}</span>
                </div>
                <p className="text-gray-700 text-sm">{m.content}</p>
                <div className="flex gap-2 mt-2">
                  {m.tags.map(t => <span key={t} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      {status === "living" && (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center text-2xl">
          +
        </button>
      )}
    </div>
  );
}
