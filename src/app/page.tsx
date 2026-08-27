"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Member {
  id: string;
  name: string;
  role: "human" | "pet";
  avatar?: string;
}

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeId: string; // ID ของบ้านปัจจุบัน
}

export default function CreateMomentModal({ isOpen, onClose, homeId }: CreateMomentModalProps) {
  const [story, setStory] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"write" | "tag" | "review">("write");

  const supabase = createClient();
  const router = useRouter();

  // โหลดข้อมูลสมาชิกในบ้านเมื่อ Modal เปิด
  useEffect(() => {
    if (isOpen && homeId) {
      loadMembers();
    }
  }, [isOpen, homeId]);

  const loadMembers = async () => {
    // ดึงข้อมูล Pets และ Profiles ที่เชื่อมโยงกับบ้านนี้
    // (จำลองข้อมูลสำหรับตอนนี้ - ต้องเชื่อม API จริงในขั้นตอนต่อไป)
    const mockMembers: Member[] = [
      { id: "1", name: "พ่อ", role: "human" },
      { id: "2", name: "แม่", role: "human" },
      { id: "3", name: "ลูก", role: "human" },
      { id: "4", name: "มูมู่", role: "pet", avatar: "/cat-avatar.png" },
      { id: "5", name: "เจ้าดำ", role: "pet" },
    ];
    setMembers(mockMembers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...newFiles]);
      
      // สร้าง Preview
      const previews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...previews]);
    }
  };

  const toggleMemberTag = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    if (!story.trim() && mediaFiles.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // 1. อัปโหลดไฟล์มีเดีย (ถ้ามี)
      const mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        // จำลองการอัปโหลด - ต้องใช้ Supabase Storage จริง
        for (const file of mediaFiles) {
          // const { data, error } = await supabase.storage.from('moments').upload(...)
          // if (error) throw error;
          mediaUrls.push("dummy-url.jpg"); 
        }
      }

      // 2. บันทึกข้อมูลลงตาราง life_journey_events (หรือ moments)
      const { error } = await supabase.from('life_journey_events').insert({
        home_id: homeId,
        content: story,
        media_urls: mediaUrls,
        participant_ids: selectedMembers, // แท็กคนที่ร่วมเหตุการณ์
        event_type: 'memory',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      // รีเซ็ตและปิด Modal
      resetForm();
      onClose();
      router.refresh(); // รีเฟรชหน้าแรกเพื่อดูโมเมนต์ใหม่
    } catch (error) {
      console.error("Error creating moment:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกความทรงจำ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStory("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setSelectedMembers([]);
    setStep("write");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            {step === "write" && "✨ มีเรื่องราวอะไรวันนี้?"}
            {step === "tag" && "🏷️ ใครอยู่ด้วยกันบ้าง?"}
            {step === "review" && "✅ พร้อมบันทึกแล้ว"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1">
          
          {/* Step 1: เขียนเรื่องราว & อัปโหลดรูป */}
          {step === "write" && (
            <div className="space-y-4">
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="เล่าเรื่องราววันนี้ให้ฟังหน่อย... เกิดอะไรขึ้น? รู้สึกยังไง?"
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none text-gray-700 placeholder-gray-400"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">เพิ่มรูปภาพหรือวิดีโอ</label>
                <div className="flex flex-wrap gap-2">
                  {mediaPreviews.map((src, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={src} alt="preview" fill className="object-cover" />
                      <button 
                        onClick={() => {
                          const newFiles = mediaFiles.filter((_, i) => i !== idx);
                          const newPreviews = mediaPreviews.filter((_, i) => i !== idx);
                          setMediaFiles(newFiles);
                          setMediaPreviews(newPreviews);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span className="text-xs text-gray-400 mt-1">เพิ่ม</span>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: แท็กสมาชิก */}
          {step === "tag" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">เลือกทุกคน (และน้องแมว!) ที่อยู่ในโมเมนต์นี้</p>
              <div className="grid grid-cols-2 gap-3">
                {members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => toggleMemberTag(member.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedMembers.includes(member.id)
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      member.role === 'pet' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {member.avatar ? (
                        <Image src={member.avatar} alt={member.name} width={40} height={40} className="rounded-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role === 'pet' ? '🐱 แมว' : '👤 คน'}</p>
                    </div>
                    {selectedMembers.includes(member.id) && (
                      <div className="ml-auto text-orange-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

           {/* Step 3: Review (Optional - ข้ามได้ถ้าอยากเร็ว) */}
           {step === "review" && (
             <div className="text-center py-8">
               <p className="text-gray-600">พร้อมบันทึกเรื่องราวนี้แล้ว!</p>
               {story && <p className="mt-2 text-sm italic text-gray-500">"{story}"</p>}
               {selectedMembers.length > 0 && <p className="mt-2 text-sm text-gray-500">ร่วมกับ {selectedMembers.length} สมาชิก</p>}
             </div>
           )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-between">
          {step !== "write" ? (
            <button 
              onClick={() => setStep(step === "tag" ? "write" : "tag")}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ย้อนกลับ
            </button>
          ) : (
            <div></div> // Spacer
          )}
          
          {step === "tag" ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || (selectedMembers.length === 0 && !story)}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกความทรงจำ"}
            </button>
          ) : (
            <button 
              onClick={() => setStep(step === "write" ? "tag" : "review")}
              disabled={step === "write" && !story && mediaFiles.length === 0}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              ต่อไป
            </button>
          )}
        </div>
      </div>
    </div>
  );
}