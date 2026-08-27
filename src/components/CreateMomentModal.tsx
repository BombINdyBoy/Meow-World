"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeId: string; // ID ของบ้านปัจจุบัน
  userId: string; // ID ของผู้ใช้ที่ล็อกอิน
  onCreated?: () => void; // Callback เมื่อบันทึกสำเร็จ
}

export default function CreateMomentModal({ isOpen, onClose, homeId, userId, onCreated }: CreateMomentModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // บันทึกข้อมูลลงตาราง life_journey_events
      const { error } = await supabase.from("life_journey_events").insert({
        home_id: homeId,
        author_id: userId,
        content: content,
        event_type: "memory",
        participant_ids: [userId], // แท็กตัวเองเป็นผู้ร่วมเหตุการณ์
      });

      if (error) throw error;      // สำเร็จ! ปิด Modal และรีเฟรชหน้า
      if (onCreated) {
        onCreated();
      } else {
        onClose();
        router.refresh();
      } 
    } catch (err) {
      console.error("Error saving moment:", err);
      alert("เกิดข้อผิดพลาดเล็กน้อย กรุณาลองใหม่อีกครั้งนะ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up sm:animate-scale-in">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">✨ บันทึกความทรงจำ</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Input Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="วันนี้เกิดอะไรขึ้นบ้าง? เล่าให้ฟังหน่อย..."
          className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none text-gray-700 placeholder-gray-400 mb-4"
          autoFocus
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "กำลังบันทึก..." : "บันทึกเลย"}
          </button>
        </div>
      </div>
      
      {/* Styles for animation (ใส่ใน globals.css ก็ได้ แต่ใส่ที่นี่เพื่อให้ก๊อปปี้ไปใช้ได้เลย) */}
      <style jsx>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}