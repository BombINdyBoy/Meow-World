"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type HomeStatus = "empty" | "nesting" | "living";

// ข้อมูลจำลอง (Mock Data)
const MOCK_MOMENTS = [
  { id: "1", content: "วันแรกที่บ้านใหม่! เขินๆ แต่ยังกินเก่ง 😸", author: "มูมู่", role: "pet", time: "2 ชม.ที่แล้ว" },
  { id: "2", content: "พาไปฉีดวัคซีนเข็มแรก หมอบอกแข็งแรงมาก 💉", author: "แม่", role: "human", time: "1 วันที่แล้ว" },
];

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<HomeStatus>("living"); // เปลี่ยนค่านี้เพื่อทดสอบโหมดต่างๆ
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* ปุ่ม Debug สำหรับเปลี่ยนโหมด */}
      <button onClick={() => setShowDebug(!showDebug)} className="fixed top-4 right-4 z-50 bg-gray-200 text-xs px-3 py-1 rounded-full opacity-50 hover:opacity-100">
        🔧 Debug: {status}
      </button>
      
      {showDebug && (
        <div className="fixed top-12 right-4 z-50 bg-white shadow-xl rounded p-2 border text-xs space-y-1">
          <button onClick={() => { setStatus("empty"); setShowDebug(false); }} className="block w-full text-left p-1 hover:bg-gray-100">1. Empty (ยังไม่มีบ้าน)</button>
          <button onClick={() => { setStatus("nesting"); setShowDebug(false); }} className="block w-full text-left p-1 hover:bg-gray-100">2. Nesting (มีบ้าน ไม่มีน้อง)</button>
          <button onClick={() => { setStatus("living"); setShowDebug(false); }} className="block w-full text-left p-1 hover:bg-gray-100">3. Living (ครบถ้วน)</button>
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">
          {status === "empty" ? "ยินดีต้อนรับ" : "บ้านเหมียวอบอุ่น"}
        </h1>
        <p className="text-sm text-gray-500">พื้นที่ความทรงจำร่วมกัน</p>
      </header>

      <main className="px-4 mt-6">
        {/* --- MODE 1: EMPTY (ยังไม่มีบ้าน) --- */}
        {status === "empty" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4 grayscale opacity-50">🏠</div>
            <h2 className="text-xl font-bold mb-2">ยังไม่มีบ้านหลังแรก</h2>
            <p className="text-gray-500 mb-6 max-w-xs">มาสร้างพื้นที่ปลอดภัยสำหรับคุณและน้องแมวกันเถอะ</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">+ สร้างบ้านหลังแรก</button>
          </div>
        )}

        {/* --- MODE 2: NESTING (มีบ้านแล้ว รอรับน้อง) --- */}
        {status === "nesting" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">บ้านพร้อมแล้ว... ขาดแค่น้อง!</h2>
            <p className="text-gray-500 mb-6 max-w-xs">มาเติมเต็มด้วยความรักและเสียงร้อง "เมี๊ยว" กันเถอะ</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">🐱 รับน้องเข้าบ้าน</button>
          </div>
        )}

        {/* --- MODE 3: LIVING (มีเรื่องราวแล้ว - Feed) --- */}
        {status === "living" && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800">เรื่องราวล่าสุด</h3>
            {MOCK_MOMENTS.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${m.role === 'pet' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {m.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{m.author}</p>
                    <p className="text-xs text-gray-400">{m.time}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB Button (แสดงเฉพาะโหมด Living) */}
      {status === "living" && (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition">
          <span className="text-2xl">+</span>
        </button>
      )}
    </div>
  );
}
