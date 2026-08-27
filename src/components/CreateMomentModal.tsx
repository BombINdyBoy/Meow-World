"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeId: string; // ID ของบ้านปัจจุบัน
}

export default function CreateMomentModal({ isOpen, onClose, homeId }: CreateMomentModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return alert("ช่วยเขียนเรื่องราวหน่อยนะครับ 🐱");
    
    setIsSubmitting(true);
    try {
      // บันทึกข้อมูลลงตาราง life_journey_events
      const { error } = await supabase.from('life_journey_events').insert({
        home_id: homeId,
        content: content,
        event_type: 'memory',
        author_id: (await supabase.auth.getUser()).data.user?.id, // ใช้ ID ผู้ใช้ที่ล็อกอินอยู่
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // สำเร็จ! ปิด Modal และรีเฟรชหน้า
      onClose();
      router.refresh(); 
      alert("บันทึกความทรงจำเรียบร้อยแล้ว! ❤️");
      
    } catch (error) {
      console.error("Error creating moment:", error);
      alert("เกิดข้อผิดพลาดเล็กน้อย กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">✨ มีเรื่องราวอะไรวันนี้?</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="เล่าเรื่องราววันนี้ให้ฟังหน่อย... เกิดอะไรขึ้น? รู้สึกยังไง?"
            className="w-full h-40 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none text-gray-700 placeholder-gray-400 outline-none transition-all"
            autoFocus
          />
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-600 flex items-center gap-2">
              <span>💡</span> 
              <span>Tip: เขียนเหมือนกำลังเล่าให้เพื่อนฟัง จะได้อารมณ์ที่สุดเลยครับ</span>
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <span>บันทึกความทรงจำ</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}